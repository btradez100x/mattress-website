/**
 * Valtora theme behaviours — size reserve, FAQ, motion, market sizing.
 */
(function () {
  'use strict';

  var SIZE_MAPS = {
    ae: [
      { id: 'single', label: 'Single', dims: '90–100 × 200 cm' },
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

  function initReveal() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) {
        n.classList.add('is-visible');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
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

    function setMode(available) {
      if (availablePanel) availablePanel.hidden = !available;
      if (notifyPanel) notifyPanel.hidden = available;
    }

    function applySelection(btn) {
      if (!btn) return;
      var available = btn.getAttribute('data-available') !== 'false';
      if (list) {
        list.querySelectorAll('.size-option').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
      }
      if (selected) selected.textContent = btn.getAttribute('data-size-label');
      if (selectedDims) selectedDims.textContent = btn.getAttribute('data-size-dims');
      if (priceEl) priceEl.textContent = btn.getAttribute('data-size-price') || '';
      setMode(available);

      var sizeLabel = btn.getAttribute('data-size-label') || '';
      var sizeDims = btn.getAttribute('data-size-dims') || '';
      var sizeId = btn.getAttribute('data-size-id') || '';
      if (notifySizeInput) {
        notifySizeInput.value = sizeLabel + ' — ' + sizeDims + ' (' + sizeId + ')';
      }
      if (notifyBodyInput) {
        notifyBodyInput.value =
          'Please notify me when this size is available.\n\nSize: ' +
          sizeLabel +
          ' — ' +
          sizeDims +
          '\nSize ID: ' +
          sizeId +
          '\nMarket: ' +
          String(market).toUpperCase() +
          '\nPrice set: ' +
          priceSet;
      }
    }

    if (list && !list.children.length) {
      sizes.forEach(function (s, i) {
        var available = s.available !== false;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'size-option' + (available ? '' : ' size-option--oos');
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
        if (i === 0) applySelection(btn);
      });
    }

    function currentSize() {
      var active = list && list.querySelector('.size-option.is-active');
      var fallback = sizes[0] || { id: '', label: '', dims: '', price: '', available: true };
      return {
        id: active ? active.getAttribute('data-size-id') : fallback.id,
        label: active ? active.getAttribute('data-size-label') : fallback.label,
        dims: active ? active.getAttribute('data-size-dims') : fallback.dims,
        price: active ? active.getAttribute('data-size-price') : fallback.price || '',
        available: active
          ? active.getAttribute('data-available') !== 'false'
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

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var size = currentSize();
        if (!size.available) {
          setMode(false);
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
            Size: size.label + ' — ' + size.dims,
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

  document.addEventListener('DOMContentLoaded', function () {
    var market = detectMarket();
    document.documentElement.setAttribute('data-market', market);
    initReveal();
    initFaq();
    initAllReserves();
    initMobileNav();
  });
})();
