/**
 * Preview-only: apply saved brand chrome before first paint.
 * Must be loaded synchronously in <head> (no defer/async).
 * Live Shopify must never depend on this - theme settings render server-side.
 *
 * Writes data-* attributes AND injects CSS variables so funnel pages
 * (cart / checkout / thank-you) always match homepage theme controls.
 */
(function () {
  'use strict';

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

  if (!isPreviewHost()) return;

  var BOOT_SRC = '';
  try {
    BOOT_SRC = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  } catch (e) {}

  var FONTS = {
    modern:
      'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
    classic:
      'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
    v2:
      'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
  };

  // Full token tables (mirror preview/base.css + css-variables.liquid)
  var SCHEMES = {
    signature: {
      primary: '#1F3A5F',
      accent: '#8A6D3B',
      bg: '#F7F5F1',
      surface: '#EAE6DF',
      ink: '#222222',
      onDark: '#F7F5F1',
      wordmark: '#8A6D3B',
      wordmarkLine2: '#1F3A5F',
      wordmarkLine2OnDark: '#F7F5F1',
      heading: '#222222',
      eyebrow: '#8A6D3B',
      eyebrowOnDark: '#F7F5F1',
    },
    classic_navy: {
      primary: '#1F3A5F',
      accent: '#8A6D3B',
      bg: '#F7F5F1',
      surface: '#EAE6DF',
      ink: '#222222',
      onDark: '#F7F5F1',
      wordmark: '#1F3A5F',
      wordmarkLine2: '#8A6D3B',
      wordmarkLine2OnDark: '#F7F5F1',
      heading: '#1F3A5F',
      eyebrow: '#1F3A5F',
      eyebrowOnDark: '#F7F5F1',
    },
    warm_charcoal: {
      primary: '#2F2C28',
      accent: '#9A7344',
      bg: '#F5F1EA',
      surface: '#E7E0D4',
      ink: '#1A1917',
      onDark: '#F5F1EA',
      wordmark: '#9A7344',
      wordmarkLine2: '#2F2C28',
      wordmarkLine2OnDark: '#F5F1EA',
      heading: '#1A1917',
      eyebrow: '#9A7344',
      eyebrowOnDark: '#F5F1EA',
    },
    cool_graphite: {
      primary: '#1E2A32',
      accent: '#6E8494',
      bg: '#F3F4F3',
      surface: '#E4E7E6',
      ink: '#1C2124',
      onDark: '#F3F4F3',
      wordmark: '#6E8494',
      wordmarkLine2: '#1E2A32',
      wordmarkLine2OnDark: '#F3F4F3',
      heading: '#1C2124',
      eyebrow: '#6E8494',
      eyebrowOnDark: '#F3F4F3',
    },
    v2_carbon: {
      primary: '#1A1A1A',
      accent: '#8A6D3B',
      bg: '#F5F4F1',
      surface: '#E4E1DA',
      ink: '#1A1A1A',
      onDark: '#F5F4F1',
      wordmark: '#1A1A1A',
      wordmarkLine2: '#8A6D3B',
      wordmarkLine2OnDark: '#F5F4F1',
      heading: '#1A1A1A',
      eyebrow: '#6B6B70',
      eyebrowOnDark: '#F5F4F1',
    },
    v2_graphite: {
      primary: '#3A3A3C',
      accent: '#8A6D3B',
      bg: '#F5F4F1',
      surface: '#E4E1DA',
      ink: '#3A3A3C',
      onDark: '#F5F4F1',
      wordmark: '#3A3A3C',
      wordmarkLine2: '#8A6D3B',
      wordmarkLine2OnDark: '#F5F4F1',
      heading: '#3A3A3C',
      eyebrow: '#6B6B70',
      eyebrowOnDark: '#F5F4F1',
    },
    v2_warm: {
      primary: '#1A1A1A',
      accent: '#9A7344',
      bg: '#F7F4EE',
      surface: '#E8E2D6',
      ink: '#1A1A1A',
      onDark: '#F7F4EE',
      wordmark: '#1A1A1A',
      wordmarkLine2: '#9A7344',
      wordmarkLine2OnDark: '#F7F4EE',
      heading: '#1A1A1A',
      eyebrow: '#7A6A55',
      eyebrowOnDark: '#F7F4EE',
    },
    v2_cool: {
      primary: '#1A1A1A',
      accent: '#6E8494',
      bg: '#F3F4F3',
      surface: '#E4E7E6',
      ink: '#1A1A1A',
      onDark: '#F3F4F3',
      wordmark: '#1A1A1A',
      wordmarkLine2: '#6E8494',
      wordmarkLine2OnDark: '#F3F4F3',
      heading: '#1A1A1A',
      eyebrow: '#6B6B70',
      eyebrowOnDark: '#F3F4F3',
    },
  };

  var FONT_TOKENS = {
    zip: {
      serif: "'Instrument Sans', system-ui, sans-serif",
      sans: "'Inter', system-ui, sans-serif",
      wordmark: "'Instrument Sans', system-ui, sans-serif",
      headline: "'Instrument Sans', system-ui, sans-serif",
      display: "'Instrument Sans', system-ui, sans-serif",
      text: "'Inter', system-ui, sans-serif",
      mono: "'Geist Mono', ui-monospace, monospace",
      tracking: '0.18em',
    },
  };
  FONT_TOKENS.modern = FONT_TOKENS.zip;
  FONT_TOKENS.classic = FONT_TOKENS.zip;
  FONT_TOKENS.v2 = FONT_TOKENS.zip;

  var d = document.documentElement;
  d.setAttribute('data-preview-host', '1');

  var name = 'Numa';
  var line = 'Mattresses';
  var business = 'Valtora FZE';
  var guidelines = 'v1';
  var fontSet = 'modern';
  var scheme = 'signature';
  var market = '';
  var taglineMarket = '';

  try {
    name = localStorage.getItem('valtoraPreviewBrand') || name;
    if (String(name).toLowerCase() === 'aligna') {
      name = 'Numa';
      localStorage.setItem('valtoraPreviewBrand', 'Numa');
    }
    var savedLine = localStorage.getItem('valtoraPreviewBrandLine');
    if (savedLine !== null) line = savedLine;
    business = localStorage.getItem('valtoraPreviewBusinessName') || business;
    guidelines = localStorage.getItem('valtoraPreviewBrandGuidelines') || guidelines;
    fontSet = localStorage.getItem('valtoraPreviewFontSet') || fontSet;
    scheme = localStorage.getItem('valtoraPreviewColorScheme') || scheme;
    market = localStorage.getItem('valtoraPreviewMarket') || '';
    taglineMarket = localStorage.getItem('valtoraPreviewTaglineMarket') || market;
  } catch (e) {}

  // a1e2 overlay defaulted preview to Carbon. Live Numa is navy/gold again.
  if (guidelines === 'v2' && (!scheme || scheme === 'v2_carbon')) {
    guidelines = 'v1';
    fontSet = 'modern';
    scheme = 'signature';
    try {
      localStorage.setItem('valtoraPreviewBrandGuidelines', 'v1');
      localStorage.setItem('valtoraPreviewFontSet', 'modern');
      localStorage.setItem('valtoraPreviewColorScheme', 'signature');
    } catch (e2) {}
  }

  if (guidelines === 'v2') {
    fontSet = 'v2';
    if (!scheme || String(scheme).indexOf('v2_') !== 0) scheme = 'v2_carbon';
  } else if (scheme && String(scheme).indexOf('v2_') === 0) {
    scheme = 'signature';
  }

  if (guidelines === 'v1' || guidelines === 'v2') {
    d.setAttribute('data-brand-guidelines', guidelines);
  }
  if (fontSet) d.setAttribute('data-font-set', fontSet);
  if (scheme) d.setAttribute('data-color-scheme', scheme);
  if (market === 'ae' || market === 'gb') d.setAttribute('data-market', market);
  if (
    taglineMarket === 'ae' ||
    taglineMarket === 'gb' ||
    taglineMarket === 'us' ||
    taglineMarket === 'eu' ||
    taglineMarket === 'gh' ||
    taglineMarket === 'ng'
  ) {
    d.setAttribute('data-tagline-market', taglineMarket);
  }

  try {
    var forceMotion = localStorage.getItem('valtoraPreviewForceMotion');
    if (forceMotion === '0') d.setAttribute('data-force-motion', 'false');
    else if (forceMotion === '1' || forceMotion === null) d.setAttribute('data-force-motion', 'true');
  } catch (e) {}

  try {
    var titleEl = document.querySelector('title');
    if (titleEl && /Aligna|Sattva|Valtora/i.test(titleEl.textContent)) {
      titleEl.textContent = titleEl.textContent.replace(/Aligna|Sattva|Valtora/gi, name);
    }
  } catch (e) {}

  window.__valtoraPreviewBoot = {
    name: name,
    line: line,
    business: business,
    guidelines: guidelines,
    fontSet: fontSet,
    scheme: scheme,
    market: market,
  };

  function schemeTokens(key) {
    return SCHEMES[key] || SCHEMES.signature;
  }

  function injectSchemeVars(boot) {
    boot = boot || window.__valtoraPreviewBoot;
    if (!boot) return;
    var tokens = schemeTokens(boot.scheme);
    var fonts = FONT_TOKENS[boot.fontSet] || FONT_TOKENS.modern;
    var css =
      'html[data-preview-host]{' +
      '--brand-primary:' +
      tokens.primary +
      ';' +
      '--brand-accent:' +
      tokens.accent +
      ';' +
      '--brand-gold:' +
      tokens.accent +
      ';' +
      '--brand-bg:' +
      tokens.bg +
      ';' +
      '--brand-surface:' +
      tokens.surface +
      ';' +
      '--brand-ink:' +
      tokens.ink +
      ';' +
      '--brand-on-dark:' +
      tokens.onDark +
      ';' +
      '--wordmark-color:' +
      tokens.wordmark +
      ';' +
      '--wordmark-line-2:' +
      (tokens.wordmarkLine2 || tokens.accent) +
      ';' +
      '--wordmark-line-2-on-dark:' +
      (tokens.wordmarkLine2OnDark || tokens.onDark) +
      ';' +
      '--heading-color:' +
      tokens.heading +
      ';' +
      '--eyebrow-color:' +
      tokens.eyebrow +
      ';' +
      '--eyebrow-on-dark:' +
      tokens.eyebrowOnDark +
      ';' +
      '--font-serif:' +
      fonts.serif +
      ';' +
      '--font-sans:' +
      fonts.sans +
      ';' +
      '--font-display:' +
      (fonts.display || fonts.headline) +
      ';' +
      '--font-text:' +
      (fonts.text || fonts.sans) +
      ';' +
      '--font-wordmark:' +
      fonts.wordmark +
      ';' +
      '--font-headline:' +
      fonts.headline +
      ';' +
      '--font-mono:' +
      fonts.mono +
      ';' +
      '--wordmark-tracking:' +
      fonts.tracking +
      ';' +
      '}';
    var style = document.getElementById('valtora-preview-scheme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'valtora-preview-scheme';
      style.setAttribute('data-valtora-scheme', boot.scheme);
      (document.head || d).appendChild(style);
    }
    style.textContent = css;
    style.setAttribute('data-valtora-scheme', boot.scheme);
    style.setAttribute('data-valtora-guidelines', boot.guidelines);
    applyBrandFavicon(boot);
    ensureBrandCss();
  }

  function ensureBrandCss() {
    if (document.getElementById('valtora-brand-css')) return;
    var link = document.createElement('link');
    link.id = 'valtora-brand-css';
    link.rel = 'stylesheet';
    var dir = './';
    if (BOOT_SRC) dir = BOOT_SRC.replace(/[^/]+$/, '');
    else if (/\/blog\/|\/pages\//.test(location.pathname)) dir = '../';
    link.href = dir + 'brand.css?v=a1e2';
    (document.head || d).appendChild(link);
  }

  function applyFontAndTheme() {
    var boot = window.__valtoraPreviewBoot;
    if (!boot) return;
    injectSchemeVars(boot);
    var link =
      document.getElementById('PreviewFontLink') ||
      document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
    if (link && FONTS[boot.fontSet]) {
      var next = FONTS[boot.fontSet];
      if (link.getAttribute('href') !== next) link.setAttribute('href', next);
    }
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta && schemeTokens(boot.scheme).primary) {
      themeMeta.setAttribute('content', schemeTokens(boot.scheme).primary);
    }
  }

  // Mirrors Theme settings → Warranty years (`warranty_years` in settings_data.json).
  var PREVIEW_WARRANTY_YEARS = '25';
  var PREVIEW_TRIAL_NIGHTS = '30';
  var PREVIEW_LAYER_PRICE_GB = '£299';
  var PREVIEW_LAYER_PRICE_AE = 'AED 1,200';

  function warrantyYears() {
    var raw = (d.getAttribute('data-warranty-years') || PREVIEW_WARRANTY_YEARS).trim();
    return raw || PREVIEW_WARRANTY_YEARS;
  }

  function trialNights() {
    var raw = (d.getAttribute('data-trial-nights') || PREVIEW_TRIAL_NIGHTS).trim();
    return raw || PREVIEW_TRIAL_NIGHTS;
  }

  function applyWarrantyYears() {
    var years = warrantyYears();
    d.setAttribute('data-warranty-years', years);
    document.querySelectorAll('[data-warranty-years-text]').forEach(function (el) {
      el.textContent = years;
    });
    applyTrialNights();
  }

  function applyTrialNights() {
    var nights = trialNights();
    d.setAttribute('data-trial-nights', nights);
    document.querySelectorAll('[data-trial-nights-text]').forEach(function (el) {
      el.textContent = nights;
    });
    var market = d.getAttribute('data-market') || 'ae';
    if (!d.getAttribute('data-layer-price')) {
      d.setAttribute('data-layer-price', market === 'gb' ? PREVIEW_LAYER_PRICE_GB : PREVIEW_LAYER_PRICE_AE);
    }
    var layer = d.getAttribute('data-layer-price') || '';
    document.querySelectorAll('[data-layer-price-text]').forEach(function (el) {
      el.textContent = layer;
    });
  }

  function applyBrandText() {
    var boot = window.__valtoraPreviewBoot;
    applyWarrantyYears();
    if (!boot) return;
    var nodes = document.querySelectorAll('[data-brand-text]');
    if (!nodes.length) return false;
    nodes.forEach(function (el) {
      el.textContent = boot.name;
    });
    document.querySelectorAll('[data-brand-product-line], .wordmark__product').forEach(function (el) {
      el.textContent = boot.line;
      el.hidden = !boot.line;
    });
    var taglineText = 'A better bed, for life.';
    try {
      var taglineKey =
        d.getAttribute('data-tagline-market') ||
        localStorage.getItem('valtoraPreviewTaglineMarket') ||
        'ae';
      var taglineMap = JSON.parse(localStorage.getItem('valtoraPreviewTaglines') || '{}');
      if (taglineMap && taglineMap[taglineKey]) taglineText = taglineMap[taglineKey];
      else if (taglineMap && taglineMap.default) taglineText = taglineMap.default;
      else taglineText = localStorage.getItem('valtoraPreviewTagline') || taglineText;
    } catch (e) {}
    document.querySelectorAll('[data-brand-tagline]').forEach(function (el) {
      el.textContent = taglineText;
    });
    document.querySelectorAll('.wordmark').forEach(function (a) {
      a.setAttribute('aria-label', boot.line ? boot.name + ' ' + boot.line : boot.name);
    });
    d.setAttribute('data-brand-hydrated', '1');
    applyBusinessName(boot);
    applyBrandFavicon(boot);
    return true;
  }

  function applyBusinessName(boot) {
    boot = boot || window.__valtoraPreviewBoot;
    if (!boot) return;
    var legal = (boot.business || '').trim();
    if (!legal) return;
    document.querySelectorAll('[data-business-name]').forEach(function (el) {
      el.textContent = legal;
    });
  }

  function brandInitials(name) {
    var raw = String(name || '').trim();
    if (!raw) return 'A';
    var skip = /^(the|and|of|for|a|an|&)$/i;
    var words = raw.split(/[\s\-]+/).filter(function (w) {
      return w && !skip.test(w);
    });
    if (!words.length) words = raw.split(/[\s\-]+/).filter(Boolean);
    var letters = '';
    var i;
    for (i = 0; i < words.length && letters.length < 2; i++) {
      var ch = words[i].charAt(0);
      if (/[A-Za-z0-9]/.test(ch)) letters += ch.toUpperCase();
    }
    return letters || raw.charAt(0).toUpperCase() || 'A';
  }

  function faviconDataUri(initials, bg, fg, serif) {
    var size = initials.length > 1 ? 13 : 18;
    var font = "Instrument Sans, system-ui, sans-serif";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" rx="7" fill="' +
      bg +
      '"/>' +
      '<text x="16" y="21" text-anchor="middle" font-family="' +
      font +
      '" font-size="' +
      size +
      '" font-weight="600" fill="' +
      fg +
      '">' +
      initials.replace(/</g, '') +
      '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function applyBrandFavicon(boot) {
    boot = boot || window.__valtoraPreviewBoot;
    if (!boot) return;
    var tokens = schemeTokens(boot.scheme);
    var serif = false;
    var href = faviconDataUri(
      brandInitials(boot.name),
      tokens.primary,
      tokens.onDark,
      serif
    );
    var head = document.head || d;
    if (!head) return;
    head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.setAttribute('data-brand-favicon', '');
    link.href = href;
    head.appendChild(link);
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta && tokens.primary) themeMeta.setAttribute('content', tokens.primary);
  }

  window.__valtoraApplyPreviewBrandText = applyBrandText;
  window.__valtoraApplyPreviewBusinessName = applyBusinessName;
  window.__valtoraInjectPreviewScheme = injectSchemeVars;
  window.__valtoraApplyBrandFavicon = applyBrandFavicon;

  // Inject immediately so first paint on cart / thank-you matches theme settings.
  injectSchemeVars(window.__valtoraPreviewBoot);
  applyFontAndTheme();
  applyBrandFavicon(window.__valtoraPreviewBoot);
  applyWarrantyYears();

  var headObs = new MutationObserver(function () {
    applyFontAndTheme();
    if (document.getElementById('PreviewFontLink')) headObs.disconnect();
  });
  headObs.observe(d, { childList: true, subtree: true });
  setTimeout(function () {
    headObs.disconnect();
  }, 4000);

  var bodyObs = new MutationObserver(function () {
    if (applyBrandText()) bodyObs.disconnect();
  });
  bodyObs.observe(d, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyBrandText();
      applyWarrantyYears();
      injectSchemeVars(window.__valtoraPreviewBoot);
      bodyObs.disconnect();
    });
  } else {
    applyBrandText();
    applyWarrantyYears();
    bodyObs.disconnect();
  }
})();
