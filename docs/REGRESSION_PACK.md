# Valtora theme - Regression pack

**Product:** Valtora Shopify theme (`valtora-theme/`)  
**Source of truth:** Brand Guidelines + Website Developer Spec v3 (Aug 2026)  
**Pack version:** 1.0  
**Scope:** MVP (Spec §14 items 1-5) + trust pages/templates already in theme. Items 6-9 called out as deferred gates.

---

## 1. How to use this pack

| Run type | When | Duration | Suite |
|---|---|---|---|
| **Smoke** | Every theme push / PR | ~15 min | §3 |
| **Full regression** | Before ads launch, before name A/B go-live, after deposit-app change | ~60-90 min | §3 + §4-§10 |
| **Acceptance gate** | UAE validation launch | ~2 hrs + store setup | §11 (Spec §12) |
| **Automated smoke** | CI / local before push **and before every agent “done”** | ~1-2 min | `scripts/regression-smoke.sh` (includes CX consistency) |

**Agent rule:** Do not say a build is done until `./scripts/regression-smoke.sh` exits 0. If it fails, fix and re-run.

**Pass rule:** All P0 fail → block release. Any P1 fail → block ads spend. P2 can ship with logged follow-up.

| Severity | Meaning |
|---|---|
| **P0** | Deposit, sizing, UTM, or name-token broken; cannot take money / cannot read tests |
| **P1** | Core marketing surface wrong (hero/copy tokens, market mismatch, mobile reserve broken) |
| **P2** | Polish, empty states, non-blocking content |

Record results in [`regression-results.md`](./regression-results.md) (copy a new run section each time).

---

## 2. Environments & prerequisites

### Environments

| Env | Purpose |
|---|---|
| **Local static** | `preview/` - visual/layout only; no cart/checkout |
| **Theme preview** | `shopify theme dev` or unpublished theme preview URL |
| **Staging store** | Markets AE + GB enabled; deposit app installed; test pixels |
| **Production** | Ads live - only after Acceptance gate |

### Prerequisites checklist (before full / acceptance runs)

- [ ] Theme uploaded / `theme dev` running
- [ ] Deposit product created (e.g. AED 200 / £50) and selected in **Size + price + reserve**
- [ ] Deposit/pre-order app installed; confirmed it **preserves cart attributes** through checkout
- [ ] Shopify Markets: UAE (AED) + UK (GBP) configured
- [ ] Test order / deposit can be placed with bogus card / Shopify Bogus Gateway
- [ ] Pixel IDs present in theme settings (or noted N/A for this run)
- [ ] Size guide page using template `page.size-guide`
- [ ] At least one duplicated page using template `page.landing`

---

## 3. Smoke suite (P0) - every push / every deploy

**Deploy rule:** Do not publish preview or refresh the public link unless this suite passes.

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| SM-01 | Homepage renders | Open `/` | Full landing: hero → FAQ; no Liquid errors | P0 |
| SM-02 | Wordmark renders | Inspect header + hero brand | Text wordmark (ALL CAPS, tracked), not a logo `.png` for the name | P0 |
| SM-03 | Design tokens applied | Inspect computed CSS on `body` / `:root` | Brand tokens applied via settings | P0 |
| SM-04 | Size list + cm | Scroll to `#reserve`; open size options | Each option shows name **and** cm | P0 |
| SM-05 | Tier + price | Select a size | Basket total updates | P0 |
| SM-06 | Reserve → cart | Stage B → Pay | Cart has line item(s) with size properties | P0 |
| SM-07 | UTM first-touch | Visit with UTMs then Pay | Cart/order attributes include UTMs | P0 |
| SM-08 | UTM persists across pages | Land with UTMs → browse → Pay | First-touch UTMs retained | P0 |
| SM-09 | Brand name setting | Theme settings → Brand name | Wordmark updates; no hard-coded Sattva/Saatva | P0 |
| SM-10 | Mobile reserve | 390×844 viewport | Size list usable; floating basket reachable | P0 |
| SM-11 | Theme check | `shopify theme check` | 0 errors | P0 |
| SM-12 | Automated smoke | `./scripts/regression-smoke.sh` | Exit 0 (includes CX consistency) | P0 |
| SM-13 | Stage A basket only | Open `#reserve`, select size | Panel shows lines + total + BNPL + Continue + one cancel line. **No** lead time | P0 |
| SM-14 | Checkout page | Click Continue | Lands on /pages/checkout (or preview/pages/checkout.html); fires view_leadtime; page has delivery + terms + Pay; no nested scroll | P0 |
| SM-15 | Qty persists across sizes | Add King qty 1, select Double | King counter remains visible | P0 |
| SM-16 | Remove from basket | Click Remove (or qty to 0) | Line leaves basket; Continue disables if empty | P0 |
| SM-17 | Floating basket | Scroll away from `#reserve` | Bottom bar: count · total · Continue (replaces old sticky bar) | P0 |
| SM-18 | Deploy + public link | `./scripts/deploy-preview.sh` | Smoke pass; `share/PUBLIC_URL.txt` updated; public `/v4/` loads | P0 |
| SM-19 | Cross-page brand chrome | Set brand/scheme on homepage; open manufacturing, cart, checkout, trust, blog | Same brand name, product line, colour scheme, announcement copy; no Aligna flash; titles stay `Page · Brand` | P0 |
| SM-20 | Consistency script | `python3 scripts/regression-consistency.py` | Exit 0 | P0 |

