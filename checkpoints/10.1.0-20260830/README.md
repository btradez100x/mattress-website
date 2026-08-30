# 10.1.0 — 20260830 latest export

**Date:** Sunday 30 Aug 2026  
Named snapshot for Downloads / Shopify Admin upload. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Latest `preview/` + `valtora-theme/` snapshot (working tree at pack time, including in-progress storefront WIP) |
| `Valtora-Shopify-Theme-10.1.0-20260830.zip` | Theme zip for Shopify Admin → Online Store → Themes → Add theme → Upload zip. Gitignored (`*.zip`); copy lives in Downloads. |
| `Valtora-Shopify-Theme-10.1.0-20260830.tar.gz` | Same theme tree as a tar (not for Admin; zip is the upload format) |

Downloads copies (same bytes):

- `numa-website-10.1.0-20260830-preview-and-theme.tar.gz`
- `numa-website-10.1.0-20260830-valtora-theme.zip`
- `numa-website-10.1.0-20260830-valtora-theme.tar.gz`

Restore:
```bash
tar -xzf checkpoints/10.1.0-20260830/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `acbccda` | Committed line at pack time (compressed-arrival-and-lates checkpoint) |
| Connect source `v9` | `acbccda` | Same commit |
| Connect / `shopify-theme` | `1fedd1e` | Subtree of `valtora-theme/` for Brand_guidelines_a1e2 (`7cf3393`) |

This pack is a **working-tree snapshot**, not only `acbccda`. It includes uncommitted preview/theme WIP that was on disk when exported (mobile-fit CSS, theme.js, base.css, brand tokens, hero/layout tweaks). Shopify Connect still tracks committed `v9` / `shopify-theme` until those files are committed and pushed.

Checkout was not modified. Legal name **Valtora FZE**.

## What this pack contains

Committed line through `acbccda` / `checkpoints/10.1.0-compressed-arrival-and-lates`, plus the on-disk storefront as of 30 Aug 2026:

- Compressed-arrival cream type on solid navy (`d205fc5`)
- Brand_guidelines_a1e2 tokens; `brand.css` last (`7cf3393`)
- Cool Touch snow-on-navy, footer debug stripped, sticky size bar, hero max-height restore, Choose-your-size one-card chrome
- Journal six notes, CEO byline; size picker one market; Size Guide tiles; 20/10/35 construction
- Working-tree extras present at export: `mobile-fit.css`, updated `theme.js` / `base.css` / `brand.css` / `css-variables.liquid`, preview page token/class updates

## What was left out

- `VERSION` stays **10.1.0**. Checkout files were not edited.
- GitHub Action cannot `theme push` until repo secrets exist. Upload the theme zip in Admin if Connect lags.
- Shopify Admin pages (Journal, Manufacturing, About, landings) still need to exist if they 404.

Store: Numa Mattress (`7dbr1b-1q`). Storefront is password-protected: https://7dbr1b-1q.myshopify.com/
