# 13.0.0 — reviews-4-96

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `4f984d7437f1609e60bcd12a679a4d1439d82ef3` |
| Connect / `shopify-theme` | `c78df1fb82aab74c1833e326f514567fd682328c` |

## What shipped

- `valtora-theme/assets/reviews.json` and `preview/assets/reviews.json` retuned so the computed aggregate is **4.96**.
- Set: **480 × 5★** + **20 × 4★** = sum **2480** / **500** = **4.96** (homepage Social proof reads this via `theme.js` `toFixed(2)`).
- No LP review component, copy, or styling changes. Left for v12 LP agent.

## What was left out

- No VERSION bump. Cart untouched. No LP / press / trust UI work.
- Pre-existing smoke fails left as-is.
