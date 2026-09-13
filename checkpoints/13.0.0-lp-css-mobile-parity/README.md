# 13.0.0 — lp-css-mobile-parity

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `PENDING` |
| `shopify-theme` | `PENDING` |

## What shipped

- Landing-page CSS regenerated from the zip prototypes and scoped under `.lp`, with correct media-query braces (previous file left most rules trapped inside unclosed `@media` blocks).
- Isolation from homepage `.hero` / `base.css` / `mobile-fit.css` so grid, type, press, assure, layers, and video match the prototypes.
- Mobile menu: hide header “Reserve yours” below 900px so the hamburger is not clipped; nav panel opens with full links.
- Theme + preview synced (`lp.css`, `base.css` header rules, `mobile-fit.css`, nine LP preview pages + related configure pages).
- Emperor “Not covered by the … day returns policy” remains removed from size-picker tiles and LP/configure emperor policy strips; cart notes still carry it.

## What was left out

- No VERSION bump. Cart protected files untouched.
- Pre-existing smoke fails left as-is (footer lockup, trade CX copy, section grounds, JS auto ground).
