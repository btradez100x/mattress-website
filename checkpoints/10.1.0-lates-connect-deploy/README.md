# 10.1.0 — lates Connect deploy (scroll, gold, radius, journal-off-home)

**Date:** Sunday 30 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Committed `preview/` + `valtora-theme/` at `587a31d` (theme tree = `8df457a`) |

Restore:
```bash
tar -xzf checkpoints/10.1.0-lates-connect-deploy/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `587a31d` | Export on top of full-page scroll unlock |
| Theme content | `8df457a` | Unlock page scroll on html/body for every breakpoint |
| Connect source `v9` | `587a31d` | Fast-forwarded `acbccda` → `587a31d` (folder `valtora-theme/`) |
| Connect / `shopify-theme` | `aa83f34` | Already at the `8df457a` theme plus Journal removed from homepage; not force-pushed |

Shopify Connect should pull `v9` → `valtora-theme/` and/or `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` runs on the `v9` push and **skips** CLI `theme push` unless `SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, and `SHOPIFY_THEME_ID` are set.

This deploy did not use Shopify CLI. Live update depends on Connect picking up `v9` `587a31d` / `shopify-theme` `aa83f34`.

Checkout was not modified. Legal name **Valtora FZE**.

Store: Numa Mattress (`7dbr1b-1q`). Theme id `204376113477`. Storefront is password-protected: https://7dbr1b-1q.myshopify.com/

## Included (on origin)

- **Scroll unlock** — `8df457a` / Connect `aa83f34`: `overflow-x: clip` + `overflow-y: auto !important` on html/body; `#reserve` no longer traps the wheel
- **Gold** — `ea695aa` / `01de629`: navy `#1F3A5F`, cream `#F7F5F1`, gold `#8A6D3B` last-wins on wordmark and kickers
- **Radius** — `1c4d619`: 12px buttons, 16px cards (not 2px)
- **Journal off homepage** — homepage `index.json` order has no `journal-home`. Connect `shopify-theme` also deleted `sections/journal-home.liquid` (`401780e`). Journal stays at `/pages/journal`.

## What was left out

- **Filled-card / no empty cards is not in this drop.** No filled-card commit was on `origin/cursor/lates-changes-29th-2577` after fetch. Latest origin was `587a31d` (export only; theme tree unchanged from `8df457a`).
- Uncommitted filled-card WIP on `cursor/filled-card-system-1125` was **not** shipped.
- GitHub Action cannot `theme push` until repo secrets exist. No secrets were invented.
