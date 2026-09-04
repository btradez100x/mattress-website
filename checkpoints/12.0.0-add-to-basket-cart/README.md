# 12.0.0 — add-to-basket-cart

**Date:** Friday 4 Sep 2026  
Named deploy checkpoint. `VERSION` stays **12.0.0** (`size-selector-prototype`). MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `815dd8d` | Add to basket goes to `/cart` |
| Connect / `shopify-theme` | `9315e8a` | Subtree of `valtora-theme/` at this deploy |

Live update depends on **Shopify Connect** pulling `shopify-theme`. Connect can lag a minute or two.

Hard-refresh: `/pages/configure` and the homepage `#reserve` section.

## What shipped

- Add to basket (and the size-selector bar Checkout) go straight to `/cart`
- Liquid treats leftover `continue_path` values of `/pages/checkout` as `/cart`
- Homepage, landing, product, and configure JSON set `continue_path` to `/cart`
- JS `canonicalBasketUrl` rewrites `/pages/checkout` and `checkout.html` so old hrefs cannot bounce

## What was left out

- Cart `/cart` page itself unchanged
- `/pages/checkout` still exists as a bookmark redirect to `/cart`
- Trade / collage / password working-tree WIP
- Theme zip in Downloads (disk)

Store: Numa Mattress (`7dbr1b-1q`).
