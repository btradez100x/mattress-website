# Numa — Build Spec

Everything needed to build. Nothing else.

---

## 1. Copy rules

These affect every string on the site. Full detail in `numa-tone-of-voice.md`.

- **Never the word "free."** Complimentary, or included. A basket line reads **Complimentary**, never £0.00
- **Never mention competitors or the category.** No "unlike", no comparison tables
- **Never describe staffing.** "Concierged. Room of your choice." Not "two people bring it"
- Sentence case everywhere, including buttons
- No exclamation marks, no emoji, no countdown timers, no scarcity
- Three named services, always capitalised: **Concierge unpacking**, **Made to Desire**, **Old mattress removal and recycling**

---

## 2. Pages

| File | Route | Notes |
|---|---|---|
| `a-large-sizes.html` | `/mattresses/large-sizes` | |
| `b-european-king.html` | `/mattresses/european-king` | |
| `c-best-mattress.html` | `/mattresses/specification` | |
| `d-what-it-buys.html` | `/what-it-buys` | |
| `e-mattress-recycling.html` | `/mattress-recycling` | Linked from basket. Mandatory link |
| `f-about.html` | `/about` | Footer and main nav. Never linked from a product hero |
| `g-manufacturing.html` | `/manufacturing` | Replaces the existing page entirely |

All seven share one `:root` block. Change tokens in one place.

**`/manufacturing` is a full replacement, not an edit.** The existing page carries an older origin story about travel and hotel beds, which now contradicts `/about`. It also opens with "An ethos, not a catalogue find", which defines the brand by what it is not.

Division of labour between the two pages, and it should not blur again:

- `/about` — why the company exists. First person, signed, the founder story
- `/manufacturing` — how the mattress is built. Core, layer, made to order, the size range

Neither page carries the other's content.

---

## 3. Sizes and prices

Every size below is producible. Depth is **35cm** on all of them.

### UK

| Size | Dimensions | Price |
|---|---|---|
| Single | 90 × 190cm | £1,999 |
| Small Double | 120 × 190cm | £2,249 |
| Double | 135 × 190cm | £2,499 |
| King | 150 × 200cm | £2,999 |
| European King | 160 × 200cm | £3,199 |
| Super King | 180 × 200cm | £3,299 |
| Emperor | 200 × 200cm | £3,699 |

### US

Serving the sizes that are hard to buy well. This is a positioning line as much as a product list — Twin XL, Full, California King and Split King are awkward sizes and we make all of them.

| Size | Dimensions | Price |
|---|---|---|
| Twin | 99 × 191cm | £1,999 |
| Twin XL | 91 × 213cm | £2,049 |
| Full | 137 × 191cm | £2,499 |
| Queen | 152 × 203cm | £2,999 |
| King | 193 × 203cm | £3,399 |
| California King | 183 × 213cm | £3,399 |
| Split King (pair) | 2 × 106 × 213cm | £3,699 |

### Other

| Size | Dimensions | Price |
|---|---|---|
| AU/NZ Super King | 203 × 203cm | £3,499 |

**USD pricing is a separate decision.** Build the size selector to read prices from config, not hardcoded, so a currency switch is a data change.

**Market gating.** UK sizes show by default. US sizes show on US geo or via an explicit market switch. Do not show all fourteen at once — the selector becomes a wall.

---

## 4. Size selector

Inline on every landing page, in a `#configure` section.

- Size only. **There is no firmness step, anywhere in the funnel**
- Price updates on selection
- `?size=` parameter pre-selects and stays changeable
- Selecting Emperor swaps the policy line beneath the selector to the Emperor variant

Policy line under the selector:

> Comfort layer included · 30-day comfort promise · Concierge unpacking included

Emperor variant:

> Comfort layer included · Made to order · Concierge unpacking included · Not covered by the 30-day return trial

---

## 5. Basket

Order of the page:

1. Mattress, size, price
2. **Old mattress removal and recycling — Complimentary**, with a link to `/mattress-recycling`. The link is mandatory
3. Concierge unpacking, listed as included
4. **Delivery lead time**, first appearance in the funnel
5. Trial terms for the selected size
6. Finance option
7. Checkout

Basket line:

```
Old mattress removal and recycling          Complimentary
We carry the cost. Read what happens to it →
```

Lead time position must not change during the paid test. Drop-off between `basket_view` and `begin_checkout` is the measurement.

---

## 6. Trial policy — affects conditional copy

| Sizes | Policy |
|---|---|
| All except Emperor | Made to Desire first. 30-day sleep trial if that does not settle it |
| **Emperor 200 × 200cm** | Made to Desire. **No 30-day return trial** |

Standard copy:

> **30-day sleep trial.** If the feel is not right, we will make you a new comfort layer to your preference, with our compliments. Worth £299. If that still does not settle it, we collect the mattress and refund you in full.

Emperor copy:

> **Emperor comfort promise.** If the feel is not right, we will make you a new comfort layer to your preference, with our compliments. Worth £299.
>
> Emperor is made to order at 200 × 200cm and is not covered by the 30-day return trial. Your statutory cancellation rights are unaffected.

The statutory rights sentence is not optional and must not be edited.

---

## 7. Banner

Sitewide, above navigation. Dismissible per session, not permanently.

> Concierge unpacking **included with every mattress** · To the room of your choice, packaging taken away

Ember highlight on the bold clause only.

---

## 8. Analytics

Every event carries `lp_variant`, persisted in `sessionStorage` from first landing.

| Event | Fires when | Parameters |
|---|---|---|
| `lp_view` | Landing page loads | `lp_variant`, `keyword`, `gclid` |
| `configure_start` | Size selector in view | `lp_variant`, `size_preselected` |
| `configure_complete` | Size chosen | `lp_variant`, `size` |
| `add_to_basket` | Added | `lp_variant`, `size`, `value`, `trial_eligible` |
| `add_service` | Service added or removed | `lp_variant`, `service`, `value` |
| `basket_view` | Basket loads, lead time visible | `lp_variant`, `value`, `lead_time_weeks` |
| `begin_checkout` | Checkout starts | `lp_variant`, `value` |
| `purchase` | Order confirmed | `lp_variant`, `size`, `value`, `transaction_id` |

Also: scroll depth at 25/50/75/100, and bounce defined as under 10 seconds with no scroll.

**`add_to_basket` is the primary metric.** Purchase is too rare to make decisions on at test budgets.

---

## 9. Email

Sixteen templates in `/emails/`. Triggers, merge fields and suppression rules in `numa-email-brief.md`.

**Shopify is an event source, never the owner of logic.** Do not build flows in Shopify — they are not portable.

Five events do not exist natively and need inbound webhook endpoints from day one:
`order_in_production` · `delivery_booked` · `delivered` · `layer_requested` · `return_requested`

Templates live in version control, not only in the ESP editor.

---

## 10. Do not change during the paid test

Two weeks, four landing pages. Any of these invalidates the comparison:

- Page copy, layout or price
- Lead time wording or position
- Size selector behaviour
- CTA destinations
- Returns policy wording on any size

If something is broken, fix it and log the timestamp so the affected period can be excluded.
