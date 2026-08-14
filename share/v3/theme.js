/**
 * Valtora theme behaviours - size reserve, FAQ, motion, market sizing.
 */
(function () {
  'use strict';

  var SIZE_MAPS = {
    ae: [
      { id: 'single', label: 'Single', dims: '90-100 × 200 cm' },
      { id: 'queen', label: 'Queen', dims: '160 × 200 cm' },
      { id: 'king', label: 'King', dims: '180 × 200 cm' },
      { id: 'super-king', label: 'Super King', dims: '200 × 200 cm' },
    ],
    gb: [
      { id: 'single', label: 'Single', dims: '90 × 190 cm' },
      { id: 'double', label: 'Double', dims: '135 × 190 cm' },
      { id: 'king', label: 'King', dims: '150 × 200 cm' },
      { id: 'super-king', label: 'Super King', dims: '180 × 200 cm' },
    ],
  };

  function detectMarket() {
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
    /* Light heroes are stacked (Apple-style) — parallax only on dark lifestyle overlays */
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
    /* Disabled: CTAs keep a fixed position — hover scale is CSS-only */
  }

  function initTiltCards() {
    /* Disabled: tiles use a single in-place scale — no pointer tilt/wobble */
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

  function initSizeReserve(root) {
    if (!root) return;

    var market = root.getAttribute('data-market') || detectMarket();
    var priceSet = root.getAttribute('data-price-set') || 'control';
    var list = root.querySelector('[data-size-list]');
    var selected = root.querySelector('[data-selected-size]');
    var selectedDims = root.querySelector('[data-selected-dims]');
    var form = root.querySelector('[data-reserve-form]');
    var priceEl = root.querySelector('[data-display-price]');
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

    if (configEl) {
      try {
        var parsed = JSON.parse(configEl.textContent.trim());
        if (Array.isArray(parsed) && parsed.length) sizes = parsed;
      } catch (e) {}
    }

    function setMode(mode) {
      // mode: 'available' | 'notify' | 'request'
      if (availablePanel) availablePanel.hidden = mode !== 'available';
      if (notifyPanel) notifyPanel.hidden = mode !== 'notify';
      if (requestPanel) requestPanel.hidden = mode !== 'request';
    }

    function syncSticky(btn) {
      var stickyPrice = document.querySelector('[data-sticky-price]');
      if (stickyPrice) {
        stickyPrice.textContent = (btn && btn.getAttribute('data-size-price')) || '';
      }
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

    function applySelection(btn) {
      if (!btn) return;
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
      if (priceEl) {
        priceEl.textContent = isRequest
          ? 'Discuss with us'
          : btn.getAttribute('data-size-price') || '';
      }
      setMode(isRequest ? 'request' : available ? 'available' : 'notify');
      syncSticky(isRequest ? null : btn);
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

    if (list && !list.children.length) {
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
          '</span>' +
          (available
            ? ''
            : '<span class="size-option__badge">Not yet available</span>') +
          '</span>' +
          (s.price
            ? '<span class="size-option__price">' + s.price + '</span>'
            : '<span class="size-option__price" aria-hidden="true"></span>');
        list.appendChild(btn);
        if (i === defaultIdx) applySelection(btn);
      });
    } else if (list) {
      var active = list.querySelector('.size-option.is-active') || list.querySelector('.size-option');
      if (active) applySelection(active);
    }

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
        available: active
          ? active.getAttribute('data-available') !== 'false' &&
            active.getAttribute('data-request-size') !== 'true'
          : fallback.available !== false,
      };
    }

    if (list) {
      list.addEventListener('click', function (e) {
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
          // Keep user notes visible; also ensure body includes size for Shopify contact inbox
          requestNotesInput.value = composed;
        }
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
        var variantId = form.getAttribute('data-variant-id');
        var productId = form.querySelector('[name="id"]');
        if (productId && productId.value) variantId = productId.value;

        if (!variantId) {
          if (statusEl) {
            statusEl.textContent =
              'Connect a deposit product in the section settings, then try again.';
            statusEl.hidden = false;
          }
          return;
        }

        var payload = {
          id: Number(variantId),
          quantity: 1,
          properties: {
            Size: size.label + ' - ' + size.dims,
            'Size ID': size.id,
            Price: size.price || '',
            Market: market.toUpperCase(),
            'Price set': priceSet,
          },
        };

        if (window.ValtoraUTM) {
          payload = window.ValtoraUTM.applyToCartPayload(payload);
        }

        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Reserving…';
        }

        var sync = window.ValtoraUTM
          ? window.ValtoraUTM.syncCartAttributes()
          : Promise.resolve();

        sync
          .then(function () {
            return fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(payload),
            });
          })
          .then(function (res) {
            if (!res.ok) throw new Error('Add failed');
            return res.json();
          })
          .then(function () {
            if (typeof fbq === 'function') {
              fbq('track', 'AddToCart', { content_name: 'Reserve deposit' });
            }
            if (typeof ttq !== 'undefined' && ttq.track) {
              ttq.track('AddToCart');
            }
            window.location.href = (window.ValtoraTheme && window.ValtoraTheme.routes.cart) || '/cart';
          })
          .catch(function () {
            if (statusEl) {
              statusEl.textContent = 'Something went wrong. Please try again.';
            }
          });
      });
    }
  }

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

    var url = root.getAttribute('data-reviews-url');
    var pageSize = parseInt(root.getAttribute('data-reviews-page-size'), 10) || 6;
    var grid = root.querySelector('[data-reviews-grid]');
    var moreBtn = root.querySelector('[data-reviews-more]');
    var emptyEl = root.querySelector('[data-reviews-empty]');
    var avgEl = root.querySelector('[data-reviews-average]');
    var countEl = root.querySelector('[data-reviews-count]');
    var starsEl = root.querySelector('[data-reviews-stars]');
    var shown = 0;
    var reviews = [];

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
    var reserve = document.getElementById('reserve');
    if (!bar || !reserve) return;

    var heroPassed = !hero;
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
      // Show after leaving the hero; hide while "Reserve your allocation" is on screen.
      var show = (!hero || !sectionOn(hero) || heroPassed) && !reserveVisible;
      bar.hidden = !show;
      document.body.classList.toggle('has-sticky-reserve', show);
    }

    function checkVisibility() {
      if (!hero || !sectionOn(hero)) {
        heroPassed = true;
      } else {
        var heroRect = hero.getBoundingClientRect();
        heroPassed = heroRect.bottom < (window.innerHeight || document.documentElement.clientHeight) * 0.35;
      }

      if (!sectionOn(reserve)) {
        reserveVisible = false;
        update();
        return;
      }

      var rect = reserve.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // Hide while the reserve / "Reserve your allocation" section is in focus.
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
      io.observe(reserve);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    document.addEventListener('preview:sections-changed', checkVisibility);
    checkVisibility();

    bar.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="#reserve"]');
      if (!link) return;
      e.preventDefault();
      reserve.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
    /* Preview market toggle can show/hide UAE-only items */
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(prepareAll, 80);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-market'] });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var market = detectMarket();
    document.documentElement.setAttribute('data-market', market);
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
    initReviews();
  });
})();
