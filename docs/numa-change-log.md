# Site change log

Execution brief. All items below are site changes.

Governing voice document is `numa-tone-of-voice.md`. Where this log and that file disagree, the file wins unless the item is listed in section 11 as a recorded change.

**The overriding rule: clarity is never traded for voice.** Both are achievable in the same line. If a sentence is on-voice but makes a first-time reader stop and work out what it means, it is not finished. Compression is the style, not the goal.

---

## 1. Theme settings

Five values move out of hardcoded copy into theme settings. Every surface reads from the setting, including policy pages, T&Cs, FAQ and transactional emails.

| Setting | Type | Value |
|---|---|---|
| `delivery_mode` | Select: `included` / `chargeable` | `included` |
| `delivery_charge` | Price | Rendered only when `delivery_mode = chargeable` |
| `trial_nights` | Number | 100 |
| `return_fee` | Price | £119 |

The 14 day no-charge window is hardcoded, not a setting.

**Acceptance test:** search the rendered site for hardcoded currency amounts and night counts relating to delivery or returns. There should be none.

---

## 2. Delivery charge states

Every surface referencing delivery cost renders from `delivery_mode`. No surface states a price when `included`.

| Surface | `included` | `chargeable` |
|---|---|---|
| Delivery page | Concierged. Room of your choice. | Concierged. Room of your choice. {{ delivery_charge }}. |
| Basket line | **Complimentary** | {{ delivery_charge }} |
| Checkout | Included | {{ delivery_charge }} |
| Delivery policy | Delivery is included with every mattress. | Delivery is {{ delivery_charge }}. |
| T&Cs, FAQ | Same, from the same setting | Same, from the same setting |

Never `£0.00`. Never `free delivery`. Never a qualifier such as "small delivery charge" or a sentence explaining the charge.

**Returns policy branch.** In the first 14 days outbound delivery is refunded. When `delivery_mode = chargeable` that refund includes `{{ delivery_charge }}`; when `included` there is nothing to refund and the clause must not render. The returns policy has to branch on the same setting.

No state of any surface mentions how many people deliver, the crew, the team, the drivers, or a count of anything. See section 6.

---

## 3. Returns

Copy:

> {{ trial_nights }} nights to return it. Collection and recycling, {{ return_fee }}.
> No charge in the first 14 days.

Placement: the fee lives in the returns policy, linked from checkout rather than only from the footer. The figure also appears in the trial-ending email. Do not place it on the product page.

---

## 4. Three periods, three distinct wordings

Separate things. They must never share phrasing.

| Period | Wording |
|---|---|
| First 14 days | No charge if you change your mind |
| `trial_nights` | {{ trial_nights }} nights to return it |
| The adjustment year | A year to get the feel right |

**Different units, deliberately.** The return window counts in nights, the adjustment year counts in years. Do not write the adjustment year as `365 nights` or as a `365 night comfort programme`. Two periods measured in the same unit is what makes customers unable to tell them apart, and this is the single most confusing thing on the current site.

Audit every page for reuse of the same phrasing across more than one of these, and for any surviving instance of `365 nights`.

---

## 5. Named services

Three services, always capitalised, named exactly as follows:

| Name | Rendering |
|---|---|
| **Concierge unpacking** | Complimentary |
| **Adjust to Desire** | Complimentary. Worth £299 |
| **Old mattress removal and recycling** | Complimentary |

`Adjust to Desire` is the correct name. Any instance of `Made to Desire` on the site is wrong and must be replaced.

**A service name never appears alone on first use.** `Concierge unpacking` and `Old mattress removal and recycling` describe themselves. `Adjust to Desire` does not, and means nothing to a first-time reader in isolation. Every first appearance on a page carries the benefit with it:

> **Adjust to Desire.** A year to get the feel right.

Expanded, where the page has room for it:

> **Adjust to Desire.** A year to get the feel right. Tell us how it should feel and we send the layer that takes you there, with our compliments. It stays with you.