### Deploy command (mandatory)

```bash
./scripts/deploy-preview.sh
```

This always: runs SM-12 → syncs `preview/` to `share/v4/` → refreshes the external tunnel → writes `share/PUBLIC_URL.txt`.

---

## 4. Brand, tokens & name (Spec S5 / S13)

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| BR-01 | Global palette change | Change Primary / Accent / BG in theme settings | Site re-skins; gold remains accent-only (no large gold fills) | P1 |
| BR-02 | Font swap | Serif → Fraunces; Sans → Work Sans | Headlines + body update; wordmark stays serif | P1 |
| BR-03 | Wordmark system locked | Change name only | Tracking (~0.12-0.18em), ALL CAPS, single colour preserved | P0 |
| BR-04 | Name override (A/B) | On landing variant: Header/Hero brand override = `Nadira`; global still `Valtora` | That page shows NADIRA; homepage still VALTORA | P0 |
| BR-05 | No baked name in images | Grep media alt / uploaded logos | Name not required in image files to change brand | P1 |
| BR-06 | Meta / title uses brand | View page source `<title>` / og:site_name | Uses brand setting; subpages keep `Page · Brand` (not overwritten by site name) | P0 |
| BR-07 | Optional abstract mark | Upload geometric mark in Brand settings | Mark appears beside wordmark; still name-independent | P2 |
| BR-08 | Manufacturing / journey story | Open manufacturing; change Brand in preview config | Logo, product line, and in-copy `[Brand]` / `data-brand-text` all update; colours follow scheme | P0 |
| BR-09 | Announcement consistency | Edit Banner UAE/UK; visit cart + manufacturing + blog | Same announcement copy + brand colour on every page | P0 |
| BR-10 | No theme blink | Navigate homepage → cart → manufacturing with non-default brand/scheme | No flash of default Aligna/navy for even one frame | P0 |

---

## 4b. Automated consistency gate (CX)

Script: `scripts/regression-consistency.py` (also invoked by SM-12).

Checks every `preview/` + `share/v4/` HTML page for:

- `brand-boot.js` before paint
- `theme.js` on subpages
- `data-brand-guidelines` + `data-color-scheme`
- `PreviewFontLink` on Google Fonts links
- `data-brand-text` / `data-brand-product-line` on wordmarks
- no hardcoded navy header/banner chrome
- announcement bar on subpages
- manufacturing brand token coverage
- live Shopify not overwritten by preview localStorage
- page titles not clobbered by share-meta

**Pass rule:** any FAIL blocks smoke and deploy.

---

## 5. Modular landing & copy (Spec S4 / S6)

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| LP-01 | Section order | Theme editor: reorder Benefits above Big idea | Front end matches new order | P1 |
| LP-02 | Hero copy edit | Change H1/sub/CTA without code | Homepage reflects edit | P0 |
| LP-03 | Adaptive default copy | Fresh install / defaults | H1: “Change your comfort, not your mattress.” | P1 |
| LP-04 | Cool-sleep variant | Duplicate landing; set cool hero copy (Spec 6.2) | Variant shows cool copy; control unchanged | P1 |
| LP-05 | Support / Luxury variants | Same for support + luxury heroes | Independent pages | P1 |
| LP-06 | `[Brand]` token | Big idea body contains `[Brand]`; name = Amara | Renders “Amara”, not literal `[Brand]` | P0 |
| LP-07 | FAQ tokens | FAQ ship / warranty answers | `[X-Y]` → lead time setting; `[X]` → warranty years | P1 |
| LP-08 | Voice rules spot-check | Scan visible copy | No exclamation marks; no “hurry / unbeatable / revolutionary” | P2 |
| LP-09 | Offer lines editable | Edit trial/warranty/delivery blocks | Updates on page | P1 |
| LP-10 | Social proof empty | 0 review blocks | Empty state copy shows; layout intact | P2 |
| LP-11 | Media placeholders | No hero/spec images uploaded | Placeholders visible; no broken `<img>` | P2 |

