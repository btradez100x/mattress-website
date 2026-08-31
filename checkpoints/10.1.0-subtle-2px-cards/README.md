# 10.1.0 — restore original 2px cards (picker + delivery)

**Date:** Monday 31 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | `preview/` + `valtora-theme/` at this restore |

Restore:
```bash
tar -xzf checkpoints/10.1.0-subtle-2px-cards/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `23c7f34` | Restore 2px cards + cream-on-navy delivery |
| Connect / `shopify-theme` | `873aa0c` | Same theme CSS (base, brand, manufacturing, css-variables) |
| Card source | `01de629` | Last good cards before radius bump `1c4d619` and filled-card `3a89691` |
| Original 2px restore | `2dc913c` | `--radius` / `--radius-control`: **2px** |

Checkout was not modified. Legal name **Valtora FZE**.

Store: Numa Mattress (`7dbr1b-1q`). Shopify Connect should pick up `shopify-theme` `873aa0c`. Connect can lag a minute or two.

## Included

- **Radius 2px** — original subtle curve from `2dc913c` / `01de629`. Not 12px buttons, not 16px cards.
- **Picker** — `.size-option` / `.size-row` one-card chrome from `01de629` (`border-radius: var(--radius-control, 2px)`, no `--shadow-card`).
- **Delivery** — cream type on solid navy (`d205fc5` / `01de629`). No nested filled cream tiles on the navy band.
- **Gold header** — wordmark `#8A6D3B` on cream.
- **Cream on navy body** — dark sections keep cream type; no gold paragraphs.
- **Scroll unlock** — `8df457a` html/body `overflow-y: auto !important` kept.
- **Journal off homepage** — no `journal-home` on `index.json`; Journal stays at `/pages/journal`.

## What was left out

- VERSION not bumped.
- Checkout templates not modified.
- GitHub Action cannot `theme push` until repo secrets exist.
