# 9.4.0 — landing-pages-and-gtm

**Date:** Wednesday 26 Aug 2026  
**Export:** `Valtora-Shopify-Theme-9.4.0-landing-pages-and-gtm.zip`

SemVer export of everything shipped since **9.3.0** (`storefront-polish-review`). Version **was** bumped: `VERSION` and Shopify `theme_version` are **9.4.0**. This does not replace the kept 9.2.0 milestone or the 9.3.0 review copy; it is the next uploadable theme.

Upload this zip as an unpublished theme and preview it. Your live theme is unchanged until you publish. If you prefer to keep editing the live theme by hand, use **Online Store → Themes → … → Edit code** on the published theme instead.

- `Valtora-Shopify-Theme-9.4.0-landing-pages-and-gtm.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/`

Product flags remain **OFF** (`comfort_tops_enabled`, `sheets_enabled`, `pillows_enabled`, `footer_accessories_enabled`). Splitit and order-status lookup stay **off**. Comfort-layer / bed-sheets / pillows PDP templates exist; they 404 + noindex until those flags are turned on.

Worker (not in the Shopify zip): `apps/order-status-worker/` at `https://valtora-order-status.valtora.workers.dev`. Setup: `docs/ORDER_TRACKING.md`.

Restore:
```bash
tar -xzf checkpoints/9.4.0-landing-pages-and-gtm/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
```

---

## What’s in this export (since 9.3.0)

### Copy-spec, spec panel, grounds
- Homepage bodies from `6-COPY-SPEC` (hero, big-idea, swap-explainer, benefits, cool-touch, swap-process, product-specs).
- **Full specification** panel: `#specs` opens the panel, scrolls under the sticky header, fires `spec_opened` once. Spec hover is 120ms on `--ease`. Hairlines span the full cream band.
- **Section grounds** — class via a prepended space so `section section--dark` survives Shopify. Auto separates neighbours; Dark only when the merchant chooses or offer/swap defaults.
- One ease: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`. Durations 120 / 280 / 450 / 600 + wipe.

### Market copy and storefront
- Combined market-copy pass: footer/meta/taglines, measure-size, size-guide, FAQ size/pay, founder, lifestyle, manufacturing caption. Phone country-code follows market (UK +44, UAE +971, US +1, Ghana +233, Nigeria +234).
- No customer-facing em-dashes (`—` → `-`).
- **Size guide** — no inner-frame scroll; UK table on GB, UAE table on AE, **European size** table for Europe (including Albania).
- Mobile size-row (≤899px): Add and −/+ centred; tap-to-add; Request-a-size is a solid card.
- Inverse dark primary CTA: Snow on Carbon. Ember is never a button fill.

### GTM and UTM
- **Theme settings → GTM container ID** (`gtm_container_id`) is the single source. Schema default + current: **GTM-MX9SHNSM**. Leave blank to disable. No hardcoded container ID in Liquid.
- Official GTM head script + body noscript on `layout/theme.liquid`, `layout/password.liquid`, and `templates/gift_card.liquid`. `tracking-pixels.liquid` keeps dataLayer / `vTrack` and does **not** load `gtm.js`.
- **UTM first-touch** (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus `gclid` / `fbclid`): persisted in sessionStorage, localStorage, and cookie `valtora_utm_first_touch` (90 days); written to cart attributes; appended onto same-origin funnel links; copied onto every `vTrack` event.

### Warranty and LCP
- **Theme settings → Warranty years** (`warranty_years`, default/current **25**) drives hero, trust bar, offer, FAQ, warranty policy, checkout terms, Stage B, and `[X]` tokens. 100-night trial unchanged.
- Homepage **LCP first-paint**: hero starts visible (opacity 1) then 450ms rise (`revealFirstPaint`, `--ease` kept). Hero image eager + `fetchpriority=high` + preload. Google Fonts `display=swap`; Outfit woff2 preloaded when Outfit is the sans; Fraunces deferred when headlines/wordmark are sans.

### Cool Touch captions
- Gallery thumbs (**Cover knit**, **Surface detail**) use always-visible `figcaption` under the image, not a hover/tap overlay. Main image overlay (**Cool-knit cover detail**) unchanged. Lifestyle / founder / side-profile overlays unchanged.

### European King
- **European King** `160 × 200 cm` for Europe (including Albania). Distinct from UK King `150 × 200 cm`. `SIZE_MAPS.eu`, size-reserve auto-detect, size-guide European table, preview picker. No invented price — set the variant in Admin (`custom.market` = `eu`, SKU `european-king`).

### Landing pages v2
Four paid-test landings plus configure, in the live theme (grounds, Outfit, inverse CTAs, card fills). Not the mock’s Instrument/Inter/ember HTML.

| Preview | Template | Suggested page handle | Inline preselect |
|---|---|---|---|
| `preview/pages/large-sizes.html` | `page.large-sizes` | `large-sizes` | emperor |
| `preview/pages/european-king.html` | `page.european-king` | `european-king` | european-king |
| `preview/pages/specification.html` | `page.specification` | `specification` | none |
| `preview/pages/what-it-buys.html` | `page.what-it-buys` | `what-it-buys` | super-king |
| `preview/pages/configure.html` | `page.configure` | `configure` | `?size=` |

v2 vs v1: inline size selector + **Add to basket** (`#configure`) instead of a Configure CTA band; cost tables replaced by “Built to be kept” prose; basket icon hidden while empty. Prices / trial / warranty / layer from Theme settings and mattress variants. Default `layout/theme` (same GTM + UTM as the rest of the storefront).

### Product PDPs (flags off)
Comfort layer, bed sheets, and pillows templates exist. Four flags default **false** (404 UI + noindex + no nav). Draft products still needed in Admin for a real HTTP 404 / sitemap.

---

## Already in the 9.3.0 line, still in this zip
- Per-market taglines, contact hours + time zone, legal entity, Trading as, brand name from Theme settings.
- Luxury reveals, hover/tap overlays (except Cool Touch thumbs, now captions under the image).
- Journal page template, Reserve removed from the header menu, basket persist on Back, size-radio dots fill only for sizes in the basket.
- Order-status page / App Proxy contract (lookup **off**).
- Launch spec: lead-time resolver, cart mix, COPY-LAUNCH mattress copy, empty `reviews.json`.
- Shopify variant prices. GB **Emperor** 200 × 200 cm. **Splitit** behind a toggle, default **off**, UK only.
- Klarna only when a client ID is set and the market is GB.

---

## After you upload (Admin, not in the zip)

1. **Online Store → Themes → Add theme → Upload zip** → choose this file. Do not publish until you have previewed it.
2. Create missing Pages if the live store still 404s: **journal**, **order-status**, **manufacturing**, plus landing handles `large-sizes`, `european-king`, `specification`, `what-it-buys`, `configure` (assign the matching templates).
3. Optional redirects: `/mattresses/large-sizes` → `/pages/large-sizes`, `/mattresses/european-king` → `/pages/european-king`, `/mattresses/specification` → `/pages/specification`, `/what-it-buys` → `/pages/what-it-buys`, `/configure` → `/pages/configure`, `/basket` → `/cart`.
4. Assign **Mattress product** on each landing hero / size table / inline configure and on Home → Size + reserve.
5. Confirm Theme settings: **GTM container ID**, **Trial nights**, **Warranty years**, comfort-layer prices, legal name, hours, market taglines.
6. Create the European King variant in Shopify if Europe should show a price.
7. Comfort tops, sheets, pillows, Splitit, and order-status lookup stay **off** until you turn them on on purpose.
