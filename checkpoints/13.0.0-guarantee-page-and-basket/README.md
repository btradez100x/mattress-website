# 13.0.0 — guarantee-page-and-basket

**Date:** Friday 4 Sep 2026  
Kept milestone. MAJOR bump from **12.0.0** (`size-selector-prototype`) → **13.0.0** (`guarantee-page-and-basket`). `VERSION` and Shopify `theme_version` match.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | *(filled after commit)* | This freeze |
| Connect / `shopify-theme` | *(filled after deploy)* | Subtree of `valtora-theme/` at this deploy |

Cart-href already on origin before this freeze: `v9` `815dd8d`, `shopify-theme` `9315e8a`. Folded in; not re-pushed as its own deploy.

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Hard-refresh: `/pages/guarantee`, `/cart`, `/pages/configure`, homepage `#reserve`.

**Admin:** create (or assign) a Shopify page with handle `guarantee` and template `page.guarantee`. Optional alias handle `adjust-to-desire` uses the same template.

## What shipped (theme / code)

- Add to basket still goes straight to `/cart`. `/pages/checkout` remains a bookmark redirect. Pay still opens Shopify checkout.
- Size-policy strip and landing policy lines: **Complimentary comfort guarantee for 365 nights** (was Adjusted to Desire for a year). Policy phrase links to `/pages/guarantee`.
- Size selector Your order + View sheet: include row **Complimentary comfort guarantee for 365 nights** | **Included**. Same pattern as Concierge unpacking. Not a priced SKU. JS does not add a second row if one is already there.
- Cart `/cart` terms `data-layer-term` renamed to the same guarantee line.
- Concierge unpacking note: **Your mattresses will be unpacked in the room of your choice** (shows when included). Cart attribute off-value is `No`.
- Guarantee landing from the HTML prototype (not the spec route). Preview `pages/guarantee.html` + theme `page.guarantee.json` / redesign `page_key: guarantee`. Footer Help: Comfort guarantee. Trust bar and “How it works” point here. Tracking: `guarantee_view`, `guarantee_scroll_complete`, `guarantee_cta_click`.

## What was left out

- Trade-page copy WIP, collage / press / password working-tree edits
- Availability Notify-me states from the size-selector prototype
- Size-selector redesign from the superseded basket zip
- Theme zip in Downloads (disk is tight). `preview-and-theme.tar.gz` may be local only; do not assume it is in git.

## Rollback

**This freeze (13.0.0)** — after deploy, use the SHAs in the table above.

**12.0.0 size-selector-prototype** (before this guarantee/unbox freeze, after size selector):

| Tree | SHA |
|---|---|
| `v9` | `05a32d7` |
| `shopify-theme` | `368cc5f` |
| Folder | `checkpoints/12.0.0-size-selector-prototype/` |

Cart-href-only (12.0.0 still, no guarantee page): `v9` `815dd8d` / `shopify-theme` `9315e8a`.

**Before the size-selector prototype:**

| Tree | SHA |
|---|---|
| `v9` | `e1bdf81` |
| `shopify-theme` | `c29e527` |
| Folder | `checkpoints/11.1.0-size-selector-rows/` |

Store: Numa Mattress (`7dbr1b-1q`).
