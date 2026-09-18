import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { REQUIRED_PAGES, ROOT, readSrc } from './helpers.mjs';

/** Cardinals Ben wants as digits. Pronoun "one" is allowlisted below. */
const SPELLED = new RegExp(
  String.raw`\b(?:` +
    [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
      'hundred',
      'thousand',
    ].join('|') +
    String.raw`)\b`,
  'gi',
);

const ALLOW = [
  /\bone-off\b/gi,
  /\bthree-quarter\b/gi,
  /\bwhich one you\b/gi,
  /\bwhich one applies\b/gi,
  /\bpublishes one because\b/gi,
  /\bzero one\b/gi,
  /\bthis one describes\b/gi,
  /\bthis one is built\b/gi,
  /\bthis one is slept\b/gi,
  /\bproduce one\b/gi,
  /\bunknown one\b/gi,
  /\blumpy one after\b/gi,
  /\bthe one real lever\b/gi,
  /\bis one a buyer\b/gi,
  /\bhit one that\b/gi,
];

function hitsIn(html) {
  let masked = html;
  for (const pattern of ALLOW) masked = masked.replace(pattern, ' ');
  return [...masked.matchAll(SPELLED)].map((m) => m[0]);
}

test('templates do not spell out numbers in body copy', () => {
  const leaks = [];
  for (const page of REQUIRED_PAGES) {
    for (const word of hitsIn(readSrc(page))) {
      leaks.push(`${page}: "${word}"`);
    }
  }
  assert.deepEqual(leaks, []);
});

test('spelled-out quantity in a template is a regression', () => {
  const dir = mkdtempSync(join(tmpdir(), 'onni-numerals-'));
  try {
    mkdirSync(join(dir, 'src'), { recursive: true });
    cpSync(join(ROOT, 'src'), join(dir, 'src'), { recursive: true });
    const page = join(dir, 'src', 'index.html');
    const html = readFileSync(page, 'utf8');
    writeFileSync(page, html.replace('From 12 units', 'From twelve units'));
    const found = hitsIn(readFileSync(page, 'utf8'));
    assert.ok(found.some((word) => word.toLowerCase() === 'twelve'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
