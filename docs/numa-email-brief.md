# Numa - Email Programme Brief

One email is supplied built: `email-01-post-purchase.html`. It is the design reference for everything else. This document covers the full programme, the trigger logic, and the architecture.

**Read section 1 before choosing tooling.** The platform decision is the one that is expensive to reverse.

---

## 1. Architecture - build for a platform move

Shopify may not be permanent. That single fact should shape every technical decision here.

**Do not build flows in Shopify.** Shopify Email and Shopify-native automations are not portable. Templates, trigger logic, segments and send history all stay behind on migration, and rebuilding an email programme from scratch is weeks of work at exactly the moment everything else is also moving.

**The rule: Shopify is a source of events, never the owner of logic.**

```
Shopify (or any future platform)
   |
   |  webhooks: order/created, order/fulfilled, checkout/abandoned
   v
Thin event layer  ->  normalised event schema we control
   |
   v
ESP  ->  templates, flows, sends
```

The event layer is a small service that receives platform webhooks, normalises them into our own schema, and forwards to the ESP. Migration then means rewriting one adapter, not the programme.

**Normalised event names to standardise on now:**

`order_placed` · `order_in_production` · `delivery_booked` · `delivered` · `checkout_abandoned` · `basket_abandoned` · `browse_abandoned` · `trial_day_14` · `trial_ending` · `layer_requested` · `return_requested`

Every event carries: `customer_id`, `email`, `order_id`, `size`, `value`, `lead_time_weeks`, `trial_eligible`, `lp_variant`.

`lp_variant` must survive from landing page to email. It is how we find out which landing page produced customers who actually keep the mattress, and no other measurement gives us that.

**ESP recommendation.** Klaviyo is the category standard and works via API with any platform, so it is portable if flows are built on custom events rather than Shopify-native triggers. Customer.io is more portable still and better suited if the event layer is being built anyway. Either is fine. **What is not fine is Shopify-native flows or a Shopify-only app.**

Templates live in version control as HTML, not only in the ESP editor. The ESP is a sending engine, not a source of truth.

---

## 2. The programme

All sixteen emails are built in `/emails/`. Triggers below map each to its Shopify webhook or the custom event that replaces it.

### Trigger map

| Email | Trigger | Source | Delay |
|---|---|---|---|
| 01 Post-purchase | `orders/paid` | Shopify webhook | Immediate |
| 02 In production | `order_in_production` | **Custom** - ops marks order, or tag `in-production` | On event |
| 03 Delivery booked | `delivery_booked` | **Custom** - from AIT, or `fulfillments/create` | On event |
| 04 Day before | Scheduled from `delivery_date` | Derived | 24h before window |
| 05 Delivered | `delivered` | **Custom** - AIT POD, or `fulfillments/update` status delivered | +4 hours |
| 06 Settling in | Scheduled from `delivered` | Derived | +14 days |
| 07 Trial ending | Scheduled from `delivered` | Derived | +25 days. **Suppress if `trial_eligible` is false** |
| 08 Owner welcome | Scheduled from `delivered` | Derived | +35 days |
| 09 Basket 1 | `checkouts/create` with no matching order | Shopify webhook | +1 hour |
| 10 Basket 2 | Same, still no order | Shopify webhook | +24 hours |
| 11 Basket 3 | Same, still no order | Shopify webhook | +72 hours |
| 12 Browse abandon | 2+ product views, no basket | **Custom** - site pixel | +4 hours |
| 13 Layer requested | `layer_requested` | **Custom** - support action | On event |
| 14 Collection booked | `return_requested` + collection date set | **Custom** | On booking |
| 15 Refund processed | `refunds/create` | Shopify webhook | On event |
| 16 Layer reminder | Scheduled from `delivered` | Derived | +7 years |

**Five events are not available from Shopify** and must come from the ops layer or AIT: `order_in_production`, `delivery_booked`, `delivered`, `layer_requested`, `return_requested`. Build these as inbound webhook endpoints on the event layer from day one, even if they are triggered manually at first. Manually firing an event is fine. Hard-coding a Shopify-only alternative is not.

**Suppression rules**

- Any purchase suppresses the entire 09-11 abandonment sequence immediately
- Do not restart 09-11 for a repeat visit within 30 days
- 12 is suppressed if a basket is created
- 07 never sends to Emperor buyers - they have no return trial
- 14, 15 suppress 06, 07, 08 for that order
- 16 suppresses if the customer has already bought a replacement layer

