# 10.0.0 — numa-storefront

**Date:** Saturday 29 Aug 2026  
**Export:** `Valtora-Shopify-Theme-10.0.0-numa-storefront.zip`

Kept milestone. Version **was** bumped: `VERSION` and Shopify `theme_version` are **10.0.0**. This is the storefront to restore if later work needs rolling back. It does not replace earlier kept copies (`9.4.0-landing-pages-and-gtm`, `9.3.0-storefront-polish-review`, `9.2.0-order-status-app-proxy`).

Upload this zip as an unpublished theme and preview it. Your live theme is unchanged until you publish. If you prefer to keep editing the live theme by hand, use **Online Store → Themes → … → Edit code** on the published theme instead.

- `Valtora-Shopify-Theme-10.0.0-numa-storefront.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/`

Product flags remain **OFF** (`comfort_tops_enabled`, `sheets_enabled`, `pillows_enabled`, `footer_accessories_enabled`). Splitit and order-status lookup stay **off**.

Worker (not in the Shopify zip): `apps/order-status-worker/` at `https://valtora-order-status.valtora.workers.dev`. Setup: `docs/ORDER_TRACKING.md`.

Restore the working copy:
```bash
tar -xzf checkpoints/10.0.0-numa-storefront/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
```

---

## What’s in this freeze (since 9.4.0)

### Brand
- Theme settings **Brand name (line 1)** is **Numa**. Schema default, locale default, Liquid/JS fallbacks, preview wordmarks, and lifecycle emails match. Aligna remains only in leftover-copy replace filters and the title rewrite regex.
- Legal entity remains **Valtora FZE**. Contact email is still `hello@aligna.com`.

### Pages
- About (`page.about`, handle `about`) in header and footer.
- Old mattress removal and recycling (`page.mattress-recycling`) linked from the basket.
- Landing copy for large sizes, European King, specification, and what it buys. Depth **35cm**. Comfort layer named value **£299**. Made to Desire verb is **make**.

### Trial, banner, basket
- **30-day** sleep trial. Emperor is not covered by the 30-day return trial. Statutory rights sentence unchanged.
- Banner: Concierge unpacking **included with every mattress**, dismissible per session.
- Basket: Old mattress removal and recycling **Complimentary**. Concierge unpacking **Included**.

### Emails
- Sixteen lifecycle templates in `emails/`. Shopify is an event source only. Short name and wordmark from Theme settings brand name (line 1), first word only.

### Already in 9.4.0, still in this zip
- Go-live nav and policy URLs, lead time at the buy button.
- Firmness copy Medium / Medium Firm.
- Landing pages v2, GTM theme setting, UTM first-touch, 25-year warranty setting, LCP first-paint, European King 160 × 200 cm, spec panel, product PDP templates with flags off.

---

## After you upload (Admin, not in the zip)

1. **Online Store → Themes → Add theme → Upload zip** → choose this file. Do not publish until you have previewed it.
2. Create missing Pages if the live store still 404s: **about**, **mattress-recycling**, plus landing handles `large-sizes`, `european-king`, `specification`, `what-it-buys`, `configure`, **journal**, **order-status**, **manufacturing** (assign the matching templates).
3. Confirm Theme settings: **Brand name** Numa, **GTM container ID**, **Trial nights** 30, **Warranty years** 25.
4. Comfort tops, sheets, pillows, Splitit, and order-status lookup stay **off** until you turn them on on purpose.
