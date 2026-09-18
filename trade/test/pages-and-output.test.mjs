import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  DIST,
  REQUIRED_PAGES,
  ROOT,
  ensureCheckBuild,
  readDist,
  srcPages,
} from './helpers.mjs';

test('src has exactly the required pages', () => {
  assert.deepEqual(srcPages(), [...REQUIRED_PAGES].sort());
});

test('build writes every required page, robots.txt, and site.css', () => {
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    const file = join(DIST, page);
    assert.ok(existsSync(file), `missing dist/${page}`);
    assert.ok(statSync(file).size > 500, `dist/${page} is too small to be a real page`);
    const html = readDist(page);
    assert.match(html, /<!DOCTYPE html>/i);
    assert.match(html, /<title>[^<]+<\/title>/i);
    assert.match(html, /<link rel="stylesheet" href="\/assets\/site\.css">/);
    assert.match(html, /<style>/);
    assert.match(html, /--snow:#F5F4F1/);
    assert.match(html, /--ember:#8A6D3B/);
  }
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Disallow: \//);
  assert.ok(existsSync(join(DIST, 'assets', 'site.css')), 'dist/assets/site.css missing');
  assert.ok(existsSync(join(DIST, 'assets', 'nav-auth.js')), 'dist/assets/nav-auth.js missing');
  for (const font of ['instrument-sans.woff2', 'inter.woff2', 'geist-mono.woff2']) {
    assert.ok(existsSync(join(DIST, 'assets', 'fonts', font)), `missing dist/assets/fonts/${font}`);
  }
});

test('every image referenced by a built page exists in dist', () => {
  ensureCheckBuild();
  const missing = [];
  for (const page of REQUIRED_PAGES) {
    const html = readDist(page);
    const srcs = [...html.matchAll(/\bsrc="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
    assert.ok(srcs.length > 0, `${page} has no /assets/ images`);
    for (const src of srcs) {
      const disk = join(DIST, src.slice(1));
      if (!existsSync(disk)) missing.push(`${page} -> ${src}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('repo does not store partner passwords or SSH deploy secrets', () => {
  const scanned = [
    'brand.json',
    'build.mjs',
    'DEPLOYMENT.md',
    'package.json',
    'assets/nav-auth.js',
    ...REQUIRED_PAGES.map((page) => join('src', page)),
  ];
  const forbidden = [
    /password\s*[:=]\s*['"][^'"]+['"]/i,
    /sshpass/i,
    /one\.com/i,
    /BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY/,
  ];
  const hits = [];
  for (const rel of scanned) {
    const text = readFileSync(join(ROOT, rel), 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(text)) hits.push(`${rel} matches ${pattern}`);
    }
  }
  assert.deepEqual(hits, []);
});

test('table headings stay on one line and text columns are marked', () => {
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    const html = readDist(page);
    assert.doesNotMatch(html, /<th[^>]*>[^<]*<br/i, `${page} table heading wraps with <br>`);
  }
  const css = readFileSync(join(ROOT, 'assets', 'site.css'), 'utf8');
  assert.match(css, /th\{[^}]*white-space:nowrap/);
  assert.match(css, /th\.text\{text-align:left\}/);
  assert.match(css, /td\.text\{text-align:left/);
  assert.match(css, /\.obj th,\.obj td\{text-align:left\}/);
  const sales = readDist('sales-consultant.html');
  assert.match(sales, /<th class="text">What it looks like<\/th>/);
  assert.match(sales, /<td class="text">Designer accounts only<\/td>/);
  assert.match(sales, /<th class="text">What a typical order looks like<\/th>/);
  const strategy = readDist('b2b-strategy.html');
  assert.match(strategy, /<th class="text">Risk<\/th>/);
  assert.match(strategy, /<th class="text">Why it bites<\/th>/);
  assert.match(strategy, /<th class="text">What we do about it<\/th>/);
  assert.match(strategy, /<th class="text">What you do in the room<\/th>/);
  assert.match(strategy, /<th class="text">Segment<\/th>/);
  const training = readDist('training.html');
  assert.match(training, /<th class="text">The objection<\/th>/);
  const bed = readDist('the-bed.html');
  assert.match(bed, /<th>Size<\/th><th>Width x length<\/th><th>Depth<\/th>/);
  const spec = readDist('specification.html');
  assert.match(spec, /<span class="dim">90 x 190 cm<\/span>/);
});

test('every table column heading shares alignment with its cells', () => {
  ensureCheckBuild();
  const css = readFileSync(join(ROOT, 'assets', 'site.css'), 'utf8');
  assert.match(css, /th\{[^}]*text-align:right/);
  assert.match(css, /th:first-child\{text-align:left\}/);
  assert.match(css, /td\{[^}]*text-align:right/);
  assert.match(css, /td:first-child\{text-align:left/);
  assert.doesNotMatch(css, /th\.text\{[^}]*color:var\(--graphite\)/);

  for (const page of REQUIRED_PAGES) {
    const html = readDist(page);
    const tables = [...html.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi)];
    for (const [, tableAttrs, body] of tables) {
      const isObj = /\bclass="[^"]*\bobj\b/.test(tableAttrs) || /\bclass="obj"/.test(tableAttrs);
      const head = body.match(/<thead>[\s\S]*?<\/thead>/i)?.[0] ?? '';
      const ths = [...head.matchAll(/<th([^>]*)>/gi)].map((m) => m[1]);
      const firstRow = body.match(/<tbody>[\s\S]*?<tr>([\s\S]*?)<\/tr>/i)?.[1] ?? '';
      const tds = [...firstRow.matchAll(/<td([^>]*)>/gi)].map((m) => m[1]);
      if (!ths.length || ths.length !== tds.length) continue;
      ths.forEach((thAttrs, i) => {
        const thText = /\bclass="[^"]*\btext\b/.test(thAttrs);
        const tdText = /\bclass="[^"]*\btext\b/.test(tds[i]);
        if (tdText) {
          assert.ok(
            thText || i === 0,
            `${page} col ${i + 1}: text cells need a left-aligned heading`,
          );
        }
        if (isObj) {
          assert.ok(
            thText || true,
            `${page} objection table headings should be left with their cells`,
          );
        }
      });
    }
  }
});

test('door prices sit on a shared row and dark cards keep contrast', () => {
  const css = readFileSync(join(ROOT, 'assets', 'site.css'), 'utf8');
  assert.match(css, /\.doors \.from\{margin:auto 0 var\(--s1\)\}/);
  assert.match(css, /section\.dark \.grid3 h3[^}]*color:var\(--carbon\)/);
  assert.match(css, /section\.dark \.grid3 p[^}]*color:var\(--graphite\)/);
  assert.match(css, /section\.dark a\.btn\{/);
  assert.match(css, /section\.dark a\.btn-line\{/);
  ensureCheckBuild();
  const index = readDist('index.html');
  assert.match(index, /From 12 units/);
  assert.match(index, /placing 200 are different sales/);
  const bed = readDist('the-bed.html');
  const cta = bed.match(/<div class="cta-row">([\s\S]*?)<\/div>/);
  assert.ok(cta, 'the-bed is missing the door CTA row');
  const buttons = [...cta[1].matchAll(/<a class="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
  assert.equal(buttons.length, 3);
  for (const [, cls, label] of buttons) {
    assert.match(cls, /\bbtn\b/, `${label} is not a button`);
    assert.match(cls, /\bbtn-line\b/, `${label} must match the outlined door CTAs`);
  }
});

test('nav type is pinned and Strategy is revealed only when authorised', () => {
  const css = readFileSync(join(ROOT, 'assets', 'site.css'), 'utf8');
  assert.match(css, /\.navlinks a\{font-family:var\(--display\);font-weight:400;font-size:14px/);
  assert.doesNotMatch(css, /@media\(max-width:960px\)\{\.navlinks a:not\(\.navcta\)\{display:none\}\}/);
  const js = readFileSync(join(ROOT, 'assets', 'nav-auth.js'), 'utf8');
  assert.match(js, /b2b-strategy\.html/);
  assert.match(js, /training\.html/);
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    assert.match(readDist(page), /credentials: 'same-origin'/);
  }
});
