/**
 * Valtora theme behaviours - size reserve, FAQ, motion, market sizing.
 */
(function () {
  'use strict';

  var SIZE_MAPS = {
    ae: [
      { id: 'single', label: 'Single', dims: '90-100 × 200 cm', firmness: 'Medium' },
      { id: 'queen', label: 'Queen', dims: '160 × 200 cm', firmness: 'Medium' },
      { id: 'king', label: 'King', dims: '180 × 200 cm', firmness: 'Medium' },
      { id: 'super-king', label: 'Super King', dims: '200 × 200 cm', firmness: 'Medium' },
    ],
    gb: [
      { id: 'single', label: 'Single', dims: '90 × 190 cm', firmness: 'Medium' },
      { id: 'double', label: 'Double', dims: '135 × 190 cm', firmness: 'Medium' },
      { id: 'king', label: 'King', dims: '150 × 200 cm', firmness: 'Medium' },
      { id: 'super-king', label: 'Super King', dims: '180 × 200 cm', firmness: 'Medium' },
    ],
  };

  function detectMarket() {
    // Preview: honour the market the shopper last chose so cart/checkout
    // pages (hardcoded data-market) do not wipe the other market's basket.
    try {
      var previewPort = location.port === '5173' || location.port === '5190';
      var saved = localStorage.getItem('valtoraPreviewMarket');
      if (previewPort && (saved === 'ae' || saved === 'gb')) return saved;
      var basketRaw =
        sessionStorage.getItem('valtora_order_lines') ||
        localStorage.getItem('valtora_order_lines');
      if (previewPort && basketRaw) {
        var basket = JSON.parse(basketRaw);
        var first = basket && basket.lines && basket.lines[0];
        if (first && (first.market === 'ae' || first.market === 'gb')) return first.market;
      }
    } catch (e) {}

    var forced = document.documentElement.getAttribute('data-market');
    if (forced === 'ae' || forced === 'gb') return forced;

    var theme = window.ValtoraTheme || {};
    var localization = window.Shopify && window.Shopify.country;
    if (localization) {
      var c = String(localization).toUpperCase();
      if (c === 'GB' || c === 'UK') return 'gb';
      if (c === 'AE') return 'ae';
    }

    // Shopify Markets: localization.country.iso_code via liquid-injected meta
    var meta = document.querySelector('meta[name="valtora-market"]');
    if (meta && (meta.content === 'ae' || meta.content === 'gb')) return meta.content;

    return theme.defaultMarket || 'ae';
  }

  function vTrack(name, params) {
    params = params || {};
    var body = document.body;
    if (!params.market) {
      params.market =
        (body && body.getAttribute('data-market')) ||
        document.documentElement.getAttribute('data-market') ||
        detectMarket();
    }
    if (!params.price_set) {
      params.price_set =
        (body && body.getAttribute('data-price-set')) ||
        (document.querySelector('[data-size-reserve]') &&
          document.querySelector('[data-size-reserve]').getAttribute('data-price-set')) ||
        'control';
    }
    if (!params.payment_mode) {
      params.payment_mode =
        (body && body.getAttribute('data-payment-mode')) ||
        (document.querySelector('[data-size-reserve]') &&
          document.querySelector('[data-size-reserve]').getAttribute('data-payment-mode')) ||
        'full';
    }
    try {
      if (typeof gtag === 'function') gtag('event', name, params);
      if (typeof fbq === 'function') fbq('trackCustom', name, params);
      if (typeof ttq !== 'undefined' && ttq.track) ttq.track(name, params);
    } catch (err) {}
    if (window.ValtoraTheme && window.ValtoraTheme.debugTrack) {
      console.info('[vTrack]', name, params);
    }
  }
  window.vTrack = vTrack;

  function parsePriceAmount(priceText) {
    if (!priceText) return null;
    var cleaned = String(priceText).replace(/[^\d.,]/g, '').replace(/,/g, '');
    var n = parseFloat(cleaned);
    return isFinite(n) && n > 0 ? n : null;
  }

  function formatMoneyLike(amount, sample) {
    var rounded = Math.round(amount);
    var sampleStr = String(sample || '');
    if (/£/.test(sampleStr) || /GBP/i.test(sampleStr)) {
      return '£' + rounded.toLocaleString('en-GB');
    }
    if (/AED/i.test(sampleStr)) {
      return 'AED ' + rounded.toLocaleString('en-AE');
    }
    return String(rounded);
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

  /* Trigger line: well into the viewport, above the sticky bar */
  function revealTriggerY() {
    return window.innerHeight - stickyBottomInset() - Math.round(window.innerHeight * 0.12);
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
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', Math.min(i * 110, 660) + 'ms');
      }
      revealChild(el);
    });
    return true;
  }

  function directMatches(root, selector) {
    return Array.prototype.filter.call(root.children || [], function (el) {
      return el.matches && el.matches(selector);
    });
  }

  function tagChild(el, delayMs) {
    if (!el || el.hasAttribute('data-reveal-grouped')) return;
    if (el.closest && el.closest('.hero')) return;
    el.setAttribute('data-reveal-child', '');
    if (delayMs != null && !el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', delayMs + 'ms');
    }
  }

  function initReveal() {
    document.documentElement.classList.add('js-ready');

    document.querySelectorAll('main .section, main .founder-note').forEach(function (sec) {
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
      ['.layer-stack', 'li']
    ];
    staggerRoots.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (root) {
        var items = directMatches(root, pair[1]).filter(function (el) {
          return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true';
        });
        if (!items.length) return;
        root.setAttribute('data-reveal-group', '');
        items.forEach(function (el, i) {
          el.setAttribute('data-reveal-child', '');
          el.setAttribute('data-reveal-grouped', '');
          el.style.setProperty('--reveal-delay', Math.min(i * 140, 700) + 'ms');
        });
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
      if (!items.length) return;
      grid.setAttribute('data-reveal-group', '');
      items.forEach(function (el, i) {
        el.setAttribute('data-reveal-child', '');
        el.setAttribute('data-reveal-grouped', '');
        el.style.setProperty('--reveal-delay', Math.min(i * 140, 700) + 'ms');
      });
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
      if (!items.length) return;
      inner.setAttribute('data-reveal-group', '');
      items.forEach(function (el, i) {
        el.setAttribute('data-reveal-child', '');
        el.setAttribute('data-reveal-grouped', '');
        el.style.setProperty('--reveal-delay', Math.min(i * 120, 720) + 'ms');
      });
    });

    /* All section headings + intro copy (hero keeps its own entrance) */
    document.querySelectorAll('main h1, main h2').forEach(function (el, i) {
      tagChild(el, Math.min(i * 50, 250));
    });
    document.querySelectorAll('main .section__eyebrow, main .section__lede, main .gold-rule').forEach(function (el, i) {
      if (el.closest('.benefit, .award, .offer__item, .ugc__card, .media-feature__card, .faq__item, .press__logo')) return;
      tagChild(el, Math.min(i * 40, 200));
    });

    var soloSelectors = [
      '.specs__media',
      '.media-feature__split-media',
      '.big-idea__copy',
      '.big-idea__media',
      '.offer__cta'
    ];
    soloSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        tagChild(el, Math.min(i * 80, 320));
      });
    });

    var groups = document.querySelectorAll('[data-reveal-group]');
    var solos = document.querySelectorAll('[data-reveal-child]:not([data-reveal-grouped])');

    function showAll() {
      groups.forEach(function (g) { revealGroup(g); });
      solos.forEach(function (n) { revealChild(n); });
      document.querySelectorAll('[data-reveal]').forEach(function (n) {
        n.classList.add('is-visible');
      });
    }

    if (!motionAllowed() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    document.querySelectorAll('[data-reveal]').forEach(function (n) {
      n.classList.add('is-visible');
    });

    var bottomPad = Math.max(stickyBottomInset(), Math.round(window.innerHeight * 0.14));
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
        threshold: [0, 0.08, 0.18, 0.28],
        rootMargin: '0px 0px -' + bottomPad + 'px 0px'
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

    var sticky = document.querySelector('[data-sticky-reserve]');
    if (sticky && 'MutationObserver' in window) {
      var mo = new MutationObserver(sweepVisible);
      mo.observe(sticky, { attributes: true, attributeFilter: ['hidden', 'class'] });
    }
  }

  function initScrollProgress() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 899px)').matches) return;
    /* Light heroes are stacked (Apple-style) - parallax only on dark lifestyle overlays */
    var media = document.querySelector('.hero--dark .hero__media');
    if (!media) return;
    media.setAttribute('data-parallax', '');
    var img = media.querySelector('img, video');
    if (!img) return;

    function update() {
      var rect = media.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      if (rect.bottom < 0 || rect.top > vh) return;
      var progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      img.style.transform = 'translate3d(0,' + (progress * 36).toFixed(2) + 'px,0) scale(1.06)';
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


  var OrderStore = {
    KEY: 'valtora_order_lines',
    LAST_KEY: 'valtora_last_order',
    read: function () {
      try {
        var sessRaw = sessionStorage.getItem(this.KEY);
        var localRaw = null;
        try {
          localRaw = localStorage.getItem(this.KEY);
        } catch (e) {}
        var sessData = sessRaw ? JSON.parse(sessRaw) : null;
        var localData = localRaw ? JSON.parse(localRaw) : null;
        var sessLines = sessData && Array.isArray(sessData.lines) ? sessData.lines : [];
        var localLines = localData && Array.isArray(localData.lines) ? localData.lines : [];
        // Prefer the fuller basket so a stale session cannot hide lines
        // still held in localStorage (common after multi-page preview hops).
        var data =
          localLines.length > sessLines.length
            ? localData
            : sessLines.length
              ? sessData
              : localData || sessData;
        if (!data || !Array.isArray(data.lines)) return { lines: [] };
        var payload = JSON.stringify(data);
        sessionStorage.setItem(this.KEY, payload);
        try {
          localStorage.setItem(this.KEY, payload);
        } catch (e2) {}
        return data;
      } catch (e) {
        return { lines: [] };
      }
    },
    write: function (data) {
      var payload = JSON.stringify(data);
      sessionStorage.setItem(this.KEY, payload);
      try {
        localStorage.setItem(this.KEY, payload);
      } catch (e) {}
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
        var sessRaw = sessionStorage.getItem(this.LAST_KEY);
        var localRaw = null;
        try {
          localRaw = localStorage.getItem(this.LAST_KEY);
        } catch (e) {}
        var sessData = sessRaw ? JSON.parse(sessRaw) : null;
        var localData = localRaw ? JSON.parse(localRaw) : null;
        var sessLines = sessData && Array.isArray(sessData.lines) ? sessData.lines : [];
        var localLines = localData && Array.isArray(localData.lines) ? localData.lines : [];
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
    orderValue: function (lines) {
      lines = lines || this.lines();
      return lines.reduce(function (sum, line) {
        var unit = parsePriceAmount(line.unitPrice) || 0;
        return sum + unit * (parseInt(line.quantity, 10) || 0);
      }, 0);
    },
    addLine: function (line) {
      var data = this.read();
      var existing = data.lines.find(function (l) {
        return l.itemType === line.itemType && l.sizeId === line.sizeId && l.firmness === line.firmness;
      });
      if (existing) {
        existing.quantity =
          (parseInt(existing.quantity, 10) || 0) + (parseInt(line.quantity, 10) || 1);
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
        cur.variantId = line.variantId || cur.variantId;
        cur.firmness = line.firmness || cur.firmness;
        cur.market = line.market || cur.market;
        cur.leadWindow = line.leadWindow || cur.leadWindow;
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
      data.lines = data.lines.filter(function (l) {
        return l.key !== key;
      });
      return this.write(data);
    },
    clear: function () {
      return this.write({ lines: [] });
    },
  };

  function syncOrderChrome() {
    var lines = OrderStore.lines();
    var lineCount = lines.length;
    var show = lineCount > 1;
    document.querySelectorAll('[data-order-link]').forEach(function (el) {
      el.hidden = !show;
    });
    document.querySelectorAll('[data-order-count]').forEach(function (el) {
      el.textContent = String(lineCount);
      el.hidden = !show;
    });
  }

  function multiplyPriceText(priceText, qty) {
    var amount = parsePriceAmount(priceText);
    if (!amount) return priceText || '';
    return formatMoneyLike(amount * qty, priceText);
  }

  function reviewOrderUrl() {
    var tagged = document.querySelector('[data-checkout-path]');
    if (tagged && tagged.getAttribute('data-checkout-path')) {
      return tagged.getAttribute('data-checkout-path');
    }
    var link = document.querySelector('[data-reserve-continue][href], [data-float-continue][href]');
    if (link && link.getAttribute('href')) return link.getAttribute('href');
    if (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.review) {
      return window.ValtoraTheme.routes.review;
    }
    if (/checkout\.html$/.test(location.pathname)) return location.pathname;
    if (/\/pages\//.test(location.pathname)) {
      return location.pathname.replace(/[^/]+$/, 'checkout.html');
    }
    if (/index\.html$/.test(location.pathname) || location.port === '5173' || location.port === '5190') {
      return './pages/checkout.html';
    }
    return '/pages/checkout';
  }

  function initSizeReserve(root) {
    if (!root || root.getAttribute('data-reserve-ready') === '1') return;
    root.setAttribute('data-reserve-ready', '1');

    var market = root.getAttribute('data-market') || detectMarket();
    var priceSet = root.getAttribute('data-price-set') || 'control';
    var paymentMode = root.getAttribute('data-payment-mode') || 'full';
    var leadtimePlacement = root.getAttribute('data-leadtime-placement') || 'staged';
    var financeName = root.getAttribute('data-finance-name') || (market === 'gb' ? 'Klarna' : 'Tabby or Tamara');
    var list = root.querySelector('[data-size-list]');
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
    var comfortTopPrice = root.getAttribute('data-comfort-top-price') || '';
    var comfortTopVariant = root.getAttribute('data-comfort-top-variant') || '';
    var defaultFirmness = root.getAttribute('data-default-firmness') || 'Medium';
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

    function largeOrderThreshold(samplePrice) {
      var p = String(samplePrice || unitPriceText || '');
      if (/£|GBP/i.test(p) || market === 'gb') return largeThresholdGb;
      return largeThresholdAe;
    }

    function isLargeOrderValue(value, samplePrice) {
      return value >= largeOrderThreshold(samplePrice);
    }

    function lineQtyForSize(sizeId) {
      var line = OrderStore.lines().find(function (l) {
        return (l.itemType === 'mattress' || !l.itemType) && l.sizeId === sizeId;
      });
      return line ? parseInt(line.quantity, 10) || 0 : 0;
    }

    function syncSizeQtyUi() {
      if (!list) return;
      list.querySelectorAll('.size-option').forEach(function (btn) {
        var wrap = btn.querySelector('[data-size-qty]');
        var valEl = btn.querySelector('[data-qty-val]');
        if (!wrap) return;
        var available = btn.getAttribute('data-available') !== 'false';
        var sizeId = btn.getAttribute('data-size-id');
        var q = lineQtyForSize(sizeId);
        if (valEl) valEl.textContent = String(q);
        wrap.hidden = !available;
        var dec = btn.querySelector('[data-qty-dec]');
        if (dec) dec.disabled = q < 1;
      });
    }

    function updateContinueState() {
      if (!continueBtn) return;
      var hasLines = displayLines().length > 0;
      continueBtn.disabled = !hasLines;
      continueBtn.setAttribute('aria-disabled', hasLines ? 'false' : 'true');
    }

    function upsertActiveMattress(qty, opts) {
      opts = opts || {};
      var size = currentSize();
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
        variantId: size.variantId || '',
        quantity: qty,
        market: market,
        leadWindow: leadWindow,
      });
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
      var sample = unitPriceText || (lines[0] && lines[0].unitPrice) || '';
      var totalVal = OrderStore.orderValue(lines);
      var totalText = sample || totalVal ? formatMoneyLike(totalVal, sample || (market === 'gb' ? '£1' : 'AED 1')) : '';
      updateBnpl(totalText, 1);
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
        variantId: size.variantId || '',
        quantity: getQty(),
        market: market,
        leadWindow: leadWindow,
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

    function updateFloatBasket(lines, totalText, units) {
      var countEl = document.querySelector('[data-float-count]');
      var totalEl = document.querySelector('[data-float-total]');
      if (!countEl && !totalEl) return;
      var n = units != null ? units : mattressUnits(lines || []);
      var label = n === 1 ? '1 MATTRESS' : n + ' MATTRESSES';
      if (countEl) countEl.textContent = label;
      if (totalEl) totalEl.textContent = totalText || '-';
    }

    function renderOrderPanel() {
      var lines = displayLines();
      var sample = unitPriceText || (lines[0] && lines[0].unitPrice) || '';
      var totalVal = OrderStore.orderValue(lines);
      var units = mattressUnits(lines);
      var totalText = sample || totalVal ? formatMoneyLike(totalVal, sample || (market === 'gb' ? '£1' : 'AED 1')) : '-';

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
              var unit = parsePriceAmount(line.unitPrice) || 0;
              var qty = parseInt(line.quantity, 10) || 0;
              var total = formatMoneyLike(unit * qty, line.unitPrice);
              var title =
                line.itemType === 'top'
                  ? 'Spare comfort top · ' + (line.label || '')
                  : (line.label || '') + ' · ' + qty;
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

      if (stageBSummary) {
        var mattressLines = lines.filter(function (l) { return l.itemType !== 'top'; });
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

      var large = isLargeOrderValue(totalVal, sample);
      if (largeTerms) largeTerms.hidden = !large;
      if (large && largeCopy) {
        var thrLabel = formatMoneyLike(
          largeOrderThreshold(sample),
          sample || (market === 'gb' ? '£1' : 'AED 1')
        );
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

    if (document.body && !document.body.getAttribute('data-price-set')) {
      document.body.setAttribute('data-price-set', priceSet);
    }

    if (stageB) {
      stageB.classList.add('is-collapsed');
    }

    var sizes = SIZE_MAPS[market] || SIZE_MAPS.ae;
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
      function currencyOk(price) {
        var p = String(price || '');
        if (mkt === 'gb') return /£|GBP/i.test(p) && !/AED/i.test(p);
        if (mkt === 'ae') return /AED/i.test(p) && !/£/.test(p);
        return true;
      }
      var rows = allRows.filter(function (row) {
        if (row.price_set && String(row.price_set).toLowerCase() !== String(priceSet).toLowerCase()) {
          return false;
        }
        if (row.market && row.market !== mkt) return false;
        if (row.price && !currencyOk(row.price)) return false;
        if (!row.market && !row.price) return false;
        return true;
      });
      if (!rows.length) return SIZE_MAPS[mkt] || SIZE_MAPS.ae;
      return rows;
    }
    sizes = filterSizesForMarket(market);

    function eventParams(extra) {
      var size = currentSize();
      var base = {
        market: market,
        price_set: priceSet,
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
    }

    function collapseStageB(silent) {
      stageExpanded = false;
      if (stageB) stageB.classList.add('is-collapsed');
      if (continueBtn) continueBtn.setAttribute('aria-expanded', 'false');
      var stageA = root.querySelector('[data-reserve-stage-a]');
      if (stageA) stageA.hidden = false;
    }

    function expandStageB() {
      if (!stageB) return;
      stageB.classList.remove('is-collapsed');
      stageExpanded = true;
      if (continueBtn) continueBtn.setAttribute('aria-expanded', 'true');
      var stageA = root.querySelector('[data-reserve-stage-a]');
      if (stageA) stageA.hidden = true;
      try {
        stageB.focus({ preventScroll: true });
      } catch (e) {
        try {
          stageB.focus();
        } catch (e2) {}
      }
      stageB.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function updateBnpl(priceText, qty) {
      if (!bnplEl) return;
      qty = qty || getQty();
      var amount = parsePriceAmount(priceText);
      var monthly = amount ? (amount * qty) / 12 : null;
      if (monthly) {
        bnplEl.textContent =
          'or from ' + formatMoneyLike(monthly, priceText) + '/month with ' + financeName;
      }
    }

    function syncSticky(btn) {
      /* Float basket totals are owned by renderOrderPanel / updateFloatBasket */
      if (!btn) updateFloatBasket([], '-', 0);
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
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
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
      syncSticky(isRequest ? null : btn);
      if (isRequest) {
        if (priceEl) priceEl.textContent = priceText;
      } else if (available) {
        var existingQty = lineQtyForSize(btn.getAttribute('data-size-id'));
        if (qtyInput) qtyInput.value = String(existingQty > 0 ? existingQty : 1);
        syncSizeQtyUi();
        refreshTotals();
        if (!opts.silent) {
          vTrack('select_size', eventParams({ quantity: existingQty, price: parsePriceAmount(priceText) || undefined }));
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
          'Please notify me when this size is available.\n\nSize: ' +
          sizeLabel +
          ' - ' +
          sizeDims +
          '\nSize ID: ' +
          sizeId +
          '\nMarket: ' +
          String(market).toUpperCase() +
          '\nPrice set: ' +
          priceSet;
      }
    }

    function preferredIndex() {
      var preferredIds = market === 'gb' ? ['king', 'double', 'queen'] : ['queen', 'king'];
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
      list.innerHTML = '';
      var defaultIdx = preferredIndex();
      sizes.forEach(function (s, i) {
        var available = s.available !== false;
        var popular = !!s.popular;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className =
          'size-option' +
          (available ? '' : ' size-option--oos') +
          (popular ? ' size-option--popular' : '');
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('data-size-id', s.id);
        btn.setAttribute('data-size-label', s.label);
        btn.setAttribute('data-size-dims', s.dims);
        btn.setAttribute('data-size-price', s.price || '');
        btn.setAttribute('data-size-firmness', s.firmness || 'Medium');
        if (s.variant_id) btn.setAttribute('data-size-variant', String(s.variant_id));
        btn.setAttribute('data-available', available ? 'true' : 'false');
        btn.innerHTML =
          '<span class="size-option__marker" aria-hidden="true"></span>' +
          '<span class="size-option__main">' +
          '<span class="size-option__label">' +
          s.label +
          (popular
            ? ' <span class="size-option__popular">Most popular</span>'
            : '') +
          '</span>' +
          '<span class="size-option__dims">' +
          s.dims +
          (available ? '' : ' · Not yet available') +
          '</span>' +
          '</span>' +
          (available
            ? '<span class="size-option__qty" data-size-qty>' +
              '<button type="button" class="size-option__qty-btn" data-qty-dec aria-label="Decrease quantity">−</button>' +
              '<span class="size-option__qty-val" data-qty-val>0</span>' +
              '<button type="button" class="size-option__qty-btn" data-qty-inc aria-label="Increase quantity">+</button>' +
              '</span>'
            : '<span class="size-option__qty size-option__qty--spacer" aria-hidden="true"></span>') +
          (available && s.price
            ? '<span class="size-option__price">' + s.price + '</span>'
            : available
              ? '<span class="size-option__price" aria-hidden="true"></span>'
              : '<span class="size-option__price" aria-hidden="true"></span>');
        list.appendChild(btn);
        if (i === defaultIdx) applySelection(btn, { silent: true });
      });
    }

    if (list && !list.children.length) {
      rebuildSizeButtons();
    } else if (list) {
      var active = list.querySelector('.size-option.is-active') || list.querySelector('.size-option');
      if (active) applySelection(active, { silent: true });
    }

    root._valtoraOnMarketChange = function () {
      market = root.getAttribute('data-market') || detectMarket();
      priceSet = root.getAttribute('data-price-set') || priceSet || 'control';
      paymentMode = root.getAttribute('data-payment-mode') || paymentMode || 'full';
      leadtimePlacement = root.getAttribute('data-leadtime-placement') || leadtimePlacement || 'staged';
      financeName =
        root.getAttribute('data-finance-name') || (market === 'gb' ? 'Klarna' : 'Tabby or Tamara');
      sizes = filterSizesForMarket(market);
      rebuildSizeButtons();
      if (typeof renderOrderPanel === 'function') renderOrderPanel();
      if (typeof refreshTotals === 'function') refreshTotals();
    };

    function currentSize() {
      var active =
        (list && list.querySelector('.size-option.is-active')) ||
        (requestTrigger && requestTrigger.classList.contains('is-active') ? requestTrigger : null);
      var fallback = sizes[0] || { id: '', label: '', dims: '', price: '', available: true };
      return {
        id: active ? active.getAttribute('data-size-id') : fallback.id,
        label: active ? active.getAttribute('data-size-label') : fallback.label,
        dims: active ? active.getAttribute('data-size-dims') : fallback.dims,
        price: active ? active.getAttribute('data-size-price') : fallback.price || '',
        firmness: defaultFirmness,
        variantId: active ? active.getAttribute('data-size-variant') || '' : '',
        available: active
          ? active.getAttribute('data-available') !== 'false' &&
            active.getAttribute('data-request-size') !== 'true'
          : fallback.available !== false,
      };
    }

    if (list) {
      list.addEventListener('click', function (e) {
        var dec = e.target.closest('[data-qty-dec]');
        var inc = e.target.closest('[data-qty-inc]');
        if (dec || inc) {
          e.preventDefault();
          e.stopPropagation();
          var row = e.target.closest('.size-option');
          if (!row) return;
          var sizeId = row.getAttribute('data-size-id');
          var q = lineQtyForSize(sizeId);
          if (dec) q -= 1;
          if (inc) q = Math.min(999, q + 1);
          if (q < 1) {
            var existing = OrderStore.lines().find(function (l) {
              return (l.itemType === 'mattress' || !l.itemType) && l.sizeId === sizeId;
            });
            if (existing && existing.key) OrderStore.removeLine(existing.key);
            if (qtyInput) qtyInput.value = '1';
            if (!row.classList.contains('is-active')) {
              // Keep focus on this size without re-adding it
              list.querySelectorAll('.size-option').forEach(function (b) {
                b.classList.toggle('is-active', b === row);
                b.setAttribute('aria-selected', b === row ? 'true' : 'false');
              });
            }
            syncSizeQtyUi();
            refreshTotals();
            updateContinueState();
            return;
          }
          if (!row.classList.contains('is-active')) applySelection(row, { silent: true });
          upsertActiveMattress(q);
          updateContinueState();
          return;
        }
        var btn = e.target.closest('.size-option');
        if (!btn) return;
        applySelection(btn);
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
          return;
        }
        vTrack('reserve_intent', eventParams());
        var href = continueBtn.getAttribute('href') || reviewOrderUrl();
        if (continueBtn.tagName !== 'A' || !continueBtn.getAttribute('href')) {
          e.preventDefault();
          window.location.href = href;
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        collapseStageB(true);
        var stageA = root.querySelector('[data-reserve-stage-a]');
        if (stageA) stageA.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    observeDwell(priceEl, 1000, 'valtora_view_price', function () {
      vTrack('view_price', eventParams());
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
        OrderStore.removeLine(key);
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
      renderOrderPanel();
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
          'Price set': priceSet,
          'Payment mode': paymentMode,
          'Lead time placement': leadtimePlacement,
          'Item type': line.itemType === 'top' ? 'Spare comfort top' : 'Mattress',
        },
      };
      if (line.itemType === 'top') {
        payload.properties.Note = 'Spare comfort top - not a replacement for the included top';
      }
      if (large) {
        payload.properties['Order terms'] =
          'Refundable until production commit (typically within 5 working days); non-refundable after';
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
          statusEl.textContent = 'Connect a checkout product in the section settings, then try again.';
        }
        return Promise.reject(new Error('No variant'));
      }
      var units = OrderStore.units(lines);
      var orderValue = OrderStore.orderValue(lines);
      var sample = (lines[0] && lines[0].unitPrice) || unitPriceText;
      var large = isLargeOrderValue(orderValue, sample);
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
        order_value: orderValue,
        line_count: lines.length,
        units: units,
      });
      if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
      if (typeof ttq !== 'undefined' && ttq.track) ttq.track('InitiateCheckout');

      var sync = window.ValtoraUTM ? window.ValtoraUTM.syncCartAttributes() : Promise.resolve();
      return sync
        .then(function () {
          return fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } });
        })
        .then(function () {
          if (!large) return null;
          return fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              attributes: {
                large_order: 'true',
                large_order_terms_acknowledged: 'true',
                large_order_value: String(Math.round(orderValue)),
                production_commit_window: 'Within 5 working days of order',
                admin_flag: 'Fraud check before factory order',
              },
            }),
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
          OrderStore.clear();
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
    syncOrderChrome();
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

    function paint() {
      var lines = OrderStore.lines();
      var has = lines.length > 0;
      if (emptyEl) emptyEl.hidden = has;
      if (summary) summary.hidden = !has;
      if (!linesEl) return;
      if (!has) {
        linesEl.innerHTML = '';
        return;
      }
      linesEl.innerHTML = lines
        .map(function (line) {
          var unit = parsePriceAmount(line.unitPrice) || 0;
          var qty = parseInt(line.quantity, 10) || 0;
          var total = formatMoneyLike(unit * qty, line.unitPrice);
          var title =
            line.itemType === 'top'
              ? 'Spare comfort top · ' + (line.label || '')
              : (line.label || '') + ' · ' + qty;
          return (
            '<li class="cart-line order-basket__line" data-cart-line data-order-line-key="' +
            (line.key || '') +
            '">' +
            '<span class="order-basket__line-l">' +
            title +
            (line.dims ? '<small>' + line.dims + '</small>' : '') +
            '</span>' +
            '<span class="order-basket__line-r">' +
            total +
            (line.key
              ? '<button type="button" class="order-basket__remove" data-order-remove="' +
                line.key +
                '">Remove</button>'
              : '') +
            '</span>' +
            '</li>'
          );
        })
        .join('');
      if (subtotalEl) {
        var sample = (lines[0] && lines[0].unitPrice) || '';
        subtotalEl.textContent = formatMoneyLike(OrderStore.orderValue(lines), sample);
      }
      if (countEl) {
        var units = OrderStore.units(lines);
        countEl.textContent = units === 1 ? '1 unit' : units + ' units';
      }
    }

    paint();
    document.addEventListener('valtora:order-changed', paint);

    if (linesEl) {
      linesEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-order-remove]');
        if (!btn) return;
        OrderStore.removeLine(btn.getAttribute('data-order-remove'));
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
        vTrack('reserve_intent', {
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
          vTrack('reserve_intent', {
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
      (market === 'gb' ? 'Klarna' : 'Tabby or Tamara');
    var leadWindow = page.getAttribute('data-lead-window') || '8 to 10 weeks';
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

    function thresholdFor(sample) {
      if (/£|GBP/i.test(String(sample || '')) || market === 'gb') return thresholdGb;
      return thresholdAe;
    }

    function paint() {
      var lines = OrderStore.lines();
      var has = lines.length > 0;
      if (emptyEl) emptyEl.hidden = has;
      if (flowEl) flowEl.hidden = !has;
      if (!has) {
        if (linesEl) linesEl.innerHTML = '';
        return;
      }
      if (lines[0] && lines[0].market) {
        market = lines[0].market;
        document.documentElement.setAttribute('data-market', market);
        if (document.body) document.body.setAttribute('data-market', market);
        financeName = market === 'gb' ? 'Klarna' : 'Tabby or Tamara';
      }
      var sample = (lines[0] && lines[0].unitPrice) || '';
      var totalVal = OrderStore.orderValue(lines);
      var totalText = formatMoneyLike(totalVal, sample || (market === 'gb' ? '£1' : 'AED 1'));
      var units = OrderStore.units(lines);
      if (linesEl) {
        linesEl.innerHTML = lines
          .map(function (line) {
            var unit = parsePriceAmount(line.unitPrice) || 0;
            var qty = parseInt(line.quantity, 10) || 0;
            var total = formatMoneyLike(unit * qty, line.unitPrice);
            var title =
              line.itemType === 'top'
                ? 'Spare comfort top · ' + (line.label || '')
                : (line.label || '') + ' · ' + qty;
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
          .filter(function (l) { return l.itemType !== 'top'; })
          .map(function (l) {
            return (l.label || '') + ' · ' + (parseInt(l.quantity, 10) || 0);
          })
          .join(', ');
      }
      if (payLabel) payLabel.textContent = 'Pay ' + totalText;
      if (bnplEl && totalVal) {
        bnplEl.textContent =
          'or from ' + formatMoneyLike(totalVal / 12, sample) + '/month with ' + financeName;
      }
      if (leadLabel && lines[0] && lines[0].leadWindow) {
        leadLabel.textContent = lines[0].leadWindow;
      }
      var large = totalVal >= thresholdFor(sample);
      if (largeTerms) largeTerms.hidden = !large;
      if (large && largeCopy) {
        var thrLabel = formatMoneyLike(thresholdFor(sample), sample || (market === 'gb' ? '£1' : 'AED 1'));
        largeCopy.textContent =
          'Orders of ' +
          thrLabel +
          ' or more are refundable until production is committed - typically within 5 working days of order - and non-refundable after that. Under that amount, you can still cancel any time before dispatch for a full refund.';
      }
    }

    paint();
    document.addEventListener('valtora:order-changed', paint);
    vTrack('view_leadtime', {
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
          order_value: totalVal,
          line_count: lines.length,
          units: OrderStore.units(lines),
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
                market: line.market,
                leadWindow: line.leadWindow,
              };
            }),
            total: formatMoneyLike(totalVal, sample),
            units: OrderStore.units(lines),
            line_count: lines.length,
          };
          OrderStore.saveLastOrder(snapshot);
          OrderStore.clear();
          window.location.href = confirmedPath;
          return;
        }
        var shopifyCheckout =
          (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.checkout) ||
          '/checkout';
        var defaultVariant = (lines[0] && lines[0].variantId) || '';
        var missing = lines.some(function (line) {
          return !(line.variantId || defaultVariant);
        });
        if (missing) {
          if (statusEl) {
            statusEl.textContent = 'Connect a checkout product in the theme, then try again.';
          }
          return;
        }
        var sync = window.ValtoraUTM ? window.ValtoraUTM.syncCartAttributes() : Promise.resolve();
        sync
          .then(function () {
            return fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } });
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
                      'Item type': line.itemType === 'top' ? 'Spare comfort top' : 'Mattress',
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
            OrderStore.clear();
            window.location.href = shopifyCheckout;
          })
          .catch(function () {
            if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
          });
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
        var lead =
          (lines[0] && lines[0].leadWindow) ||
          page.getAttribute('data-lead-window') ||
          '8 to 10 weeks';
        leadEl.textContent = lead;
      }

      if (linesEl) {
        if (!lines.length) {
          linesEl.innerHTML = '';
        } else {
          linesEl.innerHTML = lines
            .map(function (line) {
              var qty = parseInt(line.quantity, 10) || 0;
              var unit = parsePriceAmount(line.unitPrice) || 0;
              var lineTotal = formatMoneyLike(unit * qty, line.unitPrice || (data && data.total) || '');
              var title =
                line.itemType === 'top'
                  ? 'Spare comfort top · ' + (line.label || '')
                  : (line.label || '') + ' · ' + qty;
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
        var units = data && data.units != null ? data.units : OrderStore.units(lines);
        countEl.textContent = units === 1 ? '1 mattress' : units + ' mattresses';
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
    if (!sessionFlag('valtora_purchase')) {
      setSessionFlag('valtora_purchase');
      var tracked = OrderStore.readLastOrder() || {};
      vTrack('purchase', {
        line_count: tracked.line_count || ((tracked.lines && tracked.lines.length) || 0),
        units: tracked.units || 0,
        order_value: tracked.total || '',
      });
      if (typeof fbq === 'function') fbq('track', 'Purchase');
      if (typeof ttq !== 'undefined' && ttq.track) ttq.track('CompletePayment');
    }
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

  function initAllReserves() {
    document.querySelectorAll('[data-size-reserve]').forEach(initSizeReserve);
  }

  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      var open = panel.getAttribute('aria-hidden') === 'false';
      var nextOpen = !open;
      panel.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', nextOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', nextOpen);
    });
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
    var hero = document.getElementById('hero');
    var heroCta = document.querySelector('[data-hero-cta]') || (hero && hero.querySelector('.hero__cta .btn'));
    var reserve = document.getElementById('reserve');
    if (!bar || !reserve) return;

    var heroCtaPassed = !heroCta;
    var reserveVisible = false;

    function sectionOn(el) {
      return el && !el.hidden && el.getAttribute('aria-hidden') !== 'true';
    }

    function update() {
      if (!sectionOn(reserve)) {
        bar.hidden = true;
        document.body.classList.remove('has-sticky-reserve');
        return;
      }
      // Suppress until the in-hero primary CTA has left the viewport.
      var show = heroCtaPassed && !reserveVisible;
      bar.hidden = !show;
      document.body.classList.toggle('has-sticky-reserve', show);
    }

    function checkVisibility() {
      if (!heroCta || !sectionOn(hero)) {
        heroCtaPassed = true;
      } else {
        var ctaRect = heroCta.getBoundingClientRect();
        heroCtaPassed = ctaRect.bottom < 0;
      }

      if (!sectionOn(reserve)) {
        reserveVisible = false;
        update();
        return;
      }

      var rect = reserve.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      reserveVisible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      update();
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function () {
          checkVisibility();
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );
      if (hero) io.observe(hero);
      if (heroCta) io.observe(heroCta);
      io.observe(reserve);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    checkVisibility();

    bar.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="#reserve"]');
      if (link) {
        e.preventDefault();
        reserve.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      var cont = e.target.closest('[data-float-continue]');
      if (!cont) return;
      if (!OrderStore.lines().length) {
        e.preventDefault();
        return;
      }
      vTrack('reserve_intent', {
        line_count: OrderStore.lines().length,
        units: OrderStore.units(),
        order_value: OrderStore.orderValue(),
      });
      if (cont.tagName !== 'A' || !cont.getAttribute('href')) {
        e.preventDefault();
        window.location.href = reviewOrderUrl();
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
      vTrack('view_proposition', {});
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
      if (!sessionFlag('valtora_purchase')) {
        setSessionFlag('valtora_purchase');
        vTrack('purchase', {});
      }
    }
  }

  function initExitIntent() {
    var panel = document.querySelector('[data-exit-intent]');
    if (!panel) return;
    if (sessionFlag('valtora_exit_intent')) return;

    var thanks = panel.querySelector('[data-exit-thanks]');
    var open = false;

    function show() {
      if (open || sessionFlag('valtora_exit_intent')) return;
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
      try {
        sessionStorage.setItem('valtora_exit_reason', reason);
      } catch (e) {}
      vTrack('exit_intent', { reason: reason });
      if (window.ValtoraUTM && typeof window.ValtoraUTM.setAttribute === 'function') {
        window.ValtoraUTM.setAttribute('exit_intent_reason', reason);
      } else if (window.fetch) {
        fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: { exit_intent_reason: reason } }),
        }).catch(function () {});
      }
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

  function initPreviewBrandChrome() {
    // Apply homepage preview controls (brand, line, fonts, scheme) on every
    // preview page so checkout/cart wordmarks match configuration.
    var previewHost =
      location.port === '5173' ||
      location.port === '5190' ||
      /\/(preview|share)\//.test(location.pathname);
    if (!previewHost && !document.querySelector('[data-brand-text]')) return;

    var fonts = {
      modern:
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;500;600&family=Outfit:wght@400;500;600;700&display=swap',
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

    var name = 'Aligna';
    var line = 'Mattresses';
    var guidelines = 'v1';
    var fontSet = 'modern';
    var scheme = 'signature';
    try {
      name = localStorage.getItem('valtoraPreviewBrand') || name;
      var savedLine = localStorage.getItem('valtoraPreviewBrandLine');
      if (savedLine !== null) line = savedLine;
      guidelines = localStorage.getItem('valtoraPreviewBrandGuidelines') || guidelines;
      fontSet = localStorage.getItem('valtoraPreviewFontSet') || fontSet;
      scheme = localStorage.getItem('valtoraPreviewColorScheme') || scheme;
    } catch (e) {}

    if (window.ValtoraTheme && window.ValtoraTheme.brandName && !previewHost) {
      name = window.ValtoraTheme.brandName;
    } else if (window.ValtoraTheme && previewHost) {
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
    if (title && previewHost) {
      var page = document.body && document.body.getAttribute('data-page');
      if (page === 'checkout') title.textContent = 'Checkout · ' + name;
      else if (page === 'order-confirmed') title.textContent = 'Order confirmed · ' + name;
      else if (/ · /.test(title.textContent) || /Aligna|Sattva|Valtora/i.test(title.textContent)) {
        title.textContent = title.textContent.replace(/Aligna|Sattva|Valtora/gi, name);
      }
    }
  }

  function applyMarketOnlyVisibility(market) {
    market = market || document.documentElement.getAttribute('data-market') || detectMarket();
    document.querySelectorAll('[data-market-only]').forEach(function (el) {
      var only = el.getAttribute('data-market-only');
      var show = only === market;
      el.hidden = !show;
      if (show) el.removeAttribute('hidden');
    });
  }

  function boot() {
    initPreviewBrandChrome();
    var market = detectMarket();
    document.documentElement.setAttribute('data-market', market);
    if (document.body && !document.body.getAttribute('data-market')) {
      document.body.setAttribute('data-market', market);
    }
    applyMarketOnlyVisibility(market);
    initReveal();
    initTrustMarquee();
    initScrollProgress();
    initParallax();
    initInViewVideo();
    initMagneticButtons();
    initTiltCards();
    initFaq();
    initAllReserves();
    initMobileNav();
    initStickyReserve();
    initCartPage();
    initCheckoutPage();
    initOrderConfirmed();
    initReviews();
    initFunnelTracking();
    initExitIntent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
