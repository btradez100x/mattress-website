/**
 * UTM first-touch persistence (Spec S8.3)
 * Captures utm_* + gclid/fbclid on landing, stores in localStorage + cookie,
 * writes to cart attributes so they land on the deposit/order record,
 * and pushes into dataLayer for GTM.
 */
(function () {
  var KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
  ];
  var STORAGE_KEY = 'valtora_utm_first_touch';
  var EXTRA_ATTRS_KEY = 'valtora_cart_attrs_extra';
  var COOKIE_DAYS = 90;

  function getParams() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var hasAny = false;
    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) {
        found[k] = v;
        hasAny = true;
      }
    });
    return hasAny ? found : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      ';expires=' +
      d.toUTCString() +
      ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function readStored() {
    try {
      var raw =
        (function () {
          try {
            return sessionStorage.getItem(STORAGE_KEY);
          } catch (e) {
            return null;
          }
        })() ||
        localStorage.getItem(STORAGE_KEY) ||
        getCookie(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStored(data) {
    var json = JSON.stringify(data);
    try {
      sessionStorage.setItem(STORAGE_KEY, json);
    } catch (e0) {}
    try {
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {}
    setCookie(STORAGE_KEY, json, COOKIE_DAYS);
  }

  function pushDataLayer(utm) {
    if (!utm) return;
    window.dataLayer = window.dataLayer || [];
    var payload = { event: 'utm_first_touch' };
    KEYS.forEach(function (k) {
      if (utm[k]) payload[k] = utm[k];
    });
    window.dataLayer.push(payload);
  }

  function ensureFirstTouch() {
    var existing = readStored();
    var fresh = getParams();
    if (existing) {
      if (fresh) {
        writeStored(existing);
      }
      return existing;
    }
    if (fresh) {
      fresh._captured_at = new Date().toISOString();
      fresh._landing_path = window.location.pathname;
      writeStored(fresh);
      pushDataLayer(fresh);
      return fresh;
    }
    return null;
  }

  function applyToHref(href) {
    var utm = readStored() || ensureFirstTouch();
    if (!utm || !href) return href;
    var raw = String(href);
    if (
      raw.charAt(0) === '#' ||
      raw.indexOf('mailto:') === 0 ||
      raw.indexOf('tel:') === 0 ||
      raw.indexOf('javascript:') === 0
    ) {
      return raw;
    }
    try {
      var url = new URL(raw, window.location.href);
      if (url.origin !== window.location.origin) return raw;
      KEYS.forEach(function (k) {
        if (utm[k] && !url.searchParams.get(k)) url.searchParams.set(k, utm[k]);
      });
      return url.pathname + url.search + url.hash;
    } catch (e) {
      return raw;
    }
  }

  function decorateLinks() {
    var utm = readStored() || ensureFirstTouch();
    if (!utm) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var next = applyToHref(href);
      if (next && next !== href) a.setAttribute('href', next);
    });
  }

  function readExtraAttrs() {
    try {
      var raw = localStorage.getItem(EXTRA_ATTRS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeExtraAttrs(attrs) {
    try {
      localStorage.setItem(EXTRA_ATTRS_KEY, JSON.stringify(attrs || {}));
    } catch (e) {}
  }

  /**
   * Persist a cart attribute (e.g. exit_intent_reason) and sync to Shopify cart.
   */
  function setAttribute(key, value) {
    if (!key) return;
    var extra = readExtraAttrs();
    if (value == null || value === '') delete extra[key];
    else extra[key] = String(value);
    writeExtraAttrs(extra);
    syncViaUpdateJs();
  }

  function toCartAttributes(utm) {
    var attrs = {};
    if (utm) {
      KEYS.forEach(function (k) {
        if (utm[k]) attrs[k] = utm[k];
      });
    }
    var extra = readExtraAttrs();
    Object.keys(extra).forEach(function (k) {
      if (extra[k] != null && extra[k] !== '') attrs[k] = String(extra[k]);
    });
    return attrs;
  }

  /**
   * Merge UTM attrs into a cart/add payload or FormData.
   */
  function applyToCartPayload(payload) {
    var utm = ensureFirstTouch();
    var attrs = toCartAttributes(utm);
    if (!Object.keys(attrs).length) return payload;

    if (payload instanceof FormData) {
      Object.keys(attrs).forEach(function (k) {
        if (!payload.has('attributes[' + k + ']')) {
          payload.append('attributes[' + k + ']', attrs[k]);
        }
      });
      return payload;
    }

    payload = payload || {};
    payload.attributes = Object.assign({}, attrs, payload.attributes || {});
    return payload;
  }

  /**
   * PATCH cart attributes via /cart/update.js (for deposit apps that don't use our form).
   */
  function syncCartAttributes() {
    var attrs = toCartAttributes(ensureFirstTouch());
    if (!Object.keys(attrs).length) return Promise.resolve(null);

    return fetch((window.ValtoraTheme && window.ValtoraTheme.routes.cart) || '/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ attributes: attrs }),
    }).catch(function () {
      return null;
    });
  }

  // Shopify cart/update.js endpoint
  function syncViaUpdateJs() {
    var attrs = toCartAttributes(ensureFirstTouch());
    if (!Object.keys(attrs).length) return Promise.resolve(null);

    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ attributes: attrs }),
    }).catch(function () {
      return null;
    });
  }

  var utm = ensureFirstTouch();
  if (utm) {
    // Re-expose stored first-touch to GTM on later pages (without overwriting).
    pushDataLayer(utm);
  }

  window.ValtoraUTM = {
    get: readStored,
    ensure: ensureFirstTouch,
    applyToCartPayload: applyToCartPayload,
    applyToHref: applyToHref,
    decorateLinks: decorateLinks,
    syncCartAttributes: syncViaUpdateJs,
    setAttribute: setAttribute,
    keys: KEYS,
  };

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(decorateLinks);

  // Keep cart attributes warm on load (UTM and/or prior extras such as exit intent)
  if (utm || Object.keys(readExtraAttrs()).length) {
    onReady(function () {
      syncViaUpdateJs();
    });
  }
})();
