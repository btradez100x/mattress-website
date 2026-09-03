#!/usr/bin/env node
/**
 * Proof: Numa paid-test tracking contract is in the theme.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var vm = require('vm');

var root = path.resolve(__dirname, '..');
var theme = path.join(root, 'valtora-theme');
var js = fs.readFileSync(path.join(theme, 'assets/theme.js'), 'utf8');
var utm = fs.readFileSync(path.join(theme, 'assets/utm-persistence.js'), 'utf8');
var layout = fs.readFileSync(path.join(theme, 'layout/theme.liquid'), 'utf8');
var funnel = fs.readFileSync(path.join(theme, 'sections/landing-funnel.liquid'), 'utf8');
var cart = fs.readFileSync(path.join(theme, 'sections/main-cart.liquid'), 'utf8');
var checkout = fs.readFileSync(path.join(theme, 'sections/main-checkout.liquid'), 'utf8');
var orderBuilder = fs.readFileSync(path.join(theme, 'snippets/order-builder.liquid'), 'utf8');
var consentDef = fs.readFileSync(path.join(theme, 'snippets/consent-defaults.liquid'), 'utf8');
var indexJson = fs.readFileSync(path.join(theme, 'templates/index.json'), 'utf8');
var css = fs.readFileSync(path.join(theme, 'assets/base.css'), 'utf8');

function must(cond, msg) {
  assert(cond, msg);
}

must(/function captureLpVariantOnce/.test(js), 'captureLpVariantOnce');
must(/numa_lp_variant/.test(js), 'sessionStorage key numa_lp_variant');
must(/numa_session_id/.test(js), 'sessionStorage key numa_session_id');
must(/payload\.session_id/.test(js), 'every vTrack event gets session_id');
must(/transport_type/.test(js) && /beacon/.test(js), 'sendBeacon transport_type');
must(/vTrack\('lp_view'/.test(js) && !/vTrackOnce\('lp_view'/.test(js), 'lp_view per load');
must(/page_path/.test(js), 'lp_view page_path');
must(/vTrackOnce\('configure_start'/.test(js), 'configure_start once per session');
must(/function trackConfigureComplete/.test(js), 'configure_complete per distinct size');
must(/vTrack\('add_to_basket'/.test(js) && /currency: detectCurrencyCode/.test(js), 'add_to_basket + currency');
must(/trial_eligible/.test(js), 'add_to_basket trial_eligible');
must(/vTrack\('add_service'/.test(js) && /old_mattress_removal/.test(js), 'add_service');
must(/function fireBasketViewIfLeadTime/.test(js), 'basket_view waits for lead time');
must(/vTrack\('begin_checkout'/.test(js), 'begin_checkout');
must(/vTrack\('purchase'/.test(js) && /transaction_id/.test(js), 'purchase + transaction_id');
must(/scroll_depth/.test(js) && /percent: p/.test(js), 'scroll_depth percent');
must(/vTrackOnce\('scroll_past_price'/.test(js), 'scroll_past_price');
must(/vTrackOnce\('engaged_session'/.test(js), 'engaged_session');
must(/fromUrl \|\| fromUtm \|\| fromAdGroup \|\| fromDom \|\| 'direct'/.test(js), 'lp_variant fallback chain');
must(/orderAttrs[\s\S]*lp_variant: readLpVariant/.test(js), 'checkout writes lp_variant order attribute');
must(/function attributionProperties/.test(js) && /_lp_variant/.test(js), 'line-item _lp_variant');
must(/delete payload\.email/.test(js), 'events strip personal data');
must(/id="price-anchor"/.test(funnel) && /id="price-anchor"/.test(orderBuilder), 'price-anchor in liquid');
must(/consent-defaults/.test(layout) && /consent-update/.test(layout), 'consent in theme.liquid');
must(/analytics_storage/.test(consentDef) && /ad_storage/.test(consentDef), 'consent mode defaults');
must(/data-recycling-link/.test(cart), 'recycling link on cart');
must(/location\.replace/.test(checkout), 'pages/checkout redirects to cart');
must(/attrs\.lp_variant/.test(utm), 'utm-persistence writes lp_variant cart attr');
must(/overflow-y:\s*auto !important/.test(layout), 'page scroll stays unlocked');
must(!/journal-home/.test(indexJson), 'Journal not on homepage');
must(/\.size-row \{/.test(css), '.size-row not emptied');
must(/gtm_container_id/.test(layout) && /googletagmanager.com\/gtm.js/.test(layout), 'GTM stays settings-gated');
must(/initNumaTracking\(\);/.test(js), 'boot calls initNumaTracking');

var store = {};
var sandbox = {
  window: {},
  document: {
    querySelector: function () { return null; },
    body: { getAttribute: function () { return 'gb'; } },
    documentElement: { getAttribute: function () { return 'gb'; } }
  },
  location: { search: '?lp_variant=test-a&gclid=abc', pathname: '/pages/cooling' },
  sessionStorage: {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = String(v); }
  },
  URLSearchParams: URLSearchParams,
  crypto: { randomUUID: function () { return '11111111-1111-4111-8111-111111111111'; } }
};
sandbox.window = sandbox;
sandbox.window.ValtoraUTM = { get: function () { return {}; } };
vm.createContext(sandbox);

var start = js.indexOf('  var NUMA_LP_KEY');
var end = js.indexOf('  function vTrack(name, params)');
assert(start >= 0 && end > start, 'extract capture helpers');
vm.runInContext(js.slice(start, end), sandbox);

var first = sandbox.captureLpVariantOnce();
assert.strictEqual(first, 'test-a', 'URL lp_variant wins');
assert.strictEqual(store.numa_lp_variant, 'test-a');
assert.strictEqual(store.numa_gclid, 'abc');
sandbox.location.search = '?lp_variant=page-b';
assert.strictEqual(sandbox.captureLpVariantOnce(), 'test-a', 'B7: later URL must not overwrite first touch');

store = {};
sandbox.location.search = '?utm_content=from-adgroup';
assert.strictEqual(sandbox.captureLpVariantOnce(), 'from-adgroup', 'utm_content when no lp_variant');

store = {};
sandbox.location.search = '';
assert.strictEqual(sandbox.captureLpVariantOnce(), 'direct', 'direct when neither param nor utm');

var sid1 = sandbox.ensureSessionId();
var sid2 = sandbox.ensureSessionId();
assert.strictEqual(sid1, sid2, 'session_id generated once');
assert(sid1.length > 8, 'session_id is a UUID-like string');

console.log('PASS  Numa tracking contract + first-touch chain');
