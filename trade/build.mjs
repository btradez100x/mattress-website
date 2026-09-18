// Numa trade site build. No dependencies, Node 18+.
//   node build.mjs          build to /dist
//   node build.mjs --check  fail if any token is unresolved or any name is hardcoded
import { readFileSync, writeFileSync, readdirSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const cfg = JSON.parse(readFileSync('brand.json', 'utf8'));
const check = process.argv.includes('--check');

const flat = {};
for (const [group, vals] of Object.entries(cfg)) {
  if (group.startsWith('_')) continue;
  for (const [k, v] of Object.entries(vals)) flat[`${group}.${k}`] = v;
}

const pages = readdirSync('src').filter(f => f.endsWith('.html'));
if (!pages.length) { console.error('No templates in /src'); process.exit(1); }

let errors = 0;
if (existsSync('dist')) rmSync('dist', { recursive: true });
mkdirSync('dist', { recursive: true });

for (const page of pages) {
  let html = readFileSync(join('src', page), 'utf8');

  // Hardcoded name check. Only names, not policy copy: a lead time or a window
  // legitimately appears in a sentence, a brand name never should.
  if (check) {
    for (const [key, val] of Object.entries(flat)) {
      if (!key.startsWith('brand.') && !key.startsWith('service.')) continue;
      if (val.length > 4 && html.includes(val)) {
        console.error(`${page}: hardcoded "${val}" - use {{${key}}}`);
        errors++;
      }
    }
  }

  html = html.replace(/\{\{\s*([a-zA-Z.]+)\s*\}\}/g, (m, key) => {
    if (!(key in flat)) { console.error(`${page}: unknown token {{${key}}}`); errors++; return m; }
    return flat[key];
  });

  const left = html.match(/\{\{[^}]*\}\}/g);
  if (left) { console.error(`${page}: unresolved ${left.join(', ')}`); errors++; }

  // Voice rules that must never ship.
  if (/\bfree\b/i.test(html.replace(/font-family[^;]*/g, ''))) {
    console.error(`${page}: contains the word "free"`); errors++;
  }
  if (html.includes('\u2014')) { console.error(`${page}: contains an em dash`); errors++; }

  writeFileSync(join('dist', page), html);
}

cpSync('assets', join('dist', 'assets'), { recursive: true });
writeFileSync(join('dist', 'robots.txt'), 'User-agent: *\nDisallow: /\n');

if (errors) { console.error(`\n${errors} error(s). Build written but not clean.`); process.exit(1); }
console.log(`Built ${pages.length} pages to /dist as "${cfg.brand.name}".`);
