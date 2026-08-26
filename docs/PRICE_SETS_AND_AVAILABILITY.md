# Prices, sizes and availability

Prices live in Shopify. The theme does not store a second price list. Adding a size (including Emperor) is a Shopify action: create a variant, set metafields, set the price.

---

## What the theme reads

In **Online Store → Themes → Customize**, open either **Size + price + reserve** section. Assign **Mattress product**. Variants on that product become the size list.

| Field on the site | Where you set it |
|---|---|
| Price | Variant price |
| Size name | Variant title (`Single`, `King`, `Emperor`, …) |
| Dimensions | Metafield `custom.dims` (e.g. `200 × 200 cm`) |
| Market | Metafield `custom.market` (`ae`, `gb`, or `eu`) |
| In stock / notify | Variant availability (inventory) |
| Sort order | Variant position (drag in the product editor) |
| Most popular | Optional metafield `custom.popular` = true |
| Size ID used in tracking | SKU, then option 1, then title. Use SKUs: `single`, `double`, `queen`, `king`, `super-king`, `emperor`, `european-king` |

A GB variant never appears in the UAE or Europe list, and the reverse, because the loop filters on `custom.market`.

---

## Admin setup (do this once)

### 1. Create the metafield definitions

Shopify Admin → **Settings → Custom data → Variants** → Add definition, or run the mutations in `apps/order-status-worker/shopify/metafield-definitions.graphql` in GraphiQL (one at a time):

- `custom.market` — single line text. Value `ae`, `gb`, or `eu`.
- `custom.dims` — single line text. Display string such as `180 × 200 cm`.
- `custom.popular` — boolean. Optional. True on the size you want marked Most popular (GB King / UAE Queen in the current preview).
- `custom.enabled` — boolean. False withdraws the size from the list. Blank or true shows it.

You only create the definitions once per shop.

### 2. Create the mattress product

**Products → Add product.**

- Title: your mattress name.
- Product type: `mattress` (lead time resolver keys off this if variant/product metafields are blank).
- Status: Active (or Draft until you are ready).

You need **one variant per size per market**. That is eight UAE/UK sizes today, plus Emperor on GB, plus European King on EU:

**UAE (`custom.market` = `ae`)**

| Title | SKU | `custom.dims` | Notes |
|---|---|---|---|
| Single | `single` | `90-100 × 200 cm` | |
| Queen | `queen` | `160 × 200 cm` | Set `custom.popular` true |
| King | `king` | `180 × 200 cm` | |
| Super King | `super-king` | `200 × 200 cm` | Same footprint as UK Emperor |

**UK (`custom.market` = `gb`)**

| Title | SKU | `custom.dims` | Launch price to set |
|---|---|---|---|
| Single | `single` | `90 × 190 cm` | £1,999 |
| Double | `double` | `135 × 190 cm` | £2,499 |
| King | `king` | `150 × 200 cm` | £2,999 |
| Super King | `super-king` | `180 × 200 cm` | £3,299 |
| Emperor | `emperor` | `200 × 200 cm` | Set in Shopify. Preview uses £3,599 as a stand-in until you confirm. |

**Europe (`custom.market` = `eu`)** — EU, EEA, Switzerland, and nearby European countries including Albania (AL). Not the UK.

| Title | SKU | `custom.dims` | Notes |
|---|---|---|---|
| European King | `european-king` | `160 × 200 cm` | Different from UK King `150 × 200 cm`. Set the price in Shopify. Preview lists the size with no stand-in figure. |

If the product uses a Size option, option 1 should match the title (`Emperor`, not `200x200`). SKU is what the theme prefers for the picker id.

Shopify Markets: give each variant a price in that market’s currency (GBP on GB variants, AED on AE variants, EUR on EU variants). Do not put both currencies on one variant.

### 3. Waitlist vs withdraw vs selling

Add **Enabled** (`custom.enabled`, true/false, storefront access on) if it is not there yet.

