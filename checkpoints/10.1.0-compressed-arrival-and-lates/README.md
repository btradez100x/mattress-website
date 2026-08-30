# 10.1.0 — compressed-arrival and lates Connect deploy

**Date:** Sunday 30 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Committed `preview/` + `valtora-theme/` at `7cf3393` |

Restore:
```bash
tar -xzf checkpoints/10.1.0-compressed-arrival-and-lates/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `7cf3393` | Brand_guidelines_a1e2 tokens on top of compressed-arrival CSS |
| Connect source `v9` | `7cf3393` | Fast-forwarded (folder `valtora-theme/`) |
| Connect / `shopify-theme` | `1fedd1e` | Matching subtree of `valtora-theme/` (already on origin; not force-pushed) |

Shopify Connect should pull `v9` → `valtora-theme/` and/or `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` ran on the `v9` push and **skipped** CLI `theme push` because `SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, and `SHOPIFY_THEME_ID` are not set.

This deploy did not use Shopify CLI. Live update depends on Connect picking up `v9` `7cf3393` / `shopify-theme` `1fedd1e`.

Checkout was not modified. Legal name **Valtora FZE**.

## Compressed-arrival CSS — **included**

Waited ~8 minutes for `bc-9eeb213d` (Rebuild compressed-arrival CSS). Commit **`d205fc5`** landed on origin and is in this deploy:

- “It arrives compressed. We do not leave it that way.” is cream/snow type on **solid navy**
- No grey glass: nested `.lp-tier--pick` / `.lp-svc` fills, opacity, and backdrop-filter stripped
- Supporting points as a cream row with 1px cream/gold hairlines
- Delivery layout forced to `section--dark` in Liquid
- Homepage and specification share the same section CSS

## What this pack contains (since last live `v9` `9c6f061`)

- Cool Touch copy forced to snow on navy (`79db8e6`)
- Neon debug lines removed from the homepage footer (`fa92fed`)
- Choose-a-size bar pinned to the viewport bottom (`1a175cf`)
- Homepage light hero restored to the pre-`070a1cb` max-height band (`930d28a`)
- Choose-your-size restored to one card chrome (`a178418`)
- Compressed-arrival cream-on-navy, no grey glass (`d205fc5`)
- Brand_guidelines_a1e2 as live token source; `brand.css` last (`7cf3393`)

## What was left out

- Uncommitted local preview/theme WIP (brand-guidelines working tree, extra sections) was **not** shipped. Connect uses committed `origin/v9` / `shopify-theme` only.
- GitHub Action cannot `theme push` until repo secrets exist. No secrets were invented.
- Shopify Admin pages (Journal, Manufacturing, About, landings) still need to exist if they 404.

Store: Numa Mattress (`7dbr1b-1q`). Theme id `204376113477`. Storefront is password-protected: https://7dbr1b-1q.myshopify.com/ — enter the storefront password from Shopify Admin → Online Store → Preferences.
