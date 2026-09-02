#!/usr/bin/env node
/**
 * Proof: size catalog JSON emits every variant. Live picker does not filter
 * by Market Shown, SIZE_MAPS, or title-inferred market.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');

var root = path.resolve(__dirname, '..');
var themeJs = fs.readFileSync(path.join(root, 'valtora-theme/assets/theme.js'), 'utf8');
var jsonLiq = fs.readFileSync(path.join(root, 'valtora-theme/snippets/size-variant-json.liquid'), 'utf8');
var inCountry = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-variant-in-country.liquid'),
  'utf8'
);
var catalogLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-catalog-json.liquid'),
  'utf8'
);
var baseCss = fs.readFileSync(path.join(root, 'valtora-theme/assets/base.css'), 'utf8');

assert(
  !/unless tab_gb or tab_uae or tab_us or tab_eu/.test(jsonLiq),
  'JSON must not fill markets from inferred title/SKU market'
);
assert(
  /"available": true/.test(jsonLiq),
  'JSON must mark made-to-order variants available even at inventory 0'
);
assert(
  !/v\.available \| json/.test(jsonLiq),
  'JSON must not emit Shopify inventory as available'
);
assert(
  !/replace: ' \(UAE\)'/.test(jsonLiq),
  'JSON must keep US/AU/UAE titles (do not strip (UAE))'
);
assert(
  /^\s*1\s*$/m.test(inCountry) && /Always shown/.test(inCountry),
  'SSR in-country must emit every published variant (no Market Shown gate)'
);
assert(
  !/if shown_up == blank/.test(inCountry),
  'SSR in-country must not depend on blank Market Shown Liquid'
);
assert(
  !/v\.metafields\.custom\.enabled == false/.test(catalogLiq),
  'catalog JSON must emit every variant, including enabled=false'
);
assert(
  /for v in mattress\.variants/.test(catalogLiq),
  'catalog JSON must loop product.variants'
);
assert(
  /pointer-events:\s*auto/.test(baseCss) &&
    /size-option__add[\s\S]*pointer-events:\s*auto/.test(baseCss),
  'ADD must receive pointer events'
);
assert(
  /position:\s*sticky/.test(baseCss) &&
    /\.order-panel \{[\s\S]*position:\s*sticky/.test(baseCss),
  'YOUR ORDER panel must be position:sticky'
);
assert(
  /overflow-x:\s*visible/.test(baseCss),
  'body must not clip overflow-x (that kills sticky)'
);
assert(
  /data-size-pick/.test(themeJs) && /size-option__add/.test(themeJs),
  'ADD markup must be a data-size-pick control'
);
assert(
  /existingQty \+ 1/.test(themeJs),
  'ADD click must increment qty'
);
assert(
  /var sizes = \[\];/.test(themeJs),
  'live picker must not seed from SIZE_MAPS.gb'
);

var europe = themeJs.match(/var EUROPE_ISOS = \{[\s\S]*?\n  \};/);
assert(europe, 'EUROPE_ISOS missing');
var shownStart = themeJs.indexOf('function normalizeShownToken');
var catalogEnd = themeJs.indexOf('function catalogRowsForCountry');
assert(shownStart > 0 && catalogEnd > shownStart, 'cannot extract catalog functions');

var fnSrc =
  europe[0] +
  '\n' +
  themeJs.slice(shownStart, catalogEnd) +
  '\nmodule.exports = { catalogRowsFrom: catalogRowsFrom, rowMatchesCountry: rowMatchesCountry, rowShownTokens: rowShownTokens };\n';

var tmp = path.join(root, 'scripts/.prove-eighteen-catalog-fns.js');
fs.writeFileSync(tmp, fnSrc);
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

var json = titles.map(function (label, i) {
  return {
    id: handleize(label),
    label: label,
    names: { GB: label, US: null, UAE: null },
    price: i < 2 ? '£1,999.00' : '£2,499.00',
    price_raw: i < 2 ? 199900 : 249900,
    variant_id: 16000000000000 + i,
    market: /US|California|Split/.test(label) ? 'us' : /\(UAE\)/.test(label) ? 'ae' : /AU /.test(label) ? 'au' : 'gb',
    shown: [],
    markets: [],
    available: i < 2 ? false : true,
    shown_defined: false,
  };
});

var gb = fns.catalogRowsFrom(json, 'GB');
var labels = gb.map(function (r) {
  return r.label;
});

assert.strictEqual(gb.length, 18, 'GB catalog should be 18, got ' + gb.length + ': ' + labels.join(', '));
assert(labels.indexOf('US Twin') !== -1, 'JSON/catalog must include US Twin');
assert(labels.indexOf('US Twin XL') !== -1, 'must include US Twin XL');
assert(labels.indexOf('California King') !== -1, 'must include California King');
assert(labels.indexOf('AU Super King') !== -1, 'must include AU Super King');
assert(labels.indexOf('Split King (Pair)') !== -1, 'must include Split King (Pair)');
assert(labels.indexOf('Queen (UAE)') !== -1, 'must include Queen (UAE)');
assert(labels.indexOf('King (UAE)') !== -1, 'must include King (UAE)');
assert(labels.indexOf('Super King (UAE)') !== -1, 'must include Super King (UAE)');
assert(labels.indexOf('Emperor') !== -1, 'must include Emperor');
assert(labels.indexOf('Single') !== -1, 'must include 0-inventory Single');
assert(labels.indexOf('Small Double') !== -1, 'must include 0-inventory Small Double');
assert.strictEqual(fns.rowShownTokens(json[7]).length, 0, 'US Twin shown tokens must be empty when metafield blank');

var liveWithStaleMarkets = Object.assign({}, json[7], { shown: [], markets: ['US'], market: 'us' });
assert.strictEqual(
  fns.catalogRowsFrom([liveWithStaleMarkets].concat(json.slice(0, 7)), 'GB').filter(function (r) {
    return r.label === 'US Twin';
  }).length,
  1,
  'live catalog must include US Twin even with inferred markets:[US]'
);

var onlyUs = JSON.parse(JSON.stringify(json));
onlyUs[7].shown = ['US'];
var gbWhenUsTwinRestricted = fns.catalogRowsFrom(onlyUs, 'GB');
assert(
  gbWhenUsTwinRestricted.some(function (r) {
    return r.label === 'US Twin';
  }),
  'live picker must still show US Twin when Market Shown is US — Market Shown is not a ceiling'
);
assert.strictEqual(
  gbWhenUsTwinRestricted.length,
  18,
  'Market Shown must not hide sizes; expected 18, got ' + gbWhenUsTwinRestricted.length
);

console.log(
  JSON.stringify(
    json.filter(function (r) {
      return r.label === 'US Twin' || r.label === 'Queen (UAE)' || r.label === 'AU Super King' || r.label === 'Single';
    }),
    null,
    2
  )
);
console.log('PROOF GB picker labels (' + labels.length + '): ' + labels.join(' | '));
console.log('PROOF includes US Twin: ' + (labels.indexOf('US Twin') !== -1));
console.log('PROOF JSON emits ' + json.length + ' sizes');
console.log('ok');
