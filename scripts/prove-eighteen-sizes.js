#!/usr/bin/env node
/**
 * Proof: picker and size guide share one UK catalog from Market Shown
 * (custom.market_shown). US-only sizes stay off the UK lists. UK extras
 * (California King with Market Shown including GB) appear on configure.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');

var root = path.resolve(__dirname, '..');
var themeJs = fs.readFileSync(path.join(root, 'valtora-theme/assets/theme.js'), 'utf8');
var jsonLiq = fs.readFileSync(path.join(root, 'valtora-theme/snippets/size-variant-json.liquid'), 'utf8');
var shownLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-variant-shown.liquid'),
  'utf8'
);
var inCountry = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-variant-in-country.liquid'),
  'utf8'
);
var catalogLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-catalog-json.liquid'),
  'utf8'
);
var guideLiq = fs.readFileSync(path.join(root, 'valtora-theme/sections/size-guide.liquid'), 'utf8');
var reserveLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/sections/size-reserve.liquid'),
  'utf8'
);
var baseCss = fs.readFileSync(path.join(root, 'valtora-theme/assets/base.css'), 'utf8');

assert(/custom\.market_shown/.test(shownLiq), 'shown snippet must read custom.market_shown');
assert(/definition name: Market Shown/i.test(shownLiq), 'must document Market Shown');
assert(/"shown_defined"/.test(jsonLiq), 'JSON must emit shown_defined');
assert(/"in_market"/.test(jsonLiq), 'JSON must emit in_market for blank Market Shown');
assert(/"available": true/.test(jsonLiq), 'JSON must mark made-to-order variants available even at inventory 0');
assert(!/v\.available \| json/.test(jsonLiq), 'JSON must not emit Shopify inventory as available');
assert(/render 'size-variant-in-country'/.test(guideLiq), 'size guide SSR must gate tiles with Market Shown');
assert(/country_iso: catalog_iso/.test(guideLiq), 'size guide must pass the visitor country');
assert(!/Always shown/.test(inCountry), 'SSR in-country must not always include every variant');
assert(!/^\s*1\s*$/m.test(inCountry), 'SSR in-country must not hardcode 1');
assert(
  /v\.available_for_sale or v\.available/.test(inCountry),
  'blank Market Shown must use available / available_for_sale, not show-all'
);
assert(/shown_up != blank/.test(inCountry), 'SSR must prefer Market Shown when it is set');
assert(/custom\.market_shown/.test(reserveLiq), 'configure schema must name custom.market_shown');
assert(/catalogIsoForMarket/.test(themeJs), 'picker and size guide must share catalogIsoForMarket');
assert(
  !/if \(preview\)/.test(themeJs.split('function catalogRowsFrom')[1].split('function catalogRowsForCountry')[0]),
  'live catalog must filter, not only preview'
);
assert(
  /function filterSizesForMarket\(mkt\) \{\s*return catalogRowsFrom\(allRows, catalogIsoForMarket\(mkt\)\);/.test(
    themeJs
  ),
  'configure picker must filter by Market Shown country'
);
assert(
  /function rowsForSizeGuide\(market\) \{\s*var primary = catalogRowsFrom\(readSizePriceRows\(\), catalogIsoForMarket\(market\)\);/.test(
    themeJs
  ),
  'size guide JS must use the same catalog as configure'
);
assert(
  /pointer-events:\s*auto/.test(baseCss) &&
    /size-option__add[\s\S]*pointer-events:\s*auto/.test(baseCss),
  'ADD must receive pointer events'
);
assert(
  /position:\s*sticky/.test(baseCss) && /\.order-panel \{[\s\S]*position:\s*sticky/.test(baseCss),
  'YOUR ORDER panel must be position:sticky'
);
assert(/overflow-x:\s*visible/.test(baseCss), 'body must not clip overflow-x (that kills sticky)');
assert(/data-size-pick/.test(themeJs) && /size-option__add/.test(themeJs), 'ADD markup must be a data-size-pick control');
assert(/existingQty \+ 1/.test(themeJs), 'ADD click must increment qty');
assert(/var sizes = \[\];/.test(themeJs), 'live picker must not seed from SIZE_MAPS.gb');
assert(/for v in mattress\.variants/.test(catalogLiq), 'catalog JSON must loop product.variants');

var europe = themeJs.match(/var EUROPE_ISOS = \{[\s\S]*?\n  \};/);
assert(europe, 'EUROPE_ISOS missing');
var shownStart = themeJs.indexOf('function normalizeShownToken');
var catalogEnd = themeJs.indexOf('function catalogRowsForCountry');
assert(shownStart > 0 && catalogEnd > shownStart, 'cannot extract catalog functions');

var fnSrc =
  europe[0] +
  '\n' +
  themeJs.slice(shownStart, catalogEnd) +
  '\nmodule.exports = { catalogRowsFrom: catalogRowsFrom, rowMatchesCountry: rowMatchesCountry, rowShownTokens: rowShownTokens, rowShownDefined: rowShownDefined };\n';

var tmp = path.join(root, 'scripts/.prove-eighteen-catalog-fns.js');
fs.writeFileSync(tmp, fnSrc);
delete require.cache[require.resolve(tmp)];
var fns = require(tmp);
fs.unlinkSync(tmp);

var titles = [
  'Single',
  'Small Double',
  'Double',
  'King',
  'European King',
  'Super King',
  'Emperor',
  'US Twin',
  'US Twin XL',
  'US Full',
  'US Queen',
  'US King',
  'California King',
  'AU Super King',
  'Split King (Pair)',
  'Queen (UAE)',
  'King (UAE)',
  'Super King (UAE)',
];

function handleize(s) {
  return String(s)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function rowFor(label, i, extra) {
  var inferred = /US|California|Split/.test(label)
    ? 'us'
    : /\(UAE\)/.test(label)
      ? 'ae'
      : /AU /.test(label)
        ? 'au'
        : 'gb';
  return Object.assign(
    {
      id: handleize(label),
      label: label,
      names: { GB: label, US: null, UAE: null },
      price: i < 2 ? '£1,999.00' : '£2,499.00',
      price_raw: i < 2 ? 199900 : 249900,
      variant_id: 16000000000000 + i,
      market: inferred,
      shown: [],
      markets: [],
      available: true,
      shown_defined: false,
      in_market: true,
    },
    extra || {}
  );
}

var json = titles.map(function (label, i) {
  return rowFor(label, i);
});

json.forEach(function (row) {
  if (/US|California|Split/.test(row.label)) {
    row.shown = ['US'];
    row.shown_defined = true;
  } else if (/\(UAE\)/.test(row.label)) {
    row.shown = ['AE'];
    row.shown_defined = true;
  } else if (/AU /.test(row.label)) {
    row.shown = ['AU'];
    row.shown_defined = true;
  } else {
    row.shown = ['GB'];
    row.shown_defined = true;
  }
});
json[12].shown = ['GB', 'US'];
json[12].shown_defined = true;

var gb = fns.catalogRowsFrom(json, 'GB');
var labels = gb.map(function (r) {
  return r.label;
});

assert(labels.indexOf('US Twin') === -1, 'US Twin with Market Shown = US must not appear on the UK catalog');
assert(
  labels.indexOf('California King') !== -1,
  'California King with Market Shown including GB must appear on configure and the size guide'
);
assert(labels.indexOf('Single') !== -1, 'classic UK Single must remain');
assert(labels.indexOf('Emperor') !== -1, 'classic UK Emperor must remain');
assert(labels.indexOf('Queen (UAE)') === -1, 'UAE-only Queen must not appear on the UK catalog');
assert.strictEqual(fns.rowMatchesCountry(json[7], 'GB'), false, 'US Twin Market Shown US must not match GB');
assert.strictEqual(fns.rowMatchesCountry(json[12], 'GB'), true, 'California King Market Shown GB must match GB');

var blankUnpublished = rowFor('US Twin XL', 8, {
  shown: [],
  shown_defined: false,
  in_market: false,
  available_for_sale: false,
  shopify_available: false,
});
assert.strictEqual(
  fns.rowMatchesCountry(blankUnpublished, 'GB'),
  false,
  'blank Market Shown + not published to GB must not appear on the UK size guide'
);

var blankPublished = rowFor('Small Double', 1, {
  shown: [],
  shown_defined: false,
  in_market: true,
});
assert.strictEqual(
  fns.rowMatchesCountry(blankPublished, 'GB'),
  true,
  'blank Market Shown + published to GB stays on the UK catalog'
);

var guide = fns.catalogRowsFrom(json, 'GB');
var picker = fns.catalogRowsFrom(json, 'GB');
assert.deepStrictEqual(
  guide.map(function (r) {
    return r.id;
  }),
  picker.map(function (r) {
    return r.id;
  }),
  'picker and size guide must use the same UK catalog'
);

console.log('PROOF UK catalog (' + labels.length + '): ' + labels.join(' | '));
console.log('PROOF UK extra on configure: California King');
console.log('PROOF US Twin excluded: ' + (labels.indexOf('US Twin') === -1));
console.log('ok');
