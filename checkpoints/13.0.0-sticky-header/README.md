# 13.0.0 — sticky-header

**Date:** Tuesday 8 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `5bb7b9d` | Live header sticks like the preview |
| Connect / `shopify-theme` | `cb5970c` | Subtree of `valtora-theme/` at this deploy |

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Hard-refresh the homepage and scroll. The announcement still scrolls away. The header stays.

## What shipped (theme / code)

- Shopify wraps the header in a section group only as tall as the bar, so `position: sticky` on `.site-header` had no room to stick. Preview has no wrapper.
- Outside the theme editor, that group is flattened and the header section sticks at the top of the page.

## What was left out

- Brand-name wiring still in the working tree (Trading as, Styled by, lockup from Brand name). Not in this deploy.
- No VERSION bump. No MAJOR freeze.

## Rollback

**13.0.0 onni-osher-logo-lockup** (before this sticky fix):

| Tree | SHA |
|---|---|
| `v9` | `231ae5e` |
| `shopify-theme` | `30b7177` |
| Folder | `checkpoints/13.0.0-onni-osher-logo-lockup/` |

Store: Numa Mattress (`7dbr1b-1q`).
