# 13.0.0 — trade-developers-image

**Date:** Sunday 13 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `c86f128` | Rename Trade Property developers asset off reserved `-large` filename |
| Connect / `shopify-theme` | `054d4cd` | Same trade fix on the Connect branch |

Also pushed directly to the live theme via Shopify CLI (`theme push --allow-live`) so the storefront updates before Connect catches up.

## What shipped

- Property developers card (and the lower “large bedroom” image) now use `trade-developers.webp` instead of `trade-large.webp`.
- Preview `pages/trade.html` synced to the same filename.
- Cause: Shopify treats `large` as a reserved image size token; the theme asset name `trade-large.webp` left a blank `<img>` box on the live Trade page while sibling cards rendered.

## What was left out

- Cart untouched.
- No VERSION bump.
- Pre-existing smoke fails (footer lockup, Trade `[D-reply]` / 5 working days, section grounds, LP configure) unchanged.

## Restore

```bash
tar -xzf checkpoints/13.0.0-trade-developers-image/preview-and-theme.tar.gz
```
