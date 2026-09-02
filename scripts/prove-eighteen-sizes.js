#!/usr/bin/env node
/**
 * Proof: picker and size guide share one filterCatalogRows function.
 * Market Shown (custom.MarketShown) is the catalog. Ghana (GH) is not a
 * defined market → UK/GB set. UK extras (California King with GB) appear on
 * configure. Blank Market Shown is not all 18. Title-inferred US does not
 * hide UK extras.
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
var catalogIsoLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-catalog-iso.liquid'),
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
var marketLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/snippets/size-variant-market.liquid'),
  'utf8'
);
var baseCss = fs.readFileSync(path.join(root, 'valtora-theme/assets/base.css'), 'utf8');

assert(/custom\.MarketShown/.test(shownLiq), 'shown snippet must read custom.MarketShown');
var shownAssign = shownLiq.split('{%- liquid')[1] || shownLiq;
assert(
  shownAssign.indexOf('custom.MarketShown') !== -1 &&
    shownAssign.indexOf('custom.MarketShown') < shownAssign.indexOf('custom.market_shown'),
  'custom.MarketShown must be read before market_shown aliases'
);
assert(/"MarketShown"/.test(jsonLiq), 'catalog JSON must emit MarketShown');
assert(/MarketShown/.test(themeJs), 'theme.js must read MarketShown');
assert(/definition name: Market Shown/i.test(shownLiq), 'must document Market Shown');
assert(/"shown_defined"/.test(jsonLiq), 'JSON must emit shown_defined');
assert(/"available": true/.test(jsonLiq), 'JSON must mark made-to-order variants available even at inventory 0');
assert(!/v\.available \| json/.test(jsonLiq), 'JSON must not emit Shopify inventory as available');
assert(/render 'size-variant-in-country'/.test(guideLiq), 'size guide SSR must gate tiles with Market Shown');
assert(/render 'size-catalog-iso'/.test(guideLiq), 'size guide must resolve catalog ISO from Market Shown');
assert(/country_iso: catalog_iso/.test(guideLiq), 'size guide must pass the catalog country');
assert(/Ghana|GH/.test(catalogIsoLiq), 'catalog ISO snippet must document Ghana');
assert(!/Always shown/.test(inCountry), 'SSR in-country must not always include every variant');
assert(!/^\s*1\s*$/m.test(inCountry), 'SSR in-country must not hardcode 1');
assert(
  !/v\.available_for_sale or v\.available/.test(inCountry),
  'blank Market Shown must not use available as show-all 18'
);
assert(/shown_up != blank/.test(inCountry), 'SSR must prefer Market Shown when it is set');
assert(/custom\.MarketShown/.test(reserveLiq), 'configure schema must name custom.MarketShown');
assert(/render 'size-picker-tiles'/.test(reserveLiq), 'size-reserve must SSR tiles so JS cannot leave a blank grid');
assert(/SIZE_MAPS\.gb/.test(themeJs) && /ukFallbackCatalogRows/.test(themeJs), 'empty filter must fall back to UK/GB catalog');
assert(/function filterCatalogRows/.test(themeJs), 'shared filterCatalogRows must exist');
assert(/function catalogRowsForPaint/.test(themeJs), 'catalogRowsForPaint must wrap the shared filter with a UK fallback');
assert(/function paintSizeGrid/.test(themeJs), 'paintSizeGrid must exist so an empty filter cannot wipe the picker');
assert(
  /function filterSizesForMarket\(mkt\) \{\s*return catalogRowsForPaint\(allRows, detectCountryIso\(\)\);/.test(
    themeJs
  ),
  'configure picker must paint catalogRowsForPaint (filter + UK fallback)'
);
assert(
  /function rowsForSizeGuide\(market\) \{\s*return catalogRowsForPaint\(readSizePriceRows\(\), detectCountryIso\(\)\);/.test(
    themeJs
  ),
  'size guide JS must use the same catalogRowsForPaint as configure'
);
assert(
  /function catalogRowsFrom\(rows, iso\) \{\s*return filterCatalogRows\(rows, iso\);/.test(themeJs),
  'catalogRowsFrom must be an alias of filterCatalogRows'
);
assert(!/blob contains 'california'/.test(marketLiq), 'must not title-infer California King as US');
assert(!/blob contains 'split king'/.test(marketLiq), 'must not title-infer Split King as US');
assert(
  /pointer-events:\s*auto/.test(baseCss) &&
    /size-option__add[\s\S]*pointer-events:\s*auto/.test(baseCss),
  'ADD must receive pointer events'
);
assert(
  /position:\s*sticky/.test(baseCss) && /\.order-panel \{[\s\S]*position:\s*sticky/.test(baseCss),
  'YOUR ORDER panel must be position:sticky'
);
assert(
  /top:\s*max\(\s*1rem/.test(baseCss),
  'YOUR ORDER sticky top must be max(1rem, header + announcement offset)'
);
var themeLiq = fs.readFileSync(path.join(root, 'valtora-theme/layout/theme.liquid'), 'utf8');
assert(
  /<style id="page-scroll">[\s\S]*body \{\s*overflow-x:\s*visible/.test(themeLiq),
  'page-scroll must not clip overflow-x on body (that kills sticky)'
);
var funnelLiq = fs.readFileSync(
  path.join(root, 'valtora-theme/sections/landing-funnel.liquid'),
  'utf8'
);
assert(
  /\[data-lp-configure\] > aside/.test(baseCss) &&
    /size-reserve__layout/.test(funnelLiq) &&
    /order-panel/.test(funnelLiq),
  'specification size-pick must use size-reserve__layout with a sticky YOUR ORDER aside'
);
assert(
  /Reserve yours/.test(funnelLiq) && !/<p class="section__eyebrow">Configure<\/p>/.test(funnelLiq),
  'landing size-pick kicker must be Reserve yours, never Configure'
);
assert(/function paintOrderBasketFromStore/.test(themeJs), 'landing ADD must paint YOUR ORDER lines');
assert(/overflow-x:\s*visible/.test(baseCss), 'body must not clip overflow-x (that kills sticky)');
assert(/data-size-pick/.test(themeJs) && /size-option__add/.test(themeJs), 'ADD markup must be a data-size-pick control');
assert(/existingQty \+ 1/.test(themeJs), 'ADD click must increment qty');
assert(/var sizes = \[\];/.test(themeJs), 'live picker must not seed from SIZE_MAPS.gb');
assert(
  !/if \(!tokens\.length\) return true/.test(themeJs),
  'blank Market Shown must not return true (that was all 18)'
);
assert(/for v in mattress\.variants/.test(catalogLiq), 'catalog JSON must loop product.variants');

var sizeMaps = themeJs.match(/var SIZE_MAPS = \{[\s\S]*?\n  \};/);
assert(sizeMaps, 'SIZE_MAPS missing');
var europe = themeJs.match(/var EUROPE_ISOS = \{[\s\S]*?\n  \};/);
assert(europe, 'EUROPE_ISOS missing');
var shownStart = themeJs.indexOf('function normalizeShownToken');
var catalogEnd = themeJs.indexOf('function marketToTabKey');
assert(shownStart > 0 && catalogEnd > shownStart, 'cannot extract catalog functions');

var fnSrc =
  sizeMaps[0] +
  '\n' +
  europe[0] +
  '\n' +
  themeJs.slice(shownStart, catalogEnd) +
  '\nmodule.exports = { filterCatalogRows: filterCatalogRows, catalogRowsFrom: catalogRowsFrom, catalogRowsForPaint: catalogRowsForPaint, ukFallbackCatalogRows: ukFallbackCatalogRows, rowMatchesCountry: rowMatchesCountry, rowShownTokens: rowShownTokens, rowShownDefined: rowShownDefined, resolveCatalogIso: resolveCatalogIso };\n';

var tmp = path.join(root, 'scripts/.prove-eighteen-catalog-fns.js');
fs.writeFileSync(tmp, fnSrc);
delete require.cache[require.resolve(tmp)];
var fns = require(tmp);
fs.unlinkSync(tmp);

assert.strictEqual(typeof fns.filterCatalogRows, 'function', 'filterCatalogRows must export');

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
  if (/US Twin|US Full|US Queen|US King/.test(row.label)) {
    row.shown = ['US'];
    row.shown_defined = true;
  } else if (/\(UAE\)/.test(row.label)) {
    row.shown = ['AE'];
    row.shown_defined = true;
  } else if (/AU /.test(row.label)) {
    row.shown = ['AU'];
    row.shown_defined = true;
  } else if (/Split/.test(row.label)) {
    row.shown = ['US'];
    row.shown_defined = true;
  } else {
    row.shown = ['GB'];
    row.shown_defined = true;
  }
});
json[12].shown = ['GB', 'US'];
json[12].shown_defined = true;
json[12].market = 'us';

assert.strictEqual(fns.resolveCatalogIso(json, 'GH'), 'GB', 'Ghana (GH) must resolve to GB');
assert.strictEqual(fns.resolveCatalogIso(json, 'GB'), 'GB', 'GB stays GB');
assert.strictEqual(fns.resolveCatalogIso(json, 'US'), 'US', 'US is a defined market');

var gb = fns.filterCatalogRows(json, 'GB');
var gh = fns.filterCatalogRows(json, 'GH');
var labels = gb.map(function (r) {
  return r.label;
});
var ghLabels = gh.map(function (r) {
  return r.label;
});

assert.deepStrictEqual(ghLabels, labels, 'Ghana catalog must equal the UK/GB Market Shown set');
assert(labels.indexOf('US Twin') === -1, 'US Twin with Market Shown = US must not appear on the UK catalog');
assert(
  labels.indexOf('California King') !== -1,
  'California King with Market Shown including GB must appear on configure and the size guide'
);
assert(labels.indexOf('Single') !== -1, 'classic UK Single must remain');
assert(labels.indexOf('Emperor') !== -1, 'classic UK Emperor must remain');
assert(labels.indexOf('Queen (UAE)') === -1, 'UAE-only Queen must not appear on the UK catalog');
assert(labels.length < json.length, 'UK/Ghana catalog must not be all 18 sizes');
assert.strictEqual(fns.rowMatchesCountry(json[7], 'GB'), false, 'US Twin Market Shown US must not match GB');
assert.strictEqual(fns.rowMatchesCountry(json[12], 'GB'), true, 'California King Market Shown GB must match GB');
assert.strictEqual(
  fns.rowMatchesCountry(json[12], 'GH'),
  false,
  'California King must not match GH directly — GH is not a defined market'
);

var titleInferredExtra = rowFor('California King', 12, {
  market: 'us',
  shown: ['GB', 'US'],
  shown_defined: true,
  markets: ['US'],
});
assert.strictEqual(
  fns.rowMatchesCountry(titleInferredExtra, 'GB'),
  true,
  'title-inferred market us must not hide a UK extra whose Market Shown includes GB'
);

var blankUnpublished = rowFor('US Twin XL', 8, {
  shown: [],
  shown_defined: false,
  markets: [],
  in_market: false,
  available_for_sale: false,
  shopify_available: false,
});
assert.strictEqual(
  fns.rowMatchesCountry(blankUnpublished, 'GB'),
  false,
  'blank Market Shown must not appear on the UK size guide'
);

var blankPublished = rowFor('Small Double', 1, {
  shown: [],
  shown_defined: false,
  markets: [],
  in_market: true,
});
assert.strictEqual(
  fns.rowMatchesCountry(blankPublished, 'GB'),
  false,
  'blank Market Shown must not become all 18 on the size guide'
);

var allBlank = json.map(function (row, i) {
  return rowFor(row.label, i, { shown: [], shown_defined: false, markets: [], in_market: true });
});
assert.strictEqual(
  fns.filterCatalogRows(allBlank, 'GH').length,
  0,
  'blank Market Shown on every variant must not list all 18 for Ghana'
);

var paintedBlank = fns.catalogRowsForPaint(allBlank, 'GH');
assert.strictEqual(paintedBlank.length, 7, 'empty filter must paint 7 classic UK sizes, not a blank grid');
assert(
  paintedBlank.every(function (row) {
    return ['single', 'small-double', 'double', 'king', 'european-king', 'super-king', 'emperor'].indexOf(row.id) !== -1;
  }),
  'UK fallback must be classic SIZE_MAPS.gb ids'
);
assert.strictEqual(
  fns.catalogRowsForPaint([], 'GH').length,
  7,
  'missing JSON must still paint SIZE_MAPS.gb (7 tiles)'
);
assert.strictEqual(
  fns.catalogRowsForPaint(json, 'GH').length,
  gb.length,
  'populated Market Shown catalog still uses the shared filter'
);
var ukPaint = fns.ukFallbackCatalogRows(json);
assert(ukPaint.some(function (r) { return r.label === 'California King'; }), 'UK fallback includes Market Shown GB extras');
assert(ukPaint.some(function (r) { return r.label === 'Single'; }), 'UK fallback includes classic Single');
assert(!ukPaint.some(function (r) { return r.label === 'US Twin'; }), 'UK fallback must not include US Twin');

var guide = fns.catalogRowsForPaint(json, 'GH');
var picker = fns.catalogRowsForPaint(json, 'GH');
assert.deepStrictEqual(
  guide.map(function (r) {
    return r.id;
  }),
  picker.map(function (r) {
    return r.id;
  }),
  'picker and size guide must use the same catalogRowsForPaint catalog'
);


assert.strictEqual(
  fns.rowShownTokens({ MarketShown: ['GB', 'US'], shown: ['US'], market: 'us' }).join(','),
  'GB,US',
  'rowShownTokens must prefer MarketShown over shown / title-inferred market'
);
assert.strictEqual(
  fns.rowShownTokens({ market_shown: ['GB'], shown: [] }).join(','),
  'GB',
  'rowShownTokens must fall back to market_shown alias'
);
assert.strictEqual(
  fns.rowShownTokens({ 'market-shown': 'GB,US' }).join(','),
  'GB,US',
  'rowShownTokens must fall back to market-shown alias'
);
assert.strictEqual(
  fns.rowShownTokens({ Market_Shown: ['GB'] }).join(','),
  'GB',
  'rowShownTokens must fall back to Market_Shown alias'
);
assert.strictEqual(
  fns.rowShownTokens({ shown: ['GB'] }).join(','),
  'GB',
  'rowShownTokens must still accept baked shown[] catalog JSON'
);
assert.strictEqual(
  fns.rowMatchesCountry(
    { label: 'California King', market: 'us', MarketShown: ['GB', 'US'], shown: ['US'] },
    'GB'
  ),
  true,
  'MarketShown GB must show California King even if shown[] and title say US'
);

assert(/custom\.marketshown/.test(shownLiq), 'shown snippet must also read custom.marketshown');
assert(
  shownAssign.indexOf('custom.MarketShown') < shownAssign.indexOf('custom.marketshown') &&
    shownAssign.indexOf('custom.marketshown') < shownAssign.indexOf('custom.market_shown'),
  'custom.MarketShown then marketshown then snake_case fallbacks'
);
assert(/replace: '•'/.test(shownLiq), 'shown snippet must split U+2022 bullet lists');
assert(/replace: '•'/.test(inCountry), 'in-country must tokenize bullet lists');
assert(/SHOWN_SPLIT_RE/.test(themeJs), 'JS tokenizer must split Admin bullet lists');

assert.deepStrictEqual(
  fns.rowShownTokens({ MarketShown: 'GB • US' }),
  ['GB', 'US'],
  'GB • US contains GB and US'
);
assert.deepStrictEqual(
  fns.rowShownTokens({ MarketShown: 'UAE • GB' }),
  ['AE', 'GB'],
  'UAE • GB tokenizes UAE→AE and GB'
);
assert.deepStrictEqual(fns.rowShownTokens({ MarketShown: 'GB' }), ['GB'], 'plain GB matches');
assert.deepStrictEqual(
  fns.rowShownTokens({ MarketShown: 'GB • US • UAE' }),
  ['GB', 'US', 'AE'],
  'three-country Admin list tokenizes to a set'
);
assert.deepStrictEqual(
  fns.rowShownTokens({ MarketShown: '["GB","US"]' }),
  ['GB', 'US'],
  'JSON array string must flatten to tokens'
);
assert.deepStrictEqual(
  fns.rowShownTokens({ MarketShown: 'GB &bull; US' }),
  ['GB', 'US'],
  'HTML entity &bull; must split like a bullet'
);
assert.deepStrictEqual(
  fns.rowShownTokens({ marketshown: 'GB • UAE' }),
  ['GB', 'AE'],
  'custom.marketshown alias must tokenize bullets'
);
assert.strictEqual(
  fns.rowMatchesCountry({ MarketShown: 'GB • US' }, 'GB'),
  true,
  'GB • US contains GB'
);
assert.strictEqual(
  fns.rowMatchesCountry({ MarketShown: 'UAE • GB' }, 'GB'),
  true,
  'UAE • GB contains GB'
);
assert.strictEqual(fns.rowMatchesCountry({ MarketShown: 'GB' }, 'GB'), true, 'GB matches GB');
assert.strictEqual(
  fns.rowMatchesCountry({ MarketShown: 'US' }, 'GB'),
  false,
  'US alone does not match GB'
);
assert.strictEqual(
  fns.rowMatchesCountry({ MarketShown: 'UAE' }, 'AE'),
  true,
  'UAE token must match the AE market'
);
assert.strictEqual(
  fns.rowMatchesCountry({ MarketShown: 'GB • US' }, 'GH'),
  false,
  'GH is not a MarketShown token — catalog ISO maps GH to GB first'
);

var adminShown = {
  Single: 'GB • UAE',
  'Small Double': 'GB • US • UAE',
  Double: 'GB',
  King: 'GB',
  'European King': 'UAE • GB',
  'Super King': 'GB • UAE',
  Emperor: 'GB • UAE',
  'US Twin': 'GB • US',
  'US Twin XL': 'GB • US',
  'US Full': 'GB • US',
  'US Queen': 'GB • US',
  'US King': 'GB • US',
  'California King': 'GB • US',
  'AU Super King': 'GB • UAE'
};

var adminRows = titles.map(function (label, i) {
  var extra = {
    shown: [],
    markets: [],
    available: true
  };
  if (adminShown[label]) {
    extra.MarketShown = adminShown[label];
    extra.shown_defined = true;
  } else {
    extra.MarketShown = '';
    extra.shown_defined = false;
  }
  return rowFor(label, i, extra);
});

var adminGb = fns.catalogRowsForPaint(adminRows, 'GB');
var adminLabels = adminGb.map(function (r) {
  return r.label;
});
var expectedUk = Object.keys(adminShown);
assert(
  adminLabels.length > 7,
  'UK grid with populated MarketShown must exceed classic SIZE_MAPS.gb (7), got ' +
    adminLabels.length
);
assert.strictEqual(
  adminLabels.length,
  expectedUk.length,
  'UK tiles must be every variant whose tokens include GB, not a 7-tile ceiling'
);
expectedUk.forEach(function (label) {
  assert(adminLabels.indexOf(label) !== -1, label + ' has GB in MarketShown and must appear');
});
assert(adminLabels.indexOf('Queen (UAE)') === -1, 'Queen (UAE) without GB must not appear');
assert(adminLabels.indexOf('King (UAE)') === -1, 'King (UAE) without GB must not appear');
assert(adminLabels.indexOf('Super King (UAE)') === -1, 'Super King (UAE) without GB must not appear');
assert(adminLabels.indexOf('Split King (Pair)') === -1, 'Split King (Pair) without GB must not appear');
assert.deepStrictEqual(
  fns.catalogRowsForPaint(adminRows, 'GH').map(function (r) {
    return r.label;
  }),
  adminLabels,
  'Ghana visitor must see the same GB-token catalog as UK'
);
assert.deepStrictEqual(
  fns.filterCatalogRows(adminRows, 'GB').map(function (r) {
    return r.id;
  }),
  fns.catalogRowsForPaint(adminRows, 'GB').map(function (r) {
    return r.id;
  }),
  'size guide and picker share filterCatalogRows when MarketShown is populated'
);

console.log('PROOF GH→GB: ' + fns.resolveCatalogIso(json, 'GH'));
console.log('PROOF UK/GH catalog (' + labels.length + '): ' + labels.join(' | '));
console.log('PROOF UK extra on configure: California King');
console.log('PROOF US Twin excluded: ' + (labels.indexOf('US Twin') === -1));
console.log('PROOF shared function: filterCatalogRows');
console.log('PROOF empty-filter tiles: ' + paintedBlank.length);
console.log('PROOF missing-JSON tiles: ' + fns.catalogRowsForPaint([], 'GB').length);
console.log('PROOF Admin GB • US tokens: ' + fns.rowShownTokens({ MarketShown: 'GB • US' }).join(','));
console.log('PROOF Admin UK tiles (' + adminLabels.length + '): ' + adminLabels.join(' | '));
console.log('ok');
