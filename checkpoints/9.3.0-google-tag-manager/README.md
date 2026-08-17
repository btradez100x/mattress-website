# 9.3.0 — google-tag-manager

**Date:** Monday 17 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `0d07250` | Install GTM-MX9SHNSM on storefront layouts |
| Connect / `shopify-theme` | `3e7ca98` | Subtree of `valtora-theme/` at this deploy |

`0d07250` message: *Install Google Tag Manager GTM-MX9SHNSM on storefront layouts so tracking loads without a theme-setting gate.*

## What shipped

Product flags **OFF**. No VERSION bump. No new dataLayer events beyond the existing vTrack bootstrap.

1. **Google Tag Manager GTM-MX9SHNSM** — exact Google snippets on storefront layouts only (`layout/theme.liquid`, `layout/password.liquid`).
2. **Head** — container script as high as possible after charset/viewport (`{% render 'meta-tags' %}`).
3. **Body** — noscript iframe immediately after opening `<body>`.
4. **No duplicate loader** — settings-gated `gtm.js` removed from `snippets/tracking-pixels.liquid`. Existing dataLayer / `vTrack` push kept.
5. **Theme setting** — `gtm_container_id` left in schema as documentation; info tells the merchant the layout already has GTM-MX9SHNSM. Leave the field blank.

## What was left out

- Preview HTML — preview does not already mirror GTM/analytics chrome; no second analytics stack.
- Shopify checkout.liquid — none in this theme; checkout is storefront `page.checkout` via `theme.liquid` (gets GTM).
- GA4 / Meta / Ads IDs or extra dataLayer events.
- VERSION bump / export zip / MAJOR freeze.
- Product sell flags stay **OFF**.

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-google-tag-manager/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