### Merge fields used across the set

`[Brand]` Theme settings → Brand name (line 1), first word only. Same field as storefront `[Brand]`. Never product line.

`[ORDER_NO]` `[SIZE]` `[SIZE_DIMENSIONS]` `[PRICE]` `[TOTAL]` `[DEPTH]` `[LEAD_TIME]` `[CARTON_SIZE]`
`[DELIVERY_DATE]` `[DELIVERY_WINDOW]` `[ADDRESS_SHORT]` `[REMOVAL_STATUS]`
`[TRIAL_HEADING]` `[TRIAL_BODY]` `[TRIAL_END]`
`[LAYER_SPEC]` `[LAYER_LEAD_TIME]` `[LAYER_URL]`
`[COLLECTION_DATE]` `[COLLECTION_WINDOW]` `[REFUND_AMOUNT]` `[REFUND_METHOD]` `[REFUND_DAYS]`
`[RECYCLING_OUTCOME]` `[PURCHASE_YEAR]` `[CURRENT_PRICE]`
`[CHECKOUT_URL]` `[PRODUCT_URL]` `[ORDER_URL]` `[REVIEW_URL]` `[SUPPORT_EMAIL]`
`[COMPANY_ADDRESS]` `[PREFERENCES_URL]` `[UNSUBSCRIBE_URL]`

`[TRIAL_HEADING]` and `[TRIAL_BODY]` are conditional on `trial_eligible`. Emperor gets the comfort layer promise with the statutory rights line. Every other size gets the 30-day trial copy.

`[RECYCLING_OUTCOME]` stays empty until AIT confirms recovery figures in writing.

### The original programme table

### Transactional and lifecycle

| # | Email | Trigger | Purpose |
|---|---|---|---|
| 1 | **Post-purchase** | `order_placed` immediately | Built. Confirms, sets expectations, carries the green story |
| 2 | In production | `order_in_production` | Short. Reassurance that something is happening |
| 3 | Delivery booking | `delivery_booked` | Window confirmed, what to prepare, access questions |
| 4 | Day before delivery | 24h before slot | Access reminder, old mattress ready, parking |
| 5 | Delivered | `delivered` + 4 hours | How it expands, sleep on it tonight, what is normal |
| 6 | **Settling in** | `delivered` + 14 days | The important one. See below |
| 7 | Trial ending | `delivered` + 25 days | Only to trial-eligible sizes |
| 8 | Owner welcome | `delivered` + 35 days | Trial passed. Care, guarantee, referral |

### Recovery

| # | Email | Trigger | Notes |
|---|---|---|---|
| 9 | Basket abandonment 1 | 1 hour after `basket_abandoned` | No discount |
| 10 | Basket abandonment 2 | 24 hours | Address the objection, not the price |
| 11 | Basket abandonment 3 | 72 hours | Last one. Still no discount |
| 12 | Browse abandonment | 4 hours after 2+ product views, no basket | Softer, single product focus |

### Long horizon

| # | Email | Trigger | Notes |
|---|---|---|---|
| 13 | Comfort layer reminder | `delivered` + 7 years | £299 layer, not a new mattress. Highest-margin email we will ever send |
| 14 | Referral | After a positive review or NPS response | Never before |

---

## 3. Email 6, Settling in - the one that pays for the programme

Sent 14 days after delivery, before the 30-day trial expires.

A new mattress feels wrong for the first fortnight almost regardless of whether it is right. Most people do not know this. Left alone, a proportion decide they hate it and request a refund at day 25.

This email costs nothing and intercepts that.

**Content:**
- Normalise the adjustment period. Two weeks is when a body stops noticing a new mattress
- Ask one direct question: how does it feel
- Offer the complimentary comfort layer explicitly, by name, before they have to ask for it
- Make replying trivial

**Do not** ask for a review here. Asking for a review before the trial has passed produces reviews from people who have not decided yet.

The comfort layer swap costs about £115 against roughly £1,352 for a full return. If this email converts even a fifth of would-be returns into layer swaps, it pays for the entire email programme several times over.

---

## 4. Basket abandonment - no discounts

**Copy standard applies here as everywhere: the word "free" is never used.** See section 0 of the decision log. Complimentary, included, or with our compliments. Basket lines show "Complimentary", never £0.00.

