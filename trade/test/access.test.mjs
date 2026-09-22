import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  GATED_PAGES,
  INTERNAL_NAV_PAGES,
  OPEN_PAGES,
  PAGE_RULES,
  PARTNER_NAV_PAGES,
  REQUIRED_PAGES,
  ROOT,
  ensureCheckBuild,
  footerBlock,
  navBlock,
  readDist,
} from './helpers.mjs';

test('DEPLOYMENT.md still lists every page and its access group', () => {
  const doc = readFileSync(join(ROOT, 'DEPLOYMENT.md'), 'utf8');
  const expected = {
    'index.html': 'Open',
    'the-bed.html': 'Open',
    'modern-slavery.html': 'Open',
    'agents.html': 'Open',
    'b2b-strategy.html': 'Internal',
    'training.html': 'Internal',
    'specification.html': 'Specification partners',
    'retail.html': 'Retail partners',
    'contract.html': 'Contract buyers',
  };
  for (const [file, access] of Object.entries(expected)) {
    assert.match(doc, new RegExp(`\`${file}\``), `DEPLOYMENT.md dropped ${file}`);
    const row = doc.split('\n').find((line) => line.includes(`\`${file}\``));
    assert.ok(row, `no table row for ${file}`);
    assert.match(row, new RegExp(access), `${file} access should be ${access}`);
  }
  assert.deepEqual(OPEN_PAGES.sort(), [
    'agents.html',
    'index.html',
    'modern-slavery.html',
    'the-bed.html',
  ]);
  assert.deepEqual(GATED_PAGES.sort(), [
    'b2b-strategy.html',
    'contract.html',
    'retail.html',
    'specification.html',
    'training.html',
  ]);
});

test('partner-facing HTML omits Strategy and Training; internal HTML includes both', () => {
  ensureCheckBuild();
  for (const page of PARTNER_NAV_PAGES) {
    const nav = navBlock(readDist(page));
    assert.ok(nav, `${page} has no nav`);
    assert.doesNotMatch(nav, /b2b-strategy\.html/, `${page} partner nav links Strategy`);
    assert.doesNotMatch(nav, />Strategy</, `${page} partner nav shows Strategy`);
    assert.doesNotMatch(nav, /training\.html/, `${page} partner nav links Training`);
    assert.doesNotMatch(nav, />Training</, `${page} partner nav shows Training`);
    assert.doesNotMatch(nav, /modern-slavery\.html/, `${page} put modern slavery in the nav`);
    assert.match(nav, /the-bed\.html/, `${page} should link The bed`);
    assert.match(nav, /specification\.html/);
    assert.match(nav, /retail\.html/);
    assert.match(nav, /contract\.html/);
    assert.match(nav, /agents\.html/);
    assert.match(nav, />Agents</, `${page} nav should say Agents`);
    assert.match(nav, />How it works</, `${page} nav should say How it works`);
    assert.doesNotMatch(nav, />Trade</, `${page} nav still says Trade`);
  }
  for (const page of INTERNAL_NAV_PAGES) {
    const nav = navBlock(readDist(page));
    assert.match(nav, /b2b-strategy\.html/, `${page} must carry Strategy in the nav`);
    assert.match(nav, />Strategy</);
    assert.match(nav, /training\.html/, `${page} must carry Training in the nav`);
    assert.match(nav, />Training</);
  }
});

test('landing nav is How it works, not Trade', () => {
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    const nav = navBlock(readDist(page));
    assert.match(nav, />How it works</, `${page} nav should say How it works`);
    assert.doesNotMatch(nav, />Trade</, `${page} nav still says Trade`);
    assert.match(nav, /href="\/"/);
  }
});

test('modern slavery is in every footer and never in the nav', () => {
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    const html = readDist(page);
    assert.match(footerBlock(html), /modern-slavery\.html/);
    assert.doesNotMatch(navBlock(html), /modern-slavery\.html/);
  }
});

test('every page is noindex and robots disallow the host', () => {
  ensureCheckBuild();
  for (const page of REQUIRED_PAGES) {
    assert.match(readDist(page), /name="robots" content="noindex,nofollow"/);
  }
});

test('encoded access map matches DEPLOYMENT routes', () => {
  assert.equal(PAGE_RULES['index.html'].route, '/');
  assert.equal(PAGE_RULES['b2b-strategy.html'].access, 'internal');
  assert.equal(PAGE_RULES['agents.html'].access, 'open');
  assert.equal(PAGE_RULES['agents.html'].nav, 'partner');
  assert.equal(PAGE_RULES['training.html'].access, 'internal');
  assert.equal(PAGE_RULES['the-bed.html'].access, 'open');
});
