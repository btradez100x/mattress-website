# 10.1.0 — lates Connect deploy (cards, scroll, gold, radius, journal-off-home)

**Date:** Sunday 30 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Committed `preview/` + `valtora-theme/` at this deploy (filled cards) |

Restore:
```bash
tar -xzf checkpoints/10.1.0-lates-connect-deploy/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Filled-card branch / `cursor/filled-card-system-1125` | `3a89691` | Fill every card with snow/cream. No empty tiles. |
| Connect / `shopify-theme` | `54934aa` | Fast-forwarded (same theme tree; Journal section file removed) |
| Connect source `v9` | this commit | Fast-forwarded; `valtora-theme/` matches `shopify-theme` `54934aa` |
| Feature / `cursor/lates-changes-29th-2577` | this commit | Same as `v9` after this checkpoint |

Shopify Connect should pull `v9` → `valtora-theme/` and/or `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` runs on the `v9` push and **skips** CLI `theme push` unless `SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, and `SHOPIFY_THEME_ID` are set.

This deploy did not use Shopify CLI. Live update depends on Connect picking up `v9` / `shopify-theme` `54934aa`.

Checkout was not modified. Legal name **Valtora FZE**.

Store: Numa Mattress (`7dbr1b-1q`). Theme id `204376113477`. Storefront is password-protected: https://7dbr1b-1q.myshopify.com/

## Included (on origin)

- **Filled cards** — `3a89691` / Connect `54934aa`: size picker, delivery, journal, size guide, manufacturing, and pair cards are 16px filled snow/cream. Dummy image wells and hollow grids removed.
- **Scroll unlock** — `8df457a` / `aa83f34`: `overflow-x: clip` + `overflow-y: auto !important` on html/body
- **Gold** — `ea695aa` / `01de629`: navy `#1F3A5F`, cream `#F7F5F1`, gold `#8A6D3B`
- **Radius** — `1c4d619`: 12px buttons, 16px cards
- **Journal off homepage** — homepage `index.json` has no `journal-home`; `sections/journal-home.liquid` removed on Connect. Journal stays at `/pages/journal`.

## What was left out

- GitHub Action cannot `theme push` until repo secrets exist. No secrets were invented.
- Shopify Admin pages (Journal, Manufacturing, About, landings) still need to exist if they 404.