**Never discount in an abandonment sequence.** At £3,199 a discount does two things: it trains customers to abandon, and it tells a premium buyer the price was arbitrary. Both are permanent damage for a one-off recovery.

Address the reason for hesitation instead. The most likely blockers, in order:

1. **Lead time.** They saw it at basket for the first time. Explain why made-to-order takes weeks and what they get for it
2. **No showroom.** They cannot lie on it. Lead with the 30-day trial and the complimentary comfort layer
3. **Price.** They are deciding whether it is worth it. Answer with construction and the replaceable layer, never with money off

**Sequence:**

**Email 9, one hour.** Short. Their size, their price, one line on concierge delivery being included. Return to basket.

**Email 10, twenty four hours.** The objection email. Lead time and the trial. This is where the complimentary comfort layer earns its place, because it directly answers "what if I choose wrong."

**Email 11, seventy two hours.** Final. Short, no pressure, no urgency countdown, no fake scarcity. A made-to-order product cannot credibly be running out.

Suppress the whole sequence if they purchase. Cap at three. Do not restart on a repeat visit within thirty days.

---

## 5. Design system

Follow `email-01-post-purchase.html` exactly.

| Token | Hex | Use |
|---|---|---|
| Snow | `#FBFAF8` | Email body background |
| Bone | `#EDE8E0` | Outer canvas, callout blocks |
| Bone 2 | `#E2DBD1` | Hairlines |
| Graphite | `#6E6A64` | Secondary text, labels |
| Carbon | `#171614` | Primary text, buttons |
| Carbon 2 | `#3A3733` | Body copy |
| Ember | `#B5461C` | The Line, timeline labels, links only |

**Type with fallbacks**, since Instrument Sans, Inter and Geist Mono will not render in Outlook:

- Headings: `'Instrument Sans', Helvetica, Arial, sans-serif`
- Body: `'Inter', Helvetica, Arial, sans-serif`
- Labels and figures: `'Geist Mono', Courier, monospace`

**The Line** appears once or twice per email as a section break: a 64px ember bar followed by a 1px bone rule, built as a two-cell table. Never as decoration.

**Technical requirements:**
- Table-based layout, 600px, all CSS inline
- Preheader text in a hidden div, always written, never left as body copy
- No background images, no web fonts as the only option, no `<div>` layout
- Single column on mobile, 24px side padding
- Every link has a real href before send. No `#`
- Test in Outlook 2016+, Gmail web and app, Apple Mail, iOS Mail

---

## 6. Rules

**Reply-to is a monitored human inbox**, not noreply. The post-purchase email says "reply to this email and it comes to us" and that must be true.

**One call to action per email.** Two competing buttons halve both.

**No countdown timers, no fake scarcity, no "only 3 left."** The product is made to order. Manufacturing urgency is a lie the customer can check.

**Trial copy differs by size.** Emperor gets the comfort layer promise and no return trial, with the statutory rights line. Every other size gets the 30-day trial copy. Merge tags `[TRIAL_HEADING]` and `[TRIAL_BODY]` in the template handle this - populate from `trial_eligible` on the event.

**No recycling percentages until AIT confirms them in writing.** The `[RECYCLING_DETAIL]` placeholder stays empty rather than being filled with an estimate.

**Green story is prominent post-purchase and nowhere earlier.** It does not appear in abandonment emails, in acquisition, or above the fold anywhere on site. Hierarchy is product, service, responsibility.

---

## 7. Merge fields in the built template

| Field | Source |
|---|---|
| `[SIZE]` | order line item |
| `[PRICE]` `[TOTAL]` | order |
| `[LEAD_TIME]` | fulfilment estimate in weeks |
| `[TRIAL_HEADING]` `[TRIAL_BODY]` | conditional on `trial_eligible` |
| `[RECYCLING_DETAIL]` | hold empty until AIT confirms |
| `[Brand]` | Theme settings `brand_name` (line 1, first word). Wordmark is that word in uppercase |
| `[HELP_URL]` `[PREFERENCES_URL]` `[UNSUBSCRIBE_URL]` `[COMPANY_ADDRESS]` | config |
| Order number in masthead | order |

---

## 8. Measurement

Every email tagged with `lp_variant` carried from the landing page.

Report per flow: delivery rate, open, click, and the one that matters - **downstream conversion or return rate**.

Specifically: does the settling-in email reduce return requests? Compare return rate for customers who opened and replied against those who did not. That is the number that justifies the programme, and it is not visible in open rates.
