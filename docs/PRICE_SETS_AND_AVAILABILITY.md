# Price sets (tiers) & size availability

## Price sets — for testing only (not shown to customers)

In **Size + price + reserve**:

1. Set **Active price set** to an ID (e.g. `control`, `test-a`).
2. Duplicate every size row for each set; set **Price set ID** to match.
3. Changing **Active price set** swaps **all** size prices for that market at once.

Example: `control` = AED 8,999 / 11,999 / 14,999 · `test-a` = AED 7,999 / 9,999 / 12,999.

Customers only see size + price. Cart line includes `Price set` for attribution.

## Out of stock / notify

On each size row, uncheck **Available to reserve**.

- Size shows “Not yet available”
- Panel switches from Reserve → **Notify me** (Shopify contact form with size + market)
- Notifications land in Shopify Admin → Inbox / customer messages

Default: Super King unavailable on both markets until you open allocation.
