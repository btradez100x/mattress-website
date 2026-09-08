# 13.0.0 — dynamic-brand-text

**Date:** Tuesday 8 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `f802b9e` |
| `shopify-theme` | `0b1e5f3` |

Live update depends on Shopify Connect pulling `shopify-theme`. Connect can lag a minute or two.

## What shipped

Storefront copy that said Numa or Aligna as the store name now uses Theme settings → Brand name (`settings.brand_name`). A typed name wins. The setting is still the only place to change the name.

- About page body: built-by line, founder line, and the name-origin sentence
- Image alt text on specification, manufacturing, support, what it buys, guarantee / adjust-to-desire, and trade
- Preview titles (`· Numa` and `| Numa`) and page descriptions that named the store
- Preview hydration already used for `[Brand]`, wordmarks, and trading-as

## What was left out

- Notification and customer emails (already editable separately)
- Theme-editor labels such as “Show Numa-written review pack”
- Password 404, lifestyle WebPs, press, Checkout cream, footer lockup, trade reply token
- Product line, yarn name, and legal entity (not the storefront brand)

## Where the merchant sets it

Theme settings → Brand → Brand name (`brand_name`).
