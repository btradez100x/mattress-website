# 10.1.0 — late review (29 August evening)

**Date:** Saturday 29 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | `preview/` + `valtora-theme/` snapshot |
| `Valtora-Shopify-Theme-10.1.0-late-review.zip` | Theme zip for Shopify upload if Connect lags |

Restore:
```bash
tar -xzf checkpoints/10.1.0-late-review/preview-and-theme.tar.gz
```

## Deploy SHAs

Filled after push. Feature branch `cursor/lates-changes-29th-2577`. Connect watches `v9` → `valtora-theme/` and `shopify-theme`.

## What this pack contains

- Journal: six sleep/expertise notes baked into the theme; byline **Ben Acolatse, CEO**. Index is never empty.
- Size picker: no country tabs; one market from Shopify/browser (UK if unset); centimetres from variant dimensions; size-row styles restored.
- Size Guide: all Shopify sizes for that country as tiles; UK fallback.
- How it is made: 20/10/35, 1.8/2.0mm, UK six, 49-year line, how-it-is-built brief.
- Copy: feel discovered over months, a year with us; Concierge unpacking **Complimentary**; CTAs **Reserve yours**; hero **Built to last.** / **Adjusted to suit.** on two lines.
- URL redirect CSV: `docs/shopify-url-redirects.csv`.

Checkout was not modified.

## Admin leftovers

- Create Page **Journal** (handle `journal`, template **journal**) if `/pages/journal` 404s.
- URL redirects via Content → Menus → URL redirects (or paste `/admin/redirects`).
- Shopify Markets so currency matches the shopper’s country.
