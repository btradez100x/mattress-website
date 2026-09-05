/**
 * Float basket recovery (13.0.7).
 * Shopify was serving a stale theme.js from GitHub sync; this small file loads
 * after it and stops the mobile basket bar going blank / white.
 */
(function () {
  'use strict';

  var KEY = 'valtora_order_lines';

  function readBasket() {
    var raw = null;
    try {
      raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    } catch (e) {}
    if (!raw) return { lines: [] };
    try {
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.lines)) return { lines: [] };
      return data;
    } catch (err) {
      return { lines: [] };
    }
  }

  function units(list) {
    return (list || []).reduce(function (sum, line) {
      var t = String((line && line.itemType) || 'mattress');
      if (t && t !== 'mattress') return sum;
      return sum + (parseInt(line.quantity, 10) || 0);
    }, 0);
  }

  function isSizePage() {
    if (document.body && document.body.classList.contains('template-index')) return false;
    return !!document.querySelector('[data-size-reserve], [data-lp-configure]');
  }

  function formatTotal(list) {
    var pence = (list || []).reduce(function (sum, line) {
      var unit = parseInt(line.priceRaw, 10);
      if (!isFinite(unit)) unit = 0;
      return sum + unit * (parseInt(line.quantity, 10) || 0);
    }, 0);
    if (!pence) return '';
    var currency =
      (window.Shopify && Shopify.currency && Shopify.currency.active) || 'GBP';
    try {
      return (pence / 100).toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
      });
    } catch (err) {
      return '£' + (pence / 100).toFixed(2);
    }
  }

  function paint() {
    var bar = document.querySelector('[data-float-basket], [data-sticky-reserve]');
    if (!bar || document.querySelector('[data-checkout-page]')) return;

    var list = readBasket().lines || [];
    var n = units(list);
    var has = list.length > 0 || n > 0;
    var countEl = bar.querySelector('[data-float-count]');
    var totalEl = bar.querySelector('[data-float-total]');
    var btn = bar.querySelector('[data-float-continue]');
    var viewBtn = bar.querySelector('[data-order-sheet-open]');

    if (countEl) {
      countEl.textContent = has ? (n === 1 ? '1 mattress' : n + ' mattresses') : 'Choose a size';
      countEl.removeAttribute('hidden');
    }
    if (totalEl) {
      totalEl.textContent = has ? formatTotal(list) || '—' : '';
      if (has) totalEl.removeAttribute('hidden');
      else totalEl.setAttribute('hidden', '');
    }
    if (btn) {
      btn.textContent = has ? 'Checkout' : 'See sizes and prices';
      btn.removeAttribute('hidden');
    }

    bar.classList.toggle('has-items', has);
    bar.classList.toggle('is-active', has);

    if (viewBtn) {
      if (isSizePage() && has) viewBtn.removeAttribute('hidden');
      else viewBtn.setAttribute('hidden', '');
    }

    if (has) {
      if (isSizePage() && !window.matchMedia('(max-width: 980px)').matches) {
        bar.hidden = true;
        document.body.classList.remove('has-sticky-reserve');
        document.documentElement.style.setProperty('--float-basket-space', '0px');
      } else {
        bar.hidden = false;
        bar.removeAttribute('hidden');
        document.body.classList.add('has-sticky-reserve');
        var h = Math.ceil(bar.getBoundingClientRect().height || 72);
        if (h < 48) h = 72;
        if (h > 140) h = 140;
        document.documentElement.style.setProperty('--float-basket-space', h + 'px');
      }
    } else if (isSizePage()) {
      // Size page with an empty basket: hide completely — do not leave a
      // navy hairline over a white void.
      bar.hidden = true;
      bar.classList.remove('has-items', 'is-active');
      document.body.classList.remove('has-sticky-reserve');
      document.documentElement.style.setProperty('--float-basket-space', '0px');
    }

    var sheetBody = document.querySelector('[data-order-sheet-body]');
    if (sheetBody && has) {
      var panel = document.querySelector(
        '[data-size-reserve] [data-order-lines-list], [data-lp-configure] [data-order-lines-list]'
      );
      if (panel) sheetBody.innerHTML = panel.innerHTML;
    }
  }

  function boot() {
    paint();
    document.addEventListener('valtora:order-changed', paint);
    document.addEventListener('valtora:float-basket-mode', paint);
    window.addEventListener('pageshow', paint);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') paint();
    });
    document.addEventListener(
      'click',
      function (e) {
        if (!e.target || !e.target.closest) return;
        if (
          !e.target.closest(
            '[data-size-pick], [data-qty-inc], [data-qty-dec], [data-order-sheet-open], .size-row, .size-option'
          )
        ) {
          return;
        }
        setTimeout(paint, 0);
        setTimeout(paint, 150);
        setTimeout(paint, 400);
      },
      true
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
