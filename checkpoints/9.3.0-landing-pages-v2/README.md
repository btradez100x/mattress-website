# 9.3.0 — landing-pages-v2

**Date:** Wednesday 26 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `b41f6bb` | Ship landing-page v2 with inline configure, UTM persistence, and GTM coverage |
| Connect / `shopify-theme` | `5ac6a3b` | Subtree of `valtora-theme/` at this deploy |

`b41f6bb` message: *Ship landing-page v2 with inline configure, UTM persistence, and GTM coverage.*

Templates are on Connect (`shopify-theme`). Storefront **Pages** at `/pages/large-sizes` etc. still 404 until they exist in Admin and are assigned these templates.

## What v2 changed vs v1

v2 of `files - landing pages.zip`. Implemented from `files - v2.zip` on the existing landing templates/sections (no second parallel set).

| Area | v1 | v2 |
|---|---|---|
| Bottom of each landing | Configure CTA band → `/pages/configure?size=` | **Inline size selector** + **Add to basket** (`#configure`) |
| Hero / header CTA | `/pages/configure?size=` | `#configure` (same page). Size preselected, not locked. `/pages/configure` kept as fallback |
| Specification | Ownership cost table | **Built to be kept** prose (v2 page) |
| What it buys | 25-year cost table | **Built to be kept** prose (v2 page) |
| European King card 3 | “[layer] to renew, not a new mattress” | “[layer] to renew, not [price]” |
| Basket icon | Hidden until 2 lines | Hidden while **empty** (count 0) |
| Analytics | lp_view, configure_*, add_to_basket, basket_view | Same v2 event names, plus purchase `size` + `transaction_id`, UTMs on every `vTrack` |

`page.configure` remains (brief still lists `/configure`; redirects still useful).

## Templates / handles

| Preview | Template | Suggested page handle | Inline preselect |
|---|---|---|---|
| `preview/pages/large-sizes.html` | `page.large-sizes` | `large-sizes` | emperor |
| `preview/pages/european-king.html` | `page.european-king` | `european-king` | european-king |
| `preview/pages/specification.html` | `page.specification` | `specification` | none |
| `preview/pages/what-it-buys.html` | `page.what-it-buys` | `what-it-buys` | super-king |
| `preview/pages/configure.html` | `page.configure` | `configure` | `?size=` |

Brief routes such as `/mattresses/large-sizes` need **URL redirects** in Admin (Shopify pages live at `/pages/{handle}`).

All five page templates use the **default `layout/theme`** (no layout override). They get the same GTM + UTM scripts as the rest of the storefront.

## GTM coverage

One container, from Theme settings `gtm_container_id` (current **GTM-MX9SHNSM**). No second ID. `tracking-pixels.liquid` does **not** load `gtm.js`.

| Surface | GTM head + noscript |
|---|---|
| `layout/theme.liquid` | Yes (all OS 2.0 templates including the five landing pages, homepage, cart, checkout page) |
| `layout/password.liquid` | Yes |
| `templates/gift_card.liquid` (`layout none`) | Yes (added this checkpoint; same settings gate) |

Shopify **native checkout** is not a theme layout. Attribution there is GTM/Shopify plus cart attributes (below).

## UTM behaviour

Read as **UTM** (not a new UTC product): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus `gclid` / `fbclid`.

1. First landing (any theme page, including the four landings, configure, homepage) captures query params.
2. Pushes `utm_first_touch` to the existing `dataLayer` (same queue as `vTrack`).
3. Persists first-touch in **sessionStorage**, **localStorage**, and a first-party cookie (`valtora_utm_first_touch`, 90 days).
4. Writes the same keys to **cart attributes** via `/cart/update.js`.
5. `ValtoraUTM.applyToHref` / `decorateLinks` append missing UTM params onto same-origin links so `/pages/configure?size=emperor` keeps incoming UTMs. Hash CTAs (`#configure`) stay on the current URL, so the query string is unchanged.
6. Cart / checkout navigations from the theme go through `withPersistedUtm`.
7. `vTrack` copies UTM keys onto every event (`lp_view`, `configure_start`, `configure_complete`, `add_to_basket`, `basket_view`, `begin_checkout`, `purchase`).

Native Shopify checkout is not fully theme-controlled. Theme checkout (`/pages/checkout`) keeps UTMs on the URL and on cart attributes. For `/checkout`, rely on GTM + Shopify attribution + those cart attributes.

## Config vs hardcoded

- Size prices: mattress product variants (`custom.enabled` respected). Preview: `data-size-price-config`.
- Trial nights: `trial_nights` (`[N]` / `[N]-night`). Default **100**.
- Warranty: `warranty_years` (`[X]`).
- Comfort layer named value: `comfort_layer_price_gb` / `_ae` (`[layer]`).
- Lead time (basket only): `lead-time` snippet / settings. Not shown on the landing selector.
- GTM ID: `gtm_container_id`.

## What was not invented

- Mock £3,199 / £3,299 / £299 / 30-night figures (settings / variants win).
- Instrument Sans / Inter / Geist / ember fills (live Outfit + brand tokens).
- Country of manufacture / “United Kingdom” origin line (brand rule: no made-in claim).
- Hand-tufted / 32cm + 5cm stack (live spec is **hand-assembled**, **37cm made up**).
- Duplicate size-table rows in the v2 mock.
- £6,000 comparison; Caesar 200×220; a fourth “things worth checking” card.
- Homepage `index.json` unchanged.
- Product flags remain **OFF**.

## Admin (create these Pages)

1. **Online Store → Pages → Add page** for each handle: `large-sizes`, `european-king`, `specification`, `what-it-buys`, `configure`.
2. Theme template: `large-sizes` / `european-king` / `specification` / `what-it-buys` / `configure`.
3. Redirects: `/mattresses/large-sizes` → `/pages/large-sizes`, `/mattresses/european-king` → `/pages/european-king`, `/mattresses/specification` → `/pages/specification`, `/what-it-buys` → `/pages/what-it-buys`, `/configure` → `/pages/configure`, `/basket` → `/cart`.
4. Assign **Mattress product** on each landing hero / size table / inline configure and on Configure → Size + reserve (same product as Home).
5. Confirm Theme settings: **GTM container ID**, **Trial nights**, **Warranty years**, comfort-layer prices.
6. In GTM, map `dataLayer` events: `lp_view`, `configure_start`, `configure_complete`, `add_to_basket` (primary metric), `basket_view`, `begin_checkout`, `purchase`, plus `utm_first_touch` and `scroll_depth` / `bounce`.

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-landing-pages-v2/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```

Open `/pages/large-sizes.html`, `european-king.html`, `specification.html`, `what-it-buys.html`, `configure.html`. Append `?utm_source=test&utm_medium=cpc&utm_campaign=v2` to confirm persistence onto Add to basket → cart.
