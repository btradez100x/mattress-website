import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..');
export const SRC = join(ROOT, 'src');
export const DIST = join(ROOT, 'dist');

export const REQUIRED_PAGES = [
  'index.html',
  'modern-slavery.html',
  'sales-consultant.html',
  'b2b-strategy.html',
  'specification.html',
  'retail.html',
  'contract.html',
];

/** DEPLOYMENT.md is the authority. Access is host/CDN, not a password in git. */
export const PAGE_RULES = {
  'index.html': { access: 'open', nav: 'partner', route: '/' },
  'modern-slavery.html': { access: 'open', nav: 'partner', route: '/modern-slavery.html' },
  'sales-consultant.html': { access: 'open', nav: 'internal', route: '/sales-consultant.html' },
  'b2b-strategy.html': { access: 'internal', nav: 'internal', route: '/b2b-strategy.html' },
  'specification.html': { access: 'specification', nav: 'partner', route: '/specification.html' },
  'retail.html': { access: 'retail', nav: 'partner', route: '/retail.html' },
  'contract.html': { access: 'contract', nav: 'partner', route: '/contract.html' },
};

export const PARTNER_NAV_PAGES = Object.entries(PAGE_RULES)
  .filter(([, rule]) => rule.nav === 'partner')
  .map(([file]) => file);

export const INTERNAL_NAV_PAGES = Object.entries(PAGE_RULES)
  .filter(([, rule]) => rule.nav === 'internal')
  .map(([file]) => file);

export const OPEN_PAGES = Object.entries(PAGE_RULES)
  .filter(([, rule]) => rule.access === 'open')
  .map(([file]) => file);

export const GATED_PAGES = Object.entries(PAGE_RULES)
  .filter(([, rule]) => rule.access !== 'open')
  .map(([file]) => file);

export function readBrand() {
  return JSON.parse(readFileSync(join(ROOT, 'brand.json'), 'utf8'));
}

export function flatTokens(cfg = readBrand()) {
  const flat = {};
  for (const [group, vals] of Object.entries(cfg)) {
    if (group.startsWith('_')) continue;
    for (const [k, v] of Object.entries(vals)) {
      if (k.startsWith('_')) continue;
      flat[`${group}.${k}`] = v;
    }
  }
  return flat;
}

export function readSrc(page) {
  return readFileSync(join(SRC, page), 'utf8');
}

export function readDist(page) {
  return readFileSync(join(DIST, page), 'utf8');
}

export function navBlock(html) {
  const match = html.match(/<div class="navlinks">([\s\S]*?)<\/div>/);
  return match ? match[1] : '';
}

export function footerBlock(html) {
  const match = html.match(/<footer\b[\s\S]*<\/footer>/i);
  return match ? match[0] : '';
}

export function srcPages() {
  return readdirSync(SRC).filter((f) => f.endsWith('.html')).sort();
}

export function runBuild(args = ['--check'], cwd = ROOT) {
  return spawnSync(process.execPath, ['build.mjs', ...args], {
    cwd,
    encoding: 'utf8',
  });
}

export function distLooksComplete() {
  return (
    REQUIRED_PAGES.every((page) => existsSync(join(DIST, page))) &&
    existsSync(join(DIST, 'robots.txt')) &&
    existsSync(join(DIST, 'assets', 'site.css'))
  );
}

export function ensureCheckBuild() {
  if (distLooksComplete()) {
    return { status: 0, stdout: 'reused dist\n', stderr: '' };
  }
  const result = runBuild(['--check']);
  if (result.status !== 0) {
    throw new Error(
      `node build.mjs --check failed (exit ${result.status})\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result;
}

export function combinedOutput(result) {
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}
