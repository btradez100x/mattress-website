# 9.3.0 — warranty-years-setting

**Date:** Monday 17 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | — | Pending push |
| Connect / `shopify-theme` | — | Pending subtree |

## What shipped

Product flags **OFF**. No VERSION bump.

**Theme settings → Warranty years** (`warranty_years`, default **25**) is the single source for warranty duration on the storefront, including T&Cs.

1. **Setting** — labelled **Warranty years**. Info: used everywhere warranty length is shown, including T&Cs. Current value 25.
2. **Token** — `snippets/warranty-tokens.liquid` turns `[X]`, `[X]-year`, leftover `15-year` / `25-year`, and `{{ settings.warranty_years }}` into the setting.
3. **Surfaces that read it**
   - Hero assurance (blank override → setting; filled line may use `[X]`)
   - Trust bar (`[X]-year core warranty`, or blank label on the warranty icon)
   - Offer (`[X]-year warranty`)
   - FAQ (`[X]-year` in answers)
   - Warranty policy fallback + page body (`[X]`)
   - Checkout terms (`{{ warranty }}-year`)
   - Reserve Stage B fallback + order-terms richtext (`[X]`)
   - Order confirmed (`data-warranty-years` on the page)
   - `layout/theme.liquid` `data-warranty-years`
4. **Preview** — `data-warranty-years="25"` on `<html>`, numbers via `data-warranty-years-text`, hydrated by `preview/brand-boot.js` (`PREVIEW_WARRANTY_YEARS`).
5. **Also in this tree (could not split)** — homepage LCP first-paint (hero opacity 1 + 450ms rise, eager/high-priority hero image, Outfit preload / Fraunces deferred, `display=swap`).

## What was left out

- VERSION bump / export zip / MAJOR freeze.
- Historical `share/v3/`, `share/v4/`.
- Developer specs and internal mockups.
- Blog lines that are not a Valtora warranty.
- New legal sentences on order confirmed (no warranty-duration sentence there today).
- Product sell flags stay **OFF**.

## Customize

**Theme settings → Market & sizing → Warranty years**

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-warranty-years-setting/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
