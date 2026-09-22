import assert from 'node:assert/strict';
import { test } from 'node:test';
import { REQUIRED_PAGES, readDist, readSrc } from './helpers.mjs';
import { ensureCheckBuild } from './helpers.mjs';

test('body copy spells quantities; tables and prices keep digits', () => {
  ensureCheckBuild();
  const index = readSrc('index.html');
  assert.match(index, /placing one bed/);
  assert.match(index, /placing two hundred/);
  assert.match(index, /From 12 units/);
  const spec = readDist('specification.html');
  assert.match(spec, /£1,999/);
  assert.match(spec, /<span class="dim">90 x 190 cm<\/span>/);
  for (const page of REQUIRED_PAGES) {
    assert.doesNotMatch(readSrc(page), /\u2014/, `${page} has an em dash`);
  }
});
