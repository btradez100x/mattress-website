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
      { id: 'emperor', label: 'Emperor', dims: '200 × 200 cm', firmness: 'Medium' },
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
      if (/comfort-top|swap/.test(location.pathname)) {
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
    vTrack('purchase', payload);
    var last = OrderStore.readLastOrder && OrderStore.readLastOrder();
    var lastLines = (last && last.lines) || params.lines || [];
    lastLines.forEach(function (line) {
      if (line.itemType !== 'top') return;
      vTrack('top_purchase', {
        size: line.sizeId || line.label || '',
        firmness: line.firmness || '',
        entry_point: topEntryPoint(),
        owns_mattress: lastLines.some(function (l) { return l.itemType !== 'top'; }),
      });
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
    if ((market || detectMarket()) === 'gb') {
      return '£' + major.toLocaleString('en-GB');
    }
    return 'AED ' + major.toLocaleString('en-AE');
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
    return mkt === 'gb' ? 'Klarna' : 'Tabby or Tamara';
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
        return line.itemType !== 'top';
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
    var mattressLines = (lines || []).filter(function (line) {
      return line.itemType !== 'top';
    });
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
    if (el.closest && el.closest('.hero, .mfg-hero')) return;
    el.setAttribute('data-reveal-child', '');
    if (delayMs != null && !el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', Math.min(delayMs, 50) + 'ms');
    }
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
    if (window.Shopify && window.Shopify.designMode) {
      document.documentElement.classList.add('shopify-design-mode');
    }
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
      ['.blog-index__grid', '.blog-card']
    ];
    staggerRoots.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (root) {
        var items = directMatches(root, pair[1]).filter(function (el) {
          return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true';
        });
        if (!items.length) return;
        tagCascade(root, items, pair[0].indexOf('mfg-gallery') !== -1 ? 90 : 140);
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
      tagCascade(grid, items, 140);
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
      tagCascade(grid, items, 140);
    });

    /* Manufacturing hero copy entrance (CSS heroRise + reveal) */
    document.querySelectorAll('.mfg-hero__copy').forEach(function (copy) {
      var items = [];
      Array.prototype.forEach.call(copy.children, function (el) {
        items.push(el);
      });
      tagCascade(copy, items, 100);
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
      tagCascade(inner, items, 120);
    });

    /* All section headings + intro copy (hero keeps its own entrance) */
    document.querySelectorAll('main h1, main h2').forEach(function (el, i) {
      tagChild(el, Math.min(i * 50, 250));
    });
    document.querySelectorAll('main .section__eyebrow, main .section__lede, main .gold-rule').forEach(function (el, i) {
      if (el.closest('.benefit, .award, .offer__item, .ugc__card, .media-feature__card, .faq__item, .press__logo, .mfg-split__card, .blog-card, .mfg-gallery__item')) return;
      tagChild(el, Math.min(i * 40, 200));
    });

    var soloSelectors = [
      '.specs__media',
      '.media-feature__split-media',
      '.big-idea__copy',
      '.big-idea__media',
      '.offer__cta',
      '.article__hero',
      '.mfg-cta .btn'
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
    setTimeout(showAll, 900);

    var sticky = document.querySelector('[data-sticky-reserve]');
    if (sticky && 'MutationObserver' in window) {
      var mo = new MutationObserver(sweepVisible);
      mo.observe(sticky, { attributes: true, attributeFilter: ['hidden', 'class'] });
    }
  }

  function initSectionWipes() {
    /* Do not clip dark sections. clip-path: inset(0 100% 0 0) hid Offer and
       Swap on the storefront after Customizer save; the editor iframe often
       skipped the observer so they looked fine until publish. */
  }

  function applyPreviewTopsFlag() {
    var params;
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      return;
    }
    if (params.get('tops') !== '1') return;
    document.querySelectorAll('[data-comfort-top-cta]').forEach(function (el) {
      el.hidden = false;
    });
    document.querySelectorAll('[data-comfort-tops-enabled], [data-size-reserve]').forEach(function (el) {
      el.setAttribute('data-comfort-tops-enabled', 'true');
    });
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
      if (line && line.itemType === 'top' && !comfortTopsEnabled()) {
        return this.read();
      }
      var data = this.read();
      var existing = data.lines.find(function (l) {
        return l.itemType === line.itemType && l.sizeId === line.sizeId && l.firmness === line.firmness;
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
        if (l.itemType === 'top') return true;
        return l.sizeId !== sizeId;
      });
      return this.write(data);
    },
    clear: function () {
      return this.write({ lines: [] });
    },
  };

  function comfortTopsEnabled() {
    var el =
      document.querySelector('[data-comfort-tops-enabled]') ||
      document.querySelector('[data-size-reserve]') ||
      document.querySelector('[data-comfort-top]');
    if (!el) return false;
    return el.getAttribute('data-comfort-tops-enabled') === 'true';
  }

  function resolveCartLeadTime(lines) {
    var max = 0;
    var min = 0;
    (lines || []).forEach(function (l) {
      var lmax = parseInt(l.leadMax, 10) || 0;
      var lmin = parseInt(l.leadMin, 10) || 0;
      if (lmax > max) {
        max = lmax;
        min = lmin;
      }
    });
    var types = { mattress: false, top: false };
    (lines || []).forEach(function (l) {
      if (l.itemType === 'top') types.top = true;
      else types.mattress = true;
    });
    var mix = 'mattress';
    if (types.top && types.mattress) mix = 'mixed';
    else if (types.top) mix = 'top';
    return {
      min: min,
      max: max,
      display: min === max ? max + ' weeks' : min + ' to ' + max + ' weeks',
      mix: mix,
    };
  }

  function sizesAndPricesHref() {
    if (document.getElementById('reserve')) return '#reserve';
    var path = location.pathname || '';
    if (/\/pages\//.test(path) || /\/blog\//.test(path)) return '../index.html#reserve';
    if (window.ValtoraTheme && window.ValtoraTheme.routes && window.ValtoraTheme.routes.root != null) {
      var root = String(window.ValtoraTheme.routes.root || '/');
      if (root.slice(-1) !== '/') root += '/';
      return root + '#reserve';
    }
    return '/#reserve';
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
      el.textContent = hasLines ? 'Checkout' : 'See sizes and prices';
      if (el.tagName === 'A' || el.tagName === 'a') {
        el.setAttribute('href', hasLines ? checkoutHref : sizesHref);
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
      if (line.itemType === 'top') return sum;
      return sum + (parseInt(line.quantity, 10) || 0);
    }, 0);
  }

  function paintFloatBasketFromStore() {
    var countEl = document.querySelector('[data-float-count]');
    var totalEl = document.querySelector('[data-float-total]');
    var continueEls = document.querySelectorAll('[data-float-continue]');
    if (!countEl && !totalEl && !continueEls.length) return;
    var lines = OrderStore.lines();
    var n = mattressUnitsFromLines(lines);
    var hasLines = lines.length > 0 || n > 0;
    var totalText = hasLines ? formatOrderTotal(lines) : '';
    if (countEl) countEl.textContent = hasLines ? (n === 1 ? '1 MATTRESS' : n + ' MATTRESSES') : 'Choose a size';
    if (totalEl) totalEl.textContent = hasLines ? totalText || '-' : '';
    applyOrderCtaLabels(hasLines);
  }

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
    paintFloatBasketFromStore();
  }

  function reviewOrderUrl() {
    var tagged = document.querySelector('[data-checkout-path]');
    if (tagged && tagged.getAttribute('data-checkout-path')) {
      return tagged.getAttribute('data-checkout-path');
    }
    var link = document.querySelector(
      '[data-float-continue][data-checkout-href], [data-reserve-continue][data-checkout-href], [data-reserve-continue][href], [data-float-continue][href]'
    );
    if (link) {
      var stored = link.getAttribute('data-checkout-href');
      if (stored) return stored;
      var href = link.getAttribute('href');
      if (href && href.charAt(0) !== '#' && /checkout/i.test(href)) return href;
    }
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

    var addLabel = (
      root.getAttribute('data-add-label') ||
      (window.ValtoraTheme && window.ValtoraTheme.sizeAddLabel) ||
      'Add'
    ).trim() || 'Add';
    var market = root.getAttribute('data-market') || detectMarket();
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
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 8;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 10;
    var comfortTopPrice = root.getAttribute('data-comfort-top-price') || '';
    var comfortTopVariant = root.getAttribute('data-comfort-top-variant') || '';
    var defaultFirmness = root.getAttribute('data-default-firmness') || 'Soft / firm';
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
      return market === 'gb' ? largeThresholdGb : largeThresholdAe;
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
      list.querySelectorAll('.size-option').forEach(function (btn) {
        var wrap = btn.querySelector('[data-size-qty]');
        var valEl = btn.querySelector('[data-qty-val]');
        var addBtn = btn.querySelector('[data-qty-add]');
        var stepper = btn.querySelector('[data-qty-stepper]');
        if (!wrap) return;
        var available = btn.getAttribute('data-available') !== 'false';
        var sizeId = btn.getAttribute('data-size-id');
        var q = lineQtyForSize(sizeId, btn.getAttribute('data-size-variant'));
        var inBasket = q > 0;
        btn.classList.toggle('is-in-basket', inBasket);
        if (valEl) valEl.textContent = String(Math.max(q, 1));
        wrap.hidden = !available;
        wrap.setAttribute('data-qty-mode', inBasket ? 'stepper' : 'add');
        if (addBtn) {
          addBtn.hidden = inBasket;
          addBtn.setAttribute(
            'aria-label',
            addLabel + ' ' + (btn.getAttribute('data-size-label') || 'size')
          );
        }
        if (stepper) stepper.hidden = !inBasket;
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

    function updateFloatBasket(lines, totalText, units) {
      var countEl = document.querySelector('[data-float-count]');
      var totalEl = document.querySelector('[data-float-total]');
      var continueEls = document.querySelectorAll('[data-float-continue]');
      if (!countEl && !totalEl && !continueEls.length) return;
      var n = units != null ? units : mattressUnits(lines || []);
      var label = n === 1 ? '1 MATTRESS' : n + ' MATTRESSES';
      var hasLines = (lines || []).length > 0 || n > 0;
      if (countEl) countEl.textContent = hasLines ? label : 'Choose a size';
      if (totalEl) totalEl.textContent = hasLines ? totalText || '-' : '';
      applyOrderCtaLabels(hasLines);
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
      return allRows.filter(function (row) {
        if (row.market && row.market !== mkt) return false;
        return true;
      });
    }
    sizes = filterSizesForMarket(market);

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
      paintFloatBasketFromStore();
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
          'Please notify me when this size opens in the allocation.\n\nSize: ' +
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
        var dims = s.dims;
        if (!dims) {
          var mapped = (SIZE_MAPS[market] || []).filter(function (row) {
            return row.id === s.id;
          })[0];
          dims = mapped && mapped.dims ? mapped.dims : '';
        }
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
        btn.setAttribute('data-size-dims', dims);
        btn.setAttribute('data-size-price', s.price || '');
        btn.setAttribute('data-size-price-raw', String(sizePriceRaw(s)));
        btn.setAttribute('data-size-firmness', s.firmness || 'Medium');
        if (s.variant_id || s.variantId) {
          btn.setAttribute('data-size-variant', String(s.variant_id || s.variantId));
        }
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
          dims +
          (available ? '' : ' · Not in this allocation') +
          '</span>' +
          '</span>' +
          (available
            ? '<span class="size-option__qty" data-size-qty data-qty-mode="add">' +
              '<button type="button" class="size-option__add" data-qty-add>' +
              addLabel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
              '</button>' +
              '<span class="size-option__stepper" data-qty-stepper hidden>' +
              '<button type="button" class="size-option__qty-btn" data-qty-dec aria-label="Decrease quantity">−</button>' +
              '<span class="size-option__qty-val" data-qty-val>1</span>' +
              '<button type="button" class="size-option__qty-btn" data-qty-inc aria-label="Increase quantity">+</button>' +
              '</span>' +
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
      syncSizeQtyUi();
    }

    if (list && !list.children.length) {
      rebuildSizeButtons();
    } else if (list) {
      var active = list.querySelector('.size-option.is-active') || list.querySelector('.size-option');
      if (active) applySelection(active, { silent: true });
    }

    root._valtoraOnMarketChange = function () {
      market = root.getAttribute('data-market') || detectMarket();
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

    if (list) {
      list.addEventListener('click', function (e) {
        var add = e.target.closest('[data-qty-add]');
        var dec = e.target.closest('[data-qty-dec]');
        var inc = e.target.closest('[data-qty-inc]');
        if (add || dec || inc) {
          e.preventDefault();
          e.stopPropagation();
          var row = e.target.closest('.size-option');
          if (!row || row.getAttribute('data-available') === 'false') return;
          // Size edits always return to Stage A — never leave Stage B open on a stale summary.
          collapseStageB(true);
          var sizeId = row.getAttribute('data-size-id');
          var q = lineQtyForSize(sizeId, row.getAttribute('data-size-variant'));
          if (add) q = 1;
          if (dec) q -= 1;
          if (inc) q = q + 1;
          if (q < 1) {
            OrderStore.removeMattressSize(sizeId);
            if (qtyInput) qtyInput.value = '1';
            if (!row.classList.contains('is-active')) {
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
          applySelection(row, { silent: true });
          upsertActiveMattress(q, { size: sizeFromRow(row) });
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
          'Item type': line.itemType === 'top' ? 'Spare comfort top' : 'Mattress',
          _lead_min: String(line.leadMin != null ? line.leadMin : leadMin),
          _lead_max: String(line.leadMax != null ? line.leadMax : leadMax),
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
          var label =
            line.itemType === 'top'
              ? 'Spare comfort top · ' + (line.label || '')
              : line.label || 'Mattress';
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
      (market === 'gb' ? 'Klarna' : 'Tabby or Tamara');
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
      var mixedCopy = page.querySelector('[data-leadtime-copy-mixed]');
      var explain = page.querySelector('[data-leadtime-explain]');
      if (leadLabel) leadLabel.textContent = resolved.display || leadWindow;
      if (mattressCopy) mattressCopy.hidden = resolved.mix !== 'mattress';
      if (topCopy) topCopy.hidden = resolved.mix !== 'top';
      if (mixedCopy) {
        mixedCopy.hidden = resolved.mix !== 'mixed';
        if (resolved.mix === 'mixed') {
          mixedCopy.textContent =
            'Your order includes a mattress and a comfort top. We use the longer window (' +
            resolved.display +
            ') so everything can arrive together.';
        }
      }
      if (explain) {
        if (resolved.mix === 'top') {
          explain.textContent = 'Sent by courier. Unroll and give it a few hours to recover its full height.';
        } else if (resolved.mix === 'mixed') {
          explain.textContent = 'Delivery is charged once. The longer window applies to the whole order.';
        } else {
          explain.textContent = 'Most orders arrive sooner. Built after you order and flown to your market.';
        }
      }
    }

    function thresholdFor() {
      return market === 'gb' ? thresholdGb : thresholdAe;
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
        financeName = market === 'gb' ? 'Klarna' : 'Tabby or Tamara';
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
            currency: market === 'gb' ? 'GBP' : 'AED',
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
                      'Item type': line.itemType === 'top' ? 'Spare comfort top' : 'Mattress',
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
            OrderStore.clear();
            window.location.href = shopifyCheckout;
          })
          .catch(function () {
            if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
          });
      });
    }
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
    var sizes = (SIZE_MAPS[market] || SIZE_MAPS.ae).slice();
    var sizeBox = root.querySelector('[data-top-sizes]');
    var selectedSize = null;
    var selectedFirm = preFirm
      ? preFirm.charAt(0).toUpperCase() + preFirm.slice(1).toLowerCase()
      : '';
    var leadMin = parseInt(root.getAttribute('data-lead-min'), 10) || 2;
    var leadMax = parseInt(root.getAttribute('data-lead-max'), 10) || 3;
    var leadWindow = root.getAttribute('data-lead-window') || '2 to 3 weeks';
    var priceText =
      (root.querySelector('[data-top-price]') && root.querySelector('[data-top-price]').textContent) ||
      (market === 'gb' ? '£250' : 'AED 1,200');

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
          return (
            '<button type="button" class="size-chip" role="option" data-top-size="' +
            s.id +
            '" data-size-label="' +
            s.label +
            '" data-size-dims="' +
            s.dims +
            '">' +
            s.label +
            '<small>' +
            s.dims +
            '</small></button>'
          );
        })
        .join('');
    }
    function selectSize(id, fromPrefill) {
      selectedSize = sizes.filter(function (s) { return s.id === id; })[0] || null;
      if (!selectedSize) return;
      root.querySelectorAll('[data-top-size]').forEach(function (btn) {
        btn.setAttribute('aria-selected', btn.getAttribute('data-top-size') === id ? 'true' : 'false');
      });
      if (known) {
        root.querySelectorAll('[data-top-size]').forEach(function (btn) {
          btn.disabled = btn.getAttribute('data-top-size') !== id;
        });
      }
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
      knownLine.textContent = 'This replaces the module in your ' + selectedSize.label + '.';
    }

    root.querySelectorAll('[data-top-firmness]').forEach(function (btn) {
      if (selectedFirm && btn.getAttribute('data-top-firmness') === selectedFirm) {
        btn.setAttribute('aria-selected', 'true');
      }
      btn.addEventListener('click', function () {
        selectedFirm = btn.getAttribute('data-top-firmness');
        root.querySelectorAll('[data-top-firmness]').forEach(function (b) {
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
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
        OrderStore.addLine({
          itemType: 'top',
          sizeId: selectedSize.id,
          label: selectedSize.label,
          dims: selectedSize.dims,
          firmness: selectedFirm,
          unitPrice: priceText,
          priceRaw: parseInt(
            root.getAttribute('data-top-price-raw-' + market) ||
              root.getAttribute('data-top-price-raw'),
            10
          ),
          variantId: root.getAttribute('data-variant-id') || '',
          quantity: 1,
          market: market,
          leadWindow: leadWindow,
          leadMin: leadMin,
          leadMax: leadMax,
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

    function update() {
      if (suppressPage) {
        bar.hidden = true;
        document.body.classList.remove('has-sticky-reserve');
        return;
      }
      // Unavailable size / request-a-size: keep the basket at the bottom even
      // while #reserve is on screen (sidebar shows notify / request UI).
      if (forceFloatBasket()) {
        bar.hidden = false;
        bar.removeAttribute('hidden');
        document.body.classList.add('has-sticky-reserve');
        return;
      }
      // Homepage / pages with #reserve: hide while reserve panel is in view,
      // and suppress until the in-hero primary CTA has left the viewport.
      if (reserve && sectionOn(reserve)) {
        var show = heroCtaPassed && !reserveVisible;
        bar.hidden = !show;
        document.body.classList.toggle('has-sticky-reserve', show);
        return;
      }
      // All other pages: always show the floating basket.
      bar.hidden = false;
      bar.removeAttribute('hidden');
      document.body.classList.add('has-sticky-reserve');
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
      var link = e.target.closest('a[href="#reserve"]');
      if (link) {
        e.preventDefault();
        if (reserve) {
          reserve.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = sizesAndPricesHref();
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

  function applyShareMeta(brandName, brandLine, tagline, shareTemplate) {
    var name = (brandName || 'Aligna').trim() || 'Aligna';
    var line = brandLine == null ? '' : String(brandLine).trim();
    var site = line ? name + ' ' + line : name;
    var tone = (tagline || 'Premium Sleep, Engineered for the Gulf').trim();
    var template =
      (shareTemplate && String(shareTemplate).trim()) ||
      'Premium Sleep, Engineered for the Gulf · [Brand]. A better bed, for life. Refresh the comfort top - do not replace the whole mattress.';
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

    var boot = window.__valtoraPreviewBoot || {};
    var name = boot.name || 'Aligna';
    var line = typeof boot.line === 'string' ? boot.line : 'Mattresses';
    var guidelines = boot.guidelines || 'v1';
    var fontSet = boot.fontSet || 'modern';
    var scheme = boot.scheme || 'signature';
    try {
      name = localStorage.getItem('valtoraPreviewBrand') || name;
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
    } catch (e) {}

    var tagline = 'Premium Sleep, Engineered for the Gulf';
    var shareCopy = '';
    try {
      tagline = localStorage.getItem('valtoraPreviewTagline') || tagline;
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

    window.__valtoraPreviewBoot = {
      name: name,
      line: line,
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

  function applyMarketOnlyVisibility(market) {
    market = market || document.documentElement.getAttribute('data-market') || detectMarket();
    document.querySelectorAll('[data-market-only]').forEach(function (el) {
      var only = el.getAttribute('data-market-only');
      var show = only === market;
      el.hidden = !show;
      if (show) el.removeAttribute('hidden');
    });
  }

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

    var DEFAULT_AE = 'Cancel any time before dispatch · 100-night trial · Made to order';
    var DEFAULT_GB = 'Cancel any time before dispatch · 100-night trial · Spread with Klarna';
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

  function boot() {
    initPreviewBrandChrome();
    var market = detectMarket();
    document.documentElement.setAttribute('data-market', market);
    if (document.body && !document.body.getAttribute('data-market')) {
      document.body.setAttribute('data-market', market);
    }
    applyMarketOnlyVisibility(market);
    initPreviewAnnouncement();
    applyPreviewTopsFlag();
    initReveal();
    initSectionWipes();
    initTrustMarquee();
    initPreviewClaimToggles();
    initScrollProgress();
    initParallax();
    initInViewVideo();
    initMagneticButtons();
    initTiltCards();
    initFaq();
    initAllReserves();
    initMobileNav();
    syncChromeOffsets();
    window.addEventListener('resize', syncChromeOffsets);
    initStickyReserve();
    initCartPage();
    initCheckoutPage();
    initOrderConfirmed();
    initComfortTop();
    initReviews();
    initFunnelTracking();
    initExitIntent();
    // Cross-tab / cross-page: when localStorage basket changes, refresh UI from
    // the freshest stamped payload (never resurrect a fuller stale copy).
    window.addEventListener('storage', function (e) {
      if (!e || e.key !== OrderStore.KEY) return;
      OrderStore.read();
      document.dispatchEvent(
        new CustomEvent('valtora:order-changed', { detail: OrderStore.read() })
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
