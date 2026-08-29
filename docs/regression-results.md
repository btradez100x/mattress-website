# Regression results — Saturday 29 Aug 2026 (nav 404: The mattress + Journal)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 846 passed, 0 failed
- Scope note: Header "The mattress" no longer goes to `/products/the-mattress` (unpublished SKU 404). It goes to homepage `#reserve`, matching preview. Journal prefers a real Page handle `journal`, then a real Blog handle `journal`, then `/pages/journal` — empty blog drops no longer win. Landing add-to-basket work left intact. No VERSION bump. Not deployed. Live 404s remain until deploy; Journal also needs an Admin Page (handle `journal`, template **journal**) if that page does not exist yet.

---

# Regression results — Saturday 29 Aug 2026 (export 10.1.0-manufacturing-and-landing-cart)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 845 passed, 0 failed
- Scope note: Review export **10.1.0-manufacturing-and-landing-cart**. Version **was** bumped (`VERSION` and Shopify `theme_version` are **10.1.0**). Zip `Valtora-Shopify-Theme-10.1.0-manufacturing-and-landing-cart.zip` in Downloads and `checkpoints/10.1.0-manufacturing-and-landing-cart/`. Since 10.0.0: manufacturing how-it-is-built replacement; landing configure posts `/cart/add.js` with quantity stepper and higher-contrast size cards. Does not replace `10.0.0-numa-storefront`. Not deployed.

---

# Regression results — Saturday 29 Aug 2026 (landing add to basket)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 845 passed, 0 failed
- Scope note: Specification / landing configure now posts the selected variant to Shopify `/cart/add.js` with a quantity stepper, instead of opening an empty cart. Size cards are white on surface with a filled primary selected state. Preview cart confirmed King × 2. No VERSION bump. Not deployed.

---

# Regression results — Saturday 29 Aug 2026 (manufacturing replacement)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 838 passed, 0 failed
- Scope note: `/manufacturing` fully replaced with how-it-is-built copy (core, layer, made to order, fifteen sizes). Founder origin story stays on About only. Dropped "Deeper than most" (ToV). Email pack diffs that said "send" / "Free" were not applied. No VERSION bump. Not deployed.

---

# Regression results — Saturday 29 Aug 2026 (save 10.0.0-numa-storefront)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 836 passed, 0 failed
- Scope note: Kept milestone **10.0.0-numa-storefront**. Version **was** bumped (`VERSION` and Shopify `theme_version` are **10.0.0**). Zip `Valtora-Shopify-Theme-10.0.0-numa-storefront.zip` in Downloads and `checkpoints/10.0.0-numa-storefront/`. Since 9.4.0: go-live, firmness copy, about and recycling pages, 30-day trial, lifecycle emails, Numa as brand default. Does not replace 9.4.0, 9.3.0, or 9.2.0 copies. Not deployed.

---

# Regression results — Saturday 29 Aug 2026 (Numa brand default)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 836 passed, 0 failed
- Scope note: Theme settings `brand_name` and all Liquid/JS fallbacks are Numa (was Aligna). Last Connect deploy had overwritten live Theme settings with Aligna from `settings_data.json`. Emails re-baked to Numa/NUMA. Aligna remains only in leftover-copy replace filters and title rewrite regex. Contact email still `hello@aligna.com`. No VERSION bump. Checkpoint: `checkpoints/9.4.0-numa-brand-default/`. Deploy: `v9` `6fb7580`, `shopify-theme` `40b8b85`.

---

# Regression results — Saturday 29 Aug 2026 (landing page SEO defaults)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 836 passed, 0 failed
- Scope note: Search engine title and description defaults for about, mattress-recycling, large-sizes, european-king, specification, and what-it-buys. Used when Admin SEO is empty. `[Brand]` is Theme settings brand_name (line 1). No VERSION bump. Not a deploy.

---


## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 836 passed, 0 failed
- Scope note: Implemented the Numa complete pack: six landing pages (large sizes, European King, specification, what it buys, mattress recycling, about), 16 lifecycle emails (Shopify as event source only), 30-day trial, 35cm depth, £299 comfort layer, complimentary old mattress removal with mandatory recycling link, Concierge unpacking included, spec banner with session dismiss. Email short name from Theme settings `brand_name` (first word). No VERSION bump. Checkpoint: `checkpoints/9.4.0-numa-pages-emails/`. Deploy: `v9` `d4609b4`, `shopify-theme` `eefa9e9`. Live Shopify still needs Admin pages with handles `about` and `mattress-recycling`.

---


