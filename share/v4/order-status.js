/**
 * Order status page — consumes the portable JSON contract.
 * Shopify App Proxy today (/apps/order); same payload if the API host changes.
 */
(function () {
  var STAGES = [
    { n: 1, name: "Order confirmed" },
    { n: 2, name: "In production" },
    { n: 3, name: "Quality checked" },
    { n: 4, name: "In transit" },
    { n: 5, name: "Arrived locally" },
    { n: 6, name: "Delivery being arranged" },
    { n: 7, name: "Delivery booked" },
    { n: 8, name: "Delivered" },
  ];
  var GENERIC = "If that matches an order, we have sent you a link.";
  var EXPIRED = "That link has expired. Enter your details and we will send a new one.";

  function qs(root, sel) {
    return root.querySelector(sel);
  }

  function stageName(n, market) {
    if (Number(n) === 5) return market === "ae" ? "Arrived in the UAE" : "Arrived in the UK";
    var hit = STAGES.filter(function (s) { return s.n === Number(n); })[0];
    return hit ? hit.name : "";
  }

  function explainStages(market) {
    return STAGES.map(function (s) {
      return { n: s.n, name: stageName(s.n, market), current: false };
    });
  }

  function daysAgo(iso) {
    if (!iso) return 0;
    var t = new Date(iso).getTime();
    if (!isFinite(t)) return 0;
    return Math.floor((Date.now() - t) / 86400000);
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (!isFinite(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function mockPayload(kind, stage, market) {
    if (kind === "expired") return { status: "expired", message: EXPIRED };
    if (kind === "sent" || kind === "notfound") return { status: "sent", message: GENERIC };
    if (kind === "cancelled") {
      return {
        status: "cancelled",
        message: "This order was cancelled on 12 March 2026. If that is wrong, contact us.",
        order: { reference: "1042", cancelled_at: "2026-03-12", updated_by_hand: true },
      };
    }
    if (kind === "refunded") {
      return {
        status: "refunded",
        message: "Refunded on 12 March 2026.",
        order: { reference: "1042", refunded_at: "2026-03-12", updated_by_hand: true },
      };
    }
    var n = parseInt(stage, 10) || 3;
    if (n < 1) n = 1;
    if (n > 8) n = 8;
    var stages = [];
    for (var i = 1; i <= n; i++) {
      stages.push({ n: i, name: stageName(i, market), current: i === n });
    }
    var delayed = kind === "delayed";
    var updated = new Date();
    if (kind === "stale") updated.setDate(updated.getDate() - 18);
    return {
      status: delayed ? "delayed" : "ok",
      message: delayed ? "Factory slot moved by a week. You can still cancel before dispatch for a full refund." : "",
      order: {
        reference: "1042",
        stage: n,
        stage_name: stageName(n, market),
        stages: stages,
        stage_updated_at: updated.toISOString(),
        size_label: "King",
        size_dims: market === "ae" ? "180 × 200 cm" : "150 × 200 cm",
        delivery_window: "8 to 10 weeks",
        delivery_date: n >= 7 ? "2026-09-04" : null,
        delay_notice: delayed ? "Factory slot moved by a week. You can still cancel before dispatch for a full refund." : null,
        revised_window: delayed ? "10 to 12 weeks" : null,
        batch_photo_url: null,
        updated_by_hand: true,
        next:
          n === 7
            ? "Delivery is booked for 4 September 2026."
            : n === 8
              ? "Delivered."
              : "We will email at the next stage. This page is updated by hand, not live tracking.",
      },
    };
  }

  function render(root, payload, cfg) {
    var idle = qs(root, "[data-os-idle]");
    var result = qs(root, "[data-os-result]");
    var formNote = qs(root, "[data-os-form-note]");
    var status = (payload && payload.status) || "idle";

    if (formNote && (status === "sent" || status === "expired")) {
      formNote.hidden = false;
      formNote.textContent = payload.message || (status === "expired" ? EXPIRED : GENERIC);
    }

    if (!payload || status === "idle" || status === "sent" || status === "error") {
      if (idle) idle.hidden = false;
      if (result) {
        result.hidden = true;
        result.innerHTML = "";
      }
      if (status === "error" && formNote) {
        formNote.hidden = false;
        formNote.textContent = GENERIC;
      }
      if (status !== "sent" && status !== "expired" && status !== "error" && formNote) {
        formNote.hidden = true;
        formNote.textContent = "";
      }
      paintExplain(root, cfg.market);
      return;
    }

    if (idle) idle.hidden = true;
    if (result) result.hidden = false;
    if (status === "expired") {
      if (idle) idle.hidden = false;
      if (result) result.hidden = true;
      paintExplain(root, cfg.market);
      return;
    }

    var html = "";
    var order = payload.order || {};
    if (status === "cancelled" || status === "refunded") {
      html += '<p class="section__lede">' + escapeHtml(payload.message || "") + "</p>";
      html += contactP(cfg);
      result.innerHTML = html;
      return;
    }

    html += '<p class="order-status__ref">Order ' + escapeHtml(order.reference || "") + "</p>";
    if (order.size_label || order.size_dims) {
      html +=
        '<p class="order-status__meta">' +
        escapeHtml([order.size_label, order.size_dims].filter(Boolean).join(" · ")) +
        "</p>";
    }

    var windowLine = "";
    if (Number(order.stage) >= 7 && order.delivery_date) {
      windowLine = "Delivery date: " + escapeHtml(formatDate(order.delivery_date));
    } else if (order.revised_window) {
      windowLine = "Revised window: " + escapeHtml(order.revised_window);
    } else if (order.delivery_window) {
      windowLine = "Delivery window: " + escapeHtml(order.delivery_window);
    }
    if (windowLine) html += '<p class="order-status__meta">' + windowLine + "</p>";

    html += '<p class="reserve-panel__note">Updated by hand as your mattress moves through production. This is not live tracking.</p>';

    var staleDays = daysAgo(order.stage_updated_at);
    if (staleDays >= 14) {
      html +=
        '<p class="order-status__stale" role="status">Last updated ' +
        staleDays +
        ' days ago. Nothing has changed since then. <a href="' +
        escapeHtml(cfg.contactPath) +
        '">Contact us</a></p>';
    }

    if (status === "delayed" && (order.delay_notice || payload.message)) {
      var delayText = order.delay_notice || payload.message;
      html +=
        '<p class="order-status__delay" role="status">' +
        escapeHtml(delayText) +
        (order.revised_window ? " Revised window: " + escapeHtml(order.revised_window) + "." : "") +
        (/\bcancel\b/i.test(delayText) ? "" : " You can cancel before dispatch for a full refund.") +
        "</p>";
    }

    var stages = order.stages || [];
    html += '<ol class="order-status__stages" aria-label="Order progress">';
    stages.forEach(function (s) {
      var state = s.current ? "current" : "done";
      html +=
        '<li class="order-status__stage" data-state="' +
        state +
        '"><span class="order-status__num">' +
        s.n +
        "</span><span>" +
        escapeHtml(s.name) +
        (s.current ? " <em>(current)</em>" : "") +
        "</span></li>";
    });
    html += "</ol>";

    if (order.next) html += '<p class="order-status__next">' + escapeHtml(order.next) + "</p>";
    if (order.batch_photo_url) {
      html +=
        '<figure class="order-status__photo"><img src="' +
        escapeHtml(order.batch_photo_url) +
        '" alt="Production run" width="1200" height="800" loading="lazy"></figure>';
    }
    html += contactP(cfg);
    result.innerHTML = html;
  }

  function contactP(cfg) {
    return (
      '<p class="reserve-panel__note">Questions? <a href="' +
      escapeHtml(cfg.contactPath) +
      '">Contact us</a>.</p>'
    );
  }

  function paintExplain(root, market) {
    var list = qs(root, "[data-os-explain]");
    if (!list) return;
    list.innerHTML = explainStages(market)
      .map(function (s) {
        return (
          '<li class="order-status__stage" data-state="explain"><span class="order-status__num">' +
          s.n +
          "</span><span>" +
          escapeHtml(s.name) +
          "</span></li>"
        );
      })
      .join("");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function endpoint(cfg) {
    return String(cfg.endpoint || "/apps/order").replace(/\/+$/, "");
  }

  function init(root) {
    if (!root) return;
    var cfg = {
      endpoint: root.getAttribute("data-lookup-endpoint") || "/apps/order",
      enabled: root.getAttribute("data-lookup-enabled") !== "false",
      preview: root.getAttribute("data-preview") === "true",
      market: root.getAttribute("data-market") || (document.documentElement.getAttribute("data-market") || "ae"),
      contactPath: root.getAttribute("data-contact-path") || "/pages/contact",
    };

    paintExplain(root, cfg.market);

    var params = new URLSearchParams(window.location.search);
    var token = params.get("t") || "";
    var previewKind = params.get("preview") || "";
    var previewStage = params.get("stage") || "";

    if (cfg.preview && previewKind) {
      render(root, mockPayload(previewKind, previewStage, cfg.market), cfg);
    } else if (token && (cfg.enabled || cfg.preview)) {
      if (cfg.preview) {
        render(root, mockPayload("ok", previewStage || "4", cfg.market), cfg);
      } else {
        fetch(endpoint(cfg) + "?t=" + encodeURIComponent(token), { headers: { Accept: "application/json" } })
          .then(function (r) { return r.json(); })
          .then(function (data) { render(root, data, cfg); })
          .catch(function () {
            render(root, { status: "sent", message: GENERIC }, cfg);
          });
      }
    }

    var form = qs(root, "[data-os-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!cfg.enabled && !cfg.preview) return;
        var fd = new FormData(form);
        var order = String(fd.get("order") || "").trim();
        var email = String(fd.get("email") || "").trim();
        var btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        function done() {
          render(root, { status: "sent", message: GENERIC }, cfg);
          if (btn) btn.disabled = false;
        }
        if (cfg.preview) {
          done();
          return;
        }
        fetch(endpoint(cfg) + "/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ order: order, email: email }),
        })
          .then(function () { done(); })
          .catch(function () { done(); });
      });
    }

    root.querySelectorAll("[data-os-preview-state]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-os-preview-state");
        var stage = btn.getAttribute("data-os-preview-stage") || "";
        if (kind === "idle") render(root, { status: "idle" }, cfg);
        else render(root, mockPayload(kind, stage, cfg.market), cfg);
      });
    });
  }

  function boot() {
    document.querySelectorAll("[data-order-status]").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
