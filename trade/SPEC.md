# Trade Site  /  Build Spec

Five static pages behind password protection on a subdomain. No framework, no
npm install, no runtime. Node builds it, a static host serves it.

---

## 1. Run it

```
node build.mjs            build /src to /dist
node build.mjs --check    same, but fails on a hardcoded name or a voice breach
```

`/dist` is the deployable folder. `/src` and `brand.json` are the source.
**Never edit `/dist`.** It is deleted and rewritten on every build.

---

## 2. The brand name is a token

The trading name is not settled. Every name on the site comes from `brand.json`.

| Token | Holds | Current |
|---|---|---|
| `{{brand.name}}` | Trading name | Onni London |
| `{{brand.core}}` | The spring system | Sevencore |
| `{{brand.gel}}` | The gel layer | Coolcell |
| `{{brand.cover}}` | The cover knit | Coolweave |
| `{{brand.legal}}` | Legal entity | Cole Commerce Ltd |
| `{{brand.tradeEmail}}` | Contact on every CTA | trade@onnlondon.co.uk |
| `{{service.adjust}}` | Named service | Adjust to Desire |
| `{{service.unpacking}}` | Named service | Concierge unpacking |
| `{{service.removal}}` | Named service | Old mattress removal and recycling |

Change a value, run the build, every page and every `<title>` updates.

`--check` fails the build if a literal brand value appears in a template. That is
the mechanism that stops the name drifting back into the markup. **Keep it in CI
and in the pre-deploy step.** Without it the tokens rot within a month.

Adding a token: add it to `brand.json` under an existing group, use
`{{group.key}}` in a template. No code change.

---

## 3. Pages and access

Nine pages. **`DEPLOYMENT.md` is the authority on which page goes where and
which access group opens it.** This section is a summary only.

| File | Site | Access |
|---|---|---|
| `index.html` | Trade | Open |
| `the-bed.html` | Trade | Open |
| `modern-slavery.html` | Trade, and pasted to Shopify | Open |
| `agents.html` | Trade | Open |
| `b2b-strategy.html` | Trade | Internal |
| `training.html` | Trade | Internal |
| `specification.html` | Trade | Specification partners |
| `retail.html` | Trade | Retail partners |
| `contract.html` | Trade | Contract buyers |

Navigation differs by page. Partner-facing pages do not link to the strategy
page. See `DEPLOYMENT.md` section 4.

## 4. Design system

`assets/site.css` is lifted from `reference-page.html` in the brand export, then
extended for tables, the door grid, the route panels and the performance ladder.
**The tokens at the top are not to be edited.**

### Colour

Six values. `--snow #F5F4F1` page ground, `--bone #E4E1DA` alternate section,
`--hair #D6D2CA` every border, `--graphite #3A3A3C` secondary text,
`--carbon #1A1A1A` primary text and buttons, `--ember #8A6D3B` accent.
`--ember-lt #C4A46A` for Ember on Carbon only.

**Ember is never a fill.** No Ember button, panel or background. It appears as
the rule beside a note, the top rule and figure on the top performance band, and
hover states. Under two percent of any view. A new Ember fill is a bug.

**Sections alternate Snow and Bone. Exactly one Carbon section per page.**
A page with four dark sections has none.

### Type

Instrument Sans 400/500/600 display, Inter 400/500/600 body, Geist Mono 400/500
for labels, kickers and every figure. Loaded from Google Fonts with `display=swap`.

`h1` is `clamp(34px,5.2vw,58px)` at `-.03em`. Body is 17px at 1.6 and `-.011em`.
`.kicker` is mono at 10.5px and `.15em` uppercase. **Mono is never a sentence.**

`font-variant-numeric: tabular-nums` globally, so prices and dimensions align.

### Shape and space

`--radius: 0` on everything, from the token.

Scale only: `--s1` 8 through `--s7` 88. `--sec` is 88 above and below a section.
**No arbitrary pixel values in layout.** No 40px, no 56px.

Two spacing rules that break pages when missed. A section following another takes
`.tight` so 88 below plus 88 above does not become 176 of nothing. And
`p:last-child { margin-bottom: 0 }` is global, or every block carries a phantom 16.

### The Line

**One hairline per page**, on the hero, where the two tones meet. It is a moment,
not a divider. A page with five has none.

---

## 5. Media

34 files from the brand export in `assets/`. Trade imagery is reserved for trade
pages. Consumer product shots appear only where construction is the argument.

| Page | Images |
|---|---|
| index | trade-suite, product-profile, coolknit-side, room-calm |
| specification | room-marble, product-profile, coolknit-side |
| retail | room-suite, product-profile, coolknit-side |
| contract | trade-penthouse, trade-apartment, room-hotel, product-profile, coolknit-side |
| agents | trade-view, coolknit-macro, quilt-macro, product-floating |

Every image carries `width`, `height`, `loading` and `decoding`. Heroes are
`eager`, everything else `lazy`. **Always set width and height**, or the page
shifts as images load.

