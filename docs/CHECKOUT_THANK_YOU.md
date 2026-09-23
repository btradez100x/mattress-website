# Thank you after Shopify checkout

The branded page lives in the theme as `templates/page.order-confirmed.json` + `sections/main-order-confirmed.liquid`. Local preview already lands there (`preview/pages/order-confirmed.html`).

Shopify hosted checkout does **not** use that template. After Pay, the shopper stays on Shopify’s own Thank you URL (`/checkouts/…/thank-you`). Assigning a theme template does not change that.

## What you set where

| Piece | Where | What it does |
|---|---|---|
| Branded “Thank you” layout | Theme: create a page, handle `order-confirmed`, template **order-confirmed** | Journey stages, Track your order, last-order summary from the theme basket |
| Return from Shopify after pay | **Shopify Admin**, not the theme JSON | Sends the shopper to `/pages/order-confirmed` once payment succeeds |

There is no theme setting that intercepts hosted checkout. The destination page is a template; the redirect is a Checkout setting.

## Shopify Admin (do this once)

1. **Online Store → Pages → Add page**
   - Title: Order confirmed
   - Handle: `order-confirmed`
   - Theme template: `order-confirmed`
   - Visibility: visible (or hidden from sitemap; the URL must still resolve)

2. **Settings → Checkout → Order status page → Additional scripts**  
   Paste:

```liquid
{% if first_time_accessed %}
<script>
  window.location.replace('/pages/order-confirmed');
</script>
{% endif %}
```

`first_time_accessed` is true on the first Thank you view after payment, so revisiting order status does not bounce them again.

3. If Additional scripts is gone (Checkout Extensibility / Thank you page apps only):
   - **Settings → Checkout → Customize** (Checkout Editor) → Thank you
   - Add a custom pixel, or a Thank you / Order status app block, that redirects to `/pages/order-confirmed` on `checkout_completed`
   - Same destination URL; still not a theme template assignment

Until step 2 or 3 is live, Pay stays on Shopify’s Thank you page. The theme basket is only snapshotted and cleared once the shopper hits `/pages/order-confirmed` (or a legacy `thank_you` surface that loads `theme.js`).

## Preview vs live

- Preview checkout uses `data-confirmed-path` → `order-confirmed.html`. That path is already wired.
- Live Pay posts the cart and goes to `/checkout`. Return is the Admin snippet above.
