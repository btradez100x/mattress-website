# 13.0.0 — lp-homepage-components

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `7c3479a` |
| `shopify-theme` | `6001b54` |

## What shipped

- Nine LP templates reuse homepage `press-logos` (As featured in / Press & recognition) as its own section between `lp` blocks and configure.
- Nine LP templates + related configure surfaces reuse homepage `size-reserve` for Choose your size, with `anchor_id: configure`, `configure_funnel`, `leadtime_placement: hidden` where the plan hid lead time, and `allowed_size_ids` / `featured_size` preserved.
- Hero text press strip disabled (`show_press: false`); prefer the Press logos section.
- Preview pages mirrored; cart protected files untouched.

## What was left out

- No VERSION bump.
- Prototype page content stays elsewhere; zip handles kept.
- Pre-existing smoke fails left as-is (section grounds, JS auto ground, and related prior checks).
