# 13.0.0 — lp-v12-pack

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `c4d9b58c833fb89997352c672ef6d0ddcc3a7061` |
| Connect / `shopify-theme` | `b23fec92b3af9f94d96c5fce529af063778d7596` |

## What shipped

v12 paid-search landing pack into the nine live LP handles (`size`, `need`, `premium`, `other-size`, `conquest`, `spec-size`, `need-only`, `spec-only`, `temperature`).

- **Reviews strip** (v12 `revstrip`): Ember stars + score + count + link, filled from shared `reviews.json` (aggregate **4.96**). Hidden until data loads.
- **Press panel**: compact wordmark strip matching zip HTML (`As featured in` + five titles). **No awards.** Homepage `press-logos` section removed from LP templates.
- **Order**: under the hero rule on most pages (revstrip then press). Spec pages keep press with the late assurance block per zip HTML.
- **Premium**: outcome-framed cards + originality dark section from v12; late From price / Klarna / size strip kept.
- **Kept**: rearrangeable `lp.liquid` blocks, `size-reserve` `#configure`, lead time hidden, `allowed_size_ids`, dynamic From, GTM / `lp_variant` tracking, zip-stem handles.

## What was left out

- No VERSION bump. Cart protected files untouched.
- Spec_2 five-route collapse (`/lp/support`, `/lp/cooling`, …) not applied — nine zip HTML files + live handles win.
- Pre-existing smoke fails (footer lockup, landing configure check, grounds, Trade copy) left as-is.
