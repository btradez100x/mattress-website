# 13.0.0 — heading-weight-sitewide

**Date:** Wednesday 16 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `14bfffcfe2ca4c37d3ef7a749fa6f4d762d97b59` |
| Connect / `shopify-theme` | `cecebe619ba568db27ce94af6a33ba53f6b31776` (CSS ship `f31cc5b`; nest cleanup `cecebe6`) |

## What shipped

Sitewide heading text weight follows Brand setting `--heading-weight` / `data-heading-weight` (Guidelines **700**).

- `base.css`: `h1`–`h3`, section/display chrome (cart titles, checkout lead, size guide, built-panel heads, LP homepage components, etc.) use `var(--heading-weight, 700)` instead of locked 500/600/700.
- `brand.css`: `h3`–`h6` use the token; expanded attribute chrome for cart / trade / LP / manufacturing / journal / policy titles.
- `manufacturing.css` + `trade.css`: display type uses the token.
- `redesign.css`: mono `.spec b` stays **600** (label exception). Display type already on the token from LP polish.
- Preview CSS synced for the same files.

LP polish (`839a88f`) left as shipped — no LP revert.

## What was left out

- No VERSION bump. Cart layout / protected cart helpers untouched (font-weight only on title chrome).
- Wordmark, body buttons, mono eyebrows / kickers stay fixed weights.
- Pre-existing smoke fails unchanged.
