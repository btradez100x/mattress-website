# 13.0.0 — lp-sizestrip-pay-restore

**Date:** Thursday 17 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `33be877a4dd235ae5f68264fce3e49ff62a336c6` |
| Connect / `shopify-theme` | `0adcc499946d9443797e9165c251e25d62376bd4` |
| Live CLI push | `assets/lp.css` → theme `#204376113477` (`shopify theme push --allow-live`) |

## Root cause

Not a broken `@media` brace or selector rename. Local `lp.css` (and Connect `origin/shopify-theme`) already had full v18 `.sizestrip` + `.pay` rules (~17KB). **Live CDN was still serving a truncated ~8.5KB `lp.css` without those rules** (last-modified stuck at 02:24 UTC). Connect alone does not overwrite the live theme file; pages fell back to unstyled blue links and concatenated payment text.

## What we fixed

- CLI `shopify theme push --only assets/lp.css --allow-live` to theme `#204376113477`
- Bumped `connect-force` marker and pushed `shopify-theme` so Connect stays aligned
- Preview verified: sizestrip `display:flex` with bordered pills; pay chips bordered `nowrap` spans (8 chips)

## Left out

- No VERSION bump
- Cart / checkout protected surfaces untouched
- No markup class renames needed (`pay` / `sizestrip` already matched v18)
