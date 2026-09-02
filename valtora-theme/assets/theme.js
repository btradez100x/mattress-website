/**
 * Valtora theme behaviours - size reserve, FAQ, motion, market sizing.
 */
(function () {
  'use strict';

  var SIZE_MAPS = {
    ae: [
      { id: 'single', label: 'Single', dims: '90-100 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'queen', label: 'Queen', dims: '160 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'king', label: 'King', dims: '180 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'super-king', label: 'Super King', dims: '200 × 200 cm', firmness: 'Medium / Medium firm' },
    ],
    gb: [
      { id: 'single', label: 'Single', dims: '90 × 190 cm', firmness: 'Medium / Medium firm' },
      { id: 'small-double', label: 'Small Double', dims: '120 × 190 cm', firmness: 'Medium / Medium firm' },
      { id: 'double', label: 'Double', dims: '135 × 190 cm', firmness: 'Medium / Medium firm' },
      { id: 'king', label: 'King', dims: '150 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'european-king', label: 'European King', dims: '160 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'super-king', label: 'Super King', dims: '180 × 200 cm', firmness: 'Medium / Medium firm' },
      { id: 'emperor', label: 'Emperor', dims: '200 × 200 cm', firmness: 'Medium / Medium firm' },
    ],
    us: [
      { id: 'twin', label: 'Twin', dims: '99 × 191 cm', firmness: 'Medium / Medium firm' },
      { id: 'twin-xl', label: 'Twin XL', dims: '91 × 213 cm', firmness: 'Medium / Medium firm' },
      { id: 'full', label: 'Full', dims: '137 × 191 cm', firmness: 'Medium / Medium firm' },
      { id: 'queen', label: 'Queen', dims: '152 × 203 cm', firmness: 'Medium / Medium firm' },
      { id: 'us-king', label: 'King', dims: '193 × 203 cm', firmness: 'Medium / Medium firm' },
      { id: 'california-king', label: 'California King', dims: '183 × 213 cm', firmness: 'Medium / Medium firm' },
      { id: 'split-king', label: 'Split King', dims: '2 × 106 × 213 cm', firmness: 'Medium / Medium firm' },
    ],
    eu: [
      { id: 'european-king', label: 'European King', dims: '160 × 200 cm', firmness: 'Medium / Medium firm' },
    ],
  };
  var SIZE_MARKETS = { ae: 1, gb: 1, eu: 1, us: 1 };
  var EUROPE_ISOS = {
    AT: 1, BE: 1, BG: 1, HR: 1, CY: 1, CZ: 1, DK: 1, EE: 1, FI: 1, FR: 1, DE: 1,
    GR: 1, HU: 1, IE: 1, IT: 1, LV: 1, LT: 1, LU: 1, MT: 1, NL: 1, PL: 1, PT: 1,
    RO: 1, SK: 1, SI: 1, ES: 1, SE: 1, AL: 1, IS: 1, LI: 1, NO: 1, CH: 1, MK: 1,
    ME: 1, RS: 1, BA: 1, XK: 1, MD: 1, UA: 1, BY: 1
  };

  function isSizeMarket(m) {
    return !!(m && SIZE_MARKETS[m]);
  }

  function countryToSizeMarket(code) {
    var c = String(code || '').toUpperCase();
    if (c === 'GB' || c === 'UK') return 'gb';
    if (c === 'AE') return 'ae';
    if (c === 'US') return 'us';
    if (EUROPE_ISOS[c]) return 'eu';
    // Unlisted (AU, NZ, JP, blank, …) is not a storefront market — UK.
    return '';
  }

  var DEFAULT_TAGLINE = 'A better bed, for life.';
  var SHARE_DESC_GB =
    'A better bed, for life. Change the firmness yourself. Replace the layer that wears, not the whole mattress. Made to order.';
  var SHARE_DESC_AE =
    'Engineered for the Gulf · [Brand]. A better bed, for life. Refresh the comfort layer - do not replace the whole mattress.';
  var PHONE_DIAL = {
    gb: '+44',
    ae: '+971',
    us: '+1',
    gh: '+233',
    ng: '+234'
  };
  var EUROPE_DIAL = {
    AT: '+43', BE: '+32', BG: '+359', HR: '+385', CY: '+357', CZ: '+420',
    DK: '+45', EE: '+372', FI: '+358', FR: '+33', DE: '+49', GR: '+30',
    HU: '+36', IE: '+353', IT: '+39', LV: '+371', LT: '+370', LU: '+352',
    MT: '+356', NL: '+31', PL: '+48', PT: '+351', RO: '+40', SK: '+421',
    SI: '+386', ES: '+34', SE: '+46', AL: '+355', IS: '+354', LI: '+423',
    NO: '+47', CH: '+41', MK: '+389', ME: '+382', RS: '+381', BA: '+387',
    XK: '+383', MD: '+373', UA: '+380', BY: '+375'
  };
  var TAGLINE_MARKETS = { ae: 1, gb: 1, us: 1, eu: 1, gh: 1, ng: 1 };

  function detectMarket() {
    // Preview chrome only: honour the designer market picker / in-progress basket.
    // Live shoppers never pick a country tab — Shopify localization is the source.
    try {
      var previewPort = location.port === '5173' || location.port === '5190';
      var saved = localStorage.getItem('valtoraPreviewMarket');
      if (previewPort && isSizeMarket(saved)) return saved;
      var basketRaw =
        sessionStorage.getItem('valtora_order_lines') ||
        localStorage.getItem('valtora_order_lines');
      if (previewPort && basketRaw) {
        var basket = JSON.parse(basketRaw);
        var first = basket && basket.lines && basket.lines[0];
        if (first && isSizeMarket(first.market)) return first.market;
      }
    } catch (e) {}

    var theme = window.ValtoraTheme || {};
    var countryAttr =
      theme.countryIso ||
      (document.documentElement && document.documentElement.getAttribute('data-country')) ||
      (window.Shopify && window.Shopify.country) ||
      '';
    var fromCountry = countryToSizeMarket(countryAttr);
    if (isSizeMarket(fromCountry)) return fromCountry;

    var resolved =
      theme.market ||
      (document.documentElement && document.documentElement.getAttribute('data-market'));
    if (isSizeMarket(resolved)) return resolved;

    var meta = document.querySelector('meta[name="valtora-market"]');
    if (meta && isSizeMarket(meta.content)) return meta.content;

    if (isSizeMarket(theme.defaultMarket)) return theme.defaultMarket;
    return 'gb';
  }

  function detectTaglineMarket() {
    try {
      var saved = localStorage.getItem('valtoraPreviewTaglineMarket');
      if (saved && TAGLINE_MARKETS[saved]) return saved;
      var legacy = localStorage.getItem('valtoraPreviewMarket');
      if (legacy && TAGLINE_MARKETS[legacy]) return legacy;
    } catch (e) {}
    var attr =
      (document.documentElement && document.documentElement.getAttribute('data-tagline-market')) ||
      (document.documentElement && document.documentElement.getAttribute('data-market'));
    if (attr && TAGLINE_MARKETS[attr]) return attr;
    return detectMarket();
  }

  function readPreviewTaglineMap() {
    var map = {
      default: DEFAULT_TAGLINE,
      ae: DEFAULT_TAGLINE,
      gb: DEFAULT_TAGLINE,
      us: DEFAULT_TAGLINE,
      eu: DEFAULT_TAGLINE,
      gh: DEFAULT_TAGLINE,
      ng: DEFAULT_TAGLINE,
    };
    try {
      var raw = localStorage.getItem('valtoraPreviewTaglines');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.keys(map).forEach(function (k) {
            if (typeof parsed[k] === 'string' && parsed[k].trim()) map[k] = parsed[k].trim();
          });
        }
      }
    } catch (e) {}
    return map;
  }

  function resolvePreviewTagline(key) {
    key = key && TAGLINE_MARKETS[key] ? key : detectTaglineMarket();
    var map = readPreviewTaglineMap();
    var text = (map[key] || '').trim();
    if (!text) text = (map.default || '').trim();
    if (!text) text = (map.gb || '').trim();
    if (!text) {
      try {
        text = (localStorage.getItem('valtoraPreviewTagline') || '').trim();
      } catch (e) {}
    }
    return text || DEFAULT_TAGLINE;
  }

  function applyPreviewTagline(key) {
    var text = resolvePreviewTagline(key);
    document.querySelectorAll('[data-brand-tagline]').forEach(function (el) {
      el.textContent = text;
    });
    try {
      localStorage.setItem('valtoraPreviewTagline', text);
    } catch (e) {}
    if (typeof paintContactHours === 'function') paintContactHours();
    return text;
  }

  function savePreviewTagline(key, text) {
    key = key && TAGLINE_MARKETS[key] ? key : 'default';
    text = (text || '').trim() || DEFAULT_TAGLINE;
    var map = readPreviewTaglineMap();
    map[key] = text;
    try {
      localStorage.setItem('valtoraPreviewTaglines', JSON.stringify(map));
      localStorage.setItem('valtoraPreviewTagline', text);
    } catch (e) {}
    return text;
  }

  window.__valtoraResolvePreviewTagline = resolvePreviewTagline;
  window.__valtoraApplyPreviewTagline = applyPreviewTagline;
  window.__valtoraSavePreviewTagline = savePreviewTagline;

  var EUROPE_HOUR_ISOS = EUROPE_ISOS;
  var HOURS_IANA = {
    gb: 'Europe/London',
    ae: 'Asia/Dubai',
    us: 'America/New_York',
    eu: 'Europe/Berlin',
    gh: 'Africa/Accra',
    ng: 'Africa/Lagos'
  };
  var HOURS_FALLBACK = {
    gb: 'GMT',
    ae: 'GST',
    us: 'EST',
    eu: 'CET',
    gh: 'GMT',
    ng: 'WAT'
  };
  var DEFAULT_CONTACT_HOURS = '9:00-17:00';
  var TZ_ABBREV = {
    'Europe/London': { std: 'GMT', dst: 'BST' },
    'Europe/Berlin': { std: 'CET', dst: 'CEST' },
    'America/New_York': { std: 'EST', dst: 'EDT' },
    'America/Chicago': { std: 'CST', dst: 'CDT' },
    'America/Denver': { std: 'MST', dst: 'MDT' },
    'America/Los_Angeles': { std: 'PST', dst: 'PDT' },
    'Asia/Dubai': { std: 'GST', dst: 'GST' },
    'Africa/Accra': { std: 'GMT', dst: 'GMT' },
    'Africa/Lagos': { std: 'WAT', dst: 'WAT' }
  };

  function countryToHoursMarket(code) {
    var c = String(code || '').toUpperCase();
    if (c === 'GB' || c === 'UK') return 'gb';
    if (c === 'AE') return 'ae';
    if (c === 'US') return 'us';
    if (c === 'GH') return 'gh';
    if (c === 'NG') return 'ng';
    if (EUROPE_HOUR_ISOS[c]) return 'eu';
    return '';
  }

  function detectHoursMarket() {
    var tagged = document.querySelector('[data-business-hours][data-hours-market]');
    if (tagged) {
      var marked = tagged.getAttribute('data-hours-market');
      if (marked && (HOURS_IANA[marked] || marked === 'default')) return marked;
    }
    var country =
      (document.documentElement && document.documentElement.getAttribute('data-country')) ||
      (window.Shopify && window.Shopify.country) ||
      '';
    var fromCountry = countryToHoursMarket(country);
    if (fromCountry) return fromCountry;
    var market = detectMarket();
    if (market && HOURS_IANA[market]) return market;
    if (typeof detectTaglineMarket === 'function') {
      var taglineKey = detectTaglineMarket();
      if (taglineKey && HOURS_IANA[taglineKey]) return taglineKey;
    }
    return 'ae';
  }

  function zoneOffsetMs(iana, date) {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: iana,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date);
    var map = {};
    var i;
    for (i = 0; i < parts.length; i++) map[parts[i].type] = parts[i].value;
    return Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second) - date.getTime();
  }

  function zoneIsDst(iana) {
    try {
      var y = new Date().getFullYear();
      return zoneOffsetMs(iana, new Date()) !== zoneOffsetMs(iana, new Date(Date.UTC(y, 0, 1)));
    } catch (e) {
      return false;
    }
  }

  function shortTimeZoneName(iana, fallback) {
    iana = iana || '';
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: iana,
        timeZoneName: 'short'
      }).formatToParts(new Date());
      var name = '';
      var i;
      for (i = 0; i < parts.length; i++) {
        if (parts[i].type === 'timeZoneName') name = parts[i].value;
      }
      if (name && !/^(GMT|UTC)[+-]/.test(name) && name !== 'UTC') return name;
    } catch (e) {}
    var row = TZ_ABBREV[iana];
    if (row) return zoneIsDst(iana) ? row.dst : row.std;
    return fallback || '';
  }

  function paintContactHours() {
    var nodes = document.querySelectorAll('[data-business-hours]');
    if (!nodes.length) return;
    var market = detectHoursMarket();
    nodes.forEach(function (el) {
      var hours = (el.getAttribute('data-hours') || '').trim();
      if (!hours) hours = DEFAULT_CONTACT_HOURS;
      var iana = (el.getAttribute('data-tz-iana') || '').trim() || HOURS_IANA[market] || HOURS_IANA.ae;
      var fallback = (el.getAttribute('data-tz-fallback') || '').trim() || HOURS_FALLBACK[market] || '';
      var tz = shortTimeZoneName(iana, fallback);
      var tzEl = el.querySelector('[data-hours-tz]');
      if (tzEl) {
        tzEl.textContent = tz;
        var node = el.firstChild;
        if (node && node.nodeType === 3) {
          node.textContent = hours + (tz ? ' ' : '');
        }
      } else {
        el.textContent = hours + (tz ? ' ' + tz : '');
      }
    });
  }

  window.__valtoraPaintContactHours = paintContactHours;

  function readLpVariant() {
    var fromDom = document.querySelector('[data-lp-variant]');
    var fromNuma = window.NUMA && window.NUMA.lp_variant;
    var stored = '';
    try {
      stored = sessionStorage.getItem('valtora_lp_variant') || '';
    } catch (e) {}
    var v = (fromDom && fromDom.getAttribute('data-lp-variant')) || fromNuma || stored || '';
    v = String(v || '').trim();
    if (v) {
      try {
        sessionStorage.setItem('valtora_lp_variant', v);
      } catch (err) {}
      window.NUMA = window.NUMA || {};
      window.NUMA.lp_variant = v;
    }
    return v;
  }

  function vTrack(name, params) {
    params = params || {};
    var body = document.body;
    var market =
      params.market ||
      (body && body.getAttribute('data-market')) ||
      document.documentElement.getAttribute('data-market') ||
      detectMarket();
    var paymentMode =
      params.payment_mode ||
      (body && body.getAttribute('data-payment-mode')) ||
      (document.querySelector('[data-size-reserve]') &&
        document.querySelector('[data-size-reserve]').getAttribute('data-payment-mode')) ||
      'full';
    var payload = Object.assign(
      {
        event: name,
        market: market,
        payment_mode: paymentMode,
      },
      params
    );
    var lp = readLpVariant();
    if (lp && payload.lp_variant == null) payload.lp_variant = lp;
    var utm =
      (window.ValtoraUTM && window.ValtoraUTM.get && window.ValtoraUTM.get()) || {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(
      function (k) {
        if (utm[k] && payload[k] == null) payload[k] = utm[k];
      }
    );
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    // Legacy direct SDKs only when GTM is not present (no double-count).
    if (!window.google_tag_manager) {
      try {
        if (typeof gtag === 'function') gtag('event', name, payload);
        if (typeof fbq === 'function') fbq('trackCustom', name, payload);
        if (typeof ttq !== 'undefined' && ttq.track) ttq.track(name, payload);
      } catch (err) {}
    }
    if (window.ValtoraTheme && window.ValtoraTheme.debugTrack) {
      console.info('[vTrack]', name, payload);
    }
  }
  window.vTrack = vTrack;

  function vTrackOnce(name, params) {
    var key = 'vt_' + name;
    if (sessionFlag(key)) return;
    setSessionFlag(key);
    vTrack(name, params);
  }
  window.vTrackOnce = vTrackOnce;

  function parseLayerPriceCents() {
    var raw = parseInt(document.documentElement.getAttribute('data-layer-price-raw'), 10);
    if (raw > 0) return raw;
    var label =
      document.documentElement.getAttribute('data-layer-price') ||
      (document.querySelector('[data-lp-layer]') &&
        document.querySelector('[data-lp-layer]').getAttribute('data-lp-layer')) ||
      '';
    var digits = String(label).replace(/[^\d]/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10) * 100;
  }

  function readSizePriceRows() {
    var el = document.querySelector('[data-size-price-config]');
    if (!el) return [];
    try {
      var parsed = JSON.parse(el.textContent.trim());
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function shopifyCartAddUrl() {
    if (/\.html($|\?)/.test(location.pathname || '')) return '';
    var url =
      (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.cartAdd) || '';
    if (!url || url === '#') return '/cart/add.js';
    return url;
  }

  function shopifyCartJsUrl() {
    if (/\.html($|\?)/.test(location.pathname || '')) return '';
    var url =
      (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.cart) || '';
    if (!url || url === '#') return '/cart.js';
    if (/\.js($|\?)/.test(url)) return url;
    return String(url).replace(/\/?$/, '') + '.js';
  }

  function shopifyCartChangeUrl() {
    if (/\.html($|\?)/.test(location.pathname || '')) return '';
    var url =
      (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.cartChange) || '';
    if (url && url !== '#') {
      if (/\.js($|\?)/.test(url)) return url;
      return String(url).replace(/\/?$/, '') + '.js';
    }
    var addUrl = shopifyCartAddUrl();
    if (!addUrl) return '';
    if (/add\.js/.test(addUrl)) return addUrl.replace(/add\.js/, 'change.js');
    if (/\/add\/?$/.test(addUrl)) return addUrl.replace(/\/add\/?$/, '/change.js');
    return '/cart/change.js';
  }

  function shopifyPostJson(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (!res.ok) throw new Error('add-failed');
      return res.json();
    });
  }

  function sizeRowForId(id, market) {
    var mkt = market || detectMarket();
    return rowsForMarket(mkt).filter(function (row) {
      return row.id === id;
    })[0];
  }

  function detectCountryIso() {
    var iso =
      (window.ValtoraTheme && window.ValtoraTheme.countryIso) ||
      (document.documentElement && document.documentElement.getAttribute('data-country')) ||
      (window.Shopify && window.Shopify.country) ||
      '';
    iso = String(iso || '').trim().toUpperCase();
    if (iso === 'UK') iso = 'GB';
    if (iso) return iso;
    var market = detectMarket();
    if (market === 'ae') return 'AE';
    if (market === 'us') return 'US';
    if (market === 'eu') return 'EU';
    return 'GB';
  }

  function normalizeShownToken(token) {
    var s = String(token || '').trim().toUpperCase().replace(/[_-]+/g, ' ');
    if (!s) return '';
    if (
      s === 'UK' ||
      s === 'GBR' ||
      s === 'UNITED KINGDOM' ||
      s === 'GREAT BRITAIN'
    ) {
      return 'GB';
    }
    if (s === 'UAE' || s === 'ARE' || s === 'UNITED ARAB EMIRATES') return 'AE';
    if (s === 'USA' || s === 'UNITED STATES' || s === 'UNITED STATES OF AMERICA') return 'US';
    if (s === 'EUROPE' || s === 'EEA' || s === 'EU') return 'EU';
    s = s.replace(/[^A-Z0-9]/g, '');
    if (s === 'UK' || s === 'GBR') return 'GB';
    if (s === 'UAE' || s === 'ARE') return 'AE';
    if (s === 'USA') return 'US';
    if (s === 'EUROPE' || s === 'EEA') return 'EU';
    return s;
  }

  function catalogIsoForMarket(market, fallbackIso) {
    var iso = normalizeShownToken(fallbackIso || detectCountryIso()) || 'GB';
    var m = String(market || '').toLowerCase();
    if (m === 'ae') return 'AE';
    if (m === 'us') return 'US';
    if (m === 'eu') return iso && EUROPE_ISOS[iso] ? iso : 'EU';
    if (m === 'gb' || m === 'uk') return 'GB';
    return iso || 'GB';
  }

  function rowShownDefined(row) {
    if (!row) return false;
    if (row.shown_defined === true) return true;
    if (row.shown_defined === false) return false;
    if (Array.isArray(row.shown) && row.shown.length) return true;
    if (Array.isArray(row.shown_countries) && row.shown_countries.length) return true;
    if (!Array.isArray(row.shown) && !Array.isArray(row.shown_countries) && row.markets && row.markets.length) {
      return true;
    }
    return false;
  }

  function rowShownTokens(row) {
    if (!row) return [];
    var raw = [];
    if (row.shown && row.shown.length) raw = raw.concat(row.shown);
    if (row.shown_countries && row.shown_countries.length) raw = raw.concat(row.shown_countries);
    if (!Array.isArray(row.shown) && !Array.isArray(row.shown_countries) && row.markets && row.markets.length) {
      raw = raw.concat(row.markets);
    }
    var seen = {};
    var out = [];
    raw.forEach(function (t) {
      var n = normalizeShownToken(t);
      if (!n || seen[n]) return;
      seen[n] = true;
      out.push(n);
    });
    return out;
  }

  function countryMatchesToken(iso, token) {
    var c = normalizeShownToken(iso);
    var t = normalizeShownToken(token);
    if (!c || !t) return false;
    if (c === t) return true;
    if (t === 'EU' && EUROPE_ISOS[c]) return true;
    return false;
  }

  function rowMatchesCountry(row, iso) {
    var country = normalizeShownToken(iso) || 'GB';
    if (rowShownDefined(row)) {
      var tokens = rowShownTokens(row);
      var i;
      for (i = 0; i < tokens.length; i++) {
        if (countryMatchesToken(country, tokens[i])) return true;
      }
      return false;
    }
    if (row && row.in_market === false) return false;
    if (row && row.available_for_sale === false && row.shopify_available === false) return false;
    return true;
  }

  function catalogRowsFrom(rows, iso) {
    rows = rows || [];
    var country = normalizeShownToken(iso || detectCountryIso()) || 'GB';
    var matched = rows.filter(function (row) {
      return rowMatchesCountry(row, country);
    });
    if (!matched.length && country !== 'GB') {
      matched = rows.filter(function (row) {
        return rowMatchesCountry(row, 'GB');
      });
    }
    var seen = {};
    return matched.filter(function (row) {
      if (!row) return false;
      var vid = row.variant_id || row.variantId;
      var key = vid
        ? 'v:' + String(vid)
        : 'i:' + String(row.id || row.label || '').toLowerCase();
      if (!key || key === 'v:' || key === 'i:' || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function catalogRowsForCountry(iso) {
    return catalogRowsFrom(readSizePriceRows(), iso);
  }

  var MARKET_TABS = [
    { key: 'GB', code: 'gb', label: 'United Kingdom' },
    { key: 'UAE', code: 'ae', label: 'United Arab Emirates' },
    { key: 'US', code: 'us', label: 'United States' },
    { key: 'EU', code: 'eu', label: 'Europe' },
  ];

  function marketToTabKey(code) {
    var m = String(code || '').toLowerCase();
    if (m === 'gb' || m === 'uk') return 'GB';
    if (m === 'ae' || m === 'uae') return 'UAE';
    if (m === 'us') return 'US';
    if (m === 'eu') return 'EU';
    var u = String(code || '').toUpperCase();
    if (u === 'GB' || u === 'UAE' || u === 'US' || u === 'EU') return u;
    return 'GB';
  }

  function tabKeyToMarket(tab) {
    var t = String(tab || '').toUpperCase();
    if (t === 'GB') return 'gb';
    if (t === 'UAE') return 'ae';
    if (t === 'US') return 'us';
    if (t === 'EU') return 'eu';
    return detectMarket();
  }

  function rowMarkets(row) {
    if (!row) return [];
    if (row.markets && row.markets.length) {
      return row.markets.map(function (x) { return marketToTabKey(x); }).filter(Boolean);
    }
    if (row.market) return [marketToTabKey(row.market)];
    return [];
  }

  function rowBelongsToMarket(row, market) {
    if (!row) return false;
    var m = String(market || '').toLowerCase();
    var iso = detectCountryIso();
    if (m === 'ae') iso = 'AE';
    else if (m === 'us') iso = 'US';
    else if (m === 'eu') iso = iso && EUROPE_ISOS[iso] ? iso : 'EU';
    else if (m === 'gb' || m === 'uk') iso = 'GB';
    else if (!iso) iso = 'GB';
    return rowMatchesCountry(row, iso);
  }

  function rowShownInTab(row, tabKey) {
    return rowBelongsToMarket(row, tabKeyToMarket(tabKey));
  }

  function rowDisplayName(row, tabKey) {
    var names = (row && row.names) || {};
    var key = tabKey || 'GB';
    return names[key] || names.GB || names.UAE || names.US || (row && row.label) || '';
  }

  function rowDimsText(row) {
    if (!row) return '';
    var w = parseInt(row.width_cm, 10);
    var l = parseInt(row.length_cm, 10);
    var p = parseInt(row.pieces, 10) || 1;
    if (w && l) {
      return p > 1 ? p + ' \u00d7 ' + w + ' \u00d7 ' + l + ' cm' : w + ' \u00d7 ' + l + ' cm';
    }
    return row.dims || '';
  }

  function persistSelectorMarket(tabKey) {
    try {
      sessionStorage.setItem('lp_variant_market', tabKey);
    } catch (e) {}
  }

  function readSelectorMarket() {
    return marketToTabKey(detectMarket());
  }

  function tabsPresentInRows(rows) {
    var seen = {};
    (rows || []).forEach(function (row) {
      rowMarkets(row).forEach(function (k) {
        seen[k] = true;
      });
    });
    return MARKET_TABS.filter(function (t) {
      return seen[t.key];
    });
  }

  function readSizeNote(root) {
    var el = (root && root.querySelector('[data-size-note]')) || document.querySelector('[data-size-note]');
    return el && el.value ? String(el.value).trim() : '';
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function rowHasPickerPrice(row) {
    if (!row) return false;
    var raw = Number(row.price_raw != null ? row.price_raw : row.priceRaw);
    if (raw > 0) return true;
    return !!(row.price && String(row.price).replace(/[^\d]/g, ''));
  }

  function rowsForMarket(market) {
    return catalogRowsFrom(readSizePriceRows(), catalogIsoForMarket(market));
  }

  function buildSizeTileMarkup(s, market, addLabel) {
    var label = rowDisplayName(s, market) || s.label || '';
    var dims = rowDimsText(s);
    var fits = s.fits || '';
    var available = true;
    var popular = !!s.popular;
    var price = s.price || '';
    var vid = s.variant_id || s.variantId || '';
    var pieces = parseInt(s.pieces, 10) || 1;
    return (
      '<li>' +
      '<div class="size-option' +
      (available ? '' : ' size-option--oos') +
      (popular ? ' size-option--popular' : '') +
      '" data-size-id="' +
      escapeHtml(s.id) +
      '" data-size-label="' +
      escapeHtml(label) +
      '" data-size-dims="' +
      escapeHtml(dims) +
      '" data-size-price="' +
      escapeHtml(price) +
      '" data-size-price-raw="' +
      String(s.price_raw || s.priceRaw || 0) +
      '" data-size-variant="' +
      escapeHtml(String(vid)) +
      '" data-size-pieces="' +
      pieces +
      '" data-available="' +
      (available ? 'true' : 'false') +
      '" data-qty="0">' +
      '<button type="button" class="size-option__pick" data-size-pick aria-label="Add ' +
      escapeHtml(label) +
      (dims ? ', ' + escapeHtml(dims) : '') +
      (price ? ', ' + escapeHtml(price) : '') +
      '">' +
      '<span class="size-option__main">' +
      '<span class="size-option__label">' +
      escapeHtml(label) +
      (popular ? ' <span class="size-option__popular">Most popular</span>' : '') +
      '</span>' +
      '<span class="size-option__dims">' +
      escapeHtml(dims) +
      (available ? '' : ' \u00b7 Not in this allocation') +
      '</span>' +
      (fits ? '<span class="size-option__note">' + escapeHtml(fits) + '</span>' : '') +
      '</span>' +
      '</button>' +
      '<div class="size-option__foot">' +
      '<span class="size-option__price">' +
      escapeHtml(price) +
      '</span>' +
      (available
        ? '<button type="button" class="size-option__add" data-size-pick>' +
          escapeHtml(addLabel || 'Add') +
          '</button>' +
          '<span class="size-option__qty" data-size-qty data-qty-stepper data-lp-qty>' +
          '<button type="button" class="size-option__qty-btn" data-qty-dec aria-label="Decrease quantity">&minus;</button>' +
          '<span class="size-option__qty-val" data-qty-val role="status" aria-live="polite">0</span>' +
          '<button type="button" class="size-option__qty-btn" data-qty-inc aria-label="Increase quantity">+</button>' +
          '</span>'
        : '') +
      '</div>' +
      '</div></li>'
    );
  }

  function paintMarketTabs(host) {
    if (!host) return;
    host.hidden = true;
    host.innerHTML = '';
    host.setAttribute('hidden', '');
  }

  function paintPolicyItems(el, raw) {
    if (!el) return;
    var parts = String(raw || '')
      .split(/\s*[·•]\s*/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (!parts.length) {
      el.textContent = raw || '';
      return;
    }
    el.innerHTML = parts
      .map(function (p) {
        return '<span>' + escapeHtml(p) + '</span>';
      })
      .join('');
  }

  function hydratePolicyStrips(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll
      ? scope.querySelectorAll('[data-size-policy], [data-lp-policy]')
      : [];
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.querySelector && el.querySelector('span')) return;
      paintPolicyItems(el, el.textContent);
    });
  }

  function fillLandingPrices() {
    var market = detectMarket();
    var rows = catalogRowsForCountry(detectCountryIso());
    document.querySelectorAll('[data-lp-size-table]').forEach(function (tbody) {
      if (!rows.length) return;
      tbody.innerHTML = rows
        .map(function (row) {
          var price = row.price || '';
          var dims = rowDimsText(row) || row.dims || '';
          var name = rowDisplayName(row, marketToTabKey(detectMarket())) || row.label || '';
          return (
            '<tr data-size-id="' +
            String(row.id || '').replace(/"/g, '') +
            '"><td><strong>' +
            escapeHtml(name) +
            '</strong></td><td class="num">' +
            escapeHtml(dims) +
            '</td><td class="lp-num num" data-lp-row-price>' +
            escapeHtml(price) +
            '</td></tr>'
          );
        })
        .join('');
    });
    document.querySelectorAll('[data-lp-hero-price]').forEach(function (wrap) {
      var mode = wrap.getAttribute('data-lp-price-mode') || 'featured';
      var sizeId = wrap.getAttribute('data-lp-size') || '';
      var valueEl = wrap.querySelector('[data-lp-price]');
      var row =
        mode === 'from'
          ? rows
              .filter(function (r) {
                return (r.price_raw || 0) > 0;
              })
              .sort(function (a, b) {
                return (a.price_raw || 0) - (b.price_raw || 0);
              })[0]
          : sizeRowForId(sizeId, market);
      if (!row || !row.price) {
        wrap.hidden = true;
        return;
      }
      wrap.hidden = false;
      if (valueEl) {
        valueEl.textContent = mode === 'from' ? 'From ' + row.price : row.price;
      }
      document.querySelectorAll('.lp-section').forEach(function (sec) {
        sec.setAttribute('data-lp-resolved-price', row.price);
      });
    });
    var layerLabelBoot =
      document.documentElement.getAttribute('data-layer-price') || '';
    document.querySelectorAll('[data-layer-price-text]').forEach(function (el) {
      if (layerLabelBoot) el.textContent = layerLabelBoot;
    });
    var featuredEl = document.querySelector('[data-lp-featured]');
    var featuredId = featuredEl && featuredEl.getAttribute('data-lp-featured');
    var featuredRow = featuredId ? sizeRowForId(featuredId, market) : null;
    if (featuredRow && featuredRow.price) {
      document.querySelectorAll('h1 [data-lp-price], [data-lp-featured-price]').forEach(function (el) {
        if (!el.closest('[data-lp-hero-price]')) el.textContent = featuredRow.price;
      });
    }
    var years = parseInt(document.documentElement.getAttribute('data-warranty-years'), 10) || 25;
    var layer = parseLayerPriceCents();
    document.querySelectorAll('[data-lp-cost-table]').forEach(function (table) {
      var mode = table.getAttribute('data-lp-cost-mode') || 'king_own';
      var sizeId = table.getAttribute('data-lp-cost-size') || (mode === 'super_king_25' ? 'super-king' : 'king');
      var row = sizeRowForId(sizeId, market);
      var body = table.querySelector('[data-lp-cost-body]');
      if (!body || !row || !(row.price_raw > 0)) {
        if (body) body.innerHTML = '';
        return;
      }
      var mattress = row.price_raw;
      var layerLabel =
        document.documentElement.getAttribute('data-layer-price') ||
        (document.querySelector('[data-lp-layer]') &&
          document.querySelector('[data-lp-layer]').getAttribute('data-lp-layer')) ||
        '';
      if (mode === 'super_king_25') {
        var ownTotal = mattress + layer * 2;
        var sealedTotal = mattress * 3;
        body.innerHTML =
          '<tr><td><strong>This mattress</strong><br><span class="lp-note-line">plus two ' +
          layerLabel +
          ' layers</span></td><td class="lp-num num">' +
          formatMoneyFromCents(mattress, market) +
          '</td><td class="lp-num num">' +
          formatMoneyFromCents(ownTotal, market) +
          '</td><td class="lp-num num">' +
          formatMoneyFromCents(Math.round(ownTotal / years), market) +
          '</td></tr><tr><td>The same mattress, built sealed<br><span class="lp-note-line">replaced twice over the same period</span></td><td class="lp-num num">' +
          formatMoneyFromCents(mattress, market) +
          '</td><td class="lp-num num">' +
          formatMoneyFromCents(sealedTotal, market) +
          '</td><td class="lp-num num">' +
          formatMoneyFromCents(Math.round(sealedTotal / years), market) +
          '</td></tr>';
      } else {
        var ownYear = mattress + layer * 2;
        body.innerHTML =
          '<tr><td><strong>Ours, King</strong><br><span class="lp-note-line">plus two ' +
          layerLabel +
          ' layers</span></td><td class="lp-num num">' +
          formatMoneyFromCents(mattress, market) +
          '</td><td class="lp-num num">' +
          years +
          ' yrs</td><td class="lp-num num">' +
          formatMoneyFromCents(Math.round(ownYear / years), market) +
          '</td></tr><tr><td>The same mattress, built sealed<br><span class="lp-note-line">replaced when the top softens</span></td><td class="lp-num num">' +
          formatMoneyFromCents(mattress, market) +
          '</td><td class="lp-num num">10 yrs</td><td class="lp-num num">' +
          formatMoneyFromCents(Math.round(mattress / 10), market) +
          '</td></tr>';
      }
    });
  }

  function initLandingFunnel() {
    var page = document.querySelector('[data-lp-page]');
    fillLandingPrices();
    document.addEventListener('preview:market-changed', fillLandingPrices);
    if (!page) return;
    var params = new URLSearchParams(location.search);
    var variant = page.getAttribute('data-lp-variant') || '';
    if (variant) {
      window.NUMA = window.NUMA || {};
      window.NUMA.lp_variant = variant;
      try {
        sessionStorage.setItem('valtora_lp_variant', variant);
      } catch (e) {}
    }
    vTrackOnce('lp_view', {
      lp_variant: readLpVariant(),
      keyword: params.get('keyword') || params.get('utm_term') || '',
      gclid: params.get('gclid') || '',
    });
    var marks = { 25: false, 50: false, 75: false, 100: false };
    function onScrollPercent() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      [25, 50, 75, 100].forEach(function (p) {
        if (!marks[p] && pct >= p) {
          marks[p] = true;
          vTrack('scroll_depth', { percent: p, lp_variant: readLpVariant() });
        }
      });
    }
    window.addEventListener('scroll', onScrollPercent, { passive: true });
    var scrolled = false;
    var started = Date.now();
    window.addEventListener(
      'scroll',
      function () {
        scrolled = true;
      },
      { passive: true, once: true }
    );
    window.addEventListener('pagehide', function () {
      if (!scrolled && Date.now() - started < 10000) {
        vTrack('bounce', { under_10s: true, lp_variant: readLpVariant() });
      }
    });
  }

  function withPersistedUtm(href) {
    if (!href) return href;
    if (window.ValtoraUTM && typeof window.ValtoraUTM.applyToHref === 'function') {
      return window.ValtoraUTM.applyToHref(href);
    }
    return href;
  }

  function initLandingConfigure() {
    var roots = document.querySelectorAll('[data-lp-configure]');
    if (!roots.length) return;

    function allRows() {
      return readSizePriceRows();
    }

    function rowsForTab(tabKey) {
      var rows = catalogRowsFrom(allRows(), catalogIsoForMarket(tabKeyToMarket(tabKey)));
      if (rows.length) return rows;
      if (document.documentElement.getAttribute('data-preview') === 'true' && !allRows().length) {
        var mkt = tabKeyToMarket(tabKey) || detectMarket();
        return (SIZE_MAPS[mkt] || SIZE_MAPS.gb || []).slice();
      }
      return [];
    }

    function setLandingStatus(root, msg) {
      var status = root.querySelector('[data-lp-add-status]');
      if (!status) return;
      status.hidden = !msg;
      status.textContent = msg || '';
    }

    function landingLineProperties(host, line) {
      var properties = {
        Size: (line.label || '') + (line.dims ? ' - ' + line.dims : ''),
        Market: String(line.market || detectMarket()).toUpperCase(),
        'Item type': 'Mattress',
        _lead_min: String(line.leadMin || ''),
        _lead_max: String(line.leadMax || ''),
      };
      var note = readSizeNote(host);
      if (note) properties['Anything we should know'] = note;
      return properties;
    }

    function setLandingShopifyQty(host, line, qty) {
      var addUrl = shopifyCartAddUrl();
      if (!addUrl) return Promise.resolve(false);
      var vid = Number(line.variantId);
      if (!vid) return Promise.reject(new Error('no-variant'));
      var cartUrl = shopifyCartJsUrl();
      var changeUrl = shopifyCartChangeUrl();
      var properties = landingLineProperties(host, line);
      qty = parseInt(qty, 10);
      if (!isFinite(qty) || qty < 0) qty = 0;
      return fetch(cartUrl, { headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('add-failed');
          return res.json();
        })
        .then(function (cart) {
          var item = (cart.items || []).find(function (it) {
            return Number(it.variant_id) === vid;
          });
          if (qty < 1) {
            if (!item || !item.key) return cart;
            return shopifyPostJson(changeUrl, { id: item.key, quantity: 0 });
          }
          if (!item) {
            var payload = { id: vid, quantity: qty, properties: properties };
            if (window.ValtoraUTM && typeof window.ValtoraUTM.applyToCartPayload === 'function') {
              payload = window.ValtoraUTM.applyToCartPayload(payload);
            }
            return shopifyPostJson(addUrl, payload);
          }
          return shopifyPostJson(changeUrl, { id: item.key, quantity: qty, properties: properties });
        });
    }

    function addLandingToShopify(host, line, qty) {
      return setLandingShopifyQty(host, line, qty);
    }

    function lineFromRow(root, row) {
      return {
        itemType: 'mattress',
        sizeId: row.getAttribute('data-size-id') || '',
        label: row.getAttribute('data-size-label') || '',
        dims: row.getAttribute('data-size-dims') || '',
        firmness: 'Medium / Medium firm',
        unitPrice: row.getAttribute('data-size-price') || '',
        priceRaw: parseInt(row.getAttribute('data-size-price-raw'), 10) || 0,
        variantId: row.getAttribute('data-size-variant') || '',
        quantity: 1,
        market: detectMarket(),
        leadWindow: root.getAttribute('data-lead-window') || '',
        leadMin: root.getAttribute('data-lead-min') || '',
        leadMax: root.getAttribute('data-lead-max') || '',
      };
    }

    function qtyForRow(row) {
      var nid = String(row.getAttribute('data-size-id') || '');
      var vid = row.getAttribute('data-size-variant') || '';
      var line = OrderStore.lines().find(function (l) {
        if (l.itemType === 'top') return false;
        if (vid && String(l.variantId || '') === vid) return true;
        return l.sizeId === nid;
      });
      return line ? parseInt(line.quantity, 10) || 0 : 0;
    }

    function syncLandingRows(root) {
      root.querySelectorAll('.size-option').forEach(function (row) {
        var q = qtyForRow(row);
        row.classList.toggle('is-in-basket', q > 0);
        row.setAttribute('data-qty', String(q));
        var val = row.querySelector('[data-qty-val]');
        if (val) val.textContent = String(q);
      });
      var policyEl = root.querySelector('[data-lp-policy]');
      if (policyEl) {
        var inEmp = OrderStore.lines().some(function (l) { return l.sizeId === 'emperor'; });
        var def = root.getAttribute('data-lp-policy-default') || '';
        var emp = root.getAttribute('data-lp-policy-emperor') || def;
        paintPolicyItems(policyEl, inEmp ? emp : def);
      }
      if (typeof paintFloatBasketFromStore === 'function') paintFloatBasketFromStore();
    }

    function paintSizes(root) {
      var list = root.querySelector('[data-lp-sizes]');
      if (!list) return;
      var market = detectMarket();
      var tab = marketToTabKey(market);
      root.setAttribute('data-market', market);
      root.setAttribute('data-selector-tab', tab);
      paintMarketTabs(root.querySelector('[data-size-markets]'));
      var rows = rowsForMarket(market);
      list.innerHTML = rows.map(function (row) {
        return buildSizeTileMarkup(row, tab, 'Add');
      }).join('');
      hydratePolicyStrips(root);
      syncLandingRows(root);
    }

    function addOrUpdate(root, row, qty, opts) {
      opts = opts || {};
      var line = lineFromRow(root, row);
      line.quantity = qty;
      OrderStore.upsertMattressLine(line);
      var sizeId = line.sizeId;
      if (opts.qtyChanged) {
        vTrack('quantity_changed', { size: sizeId, quantity: qty, lp_variant: readLpVariant() });
      } else {
        vTrack('configure_complete', { size: sizeId, lp_variant: readLpVariant() });
        vTrack('add_to_basket', {
          size: sizeId,
          value: (line.priceRaw / 100) * qty || undefined,
          trial_eligible: sizeId !== 'emperor',
          lp_variant: readLpVariant(),
        });
      }
      syncLandingRows(root);
      paintSticky();
      addLandingToShopify(root, line, qty).catch(function (err) {
        setLandingStatus(
          root,
          err && err.message === 'no-variant'
            ? 'That size is not available to add.'
            : 'That size could not be added.'
        );
      });
    }

    function preselect(root) {
      var fromQuery = '';
      try {
        fromQuery = new URLSearchParams(location.search).get('size') || '';
      } catch (e) {}
      var featured = (fromQuery || root.getAttribute('data-lp-preselect') || '').trim();
      if (!featured) return;
      var row = root.querySelector('.size-row[data-size-id="' + featured + '"], .size-option[data-size-id="' + featured + '"]');
      if (row && qtyForRow(row) < 1) {
        addOrUpdate(root, row, 1, {});
      }
    }

    roots.forEach(function (root) {
      if (root.getAttribute('data-lp-configure-ready') === '1') return;
      root.setAttribute('data-lp-configure-ready', '1');
      paintSizes(root);
      paintMarketTabs(root.querySelector('[data-size-markets]'));
      root.addEventListener('click', function (e) {
        var row = e.target.closest('.size-row, .size-option');
        if (!row || !root.contains(row)) return;
        var dec = e.target.closest('[data-qty-dec]');
        var inc = e.target.closest('[data-qty-inc]');
        var pick = e.target.closest('[data-size-pick]');
        if (dec || inc) {
          var q = qtyForRow(row);
          if (dec) q -= 1;
          if (inc) q += 1;
          if (q < 1) {
            var zeroLine = lineFromRow(root, row);
            OrderStore.removeMattressSize(row.getAttribute('data-size-id'));
            vTrack('quantity_changed', {
              size: row.getAttribute('data-size-id'),
              quantity: 0,
              lp_variant: readLpVariant(),
            });
            syncLandingRows(root);
            paintSticky();
            setLandingShopifyQty(root, zeroLine, 0).catch(function () {});
            return;
          }
          addOrUpdate(root, row, q, { qtyChanged: true });
          paintSticky();
          return;
        }
        if (row.getAttribute('data-available') === 'false') return;
        var addHit =
          pick ||
          e.target.closest('.size-option__add, .size-row__add');
        var qNow = qtyForRow(row);
        if (qNow > 0 && !addHit) return;
        e.preventDefault();
        addOrUpdate(root, row, addHit ? qNow + 1 : Math.max(1, qNow || 1), {
          qtyChanged: addHit && qNow > 0,
        });
        paintSticky();
      });
      root.addEventListener('pointerup', function (e) {
        if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
        if (!e.target.closest('[data-size-pick], [data-qty-inc], .size-row, .size-option')) return;
        setTimeout(function () { paintSticky(); }, 0);
      });
      if ('IntersectionObserver' in window) {
        var seen = false;
        var io = new IntersectionObserver(
          function (entries) {
            if (seen) return;
            if (entries.some(function (en) { return en.isIntersecting; })) {
              seen = true;
              var pre = root.getAttribute('data-lp-preselect') || '';
              try {
                pre = new URLSearchParams(location.search).get('size') || pre;
              } catch (err) {}
              vTrackOnce('configure_start', {
                size_preselected: !!pre,
                size: pre || '',
                lp_variant: readLpVariant(),
              });
              io.disconnect();
            }
          },
          { threshold: 0.35 }
        );
        io.observe(root);
      }
    });
    document.addEventListener('preview:market-changed', function () {
      roots.forEach(function (root) {
        paintSizes(root);
      });
    });
  }

  function topEntryPoint() {
    try {
      var params = new URLSearchParams(location.search);
      if (params.get('order') || params.get('t')) return 'portal';
      var utm = (window.ValtoraUTM && window.ValtoraUTM.get && window.ValtoraUTM.get()) || {};
      var src = String(utm.utm_source || '').toLowerCase();
      var med = String(utm.utm_medium || '').toLowerCase();
      if (med === 'email' || src.indexOf('email') !== -1) {
        if (/life|post.?purchase|nurture/.test(src + med + String(utm.utm_campaign || ''))) {
          return 'email_lifecycle';
        }
        return 'email_campaign';
      }
      if (med === 'social' || /instagram|facebook|tiktok|meta/.test(src)) return 'social';
      var ref = document.referrer || '';
      if (/comfort-top|comfort-layer|bed-sheets|pillows|swap/.test(location.pathname)) {
        if (/reserve|#swap|index/.test(ref)) return 'mattress_page';
      }
      if (!ref) return 'direct';
      try {
        var host = new URL(ref).hostname;
        if (host && host !== location.hostname) return 'organic';
      } catch (e) {}
      if (/reserve|index|swap/.test(ref)) return 'mattress_page';
      return 'direct';
    } catch (err) {
      return 'direct';
    }
  }

  function isMattressLine(line) {
    return !line || !line.itemType || line.itemType === 'mattress';
  }

  function isAccessoryType(type) {
    return type === 'top' || type === 'sheets' || type === 'pillows';
  }

  function flagEnabled(attr) {
    var el =
      document.body ||
      document.documentElement ||
      document.querySelector('[' + attr + ']');
    if (!el) return false;
    return el.getAttribute(attr) === 'true';
  }

  function accessoryAllowed(type) {
    if (type === 'top') return flagEnabled('data-comfort-tops-enabled') || comfortTopsEnabled();
    if (type === 'sheets') return flagEnabled('data-sheets-enabled');
    if (type === 'pillows') return flagEnabled('data-pillows-enabled');
    return true;
  }

  function orderLineTitle(line) {
    var qty = parseInt(line && line.quantity, 10) || 0;
    if (!line) return '';
    if (line.itemType === 'top') return 'Comfort layer · ' + (line.label || '');
    if (line.itemType === 'sheets') {
      return 'Bed sheets · ' + (line.label || '') + (line.colour ? ' · ' + line.colour : '');
    }
    if (line.itemType === 'pillows') {
      return 'Pillows · ' + (line.label || '');
    }
    return (line.label || '') + ' · ' + qty;
  }

  function parseAccessoryPrices(root) {
    var el = root && root.querySelector('[data-accessory-prices]');
    if (!el) return {};
    try {
      return JSON.parse(el.textContent.trim()) || {};
    } catch (e) {
      return {};
    }
  }

  function firePurchaseOnce(params) {
    params = params || {};
    var orderId = params.order_id || params.orderId || 'unknown';
    var key = 'purchase_fired_' + orderId;
    if (sessionFlag(key) || sessionFlag('valtora_purchase')) return;
    setSessionFlag(key);
    setSessionFlag('valtora_purchase');
    var utm = (window.ValtoraUTM && window.ValtoraUTM.get && window.ValtoraUTM.get()) || {};
    var payload = Object.assign(
      {
        order_id: orderId,
        value: params.value,
        currency: params.currency || '',
        line_count: params.line_count || 0,
        units: params.units || 0,
        order_value: params.order_value || params.value || '',
      },
      utm
    );
    // Strip internal UTM bookkeeping keys from the event payload.
    delete payload._captured_at;
    delete payload._landing_path;
    var last = OrderStore.readLastOrder && OrderStore.readLastOrder();
    var lastLines = (last && last.lines) || params.lines || [];
    var containsMattress = lastLines.some(isMattressLine);
    payload.contains_mattress = containsMattress;
    payload.accessory_only = !containsMattress && lastLines.length > 0;
    payload.transaction_id = orderId;
    var sizeLine = lastLines.filter(isMattressLine)[0];
    if (sizeLine && sizeLine.sizeId && payload.size == null) payload.size = sizeLine.sizeId;
    vTrack('purchase', payload);
    lastLines.forEach(function (line) {
      if (line.itemType === 'top') {
        vTrack('top_purchase', {
          size: line.sizeId || line.label || '',
          firmness: line.firmness || '',
          entry_point: topEntryPoint(),
          owns_mattress: containsMattress,
        });
      }
      if (line.itemType === 'sheets') {
        vTrack('sheets_purchase', {
          size: line.sizeId || line.label || '',
          colour: line.colour || '',
          owns_mattress: containsMattress,
        });
      }
      if (line.itemType === 'pillows') {
        vTrack('pillows_purchase', {
          sleep: line.sleep || '',
          owns_mattress: containsMattress,
        });
      }
    });
  }
  window.firePurchaseOnce = firePurchaseOnce;

  function linePriceCents(line) {
    if (!line) return 0;
    var n = parseInt(line.priceRaw, 10);
    return isFinite(n) && n > 0 ? n : 0;
  }

  function formatMoneyFromCents(cents, market) {
    var major = Math.round(Number(cents) / 100);
    if (!isFinite(major) || major < 0) major = 0;
    var mkt = market || detectMarket();
    if (!isSizeMarket(mkt)) mkt = 'gb';
    if (!major) return '';
    if (mkt === 'ae') return 'AED ' + major.toLocaleString('en-AE');
    if (mkt === 'eu') return '€' + major.toLocaleString('en-GB');
    if (mkt === 'us') return '$' + major.toLocaleString('en-US');
    return '£' + major.toLocaleString('en-GB');
  }

  function formatLineTotal(line) {
    var qty = parseInt(line && line.quantity, 10) || 0;
    return formatMoneyFromCents(linePriceCents(line) * qty, (line && line.market) || detectMarket());
  }

  function formatOrderTotal(lines, market) {
    return formatMoneyFromCents(
      OrderStore.orderValueCents(lines),
      market || (lines && lines[0] && lines[0].market) || detectMarket()
    );
  }

  function sizePriceRaw(size) {
    if (!size) return 0;
    var n = parseInt(size.price_raw != null ? size.price_raw : size.priceRaw, 10);
    return isFinite(n) && n > 0 ? n : 0;
  }

  function marketFinanceName(mkt) {
    return mkt === 'ae' ? 'Tabby or Tamara' : 'Klarna';
  }

  function refreshKlarnaPlacements() {
    try {
      if (
        window.Klarna &&
        window.Klarna.OnsiteMessaging &&
        typeof window.Klarna.OnsiteMessaging.refresh === 'function'
      ) {
        window.Klarna.OnsiteMessaging.refresh();
        return;
      }
    } catch (e) {}
    try {
      window.KlarnaOnsiteService = window.KlarnaOnsiteService || [];
      window.KlarnaOnsiteService.push({ eventName: 'refresh-placements' });
    } catch (e2) {}
  }

  function splititLive() {
    var theme = window.ValtoraTheme || {};
    if (theme.splititEnabled === true) return true;
    if (document.documentElement.getAttribute('data-splitit') === 'on') return true;
    return !!document.querySelector('script[src*="web-components.splitit.com"]');
  }

  function hideSplititSlot(el) {
    if (!el) return;
    var slot = el.querySelector('[data-splitit-slot], spt-strip');
    if (!slot) return;
    slot.hidden = true;
    slot.setAttribute('hidden', '');
    if (el._splititTimer) {
      window.clearTimeout(el._splititTimer);
      el._splititTimer = null;
    }
  }

  function paintSplititSlot(el) {
    var slot = el && el.querySelector('[data-splitit-slot], spt-strip');
    if (!slot) return;
    if (!splititLive()) {
      hideSplititSlot(el);
      return;
    }
    slot.hidden = false;
    slot.removeAttribute('hidden');
    if (el._splititTimer) window.clearTimeout(el._splititTimer);
    el._splititTimer = window.setTimeout(function () {
      var filled =
        slot.childElementCount > 0 ||
        (slot.shadowRoot && slot.shadowRoot.childElementCount > 0) ||
        slot.offsetHeight > 12;
      if (!filled) hideSplititSlot(el);
    }, 3000);
  }

  function checkoutSizeParam(lines) {
    return (lines || [])
      .filter(function (line) {
        return isMattressLine(line);
      })
      .map(function (line) {
        return line.sizeId || line.label || '';
      })
      .filter(Boolean)
      .join(', ');
  }

  function paintBnplMonthly(el, opts) {
    if (!el) return;
    opts = opts || {};
    var lines = opts.lines || OrderStore.lines();
    var mattressLines = (lines || []).filter(isMattressLine);
    var cents = opts.cents != null ? opts.cents : OrderStore.orderValueCents(lines);
    var units = mattressLines.reduce(function (sum, line) {
      return sum + (parseInt(line.quantity, 10) || 0);
    }, 0);
    var copy = el.querySelector('[data-bnpl-copy]');
    var klarnaSlot = el.querySelector('[data-bnpl-klarna], klarna-placement');

    function hideBnpl() {
      el.hidden = true;
      el.setAttribute('hidden', '');
      if (copy) copy.textContent = '';
      else if (!klarnaSlot) el.textContent = '';
      if (klarnaSlot) {
        klarnaSlot.setAttribute('hidden', '');
        klarnaSlot.setAttribute('data-purchase-amount', '');
      }
      hideSplititSlot(el);
      if (el._bnplTimer) {
        window.clearTimeout(el._bnplTimer);
        el._bnplTimer = null;
      }
    }

    function setGeneric(text) {
      if (klarnaSlot) klarnaSlot.setAttribute('hidden', '');
      if (copy) copy.textContent = text;
      else el.textContent = text;
    }

    if (!mattressLines.length || !units || !cents) {
      hideBnpl();
      return;
    }

    var mkt = opts.market || detectMarket();
    el.hidden = false;
    el.removeAttribute('hidden');
    el.classList.add('bnpl-slot');

    if (mkt === 'gb') {
      paintSplititSlot(el);
      var sdkLoaded = !!document.querySelector('script[src*="js.klarna.com"]');
      if (sdkLoaded && klarnaSlot) {
        if (copy) copy.textContent = '';
        klarnaSlot.hidden = false;
        klarnaSlot.removeAttribute('hidden');
        klarnaSlot.setAttribute('data-purchase-amount', String(Math.round(cents)));
        refreshKlarnaPlacements();
        if (el._bnplTimer) window.clearTimeout(el._bnplTimer);
        el._bnplTimer = window.setTimeout(function () {
          var filled =
            klarnaSlot &&
            (klarnaSlot.childElementCount > 0 ||
              (klarnaSlot.shadowRoot && klarnaSlot.shadowRoot.childElementCount > 0) ||
              klarnaSlot.offsetHeight > 12);
          if (!filled) setGeneric('Spread the cost with Klarna');
        }, 3000);
        return;
      }
      setGeneric('Spread the cost with Klarna');
      return;
    }

    hideSplititSlot(el);
    if (mkt === 'ae') {
      setGeneric('Spread the cost with Tabby or Tamara');
      return;
    }
    if (mkt === 'eu') {
      setGeneric('Spread the cost with Klarna');
      return;
    }

    hideBnpl();
  }

  function sessionFlag(key) {
    try {
      return sessionStorage.getItem(key) === '1';
    } catch (e) {
      return false;
    }
  }

  function setSessionFlag(key) {
    try {
      sessionStorage.setItem(key, '1');
    } catch (e) {}
  }

  function observeDwell(el, ms, onceKey, onFire) {
    if (!el || !('IntersectionObserver' in window)) return;
    var timer = null;
    var done = onceKey ? sessionFlag(onceKey) : false;
    if (done) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (done) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (timer) return;
            timer = setTimeout(function () {
              if (done) return;
              done = true;
              if (onceKey) setSessionFlag(onceKey);
              onFire();
              io.disconnect();
            }, ms);
          } else if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    io.observe(el);
  }

  function stickyBottomInset() {
    var bar = document.querySelector('[data-sticky-reserve]');
    var inset = 16;
    if (bar && !bar.hasAttribute('hidden') && bar.offsetParent !== null) {
      inset = Math.round(bar.getBoundingClientRect().height + 16);
    } else if (document.body.classList.contains('has-sticky-reserve')) {
      inset = 88;
    }
    return Math.min(inset, Math.round(window.innerHeight * 0.16));
  }

  /* Trigger at 20% in viewport: element's top has entered the lower 20%. */
  function revealTriggerY() {
    return Math.round(window.innerHeight * 0.8);
  }

  function motionAllowed() {
    if (document.documentElement.getAttribute('data-force-motion') === 'true') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function revealIfInView(el) {
    if (!el || el.classList.contains('is-visible')) return false;
    if (el.hasAttribute('hidden')) return false;
    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;

    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var trigger = revealTriggerY();
    if (r.top < trigger && r.bottom > Math.min(72, vh * 0.1)) {
      return true;
    }
    return false;
  }

  function revealChild(el) {
    if (!el || el.classList.contains('is-visible')) return false;
    el.classList.add('is-visible');
    return true;
  }

  function revealGroup(root) {
    if (!root || root.classList.contains('is-visible')) return false;
    root.classList.add('is-visible');
    root.querySelectorAll('[data-reveal-grouped]').forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', i * 50 + 'ms');
      revealChild(el);
    });
    return true;
  }

  function directMatches(root, selector) {
    return Array.prototype.filter.call(root.children || [], function (el) {
      return el.matches && el.matches(selector);
    });
  }

  function skipMotion(el) {
    if (!el || !el.closest) return false;
    return !!el.closest(
      '[data-top-price], [data-lead-window-label], [data-leadtime-copy], [data-leadtime-copy-top], [data-leadtime-copy-mixed], [data-leadtime-block], [data-lead-line], .checkout-stage__terms, .trust-policy__body'
    );
  }

  function tagChild(el, delayMs) {
    if (!el || el.hasAttribute('data-reveal-grouped')) return;
    if (skipMotion(el)) return;
    if (el.hasAttribute('data-reveal-first')) return;
    if (el.closest && el.closest('.hero, .mfg-hero, .policy-hero')) return;
    el.setAttribute('data-reveal-child', '');
    if (delayMs != null && !el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', Math.min(delayMs, 50) + 'ms');
    }
  }

  function tagHeroFirstPaint() {
    document.querySelectorAll('.hero').forEach(function (hero) {
      var sequence = [
        [hero.querySelector('h1'), 0],
        [hero.querySelector('.hero__sub'), 50],
        [hero.querySelector('.hero__media'), 100],
        [hero.querySelector('.hero__cta'), 150],
        [hero.querySelector('.hero__assurance'), 200]
      ];
      sequence.forEach(function (pair) {
        var el = pair[0];
        if (!el || skipMotion(el)) return;
        el.setAttribute('data-reveal-child', '');
        el.setAttribute('data-reveal-first', '');
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', pair[1] + 'ms');
        }
      });
    });
    document.querySelectorAll('.mfg-hero__copy > *, .mfg-hero__img').forEach(function (el, i) {
      if (skipMotion(el)) return;
      el.setAttribute('data-reveal-child', '');
      el.setAttribute('data-reveal-first', '');
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', Math.min(i * 50, 200) + 'ms');
      }
    });
  }

  function revealFirstPaint() {
    document.querySelectorAll('[data-reveal-first]').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function tagCascade(root, items, stepMs) {
    if (!root || !items || !items.length) return;
    var step = Math.min(stepMs == null ? 50 : stepMs, 50);
    root.setAttribute('data-reveal-group', '');
    items.forEach(function (el, i) {
      if (skipMotion(el)) return;
      el.setAttribute('data-reveal-child', '');
      el.setAttribute('data-reveal-grouped', '');
      el.style.setProperty('--reveal-delay', i * step + 'ms');
    });
  }

  function initReveal() {
    /* Liquid request.design_mode already set shopify-design-mode on Customize.
       Do not copy window.Shopify.designMode onto the live storefront — the
       GitHub admin bar / Preview must still play the stagger. */
    var designMode = document.documentElement.classList.contains('shopify-design-mode');
    void (window.Shopify && window.Shopify.designMode);
    if (/[?&]force-motion=1(?:&|$)/.test(location.search)) {
      document.documentElement.setAttribute('data-force-motion', 'true');
    }
    document.documentElement.setAttribute('data-reveal-booted', '1');
    document.documentElement.classList.add('js-ready');

    document
      .querySelectorAll('main .section, main .founder-note, main .mfg-hero, main .article')
      .forEach(function (sec) {
        if (!sec.hasAttribute('data-reveal')) sec.setAttribute('data-reveal', '');
      });
    document.querySelectorAll('.trust-bar--marquee').forEach(function (el) {
      el.removeAttribute('data-reveal');
      el.classList.remove('is-visible');
      el.style.opacity = '';
      el.style.transform = '';
    });

    /* Staggered lists/grids: one trigger reveals all children in sequence */
    var staggerRoots = [
      ['.specs__list', 'li'],
      ['.cert-strip', '.cert-strip__item'],
      ['.cool-touch__points', 'li'],
      ['.benefits__grid', '.benefit'],
      ['.awards__grid', '.award'],
      ['.offer__items', '.offer__item'],
      ['.ugc__grid', '.ugc__card'],
      ['.lifestyle-collage__masonry', '.lifestyle-collage__item'],
      ['.media-feature__grid', '.media-feature__card'],
      ['.press__logos', '.press__logo'],
      ['.cool-touch__gallery', '.cool-touch__thumb'],
      ['.size-list', '.size-option'],
      ['.faq__list', '.faq__item'],
      ['.layer-stack', 'li'],
      ['.mfg-gallery__grid', '.mfg-gallery__item'],
      ['.mfg-split__grid', '.mfg-split__card'],
      ['.blog-index__grid', '.blog-card'],
      ['.policy-articles', '.policy-article'],
      ['.contact-details--cards', 'li']
    ];
    document.querySelectorAll('.trust-bar:not(.trust-bar--marquee) .trust-bar__list').forEach(function (root) {
      var items = directMatches(root, '.trust-bar__item').filter(function (el) {
        return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true';
      });
      if (!items.length) return;
      tagCascade(root, items, 50);
    });
    staggerRoots.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (root) {
        var items = directMatches(root, pair[1]).filter(function (el) {
          return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true';
        });
        if (!items.length) return;
        tagCascade(root, items, 50);
      });
    });

    /* Founder: portrait + copy cascade together */
    document.querySelectorAll('.founder-note__grid').forEach(function (grid) {
      var items = [];
      var portrait = grid.querySelector('.founder-note__portrait');
      if (portrait) items.push(portrait);
      var copy = grid.querySelector('.founder-note__copy');
      if (copy) {
        Array.prototype.forEach.call(copy.children, function (el) {
          items.push(el);
        });
      }
      tagCascade(grid, items, 50);
    });

    /* Manufacturing journey: portrait + story copy */
    document.querySelectorAll('.mfg-story__grid').forEach(function (grid) {
      var items = [];
      var portrait = grid.querySelector('.mfg-story__portrait');
      if (portrait) items.push(portrait);
      var copy = grid.querySelector('.mfg-story__copy');
      if (copy) {
        Array.prototype.forEach.call(copy.children, function (el) {
          items.push(el);
        });
      }
      tagCascade(grid, items, 50);
    });

    /* Manufacturing hero copy entrance (CSS heroRise + reveal) */
    document.querySelectorAll('.mfg-hero__copy, .policy-hero__copy').forEach(function (copy) {
      var items = [];
      Array.prototype.forEach.call(copy.children, function (el) {
        items.push(el);
      });
      tagCascade(copy, items, 50);
    });

    /* Journal article body blocks */
    document.querySelectorAll('.article__header, .article__body, .article__cta').forEach(function (block, i) {
      tagChild(block, Math.min(i * 100, 300));
    });
    document.querySelectorAll('.article__body > *').forEach(function (el, i) {
      tagChild(el, Math.min(80 + i * 70, 560));
    });

    /* Before you reserve / how to measure: intro + steps + link */
    document.querySelectorAll('.measure-size__inner').forEach(function (inner) {
      var items = [];
      Array.prototype.forEach.call(inner.children, function (el) {
        if (el.classList && el.classList.contains('measure-size__steps')) {
          Array.prototype.forEach.call(el.children, function (step) {
            items.push(step);
          });
        } else {
          items.push(el);
        }
      });
      tagCascade(inner, items, 50);
    });

    /* All section headings + intro copy (hero keeps its own entrance) */
    document.querySelectorAll('main h1, main h2').forEach(function (el, i) {
      if (el.closest('.policy-article, .policy-legal, .faq__item, .mfg-split__card')) return;
      tagChild(el, Math.min(i * 50, 250));
    });
    document.querySelectorAll('main .section__eyebrow, main .section__lede, main .gold-rule').forEach(function (el, i) {
      if (el.closest('.benefit, .award, .offer__item, .ugc__card, .media-feature__card, .faq__item, .press__logo, .mfg-split__card, .blog-card, .mfg-gallery__item, .policy-article, .policy-hero')) return;
      tagChild(el, Math.min(i * 40, 200));
    });

    var soloSelectors = [
      '.specs__media',
      '.cool-touch__main',
      '.big-idea__copy',
      '.big-idea__media',
      '.offer__cta',
      '.article__hero',
      '.mfg-cta .btn',
      '.policy-legal',
      '.policy-intro',
      '.policy-cta .btn'
    ];
    soloSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        tagChild(el, Math.min(i * 80, 320));
      });
    });

    tagHeroFirstPaint();
    revealFirstPaint();

    var groups = document.querySelectorAll('[data-reveal-group]');
    var solos = document.querySelectorAll('[data-reveal-child]:not([data-reveal-grouped])');

    function showAll() {
      /* Storefront + motion: only unstick nodes already on screen. Below-fold
         stays hidden so scroll can play the stagger. Design mode, reduced-motion,
         and missing IO still reveal everything. */
      var storefrontMotion = !designMode && motionAllowed() && ('IntersectionObserver' in window);
      if (storefrontMotion) {
        groups.forEach(function (g) {
          if (!g.classList.contains('is-visible') && revealIfInView(g)) revealGroup(g);
        });
        solos.forEach(function (n) {
          if (!n.classList.contains('is-visible') && revealIfInView(n)) revealChild(n);
        });
        return;
      }
      groups.forEach(function (g) { revealGroup(g); });
      solos.forEach(function (n) { revealChild(n); });
      document.querySelectorAll('[data-reveal]').forEach(function (n) {
        n.classList.add('is-visible');
      });
    }

    if (designMode || !motionAllowed() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    document.querySelectorAll('[data-reveal]').forEach(function (n) {
      n.classList.add('is-visible');
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var t = e.target;
          if (t.hasAttribute('data-reveal-group')) revealGroup(t);
          else revealChild(t);
          io.unobserve(t);
        });
      },
      {
        threshold: [0.2],
        rootMargin: '0px 0px 0px 0px'
      }
    );

    groups.forEach(function (g) { io.observe(g); });
    solos.forEach(function (n) { io.observe(n); });

    function sweepVisible() {
      groups.forEach(function (g) {
        if (!g.classList.contains('is-visible') && revealIfInView(g)) {
          revealGroup(g);
          io.unobserve(g);
        }
      });
      solos.forEach(function (n) {
        if (!n.classList.contains('is-visible') && revealIfInView(n)) {
          revealChild(n);
          io.unobserve(n);
        }
      });
    }

    window.addEventListener('scroll', sweepVisible, { passive: true });
    window.addEventListener('resize', sweepVisible);
    requestAnimationFrame(function () {
      requestAnimationFrame(sweepVisible);
    });
    setTimeout(sweepVisible, 80);
    setTimeout(showAll, 900);

    var sticky = document.querySelector('[data-sticky-reserve]');
    if (sticky && 'MutationObserver' in window) {
      var mo = new MutationObserver(sweepVisible);
      mo.observe(sticky, { attributes: true, attributeFilter: ['hidden', 'class'] });
    }
  }

  function sectionGroundVisible(el) {
    if (!el || el.hidden || el.getAttribute('hidden') !== null) return false;
    var wrap = el.closest('.shopify-section');
    if (wrap && (wrap.hidden || wrap.getAttribute('hidden') !== null)) return false;
    try {
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    } catch (e) {}
    return true;
  }

  function applySectionGroundClass(el, ground) {
    if (!el || el.classList.contains('hero')) return;
    var isTrust = el.classList.contains('trust-bar');
    el.classList.remove(
      'section--dark',
      'section--surface',
      'section--bg',
      'trust-bar--dark',
      'trust-bar--surface'
    );
    if (ground === 'dark') {
      el.classList.add(isTrust ? 'trust-bar--dark' : 'section--dark');
    } else if (ground === 'surface') {
      el.classList.add(isTrust ? 'trust-bar--surface' : 'section--surface');
    } else if (ground === 'bg') {
      if (!isTrust) el.classList.add('section--bg');
    }
  }

  function applySectionGrounds() {
    var root = document.getElementById('MainContent') || document.querySelector('main') || document.body;
    if (!root) return;
    var nodes = root.querySelectorAll('[data-section-ground]');
    var prev = null;
    nodes.forEach(function (el) {
      if (!sectionGroundVisible(el)) return;
      var mode = el.getAttribute('data-section-ground') || 'auto';
      if (el.classList.contains('hero')) {
        prev = mode === 'dark' ? 'dark' : 'bg';
        return;
      }
      if (mode === 'auto') {
        /* Brand: Snow → Surface → Dark, roughly every third section.
           Neighbours never share a ground. Ember is never a fill. */
        var next = 'bg';
        if (prev === 'bg') next = 'surface';
        else if (prev === 'surface') next = 'dark';
        applySectionGroundClass(el, next);
        prev = next;
        return;
      }
      if (mode === 'bg' || mode === 'surface' || mode === 'dark') {
        applySectionGroundClass(el, mode);
        prev = mode;
      }
    });
  }

  function initSectionGrounds() {
    applySectionGrounds();
    window.ValtoraTheme = window.ValtoraTheme || {};
    window.ValtoraTheme.applySectionGrounds = applySectionGrounds;
    ['shopify:section:load', 'shopify:section:unload', 'shopify:section:reorder', 'shopify:section:select'].forEach(
      function (evt) {
        document.addEventListener(evt, applySectionGrounds);
      }
    );
  }

  function initSectionWipes() {
    /* 600ms horizontal wipe at light ↔ dark crossings only. Resting state is
       always visible (clip-path: none). The inset clip lives only inside the
       .is-wiping keyframe, then is removed so Offer/Swap cannot stay hidden. */
    var designMode = document.documentElement.classList.contains('shopify-design-mode');

    function sectionIsDark(el) {
      return el.classList.contains('section--dark') || el.classList.contains('trust-bar--dark');
    }

    function markWipes() {
      var root = document.getElementById('MainContent') || document.querySelector('main') || document.body;
      if (!root) return;
      var nodes = root.querySelectorAll('[data-section-ground]');
      var prevDark = null;
      nodes.forEach(function (el) {
        if (!el.classList.contains('is-wiped')) {
          el.classList.remove('section--wipe', 'is-wiping');
        }
        if (!sectionGroundVisible(el)) return;
        if (el.classList.contains('hero') || el.classList.contains('trust-bar')) {
          prevDark = sectionIsDark(el);
          return;
        }
        var isDark = sectionIsDark(el);
        if (prevDark !== null && isDark !== prevDark && !el.classList.contains('is-wiped')) {
          el.classList.add('section--wipe');
        }
        prevDark = isDark;
      });
    }

    markWipes();
    if (designMode || !motionAllowed()) return;

    function finishWipe(el) {
      if (!el || el.classList.contains('is-wiped')) return;
      el.classList.remove('is-wiping');
      el.classList.add('is-wiped');
    }

    var wipeIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          if (el.classList.contains('is-wiped') || el.classList.contains('is-wiping')) {
            wipeIO.unobserve(el);
            return;
          }
          el.classList.add('is-wiping');
          function done() {
            finishWipe(el);
            el.removeEventListener('animationend', done);
          }
          el.addEventListener('animationend', done);
          window.setTimeout(function () {
            finishWipe(el);
          }, 700);
          wipeIO.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.section--wipe').forEach(function (el) {
      wipeIO.observe(el);
    });
  }

  function applyPreviewTopsFlag() {
    var params;
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      return;
    }
    if (params.get('tops') === '1') {
      document.querySelectorAll('[data-comfort-top-cta]').forEach(function (el) {
        el.hidden = false;
      });
      document.querySelectorAll('[data-comfort-tops-enabled], [data-size-reserve]').forEach(function (el) {
        el.setAttribute('data-comfort-tops-enabled', 'true');
      });
      if (document.body) document.body.setAttribute('data-comfort-tops-enabled', 'true');
    }
    if (params.get('sheets') === '1') {
      document.querySelectorAll('[data-sheets-enabled]').forEach(function (el) {
        el.setAttribute('data-sheets-enabled', 'true');
      });
      if (document.body) document.body.setAttribute('data-sheets-enabled', 'true');
      document.querySelectorAll('[data-sheets-discover]').forEach(function (el) {
        el.hidden = false;
      });
    }
    if (params.get('pillows') === '1') {
      document.querySelectorAll('[data-pillows-enabled]').forEach(function (el) {
        el.setAttribute('data-pillows-enabled', 'true');
      });
      if (document.body) document.body.setAttribute('data-pillows-enabled', 'true');
      document.querySelectorAll('[data-pillows-discover]').forEach(function (el) {
        el.hidden = false;
      });
    }
    if (params.get('accessories') === '1') {
      document.querySelectorAll('[data-footer-accessories]').forEach(function (el) {
        el.hidden = false;
      });
      if (document.body) document.body.setAttribute('data-footer-accessories-enabled', 'true');
    }
  }

  function initScrollProgress() {
    if (!motionAllowed()) return;
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.scrollY || doc.scrollTop) / max : 0;
      bar.style.width = Math.min(100, Math.max(0, p * 100)) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initParallax() {
    if (!motionAllowed()) return;
    if (window.matchMedia('(max-width: 899px)').matches) return;
    /* Dark heroes + manufacturing hero: soft media drift */
    var targets = [];
    var darkHero = document.querySelector('.hero--dark .hero__media');
    if (darkHero) targets.push({ media: darkHero, amount: 36, scale: 1.06 });
    var mfgHero = document.querySelector('.mfg-hero');
    if (mfgHero) targets.push({ media: mfgHero, amount: 28, scale: 1.05 });
    if (!targets.length) return;

    targets.forEach(function (t) {
      t.media.setAttribute('data-parallax', '');
      t.img = t.media.querySelector('img, video');
    });

    function update() {
      var vh = window.innerHeight || 1;
      targets.forEach(function (t) {
        if (!t.img) return;
        var rect = t.media.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        t.img.style.transform =
          'translate3d(0,' + (progress * t.amount).toFixed(2) + 'px,0) scale(' + t.scale + ')';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initInViewVideo() {
    var videos = document.querySelectorAll('.theme-video, .big-idea__media video, .media-feature__media video');
    if (!videos.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) {
            if (v.hasAttribute('autoplay') || v.classList.contains('theme-video')) {
              var play = v.play();
              if (play && play.catch) play.catch(function () {});
            }
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { threshold: 0.35 }
    );
    videos.forEach(function (v) {
      io.observe(v);
    });
  }

  function initMagneticButtons() {
    /* Disabled: CTAs keep a fixed position - hover scale is CSS-only */
  }

  function initTiltCards() {
    /* Disabled: tiles use a single in-place scale - no pointer tilt/wobble */
  }

  function initFaq() {
    document.querySelectorAll('[data-faq]').forEach(function (root) {
      root.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-faq-trigger]');
        if (!btn || !root.contains(btn)) return;
        var item = btn.closest('[data-faq-item]');
        var open = item.getAttribute('aria-expanded') === 'true';
        root.querySelectorAll('[data-faq-item]').forEach(function (el) {
          el.setAttribute('aria-expanded', 'false');
        });
        if (!open) item.setAttribute('aria-expanded', 'true');
      });
    });
  }

  function openFaqItem(item) {
    if (!item) return;
    var root = item.closest('[data-faq]');
    if (root) {
      root.querySelectorAll('[data-faq-item]').forEach(function (el) {
        el.setAttribute('aria-expanded', 'false');
      });
    }
    item.setAttribute('aria-expanded', 'true');
  }

  function trackSpecOpened(panel) {
    if (!panel || panel.getAttribute('data-spec-tracked') === 'true') return;
    panel.setAttribute('data-spec-tracked', 'true');
    if (window.vTrack) {
      window.vTrack('spec_opened', {
        spec_id: panel.dataset.specId,
        page: window.location.pathname
      });
    }
  }

  function openSpecPanel(panel) {
    if (!panel) return;
    var trigger = panel.querySelector('.vspec__trigger');
    panel.dataset.open = 'true';
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    trackSpecOpened(panel);
  }

  function initSpecPanel() {
    document.querySelectorAll('[data-spec-panel]').forEach(function (panel) {
      var trigger = panel.querySelector('.vspec__trigger');
      if (!trigger) return;
      var openedAt = 0;
      var page = window.location.pathname;

      trigger.addEventListener('click', function () {
        var isOpen = panel.dataset.open === 'true';
        panel.dataset.open = isOpen ? 'false' : 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));

        if (!isOpen) {
          openedAt = Date.now();
          trackSpecOpened(panel);
        } else if (openedAt && window.vTrack) {
          window.vTrack('spec_dwell', {
            spec_id: panel.dataset.specId,
            page: page,
            seconds: Math.round((Date.now() - openedAt) / 1000)
          });
          openedAt = 0;
        }
      });

      window.addEventListener('beforeunload', function () {
        if (openedAt && window.vTrack) {
          window.vTrack('spec_dwell', {
            spec_id: panel.dataset.specId,
            page: page,
            seconds: Math.round((Date.now() - openedAt) / 1000)
          });
        }
      });
    });
  }

  function stickyHeaderOffset() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    var n = parseFloat(raw);
    if (!n || n < 1) {
      var header = document.querySelector('.site-header');
      n = header ? header.getBoundingClientRect().height : 60;
    }
    return n + 8;
  }

  function scrollToEl(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - stickyHeaderOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function applyHashTarget(hash) {
    var id = String(hash || '').replace(/^#/, '').split('?')[0];
    if (!id) return;
    if (id === 'specs' || id.indexOf('specs-') === 0) {
      var specSection = document.getElementById('specs') || document.querySelector('[data-spec-panel]');
      var panel = specSection && specSection.hasAttribute('data-spec-panel')
        ? specSection
        : document.querySelector('[data-spec-panel]');
      if (panel) openSpecPanel(panel);
      scrollToEl(specSection || panel);
      return;
    }
    if (id === 'faq' || id.indexOf('faq-') === 0) {
      var faqSection = document.getElementById('faq');
      var faqItem = id.indexOf('faq-') === 0 ? document.getElementById(id) : null;
      if (faqItem && faqItem.hasAttribute('data-faq-item')) {
        openFaqItem(faqItem);
        window.setTimeout(function () {
          scrollToEl(faqItem);
        }, 280);
        return;
      }
      scrollToEl(faqSection);
      return;
    }
    var target =
      document.getElementById(id) ||
      (id === 'reserve' ? document.getElementById('reserve') : null) ||
      (id === 'swap' ? document.getElementById('swap') || document.getElementById('swap-video') : null);
    if (target) scrollToEl(target);
  }


  var OrderStore = {
    KEY: 'valtora_order_lines',
    LAST_KEY: 'valtora_last_order',
    parseBasket: function (raw) {
      if (!raw) return null;
      try {
        var data = JSON.parse(raw);
        if (!data || !Array.isArray(data.lines)) return null;
        return data;
      } catch (e) {
        return null;
      }
    },
    stampOf: function (data) {
      if (!data) return 0;
      var n = Number(data.updatedAt);
      return isFinite(n) && n > 0 ? n : 0;
    },
    persistBoth: function (data) {
      var payload = JSON.stringify(data);
      try {
        sessionStorage.setItem(this.KEY, payload);
      } catch (e) {}
      try {
        localStorage.setItem(this.KEY, payload);
      } catch (e2) {}
      return data;
    },
    /**
     * Pick the newest basket. Never prefer "more lines" - that resurrected
     * sizes the shopper had already removed when session/local drifted.
     */
    chooseFreshest: function (sessData, localData) {
      var s = this.stampOf(sessData);
      var l = this.stampOf(localData);
      if (s && l) return l > s ? localData : sessData;
      if (s) return sessData;
      if (l) return localData;
      // Legacy unstamped payloads.
      if (sessData && localData) {
        // Recover basket when this tab's session is empty but local still has
        // lines (multi-page hop). Never prefer local only because it is fuller —
        // that resurrected removed sizes.
        if ((!sessData.lines || !sessData.lines.length) && localData.lines && localData.lines.length) {
          return localData;
        }
        return sessData;
      }
      return sessData || localData;
    },
    read: function () {
      try {
        var sessRaw = null;
        var localRaw = null;
        try {
          sessRaw = sessionStorage.getItem(this.KEY);
        } catch (e) {}
        try {
          localRaw = localStorage.getItem(this.KEY);
        } catch (e2) {}
        var sessData = this.parseBasket(sessRaw);
        var localData = this.parseBasket(localRaw);
        var data = this.chooseFreshest(sessData, localData);
        if (!data) return { lines: [], updatedAt: Date.now() };
        if (!data.updatedAt) data.updatedAt = Date.now();
        var before = data.lines.length;
        data.lines = data.lines.filter(function (l) {
          if (!isAccessoryType(l.itemType)) return true;
          return accessoryAllowed(l.itemType);
        });
        if (data.lines.length !== before) data.updatedAt = Date.now();
        // Keep both stores aligned to the winner so removals cannot bounce back.
        this.persistBoth(data);
        return data;
      } catch (e) {
        return { lines: [], updatedAt: Date.now() };
      }
    },
    write: function (data) {
      data = data || { lines: [] };
      if (!Array.isArray(data.lines)) data.lines = [];
      data.updatedAt = Date.now();
      this.persistBoth(data);
      syncOrderChrome();
      document.dispatchEvent(new CustomEvent('valtora:order-changed', { detail: data }));
      return data;
    },
    saveLastOrder: function (snapshot) {
      var payload = JSON.stringify(snapshot || { lines: [] });
      try {
        sessionStorage.setItem(this.LAST_KEY, payload);
      } catch (e) {}
      try {
        localStorage.setItem(this.LAST_KEY, payload);
      } catch (e2) {}
      return snapshot;
    },
    readLastOrder: function () {
      try {
        var sessRaw = null;
        var localRaw = null;
        try {
          sessRaw = sessionStorage.getItem(this.LAST_KEY);
        } catch (e) {}
        try {
          localRaw = localStorage.getItem(this.LAST_KEY);
        } catch (e2) {}
        var sessData = sessRaw ? JSON.parse(sessRaw) : null;
        var localData = localRaw ? JSON.parse(localRaw) : null;
        var sessLines = sessData && Array.isArray(sessData.lines) ? sessData.lines : [];
        var localLines = localData && Array.isArray(localData.lines) ? localData.lines : [];
        // Last-order is a snapshot after checkout - prefer whichever has content.
        if (localLines.length > sessLines.length) return localData;
        return sessData || localData;
      } catch (e) {
        return null;
      }
    },
    lines: function () {
      return this.read().lines;
    },
    units: function (lines) {
      lines = lines || this.lines();
      return lines.reduce(function (sum, line) {
        return sum + (parseInt(line.quantity, 10) || 0);
      }, 0);
    },
    orderValueCents: function (lines) {
      lines = lines || this.lines();
      return lines.reduce(function (sum, line) {
        return sum + linePriceCents(line) * (parseInt(line.quantity, 10) || 0);
      }, 0);
    },
    orderValue: function (lines) {
      return this.orderValueCents(lines) / 100;
    },
    addLine: function (line) {
      if (line && isAccessoryType(line.itemType) && !accessoryAllowed(line.itemType)) {
        return this.read();
      }
      var data = this.read();
      var existing = data.lines.find(function (l) {
        return (
          l.itemType === line.itemType &&
          l.sizeId === line.sizeId &&
          l.firmness === line.firmness &&
          (l.colour || '') === (line.colour || '') &&
          (l.sleep || '') === (line.sleep || '')
        );
      });
      if (existing) {
        existing.quantity =
          (parseInt(existing.quantity, 10) || 0) + (parseInt(line.quantity, 10) || 1);
        if (line.priceRaw != null) existing.priceRaw = line.priceRaw;
        if (line.unitPrice) existing.unitPrice = line.unitPrice;
      } else {
        line.key = line.itemType + '-' + line.sizeId + '-' + Date.now();
        data.lines.push(line);
      }
      return this.write(data);
    },
    upsertMattressLine: function (line) {
      var data = this.read();
      var qty = parseInt(line.quantity, 10) || 0;
      var idx = data.lines.findIndex(function (l) {
        return (l.itemType === 'mattress' || !l.itemType) && l.sizeId === line.sizeId;
      });
      if (qty <= 0) {
        if (idx >= 0) data.lines.splice(idx, 1);
        return this.write(data);
      }
      if (idx >= 0) {
        var cur = data.lines[idx];
        cur.quantity = qty;
        cur.label = line.label || cur.label;
        cur.dims = line.dims || cur.dims;
        cur.unitPrice = line.unitPrice || cur.unitPrice;
        cur.priceRaw = line.priceRaw != null ? line.priceRaw : cur.priceRaw;
        cur.variantId = line.variantId || cur.variantId;
        cur.firmness = line.firmness || cur.firmness;
        cur.market = line.market || cur.market;
        cur.leadWindow = line.leadWindow || cur.leadWindow;
        cur.leadMin = line.leadMin != null ? line.leadMin : cur.leadMin;
        cur.leadMax = line.leadMax != null ? line.leadMax : cur.leadMax;
        cur.itemType = 'mattress';
      } else {
        line.itemType = 'mattress';
        line.key = 'mattress-' + line.sizeId + '-' + Date.now();
        data.lines.push(line);
      }
      return this.write(data);
    },
    removeLine: function (key) {
      var data = this.read();
      if (!key) return this.write(data);
      var before = data.lines.length;
      data.lines = data.lines.filter(function (l) {
        return l.key !== key;
      });
      // Fallback if UI key drifted: also match sizeId.
      if (data.lines.length === before) {
        data.lines = data.lines.filter(function (l) {
          return l.sizeId !== key;
        });
      }
      return this.write(data);
    },
    removeMattressSize: function (sizeId) {
      var data = this.read();
      data.lines = data.lines.filter(function (l) {
        if (isAccessoryType(l.itemType)) return true;
        return l.sizeId !== sizeId;
      });
      return this.write(data);
    },
    clear: function () {
      return this.write({ lines: [] });
    },
  };

  function isSuccessfulOrderSurface(url) {
    var s = String(url || '');
    return /thank_you/i.test(s) || /\/checkouts\/[^/?#]+\/thank/i.test(s);
  }

  /**
   * Re-read valtora_order_lines and paint chrome. Safe on bfcache Back
   * (pageshow), first paint, and return from /cart or /pages/checkout.
   * Does not write empty - read() only aligns the freshest stamped payload.
   */
  function restoreBasketUi() {
    var data = { lines: [] };
    try {
      data = OrderStore.read();
    } catch (e) {}
    syncOrderChrome();
    document.dispatchEvent(new CustomEvent('valtora:order-changed', { detail: data }));
    return data;
  }

  function comfortTopsEnabled() {
    var el =
      document.body ||
      document.querySelector('[data-comfort-tops-enabled]') ||
      document.querySelector('[data-size-reserve]') ||
      document.querySelector('[data-comfort-top]');
    if (!el) return false;
    return el.getAttribute('data-comfort-tops-enabled') === 'true';
  }

  function lineLeadDays(line) {
    var max = parseInt(line && line.leadMax, 10) || 0;
    if ((line && line.leadUnit) === 'days') return max;
    return max * 7;
  }

  function resolveCartLeadTime(lines) {
    var winner = null;
    var winnerDays = 0;
    (lines || []).forEach(function (l) {
      var days = lineLeadDays(l);
      if (days >= winnerDays) {
        winnerDays = days;
        winner = l;
      }
    });
    var types = { mattress: false, top: false, parcel: false };
    (lines || []).forEach(function (l) {
      if (l.itemType === 'top') types.top = true;
      else if (l.itemType === 'sheets' || l.itemType === 'pillows') types.parcel = true;
      else types.mattress = true;
    });
    var mix = 'mattress';
    if (types.mattress && (types.top || types.parcel)) mix = 'mixed';
    else if (types.top && types.parcel) mix = 'mixed';
    else if (types.top) mix = 'top';
    else if (types.parcel) mix = 'parcel';
    var unit = (winner && winner.leadUnit) || 'weeks';
    var min = winner ? parseInt(winner.leadMin, 10) || 0 : 0;
    var max = winner ? parseInt(winner.leadMax, 10) || 0 : 0;
    var display = min === max ? max + ' ' + unit : min + ' to ' + max + ' ' + unit;
    return {
      min: min,
      max: max,
      unit: unit,
      display: display,
      mix: mix,
    };
  }

  var HOME_SECTION_IDS = {
    swap: 1,
    'swap-video': 1,
    specs: 1,
    lifestyle: 1,
    reserve: 1,
    founder: 1,
    faq: 1,
    'cool-touch': 1,
    measure: 1,
    journal: 1,
  };

  function homeRootHref() {
    var routes = (window.ValtoraTheme && window.ValtoraTheme.routes) || {};
    if (routes.root != null && String(routes.root) !== '') {
      return String(routes.root);
    }
    var path = location.pathname || '';
    if (/\.html$/i.test(path) && (/\/pages\//.test(path) || /\/blog\//.test(path))) {
      return '../index.html';
    }
    return '/';
  }

  function homeSectionHref(hash) {
    var id = String(hash || '').replace(/^#/, '').split('?')[0];
    if (!id) return homeRootHref();
    if (document.getElementById(id)) return '#' + id;
    var root = homeRootHref();
    if (/\.html$/i.test(root)) return root + '#' + id;
    if (root.charAt(root.length - 1) !== '/') root += '/';
    return root + '#' + id;
  }

  function sizesAndPricesHref() {
    return homeSectionHref('reserve');
  }

  function rewriteHomeSectionLinks() {
    var anchors = document.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#') continue;
      var id = href.slice(1).split('?')[0];
      if (!HOME_SECTION_IDS[id]) continue;
      if (document.getElementById(id)) continue;
      a.setAttribute('href', homeSectionHref(id));
    }
  }

  function resolveCheckoutHref(el) {
    if (!el) return reviewOrderUrl();
    var stored = el.getAttribute('data-checkout-href');
    if (stored) return stored;
    var href = el.getAttribute('href') || '';
    if (href && href.charAt(0) !== '#' && /checkout/i.test(href)) {
      el.setAttribute('data-checkout-href', href);
      return href;
    }
    var fallback = reviewOrderUrl();
    el.setAttribute('data-checkout-href', fallback);
    return fallback;
  }

  function applyOrderCtaLabels(hasLines) {
    // Side basket on #reserve: hide CTA when empty (already on sizes). With lines → Checkout.
    // Floating bar: empty → See sizes and prices; lined → Checkout.
    var sizesHref = sizesAndPricesHref();
    document.querySelectorAll('[data-reserve-continue]').forEach(function (el) {
      if (el.hasAttribute('data-float-continue')) return;
      var wrap = el.closest('[data-order-retail]');
      if (wrap) {
        wrap.hidden = !hasLines;
        if (hasLines) wrap.removeAttribute('hidden');
        else wrap.setAttribute('hidden', '');
      }
      el.textContent = 'Checkout';
      if (!hasLines) {
        el.setAttribute('aria-disabled', 'true');
        return;
      }
      var checkoutHref = resolveCheckoutHref(el);
      if (el.tagName === 'A' || el.tagName === 'a') {
        el.setAttribute('href', checkoutHref);
        el.setAttribute('aria-disabled', 'false');
        el.removeAttribute('disabled');
      } else {
        el.disabled = false;
        el.setAttribute('aria-disabled', 'false');
      }
    });
    document.querySelectorAll('[data-float-continue]').forEach(function (el) {
      var checkoutHref = resolveCheckoutHref(el);
      var landing = document.querySelector('[data-lp-configure]');
      var landingCart = landing && (landing.getAttribute('data-checkout-path') || '/cart');
      var label = 'See sizes and prices';
      var href = sizesHref;
      if (hasLines) {
        if (landing && landingCart) {
          label = 'Continue';
          href = landingCart;
        } else {
          label = 'Checkout';
          href = checkoutHref;
        }
      }
      el.textContent = label;
      if (el.tagName === 'A' || el.tagName === 'a') {
        el.setAttribute('href', href);
        el.setAttribute('aria-disabled', 'false');
        el.removeAttribute('disabled');
      } else {
        el.disabled = false;
        el.setAttribute('aria-disabled', 'false');
      }
    });
  }

  function mattressUnitsFromLines(lines) {
    return (lines || []).reduce(function (sum, line) {
      if (isAccessoryType(line.itemType)) return sum;
      return sum + (parseInt(line.quantity, 10) || 0);
    }, 0);
  }

  var paintingSticky = false;

  function basketHasItems() {
    var lines = OrderStore.lines();
    return lines.length > 0 || mattressUnitsFromLines(lines) > 0;
  }

  function paintSticky() {
    paintFloatBasketFromStore();
  }

  document.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
    if (!e.target || !e.target.closest) return;
    if (!e.target.closest('[data-size-pick], [data-qty-inc], .size-row, .size-option')) return;
    paintSticky();
  });

  function paintFloatBasketFromStore() {
    if (paintingSticky) return;
    paintingSticky = true;
    try {
      var bar = document.querySelector('[data-float-basket], [data-sticky-reserve]');
      var countEl = document.querySelector('[data-float-count]');
      var totalEl = document.querySelector('[data-float-total]');
      var continueEls = document.querySelectorAll('[data-float-continue]');
      if (!bar && !countEl && !totalEl && !continueEls.length) return;
      var lines = OrderStore.lines();
      var n = mattressUnitsFromLines(lines);
      var hasLines = lines.length > 0 || n > 0;
      var totalText = hasLines ? formatOrderTotal(lines) : '';
      if (countEl) countEl.textContent = hasLines ? (n === 1 ? '1 MATTRESS' : n + ' MATTRESSES') : 'Choose a size';
      if (totalEl) totalEl.textContent = hasLines ? totalText || '-' : '';
      applyOrderCtaLabels(hasLines);
      if (bar) {
        bar.classList.toggle('has-items', hasLines);
        bar.classList.toggle('is-active', hasLines);
        if (hasLines) {
          bar.hidden = false;
          bar.removeAttribute('hidden');
          document.body.classList.add('has-sticky-reserve');
        }
      }
      try {
        document.dispatchEvent(
          new CustomEvent('valtora:float-basket-mode', { detail: { hasItems: hasLines } })
        );
      } catch (e) {}
    } finally {
      paintingSticky = false;
    }
  }

  function syncOrderChrome() {
    var lines = OrderStore.lines();
    var lineCount = lines.length;
    var show = lineCount > 0;
    document.querySelectorAll('[data-order-link]').forEach(function (el) {
      el.hidden = !show;
    });
    document.querySelectorAll('[data-order-count]').forEach(function (el) {
      el.textContent = String(lineCount);
      el.hidden = !show;
    });
    paintFloatBasketFromStore();
  }

  function reviewOrderUrl() {
    var href = '';
    var tagged = document.querySelector('[data-size-reserve][data-checkout-path], [data-checkout-page][data-checkout-path]');
    if (!tagged) tagged = document.querySelector('[data-lp-configure][data-checkout-path]');
    if (tagged && tagged.getAttribute('data-checkout-path')) {
      href = tagged.getAttribute('data-checkout-path');
    }
    if (!href) {
      var link = document.querySelector(
        '[data-float-continue][data-checkout-href], [data-reserve-continue][data-checkout-href], [data-reserve-continue][href], [data-float-continue][href]'
      );
      if (link) {
        var stored = link.getAttribute('data-checkout-href');
        if (stored) href = stored;
        else {
          var raw = link.getAttribute('href');
          if (raw && raw.charAt(0) !== '#' && /checkout/i.test(raw)) href = raw;
        }
      }
    }
    if (!href && window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.review) {
      href = window.ValtoraTheme.routes.review;
    }
    if (!href && /checkout\.html$/.test(location.pathname)) href = location.pathname;
    if (!href && /\/pages\//.test(location.pathname)) {
      href = location.pathname.replace(/[^/]+$/, 'checkout.html');
    }
    if (!href && (/index\.html$/.test(location.pathname) || location.port === '5173' || location.port === '5190')) {
      href = './pages/checkout.html';
    }
    if (!href) href = '/pages/checkout';
    return withPersistedUtm(href);
  }

  function initSizeReserve(root) {
    if (!root || root.getAttribute('data-reserve-ready') === '1') return;
    root.setAttribute('data-reserve-ready', '1');

    var addLabel = (
      root.getAttribute('data-add-label') ||
      (window.ValtoraTheme && window.ValtoraTheme.sizeAddLabel) ||
      'Add'
    ).trim() || 'Add';
    var market = root.getAttribute('data-market') || detectMarket();
    var paymentMode = root.getAttribute('data-payment-mode') || 'full';
    var leadtimePlacement = root.getAttribute('data-leadtime-placement') || 'staged';
    var financeName = root.getAttribute('data-finance-name') || marketFinanceName(market);
    var list = root.querySelector('[data-size-list]');
    if (list) list.setAttribute('aria-multiselectable', 'true');
    var selected = root.querySelector('[data-selected-size]');
    var selectedDims = root.querySelector('[data-selected-dims]');
    var form = root.querySelector('[data-reserve-form]');
    var priceEl = root.querySelector('[data-display-price]');
    var bnplEl = root.querySelector('[data-bnpl-monthly]');
    var statusEl = root.querySelector('[data-reserve-status]');
    var availablePanel = root.querySelector('[data-reserve-available]');
    var notifyPanel = root.querySelector('[data-reserve-notify]');
    var requestPanel = root.querySelector('[data-reserve-request]');
    var requestTrigger = root.querySelector('[data-size-request-trigger]');
    var requestSizeInput = root.querySelector('[data-request-size-input]');
    var requestNotesInput = root.querySelector('[data-request-notes-input]');
    var requestWhatsApp = root.querySelector('[data-request-whatsapp]');
    var notifySizeInput = root.querySelector('[data-notify-size]');
    var notifyBodyInput = root.querySelector('[data-notify-body]');
    var continueBtn = root.querySelector('[data-reserve-continue]');
    var stageB = root.querySelector('[data-reserve-stage-b]');
    var stageExpanded = false;
    var qtyInput = root.querySelector('[data-qty-input]');
    var retailWrap = root.querySelector('[data-order-retail]');
    var linesList = root.querySelector('[data-order-lines-list]');
    var orderTotalEl = root.querySelector('[data-order-total]');
    var orderTotalLabel = root.querySelector('[data-order-total-label]');
    var topSuggest = root.querySelector('[data-order-top-suggest]');
    var addTopBtn = root.querySelector('[data-order-add-top]');
    var stageBSummary = root.querySelector('[data-stageb-summary]');
    var payLabel = root.querySelector('[data-pay-label]');
    var backBtn = root.querySelector('[data-reserve-back]');
    var qtyService = root.querySelector('[data-order-qty-service]');
    var largeTerms = root.querySelector('[data-order-large-terms]');
    var largeAck = root.querySelector('[data-order-large-ack]');
    var largeCopy = root.querySelector('[data-order-large-copy]');
    var leadWindow = root.getAttribute('data-lead-window') || '8 to 10 weeks';
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 8;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 10;
    var comfortTopPrice = root.getAttribute('data-comfort-top-price') || '';
    var comfortTopVariant = root.getAttribute('data-comfort-top-variant') || '';
    var defaultFirmness = root.getAttribute('data-default-firmness') || 'Medium / Medium firm';
    var largeThresholdGb = parseInt(root.getAttribute('data-large-order-threshold-gb'), 10) || 10000;
    var largeThresholdAe = parseInt(root.getAttribute('data-large-order-threshold-ae'), 10) || 47000;
    var unitPriceText = '';
    var largeOrderTracked = false;

    function getQty() {
      var n = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      if (!isFinite(n) || n < 1) n = 1;
      if (n > 999) n = 999;
      return n;
    }

    function largeOrderThreshold() {
      return market === 'ae' ? largeThresholdAe : largeThresholdGb;
    }

    function isLargeOrderValue(value) {
      return value >= largeOrderThreshold();
    }

    function normalizeSizeId(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/\(uae\)/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    function lineQtyForSize(sizeId, variantId) {
      var nid = normalizeSizeId(sizeId);
      var vid = variantId ? String(variantId) : '';
      var line = OrderStore.lines().find(function (l) {
        if (l.itemType === 'top') return false;
        if (vid && String(l.variantId || l.variant_id || '') === vid) return true;
        if (l.sizeId === sizeId) return true;
        if (normalizeSizeId(l.sizeId) === nid) return true;
        if (normalizeSizeId(l.label) === nid) return true;
        return false;
      });
      return line ? parseInt(line.quantity, 10) || 0 : 0;
    }

    function sizeFromRow(row) {
      if (!row) return currentSize();
      return {
        id: row.getAttribute('data-size-id') || '',
        label: row.getAttribute('data-size-label') || '',
        dims: row.getAttribute('data-size-dims') || '',
        price: row.getAttribute('data-size-price') || '',
        price_raw: parseInt(row.getAttribute('data-size-price-raw'), 10) || 0,
        firmness: defaultFirmness,
        variantId: row.getAttribute('data-size-variant') || '',
        available: row.getAttribute('data-available') !== 'false' &&
          row.getAttribute('data-request-size') !== 'true',
      };
    }

    function syncSizeQtyUi() {
      if (!list) return;
      list.querySelectorAll('.size-row, .size-option').forEach(function (btn) {
        var wrap = btn.querySelector('[data-size-qty]');
        var valEl = btn.querySelector('[data-qty-val]');
        var available = btn.getAttribute('data-available') !== 'false';
        var sizeId = btn.getAttribute('data-size-id');
        var q = lineQtyForSize(sizeId, btn.getAttribute('data-size-variant'));
        var inBasket = q > 0 && btn.getAttribute('data-request-size') !== 'true';
        btn.classList.toggle('is-in-basket', inBasket);
        btn.setAttribute('data-qty', String(q));
        btn.setAttribute('aria-selected', inBasket ? 'true' : 'false');
        if (valEl) valEl.textContent = String(q);
        if (wrap) wrap.hidden = !available;
        var dec = btn.querySelector('[data-qty-dec]');
        if (dec) dec.disabled = q < 1;
      });
    }

    function updateContinueState() {
      var hasLines = displayLines().length > 0;
      applyOrderCtaLabels(hasLines);
    }

    function upsertActiveMattress(qty, opts) {
      opts = opts || {};
      var size = opts.size || currentSize();
      if (!size.available || !size.id || size.id === 'custom-request') return;
      if (qtyInput) qtyInput.value = String(Math.max(1, qty));
      unitPriceText = size.price || unitPriceText;
      var before = OrderStore.lines().filter(function (l) {
        return l.itemType === 'mattress' || !l.itemType;
      }).length;
      OrderStore.upsertMattressLine({
        itemType: 'mattress',
        sizeId: size.id,
        label: size.label,
        dims: size.dims,
        firmness: defaultFirmness,
        unitPrice: size.price,
        priceRaw: sizePriceRaw(size),
        variantId: size.variantId || size.variant_id || '',
        quantity: qty,
        market: market,
        leadWindow: leadWindow,
        leadMin: leadMin,
        leadMax: leadMax,
      });
      if (!opts.silent) {
        if (opts.qtyChanged) {
          vTrack('quantity_changed', eventParams({
            size: size.id,
            quantity: qty,
          }));
        } else {
          vTrack('add_to_basket', eventParams({
            size: size.id,
            value: sizePriceRaw(size) / 100 || undefined,
            trial_eligible: size.id !== 'emperor',
          }));
        }
      }
      var after = OrderStore.lines().filter(function (l) {
        return l.itemType === 'mattress' || !l.itemType;
      }).length;
      if (!opts.silent && after >= 2 && after > before) {
        vTrack('add_second_item', {
          item_type: 'mattress',
          total_lines: OrderStore.lines().length,
          units: OrderStore.units(),
        });
      }
      syncSizeQtyUi();
      refreshTotals();
    }

    function refreshTotals() {
      var lines = OrderStore.lines();
      if (qtyService) qtyService.hidden = mattressUnits(lines) <= 4;
      renderOrderPanel();
    }

    function currentLineDraft() {
      var size = currentSize();
      return {
        itemType: 'mattress',
        sizeId: size.id,
        label: size.label,
        dims: size.dims,
        firmness: defaultFirmness,
        unitPrice: size.price,
        priceRaw: sizePriceRaw(size),
        variantId: size.variantId || size.variant_id || '',
        quantity: getQty(),
        market: market,
        leadWindow: leadWindow,
        leadMin: leadMin,
        leadMax: leadMax,
      };
    }

    function displayLines() {
      return OrderStore.lines().slice();
    }

    function mattressUnits(lines) {
      return (lines || []).reduce(function (sum, l) {
        if (l.itemType === 'top') return sum;
        return sum + (parseInt(l.quantity, 10) || 0);
      }, 0);
    }

    function updateFloatBasket() {
      paintSticky();
    }

    function renderOrderPanel() {
      var lines = displayLines();
      var totalVal = OrderStore.orderValue(lines);
      var units = mattressUnits(lines);
      var totalText = totalVal ? formatOrderTotal(lines, market) : '-';

      if (lines.length && !sessionFlag('valtora_view_order_summary')) {
        try { sessionStorage.setItem('valtora_view_order_summary', '1'); } catch (e) {}
        vTrack('view_order_summary', {
          line_count: lines.length,
          order_value: totalVal,
          units: OrderStore.units(lines),
        });
      }

      if (linesList) {
        if (!lines.length) {
          linesList.innerHTML =
            '<li class="order-basket__empty">Select a size to add it to your order.</li>';
        } else {
          linesList.innerHTML = lines
            .map(function (line) {
              var qty = parseInt(line.quantity, 10) || 0;
              var total = formatLineTotal(line);
              var title =
                orderLineTitle(line);
              var meta = line.dims || '';
              var remove =
                line.key
                  ? '<button type="button" class="order-basket__remove" data-order-remove="' +
                    line.key +
                    '">Remove</button>'
                  : '';
              return (
                '<li class="order-basket__line" data-order-line-key="' +
                (line.key || '') +
                '">' +
                '<span class="order-basket__line-l">' +
                title +
                (meta ? '<small>' + meta + '</small>' : '') +
                '</span>' +
                '<span class="order-basket__line-r">' +
                total +
                remove +
                '</span>' +
                '</li>'
              );
            })
            .join('');
        }
      }

      if (orderTotalEl) orderTotalEl.textContent = totalText;
      if (orderTotalLabel) {
        orderTotalLabel.textContent = units > 1 ? 'Total · ' + units + ' mattresses' : 'Total';
      }

      if (retailWrap) {
        retailWrap.hidden = !lines.length;
        if (lines.length) retailWrap.removeAttribute('hidden');
        else retailWrap.setAttribute('hidden', '');
      }
      paintBnplMonthly(bnplEl, {
        lines: lines,
        orderVal: totalVal,
        sample: (lines[0] && lines[0].unitPrice) || '',
        market: root.getAttribute('data-market') || market || detectMarket(),
      });

      if (stageBSummary) {
        var mattressLines = lines.filter(isMattressLine);
        stageBSummary.textContent = mattressLines
          .map(function (l) {
            return (l.label || '') + ' · ' + (parseInt(l.quantity, 10) || 0);
          })
          .filter(Boolean)
          .join(', ');
      }

      if (payLabel && (sample || totalVal)) {
        payLabel.textContent = 'Pay ' + totalText;
      }

      updateFloatBasket(lines, totalText, units);

      if (topSuggest) topSuggest.hidden = true;

      var large = isLargeOrderValue(totalVal);
      if (largeTerms) largeTerms.hidden = !large;
      if (large && largeCopy) {
        var thrLabel = formatMoneyFromCents(largeOrderThreshold(market) * 100, market);
        largeCopy.textContent =
          'Orders of ' +
          thrLabel +
          ' or more are refundable until production is committed - typically within 5 working days of order - and non-refundable after that. This protects the factory commitment on larger made-to-order runs. Under that amount, you can still cancel any time before dispatch for a full refund.';
      }
      if (large && !largeOrderTracked) {
        largeOrderTracked = true;
        vTrack('large_order', {
          order_value: totalVal,
          units: OrderStore.units(lines),
          sizes: lines.map(function (l) { return l.label; }).filter(Boolean).join(', '),
          line_count: lines.length,
        });
      }
      if (!large) {
        largeOrderTracked = false;
        if (largeAck) largeAck.checked = false;
      }
      updateContinueState();
    }

    if (stageB) {
      stageB.classList.add('is-collapsed');
    }

    var sizes = [];
    var configEl = null;
    var sectionEl = root.closest('section') || root.parentElement;
    if (sectionEl) {
      configEl = sectionEl.querySelector('[data-size-price-config]');
      if (!configEl) {
        var node = sectionEl.previousElementSibling;
        while (node) {
          if (node.getAttribute && node.getAttribute('data-size-price-config') != null) {
            configEl = node;
            break;
          }
          node = node.previousElementSibling;
        }
      }
    }
    if (!configEl) configEl = document.querySelector('[data-size-price-config]');

    var allRows = [];
    if (configEl) {
      try {
        var parsed = JSON.parse(configEl.textContent.trim());
        if (Array.isArray(parsed) && parsed.length) allRows = parsed;
      } catch (e) {}
    }
    function filterSizesForMarket(mkt) {
      return catalogRowsFrom(allRows, catalogIsoForMarket(mkt));
    }
    var selectorTab = marketToTabKey(market);
    sizes = filterSizesForMarket(market);
    if (!sizes.length && root.getAttribute('data-preview') === 'true' && !allRows.length) {
      sizes = (SIZE_MAPS[market] || SIZE_MAPS.gb).slice();
    }

    function eventParams(extra) {
      var size = currentSize();
      var base = {
        market: market,
        payment_mode: paymentMode,
        leadtime_placement: leadtimePlacement,
        size: size.id || '',
      };
      if (extra) {
        Object.keys(extra).forEach(function (k) {
          base[k] = extra[k];
        });
      }
      return base;
    }

    function setMode(mode) {
      // mode: 'available' | 'notify' | 'request'
      if (availablePanel) availablePanel.hidden = mode !== 'available';
      if (notifyPanel) notifyPanel.hidden = mode !== 'notify';
      if (requestPanel) requestPanel.hidden = mode !== 'request';
      if (mode !== 'available') collapseStageB(true);
      // Unavailable / request: move the basket to the bottom float bar (sidebar
      // is taken over by notify / request forms). Available again: float can hide
      // while #reserve is in view — the side cart represents the order.
      try {
        document.documentElement.setAttribute(
          'data-float-basket-force',
          mode === 'notify' || mode === 'request' ? '1' : '0'
        );
        document.dispatchEvent(
          new CustomEvent('valtora:float-basket-mode', { detail: { mode: mode } })
        );
        paintFloatBasketFromStore();
      } catch (e) {}
    }

    function collapseStageB(silent) {
      stageExpanded = false;
      if (stageB) stageB.classList.add('is-collapsed');
      if (continueBtn) continueBtn.setAttribute('aria-expanded', 'false');
      var stageA = root.querySelector('[data-reserve-stage-a]');
      if (stageA) stageA.hidden = false;
      root.classList.remove('is-confirming');
      try {
        var url = new URL(window.location.href);
        if (url.searchParams.get('step') === 'confirm') {
          url.searchParams.delete('step');
          history.replaceState({ valtoraStep: 'basket' }, '', url.toString());
        }
      } catch (e) {}
    }

    function expandStageB() {
      if (leadtimePlacement === 'hidden') return;
      if (!stageB) return;
      stageB.classList.remove('is-collapsed');
      stageExpanded = true;
      if (continueBtn) continueBtn.setAttribute('aria-expanded', 'true');
      var stageA = root.querySelector('[data-reserve-stage-a]');
      if (stageA) stageA.hidden = true;
      // Do not use is-confirming single-column mode — keep sizes + panel layout.
      root.classList.remove('is-confirming');
      try {
        var url = new URL(window.location.href);
        if (url.searchParams.get('step') !== 'confirm') {
          url.searchParams.set('step', 'confirm');
          history.pushState({ valtoraStep: 'confirm' }, '', url.toString());
        }
      } catch (e) {}
      if (!sessionFlag('valtora_view_leadtime_' + (root.getAttribute('data-reserve-instance') || '1'))) {
        try {
          sessionStorage.setItem(
            'valtora_view_leadtime_' + (root.getAttribute('data-reserve-instance') || '1'),
            '1'
          );
        } catch (e) {}
        vTrackOnce('view_leadtime', eventParams({
          line_count: OrderStore.lines().length,
          units: OrderStore.units(),
          order_value: OrderStore.orderValue(),
        }));
      }
      if (payLabel) {
        var linesNow = OrderStore.lines();
        var sampleNow = unitPriceText || (linesNow[0] && linesNow[0].unitPrice) || '';
        var totalNow = OrderStore.orderValue(linesNow);
        var totalTextNow = totalNow ? formatOrderTotal(linesNow, market) : '';
        if (totalTextNow) payLabel.textContent = 'Pay ' + totalTextNow;
        else if (!payLabel.textContent || !String(payLabel.textContent).trim()) {
          payLabel.textContent = 'Pay';
        }
      }
      try {
        stageB.focus({ preventScroll: true });
      } catch (e) {
        try {
          stageB.focus();
        } catch (e2) {}
      }
      stageB.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function syncSticky() {
      paintSticky();
    }

    function updateRequestWhatsApp() {
      if (!requestWhatsApp) return;
      var base = requestWhatsApp.getAttribute('data-wa-base') || requestWhatsApp.getAttribute('href') || '';
      if (!base || base === '#') return;
      var sizeVal = (requestSizeInput && requestSizeInput.value.trim()) || '';
      var notesVal = (requestNotesInput && requestNotesInput.value.trim()) || '';
      var msg =
        'Hi - I would like to request a custom mattress size.\n\nSize needed: ' +
        (sizeVal || '[please specify]') +
        '\nMarket: ' +
        String(market).toUpperCase();
      if (notesVal) msg += '\nNotes: ' + notesVal;
      var sep = base.indexOf('?') >= 0 ? '&' : '?';
      requestWhatsApp.href = base.split('?')[0] + sep + 'text=' + encodeURIComponent(msg);
    }

    function applySelection(btn, opts) {
      if (!btn) return;
      opts = opts || {};
      var isRequest = btn.getAttribute('data-request-size') === 'true';
      var available = !isRequest && btn.getAttribute('data-available') !== 'false';
      if (list) {
        list.querySelectorAll('.size-option').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
      }
      if (requestTrigger) {
        requestTrigger.classList.toggle('is-active', isRequest);
        requestTrigger.setAttribute('aria-selected', isRequest ? 'true' : 'false');
      }
      if (selected) selected.textContent = btn.getAttribute('data-size-label');
      if (selectedDims) selectedDims.textContent = btn.getAttribute('data-size-dims');
      var priceText = isRequest ? 'Discuss with us' : btn.getAttribute('data-size-price') || '';
      unitPriceText = isRequest ? '' : priceText;
      if (!opts.silent) collapseStageB(true);
      setMode(isRequest ? 'request' : available ? 'available' : 'notify');
      syncSticky();
      if (isRequest) {
        if (priceEl) priceEl.textContent = priceText;
        refreshTotals();
      } else if (available) {
        var existingQty = lineQtyForSize(
          btn.getAttribute('data-size-id'),
          btn.getAttribute('data-size-variant')
        );
        if (qtyInput) qtyInput.value = String(existingQty > 0 ? existingQty : 1);
        syncSizeQtyUi();
        refreshTotals();
        if (!opts.silent) {
          vTrack('select_size', eventParams({
            size: btn.getAttribute('data-size-label') || btn.getAttribute('data-size-id') || '',
            quantity: existingQty > 0 ? existingQty : 1,
            value: sizePriceRaw(currentSize()) / 100 || undefined,
            price: sizePriceRaw(currentSize()) / 100 || undefined,
          }));
          if (root.getAttribute('data-configure-funnel') === 'true') {
            vTrackOnce('configure_complete', eventParams({
              size: btn.getAttribute('data-size-id') || '',
            }));
          }
        }
      } else {
        syncSizeQtyUi();
        refreshTotals();
      }
      if (isRequest) {
        updateRequestWhatsApp();
        if (requestSizeInput) requestSizeInput.focus();
        return;
      }

      var sizeLabel = btn.getAttribute('data-size-label') || '';
      var sizeDims = btn.getAttribute('data-size-dims') || '';
      var sizeId = btn.getAttribute('data-size-id') || '';
      if (notifySizeInput) {
        notifySizeInput.value = sizeLabel + ' - ' + sizeDims + ' (' + sizeId + ')';
      }
      if (notifyBodyInput) {
        notifyBodyInput.value =
            'Please notify me when this size opens. Not in this allocation.\n\nSize: ' +
          sizeLabel +
          ' - ' +
          sizeDims +
          '\nSize ID: ' +
          sizeId +
          '\nMarket: ' +
          String(market).toUpperCase();
      }
    }

    function preferredIndex() {
      var pre = '';
      try {
        pre = new URLSearchParams(location.search).get('size') || '';
      } catch (e) {}
      pre = String(pre)
        .toLowerCase()
        .replace(/_/g, '-');
      if (pre) {
        var preIdx = sizes.findIndex(function (s) {
          return s.id === pre || normalizeSizeId(s.label) === pre || normalizeSizeId(s.id) === pre;
        });
        if (preIdx >= 0) return preIdx;
      }
      var preferredIds =
        market === 'gb'
          ? ['king', 'double', 'queen']
          : market === 'eu'
            ? ['european-king']
            : ['queen', 'king'];
      var i;
      for (i = 0; i < sizes.length; i++) {
        if (sizes[i].popular && sizes[i].available !== false) return i;
      }
      for (i = 0; i < preferredIds.length; i++) {
        var id = preferredIds[i];
        var idx = sizes.findIndex(function (s) {
          return s.id === id && s.available !== false;
        });
        if (idx >= 0) return idx;
      }
      var firstAvail = sizes.findIndex(function (s) {
        return s.available !== false;
      });
      return firstAvail >= 0 ? firstAvail : 0;
    }

    function rebuildSizeButtons() {
      if (!list) return;
      paintMarketTabs(root.querySelector('[data-size-markets]'));
      list.innerHTML = sizes
        .map(function (s) {
          var mapped = s;
          if (!s.dims && !s.width_cm) {
            var fromMap = (SIZE_MAPS[market] || SIZE_MAPS.gb).filter(function (row) {
              return row.id === s.id;
            })[0];
            if (fromMap) {
              mapped = Object.assign({}, s, { dims: fromMap.dims, label: s.label || fromMap.label });
            }
          }
          return buildSizeTileMarkup(mapped, selectorTab, addLabel);
        })
        .join('');
      var requestEntry = root.querySelector('.size-request-entry');
      if (requestEntry && list.contains(requestEntry) === false) {
        /* request trigger stays outside the list */
      }
      hydratePolicyStrips(root);
      syncSizeQtyUi();
    }

    if (list) {
      rebuildSizeButtons();
    }

    root._valtoraOnMarketChange = function () {
      market = detectMarket();
      if (!isSizeMarket(market)) market = 'gb';
      root.setAttribute('data-market', market);
      paymentMode = root.getAttribute('data-payment-mode') || paymentMode || 'full';
      leadtimePlacement = root.getAttribute('data-leadtime-placement') || leadtimePlacement || 'staged';
      financeName =
        root.getAttribute('data-finance-name') || marketFinanceName(market);
      selectorTab = marketToTabKey(market);
      sizes = filterSizesForMarket(market);
      if (!sizes.length && root.getAttribute('data-preview') === 'true' && !allRows.length) {
        sizes = (SIZE_MAPS[market] || SIZE_MAPS.gb).slice();
      }
      rebuildSizeButtons();
      if (typeof renderOrderPanel === 'function') renderOrderPanel();
      if (typeof refreshTotals === 'function') refreshTotals();
    };

    paintMarketTabs(root.querySelector('[data-size-markets]'));

    function currentSize() {
      var active =
        (list && list.querySelector('.size-option.is-active')) ||
        (requestTrigger && requestTrigger.classList.contains('is-active') ? requestTrigger : null);
      var fallback = sizes[0] || { id: '', label: '', dims: '', price: '', available: true };
      var id = active ? active.getAttribute('data-size-id') : fallback.id;
      var fromList =
        sizes.find(function (s) {
          return s.id === id;
        }) || fallback;
      return {
        id: id,
        label: active ? active.getAttribute('data-size-label') : fallback.label,
        dims: active ? active.getAttribute('data-size-dims') : fallback.dims,
        price: active ? active.getAttribute('data-size-price') : fallback.price || '',
        price_raw:
          parseInt(active && active.getAttribute('data-size-price-raw'), 10) ||
          sizePriceRaw(fromList),
        firmness: defaultFirmness,
        variantId:
          (active && active.getAttribute('data-size-variant')) ||
          fromList.variant_id ||
          fromList.variantId ||
          '',
        available: active
          ? active.getAttribute('data-available') !== 'false' &&
            active.getAttribute('data-request-size') !== 'true'
          : fallback.available !== false,
      };
    }

    function sizeRowTapAddsToBasket() {
      return window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    }

    if (list) {
      list.addEventListener('click', function (e) {
        var dec = e.target.closest('[data-qty-dec]');
        var inc = e.target.closest('[data-qty-inc]');
        var pick = e.target.closest('[data-size-pick]');
        var row = e.target.closest('.size-row, .size-option');
        if (!row) return;
        if ((dec || inc) && row) {
          e.preventDefault();
          e.stopPropagation();
          if (row.getAttribute('data-available') === 'false') return;
          collapseStageB(true);
          var sizeId = row.getAttribute('data-size-id');
          var q = lineQtyForSize(sizeId, row.getAttribute('data-size-variant'));
          if (dec) q -= 1;
          if (inc) q += 1;
          if (q < 1) {
            OrderStore.removeMattressSize(sizeId);
            if (qtyInput) qtyInput.value = '1';
            vTrack('quantity_changed', eventParams({ size: sizeId, quantity: 0 }));
            syncSizeQtyUi();
            refreshTotals();
            updateContinueState();
            paintSticky();
            return;
          }
          upsertActiveMattress(q, { size: sizeFromRow(row), qtyChanged: true });
          updateContinueState();
          paintSticky();
          return;
        }
        if (row.getAttribute('data-available') === 'false') {
          applySelection(row);
          return;
        }
        var existingQty = lineQtyForSize(
          row.getAttribute('data-size-id'),
          row.getAttribute('data-size-variant')
        );
        var addHit =
          pick ||
          e.target.closest('.size-option__add, .size-row__add');
        if (!addHit && existingQty > 0 && !sizeRowTapAddsToBasket()) {
          applySelection(row);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        collapseStageB(true);
        applySelection(row, { silent: true });
        upsertActiveMattress(existingQty + 1, { size: sizeFromRow(row) });
        updateContinueState();
        paintSticky();
      });
      list.addEventListener('pointerup', function (e) {
        if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
        if (!e.target.closest('[data-size-pick], [data-qty-inc], .size-row, .size-option')) return;
        setTimeout(function () { paintSticky(); }, 0);
      });
    }

    if (requestTrigger) {
      requestTrigger.addEventListener('click', function () {
        applySelection(requestTrigger);
      });
    }

    if (requestSizeInput) {
      requestSizeInput.addEventListener('input', updateRequestWhatsApp);
    }
    if (requestNotesInput) {
      requestNotesInput.addEventListener('input', updateRequestWhatsApp);
    }

    var requestForm = root.querySelector('.request-size-form');
    if (requestForm) {
      requestForm.addEventListener('submit', function () {
        var sizeVal = (requestSizeInput && requestSizeInput.value.trim()) || '';
        var notesVal = (requestNotesInput && requestNotesInput.value.trim()) || '';
        var composed =
          'Custom size request\n\nRequested size: ' +
          sizeVal +
          '\nMarket: ' +
          String(market).toUpperCase();
        if (notesVal) composed += '\n\nNotes:\n' + notesVal;
        if (requestNotesInput) {
          requestNotesInput.value = composed;
        }
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', function (e) {
        var size = currentSize();
        if (!size.available) {
          e.preventDefault();
          setMode('notify');
          return;
        }
        if (!OrderStore.lines().length) {
          e.preventDefault();
          var reserve = document.querySelector('[data-reserve-section], #reserve, [id^="reserve"]');
          if (reserve) reserve.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        // V8: fire intent, then navigate to /pages/checkout (payment page).
        vTrackOnce('reserve_intent', eventParams({
          value: OrderStore.orderValue(),
          line_count: OrderStore.lines().length,
          units: OrderStore.units(),
          order_value: OrderStore.orderValue(),
        }));
        var href = resolveCheckoutHref(continueBtn) || reviewOrderUrl();
        continueBtn.setAttribute('href', href);
        if (continueBtn.tagName !== 'A') {
          e.preventDefault();
          window.location.href = href;
          return;
        }
        // Force navigation even if the anchor still pointed at #reserve.
        e.preventDefault();
        window.location.href = href;
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        collapseStageB(true);
        try {
          var url = new URL(window.location.href);
          if (url.searchParams.get('step') === 'confirm') {
            url.searchParams.delete('step');
            history.pushState({ valtoraStep: 'basket' }, '', url.toString());
          }
        } catch (e) {}
        var stageA = root.querySelector('[data-reserve-stage-a]');
        if (stageA) stageA.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    var stagePayBtn = root.querySelector('[data-checkout-pay]');
    if (stagePayBtn) {
      stagePayBtn.addEventListener('click', function () {
        var lines = displayLines();
        if (!lines.length) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Select a size to continue.';
          }
          return;
        }
        var sample = unitPriceText || (lines[0] && lines[0].unitPrice) || '';
        var totalVal = OrderStore.orderValue(lines);
        if (isLargeOrderValue(totalVal) && largeAck && !largeAck.checked) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Please confirm the larger-order terms before checkout.';
          }
          if (largeTerms) largeTerms.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }
        var previewPay =
          root.getAttribute('data-preview') === 'true' ||
          /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ||
          location.protocol === 'file:';
        if (previewPay) {
          vTrack('begin_checkout', {
            value: totalVal,
            order_value: totalVal,
            line_count: lines.length,
            units: OrderStore.units(lines),
            size: checkoutSizeParam(lines),
          });
          var snapshot = {
            lines: lines.map(function (line) {
              return {
                key: line.key,
                itemType: line.itemType,
                sizeId: line.sizeId,
                label: line.label,
                dims: line.dims,
                quantity: parseInt(line.quantity, 10) || 0,
                unitPrice: line.unitPrice,
                market: line.market,
                leadWindow: line.leadWindow || leadWindow,
              };
            }),
            total: formatOrderTotal(lines, market),
            units: OrderStore.units(lines),
            line_count: lines.length,
            order_id: 'PREVIEW-' + Date.now(),
            currency: /£|GBP/i.test(sample) ? 'GBP' : /AED/i.test(sample) ? 'AED' : '',
            value: totalVal,
          };
          OrderStore.saveLastOrder(snapshot);
          OrderStore.clear();
          var confirmed =
            root.getAttribute('data-confirmed-path') ||
            './pages/order-confirmed.html';
          window.location.href = confirmed;
          return;
        }
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Taking you to checkout…';
        }
        checkoutLines(lines).catch(function () {
          if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
        });
      });
    }

    observeDwell(priceEl, 1000, 'valtora_view_price', function () {
      vTrackOnce('view_price', eventParams({
        value: OrderStore.orderValue(),
        line_count: OrderStore.lines().length,
      }));
    });

    // Basket line remove + size-row quantity (V4.1 mockup).
    if (linesList) {
      linesList.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-order-remove]');
        if (!btn) return;
        e.preventDefault();
        var key = btn.getAttribute('data-order-remove');
        var removed = OrderStore.lines().find(function (l) {
          return l.key === key;
        });
        collapseStageB(true);
        if (removed && removed.sizeId) {
          OrderStore.removeMattressSize(removed.sizeId);
        } else {
          OrderStore.removeLine(key);
        }
        syncSizeQtyUi();
        var size = currentSize();
        if (removed && size && size.id === removed.sizeId) {
          if (qtyInput) qtyInput.value = '1';
        }
        refreshTotals();
        updateContinueState();
      });
    }

    document.addEventListener('valtora:order-changed', function () {
      syncSizeQtyUi();
      renderOrderPanel();
      updateContinueState();
    });

    function buildCartPayload(line, variantId, large) {
      var payload = {
        id: Number(variantId),
        quantity: parseInt(line.quantity, 10) || 1,
        properties: {
          Size: (line.label || '') + (line.dims ? ' - ' + line.dims : ''),
          'Size ID': line.sizeId || '',
          Firmness: line.firmness || defaultFirmness,
          Price: line.unitPrice || '',
          Market: String(market).toUpperCase(),
          'Payment mode': paymentMode,
          'Lead time placement': leadtimePlacement,
          'Item type':
            line.itemType === 'top'
              ? 'Comfort layer'
              : line.itemType === 'sheets'
                ? 'Bed sheets'
                : line.itemType === 'pillows'
                  ? 'Pillows'
                  : 'Mattress',
          _lead_min: String(line.leadMin != null ? line.leadMin : leadMin),
          _lead_max: String(line.leadMax != null ? line.leadMax : leadMax),
        },
      };
      if (line.itemType === 'top') {
        payload.properties.Note = 'Comfort layer - not a replacement for the included layer';
      }
      if (large) {
        payload.properties['Order terms'] =
          'Refundable until production commit (typically within 5 working days); non-refundable after';
      }
      var sizeNote = readSizeNote(root);
      if (sizeNote) {
        payload.properties['Anything we should know'] = sizeNote;
      }
      if (paymentMode === 'split') {
        payload.properties['Balance due'] = 'Due before dispatch';
        payload.properties['Split percent'] = root.getAttribute('data-split-percent') || '50';
      }
      if (window.ValtoraUTM) payload = window.ValtoraUTM.applyToCartPayload(payload);
      return payload;
    }

    function checkoutLines(lines) {
      var defaultVariant = form && (form.getAttribute('data-variant-id') || (form.querySelector('[name="id"]') || {}).value);
      var missing = lines.some(function (line) {
        return !(line.variantId || defaultVariant);
      });
      if (missing) {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Assign the mattress product in Size + price + reserve so each size has a Shopify variant.';
        }
        return Promise.reject(new Error('No variant'));
      }
      var units = OrderStore.units(lines);
      var orderValue = OrderStore.orderValue(lines);
      var sample = (lines[0] && lines[0].unitPrice) || unitPriceText;
      var large = isLargeOrderValue(orderValue);
      if (large) {
        if (largeTerms) largeTerms.hidden = false;
        if (!largeAck || !largeAck.checked) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Please confirm the larger-order terms before checkout.';
          }
          if (largeTerms) largeTerms.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return Promise.reject(new Error('Large order acknowledgement required'));
        }
        vTrack('large_order', {
          order_value: orderValue,
          units: units,
          sizes: lines.map(function (l) { return l.label; }).filter(Boolean).join(', '),
          line_count: lines.length,
          acknowledged: true,
        });
      }
      vTrack('begin_checkout', {
        value: orderValue,
        order_value: orderValue,
        line_count: lines.length,
        units: units,
        size: checkoutSizeParam(lines),
      });
      if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
      if (typeof ttq !== 'undefined' && ttq.track) ttq.track('InitiateCheckout');

      var mattressLines = lines.filter(function (l) { return l.itemType !== 'top'; });
      var primary = mattressLines[0] || lines[0] || {};
      var cartLead = resolveCartLeadTime(lines);
      var orderAttrs = {
        order_stage: '1',
        stage_updated_at: new Date().toISOString(),
        delivery_window: cartLead.display || primary.leadWindow || leadWindow || '8 to 10 weeks',
        size_label: mattressLines
          .map(function (l) { return l.label; })
          .filter(Boolean)
          .join(', ') || primary.label || '',
        size_dims: mattressLines
          .map(function (l) { return l.dims; })
          .filter(Boolean)
          .join(', ') || primary.dims || '',
      };
      if (window.ValtoraUTM && typeof window.ValtoraUTM.setAttribute === 'function') {
        Object.keys(orderAttrs).forEach(function (k) {
          window.ValtoraUTM.setAttribute(k, orderAttrs[k]);
        });
      }

      var sync = window.ValtoraUTM ? window.ValtoraUTM.syncCartAttributes() : Promise.resolve();
      return sync
        .then(function () {
          return fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } });
        })
        .then(function () {
          var attrs = Object.assign({}, orderAttrs);
          if (large) {
            attrs.large_order = 'true';
            attrs.large_order_terms_acknowledged = 'true';
            attrs.large_order_value = String(Math.round(orderValue));
            attrs.production_commit_window = 'Within 5 working days of order';
            attrs.admin_flag = 'Review before factory order';
            attrs.large_order_review = 'true';
          }
          return fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ attributes: attrs }),
          });
        })
        .then(function () {
          var chain = Promise.resolve();
          lines.forEach(function (line) {
            chain = chain.then(function () {
              var vid = line.variantId || defaultVariant;
              return fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(buildCartPayload(line, vid, large)),
              }).then(function (res) {
                if (!res.ok) throw new Error('Add failed');
                return res.json();
              });
            });
          });
          return chain;
        })
        .then(function () {
          // Keep OrderStore through Shopify /checkout so Back still has the basket.
          // Clear only after a successful order (thank_you / order-confirmed).
          window.location.href = (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.checkout) || '/checkout';
        });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var size = currentSize();
        if (size.id === 'custom-request') {
          setMode('request');
          return;
        }
        if (!size.available) {
          setMode('notify');
          return;
        }
        if (stageB && stageB.classList.contains('is-collapsed')) {
          if (continueBtn) continueBtn.click();
          return;
        }

        var lines = displayLines();
        if (!lines.length) {
          lines = [currentLineDraft()];
        }

        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Taking you to checkout…';
        }
        checkoutLines(lines).catch(function () {
          if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
        });
      });
    }

    refreshTotals();
    syncSizeQtyUi();
    syncOrderChrome();
    if (root.getAttribute('data-configure-funnel') === 'true') {
      var preSize = '';
      try {
        preSize = new URLSearchParams(location.search).get('size') || '';
      } catch (err) {}
      vTrackOnce('configure_start', eventParams({
        size_preselected: !!preSize,
        size: preSize,
      }));
    }
  }

  function initCartPage() {
    var page = document.querySelector('[data-cart-page]');
    syncOrderChrome();
    if (!page) return;

    var linesEl = page.querySelector('[data-cart-lines]');
    var emptyEl = page.querySelector('[data-cart-empty]');
    var summary = page.querySelector('[data-cart-summary]');
    var subtotalEl = page.querySelector('[data-cart-subtotal]');
    var countEl = page.querySelector('[data-cart-item-count]');
    var checkoutBtn = page.querySelector('[data-cart-checkout]');
    var statusEl = page.querySelector('[data-cart-status]');
    var bnplEl = page.querySelector('[data-bnpl-monthly]');

    function paint() {
      var lines = OrderStore.lines();
      var has = lines.length > 0;
      if (emptyEl) emptyEl.hidden = has;
      if (summary) summary.hidden = !has;
      if (!linesEl) return;
      if (!has) {
        linesEl.innerHTML = '';
        paintBnplMonthly(bnplEl, { lines: [], orderVal: 0 });
        return;
      }
      linesEl.innerHTML = lines
        .map(function (line) {
          var qty = parseInt(line.quantity, 10) || 0;
          var total = formatLineTotal(line);
          var label = orderLineTitle(line);
          return (
            '<li class="cart-line" data-cart-line data-order-line-key="' +
            (line.key || '') +
            '">' +
            '<div class="cart-line__copy">' +
            '<p class="cart-line__title">' +
            label +
            '<span class="cart-line__qty-inline"> · ' +
            qty +
            '</span></p>' +
            (line.dims ? '<p class="cart-line__meta">' + line.dims + '</p>' : '') +
            '</div>' +
            '<div class="cart-line__aside">' +
            '<p class="cart-line__total">' +
            total +
            '</p>' +
            (line.key
              ? '<button type="button" class="cart-line__remove" data-order-remove="' +
                line.key +
                '">Remove</button>'
              : '') +
            '</div>' +
            '</li>'
          );
        })
        .join('');
      var recyclingHref = './mattress-recycling.html';
      try {
        if (location.pathname.indexOf('/pages/') === -1) recyclingHref = './pages/mattress-recycling.html';
      } catch (e) {}
      linesEl.insertAdjacentHTML(
        'beforeend',
        '<li class="cart-line cart-service-line">' +
          '<div class="cart-line__copy cart-service-line__label">' +
          'Old mattress removal and recycling' +
          '<a href="' +
          recyclingHref +
          '">We carry the cost. Read what happens to it</a>' +
          '</div>' +
          '<div class="cart-line__aside"><p class="cart-line__total">Complimentary</p></div>' +
          '</li>' +
          '<li class="cart-line cart-service-line">' +
          '<div class="cart-line__copy cart-service-line__label">Concierge unpacking</div>' +
          '<div class="cart-line__aside"><p class="cart-line__total">Complimentary</p></div>' +
          '</li>'
      );
      if (subtotalEl) {
        subtotalEl.textContent = formatOrderTotal(lines);
      }
      if (countEl) {
        var units = OrderStore.units(lines);
        countEl.textContent = units === 1 ? '1 unit' : units + ' units';
      }
      paintBnplMonthly(bnplEl, {
        lines: lines,
        sample: (lines[0] && lines[0].unitPrice) || '',
      });
    }

    paint();
    document.addEventListener('valtora:order-changed', paint);
    var leadMin = 8;
    var leadMax = 10;
    try {
      var firstLine = OrderStore.lines()[0];
      if (firstLine && firstLine.leadMin) leadMin = parseInt(firstLine.leadMin, 10) || leadMin;
      if (firstLine && firstLine.leadMax) leadMax = parseInt(firstLine.leadMax, 10) || leadMax;
    } catch (e) {}
    vTrackOnce('basket_view', {
      value: OrderStore.orderValue(),
      lead_time_weeks: leadMin === leadMax ? String(leadMin) : leadMin + '-' + leadMax,
    });

    if (linesEl) {
      linesEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-order-remove]');
        if (!btn) return;
        var key = btn.getAttribute('data-order-remove');
        var removed = OrderStore.lines().find(function (l) {
          return l.key === key;
        });
        if (removed && removed.sizeId) OrderStore.removeMattressSize(removed.sizeId);
        else OrderStore.removeLine(key);
        paint();
        syncOrderChrome();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        var lines = OrderStore.lines();
        if (!lines.length) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Your order is empty. Add a size first.';
          }
          return;
        }
        vTrackOnce('reserve_intent', {
          line_count: lines.length,
          units: OrderStore.units(lines),
          order_value: OrderStore.orderValue(lines),
        });
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Taking you to checkout…';
        }
        window.location.href = reviewOrderUrl();
      });
    }

    var form = page.querySelector('[data-cart-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        var submitter = e.submitter || document.activeElement;
        var isCheckout =
          submitter &&
          (submitter.getAttribute('name') === 'checkout' ||
            submitter.hasAttribute('data-cart-checkout'));
        if (isCheckout) {
          e.preventDefault();
          var lines = OrderStore.lines();
          vTrackOnce('reserve_intent', {
            line_count: lines.length,
            units: OrderStore.units(lines),
            order_value: OrderStore.orderValue(lines),
          });
          window.location.href = reviewOrderUrl();
        }
      });
    }
  }

  function initCheckoutPage() {
    var page = document.querySelector('[data-checkout-page]');
    syncOrderChrome();
    if (!page) return;

    var linesEl = page.querySelector('[data-checkout-lines]');
    var emptyEl = page.querySelector('[data-checkout-empty]');
    var flowEl = page.querySelector('[data-checkout-flow]');
    var subtotalEl = page.querySelector('[data-checkout-subtotal]');
    var countEl = page.querySelector('[data-checkout-item-count]');
    var summaryEl = page.querySelector('[data-stageb-summary]');
    var payLabel = page.querySelector('[data-pay-label]');
    var payBtn = page.querySelector('[data-checkout-pay]');
    var statusEl = page.querySelector('[data-cart-status]');
    var bnplEl = page.querySelector('[data-bnpl-monthly]');
    var largeTerms = page.querySelector('[data-order-large-terms]');
    var largeAck = page.querySelector('[data-order-large-ack]');
    var largeCopy = page.querySelector('[data-order-large-copy]');
    var leadLabel = page.querySelector('[data-lead-window-label]');
    var existingLines = OrderStore.lines();
    var market =
      (existingLines[0] && existingLines[0].market) ||
      page.getAttribute('data-market') ||
      document.documentElement.getAttribute('data-market') ||
      detectMarket();
    var financeName =
      page.getAttribute('data-finance-name') ||
      marketFinanceName(market);
    var leadWindow = page.getAttribute('data-lead-window') || '8 to 10 weeks';
    var leadMinDefault = parseInt(page.getAttribute('data-lead-min'), 10) || 8;
    var leadMaxDefault = parseInt(page.getAttribute('data-lead-max'), 10) || 10;
    var thresholdGb = parseInt(page.getAttribute('data-large-order-threshold-gb'), 10) || 10000;
    var thresholdAe = parseInt(page.getAttribute('data-large-order-threshold-ae'), 10) || 47000;
    var previewMode = page.getAttribute('data-checkout-preview') === 'true';
    var confirmedPath = page.getAttribute('data-confirmed-path') || './order-confirmed.html';

    document.documentElement.setAttribute('data-market', market);
    if (document.body) document.body.setAttribute('data-market', market);
    try {
      localStorage.setItem('valtoraPreviewMarket', market);
    } catch (e) {}
    if (leadLabel) leadLabel.textContent = leadWindow;

    function applyLeadCopy(resolved) {
      var mattressCopy = page.querySelector('[data-leadtime-copy]');
      var topCopy = page.querySelector('[data-leadtime-copy-top]');
      var parcelCopy = page.querySelector('[data-leadtime-copy-parcel]');
      var mixedCopy = page.querySelector('[data-leadtime-copy-mixed]');
      var explain = page.querySelector('[data-leadtime-explain]');
      if (leadLabel) leadLabel.textContent = resolved.display || leadWindow;
      if (mattressCopy) mattressCopy.hidden = resolved.mix !== 'mattress';
      if (topCopy) topCopy.hidden = resolved.mix !== 'top';
      if (parcelCopy) parcelCopy.hidden = resolved.mix !== 'parcel';
      if (mixedCopy) {
        mixedCopy.hidden = resolved.mix !== 'mixed';
        if (resolved.mix === 'mixed') {
          mixedCopy.textContent =
            'Your order includes items with different lead times. We use the longer window (' +
            resolved.display +
            ') so everything can arrive together.';
        }
      }
      if (explain) {
        if (resolved.mix === 'top') {
          explain.textContent = 'Sent by courier. Unroll and give it a few hours to recover its full height.';
        } else if (resolved.mix === 'parcel') {
          explain.textContent = 'Sent by courier.';
        } else if (resolved.mix === 'mixed') {
          explain.textContent = 'Delivery is charged once. The longer window applies to the whole order.';
        } else {
          explain.textContent = 'Most orders arrive sooner. Built after you order and flown to your market.';
        }
      }
    }

    function thresholdFor() {
      return market === 'ae' ? thresholdAe : thresholdGb;
    }

    function paint() {
      var lines = OrderStore.lines();
      var has = lines.length > 0;
      if (emptyEl) emptyEl.hidden = has;
      if (flowEl) flowEl.hidden = !has;
      if (!has) {
        if (linesEl) linesEl.innerHTML = '';
        paintBnplMonthly(bnplEl, { lines: [], orderVal: 0, market: market });
        return;
      }
      if (lines[0] && lines[0].market) {
        market = lines[0].market;
        document.documentElement.setAttribute('data-market', market);
        if (document.body) document.body.setAttribute('data-market', market);
        financeName = marketFinanceName(market);
      }
      var sample = (lines[0] && lines[0].unitPrice) || '';
      var totalVal = OrderStore.orderValue(lines);
      var totalText = formatOrderTotal(lines, market);
      var units = OrderStore.units(lines);
      if (linesEl) {
        linesEl.innerHTML = lines
          .map(function (line) {
            var qty = parseInt(line.quantity, 10) || 0;
            var total = formatLineTotal(line);
            var title =
            orderLineTitle(line);
            return (
              '<li class="cart-line order-basket__line">' +
              '<span class="order-basket__line-l">' +
              title +
              (line.dims ? '<small>' + line.dims + '</small>' : '') +
              '</span>' +
              '<span class="order-basket__line-r">' +
              total +
              '</span>' +
              '</li>'
            );
          })
          .join('');
      }
      if (subtotalEl) subtotalEl.textContent = totalText;
      if (countEl) countEl.textContent = units === 1 ? '1 unit' : units + ' units';
      if (summaryEl) {
        summaryEl.textContent = lines
          .filter(isMattressLine)
          .map(function (l) {
            return (l.label || '') + ' · ' + (parseInt(l.quantity, 10) || 0);
          })
          .join(', ');
      }
      if (payLabel) payLabel.textContent = 'Pay ' + totalText;
      if (bnplEl) {
        paintBnplMonthly(bnplEl, {
          lines: lines,
          orderVal: totalVal,
          sample: sample,
          market: market,
        });
      }
      if (leadLabel) {
        applyLeadCopy(resolveCartLeadTime(lines));
      }
      var large = totalVal >= thresholdFor();
      if (largeTerms) largeTerms.hidden = !large;
      if (large && largeCopy) {
        var thrLabel = formatMoneyFromCents(thresholdFor() * 100, market);
        largeCopy.textContent =
          'Orders of ' +
          thrLabel +
          ' or more are refundable until production is committed - typically within 5 working days of order - and non-refundable after that. Under that amount, you can still cancel any time before dispatch for a full refund.';
      }
    }

    paint();
    document.addEventListener('valtora:order-changed', paint);
    vTrackOnce('view_leadtime', {
      line_count: OrderStore.lines().length,
      units: OrderStore.units(),
      order_value: OrderStore.orderValue(),
    });

    if (payBtn) {
      payBtn.addEventListener('click', function () {
        var lines = OrderStore.lines();
        if (!lines.length) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Your order is empty.';
          }
          return;
        }
        var sample = (lines[0] && lines[0].unitPrice) || '';
        var totalVal = OrderStore.orderValue(lines);
        if (totalVal >= thresholdFor(sample) && largeAck && !largeAck.checked) {
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.textContent = 'Please confirm the larger-order terms before checkout.';
          }
          if (largeTerms) largeTerms.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }
        vTrack('begin_checkout', {
          value: totalVal,
          order_value: totalVal,
          line_count: lines.length,
          units: OrderStore.units(lines),
          size: checkoutSizeParam(lines),
        });
        if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
        if (typeof ttq !== 'undefined' && ttq.track) ttq.track('InitiateCheckout');
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Taking you to payment…';
        }
        if (previewMode) {
          var snapshot = {
            lines: lines.map(function (line) {
              return {
                key: line.key,
                itemType: line.itemType,
                sizeId: line.sizeId,
                label: line.label,
                dims: line.dims,
                quantity: parseInt(line.quantity, 10) || 0,
                unitPrice: line.unitPrice,
                priceRaw: line.priceRaw,
                market: line.market,
                leadWindow: line.leadWindow,
                leadMin: line.leadMin,
                leadMax: line.leadMax,
              };
            }),
            total: formatOrderTotal(lines, market),
            units: OrderStore.units(lines),
            line_count: lines.length,
            order_id: 'PREVIEW-' + Date.now(),
            currency: market === 'gb' ? 'GBP' : market === 'eu' ? 'EUR' : 'AED',
            value: totalVal,
          };
          OrderStore.saveLastOrder(snapshot);
          OrderStore.clear();
          window.location.href = confirmedPath;
          return;
        }
        var shopifyCheckout =
          (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.checkout) ||
          '/checkout';
        var missing = lines.some(function (line) {
          return !line.variantId;
        });
        if (missing) {
          if (statusEl) {
            statusEl.textContent = 'Assign the mattress product in the theme so each size has a Shopify variant.';
          }
          return;
        }
        var sync = window.ValtoraUTM ? window.ValtoraUTM.syncCartAttributes() : Promise.resolve();
        var mattressLines = lines.filter(isMattressLine);
        var primary = mattressLines[0] || lines[0] || {};
        var cartLead = resolveCartLeadTime(lines);
        var orderAttrs = {
          order_stage: '1',
          stage_updated_at: new Date().toISOString(),
          delivery_window: cartLead.display || primary.leadWindow || leadWindow || '8 to 10 weeks',
          size_label: mattressLines
            .map(function (l) { return l.label; })
            .filter(Boolean)
            .join(', ') || primary.label || '',
          size_dims: mattressLines
            .map(function (l) { return l.dims; })
            .filter(Boolean)
            .join(', ') || primary.dims || '',
        };
        if (totalVal >= thresholdFor(sample)) {
          orderAttrs.large_order = 'true';
          orderAttrs.large_order_review = 'true';
          orderAttrs.admin_flag = 'Review before factory order';
          orderAttrs.large_order_value = String(Math.round(totalVal));
        }
        if (window.ValtoraUTM && typeof window.ValtoraUTM.setAttribute === 'function') {
          Object.keys(orderAttrs).forEach(function (k) {
            window.ValtoraUTM.setAttribute(k, orderAttrs[k]);
          });
        }
        sync
          .then(function () {
            return fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } });
          })
          .then(function () {
            return fetch('/cart/update.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ attributes: orderAttrs }),
            });
          })
          .then(function () {
            var chain = Promise.resolve();
            lines.forEach(function (line) {
              chain = chain.then(function () {
                return fetch('/cart/add.js', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify({
                    id: Number(line.variantId),
                    quantity: parseInt(line.quantity, 10) || 1,
                    properties: {
                      Size: (line.label || '') + (line.dims ? ' - ' + line.dims : ''),
                      Market: String(line.market || market).toUpperCase(),
                      'Item type':
            line.itemType === 'top'
              ? 'Comfort layer'
              : line.itemType === 'sheets'
                ? 'Bed sheets'
                : line.itemType === 'pillows'
                  ? 'Pillows'
                  : 'Mattress',
                      _lead_min: String(line.leadMin != null ? line.leadMin : leadMinDefault),
                      _lead_max: String(line.leadMax != null ? line.leadMax : leadMaxDefault),
                    },
                  }),
                }).then(function (res) {
                  if (!res.ok) throw new Error('Add failed');
                });
              });
            });
            return chain;
          })
          .then(function () {
            // Do not wipe the theme basket when opening hosted checkout.
            window.location.href = shopifyCheckout;
          })
          .catch(function () {
            if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
          });
      });
    }
  }

  function initPdpSpecs() {
    document.querySelectorAll('[data-pdp-spec]').forEach(function (el) {
      var btn = el.querySelector('[data-pdp-spec-toggle]');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = el.classList.toggle('is-open');
        if (open && window.vTrack) {
          window.vTrack('spec_opened', { page: el.id || 'pdp-spec' });
        }
      });
    });
  }

  function lookupAccessoryPrice(root, keys, fallbackText, fallbackRaw) {
    var map = parseAccessoryPrices(root);
    var i;
    for (i = 0; i < keys.length; i++) {
      if (map[keys[i]]) return map[keys[i]];
    }
    return { price: fallbackText || '', raw: fallbackRaw || 0, id: '' };
  }

  function paintPdpBuy(root, lineText, priceText) {
    var lineEl = root.querySelector('[data-buy-line]');
    if (lineEl) lineEl.innerHTML = lineText;
    if (!priceText) return;
    root.querySelectorAll('[data-top-price], [data-sheet-price], [data-pillow-price], [data-buy-total]').forEach(function (el) {
      el.textContent = priceText;
    });
  }

  function initComfortTop() {
    var root = document.querySelector('[data-comfort-top]');
    if (!root) return;
    var params = new URLSearchParams(location.search);
    var orderRef = params.get('order') || '';
    var preSize = (params.get('size') || '').toLowerCase();
    var preFirm = params.get('firmness') || '';
    var known = !!orderRef;
    var market = document.documentElement.getAttribute('data-market') || detectMarket();
    var sizes = (SIZE_MAPS[market] || SIZE_MAPS.gb).slice();
    var sizeBox = root.querySelector('[data-top-sizes]');
    var selectedSize = null;
    var selectedFirm = preFirm
      ? preFirm.charAt(0).toUpperCase() + preFirm.slice(1).toLowerCase()
      : '';
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 2;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 3;
    var leadWindow = root.getAttribute('data-lead-window') || '2 to 3 weeks';
    var fallbackRaw = parseInt(
      root.getAttribute('data-top-price-raw-' + market) ||
        root.getAttribute('data-top-price-raw'),
      10
    );
    var fallbackText =
      (root.querySelector('[data-top-price]') && root.querySelector('[data-top-price]').textContent) ||
      '';

    function currentPrice() {
      if (!selectedSize) return { price: fallbackText, raw: fallbackRaw, id: '' };
      return lookupAccessoryPrice(
        root,
        [selectedSize.id, selectedSize.label.toLowerCase(), selectedSize.id + '-' + (selectedFirm || '').toLowerCase()],
        fallbackText,
        fallbackRaw
      );
    }

    function paint() {
      if (!selectedSize) return;
      var pr = currentPrice();
      var line =
        selectedSize.label +
        (selectedFirm ? ' · ' + selectedFirm : '') +
        '<br><span class="pdp-opt__sub">' +
        selectedSize.dims +
        '</span>';
      paintPdpBuy(root, line, pr.price);
    }

    vTrackOnce('top_page_view', {
      entry_point: topEntryPoint(),
      state: known ? 'known' : 'unknown',
      days_since_delivery: params.get('days') || '',
    });

    root.querySelectorAll('[data-top-unknown]').forEach(function (el) {
      el.hidden = known;
    });
    var knownLine = root.querySelector('[data-top-known]');
    var findOrder = root.querySelector('[data-top-find-order]');
    if (findOrder) findOrder.hidden = known;
    if (sizeBox) {
      sizeBox.innerHTML = sizes
        .map(function (s) {
          var pr = lookupAccessoryPrice(root, [s.id, s.label.toLowerCase()], '', fallbackRaw);
          return (
            '<button type="button" class="pdp-opt" role="option" data-top-size="' +
            s.id +
            '" data-size-label="' +
            s.label +
            '" data-size-dims="' +
            s.dims +
            '">' +
            '<span class="pdp-opt__rd" aria-hidden="true"></span>' +
            '<span><span class="pdp-opt__nm">' +
            s.label +
            '</span><span class="pdp-opt__sub">' +
            s.dims +
            '</span></span>' +
            (pr.price ? '<span class="pdp-opt__pr">' + pr.price + '</span>' : '') +
            '</button>'
          );
        })
        .join('');
    }
    function selectSize(id, fromPrefill) {
      selectedSize = sizes.filter(function (s) { return s.id === id; })[0] || null;
      if (!selectedSize) return;
      root.querySelectorAll('[data-top-size]').forEach(function (btn) {
        var on = btn.getAttribute('data-top-size') === id;
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.classList.toggle('is-on', on);
      });
      if (known) {
        root.querySelectorAll('[data-top-size]').forEach(function (btn) {
          btn.disabled = btn.getAttribute('data-top-size') !== id;
        });
      }
      paint();
      vTrack('top_size_selected', { size: selectedSize.id, prefilled: !!fromPrefill });
    }
    if (sizeBox) {
      sizeBox.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-top-size]');
        if (!btn || btn.disabled) return;
        selectSize(btn.getAttribute('data-top-size'), false);
      });
    }
    if (preSize) {
      var match = sizes.filter(function (s) {
        return s.id === preSize || s.label.toLowerCase() === preSize;
      })[0];
      if (match) selectSize(match.id, true);
    }
    if (known && knownLine && selectedSize) {
      knownLine.hidden = false;
      knownLine.textContent = 'This replaces the layer in your ' + selectedSize.label + '.';
    }

    root.querySelectorAll('[data-top-firmness]').forEach(function (btn) {
      if (selectedFirm && btn.getAttribute('data-top-firmness') === selectedFirm) {
        btn.setAttribute('aria-selected', 'true');
        btn.classList.add('is-on');
      }
      btn.addEventListener('click', function () {
        selectedFirm = btn.getAttribute('data-top-firmness');
        root.querySelectorAll('[data-top-firmness]').forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.classList.toggle('is-on', on);
        });
        paint();
        vTrack('top_firmness_selected', {
          firmness: selectedFirm,
          same_as_current: !!(preFirm && selectedFirm.toLowerCase() === preFirm.toLowerCase()),
        });
      });
    });
    var currentFeel = root.querySelector('[data-top-current-feel]');
    if (known && preFirm && currentFeel) {
      currentFeel.hidden = false;
      currentFeel.textContent = 'You currently have ' + selectedFirm + '.';
    }

    var addBtn = root.querySelector('[data-top-add]');
    var status = root.querySelector('[data-top-status]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (!comfortTopsEnabled()) return;
        if (!selectedSize || !selectedFirm) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Choose a size and a feel.';
          }
          return;
        }
        var pr = currentPrice();
        OrderStore.addLine({
          itemType: 'top',
          sizeId: selectedSize.id,
          label: selectedSize.label,
          dims: selectedSize.dims,
          firmness: selectedFirm,
          unitPrice: pr.price,
          priceRaw: pr.raw || fallbackRaw,
          variantId: pr.id || root.getAttribute('data-variant-id') || '',
          quantity: 1,
          market: market,
          leadWindow: leadWindow,
          leadMin: leadMin,
          leadMax: leadMax,
          leadUnit: root.getAttribute('data-lead-unit') || 'weeks',
        });
        vTrack('top_add_to_cart', {
          size: selectedSize.id,
          firmness: selectedFirm,
          entry_point: topEntryPoint(),
        });
        if (status) {
          status.hidden = false;
          status.textContent = 'Added. Continue to checkout when you are ready.';
        }
      });
    }
  }

  function initBedSheets() {
    var root = document.querySelector('[data-bed-sheets]');
    if (!root) return;
    var market = document.documentElement.getAttribute('data-market') || detectMarket();
    var sizes = (SIZE_MAPS[market] || SIZE_MAPS.gb).slice();
    var sizeBox = root.querySelector('[data-sheet-sizes]');
    var selectedSize = null;
    var selectedColour = 'Bone';
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 3;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 5;
    var leadWindow = root.getAttribute('data-lead-window') || '3 to 5 days';
    var fallbackRaw = parseInt(root.getAttribute('data-sheets-price-raw'), 10);
    var fallbackText =
      (root.querySelector('[data-sheet-price]') && root.querySelector('[data-sheet-price]').textContent) ||
      '';

    function currentPrice() {
      if (!selectedSize) return { price: fallbackText, raw: fallbackRaw, id: '' };
      return lookupAccessoryPrice(
        root,
        [
          selectedSize.id,
          selectedSize.label.toLowerCase(),
          selectedSize.id + '-' + selectedColour.toLowerCase(),
        ],
        fallbackText,
        fallbackRaw
      );
    }

    function paint() {
      if (!selectedSize) return;
      var pr = currentPrice();
      var line =
        selectedSize.label +
        (selectedColour ? ' · ' + selectedColour : '') +
        '<br><span class="pdp-opt__sub">' +
        selectedSize.dims +
        '</span>';
      paintPdpBuy(root, line, pr.price);
    }

    if (sizeBox) {
      sizeBox.innerHTML = sizes
        .map(function (s) {
          var pr = lookupAccessoryPrice(root, [s.id, s.label.toLowerCase()], '', fallbackRaw);
          return (
            '<button type="button" class="pdp-opt" role="option" data-sheet-size="' +
            s.id +
            '">' +
            '<span class="pdp-opt__rd" aria-hidden="true"></span>' +
            '<span><span class="pdp-opt__nm">' +
            s.label +
            '</span><span class="pdp-opt__sub">' +
            s.dims +
            ' · 40cm depth</span></span>' +
            (pr.price ? '<span class="pdp-opt__pr">' + pr.price + '</span>' : '') +
            '</button>'
          );
        })
        .join('');
      sizeBox.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-sheet-size]');
        if (!btn) return;
        var id = btn.getAttribute('data-sheet-size');
        selectedSize = sizes.filter(function (s) { return s.id === id; })[0] || null;
        root.querySelectorAll('[data-sheet-size]').forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.classList.toggle('is-on', on);
        });
        paint();
      });
    }

    root.querySelectorAll('[data-sheet-colour]').forEach(function (btn) {
      if (btn.getAttribute('data-sheet-colour') === selectedColour) {
        btn.classList.add('is-on');
        btn.setAttribute('aria-selected', 'true');
      }
      btn.addEventListener('click', function () {
        selectedColour = btn.getAttribute('data-sheet-colour');
        root.querySelectorAll('[data-sheet-colour]').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        paint();
      });
    });

    var addBtn = root.querySelector('[data-sheet-add]');
    var status = root.querySelector('[data-sheet-status]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (!accessoryAllowed('sheets')) return;
        if (!selectedSize) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Choose a size.';
          }
          return;
        }
        var pr = currentPrice();
        OrderStore.addLine({
          itemType: 'sheets',
          sizeId: selectedSize.id,
          label: selectedSize.label,
          dims: selectedSize.dims,
          colour: selectedColour,
          unitPrice: pr.price,
          priceRaw: pr.raw || fallbackRaw,
          variantId: pr.id || root.getAttribute('data-variant-id') || '',
          quantity: 1,
          market: market,
          leadWindow: leadWindow,
          leadMin: leadMin,
          leadMax: leadMax,
          leadUnit: root.getAttribute('data-lead-unit') || 'days',
        });
        vTrack('sheets_add_to_cart', { size: selectedSize.id, colour: selectedColour });
        if (status) {
          status.hidden = false;
          status.textContent = 'Added. Continue to checkout when you are ready.';
        }
      });
    }
  }

  function initPillows() {
    var root = document.querySelector('[data-pillows]');
    if (!root) return;
    var market = document.documentElement.getAttribute('data-market') || detectMarket();
    var selected = null;
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 3;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 5;
    var leadWindow = root.getAttribute('data-lead-window') || '3 to 5 days';
    var fallbackRaw = parseInt(root.getAttribute('data-pillow-price-raw'), 10);
    var fallbackText =
      (root.querySelector('[data-pillow-price]') && root.querySelector('[data-pillow-price]').textContent) ||
      '';
    var dims = root.getAttribute('data-pillow-dims') || '';

    function paint() {
      if (!selected) return;
      var name = selected.getAttribute('data-pillow-label') || selected.querySelector('.pdp-opt__nm').textContent;
      var loft = selected.getAttribute('data-pillow-loft') || '';
      var line =
        name +
        (dims ? '<br><span class="pdp-opt__sub">' + dims + '</span>' : loft ? '<br><span class="pdp-opt__sub">' + loft + '</span>' : '');
      paintPdpBuy(root, line, fallbackText);
    }

    root.querySelectorAll('[data-pillow-sleep]').forEach(function (btn) {
      if (!btn.getAttribute) return;
      var sleep = btn.getAttribute('data-pillow-sleep');
      if (!sleep || btn.tagName !== 'BUTTON') return;
      var nm = btn.querySelector('.pdp-opt__nm');
      if (nm) btn.setAttribute('data-pillow-label', nm.textContent);
      btn.addEventListener('click', function () {
        selected = btn;
        root.querySelectorAll('button[data-pillow-sleep]').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        paint();
      });
    });

    var addBtn = root.querySelector('[data-pillow-add]');
    var status = root.querySelector('[data-pillow-status]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (!accessoryAllowed('pillows')) return;
        if (!selected) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Choose how you sleep.';
          }
          return;
        }
        var sleep = selected.getAttribute('data-pillow-sleep');
        var name = selected.getAttribute('data-pillow-label') || '';
        OrderStore.addLine({
          itemType: 'pillows',
          sizeId: sleep,
          label: name,
          dims: dims,
          sleep: sleep,
          firmness: sleep,
          unitPrice: fallbackText,
          priceRaw: fallbackRaw,
          variantId: root.getAttribute('data-variant-id') || '',
          quantity: 1,
          market: market,
          leadWindow: leadWindow,
          leadMin: leadMin,
          leadMax: leadMax,
          leadUnit: root.getAttribute('data-lead-unit') || 'days',
        });
        vTrack('pillows_add_to_cart', { sleep: sleep });
        if (status) {
          status.hidden = false;
          status.textContent = 'Added. Continue to checkout when you are ready.';
        }
      });
    }
  }

  function initOrderConfirmed() {
    var page = document.querySelector('[data-order-confirmed]');
    if (!page) return;
    var summary = page.querySelector('[data-confirmed-summary]');
    var linesEl = page.querySelector('[data-confirmed-lines]');
    var totalEl = page.querySelector('[data-confirmed-total]');
    var countEl = page.querySelector('[data-confirmed-count]');
    var leadEl = page.querySelector('[data-confirmed-lead]');
    var arrivedLabel = page.querySelector('[data-stage-arrived-label]');
    var stageDate = page.querySelector('[data-stage="confirmed"] [data-stage-date]');
    try {
      var data = OrderStore.readLastOrder();
      var lines = (data && data.lines) || [];
      var market =
        (lines[0] && lines[0].market) ||
        document.documentElement.getAttribute('data-market') ||
        detectMarket();
      document.documentElement.setAttribute('data-market', market);
      if (document.body) document.body.setAttribute('data-market', market);
      applyMarketOnlyVisibility(market);

      if (arrivedLabel) {
        arrivedLabel.textContent =
          market === 'gb' ? 'Arrived in the UK' : market === 'ae' ? 'Arrived in the UAE' : 'Arrived in your market';
      }
      if (stageDate) {
        try {
          stageDate.textContent = new Date()
            .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            .toUpperCase();
        } catch (err) {
          stageDate.textContent = 'Today';
        }
      }
      if (leadEl) {
        var cartLead = resolveCartLeadTime(lines);
        leadEl.textContent =
          cartLead.display ||
          (lines[0] && lines[0].leadWindow) ||
          page.getAttribute('data-lead-window') ||
          '8 to 10 weeks';
      }

      if (linesEl) {
        if (!lines.length) {
          linesEl.innerHTML = '';
        } else {
          linesEl.innerHTML = lines
            .map(function (line) {
              var qty = parseInt(line.quantity, 10) || 0;
              var lineTotal = formatLineTotal(line);
              var title =
                orderLineTitle(line);
              return (
                '<li class="checkout-confirmed__line thanks-order__line">' +
                '<span>' +
                title +
                (line.dims ? '<small>' + line.dims + '</small>' : '') +
                '</span>' +
                '<strong>' +
                lineTotal +
                '</strong>' +
                '</li>'
              );
            })
            .join('');
        }
      }
      if (countEl) {
        countEl.textContent = '';
        countEl.hidden = true;
      }
      if (totalEl) totalEl.textContent = (data && data.total) || '';
      if (summary) {
        if (lines.length) {
          var labels = lines
            .map(function (l) {
              return (l.label || '') + ' · ' + (parseInt(l.quantity, 10) || 0);
            })
            .join(', ');
          summary.textContent = (labels ? labels + ' · ' : '') + ((data && data.total) || '');
        } else {
          summary.textContent = '';
        }
      }
    } catch (e) {}
    var tracked = OrderStore.readLastOrder() || {};
    var orderId =
      tracked.order_id ||
      (document.querySelector('[data-order-name]') &&
        document.querySelector('[data-order-name]').textContent) ||
      'preview';
    firePurchaseOnce({
      order_id: String(orderId).replace(/^#/, '') || 'preview',
      value: tracked.value || undefined,
      currency: tracked.currency || '',
      line_count: tracked.line_count || ((tracked.lines && tracked.lines.length) || 0),
      units: tracked.units || 0,
      order_value: tracked.total || tracked.value || '',
    });
  }

  function reinitReservesForMarket() {
    var market =
      (document.documentElement && document.documentElement.getAttribute('data-market')) ||
      detectMarket();
    // Drop lines from the other market so UAE/UK baskets stay coherent.
    // Only rewrite when something would actually be removed - avoids
    // clobbering a full basket when a secondary page boots with the wrong default.
    try {
      var lines = OrderStore.lines();
      var kept = lines.filter(function (l) {
        return !l.market || l.market === market;
      });
      if (kept.length !== lines.length) {
        OrderStore.write({ lines: kept });
      }
    } catch (e) {}
    document.querySelectorAll('[data-size-reserve]').forEach(function (root) {
      if (typeof root._valtoraOnMarketChange === 'function') {
        root._valtoraOnMarketChange();
      }
    });
    syncOrderChrome();
  }

  document.addEventListener('preview:market-changed', reinitReservesForMarket);
  document.addEventListener('preview:market-changed', paintContactHours);

  function initLifestyleCaptions() {
    var items = document.querySelectorAll(
      '.lifestyle-collage__item, .founder-note__media, .specs__figure, .cool-touch__main'
    );
    if (!items.length) return;
    var fineHover =
      window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fineHover) return;
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var open = item.classList.contains('is-caption-open');
        items.forEach(function (other) {
          other.classList.remove('is-caption-open');
        });
        if (!open) item.classList.add('is-caption-open');
      });
    });
  }

  function initAllReserves() {
    document.querySelectorAll('[data-size-reserve]').forEach(initSizeReserve);
  }

  function unlockPageOverflow() {
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    document.body.style.removeProperty('height');
  }

  function unlockMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    if (panel) panel.setAttribute('aria-hidden', 'true');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
    document.documentElement.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    unlockPageOverflow();
  }

  function isInPageHashHref(href) {
    if (!href) return false;
    if (href.charAt(0) === '#') return href.length > 1;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (!url.hash || url.hash === '#') return false;
      var here = window.location.pathname.replace(/\/$/, '') || '/';
      var there = url.pathname.replace(/\/$/, '') || '/';
      return here === there;
    } catch (e) {
      return href.indexOf('#') !== -1;
    }
  }

  function hashFromHref(href) {
    if (!href) return '';
    if (href.charAt(0) === '#') return href;
    try {
      return new URL(href, window.location.href).hash || '';
    } catch (e) {
      var i = href.indexOf('#');
      return i >= 0 ? href.slice(i) : '';
    }
  }

  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    if (!toggle || !panel) return;

    function setOpen(nextOpen) {
      panel.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', nextOpen ? 'Close menu' : 'Open menu');
      document.documentElement.classList.toggle('nav-open', nextOpen);
      document.body.classList.toggle('nav-open', nextOpen);
      if (!nextOpen) unlockPageOverflow();
    }

    toggle.addEventListener('click', function () {
      var open = panel.getAttribute('aria-hidden') === 'false';
      setOpen(!open);
    });

    function onHashNavClick(e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (!isInPageHashHref(href)) return;
      var hash = hashFromHref(href);
      if (!hash || hash === '#') return;
      e.preventDefault();
      unlockMobileNav();
      if (window.location.hash === hash) {
        applyHashTarget(hash);
        return;
      }
      if (history && history.replaceState) {
        history.replaceState(null, '', hash);
      } else {
        window.location.hash = hash;
      }
      applyHashTarget(hash);
    }

    panel.addEventListener('click', onHashNavClick);
    var headerNav = document.querySelector('.site-header__nav');
    if (headerNav) headerNav.addEventListener('click', onHashNavClick);

    window.addEventListener('hashchange', function () {
      unlockMobileNav();
      applyHashTarget(window.location.hash);
    });
    window.addEventListener('pageshow', function () {
      unlockMobileNav();
    });

    if (window.location.hash) {
      applyHashTarget(window.location.hash);
    }
  }

  function initReviews() {
    var root = document.querySelector('[data-reviews]');
    if (!root) return;

    var showEntries = root.getAttribute('data-reviews-show-entries') !== 'false';
    var url = root.getAttribute('data-reviews-url');
    var pageSize = parseInt(root.getAttribute('data-reviews-page-size'), 10) || 6;
    var grid = root.querySelector('[data-reviews-grid]');
    var moreBtn = root.querySelector('[data-reviews-more]');
    var emptyEl = root.querySelector('[data-reviews-empty]');
    var avgEl = root.querySelector('[data-reviews-average]');
    var countEl = root.querySelector('[data-reviews-count]');
    var starsEl = root.querySelector('[data-reviews-stars]');
    var summaryEl = root.querySelector('[data-reviews-summary]');
    var shown = 0;
    var reviews = [];

    function showEmpty() {
      if (grid) grid.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (moreBtn) moreBtn.hidden = true;
      if (summaryEl) summaryEl.hidden = true;
    }

    if (!showEntries || !url) {
      showEmpty();
      return;
    }
    if (summaryEl) summaryEl.hidden = false;

    function stars(rating) {
      var full = Math.round(rating);
      var out = '';
      var i;
      for (i = 1; i <= 5; i++) {
        out += i <= full ? '★' : '☆';
      }
      return out;
    }

    function formatDate(iso) {
      if (!iso) return '';
      var d = new Date(iso + 'T12:00:00');
      if (isNaN(d.getTime())) return iso;
      try {
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return iso;
      }
    }

    function renderCard(r) {
      var el = document.createElement('article');
      el.className = 'review';
      el.innerHTML =
        '<div class="review__meta">' +
        '<span class="review__stars" aria-label="' +
        r.rating +
        ' out of 5">' +
        stars(r.rating) +
        '</span>' +
        (r.verified ? '<span class="review__verified">Verified</span>' : '') +
        '</div>' +
        '<h3 class="review__title">' +
        r.title +
        '</h3>' +
        '<p class="review__quote">' +
        r.body +
        '</p>' +
        '<footer class="review__author">' +
        '<span>' +
        r.author +
        (r.location ? ' · ' + r.location : '') +
        '</span>' +
        '<span class="review__detail">' +
        (r.size ? r.size + ' · ' : '') +
        formatDate(r.date) +
        '</span>' +
        '</footer>';
      return el;
    }

    function paint() {
      if (!grid) return;
      var next = reviews.slice(shown, shown + pageSize);
      next.forEach(function (r) {
        grid.appendChild(renderCard(r));
      });
      shown += next.length;
      if (moreBtn) {
        moreBtn.hidden = shown >= reviews.length;
      }
      if (emptyEl) emptyEl.hidden = reviews.length > 0;
    }

    function applySummary(summary) {
      if (avgEl) avgEl.textContent = Number(summary.average).toFixed(2).replace(/\.00$/, '');
      if (countEl) {
        countEl.textContent =
          'Based on ' + summary.count.toLocaleString() + ' reviews';
      }
      if (starsEl) starsEl.textContent = stars(summary.average);
    }

    if (!url) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('reviews fetch failed');
        return res.json();
      })
      .then(function (data) {
        reviews = Array.isArray(data.reviews) ? data.reviews : [];
        if (data.summary) applySummary(data.summary);
        paint();
      })
      .catch(function () {
        if (emptyEl) emptyEl.hidden = false;
      });

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        paint();
      });
    }
  }

  function initStickyReserve() {
    var bar = document.querySelector('[data-sticky-reserve]');
    if (!bar) return;

    var hero = document.getElementById('hero');
    var heroCta = document.querySelector('[data-hero-cta]') || (hero && hero.querySelector('.hero__cta .btn'));
    var reserve = document.getElementById('reserve');
    var path = (location.pathname || '') + ' ' + (document.body.getAttribute('data-page') || '');
    // Hide on funnel pages where the bar would compete with the page CTA.
    var suppressPage =
      /cart|checkout|order-confirmed|thank_you|thank-you|order-status/i.test(path) ||
      document.body.classList.contains('template-cart') ||
      document.body.classList.contains('template-checkout');

    var heroCtaPassed = !heroCta;
    var reserveVisible = false;

    function sectionOn(el) {
      return el && !el.hidden && el.getAttribute('aria-hidden') !== 'true';
    }

    function forceFloatBasket() {
      return document.documentElement.getAttribute('data-float-basket-force') === '1';
    }

    function setFloatBasketSpace() {
      var prev = bar.style.transform;
      bar.style.transform = 'none';
      var rect = bar.getBoundingClientRect && bar.getBoundingClientRect();
      var h = Math.ceil((rect && rect.height) || bar.offsetHeight || 72);
      bar.style.transform = prev;
      if (!isFinite(h) || h < 48) h = 72;
      if (h > 140) h = 140;
      document.documentElement.style.setProperty('--float-basket-space', h + 'px');
    }

    function showBar() {
      bar.hidden = false;
      bar.removeAttribute('hidden');
      document.body.classList.add('has-sticky-reserve');
      setFloatBasketSpace();
    }

    function hideBar() {
      bar.hidden = true;
      bar.classList.remove('is-active');
      document.body.classList.remove('has-sticky-reserve');
      document.documentElement.style.setProperty('--float-basket-space', '0px');
    }

    function update() {
      document.body.classList.remove('float-basket-at-footer');
      var hasItems = basketHasItems();
      bar.classList.toggle('has-items', hasItems);
      if (suppressPage) {
        bar.classList.remove('has-items', 'is-active');
        hideBar();
        return;
      }
      // Lined basket, or notify/request mode: pin immediately. Do not wait
      // for scroll, hero CTA, or IntersectionObserver — especially on mobile.
      if (hasItems || forceFloatBasket()) {
        bar.classList.add('is-active');
        showBar();
        return;
      }
      bar.classList.remove('is-active');
      // Empty cart: keep today's CHOOSE A SIZE / See sizes and prices rules.
      if (reserve && sectionOn(reserve)) {
        var show = heroCtaPassed && !reserveVisible;
        if (show) showBar();
        else hideBar();
        return;
      }
      showBar();
    }

    function checkVisibility() {
      if (!heroCta || !sectionOn(hero)) {
        heroCtaPassed = true;
      } else {
        var ctaRect = heroCta.getBoundingClientRect();
        heroCtaPassed = ctaRect.bottom < 0;
      }

      if (reserve && sectionOn(reserve)) {
        var rect = reserve.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        reserveVisible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      } else {
        reserveVisible = false;
      }
      update();
    }

    paintFloatBasketFromStore();
    setFloatBasketSpace();

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function () {
          checkVisibility();
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );
      if (hero) io.observe(hero);
      if (heroCta) io.observe(heroCta);
      if (reserve) io.observe(reserve);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    document.addEventListener('valtora:float-basket-mode', checkVisibility);
    checkVisibility();

    bar.addEventListener('click', function (e) {
      var cont = e.target.closest('[data-float-continue]');
      if (cont) {
        if (!OrderStore.lines().length) {
          e.preventDefault();
          if (reserve) {
            reserve.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.location.href = sizesAndPricesHref();
          }
          return;
        }
        vTrackOnce('reserve_intent', {
          value: OrderStore.orderValue(),
          line_count: OrderStore.lines().length,
          units: OrderStore.units(),
          order_value: OrderStore.orderValue(),
        });
        var href = resolveCheckoutHref(cont) || reviewOrderUrl();
        cont.setAttribute('href', href);
        e.preventDefault();
        window.location.href = href;
        return;
      }
      var link = e.target.closest('a[href^="#"]');
      if (link) {
        var id = (link.getAttribute('href') || '').slice(1).split('?')[0];
        if (!HOME_SECTION_IDS[id]) return;
        e.preventDefault();
        var target = document.getElementById(id) || (id === 'reserve' ? reserve : null);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = homeSectionHref(id);
        }
      }
    });
  }

  function initFunnelTracking() {
    var swap =
      document.getElementById('swap-video') ||
      document.getElementById('swap') ||
      document.querySelector('[data-admin-section="swap"], .swap-explainer, #swap-explainer');
    if (!swap) {
      var candidates = document.querySelectorAll('section[id]');
      candidates.forEach(function (sec) {
        if (/swap/i.test(sec.id) && !swap) swap = sec;
      });
    }
    observeDwell(swap, 1000, 'valtora_view_proposition', function () {
      vTrackOnce('view_proposition', {});
    });

    document.querySelectorAll('section[id], [data-admin-section]').forEach(function (sec) {
      var name =
        sec.getAttribute('data-admin-section') ||
        sec.id ||
        sec.getAttribute('data-section-type') ||
        'section';
      observeDwell(sec, 1000, 'valtora_scroll_' + name, function () {
        vTrack('scroll_depth', { section: name });
      });
    });

    var path = location.pathname || '';
    var isThanks =
      /thank_you|thank-you|order-confirmed/.test(document.body.className + ' ' + path) ||
      (window.Shopify && window.Shopify.Checkout && window.Shopify.Checkout.step === 'thank_you');
    if (isThanks) {
      var tracked = OrderStore.readLastOrder() || {};
      firePurchaseOnce({
        order_id: tracked.order_id || 'thanks',
        value: tracked.value || undefined,
        currency: tracked.currency || '',
        line_count: tracked.line_count || ((tracked.lines && tracked.lines.length) || 0),
        units: tracked.units || 0,
        order_value: tracked.total || tracked.value || '',
      });
    }
  }

  var EXIT_LOG_KEY = 'valtora_exit_intent_log';

  function readExitIntentLog() {
    try {
      var log = JSON.parse(localStorage.getItem(EXIT_LOG_KEY) || '[]');
      return Array.isArray(log) ? log : [];
    } catch (e) {
      return [];
    }
  }

  function appendExitIntentLog(entry) {
    var log = readExitIntentLog();
    log.push(entry);
    if (log.length > 100) log = log.slice(-100);
    try {
      localStorage.setItem(EXIT_LOG_KEY, JSON.stringify(log));
    } catch (e) {}
    return log;
  }

  function resolveExitIntentConfig(panel) {
    var themeCfg = (window.ValtoraTheme && window.ValtoraTheme.exitIntent) || {};
    var enabledAttr = panel ? panel.getAttribute('data-exit-enabled') : null;
    var enabled =
      enabledAttr != null
        ? enabledAttr === '1' || enabledAttr === 'true'
        : themeCfg.enabled === true;

    var delayRaw =
      (panel && panel.getAttribute('data-exit-delay')) ||
      themeCfg.delaySeconds ||
      30;
    var delaySec = parseInt(delayRaw, 10);
    if (!isFinite(delaySec) || delaySec < 0) delaySec = 30;

    try {
      var previewOn = localStorage.getItem('valtoraPreviewExitIntent');
      if (previewOn === '0') enabled = false;
      if (previewOn === '1') enabled = true;
      var previewDelay = localStorage.getItem('valtoraPreviewExitIntentDelay');
      if (previewDelay != null && previewDelay !== '') {
        var n = parseInt(previewDelay, 10);
        if (isFinite(n) && n >= 0) delaySec = n;
      }
    } catch (e) {}

    return { enabled: enabled, delaySeconds: delaySec };
  }

  function persistExitIntentResponse(reason, dismissed) {
    var entry = {
      reason: reason || null,
      dismissed: !!dismissed,
      at: new Date().toISOString(),
      path: location.pathname || '',
      href: location.href || '',
      market: detectMarket(),
    };

    try {
      sessionStorage.setItem('valtora_exit_reason', reason || (dismissed ? 'dismissed' : 'unknown'));
      sessionStorage.setItem('valtora_exit_intent_at', entry.at);
    } catch (e) {}

    appendExitIntentLog(entry);

    if (reason) {
      vTrack('exit_intent_response', { reason: reason });
      if (window.ValtoraUTM && typeof window.ValtoraUTM.setAttribute === 'function') {
        window.ValtoraUTM.setAttribute('exit_intent_reason', reason);
        window.ValtoraUTM.setAttribute('exit_intent_at', entry.at);
      } else if (window.fetch) {
        fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributes: {
              exit_intent_reason: reason,
              exit_intent_at: entry.at,
            },
          }),
        }).catch(function () {});
      }
    } else {
      vTrack('exit_intent_dismiss', {});
    }

    return entry;
  }

  window.ValtoraExitIntent = {
    getLog: readExitIntentLog,
    clearLog: function () {
      try {
        localStorage.removeItem(EXIT_LOG_KEY);
      } catch (e) {}
    },
    exportJson: function () {
      return JSON.stringify(readExitIntentLog(), null, 2);
    },
  };

  function initExitIntent() {
    var panel = document.querySelector('[data-exit-intent]');
    if (!panel) return;

    var cfg = resolveExitIntentConfig(panel);
    if (!cfg.enabled) return;
    if (sessionFlag('valtora_exit_intent')) return;

    var thanks = panel.querySelector('[data-exit-thanks]');
    var open = false;
    var readyAt = Date.now() + cfg.delaySeconds * 1000;

    function show() {
      if (open || sessionFlag('valtora_exit_intent')) return;
      if (Date.now() < readyAt) return;
      open = true;
      panel.hidden = false;
      document.body.classList.add('has-exit-intent');
    }

    function hide() {
      panel.hidden = true;
      document.body.classList.remove('has-exit-intent');
      open = false;
    }

    function storeReason(reason) {
      setSessionFlag('valtora_exit_intent');
      persistExitIntentResponse(reason, false);
      if (thanks) {
        thanks.hidden = false;
        setTimeout(hide, 900);
      } else {
        hide();
      }
    }

    panel.querySelectorAll('[data-exit-reason]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        storeReason(btn.getAttribute('data-exit-reason') || 'unknown');
      });
    });
    var closeBtn = panel.querySelector('[data-exit-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        setSessionFlag('valtora_exit_intent');
        persistExitIntentResponse(null, true);
        hide();
      });
    }

    document.addEventListener('mouseout', function (e) {
      if (e.clientY > 0) return;
      if (e.relatedTarget || e.toElement) return;
      show();
    });

    var lastY = window.scrollY || 0;
    var upStreak = 0;
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY || 0;
        if (y < lastY) upStreak += lastY - y;
        else upStreak = 0;
        lastY = y;
        if (upStreak > 180 && y < 80) show();
      },
      { passive: true }
    );
  }

  function initTrustMarquee() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var viewports = document.querySelectorAll('[data-trust-marquee]');
    if (!viewports.length) return;

    function prepare(viewport) {
      var track = viewport.querySelector('.trust-bar__track');
      if (!track) return;

      var lists = Array.prototype.filter.call(track.children, function (el) {
        return el.classList && el.classList.contains('trust-bar__list');
      });
      if (!lists.length) return;

      var primary = lists[0];
      /* Drop any prior JS clones; keep the first list as the segment */
      lists.forEach(function (ul, i) {
        if (i > 0) ul.remove();
      });

      if (reduce) {
        track.style.removeProperty('--trust-marquee-shift');
        track.style.animation = 'none';
        return;
      }

      track.style.animation = '';

      var segmentWidth = Math.ceil(primary.getBoundingClientRect().width);
      if (!segmentWidth) return;

      var need = Math.max(viewport.clientWidth * 2, segmentWidth * 2);
      var total = segmentWidth;
      var guard = 0;
      while (total < need && guard < 8) {
        var clone = primary.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(function (a) {
          a.setAttribute('tabindex', '-1');
        });
        track.appendChild(clone);
        total += segmentWidth;
        guard += 1;
      }

      /* Animate exactly one segment so the loop is seamless with N copies */
      track.style.setProperty('--trust-marquee-shift', -segmentWidth + 'px');
    }

    function prepareAll() {
      viewports.forEach(prepare);
    }

    prepareAll();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(prepareAll, 120);
    });
  }

  function resolvePhoneDial(market, iso) {
    var country = String(iso || '').toUpperCase();
    if (country === 'GB' || country === 'UK') return '+44';
    if (country === 'AE') return '+971';
    if (country === 'US') return '+1';
    if (country === 'GH') return '+233';
    if (country === 'NG') return '+234';
    if (EUROPE_DIAL[country]) return EUROPE_DIAL[country];
    var m = String(market || '').toLowerCase();
    if (PHONE_DIAL[m]) return PHONE_DIAL[m];
    return '';
  }

  function initRequestPhoneCodes() {
    document.querySelectorAll('[data-phone-cc]').forEach(function (select) {
      var wrap = select.closest('[data-size-reserve]') || select.closest('form') || document;
      var input = wrap.querySelector('[data-request-phone-input]');
      var combined = wrap.querySelector('[data-request-phone-combined]');
      var market =
        (wrap.getAttribute && wrap.getAttribute('data-market')) ||
        document.documentElement.getAttribute('data-market') ||
        detectMarket();
      var iso =
        document.documentElement.getAttribute('data-country') ||
        (window.Shopify && window.Shopify.country) ||
        '';
      var code = resolvePhoneDial(market, iso);
      if (code) {
        var has = false;
        Array.prototype.forEach.call(select.options, function (opt) {
          if (opt.value === code) has = true;
        });
        if (!has) {
          var extra = document.createElement('option');
          extra.value = code;
          extra.textContent = code;
          select.appendChild(extra);
        }
        select.value = code;
      }
      function syncPhone() {
        var local = input ? String(input.value || '').replace(/^\s+/, '') : '';
        local = local.replace(/^\+\d{1,4}\s*/, '');
        var prefix = select.value || '';
        if (combined) combined.value = local ? prefix + ' ' + local : '';
        if (input && input.getAttribute('name') === 'contact[phone]') {
          input.setAttribute('data-phone-local', local);
        }
      }
      select.addEventListener('change', syncPhone);
      if (input) {
        input.addEventListener('input', syncPhone);
        input.placeholder = 'Phone number';
      }
      syncPhone();
    });
  }

  function applyShareMeta(brandName, brandLine, tagline, shareTemplate) {
    var name = (brandName || 'Numa').trim() || 'Numa';
    var line = brandLine == null ? '' : String(brandLine).trim();
    var site = line ? name + ' ' + line : name;
    var market = document.documentElement.getAttribute('data-market') || detectMarket();
    var tone = (tagline || (market === 'ae' ? 'Engineered for the Gulf' : DEFAULT_TAGLINE)).trim();
    var fallbackShare = market === 'gb' ? SHARE_DESC_GB : SHARE_DESC_AE;
    var template = (shareTemplate && String(shareTemplate).trim()) || fallbackShare;
    if (market === 'gb' && /Gulf|Premium Sleep|UAE|expat/i.test(template)) {
      template = SHARE_DESC_GB;
    }
    if (market === 'ae' && !/Gulf|Tabby|Tamara|UAE/i.test(template) && template === SHARE_DESC_GB) {
      template = SHARE_DESC_AE;
    }
    var desc = template
      .split('[Brand]')
      .join(name)
      .split('[Line]')
      .join(line)
      .split('[Tagline]')
      .join(tone)
      .replace(/\s+/g, ' ')
      .trim();
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var currentTitle = titleEl.textContent || '';
      // Keep page titles like "Manufacturing · Brand"; only rewrite bare homepage titles.
      if (/ · /.test(currentTitle)) {
        titleEl.textContent = currentTitle.replace(/Aligna|Sattva|Valtora/gi, name);
      } else if (/preview|aligna|mattres|valtora|sattva/i.test(currentTitle)) {
        titleEl.textContent = site;
      }
    }
    function setMeta(selector, value) {
      var el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    }
    setMeta('meta[name="application-name"]', name);
    setMeta('meta[name="apple-mobile-web-app-title"]', name);
    setMeta('meta[property="og:site_name"]', name);
    setMeta('meta[property="og:title"]', site);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:image:alt"]', site);
    setMeta('meta[name="twitter:title"]', site);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[name="twitter:image:alt"]', site);
    if (!document.querySelector('meta[name="description"]')) return;
    setMeta('meta[name="description"]', desc);
  }

  function formatLeadLine(template, lead) {
    var DEFAULT_LINE =
      'Made to order. Current window: [lead]. Cancel any time before dispatch for a full refund.';
    var text = template == null || String(template).trim() === '' ? DEFAULT_LINE : String(template);
    lead = lead == null ? '' : String(lead).trim();
    if (!lead) {
      return text
        .replace(/\s*Current window:\s*\[lead\]\.?/gi, '')
        .replace(/\s*Current window:\s*\[X-Y\]\.?/gi, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\.\s*\./g, '.')
        .trim();
    }
    return text.split('[lead]').join(lead).split('[X-Y]').join(lead);
  }

  function isPreviewHost() {
    try {
      return (
        location.port === '5173' ||
        location.port === '5190' ||
        /\/(preview|share)\//.test(location.pathname)
      );
    } catch (e) {
      return false;
    }
  }

  function initPreviewBrandChrome() {
    // Preview: apply homepage controls (brand, fonts, scheme) on every page.
    // Live Shopify: trust server-rendered settings - never override with
    // preview localStorage or JS defaults (that caused theme blinks).
    var previewHost = isPreviewHost();
    if (!previewHost) {
      return;
    }

    var fonts = {
      modern:
        'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
      classic:
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap',
      v2:
        'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
    };
    var schemeThemeColors = {
      signature: '#1F3A5F',
      classic_navy: '#1F3A5F',
      warm_charcoal: '#2F2C28',
      cool_graphite: '#1E2A32',
      v2_carbon: '#1A1A1A',
      v2_graphite: '#3A3A3C',
      v2_warm: '#1A1A1A',
      v2_cool: '#1A1A1A',
    };

    var boot = window.__valtoraPreviewBoot || {};
    var name = boot.name || 'Numa';
    var line = typeof boot.line === 'string' ? boot.line : 'Mattresses';
    var guidelines = boot.guidelines || 'v1';
    var fontSet = boot.fontSet || 'modern';
    var scheme = boot.scheme || 'signature';
    try {
      name = localStorage.getItem('valtoraPreviewBrand') || name;
      if (String(name).toLowerCase() === 'aligna') {
        name = 'Numa';
        localStorage.setItem('valtoraPreviewBrand', 'Numa');
      }
      var savedLine = localStorage.getItem('valtoraPreviewBrandLine');
      if (savedLine !== null) line = savedLine;
      guidelines = localStorage.getItem('valtoraPreviewBrandGuidelines') || guidelines;
      fontSet = localStorage.getItem('valtoraPreviewFontSet') || fontSet;
      scheme = localStorage.getItem('valtoraPreviewColorScheme') || scheme;
    } catch (e) {}

    if (window.ValtoraTheme) {
      window.ValtoraTheme.brandName = name;
    }

    document.querySelectorAll('[data-brand-text]').forEach(function (el) {
      el.textContent = name;
    });
    document.querySelectorAll('[data-brand-product-line], .wordmark__product').forEach(function (el) {
      el.textContent = line;
      el.hidden = !line;
    });
    document.querySelectorAll('.wordmark').forEach(function (a) {
      a.setAttribute('aria-label', line ? name + ' ' + line : name);
    });
    var tradingName = line ? name + ' ' + line : name;
    document.querySelectorAll('[data-trading-as]').forEach(function (el) {
      el.textContent = tradingName;
    });
    document.querySelectorAll('[data-trading-as-wrap]').forEach(function (el) {
      el.textContent = tradingName ? 'Trading as ' + tradingName : '';
    });
    document.documentElement.setAttribute('data-brand-hydrated', '1');

    try {
      var email = localStorage.getItem('valtoraPreviewBusinessEmail');
      if (email) {
        document.querySelectorAll('[data-business-email]').forEach(function (el) {
          el.textContent = email;
          if (el.tagName === 'A' || el.tagName === 'a') {
            el.setAttribute('href', 'mailto:' + email);
          }
        });
      }
      var legal = localStorage.getItem('valtoraPreviewBusinessName');
      if (legal) {
        document.querySelectorAll('[data-business-name]').forEach(function (el) {
          el.textContent = legal;
        });
        if (window.ValtoraTheme) window.ValtoraTheme.legalName = legal;
      }
    } catch (e) {}

    var tagline = applyPreviewTagline(detectTaglineMarket());
    var shareCopy = '';
    try {
      shareCopy = localStorage.getItem('valtoraPreviewShareCopy') || '';
    } catch (e) {}
    applyShareMeta(name, line, tagline, shareCopy);

    if (guidelines === 'v1' || guidelines === 'v2') {
      document.documentElement.setAttribute('data-brand-guidelines', guidelines);
    }
    if (guidelines === 'v2') {
      document.documentElement.setAttribute('data-font-set', 'v2');
      fontSet = 'v2';
      if (!scheme || scheme.indexOf('v2_') !== 0) scheme = 'v2_carbon';
    } else if (fontSet === 'modern' || fontSet === 'classic') {
      document.documentElement.setAttribute('data-font-set', fontSet);
    }
    if (scheme) document.documentElement.setAttribute('data-color-scheme', scheme);

    var businessName = (boot && boot.business) || '';
    try {
      businessName = localStorage.getItem('valtoraPreviewBusinessName') || businessName;
    } catch (e2) {}
    window.__valtoraPreviewBoot = {
      name: name,
      line: line,
      business: businessName,
      guidelines: guidelines,
      fontSet: fontSet,
      scheme: scheme,
      market: (boot && boot.market) || '',
    };
    if (typeof window.__valtoraInjectPreviewScheme === 'function') {
      window.__valtoraInjectPreviewScheme(window.__valtoraPreviewBoot);
    }
    if (typeof window.__valtoraApplyBrandFavicon === 'function') {
      window.__valtoraApplyBrandFavicon(window.__valtoraPreviewBoot);
    }

    try {
      var leadWindow = localStorage.getItem('valtoraPreviewLeadWindow');
      if (leadWindow === null) leadWindow = '8 to 10 weeks';
      var leadTemplate = localStorage.getItem('valtoraPreviewLeadLine');
      document.querySelectorAll('[data-lead-line]').forEach(function (el) {
        el.textContent = formatLeadLine(leadTemplate, leadWindow);
      });
    } catch (e) {}

    var fontLink =
      document.getElementById('PreviewFontLink') ||
      document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.id = 'PreviewFontLink';
      document.head.appendChild(fontLink);
    }
    if (fonts[fontSet]) fontLink.href = fonts[fontSet];

    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta && schemeThemeColors[scheme]) {
      themeMeta.setAttribute('content', schemeThemeColors[scheme]);
    }

    var title = document.querySelector('title');
    if (title) {
      var page = document.body && document.body.getAttribute('data-page');
      if (page === 'checkout') title.textContent = 'Checkout · ' + name;
      else if (page === 'order-confirmed') title.textContent = 'Order confirmed · ' + name;
      else if (page === 'cart') title.textContent = 'Order · ' + name;
      else if (/ · /.test(title.textContent) || /Aligna|Sattva|Valtora/i.test(title.textContent)) {
        title.textContent = title.textContent.replace(/Aligna|Sattva|Valtora/gi, name);
      }
    }
  }

  function marketOnlyShouldShow(el, market) {
    var only = el.getAttribute('data-market-only');
    if (!only) return true;
    var resolved = isSizeMarket(market) ? market : 'gb';
    var tokens = String(only).split(',').map(function (t) { return t.trim(); });
    var i;
    for (i = 0; i < tokens.length; i++) {
      if (tokens[i] === resolved) return true;
    }
    var isSizeTable =
      (el.classList && el.classList.contains('policy-table')) ||
      (el.querySelector && el.querySelector('.size-table'));
    if (isSizeTable) return false;
    // US / EU / unknown copy falls back to UK when no dedicated token exists.
    if (resolved !== 'ae') {
      for (i = 0; i < tokens.length; i++) {
        if (tokens[i] === 'gb') return true;
      }
    }
    return false;
  }

  function applyMarketOnlyVisibility(market) {
    market = market || document.documentElement.getAttribute('data-market') || detectMarket();
    document.querySelectorAll('[data-market-only]').forEach(function (el) {
      var show = marketOnlyShouldShow(el, market);
      el.hidden = !show;
      if (show) el.removeAttribute('hidden');
    });
    paintContactHours();
  }
  window.__valtoraApplyMarketOnlyVisibility = applyMarketOnlyVisibility;

  function setClaimVisibility(selector, on) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (on) {
        el.hidden = false;
        el.removeAttribute('hidden');
        el.classList.remove('is-claim-off');
        el.removeAttribute('aria-hidden');
      } else {
        el.hidden = true;
        el.setAttribute('hidden', '');
        el.classList.add('is-claim-off');
        el.setAttribute('aria-hidden', 'true');
      }
    });
    syncCertStripVisibility();
  }

  function syncCertStripVisibility() {
    document.querySelectorAll('.cert-strip').forEach(function (strip) {
      var items = strip.querySelectorAll('.cert-strip__item, [data-claim-chemicals], [data-claim-oeko], [data-oeko-claim]');
      var anyOn = false;
      if (!items.length) {
        items = strip.children;
      }
      Array.prototype.forEach.call(items, function (it) {
        if (it.hidden || it.hasAttribute('hidden') || it.classList.contains('is-claim-off')) return;
        if (it.getAttribute('aria-hidden') === 'true') return;
        anyOn = true;
      });
      strip.hidden = !anyOn;
      if (anyOn) {
        strip.removeAttribute('hidden');
        strip.classList.remove('is-empty');
      } else {
        strip.setAttribute('hidden', '');
        strip.classList.add('is-empty');
      }
      var wrap = strip.parentElement;
      if (wrap && wrap.classList.contains('page-width')) {
        wrap.setAttribute('data-cert-strip-wrap', '');
        wrap.hidden = !anyOn;
        if (anyOn) {
          wrap.removeAttribute('hidden');
          wrap.classList.remove('is-empty');
        } else {
          wrap.setAttribute('hidden', '');
          wrap.classList.add('is-empty');
        }
      }
    });
  }

  function initPreviewClaimToggles() {
    if (!isPreviewHost()) return;
    var chemOn = false;
    var oekoOn = false;
    var oekoCert = '';
    try {
      chemOn = localStorage.getItem('valtoraPreviewClaimChemicals') === '1';
      oekoOn = localStorage.getItem('valtoraPreviewClaimOeko') === '1';
      oekoCert = String(localStorage.getItem('valtoraPreviewOekoCert') || '').trim();
    } catch (e) {}
    oekoOn = oekoOn && !!oekoCert;
    document.querySelectorAll('[data-oeko-cert-no]').forEach(function (el) {
      el.textContent = oekoOn ? oekoCert : '';
    });
    setClaimVisibility('[data-claim-chemicals]', chemOn);
    setClaimVisibility('[data-claim-oeko]', oekoOn);
    setClaimVisibility('[data-oeko-claim]', chemOn && oekoOn);
    syncCertStripVisibility();
  }

  function initPreviewAnnouncement() {
    if (!isPreviewHost()) return;

    var BANNER =
      'Concierge unpacking included with every mattress · To the room of your choice, packaging taken away';
    var DEFAULT_AE = BANNER;
    var DEFAULT_GB = BANNER;
    var textAe = DEFAULT_AE;
    var textGb = DEFAULT_GB;
    var enabled = true;
    try {
      var savedAe = localStorage.getItem('valtoraPreviewAnnouncementAe');
      var savedGb = localStorage.getItem('valtoraPreviewAnnouncementGb');
      var savedOn = localStorage.getItem('valtoraPreviewAnnouncementOn');
      if (savedAe !== null) textAe = savedAe;
      if (savedGb !== null) textGb = savedGb;
      if (savedOn === '0') enabled = false;
    } catch (e) {}

    var bar = document.querySelector('[data-announcement-bar], .announcement');
    if (!bar) {
      var header = document.querySelector('header.site-header, .site-header');
      var chrome = document.querySelector('.preview-banner');
      bar = document.createElement('div');
      bar.className = 'announcement';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Announcement');
      bar.setAttribute('data-announcement-bar', '');
      bar.innerHTML =
        '<p style="margin:0" data-market-announcement>' +
        '<span data-market-only="ae"></span>' +
        '<span data-market-only="gb" hidden></span>' +
        '</p>';
      if (chrome && chrome.parentNode) {
        chrome.parentNode.insertBefore(bar, chrome.nextSibling);
      } else if (header && header.parentNode) {
        header.parentNode.insertBefore(bar, header);
      } else if (document.body) {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    } else {
      bar.setAttribute('data-announcement-bar', '');
    }

    var aeEl =
      bar.querySelector('[data-market-only="ae"]') ||
      bar.querySelector('[data-announcement-ae]');
    var gbEl =
      bar.querySelector('[data-market-only="gb"]') ||
      bar.querySelector('[data-announcement-gb]');
    var plain = bar.querySelector('[data-market-announcement]') || bar.querySelector('p, a');

    if (aeEl) aeEl.textContent = textAe;
    if (gbEl) gbEl.textContent = textGb;
    if (!aeEl && !gbEl && plain) {
      var market = detectMarket();
      plain.textContent = market === 'gb' ? textGb : textAe;
    }

    bar.hidden = !enabled;
    if (enabled) bar.removeAttribute('hidden');
    else bar.setAttribute('hidden', '');

    applyMarketOnlyVisibility(detectMarket());
  }

  function syncChromeOffsets() {
    var header = document.querySelector('header.site-header, .site-header');
    if (header) {
      var headerH = Math.round(header.getBoundingClientRect().height);
      if (headerH > 0) {
        document.documentElement.style.setProperty('--header-height', headerH + 'px');
      }
    }
  }

  function initAnnouncementDismiss() {
    var bar = document.querySelector('[data-announcement-bar], .announcement');
    if (!bar) return;
    try {
      if (sessionStorage.getItem('numaAnnouncementDismissed') === '1') {
        bar.hidden = true;
        return;
      }
    } catch (e) {}
    var btn = bar.querySelector('[data-announcement-dismiss]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      bar.hidden = true;
      try {
        sessionStorage.setItem('numaAnnouncementDismissed', '1');
      } catch (err) {}
    });
  }

  function sizeGuideMarketLabel(code) {
    var m = String(code || '').toLowerCase();
    if (m === 'ae') return 'United Arab Emirates';
    if (m === 'us') return 'United States';
    if (m === 'eu') return 'Europe';
    if (m === 'au') return 'Australia / New Zealand';
    return 'United Kingdom';
  }

  function sizeGuideBedVars(row) {
    var w = parseInt(row && row.width_cm, 10);
    var l = parseInt(row && row.length_cm, 10);
    var pieces = parseInt(row && row.pieces, 10) || 1;
    var dims = (row && (rowDimsText(row) || row.dims)) || '';
    if (!(w && l) && dims) {
      var range = String(dims).match(/(\d+)\s*-\s*\d+\s*[×x]\s*(\d+)/);
      var triple = String(dims).match(/(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)/);
      var pair = String(dims).match(/(\d+)\s*[×x]\s*(\d+)/);
      if (range) {
        w = parseInt(range[1], 10);
        l = parseInt(range[2], 10);
      } else if (triple) {
        pieces = parseInt(triple[1], 10) || pieces;
        w = parseInt(triple[2], 10);
        l = parseInt(triple[3], 10);
      } else if (pair) {
        w = parseInt(pair[1], 10);
        l = parseInt(pair[2], 10);
      }
    }
    return { w: w || 150, l: l || 200, pieces: pieces };
  }

  function rowsForSizeGuide(market) {
    var primary = catalogRowsFrom(readSizePriceRows(), catalogIsoForMarket(market));
    if (!primary.length && document.documentElement.getAttribute('data-preview') === 'true' && !readSizePriceRows().length) {
      var resolved = isSizeMarket(market) ? market : 'gb';
      primary = (SIZE_MAPS[resolved] || SIZE_MAPS.gb || []).map(function (s) {
        return Object.assign({ market: resolved, markets: [marketToTabKey(resolved)] }, s);
      });
    }
    return primary;
  }

  function buildSizeGuideTile(row, tabKey, reserveBase) {
    var name = rowDisplayName(row, tabKey) || row.label || '';
    var dims = rowDimsText(row);
    var bed = sizeGuideBedVars(row);
    var fits = row.fits || '';
    var price = row.price || '';
    var id = row.id || '';
    var href = (reserveBase || '/') + (id ? '?size=' + encodeURIComponent(id) : '') + '#reserve';
    var splitClass = bed.pieces > 1 ? ' size-guide-tile__shape--split' : '';
    return (
      '<article class="size-guide-tile" data-size-id="' +
      escapeHtml(id) +
      '">' +
      '<div class="size-guide-tile__bed" aria-hidden="true">' +
      '<span class="size-guide-tile__shape' +
      splitClass +
      '" style="--bed-w: ' +
      bed.w +
      '; --bed-l: ' +
      bed.l +
      ';"></span></div>' +
      '<h3 class="size-guide-tile__name">' +
      escapeHtml(name) +
      '</h3>' +
      '<p class="size-guide-tile__dims">' +
      escapeHtml(dims) +
      '</p>' +
      (fits ? '<p class="size-guide-tile__fits">' + escapeHtml(fits) + '</p>' : '') +
      (price ? '<p class="size-guide-tile__price">' + escapeHtml(price) + '</p>' : '') +
      '<a class="size-guide-tile__reserve" href="' +
      escapeHtml(href) +
      '">Reserve this size</a></article>'
    );
  }

  function initSizeGuide() {
    var root = document.querySelector('[data-size-guide]');
    if (!root) return;

    var grid = root.querySelector('[data-size-guide-grid]');
    var labelEl = root.querySelector('[data-size-guide-market-label]');
    var noteEl = root.querySelector('[data-size-guide-uk-note]');
    var emptyEl = root.querySelector('[data-size-guide-empty]');
    var staticUk = root.querySelector('[data-size-guide-uk-grid]');
    var staticUkNote = root.querySelector('[data-size-guide-uk-static]');
    var staticEmpty = root.querySelector('[data-size-guide-empty-static]');
    var reserveBase = root.getAttribute('data-reserve-href') || '/';

    function paint() {
      var market = detectMarket();
      var iso =
        (window.ValtoraTheme && window.ValtoraTheme.countryIso) ||
        (document.documentElement && document.documentElement.getAttribute('data-country')) ||
        (window.Shopify && window.Shopify.country) ||
        '';
      var usedFallback = !!(String(iso).trim() && !countryToSizeMarket(iso));
      var rows = rowsForSizeGuide(market);
      if (!rows.length && market !== 'gb') {
        rows = rowsForSizeGuide('gb');
        usedFallback = !!rows.length;
        market = rows.length ? 'gb' : market;
      }
      var tab = marketToTabKey(market);
      if (labelEl) labelEl.textContent = sizeGuideMarketLabel(market);
      if (noteEl) {
        noteEl.hidden = !usedFallback;
        if (usedFallback) noteEl.removeAttribute('hidden');
      }
      if (staticUk) staticUk.hidden = true;
      if (staticUkNote) staticUkNote.hidden = true;
      if (staticEmpty) staticEmpty.hidden = true;
      if (!grid) return;
      if (!rows.length) {
        if (emptyEl) {
          emptyEl.hidden = false;
          emptyEl.removeAttribute('hidden');
        }
        grid.innerHTML = '';
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      grid.innerHTML = rows
        .map(function (row) {
          return buildSizeGuideTile(row, tab, reserveBase);
        })
        .join('');
    }

    paint();
    root._valtoraOnMarketChange = paint;
    document.addEventListener('preview:market-changed', paint);
  }

  function boot() {
    unlockPageOverflow();
    initPreviewBrandChrome();
    var market = detectMarket();
    document.documentElement.setAttribute('data-market', market);
    if (document.body && !document.body.getAttribute('data-market')) {
      document.body.setAttribute('data-market', market);
    }
    document.querySelectorAll('[data-size-markets]').forEach(paintMarketTabs);
    hydratePolicyStrips(document);
    applyMarketOnlyVisibility(market);
    initPreviewAnnouncement();
    applyPreviewTopsFlag();
    initReveal();
    initSectionGrounds();
    initSectionWipes();
    initTrustMarquee();
    initPreviewClaimToggles();
    initScrollProgress();
    initParallax();
    initInViewVideo();
    initMagneticButtons();
    initTiltCards();
    initFaq();
    initSpecPanel();
    initAllReserves();
    initSizeGuide();
    initLifestyleCaptions();
    initMobileNav();
    if (window.location.hash) applyHashTarget(window.location.hash);
    initRequestPhoneCodes();
    rewriteHomeSectionLinks();
    syncChromeOffsets();
    window.addEventListener('resize', syncChromeOffsets);
    initStickyReserve();
    initCartPage();
    initCheckoutPage();
    initOrderConfirmed();
    initComfortTop();
    initBedSheets();
    initPillows();
    initPdpSpecs();
    initReviews();
    initFunnelTracking();
    initLandingFunnel();
    initLandingConfigure();
    initExitIntent();
    initAnnouncementDismiss();
    // Cross-tab / cross-page: when localStorage basket changes, refresh UI from
    // the freshest stamped payload (never resurrect a fuller stale copy).
    window.addEventListener('storage', function (e) {
      if (!e || e.key !== OrderStore.KEY) return;
      restoreBasketUi();
    });
    restoreBasketUi();
    window.addEventListener('pageshow', function () {
      unlockMobileNav();
      if (isSuccessfulOrderSurface(location.pathname + location.search)) {
        try {
          var lines = OrderStore.lines();
          if (lines && lines.length) {
            OrderStore.saveLastOrder({
              lines: lines,
              units: OrderStore.units(lines),
              line_count: lines.length,
              value: OrderStore.orderValue(lines),
              order_id: 'SHOPIFY',
            });
            OrderStore.clear();
          }
        } catch (err) {}
      }
      restoreBasketUi();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
