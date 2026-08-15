# Regression results — 15 Aug 2026 (35a221f + one easing curve)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 569 passed, 0 failed
- Scope note: Restored `valtora-theme/` + `preview/` to deploy `35a221f` (shopify-theme `e205c49`), then applied only the brand easing token from `10-BRAND-GUIDELINES-DEV.md` §3/§8: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`; leftover hover/panel `ease-out` now uses `var(--ease)`. Durations 120/280/450/600, wipe, copy-spec, spec panel, section grounds, offer/swap full-bleed, product flags OFF kept. Later aesthetic/FAQ/card/size-guide/class-space work not included. Checkpoint: `checkpoints/9.3.0-easing-curve/`. No version bump.

---

# Regression results — 15 Aug 2026 (homepage dark-band layout)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 563 passed, 0 failed
- Scope note: Offer, press/awards, and swap-explainer layout only — full-bleed dark bands, no white hairline at section joins, gold rule spans the offer measure, swap text left-aligned in the 48rem column. Duration tokens and wipe restore left untouched. No version bump.

---

# Regression results — 15 Aug 2026 (four brand durations + wipe restore)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 563 passed, 0 failed
- Scope note: Applied the four brand durations across theme + preview (120 hover / 280 panel / 450 reveal / 600 wipe). Reveal travel 20px; trigger 20% in viewport; stagger 50ms max; hover ease-out. Section wipe restored as a one-shot 600ms keyframe (resting `clip-path: none`; editor / reduced-motion never clip). No version bump.

---

# Regression results — 15 Aug 2026 (brand-guideline reveal timings)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 557 passed, 0 failed
- Scope note: Loading/reveal durations aligned to brand guidelines — scroll + hero first-paint **450ms** (`--dur-base`) not 600ms; sibling stagger **50ms** max; spec panel content fade **120ms** (height stays 280ms). Reveals kept on. Preview in sync. No version bump.

---

# Regression results — Saturday 15 Aug 2026 (section colour arrangement)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 557 passed, 0 failed
- Scope note: Per-section **Section colour** toggle (Auto / Off-white / Stone / Dark) plus auto-stripe so reordered neighbours use existing `--brand-bg` / `--brand-surface` and do not blend. Offer and swap-explainer stay Dark by default. No new colours or tokens. Preview kept in sync. No version bump.

---

# Regression results — 2026-08-15 (product pages: layer, sheets, pillows)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 557 passed, 0 failed
- Scope note: Three product pages from `7-PRODUCT-PAGES-BRIEF.md` + `product-pages.html` — comfort layer, bed sheets, pillows. Four independent flags default off (404 / noindex / no links / cart reject). “Comfort top” renamed to “comfort layer” in customer-facing copy. Homepage 6-COPY-SPEC prices left at £250 / AED 1,200. Preview pages + theme in sync. No version bump.

---

# Regression results — 2026-08-15 (specification pattern)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 527 passed, 0 failed
- Scope note: Converted `product-specs` to the collapsed Full specification panel (`spec_opened` / `spec_dwell`). Homepage order now puts the panel at position 11 (after founder-note, before social-proof). Preview kept in sync. No version bump.

---

# Regression results — 2026-08-15 (copy spec 6-COPY-SPEC)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 521 passed, 0 failed
- Scope note: Homepage copy from `6-COPY-SPEC.md` — hero subhead, big-idea body, swap-explainer body + flip line, all six benefits, cool-touch body/blocks, swap-process step 1, product-specs module line, specs list collapsed by default with `open_product_specs` tracking. Headings kept where the spec said keep. Luxury reveals on. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-15 (review export 9.3.0-storefront-polish-review)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 521 passed, 0 failed
- Scope note: Review export **9.3.0-storefront-polish-review**. Version **was** bumped (`VERSION` and Shopify `theme_version` are **9.3.0**). Zip `Valtora-Shopify-Theme-9.3.0-storefront-polish-review.zip` in Downloads and `checkpoints/9.3.0-storefront-polish-review/`. Includes storefront polish since 9.2.0 (markets, hours+TZ, legal entity, Trading as, overlays, luxury reveals, journal page template, basket persist, nav). Does not replace the kept 9.2.0 milestone.

---

# Regression results — 2026-08-15 (journal page not 404)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 521 passed, 0 failed
- Scope note: Journal is now a Page template (`page.journal` / `/pages/journal`) so Admin can create it the same way as Order status. Header/footer use `blogs.journal.url`, then `pages['journal'].url`, then `/pages/journal`. Live `/blogs/journal`, `/pages/journal`, and `/journal` still 404 until that Page exists. Luxury reveals on. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-15 (footer policy pages elevated)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 518 passed, 0 failed
- Scope note: Footer/policy pages (Refunds, Privacy, Terms, Cookies, Delivery, Trial, Warranty, Contact, Size guide) now use a navy/carbon hero, gold-rule, measured article cards, and homepage header chrome. Storefront luxury reveals stay on (policy-hero + article stagger). Checkout markers unchanged. Manufacturing and homepage not flattened. No version bump.

---

# Regression results — 2026-08-15 (hero first-paint luxury stagger)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Homepage hero ("Made to order", CTAs, mattress photo) now eases in on first paint (600ms, cubic-bezier(0.22, 1, 0.36, 1), short stagger). Below-fold stays scroll-reveal. Storefront children still start opacity 0. Design-mode exception only — storefront motion not disabled. Checkout markers unchanged. Wipe clip-path still banned. No version bump.

---

# Regression results — 2026-08-15 (empty-basket first CTA space)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Empty basket now leaves space below the first CTA - homepage hero "See sizes and prices", and Your order / checkout empty "See sizes and prices". Lined basket keeps existing footer / float-basket padding so copyright is not covered. Persist, luxury reveal, and checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-15 (basket persists on Back)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: OrderStore still uses `valtora_order_lines` in sessionStorage + localStorage. Pay no longer clears the basket when opening Shopify `/checkout` - Back from cart, Stage B, or hosted checkout restores Your order + filled dots via `pageshow` / `restoreBasketUi`. Clear only after preview order-confirmed or Shopify `thank_you`. Theme settings still cannot set the hosted checkout store name. Luxury reveal, checkout markers, and no version bump.

---

# Regression results — 2026-08-15 (live storefront first-paint reveal)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Live URL already had hide+rise CSS. Head now adds `js-ready` on first paint (not Customize). JS no longer copies `Shopify.designMode` onto the live storefront, so the GitHub admin bar cannot flatten motion. `?force-motion=1` overrides Reduce motion. 900ms failsafe kept. Wipe clip-path still banned. No version bump.

---

# Regression results — 2026-08-15 (storefront reveal visible)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Storefront luxury stagger is now hide-until-scroll (opacity 0 + 1.5rem rise, 600ms cubic-bezier(0.22, 1, 0.36, 1)). 900ms `showAll` only unsticks in-view nodes on storefront so below-fold still animates. Customize and reduced-motion stay fully visible. Wipe `clip-path: inset(0 100%)` still banned. No version bump.

---

# Regression results — 2026-08-15 (single Brand name source)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Removed Header "Brand name override" and "Product line override". Line 1 + line 2 now come only from Theme settings → Brand (`brand_name`, `brand_product_line`). Footer Trading as is one plain line (e.g. Trading as Aligna Mattresses), same type as the surrounding legal sentence - not a two-line gold/navy lockup. Header wordmark stays the styled two-line lockup. Luxury reveal, overlays, basket dots, hours, taglines, legal entity, nav, and Reserve-off-menu left alone. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-15 (luxury staggered reveals restored)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Storefront luxury reveals are back (fade + slight rise, `--dur-wipe` + `cubic-bezier(0.22, 1, 0.36, 1)`). Not a Theme setting. Editor / reduced-motion stay opacity 1; 900ms `showAll` failsafe kept. Wipe `clip-path: inset(0 100%)` stays banned so Offer/Swap cannot clip away. No version bump.

---

# Regression results — 2026-08-15 (cool-touch main caption overlay)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 516 passed, 0 failed
- Scope note: Cool-touch main caption “Cool-knit cover detail” is now a hover/tap overlay on the large left image (same pattern as collage, founder, and specs). Gallery thumbs Cover knit / Surface detail use the same overlay. Customize setting stays `image_caption`. No caption line under the main photo. Luxury reveal, basket dots, other overlays, wordmark, footer, hours, and nav left alone. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-15 (size radio dots follow basket)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 507 passed, 0 failed
- Scope note: Size radio dots and the strong blue row border now fill only when that size is in the basket (`is-in-basket`, qty > 0, matching variantId). Click-to-read / `is-active` no longer checks the radio or paints selected chrome. Keyboard keeps a lighter `:focus-visible` ring. Multiple in-basket sizes = multiple filled dots; empty basket = none. Stage A Add-to-qty, floating basket, and checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (remove checkout contract line)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 507 passed, 0 failed
- Scope note: Removed "Your contract is with …" from checkout Stage B terms (`main-checkout`, preview checkout, reserve-stage-b fallbacks, size-reserve terms defaults). Legal name stays on Privacy, Terms, Cookies, and footer copyright. Trading as unchanged. Checkout markers (`data-checkout-page`, `checkout-stage__terms`, terms checkbox, Stage B) kept. No version bump.

---

# Regression results — 2026-08-14 (remove Reserve from header menu)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 507 passed, 0 failed
- Scope note: Reserve removed from header nav (desktop, mobile panel, fallback list, and assigned Shopify menus). Header CTA "Reserve yours" stays. Manufacturing header now uses the same chrome as the homepage (no site-header--solid, same actions/mobile panel, same nav gap and wordmark alignment). Homepage section hashes on manufacturing still go to /#…. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (swap explainer alignment)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 507 passed, 0 failed
- Scope note: Swap explainer dark band now uses one 48rem centered column for eyebrow, heading, ledes, richtext, CTA, and video. Removed leftover inline max-widths (34rem / 40rem / 56rem) that left heading centered and body off-axis. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (specs side-profile overlay)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 466 passed, 0 failed
- Scope note: Product-specs “Side profile” is a hover/tap overlay on the photo (same pattern as lifestyle collage), not a line under the image. Founder overlay, collage hover, wordmark line-2, footer Trading as, and checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (manufacturing menu links)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 466 passed, 0 failed
- Scope note: Off-homepage header/footer hashes now go to store root + hash (`/#swap`). theme.js no longer maps Shopify `/pages/` to `../index.html` (that 404'd). Preview manufacturing uses `../index.html#…` and `../pages/…`. Footer Trading as, taglines, hours, legal entity kept. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (cool-touch main image hover)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 466 passed, 0 failed
- Scope note: Cool-touch main image no longer Ken Burns-zooms on hover of the whole split. It uses the same tile scale (1.035, --dur-fast) + inner image zoom (1.05, --dur-wipe) as Cover knit / Surface detail thumbs, only when hovering that figure. Ease still cubic-bezier(0.22, 1, 0.36, 1). Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (founder portrait hover overlay)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Founder name/role is a hover (desktop) / tap (touch) overlay on the portrait, same pattern as lifestyle collage captions. Text comes from section Name + Role ("Benjamin Maxwell, founder"). Not a line under the photo. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (legal entity on legal copy)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Privacy, Terms, Cookies, refunds, trial, warranty, delivery, contact, footer copyright, checkout terms, Stage B, and email snippets now use the registered company (legal name, company number if filled, registered address) instead of the brand wordmark. Empty company-number rows stay hidden. Trading as / wordmark / market taglines / contact-hours unchanged. Checkout markers kept. No version bump.

