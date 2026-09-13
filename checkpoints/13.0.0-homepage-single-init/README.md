# 13.0.0 — homepage-single-init

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` (fix commit) | `e22295738adbb2e6159f3750ce7535cc11ebb1d7` |
| `shopify-theme` | `df985bb90d93e7bddff9cb1012a758d654bae326` |

## What shipped

Homepage no longer flashes content twice when `theme.js` is slow to arrive.

- `layout/theme.liquid`: js-ready failsafe waits 4.5s and skips if `window.__numaThemeJs` is set (was 900ms, which raced deferred theme.js).
- `theme.js`: `__numaThemeJs` / `__numaHomeInit` guards; reveal / FAQ / reviews / trust marquee / sticky / landing funnel idempotent; size grids skip Liquid re-paint on first boot; boot paints sizes before reveal.
- Preview cache-buster `theme.js?v=home-init1`. Preview + theme `theme.js` synced.

## What was left out

No VERSION bump. Cart files untouched. Parallel LP page edits outside this fix were not part of the commit. Pre-existing smoke fails left as they were.
