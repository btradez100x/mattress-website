# 13.0.0 — lp-dynamic-from-price

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `51d0487` (`9a6300e` feature commit) |
| Connect / `shopify-theme` | `8777ac5` |

## What shipped

- Mattress LP **From** price is dynamic: lowest priced mattress variant in that page’s size set.
- Source of truth for the size set: `size-reserve` `allowed_size_ids` / `data-allowed-sizes` (homepage configure on the nine LPs). Blank = full market catalog.
- Liquid SSR via `snippets/mattress-min-price.liquid` + `lp.liquid` (`data-lp-price-mode="from"`, `[data-lp-price]`).
- `theme.js` `fillLandingPrices` / `lowestCatalogPriceRow` paints preview + live after catalog load; prefers size-reserve allowed list.
- Klarna hero lines left as static prototype copy.
- `landing-funnel` From price also respects `allowed_size_ids` when that section is used.
- size-reserve / press-logos LP configure reuse left intact.

## What was left out

- No VERSION bump. Cart protected files untouched.
- Klarna monthly not derived from min price.
- Pre-existing smoke fails left as-is.
