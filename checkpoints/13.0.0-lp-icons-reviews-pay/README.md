# 13.0.0 — lp-icons-reviews-pay

**Date:** Friday 18 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `034eb81624dadb1f16e0665d798561d27544d659` |
| Connect / `shopify-theme` | `b13966971e9c20172b593bfa265e692430d2c2ea` |
| Live CLI push | `assets/lp.css`, `assets/theme.js`, `assets/base.css`, `sections/lp.liquid`, `snippets/lp-pay-row.liquid` → theme `#204376113477` (`shopify theme push --allow-live`) |

## What was broken

- Assurance plaque icons were empty nested CSS squares that read as broken image placeholders on live.
- Hero pay chips and footer payment marks lacked contrast (hairline on snow / dark navy).
- **Read them** linked off-page (`/pages/reviews` or homepage `#reviews`).
- Review counts painted exact figures (`500`) instead of approximate `500+`.

## What shipped

- SVG assurance icons (layers / return / shield) on all nine LPs (theme + preview).
- **Read them** opens a closable on-page reviews modal fed by `reviews.json` (4.96 / 500+); no off-page href.
- Pay chips: carbon border + snow fill; Klarna pink mark colours. Footer payment marks sit on white chips (Klarna pink).
- Review counts always suffix `+` in LP revstrip SSR, JS paint, and homepage social proof summary.
- Kept: heading-weight 700, Coolweave tokens, size-reserve configure, cart untouched. No VERSION bump.

## Left out

- No VERSION bump
- Cart / checkout protected surfaces untouched
- Size-selector redesign still out of scope
