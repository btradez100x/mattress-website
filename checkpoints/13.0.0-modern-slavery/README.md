# 13.0.0 — modern-slavery

**Date:** Friday 18 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `72ee45cc939c791a9160f576d18f5581aa32041c` |
| Connect / `shopify-theme` | `ad5332336507ba9f676c74a7534b6f74c7a0d9ba` |

## What shipped

Voluntary Modern slavery statement page matching other trust-policy pages.

- Template `page.modern-slavery` → `/pages/modern-slavery` (Admin: create page, handle `modern-slavery`, assign template, Visible)
- Reuses `trust-policy` section with \[Legal\] fallback copy (MSA voluntary statement, £36 million threshold as figures)
- Preview mirror `preview/pages/modern-slavery.html`
- Footer Policies link (theme + preview) after Cookies
- Smoke asserts template + preview + footer wiring
- Cart untouched. No VERSION bump.

## What was left out

- No VERSION bump
- Cart / checkout protected surfaces untouched
- Source trade-site brand tokens (Cole Commerce Ltd / Onni London) mapped to storefront \[Legal\] / Valtora FZE rather than hard-coded UK Ltd wording
