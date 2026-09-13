# 13.0.0 — lp-v18-pack

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `a8f86ca885188c1be3873f64eeb911a90445b31a` |
| Connect / `shopify-theme` | `1c35531c02b57ff52a9599f6a7804185224213ff` |

## What shipped

v18 paid-search landing pack into the nine live LP handles (`size`, `need`, `premium`, `other-size`, `conquest`, `spec-size`, `need-only`, `spec-only`, `temperature`).

### Coolweave naming
- **Cool-Knit / cool-knit cover** replaced with brand-aware **`[Brand] [Cover]`** / **`[Cover]`** tokens.
- Theme settings added: `cover_material` (default Coolweave), `gel_material` (Coolcell), `core_name` (Sevencore).
- Tokens resolve via `lp.liquid` and `landing-copy.liquid` from `settings.brand_name` + the three material settings.
- Shared redesign layer table updated the same way (cover / gel / core names).

### Pack behaviour kept
- Rearrangeable `lp.liquid` blocks, `size-reserve` `#configure`, lead time hidden, `allowed_size_ids`, dynamic From, GTM / `lp_variant` tracking.
- Reviews strip from `reviews.json` (aggregate **4.96**). Press per HTML; **no awards**.
- Handles unchanged (zip stems).

## What was left out

- No VERSION bump. Cart protected files untouched.
- Spec five-route collapse not applied — nine zip stems remain.
- Pre-existing smoke fails (footer lockup, landing configure check, grounds, Trade copy) left as-is.
