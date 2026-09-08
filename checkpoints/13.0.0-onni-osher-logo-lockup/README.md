# 13.0.0 — onni-osher-logo-lockup

**Date:** Tuesday 8 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `231ae5e` | Onni & Osher live-text lockup |
| Connect / `shopify-theme` | `30b7177` | Subtree of `valtora-theme/` at this deploy |

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Hard-refresh: homepage, any page header/footer, password page.

In the theme editor: **Theme settings → Logo lockup**.

## What shipped (theme / code)

- Header: two-line live-text lockup (Onni & Osher / A sleep company.).
- Footer: three-line reverse lockup on the dark ground.
- Password page: centred lockup.
- Shared snippet `oo-logo.liquid` and CSS `oo-logo.css`.
- Theme settings panel for lockup, site vs V3 palettes, and symbol colour (none / stone / ember).
- Preview chrome matches. `[Brand]` copy, Trading as, and emails still read Brand name (Numa) until that setting changes.

## What was left out

- Outlined SVG/PNG files for email, checkout, and social (live text does not travel there). Upload those in Admin → Settings → Checkout and in email templates if needed.
- Brand name / product-line copy tokens still Numa.
- Trade-page copy WIP, collage / press / lifestyle working-tree edits.
- No VERSION bump. No MAJOR freeze.

## Rollback

**This deploy** — after Connect picks it up, use the SHAs in the table above.

**13.0.0 guarantee-page-and-basket** (before this lockup):

| Tree | SHA |
|---|---|
| `v9` | `2f20907` |
| `shopify-theme` | `c74771f` |
| Folder | `checkpoints/13.0.0-guarantee-page-and-basket/` |

Store: Numa Mattress (`7dbr1b-1q`).

Restore preview + theme snapshot:
```bash
tar -xzf checkpoints/13.0.0-onni-osher-logo-lockup/preview-and-theme.tar.gz
```
