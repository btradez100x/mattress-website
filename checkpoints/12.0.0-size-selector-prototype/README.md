# 12.0.0 — size-selector-prototype

**Date:** Friday 4 Sep 2026  
Kept milestone. MAJOR bump from **11.1.0** (`cta-spec`) → **12.0.0** (`size-selector-prototype`). `VERSION` and Shopify `theme_version` match.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `05a32d7` | Size-selector prototype freeze |
| Connect / `shopify-theme` | `368cc5f` | Subtree of `valtora-theme/` at this deploy |

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Hard-refresh: `/pages/configure` and the homepage `#reserve` section.

## What shipped (theme / code)

- SizeType tabs still use the count rule (not `if market == UAE`). **Home market first** from `detectMarket()` / Shopify `localization.country`, not funnel `data-market`.
- Sticky **Your order** panel on desktop (`min-width: 981px`).
- At **980px and below**: panel sits under the list; carbon bar with count + total + **View** + **Checkout** once there are lines. View opens a sheet with the same order HTML.
- Panel CTA: **Add to basket** / **Add N mattresses to basket**. Bar and sheet stay **Checkout**.
- Concierge unpacking Included. Old mattress removal Complimentary. Returns from `settings.returns_days`.
- Row quantity: carbon Add, then 38px hairline stepper, cap 20.

## What was left out

- Availability Notify-me states from `numa-size-selector-states.html`
- Cart `/cart` untouched (New mods v2 contract)
- Trade-page copy WIP, collage/press/password working-tree edits
- Theme zip in Downloads (disk was too tight; use this folder’s `preview-and-theme.tar.gz`)

## Rollback (before this size-selector prototype)

To go back to SizeType tabs / rows **without** the 980px bar, Add N mattresses, or View sheet:

| Tree | SHA |
|---|---|
| `v9` | `e1bdf81` |
| `shopify-theme` | `c29e527` |
| Folder | `checkpoints/11.1.0-size-selector-rows/` |

Store: Numa Mattress (`7dbr1b-1q`).