The two videos are unused. If one is added it takes `preload="none"`, because the
pair is 4.2MB and would otherwise load on every page.

---

## 6. Voice, enforced by the build

`--check` fails on the word "free" and on an em dash. The rest is on whoever
writes the copy.

- **free** becomes complimentary, included, or with our compliments
- **an em dash** becomes a hyphen with spaces
- **handmade** becomes made to order or hand assembled
- The country of manufacture is not named, anywhere
- Numbers are written out in body copy. Numerals in tables and prices.
- `{{brand.core}}` on first mention takes the full form with a plain-English
  appositive. The name alone every mention after. **Never mix.** A page saying
  "seven-zone pocket spring core" in one place and the product name in another
  has two products on it.
- Named services are proper nouns and are never paraphrased.

### Commission band

Eight percent to fifteen, set by agreement and reviewed on performance. Everyone
starts at eight. There is no automatic volume trigger, which is deliberate: the
review weighs repeat accounts and clean deals as well as revenue, and a fixed
threshold would reward a single lucky contract win the same as a built pipeline.

Revenue counts on cleared payment, not on orders placed.

The earnings table on the recruitment page shows every scenario at both ends of
the band. Both columns are real numbers from the live price list. Do not show one
without the other.

Every floor, cap and minimum order in the commercial model was computed at fifteen
percent commission, so the top of the band is inside what was tested.

### Lead times

**Every bed is made to order. There is no finished stock.** No page may say "from
stock", "from the warehouse", "ships in days" or anything that implies a shelf.

Lead times are tokens in `brand.json` so they change in one place:

| Token | Current | Applies to |
|---|---|---|
| `{{lead.standard}}` | 10 to 12 weeks | Low Hazard, standard specification |
| `{{lead.bespoke}}` | 12 to 14 weeks | Bespoke where the spec is already certified |
| `{{lead.bespokeFirst}}` | 14 to 16 weeks | First build of a new spec, certification included |
| `{{lead.stockFuture}}` | 5 to 10 working days | **Not in use.** Held for when stock is carried |

**These figures are unconfirmed.** Verify against the factory before the site is
published. Over-promising a date on a fit-out programme loses the account and the
reference, which on a contract sale is worth more than the order.

`{{lead.stockFuture}}` exists so the change is a one-line edit when stock is held.
Until then it appears nowhere. Adding it to a page before the stock exists is the
single most damaging thing that can be done to this site.

Dates are confirmed in writing on the order, never on the quote.

### Adjust to Desire, for trade

Retail gets a year of adjustment. **Trade gets one change per bed within twelve
months of delivery**, and the difference matters.

A hotel does not adjust one bed, it adjusts a floor. So the stress case is one
hundred percent take-up across every unit in the order, not a single swap. At that
level the liability is three to four percent of order value, and the rate absorbs
it on every door.

The cap is one. A second change on a one hundred and twenty room order takes the
liability from 3.6% to 7.3% of order value, and a third to 10.9%. A second change
is quoted at cost.

**The bespoke top band was pulled from 37% to 35% to fund it.** At 37% with the
offer, four of fifteen sizes break the floor. At 35% every size clears. A contract
buyer values a spec correction far more than two points, because their risk is
committing a hundred rooms to a firmness chosen from a sample.

Layers are kept, not swapped back, exactly as on retail.

### Payment language

**"Dispatch" is the only term used.** It means the beds leave our warehouse to
come to the customer. It is defined once, on the contract page, and used
identically on both routes and on every other page.

"Shipment" is not used. On a bespoke order it is ambiguous, because the goods
ship from the factory to the UK weeks before they dispatch to the customer. A
buyer reading "balance before shipment" could reasonably think they owe the
balance long before anything reaches them.

The deposit already covers the factory in full, so there is no commercial reason
to collect the balance earlier than dispatch.

---

## 7. What must not be built

No analytics, no cookie banner, no forms that email, no CMS, no e-commerce.
This site publishes rules and prices behind a password. Nothing else.

No countdown timers, viewer counts or stock counters. They work on impulse buys
and repel considered ones.

---

## 8. Before it goes live

1. `brand.tradeEmail` is `trade@onnlondon.co.uk`. Keep the local part; only the domain changes.
2. `agents.html` is open. Confirm only if that decision changes.
3. Wire `--check` into the deploy step so it cannot ship with an unresolved token.
4. Point the subdomain at `/dist`.

### Terminology

**We appoint agents, not consultants.** An agent is self-employed, carries several
non-competing lines, is paid commission only and brings an existing book of buyers.
That is the relationship described on every page and in every document.

Use:

- **agent** in general copy
- **commercial agent** where the legal status matters, such as the agreement and the
  agents page title

Do not use "sales consultant", "rep", "salesperson" or "sales team" for this role.
"Consultant" implies an employee, and an experienced agent reading it will assume a job
and move on.

**"FF&E consultants" is a buyer type, not our role.** It refers to the procurement and
design consultants who specify furniture for a project. It stays exactly as it is.

The agents page lives at `/agents.html`. There is no `/sales-consultant.html`.
