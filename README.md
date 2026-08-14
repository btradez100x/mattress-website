# Valtora - Shopify theme

Premium deposit-taking Shopify theme for the Valtora mattress brand (name under test), built to the Brand Guidelines and Website Developer Spec (August 2026).

## What’s included (MVP: Spec §14 items 1-5)

1. **Theme + design tokens + name-as-setting** - colours, fonts, and brand name are theme settings. Wordmark is rendered in HTML/CSS (not an image).
2. **Deposit / reserve flow** - size + price tier capture, cart line properties, checkout handoff. Wire a deposit app for the refundable amount.
3. **Per-market sizing** - UAE vs UK size lists with cm dimensions (auto via Markets, or forced per page).
4. **UTM first-touch persistence** - captures `utm_*` on landing, stores in localStorage/cookie, writes cart attributes for order export.
5. **Base copy deck** - Spec §6 defaults loaded into modular, reorderable sections. Duplicate `page.landing` for segment/territory/name variants.

## Theme location

```
valtora-theme/
```

## Quick start

1. Create a Shopify store (Basic or above). Enable **Shopify Markets** for UAE + UK.
2. Install Shopify CLI and log in:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   shopify auth login
   ```
3. From this repo:
   ```bash
   cd "valtora-theme"
   shopify theme dev --store your-store.myshopify.com
   ```
4. Or push as unpublished theme:
   ```bash
   shopify theme push --unpublished
   ```

## Deploy from GitHub (no file-by-file paste)

Two options. Both replace zip upload and Edit code paste.

**A. Shopify → Connect from GitHub (simplest)**  
Online Store → Themes → Add theme → **Connect from GitHub** → this repo → branch `v9` → folder `valtora-theme`. Shopify pulls on every push. Do not connect the repo root (that is not a theme).

**B. GitHub Action** (`.github/workflows/deploy-shopify-theme.yml`)  
Add three repo secrets: `SHOPIFY_STORE`, `SHOPIFY_CLI_THEME_TOKEN`, `SHOPIFY_THEME_ID`. Push to `v9` / `main` updates that theme. Theme Access token: Shopify Admin → Settings → Apps and sales channels → Develop apps → app with **Theme** access → install → reveal token.

## Theme editor checklist

| Setting | Where | Notes |
|---|---|---|
| Brand name | Theme settings → Brand | Changes wordmark + `[Brand]` tokens site-wide |
| Palette / fonts | Theme settings → Design tokens | Defaults: navy `#1F3A5F`, gold `#8A6D3B`, Cormorant + Manrope |
| Deposit product | Size + price + reserve section | Create a low-price deposit SKU; connect Downpayment / PreProduct / similar |
| Pixel IDs | Theme settings → Tracking | Meta, GA4, Google Ads, TikTok, Snapchat |
| Size list | Size + reserve section | Auto / force UAE / force UK |

## Store setup (outside theme)

1. **Deposit product** - e.g. “Reserve your allocation” at AED 200 / £50. Use a deposit/pre-order app so checkout charges the deposit and attributes carry through.
2. **Mattress product (optional)** - full-price catalog for later; reserve flow is primary conversion.
3. **Replacement tops** - product type `Replacement top` or tag `replacement-top`; variants = firmness × market size.
4. **Pages** - create Size guide and assign template `page.size-guide`. Create Delivery, Refunds, Lead times; link from Footer.
5. **Segment variants** - Online Store → Pages → create page → template `landing`. Edit hero copy/tokens per Spec §6.2 / §6.10. Track with `utm_content=seg1-west` etc.
6. **BNPL** - UAE: Tabby + Tamara; UK: Klarna/Clearpay (apps, not theme code).
7. **Consent** - UK GDPR opt-in via Shopify Customer Privacy / consent banner app.

## UTM schema (use verbatim)

| Param | Values |
|---|---|
| `utm_source` | `meta` / `snapchat` / `tiktok` / `google` |
| `utm_medium` | `paid-social` / `paid-search` |
| `utm_campaign` | `s1-adaptive` / `s1-cool` / `s1-support` / `s1-lux` / `s1-perf` |
| `utm_content` | `seg1-west` / `seg2-ind` / `seg3-arab` / `seg4-new` (+ `-v2`) |
| `utm_term` | creative id |

First-touch UTMs land on the order as cart attributes for admin export.

## Territory hero copy (for variants)

| Variant | H1 | Sub |
|---|---|---|
| Adaptive (default) | Change your comfort, not your mattress. | The premium hybrid with a replaceable comfort top… |
| Cool-sleep | Engineered to sleep cool. Built for where you live. | A 37cm premium hybrid for hot nights… |
| Support | Wake up without the ache. | A 7-zone spring system and deep support base… |
| Luxury | Made to order. Made to last. Made for the few. | A limited allocation of premium hybrid mattresses… |

## Name A/B

Change **Brand name** globally, or set **Brand name override** on Header / Hero for a duplicated landing page (Amara, Nadira, Aeris). Do not bake the name into image files.

## Specs reference

Extracted source docs live in `/docs`.

## Regression pack

- Full manual + acceptance suite: [`docs/REGRESSION_PACK.md`](docs/REGRESSION_PACK.md)
- Results log: [`docs/regression-results.md`](docs/regression-results.md)
- Automated smoke + **deploy** (run this every time you publish preview):

```bash
./scripts/deploy-preview.sh
```

That command always:
1. Runs `./scripts/regression-smoke.sh` (blocks on failure)
2. Syncs `preview/` → `share/v4/`
3. Refreshes the external public link and writes `share/PUBLIC_URL.txt`

Smoke only:

```bash
./scripts/regression-smoke.sh
```

## Not in this MVP (Spec §14 items 6-9)

- BNPL widgets (install apps per market) - logos already shown in theme (S15)
- Lifecycle email flows for replacement tops
- Full UK GDPR/SEO depth and Arabic RTL storefront
- Real photography / unzip-and-swap video (placeholders flagged in sections)

## Trust layer (Spec S15)

Implemented in theme. Store setup checklist: [`docs/S15_TRUST_SETUP.md`](docs/S15_TRUST_SETUP.md).
