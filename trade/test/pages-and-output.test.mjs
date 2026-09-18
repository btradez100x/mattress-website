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

test('src has exactly the seven required pages', () => {
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
