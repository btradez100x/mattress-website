# 11.0.0 — nine-page-redesign

**Date:** Wednesday 2 Sep 2026  
**Export:** `Valtora-Shopify-Theme-11.0.0-nine-page-redesign.zip`

Kept milestone. Version **was** bumped: `VERSION` and Shopify `theme_version` are **11.0.0**. This is the storefront to restore if later work needs rolling back. It does not replace earlier kept copies (`10.0.0-numa-storefront`, `10.1.0-manufacturing-and-landing-cart`, `9.4.0-landing-pages-and-gtm`, `9.3.0-storefront-polish-review`, `9.2.0-order-status-app-proxy`).

Upload this zip as an unpublished theme and preview it. Your live theme is unchanged until you publish. If you prefer to keep editing the live theme by hand, use **Online Store → Themes → … → Edit code** on the published theme instead.

- `Valtora-Shopify-Theme-11.0.0-nine-page-redesign.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/`

Live at freeze: `v9` `faf9f3e`, Connect `shopify-theme` `c650a1c` (theme_version on live is still **10.1.0** until this zip is uploaded or 11.0.0 is deployed).

Product flags remain **OFF** (`comfort_tops_enabled`, `sheets_enabled`, `pillows_enabled`, `footer_accessories_enabled`). Splitit and order-status lookup stay **off**.

Worker (not in the Shopify zip): `apps/order-status-worker/` at `https://valtora-order-status.valtora.workers.dev`. Setup: `docs/ORDER_TRACKING.md`.

Restore the working copy:
```bash
tar -xzf checkpoints/11.0.0-nine-page-redesign/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
```

---

## What’s in this freeze (since 10.0.0)

### Nine-page redesign
- Specification rewrite: hero, five-figure strip, eight numbered layers with `.layer-benefit`, argument, Adjust to Desire.
- Manufacturing replacement: factory videos (poster first; `preload="none"`; no `src` until scroll), materials, process.
- About: existing year-with-us copy, media, fifteen centimetres of comfort.
- Support: health / back-pain page.
- Landing pages (large-sizes, european-king, cooling, split-king, what-it-buys): media + spec figures. Shopify size picker kept.
- Nav: The mattress (→ specification), How it is made, Support, About, Trade.
- Spec figures: 20cm core, 15cm comfort, 35cm total.
- Tracking: `video_start`, `video_complete`, `spec_layer_view`, `spec_scroll_complete`, `media_gallery_view`.

### Already in 10.1.0, still in this zip
- Manufacturing how-it-is-built (older copy, now superseded by the redesign section).
- Landing configure posts `/cart/add.js` with quantity stepper.
- Trade page template, size-guide polish, collage on snow, gold kickers.

---

## After you upload (Admin, not in the zip)

1. **Online Store → Themes → Add theme → Upload zip** → choose this file. Do not publish until you have previewed it.
2. Confirm Pages use the matching templates: **specification**, **manufacturing**, **about**, **support**, **large-sizes**, **european-king**, **cooling**, **split-king**, **what-it-buys**. Create **trade** if `/pages/trade` still 404s.
3. Confirm Theme settings: **Brand name** Numa, **GTM container ID**, **Trial nights** 30, **Warranty years** 25.
4. Comfort tops, sheets, pillows, Splitit, and order-status lookup stay **off** until you turn them on on purpose.
