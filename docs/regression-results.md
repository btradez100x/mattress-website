# Regression results — 2026-08-14 (Visa / basket / captions)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 453 passed, 0 failed
- Scope note: Footer Visa marks flex-centered with locked 24px SVG height; sticky basket padding moved onto the footer (copyright stays above the bar, no extra scroll gap); image captions always render under cool-touch, lifestyle, manufacturing, founder, specs, and UGC. Checkout markers unchanged. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 453 passed, 0 failed
- Scope note: Header brand-name override is a textarea; product-line override added; wordmark splits newlines into line 1 / line 2. CSS stacks both lines. No version bump.

---

# Regression results — 2026-08-14 (order-status 404 + header nav)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 453 passed, 0 failed
- Scope note: Storefront `/pages/order-status` 404s because no Shopify Page exists (same class as checkout). Header hardcoded nav omitted Order status; footer already linked. Theme now always links `pages['order-status'].url | default: '/pages/order-status'` in header, footer, and order-confirmed. Owner must create the Page in Admin. No version bump.

---

# Regression results — 2026-08-14 (cool-touch main image caption)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Cool-touch had gallery figcaptions only; the large left image had no caption setting. Added `image_caption` (default “Cool-knit cover detail”) outside the overflow-hidden media frame. No version bump.

---


## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Cool-touch gallery captions were clipped by `overflow: hidden` on the figure. Offer and Swap are dark bands; `section--wipe` clipped them to zero width on the storefront after Customizer save. Wipe disabled; captions always render. No version bump.

---

# Regression results — 2026-08-14 (basket in-order sizes)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Size rows in the basket now keep a filled marker and qty stepper even when another size is the focused row. GitHub Action added for theme push. No version bump.

---

# Regression results — 2026-08-14 (reveal hid copy in editor)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: `html.js-ready [data-reveal-child]:not(.is-visible) { opacity: 0 }` made Cool-touch points look like empty white boxes in the Shopify editor iframe. Local preview uses a normal tab so the observer fired. Copy is now always opacity 1. No version bump.

---

# Regression results — 2026-08-14 (Klarna empty slot)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: `klarna-placement { display:block }` overrode `[hidden]`, leaving a blank under “Spread the cost with Klarna” when no client ID. Hidden placements now display:none. No version bump.

---

# Regression results — 2026-08-14 (swap-explainer + offer)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 449 passed, 0 failed
- Scope note: Swap explainer used a filter inside `{% render %}`, which Shopify blanks. Offer JSON had empty `cta_note`. Fixed render args; copied paste files. No version bump.

---

# Regression results — 2026-08-14 (FAQ leaked Liquid)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 448 passed, 0 failed
- Scope note: Duplicate `{% liquid` block in `faq.liquid` was missing its opening tag, so `assign market` printed on the homepage. Removed the duplicate. Size list now infers `ae`/`gb` from variant titles containing UAE when `custom.market` is blank. No version bump.

---

# Regression results — 2026-08-14 (homepage huge blanks)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 447 passed, 0 failed
- Scope note: Empty UGC 9:16 placeholders, reveal children stuck invisible, and unassigned size-reserve two-column layout were leaving huge gaps on the Shopify homepage. Hide clips without poster/video; reveal failsafe; empty size-reserve stacks. No version bump.

---

