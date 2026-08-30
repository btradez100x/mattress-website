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

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `060d884` | Late review pack + export checkpoint |
| Connect / `shopify-theme` | `5b121bb` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` (or `v9` → `valtora-theme/`) onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` runs on push to `v9` (skips CLI push if secrets are missing).

## What this pack contains

- Journal: six sleep/expertise notes baked into the theme; byline **Ben Acolatse, CEO**. Index is never empty.
- Size picker: no country tabs; one market from Shopify/browser (UK if unset); centimetres from variant dimensions; size-row styles restored.
- **Picker chrome lock:** `.size-option` and `.size-row` share one card system. Do **not** empty `.size-row` CSS. Selected is navy hairline + navy-tint, not `--brand-surface` beige. ADD/qty centred. Last odd cell (`:last-child:nth-child(odd)`) spans/centres so Emperor cannot leave a hole. No grey 1:1 dummy squares. Note-field contrast (c0b2830) stays. Smoke: `scripts/regression-smoke.sh` + `scripts/regression-consistency.py`.
- Size Guide: all Shopify sizes for that country as tiles; UK fallback.
- How it is made: 20/10/35, 1.8/2.0mm, UK six, 49-year line, how-it-is-built brief.
- Copy: feel discovered over months, a year with us; Concierge unpacking **Complimentary**; CTAs **Reserve yours**; hero **Built to last.** / **Adjusted to suit.** on two lines.
- URL redirect CSV: `docs/shopify-url-redirects.csv`.

Checkout was not modified.

## Admin leftovers

- Create Page **Journal** (handle `journal`, template **journal**) if `/pages/journal` 404s.
- URL redirects via Content → Menus → URL redirects (or paste `/admin/redirects`).
- Shopify Markets so currency matches the shopper’s country.