---

## 6. Size, market & reserve (Spec S3 / S9.1)

### Size matrices (must match)

**UAE (`ae`)**

| Size | Dimensions |
|---|---|
| Single | 90-100 × 200 cm |
| Queen | 160 × 200 cm |
| King | 180 × 200 cm |
| Super King | 200 × 200 cm |

**UK (`gb`)**

| Size | Dimensions |
|---|---|
| Single | 90 × 190 cm |
| Double | 135 × 190 cm |
| King | 150 × 200 cm |
| Super King | 180 × 200 cm |
| Emperor | 200 × 200 cm |

**Europe (`eu`)** — EU, EEA, Switzerland, nearby European countries including Albania (AL). Not the UK.

| Size | Dimensions |
|---|---|
| European King | 160 × 200 cm |

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| SZ-01 | UAE list | Market AE (or force UAE) | UAE four sizes + cm per table | P0 |
| SZ-02 | UK list | Market GB (or force UK) | UK five sizes + cm; **Double** present, **Queen** absent, **Emperor** 200×200 | P0 |
| SZ-02b | Europe list | Market EU (or force Europe, incl. Albania) | **European King** 160×200 present; UK King 150×200 absent | P0 |
| SZ-03 | King ambiguity | Compare AE King vs GB King vs EU European King | AE 180×200; GB 150×200; EU 160×200 - all labelled clearly | P0 |
| SZ-04 | Force override | Section “Force UK sizes” while browsing as AE | UK list shows (variant testing) | P1 |
| SZ-05 | Auto detection | AE market storefront | UAE sizes and AED prices shown | P1 |
| SZ-06 | Size guide page | Open size guide template | Comparison table + expat note + 37cm depth note | P1 |
| SZ-07 | Line properties | Reserve King / Signature | Properties: `Size` with cm, `Size ID`, `Price tier`, `Market` | P0 |
| SZ-08 | Deposit product missing | Clear deposit product in section | Clear editor/storefront guidance; no silent failure | P1 |
| SZ-09 | Deposit amount microcopy | Theme deposit label = AED 200 | Reserve panel states fully refundable AED 200 | P1 |
| SZ-10 | Lead time honesty | Complete path to cart/checkout messaging | Lead window from theme setting visible | P1 |
| SZ-11 | Price tiers UAE | Essential / Signature / Grand | AED 8,999 / 11,999 / 14,999 (or edited values) | P1 |
| SZ-12 | Price tiers UK variant | UK landing prices | £1,999 / 2,499 / 2,999 (or edited) | P1 |
| SZ-13 | Checkout deposit | Complete deposit purchase | Charged deposit only (app); refundable terms shown | P0 |
| SZ-14 | Confirmation email | Place test deposit | Email: reserved size, deposit, refundable, ship window | P0 |
| SZ-15 | Admin export | Export orders | Columns usable for size, tier, UTMs | P0 |

---

## 7. Tracking & attribution (Spec S8)

### UTM schema (verbatim)

