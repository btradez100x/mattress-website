import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROOT, combinedOutput, runBuild } from './helpers.mjs';

function fixtureCopy() {
  const dir = mkdtempSync(join(tmpdir(), 'onni-trade-'));
  mkdirSync(join(dir, 'src'), { recursive: true });
  mkdirSync(join(dir, 'assets'), { recursive: true });
  writeFileSync(join(dir, 'assets', '.keep'), '');
  cpSync(join(ROOT, 'brand.json'), join(dir, 'brand.json'));
  cpSync(join(ROOT, 'build.mjs'), join(dir, 'build.mjs'));
  cpSync(join(ROOT, 'src'), join(dir, 'src'), { recursive: true });
  return dir;
}

test('node build.mjs --check stays green', () => {
  const result = runBuild(['--check']);
  assert.equal(result.status, 0, combinedOutput(result));
  assert.match(result.stdout, /Built 7 pages/);
});

test('--check fails when a brand name is hardcoded in a template', () => {
  const dir = fixtureCopy();
  try {
    const page = join(dir, 'src', 'index.html');
    const html = readFileSync(page, 'utf8');
    writeFileSync(page, html.replaceAll('{{brand.name}}', 'Onni London'));
    const result = runBuild(['--check'], dir);
    assert.notEqual(result.status, 0);
    assert.match(combinedOutput(result), /hardcoded "Onni London"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('--check fails on an unknown token', () => {
  const dir = fixtureCopy();
  try {
    const page = join(dir, 'src', 'index.html');
    const html = readFileSync(page, 'utf8');
    writeFileSync(page, html.replace('{{brand.name}}', '{{brand.doesNotExist}}'));
    const result = runBuild(['--check'], dir);
    assert.notEqual(result.status, 0);
    assert.match(combinedOutput(result), /unknown token \{\{brand\.doesNotExist\}\}/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
