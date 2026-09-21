# Deployment  /  Which page goes where

Nine pages across two sites. Three of them are judgement calls rather than
obvious placements, and those are flagged below.

---

## 1. Shopify, the public consumer site

| File | Shopify page | Access |
|---|---|---|
| `shopify-modern-slavery.html` | `/pages/modern-slavery` | Public |

**That is the only page that goes on Shopify.** Everything else is trade.

Paste into the page HTML editor. The CSS is scoped under `.nm` so it cannot
touch the theme. Find and replace `ASSET_BASE` with your Shopify CDN folder URL
before saving.

Link it from the site footer. Procurement teams look for it there first.

---

## 2. Trade subdomain

| File | Route | Access group |
|---|---|---|
| `index.html` | `/` | **Open** |
| `the-bed.html` | `/the-bed.html` | **Open** |
| `modern-slavery.html` | `/modern-slavery.html` | **Open** |
| `sales-consultant.html` | `/sales-consultant.html` | **Open** |
| `b2b-strategy.html` | `/b2b-strategy.html` | **Internal** |
| `training.html` | `/training.html` | **Internal** |
| `specification.html` | `/specification.html` | Specification partners |
| `retail.html` | `/retail.html` | Retail partners |
| `contract.html` | `/contract.html` | Contract buyers |

Deploy `/dist` after running `node build.mjs`. Never deploy `/src`.

---

## 3. The three that needed a decision

### Sales consultant is open

A password on a recruitment page halves the applications. Nothing on it helps a
competitor beyond knowing the commission band, and a candidate who has to email
for access will not email.

### B2B strategy is gated, and gated **internal**, not with the trade groups

It contains no prices, no costs, no margins and no supplier detail. It is gated
anyway, because it names the segments we cannot win yet and tells a consultant
when to walk away from a deal. A buyer reading "flagged hotel chains, not yet, do
not work the deal" learns something they should not.

Put it behind the same password as the internal playbook, not behind a partner
group password.

### Training is gated internal

`training.html` is the objection-handling playbook. It sits with Strategy, behind
the Internal group (and master). Partner logins do not open it.

### The bed is open

`the-bed.html` is construction and the year of adjustment. It is in the partner
nav on every page. No prices.

### Modern slavery sits on both sites

Same statement, two places. **They must stay in step.** The annual update changes
`brand.json` on the trade site and requires a manual paste on Shopify, so the two
can drift.

If keeping them in step is a worry, put it on Shopify only and have the trade
footer link across. Less tidy, no drift risk. Either is defensible. Pick one and
write it here.

---

## 4. Navigation

Nav chrome is the same on every page: type size, weight, spacing, colour, and
layout. The label for `/` is **How it works**.

**Partner-facing HTML** carries How it works, The bed, Specification, Retail,
Contract and Work with us. It does **not** link to Strategy or Training, because
a specification partner clicking a link they cannot open is a worse experience
than not seeing it.

**Internal HTML** (`b2b-strategy.html` and `training.html`) also carries Strategy
and Training. A small script requests `/b2b-strategy.html` with the browser's
stored credentials. Internal and master get 200 and those two links are inserted
on every other page, in the same type treatment. Partner groups get 401 and never
see them.

**Modern slavery is in the footer of every trade page.** It is not in the nav.

---

## 5. Access control

Enforced at the server or CDN, **before a file is served**. Every page carries
`noindex,nofollow` and the build writes a `robots.txt` disallowing the whole
subdomain. Neither is protection. They stop a leaked URL reaching a search index
and nothing more.

Four groups:

| Group | Opens |
|---|---|
| Specification | `/specification.html` |
| Retail | `/retail.html` |
| Contract | `/contract.html` |
| Internal | `/b2b-strategy.html`, `/training.html`, and anything added later |

A master credential opens all four.

**Rotate the internal password whenever a consultant stops working on the
account.** It costs nothing and it is the one that matters most.

---

## 6. Order of work

1. `node build.mjs --check`. It must pass. It fails on an unresolved token, a
   hardcoded brand name, the word "free" and an em dash.
2. `brand.tradeEmail` is `trade@onnlondon.co.uk`. Rebuild if that token changes.
3. Confirm lead times against the factory. The figures in `brand.json` are
   estimates and appear on four pages.
4. Deploy `/dist` to the subdomain.
5. Configure the four access groups.
6. Paste the Shopify statement and replace `ASSET_BASE`.
7. Link the statement from the Shopify footer.
8. Decide the modern slavery question in section 3 and record the answer here.
