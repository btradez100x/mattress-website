import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  REQUIRED_PAGES,
  ensureCheckBuild,
  flatTokens,
  readDist,
  readSrc,
} from './helpers.mjs';

test('templates do not hardcode brand or service names', () => {
  const tokens = flatTokens();
  const leaks = [];
  for (const page of REQUIRED_PAGES) {
    const html = readSrc(page);
    for (const [key, val] of Object.entries(tokens)) {
      if (!key.startsWith('brand.') && !key.startsWith('service.')) continue;
      if (typeof val !== 'string' || val.length <= 4) continue;
      if (html.includes(val)) leaks.push(`${page}: ${val} ({{${key}}})`);
    }
  }
  assert.deepEqual(leaks, []);
});

test('built pages resolve tokens and do not leak mustache leftovers', () => {
  ensureCheckBuild();
  const tokens = flatTokens();
  for (const page of REQUIRED_PAGES) {
    const html = readDist(page);
    assert.doesNotMatch(html, /\{\{[^}]*\}\}/, `${page} still has {{tokens}}`);
    assert.match(html, new RegExp(escapeRegExp(tokens['brand.name'])));
    assert.match(html, new RegExp(escapeRegExp(tokens['brand.legal'])));
  }
});

test('held stock lead time never appears on a page', () => {
  ensureCheckBuild();
  const stock = flatTokens()['lead.stockFuture'];
  assert.ok(stock, 'lead.stockFuture must exist in brand.json');
  const hits = [];
  for (const page of REQUIRED_PAGES) {
    if (readSrc(page).includes('lead.stockFuture') || readSrc(page).includes(stock)) {
      hits.push(`src/${page}`);
    }
    if (readDist(page).includes(stock)) hits.push(`dist/${page}`);
  }
  assert.deepEqual(hits, []);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
