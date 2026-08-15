# 9.3.0 — market-copy-and-storefront-fixes

**Date:** 15 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `521389d` | Full combined storefront + market-copy pass |
| Connect / `shopify-theme` | `a5bf48d` | Subtree of `valtora-theme/` at this deploy |

## What shipped

Product flags **OFF**. One ease `cubic-bezier(0.22, 1, 0.36, 1)`. No invented commercial facts.

1. **Mobile size-row (≤899px)** — Add and −/+ centre-aligned between size text and price; radio left, price right.
2. **No customer-facing em-dashes** — `—` → `-` including size-request notes placeholder.
3. **Full specification rules** — hairlines span the full cream band.
4. **Request a size (mobile)** — solid card; title + body readable (not one-word columns).
5. **How it works** — swap-explainer uses `--max-width`, not a pinched `48rem`.
6. **Phone country code** — selector from market/`data-country` (UK +44, UAE +971, US +1, Ghana +233, Nigeria +234). Not prefilled `+971` on UK.
7. **Section grounds** — class via prepended space so `section section--dark` survives Shopify; Auto separates neighbours; Dark only when merchant chooses or offer/swap defaults.
8. **Size guide** — no inner-frame scroll; all rows on page scroll; UK table on GB, UAE table on AE; expat/comparison panel removed.
9. **Spec hover** — 120ms, `--ease`, underline/opacity. No bounce.
10. **Loading curve** — one `--ease` only.
11. **Specs from menu** — `#specs` opens Full specification, scrolls under sticky header, `spec_opened` once.
12. **All mobile menu anchors unlock** — close menu / clear `nav-open` / overflow before scroll; hashchange + pageshow; same-page tap still unlocks.
13. **YOUR ORDER card** — panel fill distinct from section ground; second reserve on `surface`.
14. **Product pages** — comfort layer, bed sheets, pillows exist; four flags default false (404 UI + noindex + no nav).
15. **`11-MARKET-COPY-AUDIT.md`** — footer, meta, taglines, measure-size, size-guide, FAQ size/pay, founder, lifestyle, manufacturing caption. `6-COPY-SPEC` homepage bodies already in `index.json`.

## What was left out

- Journal/blog “warm climates” articles (audit did not specify a replacement).
- FAQ “flown to the UK” (not in audit FROM/TO).
- Merchant schema em-dashes (not customer-facing).
- AE meta/tagline kept as existing minus banned `Premium Sleep` (not invented).
- Product sell flags stay **OFF**. Draft products still needed in Admin for real HTTP 404 / sitemap.
- VERSION bump / export zip / MAJOR freeze.

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-market-copy-and-storefront-fixes/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