# Regression results — 2026-08-14 (blank schema defaults)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 447 passed, 0 failed
- Scope note: Shopify FileSaveError `default can't be blank` on `anchor_id` / `eyebrow`. Removed empty schema defaults. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 446 passed, 0 failed
- Scope note: FileSaveError was missing `size-reserve` section — schema `info` contained `{{ section.id }}`, so Shopify dropped the section then `index.json`. Liquid removed from schemas. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 445 passed, 0 failed
- Scope note: Zip upload still dropped `index.json` after max_blocks fix — Shopify validates templates at the 16-block default before section schema. FAQ trimmed to 16 in JSON; Liquid `{{ settings.* }}` removed from templates. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 445 passed, 0 failed
- Scope note: Shopify was dropping `templates/index.json` on zip upload (FAQ over default 16-block limit + sections not listed in `order`). Homepage 404. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Theme setting `size_add_label` (default Add). No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 393 passed, 0 failed
- Scope note: `custom.enabled` withdraws a size. Inventory 0 + continue off = waitlist with “Not in this allocation”. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 393 passed, 0 failed
- Scope note: Emperor 200×200 (GB). Splitit built behind toggle, default off. Review export without version bump — still **9.2.0**.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 393 passed, 0 failed
- Scope note: DEV-SPEC + COPY-CHANGES. Size list from `product.variants` (no `price_display` / `price_set`). JS uses `price_raw`. Klarna SDK gated on client ID + GB; no /12 finance figure. Preview GB Super King £3,299. Version stayed **9.2.0**.

## New gates
- `price_display` / `price_set` absent; no `/ 12` or `orderVal /` in theme.js; Klarna script gated; empty `bnpl_microcopy`; preview Super King 329900; size-reserve loops variants.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 393 passed, 0 failed
- Scope note: Review export only — version stayed **9.2.0**. Zip `Valtora-Shopify-Theme-9.2.0-launch-spec-review.zip` in Downloads and `checkpoints/9.2.0-launch-spec-review/`. Does not replace `9.2.0-order-status-app-proxy`.

---
# Regression results — 2026-08-14 (launch spec)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 393 passed, 0 failed
- Scope note: Launch spec on V9.2 - lead-time resolver, cart mix, comfort-top (404 vs full), COPY-LAUNCH mattress copy, privacy/terms/cookies, empty reviews.json, motion tokens, order-status worker deployed at https://valtora-order-status.valtora.workers.dev. Lookup remains off until App Proxy + secrets.

## Launch gates
- Resolver grep, empty reviews, checkout markers, comfort-top 404, swap CTA gated, cubic-bezier uniqueness, data-preview absent from theme templates, wrangler.toml has no localhost.

---


## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 342 passed, 0 failed
- Scope note: Manufacturing + Journal brand-guidance motion (reveal/stagger/parallax/scroll-progress/hover) verified via CDP before smoke.

## CDP motion spot-check
- Manufacturing: force-motion, hero reveal, gallery/split/story groups, parallax, scroll-progress
- Journal index: 6 blog cards staggered + visible; scroll-progress


