# 13.0.0 — heading-weight-restore

**Date:** Wednesday 16 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `a621fb0` |
| `shopify-theme` | `75502ac` |

## What shipped

Restored screenshot-era Guidelines **700** heading weight.

- Theme setting `heading_weight` stays **700** (Guidelines). `settings_data` current matches.
- LP and redesign display type now use `var(--heading-weight, 700)` instead of hardcoded 600.
- Spec list labels (`.spec b`) raised from 400 → 600.
- Section titles (The build / The feel) default to **Bold — Geist Mono 600** (was Regular 500).
- Base `h1`/`h2` fall back to `--heading-weight` (700) so they cannot stick at 600/500 without the Brand setting.

Cart untouched. No VERSION bump.

## What was left out

Password, lifestyle, press, Checkout cream, and the parallel LP reviews-strip work were not part of this ship.
