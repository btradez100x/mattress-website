# 10.1.0 — size-picker-and-contrast

**Date:** Sunday 30 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Committed `preview/` + `valtora-theme/` at `fbad89c` |

Restore:
```bash
tar -xzf checkpoints/10.1.0-size-picker-and-contrast/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `fbad89c` | Alternate section grounds on Snow, Surface, and Dark (includes note contrast + size picker) |
| Connect / `shopify-theme` | `b93cdc1` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` (or `v9` → `valtora-theme/`) onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` ran on the last `v9` push and **skipped** CLI `theme push` because `SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, and `SHOPIFY_THEME_ID` are not set.

This deploy did not use Shopify CLI. Live update depends on Connect picking up `shopify-theme` `b93cdc1`.

Checkout was not modified.

## What this pack contains (since last Connect `5b121bb`)

- Size picker restyled to the brand tile system; Sizes dropdown aligned with sibling header labels.
- One market, whole-tile add; unlisted countries served as UK (not UAE).
- Note field / form contrast so size notes and fields stay readable on beige; labels on navy bands use on-dark ink; gold focus ring.
- Alternate section grounds on Snow, Surface, and Dark (homepage + landings, including manufacturing section ground).
- How it is made (already on the late-review pack): 20/10/35, 1.8/2.0mm, UK six, 49-year line, how-it-is-built brief.

## What was left out

- A separate manufacturing **rewrite** was not on `origin` at deploy time. The existing how-it-is-made pack plus section-ground tweaks **are** included; a later rewrite is not.
- Uncommitted local preview/theme WIP (brand-guidelines v2 defaults, preview-server working tree) was **not** shipped. Connect uses committed `origin/v9` / `shopify-theme` only.
- GitHub Action cannot `theme push` until repo secrets exist. No secrets were invented.
- Shopify Admin pages (Journal, Manufacturing, About, landings) still need to exist if they 404.

Store: Numa Mattress (`7dbr1b-1q`). Storefront is password-protected: https://7dbr1b-1q.myshopify.com/ — enter the storefront password from Shopify Admin → Online Store → Preferences.