| Param | Allowed test values |
|---|---|
| `utm_source` | `meta` / `snapchat` / `tiktok` / `google` |
| `utm_medium` | `paid-social` / `paid-search` |
| `utm_campaign` | `s1-adaptive` / `s1-cool` / `s1-support` / `s1-lux` / `s1-perf` |
| `utm_content` | `seg1-west` / `seg2-ind` / `seg3-arab` / `seg4-new` (+ `-v2`) |
| `utm_term` | creative id string |

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| TR-01 | Capture on land | Load with full UTM set | `localStorage` key `valtora_utm_first_touch` set | P0 |
| TR-02 | First-touch wins | Land with set A → later visit with set B (same browser) | Cart still has set A | P0 |
| TR-03 | Cart attributes sync | After land with UTMs, inspect `/cart` attributes (or cart page note) | All five keys present | P0 |
| TR-04 | Order record | Complete deposit | Order attributes include `utm_campaign` + `utm_content` | P0 |
| TR-05 | Segment readout | Two deposits: `seg1-west` vs `seg3-arab` | Export distinguishes both | P0 |
| TR-06 | Territory readout | `s1-cool` vs `s1-adaptive` | Export distinguishes campaigns | P0 |
| TR-07 | Meta Pixel PageView | Pixel ID set; load page; Meta Pixel Helper | PageView fires | P1 |
| TR-08 | Deposit conversion | Complete deposit; verify pixel/GA4 | Conversion/purchase (or app equivalent) with value | P0 |
| TR-09 | TikTok / Snap (UAE) | IDs set; PageView | Events fire (UAE weighting) | P2 |
| TR-10 | No UTM visit | Clean storage; land without UTMs; Reserve | Cart works; no bogus utm attributes required | P1 |
| TR-11 | Deposit app attribute pass-through | Confirm with chosen app docs + test order | Attributes survive checkout (app-dependent - **ads blocker if fail**) | P0 |

---

## 8. Segment / page variants (Spec S5.3 / S6.10)

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| SG-01 | Duplicate landing | Create page → template `landing` | Same section structure as homepage | P0 |
| SG-02 | Segment copy shift | Seg3 page: exclusivity/allocation emphasis | Only that URL changes | P1 |
| SG-03 | Token override | Hero primary/accent override on variant | Variant mood changes; global theme unchanged | P1 |
| SG-04 | Ad URL wiring | Open variant with matching `utm_content` | Page + UTM align for readout | P1 |
| SG-05 | Name × segment isolation | Do **not** change name and segment in one test cell | Spec rule: confound avoided operationally | P1 |

---

## 9. Products beyond deposit

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| PR-01 | Replacement top PDP | Product type `Replacement top` or tag `replacement-top` | CTA “Add replacement top”; variants purchasable | P1 |
| PR-02 | Replacement sizes | Variants include market-correct sizes | cm or clear size names; no AE/UK mix on one variant | P1 |
| PR-03 | Standard product add | Add non-deposit product | Cart + UTM sync still runs on submit | P2 |
| PR-04 | Empty cart | `/cart` with 0 items | Empty state + link to `#reserve` | P2 |

---

## 10b. Trust layer (Spec S15) - risk reversal & credibility

| ID | Case | Steps | Expected | Sev |
|---|---|---|---|---|
| TRU-01 | Trust bar ×2 | Homepage: under hero + above reserve | Four linked claims + lead-time line | P0 |
| TRU-02 | Deposit terms inline | Reserve panel on mobile | Terms visible above button; not collapsed | P0 |
| TRU-03 | Policy pages | Trial / warranty / refunds / delivery templates | Awkward questions answered; footer linked | P0 |
| TRU-04 | Founder note | Between social proof and offer | Portrait + note (~80-120 words) | P1 |
| TRU-05 | Legal entity footer | Fill UAE trade licence / TRN | Visible in footer legal row | P1 |
| TRU-06 | WhatsApp float + reserve | Number set; mobile | Float does not cover Reserve CTA; opens wa.me with prefill | P0 |
| TRU-07 | Contact hours | Footer + contact page | Hours + response-time note | P1 |
| TRU-08 | Payment marks | AE vs GB | Tabby/Tamara vs Klarna/Clearpay + secure-checkout line | P1 |
| TRU-09 | Review empty + app slot | Social proof with 0 reviews | Honest empty state; `@app` block available | P1 |
| TRU-10 | Proof slots hidden | Empty proof blocks | No fake certifications shown | P0 |
| TRU-11 | COD FAQ | FAQ section | Cash-on-delivery Q&A present | P1 |
| TRU-12 | No fake urgency | Scan theme | No countdown / viewer count / artificial stock | P0 |


| UX-02 | FAQ accordion | Open/close items | One open at a time; keyboard button works | P2 |
| UX-03 | Skip link | Tab from load | “Skip to content” focuses `#MainContent` | P2 |
| UX-04 | Mobile nav | <900px; open menu | Panel opens/closes; links work | P1 |
| UX-05 | Reduced motion | `prefers-reduced-motion: reduce` | Hero/reveal not jarring | P2 |
| UX-06 | Contrast | Navy/ink on off-white; off-white on navy | Readable; gold not used for body text | P1 |
| UX-07 | Lighthouse mobile | Prod/staging homepage | CWV green target (esp. UK) - LCP/INP/CLS | P1 |
| UX-08 | Password page | Theme password enabled | Brand wordmark + enter form | P2 |
| UX-09 | 404 | Hit bad URL | Branded 404 + home CTA | P2 |