---

# Regression results — 2026-08-14 (legal name on policies)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Privacy, Terms, Cookies, refunds, trial, warranty, delivery, checkout terms, and footer copyright use Brand → Legal name (`legal_name`). Trading as still uses both brand lines. Checkout markers unchanged. No version bump.

---

# Regression results — 2026-08-14 (Journal blog URL)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Journal is a Shopify blog (`/blogs/journal`), not a Page. Header + footer now use `blogs['journal'].url` with that fallback. Homepage hashes still go to `routes.root_url#…` when not on index. Checkout markers unchanged. 404 is because Admin has no blog with handle `journal`. No version bump.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Contact hours are time-only per market (UK / UAE / USA / Europe / Ghana / Nigeria). Theme appends the time zone (UK BST in summer, GMT after the clocks change; UAE GST). UK no longer shows GST. No version bump.

---

# Regression results — 2026-08-14 (footer Trading as both wordmark lines)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Footer (and contact) Trading as now uses Brand name + Product line from theme settings, stacked like the header wordmark. Blank line 2 hides so there is no stray trailing space. Line 2 uses `--wordmark-line-2-on-dark` on the footer. No version bump.

---

# Regression results — 2026-08-14 (wordmark line-2 colour)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 456 passed, 0 failed
- Scope note: Wordmark line 2 (product line) no longer inherits the name colour. Each guideline × scheme sets `--wordmark-line-2` (complementary navy/gold or carbon/ember). Two-line textarea override unchanged. No version bump.

---

# Regression results — 2026-08-14 (per-market taglines)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 458 passed, 0 failed
- Scope note: Separate Theme setting taglines for UK, UAE, USA, Europe (including Albania), Ghana, and Nigeria. One Liquid helper maps country ISO → tagline; GB uses UK not Europe; unlisted countries use Default then UK. Wired in footer, password page, and share [Tagline] token. Preview market switcher can preview each. Placeholders only — owner must type real slogans. No version bump.

---

# Regression results — 2026-08-14 (remove specs SIDE PROFILE caption)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 453 passed, 0 failed
- Scope note: Product-specs figcaption "Side profile" (CSS uppercase SIDE PROFILE) removed. Caption only renders if a custom value is set; "Side profile" is treated as empty so it does not take space. Preview figcaption removed. Image is HTML caption, not baked into the JPG. No version bump.

---

# Regression results — 2026-08-14 (collage hover / mattress / founder / manufacturing)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 453 passed, 0 failed
- Scope note: Lifestyle collage captions are hover/tap overlays again (not always-on under the photos). Founder photo caption removed. Size-reserve looks up The Mattress by handle and product.json includes the reserve flow. Manufacturing theme files present; storefront 404 still needs an Admin Page. Checkout markers unchanged. No version bump.

---

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


