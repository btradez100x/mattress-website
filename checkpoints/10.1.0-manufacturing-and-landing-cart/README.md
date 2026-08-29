# 10.1.0 — manufacturing-and-landing-cart

**Date:** Saturday 29 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version). `VERSION` was already **10.1.0** from the review export in this same folder. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

Review export zip (same slug, not a second 10.1.0 folder): `Valtora-Shopify-Theme-10.1.0-manufacturing-and-landing-cart.zip` in Downloads and this folder.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `18ac3c8` | Ship manufacturing, landing cart add, and nav 404 fixes so the live theme can take them |
| Connect / `shopify-theme` | `bf05bd6` | Subtree of `valtora-theme/` at this deploy |

`18ac3c8` message: *Ship manufacturing, landing cart add, and nav 404 fixes so the live theme can take them.*

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two after the GitHub push.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Landing configure posts the selected variant to Shopify `/cart/add.js` (quantity included), then goes to cart. Preview HTML hosts skip that POST and keep the local basket.
- Quantity stepper (− / 1 / +) on the landing add bar, 1–20. Status line if the add fails.
- Size cards: white fill, stronger border. Selected state fills primary.
- `/manufacturing` is a full replacement. How the mattress is built: core, layer, made after you order, fifteen sizes. Founder origin story stays on About only. SEO defaults: title **How it is made**.
- Landing funnel **Size name grid** layout and `max_blocks` 16.
- Header **The mattress** goes to homepage `#reserve`, not `/products/the-mattress` (unpublished SKU 404). Assigned-menu links that still point at that product are rewritten.
- Journal prefers a real Page handle `journal`, then a real Blog handle `journal`, then `/pages/journal`. Empty blog drops no longer win.
- About copy names Numa. Legal entity remains **Valtora FZE**. Contact email remains `hello@aligna.com`.
- `VERSION` and Shopify `theme_version` are **10.1.0**.

## What was left out

- Shopify Admin pages. Theme deploy cannot create them. Live still 404s until these exist and use the matching templates: **journal**, **manufacturing**, **about**, **mattress-recycling**, plus landings `large-sizes`, `european-king`, `specification`, `what-it-buys`, `configure` if missing.
- Publishing the mattress SKU. Nav no longer sends people to `/products/the-mattress`. The product can stay unpublished. Landing add-to-basket still needs that product’s variants to match the size map.
- Optional redirects `/mattresses/large-sizes` → `/pages/large-sizes` (same pattern for the other landings).
- Product flags. Comfort layer / sheets / pillows remain off. Splitit and order-status lookup stay off.

Restore:
```bash
tar -xzf checkpoints/10.1.0-manufacturing-and-landing-cart/preview-and-theme.tar.gz
```
