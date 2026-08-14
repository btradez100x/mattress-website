# Developer Instructions - Theme V9

Source: `dev-instructions-v7.md` (work order for V9, built from the V8 baseline).

Work through in order. Item 2 blocks launch.

---

## 1. Remove all manufacturing geography

**File:** `sections/manufacturing.liquid`

The section currently states **"Assembled in Turkey"** in eight places, including the heading `Curated materials. Assembled in Turkey.` and a dedicated `turkey_heading` / `turkey_body` block.

**Decision: remove every reference to where the mattress is made.** Country of manufacture will not appear anywhere on the site.

### Why this matters practically
Mattresses carry a permanent care and composition label stating country of manufacture, and import documents will match it. Any mismatch between that label and the website is discovered by the customer on day one, on a GBP 2,999 purchase. Removing the claim entirely removes the exposure.

### What to do
1. Delete `turkey_heading` and `turkey_body` settings and their rendered output.
2. Change the section heading default from `Curated materials. Assembled in Turkey.` to `Curated materials. Made by hand.`
3. Remove every other instance of Turkey across the file, including any in `lede`, `story`, `source_body` and the gallery captions. Grep for `urkey` to catch case variants.
4. Replace with the permitted origin statement below.

### Permitted origin statement
Only this is approved. It may appear in the manufacturing section and the footer:

> **Designed in Dubai**

Nothing else. No country of manufacture, no assembly location, no "made in", no flags, no maps.

### Rewrite the section around craft, not geography
The remaining narrative - the founder's reasoning, the sourcing choices, the handmade assembly, the replaceable top - is the part that was doing the selling. Keep all of it. Suggested replacement for `source_heading` and `source_body` framing:

- **Sourced with intent** - components chosen for performance and longevity, not for cost
- **Made by hand** - each mattress assembled individually, which is why the comfort top can be opened and replaced
- **Designed in Dubai** - the specification, the layer stack and the swap system

## 2. BLOCKER - Remove white-glove from the trust bar

**File:** `sections/trust-bar.liquid`, preset blocks

Two problems in the current presets:

```json
{ "icon": "delivery",
  "label": "White-glove delivery & setup · UAE only",
  "sublabel": "We bring it in and set it up",
  "market_visibility": "ae" }
```
White-glove is **not contracted in either market**. Delete this block entirely.

```json
{ "icon": "chemicals",
  "label": "Free from harmful chemicals",
  "sublabel": "OEKO-TEX® STANDARD 100" }
```
OEKO-TEX certification is **unverified**. Either produce the certificate number, or delete this block. An unearned certification claim is the same category of risk as the origin claim.

**Replace both with one new block:**
```json
{ "icon": "craft",
  "label": "Handmade to order",
  "sublabel": "Built after you order it, never from stock" }
```

---

## 3. Replace the price anchor - both markets

**File:** `sections/offer.liquid`

Four locations: lines 10, 13 (liquid defaults) and 127, 133 (schema defaults). Update all four so the fallback and the schema match.

### GB - replace
> `Premium hybrid mattresses from established UK brands typically run £1,399 to £2,399. Ours is made to order, and the comfort top is replaceable.`

### GB - with
> `Handmade pocket-sprung mattresses in the UK run from around £2,000 to over £50,000. Ours is £2,999, made to order, with a comfort top you can replace rather than replacing the mattress.`

### AE - replace
> `Premium mattresses in the UAE typically run AED 6,000 to AED 15,000. Ours is made to order, and the comfort top is replaceable.`

### AE - with
> `Handmade pocket-sprung mattresses run from around AED 9,000 to well over AED 200,000. Ours is AED [PRICE], made to order, with a comfort top you can replace rather than replacing the mattress.`

**Rules:** never name a competitor. Never imply equivalent materials - the anchor is about construction method and category only. Add a code comment noting the figures were verified August 2026 and should be reviewed annually.

---

## 4. Add the cost-of-ownership argument

**File:** `sections/swap-explainer.liquid`

New setting, rendered after the existing body copy:

```json
{
  "type": "richtext",
  "id": "ownership_cost",
  "label": "Cost of ownership",
  "default": "<p>A comfort top costs around £250. A new mattress does not. Refresh the layer at year five and year ten and you have spent less than replacing a cheaper bed twice - and thrown away far less.</p>"
}
```

Market-aware: AED variant uses `AED 1,200`. Follow the existing `market` conditional pattern in `offer.liquid` lines 5 to 15.

This is the strongest financial argument for the product and it currently appears nowhere.

---

## 5. Add handmade in four places

### 5.1 `sections/hero.liquid` - subheading default
Replace with:
> `A 37cm handmade hybrid, built after you order it. Seven-zone pocket springs, a breathable knitted cover, and a comfort top you replace instead of replacing the mattress.`

### 5.2 `sections/trust-bar.liquid`
Covered in item 2 above.

### 5.3 `sections/swap-explainer.liquid` - new setting
```json
{
  "type": "richtext",
  "id": "handmade_link",
  "label": "Handmade connection",
  "default": "<p>A machine-pressed mattress is sealed for life. Ours is hand-assembled, which is why the comfort top can be unzipped, lifted out and replaced.</p>"
}
```
Render before `ownership_cost`.

### 5.4 `sections/product-specs.liquid` - new spec row
| Label | Value |
|---|---|
| Assembly | Hand-assembled, made to order |

---

## 6. Add the variation notice - three placements

Handmade goods vary in fabric shade. Disclosure must be **pre-purchase** - a product that visibly differs from what was shown can be rejected unless the variation was disclosed before the order.