### Deferred (Spec §14 items 6-9) - track but don’t block UAE MVP theme ship

| ID | Case | Notes | Gate |
|---|---|---|---|
| DF-01 | BNPL UAE Tabby/Tamara | App widgets; microcopy present | Before UAE paid scale |
| DF-02 | BNPL UK Klarna/Clearpay | Not Tabby/Tamara | Before UK launch |
| DF-03 | UK GDPR explicit opt-in | Consent banner | Before UK traffic |
| DF-04 | Lifecycle emails for tops | Flows in email app | Post-MVP |
| DF-05 | Arabic/RTL | Out of MVP scope | Phase 2 |

---

## 11. Acceptance criteria map (Spec §12)

Use as the **launch gate**. Every row must Pass (or N/A with owner sign-off).

| Spec §12 criterion | Covering cases | Result |
|---|---|---|
| Correct market size + cm; refundable deposit; confirmation with lead time + refund terms; flawless mobile | SZ-01-03, SZ-07, SZ-13-14, SM-10 | ☐ |
| UAE ↔ UK size lists correct; cm always shown | SZ-01-06, SM-04 | ☐ |
| Marketing changes headline, price, offer, palette, fonts, brand name without developer | BR-01-04, LP-01-02, LP-09, SZ-11 | ☐ |
| Duplicate page variants; token override per variant | SG-01-03, LP-04-05 | ☐ |
| UTMs persist to deposit; export shows campaign + content + size + tier | TR-01-06, TR-11, SZ-15 | ☐ |
| Deposit events → Meta, Google (+ Snap/TikTok UAE) with value | TR-07-09 | ☐ |
| Replacement tops standalone with market-correct sizes | PR-01-02 | ☐ |
| UAE AED + Tabby/Tamara; UK GBP + Klarna/Clearpay + GDPR | SZ-11-12, DF-01-03 | ☐ |
| Fast on mobile (CWV green) | UX-07, SM-10 | ☐ |
| Brand name setting updates wordmark + references (S13 acceptance) | SM-09, BR-03-04, LP-06 | ☐ |

**Ads launch blocker:** TR-11 + SZ-13-15 + SM-07 must Pass.

---

## 12. Negative / “what NOT to break” (Spec §11)

| ID | Guard | Fail if… |
|---|---|---|
| NG-01 | No custom checkout | Theme replaces Shopify checkout |
| NG-02 | No hard-coded test copy on variant surfaces | Segment pages require code deploy to change H1 |
| NG-03 | No permanent AE/UK brand forks | Separate themes/codebases per market |
| NG-04 | Wordmark not an uploaded name image | Logo PNG contains “VALTORA” as only way to show name |

---

## 13. Device / browser matrix

Minimum each full regression:

| Device | Browser |
|---|---|
| iPhone 14/15 class (Safari) | Mobile Safari |
| Android mid-tier Chrome | Chrome |
| Desktop 1280+ | Chrome or Safari |
| Desktop | Firefox (smoke SM-01, SM-06, SM-07 only) |

---

## 14. Automated smoke + deploy

```bash
cd "/Users/benacolatse/Mattress Shopify website"
./scripts/regression-smoke.sh   # gate only
./scripts/deploy-preview.sh     # gate + sync share/v4 + refresh public URL
```

`deploy-preview.sh` is mandatory on every preview publish. It fails closed if smoke fails, then updates `share/PUBLIC_URL.txt` and the live tunnel (default subdomain `deep-adults-roll`).

Optional static visual: open `http://127.0.0.1:5173/` (`preview/`) for layout-only review - **does not** replace SM-06/07.

---

## 15. Sign-off

| Role | Name | Date | Smoke | Full | Acceptance | Notes |
|---|---|---|---|---|---|---|
| Builder | | | ☐ | ☐ | ☐ | |
| Marketing owner | | | ☐ | ☐ | ☐ | Ads: go / no-go |
| Store owner | | | ☐ | ☐ | ☐ | |

**Release decision:** ☐ Ship theme only · ☐ Ship + enable deposits · ☐ Clear for paid traffic
