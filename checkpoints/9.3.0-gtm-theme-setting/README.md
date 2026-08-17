# 9.3.0 — gtm-theme-setting

**Date:** Monday 17 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `268a3c4` | Load GTM from the theme setting |
| Connect / `shopify-theme` | `4a8ac7a` | Subtree of `valtora-theme/` at this deploy |

`268a3c4` message: *Load GTM from the theme setting so the container ID can change without a layout edit.*

## What shipped

Product flags **OFF**. No VERSION bump. No new dataLayer events beyond the existing vTrack bootstrap.

1. **Theme setting is the single GTM source** — `gtm_container_id` in Theme settings (`settings_schema.json` + `settings_data.json` current). Default / current value: **GTM-MX9SHNSM**. Info: paste the container ID; leave blank to disable. Change ID or disable without a code edit.
2. **Head** — official GTM script as high as possible after charset/viewport (`{% render 'meta-tags' %}`), gated on `settings.gtm_container_id`.
3. **Body** — noscript iframe immediately after opening `<body>`, same gate.
4. **Layouts** — `layout/theme.liquid` and `layout/password.liquid`. Hardcoded `GTM-MX9SHNSM` snippets removed so the container cannot load twice.
5. **No duplicate loader** — `snippets/tracking-pixels.liquid` keeps dataLayer / `vTrack` bootstrap and does **not** load `gtm.js` (that snippet sits too late). Legacy TikTok / Snapchat / Clarity fallbacks only when GTM is blank. No extra GA4 / Meta tags.

## What was left out

- Preview HTML — preview does not already mirror GTM/analytics chrome; no second analytics stack.
- Shopify checkout.liquid — none in this theme; checkout is storefront `page.checkout` via `theme.liquid` (gets GTM from the setting).
- Headless — neither Liquid option survives a headless move; GTM would be added in the headless app.
- VERSION bump / export zip / MAJOR freeze.
- Product sell flags stay **OFF**.

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-gtm-theme-setting/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