### 6.1 `sections/size-reserve.liquid` - Stage B order terms
Add as a new line in the existing terms list:
> `Handmade, so natural variation in fabric shade is possible. The construction is identical every time.`

Make it a schema setting `variation_notice` so it is editable.

### 6.2 `sections/faq.liquid` - new entry
**Q:** `Will my mattress look exactly like the photographs?`

**A:**
> Close, but not identical. Every mattress is hand-assembled and fabrics are sourced in batches, so the shade of the cover or the side panel can vary very slightly between runs. It is the same difference you would see between two lengths of the same cloth.
>
> What never varies is what is inside it. The spring unit, the comfort layers, the depth, the firmness and the construction are identical in every mattress we make, to the same specification.
>
> If yours arrives and you are not happy with it for any reason, including how it looks, you have 100 nights to tell us and we will collect it and refund you in full.

### 6.3 Order confirmation email
Add one line:
> `A note on craft: your mattress is hand-assembled, so the fabric shade may vary very slightly from the photographs. What is inside it does not vary at all.`

### Scope - important
The notice covers **fabric shade only**. Do not write it broadly enough to appear to disclaim construction, dimensions, firmness or specification. Doing so would be untrue and would undermine the guarantee that makes the disclosure acceptable.

---

## 7. Reorder the homepage

**File:** `templates/index.json`

### Current
```
1 hero            7 cool-touch      13 ugc-social
2 trust-bar       8 product-specs   14 founder-note
3 big-idea        9 benefits        15 offer
4 swap-explainer  10 measure-size   16 size-reserve
5 size-reserve    11 social-proof   17 faq
6 swap-process    12 press-logos    18 lifestyle-collage
```

### Required
```
1 hero            7 cool-touch      13 press-logos (+ awards merged)
2 trust-bar       8 product-specs   14 offer
3 big-idea        9 measure-size    15 size-reserve
4 swap-explainer  10 manufacturing  16 faq
5 size-reserve    11 founder-note   17 lifestyle-collage
6 swap-process    12 social-proof
```

### Changes
| Action | Section | Reason |
|---|---|---|
| **ADD** | `manufacturing` at 10 | Built and populated but never inserted. Contains the founder story, sourcing narrative and craft gallery - the material that justifies the price. Belongs immediately after someone has seen the price |
| **MOVE UP** | `founder-note` 14 to 11 | Strongest trust asset for an unknown brand. Should introduce the proof, not follow it |
| **REMOVE** | `benefits` | Duplicates arguments already made by big-idea, swap-explainer, swap-process, cool-touch and product-specs. Either delete or repurpose as a comparison against a sealed mattress |
| **SUPPRESS** | `ugc-social` | Empty at launch. An empty section is worse than no section. Reinstate when populated |
| **MERGE** | `press-logos` + `awards` | Single credibility strip. Three stacked proof sections dilute rather than reinforce |

`size-reserve` remains at two positions. Confirm unique instance IDs and that `view_price` fires once per session regardless of which is seen first.

---

## 8. State the firmness - there is no firmness selector

**Correction to earlier documentation.** Previous specs described firmness as a variant dimension selectable at purchase. **That is wrong.** There is one mattress, built to one firmness. Alternative firmnesses are a future add-on delivered through replacement comfort tops, and that product is not operationally confirmed.

### What must NOT be built
- No firmness selector anywhere in the purchase flow
- No firmness variant dimension on the mattress product
- No copy implying a choice of feel at purchase
- No comfort top upsell, and no statement that tops are available separately

### What must be built instead
Someone spending GBP 2,999 without lying on it needs to know what they are buying. A single stated firmness is more important than a selector, not less.

Add to `sections/product-specs.liquid` as a spec row, and to `sections/size-reserve.liquid` Stage A beneath the dimensions:

| Label | Value |
|---|---|
| Feel | [Medium-firm] - suits most sleepers |

Replace the bracketed value with the actual firmness of the mattress being made. Make it a theme setting `firmness_label` and `firmness_note` so it can be changed without a developer.

### Optional, and worth it
A short line in the FAQ explaining the feel in plain terms reduces both hesitation and firmness-related returns:

> **What does it feel like?**
> Medium-firm. Supportive enough for back and front sleepers, with enough give at the shoulder and hip for side sleepers. If you are used to a very soft mattress it will feel firmer for the first week or so while your body adjusts.

Adjust the wording to match the actual specification.

## 9. Acceptance criteria

1. Every reference to country of manufacture removed from `manufacturing.liquid` and the whole theme. Grep for `urkey`, `hina`, `made in`, `assembled in` returns nothing.
2. White-glove block removed from trust-bar presets.
3. OEKO-TEX block removed, or certificate number supplied and displayed.
4. `Handmade to order` block present in trust bar.
5. Both anchor lines replaced in all four locations in `offer.liquid`, with a review-date comment.
6. Cost-of-ownership copy renders in `swap-explainer`, market-aware.
7. Handmade appears in hero subheading, trust bar, swap-explainer and product-specs.
8. Variation notice appears in Stage B terms, FAQ and confirmation email, scoped to fabric shade only.
9. `index.json` matches the required order; `manufacturing` renders; `founder-note` at 11.
10. `benefits` removed or repurposed; `ugc-social` suppressed; `press-logos` and `awards` merged.
11. A single firmness is stated in product-specs and Stage A. No firmness selector exists anywhere. No comfort top is offered for sale.
12. `Designed in Dubai` is the only geographic statement on the site.
13. No section renders empty. No unearned claim anywhere - no white-glove, no unverified certification, no unsubstantiated cooling figure, no heritage implication, no country of manufacture.
