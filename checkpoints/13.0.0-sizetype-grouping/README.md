# 13.0.0 — sizetype-grouping

**Date:** Tuesday 8 Sep 2026  
**This is a named deploy checkpoint**, not a SemVer export. `VERSION` was **not** bumped. Current line remains **13.0.0**.

## Deploy SHAs

| Tree | SHA |
|---|---|
| `v9` | `03ff08a` |
| `shopify-theme` | `b75a69b` |

## What shipped

- Size groups read variant metafield `custom.SizeType` only.
- Market shown still decides which sizes appear in a market. It does not assign a group.
- Size name is not used as a stand-in for SizeType.

If a variant has no SizeType, it still appears when Market shown includes that country. It does not join a guessed group, so the tabs stay hidden until more than one SizeType is set.

## Rollback

`v9` `956d8cc` / `shopify-theme` `bb55871` / `checkpoints/13.0.0-order-panel-and-logo-svg/`