---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 810 passed, 0 failed
- Scope note: Mattress firmness copy moved from Soft / Medium Soft to Medium / Medium Firm. Benefits, specs, size-reserve, FAQs, landings, comfort-layer selector. Dropped homepage FAQ "How does the replaceable layer work?" to stay at 16 blocks. No VERSION bump. Checkpoint: `checkpoints/9.4.0-firmness-copy/`. Deploy: `v9` `69ce5d6`, `shopify-theme` `b42859f`. First-customer stock policy still unresolved.

---

# Regression results — Wednesday 26 Aug 2026 (go-live)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 810 passed, 0 failed
- Scope note: Go-live pass from `numa-go-live.md`. Header/footer nav, policy URLs, trial `[N]` tokens, configure lead time above the buy button, reviews off. Product flags OFF. `warranty_years` 25 and `trial_nights` 100 explicit. No VERSION bump. Checkpoint: `checkpoints/9.4.0-go-live/`. Deploy: `v9` `f90f007`, `shopify-theme` `1430dad`.

---

# Regression results — Wednesday 26 Aug 2026 (export 9.4.0-landing-pages-and-gtm)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 690 passed, 0 failed
- Scope note: SemVer export **9.4.0-landing-pages-and-gtm**. Version **was** bumped (`VERSION` and Shopify `theme_version` are **9.4.0**). Zip `Valtora-Shopify-Theme-9.4.0-landing-pages-and-gtm.zip` in Downloads and `checkpoints/9.4.0-landing-pages-and-gtm/`. Since 9.3.0: copy-spec, spec panel, grounds, GTM theme setting, UTM, 25-year warranty setting, LCP first-paint, cool-touch captions under thumbs, European King 160×200, landing v2, product PDPs flags OFF. Does not replace the kept 9.2.0 or 9.3.0 review copies. Not deployed.

---

# Regression results — Wednesday 26 Aug 2026 (landing pages v2 deploy)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 690 passed, 0 failed
- Scope note: Re-ran before deploy of v2 landing pages (inline size selector + add to basket). GTM settings-gated on `theme`, `password`, and `gift_card`. UTM first-touch persisted. Prices / trial / warranty / layer from Theme settings. Product flags OFF. No VERSION bump. Checkpoint: `checkpoints/9.3.0-landing-pages-v2/`. Deploy: `v9` `b41f6bb`, `shopify-theme` `5ac6a3b`.

---

# Regression results — Saturday 22 Aug 2026 (landing pages v2)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 690 passed, 0 failed
- Scope note: v2 landing pages (inline size selector + add to basket; cost tables removed). GTM settings-gated on `theme`, `password`, and `gift_card`. UTM first-touch persisted (sessionStorage + cookie + cart attributes) and appended to same-origin funnel links; `vTrack` carries UTM keys. Prices / trial / warranty / layer from Theme settings. Product flags OFF. No VERSION bump. Checkpoint: `checkpoints/9.3.0-landing-pages-v2/`.

---

# Regression results — Friday 21 Aug 2026 (landing pages)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 690 passed, 0 failed
- Scope note: Four ad landing templates (`page.large-sizes`, `page.european-king`, `page.specification`, `page.what-it-buys`) plus `page.configure`. Prices from mattress variants / preview size-price config. Trial nights from Theme settings `trial_nights` (`[N]`). Warranty from `warranty_years` (`[X]`). Comfort layer named value from `comfort_layer_price_gb` / `_ae` (`[layer]`). Product flags OFF. Brand grounds/fonts/motion unchanged. No VERSION bump. Not deployed. Checkpoint: `checkpoints/9.3.0-landing-pages/`.

---



## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 625 passed, 0 failed
- Scope note: **European King** `160 × 200 cm` added for Europe (incl. Albania). `SIZE_MAPS.eu`, size-reserve auto-detect, size-guide European table, preview picker. No invented price. No VERSION bump. Not deployed. Checkpoint: `checkpoints/9.3.0-european-king-160x200/`.

---

# Regression results — Monday 17 Aug 2026 (warranty years setting)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 625 passed, 0 failed
- Scope note: Theme settings → **Warranty years** (`warranty_years`, default/current 25) drives all storefront warranty duration copy (hero, trust bar, offer, FAQ, warranty policy, checkout terms, Stage B, `[X]` tokens). Preview uses `data-warranty-years` / `data-warranty-years-text`. 100-night trial unchanged. Product flags OFF. No VERSION bump. LCP first-paint (and Cool Touch thumb captions in the same CSS) could not be split. Checkpoint: `checkpoints/9.3.0-warranty-years-setting/`. Deploy: `v9` `485df50`, `shopify-theme` `15799fb`.

---

# Regression results — Monday 17 Aug 2026 (Cool Touch gallery captions)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 577 passed, 0 failed
- Scope note: Cool Touch gallery thumbs (**Cover knit**, **Surface detail**) now use always-visible `figcaption` under the image, not hover/tap overlay. Main image overlay (**Cool-knit cover detail**) unchanged. Lifestyle / founder / side-profile overlays unchanged. No VERSION bump. Not deployed.