---
# Regression results — 2026-08-14 02:45 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 342 passed, 0 failed
- Scope note: Floating basket bar on all content pages (JS show without #reserve; markup injected). Hidden on cart/checkout/order-confirmed/order-status.


---
# Regression results — 2026-08-14 02:55 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 342 passed, 0 failed
- Scope note: Reverted broken Stage B confirming layout; restored Stage A Your order → Continue → Stage B Pay. Kept Add→qty steppers and centered 56rem reserve layout.


---
# Regression results — 2026-08-14 03:03 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 342 passed, 0 failed
- Scope note: COPY-CHANGES.md applied (skipped chemicals/OEKO). Hero/offer/mfg/swap/specs/reserve/FAQ/thanks/status + global scrub.


---
# Regression results — 2026-08-14 03:06 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 344 passed, 0 failed
- Scope note: Hide empty specs cert-strip (borders+padding+wrapper) when chemicals/OEKO toggles are off.


---
# Regression results — 2026-08-14 03:09 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 344 passed, 0 failed
- Scope note: Basket store prefers newest stamp (not fuller copy) so removed sizes cannot resurrect; remove-by-sizeId; dual reserve panels sync.



---
# Regression results — 2026-08-14 03:18 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: consistency: 344 passed, 0 failed
- Scope note: FUNCTIONALITY-CHANGES — protected two-step checkout (Continue → /pages/checkout; main-checkout V7 + §0.5 copy only); GTM-only Meta/GA4; UTM+gclid/fbclid; qty uncapped; order cart attrs; comfort_tops_enabled flag; thank-you/status/trust presets; events aligned.

### Owner follow-up (Shopify admin, not theme code)
1. Create Order metafields under `custom`: order_stage, stage_updated_at, delivery_window, size_label, size_dims (map from cart attributes of the same names / Flow).
2. Create draft product Comfort Top (12 variants); keep unpublished so `/products/comfort-top` 404s while `comfort_tops_enabled` is false.
3. Add Order status to main nav (last item) in the theme editor.
4. Verify UTM on a real £1 order before ad spend.



---
# Regression results — 2026-08-14 03:22 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Restored V8 checkout flow — after sizes are added, Checkout CTA navigates to `/pages/checkout` payment page (Pay + lead time). `data-checkout-href` on reserve + float CTAs; hard navigate (no in-page Stage B).



---
# Regression results — 2026-08-14 03:35 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 356 passed, 0 failed
- Scope note: Journey/thank-you page — footer restored; brand name/guidelines/colours from preview theme settings via base.css schemes (incl. signature) + brand-boot (no hardcoded :root navy); checkout/cart same chrome; email hydrates from settings.



---
# Regression results — 2026-08-14 03:38 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: COPY-CHANGES_1 — deleted competitor price anchors from offer; added replacement-frequency frame; Stage B terms + lead copy; Feel from firmness settings; FAQ market label; preview/share synced.



---
# Regression results — 2026-08-14 03:45 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 356 passed, 0 failed
- Scope note: Basket + thank-you pull brand guidelines/colours from theme settings — brand-boot injects scheme CSS vars before paint; theme.js re-injects on chrome update; cart/checkout panels use brand-surface mix; preview + share/v4 funnel cache bumped (`wo-v9-brandfunnel1`).


---
# Regression results — 2026-08-14 05:06 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 356 passed, 0 failed
- Scope note: Side basket — more sticky offset under header; empty state hides Checkout CTA and BNPL (no Tabby/Klarna until a mattress is added; UK uses Klarna). Live GB mounts Klarna OSM by purchase amount. Unavailable / request-a-size moves the order to the bottom float bar.


---
# Regression results — 2026-08-14 05:12 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 357 passed, 0 failed
- Scope note: Brand initials favicon from brand name + colour scheme (SVG). Uploaded theme favicon still overrides. Preview updates live as Brand / Guidelines / Colour change.


---
# Regression results — 2026-08-14 05:18 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Scope note: Packaged current V9 export (`checkpoints/V9/Valtora-Shopify-Theme-V9.zip` + `preview-and-theme.tar.gz`; copy in Downloads).


---
# Regression results — 2026-08-14 05:31 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 357 passed, 0 failed
- Scope note: COPY-CHANGES-PART-2 packaged as **V9.1** (`checkpoints/V9.1/Valtora-Shopify-Theme-V9.1.zip` + `preview-and-theme.tar.gz`; copy in Downloads). Flip + construction copy: five benefit blocks, nine spec layers, Stage A `firmness_line`, new firmness FAQs.


---
# Regression results — 2026-08-14 06:05 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 357 passed, 0 failed
- Scope note: V9-REVIEW-AND-BRIEF — 10 spec lines including Assembly; OEKO-TEX gated on certificate number (displayed alongside); Stage A flip line fallback; checkout markers unchanged.


---
# Regression results — 2026-08-14 06:09 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 357 passed, 0 failed
- Scope note: Order tracking — App Proxy worker + eight-stage status page + email notify contract. Lookup remains **off** (`order_lookup_enabled` false) until the worker is live. Preview mocks all page states.


---
# Regression results — 2026-08-14 14:28 BST

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 357 passed, 0 failed
- Scope note: Packaged **V9.2** (`checkpoints/V9.2/Valtora-Shopify-Theme-V9.2.zip` + `preview-and-theme.tar.gz`; copy in Downloads). V9.1 plus order-status page / App Proxy contract; lookup default off.


