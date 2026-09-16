# 13.0.0 — trading-as-brand-only

**Date:** Wednesday 16 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `c107f0f` |
| `shopify-theme` | `6342591` |

## What shipped

Trading as is Brand name only. The product-line / descriptor tagline (e.g. “A sleep company” / “Mattresses”) no longer trails the Trading as line in the footer or on Contact.

- `sections/footer.liquid` — `Trading as {{ brand }}` only
- `sections/contact.liquid` — same
- `theme.js` (theme + preview) — `[data-trading-as]` / `[data-trading-as-wrap]` hydrate with brand name only
- Preview homepage + contact static copy synced
- Theme settings schema info text: Trading as uses Brand name only; Product line remains lockup + `[Line]` tokens
- Regression assertion updated to require brand-only Trading as (no `brand_product_line` in footer)

Wordmark / oo-logo lockup descriptor under the name is unchanged.

## What was left out

Cart untouched. Lockup SVGs and Product line setting value left as-is. Heading-weight and reviews deploys not bundled here.