---

# Regression results — Monday 17 Aug 2026 (25-year warranty)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 577 passed, 0 failed
- Scope note: Warranty duration copy 15-year → 25-year only (hero, trust bar, offer, FAQ, checkout terms, Stage B fallback, warranty policy, `warranty_years` setting default/current, Liquid fallbacks). 100-night trial, 37cm, prices, densities unchanged. No VERSION bump. Not deployed. Checkpoint: `checkpoints/9.3.0-twenty-five-year-warranty/`.

---

# Regression results — Monday 17 Aug 2026 (LCP first paint)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 577 passed, 0 failed
- Scope note: Homepage LCP — hero first-paint now starts visible (opacity 1) then 450ms rise (`revealFirstPaint`, `--ease` kept). Below-fold hide-until-scroll unchanged. Hero image eager + `fetchpriority=high` + preload; not lazy. Google Fonts `display=swap`; Outfit woff2 preloaded when Outfit is the sans; Fraunces deferred when headlines/wordmark are sans. Font CSS non-blocking. GTM setting kept. Product flags OFF. No VERSION bump. Not deployed. Checkpoint: `checkpoints/9.3.0-lcp-first-paint/`.

---

# Regression results — Monday 17 Aug 2026 (GTM theme setting)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 569 passed, 0 failed
- Scope note: Switched GTM to Theme settings as the single source. Removed hardcoded GTM-MX9SHNSM snippets from `theme.liquid` / `password.liquid`. Layouts now emit the official head script + body noscript only when `settings.gtm_container_id` is set. Schema default + `settings_data.json` current: **GTM-MX9SHNSM**. Info: paste the container ID; leave blank to disable. `tracking-pixels.liquid` keeps the dataLayer / vTrack bootstrap and does **not** load `gtm.js` (avoids a second copy). No extra GA4/Meta tags. Product flags OFF. No VERSION bump. Checkpoint: `checkpoints/9.3.0-gtm-theme-setting/`. Deploy: `v9` `268a3c4`, `shopify-theme` `4a8ac7a`.

---

# Regression results — Monday 17 Aug 2026 (Google Tag Manager)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 569 passed, 0 failed
- Scope note: Installed Google Tag Manager **GTM-MX9SHNSM** on storefront layouts (`theme.liquid`, `password.liquid`) — exact head snippet after charset/viewport (`meta-tags`) and noscript immediately after `<body>`. Removed the settings-gated `gtm.js` loader from `tracking-pixels.liquid` so the container cannot load twice. Existing `vTrack` / dataLayer push kept. No preview GTM (preview does not already mirror analytics chrome). No GA4/Meta IDs added. Product flags OFF. No VERSION bump. Checkpoint: `checkpoints/9.3.0-google-tag-manager/`. Deploy: `v9` `0d07250`, `shopify-theme` `3e7ca98`.

---

# Regression results — 15 Aug 2026 (market copy + storefront fixes)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 569 passed, 0 failed
- Scope note: Full combined pass — mobile size-row, no customer-facing em-dashes, full-width spec rules, request-a-size card, how-it-works `--max-width`, phone country-code by market, section-ground class space, size-guide fit + market tables, spec hover, one `--ease`, `#specs` opens panel, all mobile menu anchors unlock, YOUR ORDER card fill, product pages (flags OFF), `11-MARKET-COPY-AUDIT.md` FROM→TO. Footer rewired through `market-tagline`. No VERSION bump. Checkpoint: `checkpoints/9.3.0-market-copy-and-storefront-fixes/`. Deploy: `v9` `521389d`, `shopify-theme` `a5bf48d`.

---

# Regression results — 15 Aug 2026 (size-guide CTA + table + mobile qty)

## Smoke
- Command: `./scripts/regression-smoke.sh`
- Result: **PASSED** (exit 0)
- Consistency: 569 passed, 0 failed
- Scope note: Surgical only on 35a221f + easing (`c535af6`). Inverse dark-ground primary `.btn` (Snow fill / primary text). Size-guide `.table-wrap` / `.policy-table` overflow visible, no max-height clip. Mobile ≤899px size rows: centred Add/−/+ track with a real gap; Request-a-size hides qty spacer and uses a 3-column text track; mobile row/dot tap adds once. No FAQ/spec/section-ground/padding campaign. Product flags OFF. No version bump. Checkpoint: `checkpoints/9.3.0-size-guide-and-mobile-qty/`. Deploy: `v9` `ec51aec`, `shopify-theme` `9f03cf6`.

---

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