| What you want | Enabled | Inventory | Customer sees |
|---|---|---|---|
| Selling | blank or true | Continue selling on (qty 0 is fine) | Size is selectable |
| Waitlist this allocation | blank or true | Track quantity, **0**, continue selling **off** | Listed as **Not in this allocation** plus notify form. Never “out of stock”. |
| Withdrawn | **false** | anything | Size hidden. **Request a size** remains for a bespoke dimension. |

Do not leave Continue selling on for a waitlist size or it can still be bought.

### 4. Point the theme at the product

Use the zip that reads variants (`9.2.0-emperor-splitit-review` or later). Older themes do not have the Mattress product picker.

1. **Online Store → Themes**.
2. On that uploaded theme (unpublished is fine), click **Customize**. Not Dawn, not an older Valtora copy.
3. Top bar must say **Home page**. If not, open the page selector and choose Home page.
4. Left sidebar, under **Template**, click the first **Size + price + reserve** (eyebrow “Sizes and prices”, anchor `reserve`).
5. Right panel: **Mattress product** → **Select** → **The Mattress** → Select.
6. Scroll the left sidebar. Click the **second** Size + price + reserve on the same page. Assign **The Mattress** again.
7. **Save** (top right).
8. **Preview** (eye). You should see sizes from the product.

If **Mattress product** is missing, upload the latest review zip first. An empty list after assign usually means `custom.market` is not filled (`gb` / `ae` / `eu`).

Changing a price later: edit the variant in Shopify and reload. No theme edit.

### 5. Klarna (UK)

Theme settings → Klarna client ID. Paste the ID from the Klarna merchant portal.

- Blank: UK shows `Spread the cost with Klarna` with **no monthly figure**.
- Set, and the shopper is in GB: Klarna’s own widget loads and states Klarna’s terms. We never divide the order by 12.

UAE stays `Spread the cost with Tabby or Tamara` until those widgets are wired. No number.

### 6. Splitit (built, off at launch)

Theme settings:

- **Splitit available** — leave **off** for launch.
- **Splitit merchant ID** — Terminal Id from Splitit Hub → Merchants Management → your merchant → Terminals.

Both must be on for anything to appear. Either missing means: no Splitit script, no Splitit markup, no customer-facing mention.

When you later turn it on (UK only), Splitit’s own strip renders under Klarna on Stage A (size panel) and Stage B (checkout). We do not calculate an instalment, term, or APR. If Splitit’s script fails, that strip stays hidden — no fallback line.

Klarna Pay in 3 caps around £2,000 (Single and Double). King, Super King and Emperor sit above it. `begin_checkout` already sends `size`. If abandonment clusters on those three sizes, that is the signal to switch Splitit on.

### 7. Comfort tops (still off)

Leave **Comfort tops enabled** off until you sell them. When you turn it on, the comfort-top product needs Size × Firmness variants, including **Emperor** for GB.

### 8. Brochure and financial model

Those files are not in this repo. They must match the Shopify GB prices, including whatever you set for Emperor.

---

## Checkout

Full payment adds the selected size **variant** to cart. Shopify charges that variant. The number on the page and the number charged are the same record.

Split payment (percent today) still uses the optional split-payment product for the amount due today. Leave that blank in Full mode.

---

## Owner checklist

1. Metafield definitions `custom.market`, `custom.dims`, optional `custom.popular`.
2. Mattress product with AE + GB variants, including GB **Emperor** `200 × 200 cm`, plus an EU **European King** `160 × 200 cm` variant (`custom.market` = `eu`) when you sell that size.
3. GB prices: Single £1,999, Double £2,499, King £2,999, Super King £3,299, Emperor = your figure.
4. Inventory policy **continue** on every mattress variant.
5. Assign that product on both Size + price + reserve sections.
6. Klarna client ID when ready.
7. Splitit stays off until the merchant account is approved and tested.
8. Update brochure and model.