The verb is adjust. Never `replacement`, never `warranty claim`, never `we will make you a new layer`.

Delivery itself is **included**. Everything above is **complimentary**.

The word `free` must not appear in any state of any setting.

Order attributes stay exactly as built:

| Attribute | Values |
|---|---|
| `Old mattress removal` | `3 of 3`, `2 of 3`, `None` |
| `Concierge unpacking` | `Yes`, `No - leave boxed in room of choice` |

---

## 6. Constraints on the delivery and removal lines

These rules bind any rewrite. They constrain wording; they do not protect the existing lines from being made clearer.

| Rule | Effect |
|---|---|
| Describe the service, not the staffing | No people, crew, team, drivers, or count of anyone. Delivery is described from the customer's side of the door |
| Removal is not a logistics story | No "for recycling" in hero or product copy. The recycling detail lives on its own page |
| Flip and swap are different actions | `Unzip. Turn over. Zip up.` changes firmness. `Unzip. Lift out. Swap in.` replaces a worn layer. Never blur them |

---

## 7. Copy replacements

| From | To |
|---|---|
| Concierged. Room of your choice. Unrolled onto your bed. The old one leaves with it. | Concierge unpacking. Room of your choice. Unrolled onto your bed. Your old mattress leaves with the packaging. |
| The part that softens renews for twenty five years | The part that softens is replaceable. The part that lasts, lasts. |
| Thirty five centimetres. Twenty of pocket springs, each one housed alone. | 35cm. 20cm of pocket springs, each one housed alone. Your side moves. Theirs stays still. |
| A core made to outlast the frame it sits on | The core is the spring unit. It carries the weight and holds the shape. Guaranteed for 25 years. |

Any instance of `built for` or `designed for`: replace with what the thing does.

Numbers render as figures everywhere. One rule, no exceptions by context.

Register does not change. Only lines that became confusing rather than stylish are replaced.

---

## 8. Five feels page

Replace the current section with the ladder.

> **Five feels. One bed.**
> Three layers. Two of them turn over.
> Yours arrives medium firm. Turn it over for medium.

Ladder rendered beneath, softest to firmest, with the delivered feel marked:

| Feel | Layer |
|---|---|
| Soft | Third layer, single sided |
| Medium | Included layer, reverse |
| **Medium firm** | Included layer, as delivered |
| Firm | Second layer |
| Extra firm | Second layer, reverse |

The five names must be editable from the theme rather than hardcoded.

---

## 9. Reviews

Add a click-through from the ratings summary to the full review set. The 4.77 from 500 figure must be verified before go-live.

---

## 10. Founder photo

Remove. The founder's note stays.

---

## 11. Recorded changes to the voice document

These override `numa-tone-of-voice.md` and will be folded into it.

| Was | Now |
|---|---|
| Prefer `included` where the thing is standard; reserve `complimentary` for a response to a situation | If we are not obliged to offer it, it is complimentary. Delivery is the only thing described as included |
| Concierge unpacking, included with every mattress | Concierge unpacking, complimentary |
| Firmness copy not to be written until samples tested | Five-feel ladder confirmed and publishable. Labels remain editable pending testing |
| Numbers written out in body copy, figures in specifications | Figures everywhere. One rule |
| Compression is the style | Clarity outranks compression. A line that is on-voice but has to be decoded is not finished |
| 365 night comfort programme | A year to get the feel right. The adjustment year is never counted in nights |
| Recycling kept off-page as logistics detail | Recycling may be stated where relevant. It stays out of the hero rhythm only because that line already carries three ideas |

`13-BRAND-VOICE.md` is not authoritative. Its sections 7 and 8 contain stale facts, including a row banning room-of-choice delivery that AIT contracts. Do not use it.

---

## 12. Values not yet set

None. All settings ship with a value.

Firmness labels remain theme-editable, but the five names are confirmed and are not blocked.
