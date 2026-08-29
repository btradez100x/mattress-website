# Emails

Sixteen lifecycle templates. Shopify is an event source, never the owner of logic. Do not build flows in Shopify Email.

Source of truth: this folder. Full triggers, merge fields and suppression: `docs/numa-email-brief.md`.

**Brand.** Short name and wordmark come from Theme settings → Brand name (line 1) only. Same field as `[Brand]` on the storefront. Product line is not used. If the setting is two words, emails that originally said Numa take the first word. Re-bake after a name change: `python3 scripts/bake-email-brand.py`.

| File | Trigger | Delay |
|---|---|---|
| `01-post-purchase.html` | `orders/paid` | Immediate |
| `02-in-production.html` | `order_in_production` (custom) | On event |
| `03-delivery-booked.html` | `delivery_booked` (custom) | On event |
| `04-day-before.html` | From `delivery_date` | 24h before |
| `05-delivered.html` | `delivered` | +4 hours |
| `06-settling-in.html` | From `delivered` | +14 days |
| `07-trial-ending.html` | From `delivered` | +25 days. Suppress if not trial eligible |
| `08-owner-welcome.html` | From `delivered` | +35 days |
| `09-basket-1.html` | Checkout with no order | +1 hour |
| `10-basket-2.html` | Same | +24 hours |
| `11-basket-3.html` | Same | +72 hours |
| `12-browse-abandon.html` | 2+ product views, no basket | +4 hours |
| `13-layer-requested.html` | `layer_requested` (custom) | On event |
| `14-return-booked.html` | `return_requested` + collection date | On booking |
| `15-refund-processed.html` | `refunds/create` | On event |
| `16-layer-reminder.html` | From `delivered` | +7 years |

Five events need inbound webhooks from day one: `order_in_production`, `delivery_booked`, `delivered`, `layer_requested`, `return_requested`.

Preview copies live at `preview/emails/`.
