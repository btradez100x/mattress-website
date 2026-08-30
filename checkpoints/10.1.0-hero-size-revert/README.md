# 10.1.0 — hero size revert

**Date:** Sunday 30 Aug 2026  
Named deploy checkpoint. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | Committed `preview/` + `valtora-theme/` at `930d28a` |

Restore:
```bash
tar -xzf checkpoints/10.1.0-hero-size-revert/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `930d28a` | Homepage light-hero max-height band restored |
| Connect / `shopify-theme` | `4deb141` | Same `assets/base.css` hero caps for live |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` still skips CLI `theme push` unless secrets are set.

Checkout was not modified.

## Restored from

Light-hero media sizing from **`79db8e6`** (parent of `070a1cb`; same caps as `checkpoints/10.1.0-size-picker-and-contrast` / `10.1.0-late-review`).

`070a1cb` (“Show the full hero mattress on desktop and mobile”) had switched `.hero--light .hero__media img` to `height: auto`, `max-height: none`, `object-fit: contain`, so the 2000×1116 photo filled ~60–70% of the viewport.

Put back:

- default: `max-height: min(52vh, 30rem)`; `object-fit: contain`
- ≤899px: `max-height: min(42vh, 20rem)`
- ≥900px: `max-height: min(58vh, 36rem)`

Headline **Built to last. Adjusted to suit.** stays a single line (no extra `<br>` / no `newline_to_br`). Buttons **See sizes and prices** / **How it arrives** unchanged.

## What was left out

- Cool Touch cream-on-navy, size picker restore, Journal, About, manufacturing copy, unpacking section, note field, pair-cards, `.size-row` CSS — not touched.
- Checkout not modified.
- `VERSION` stays **10.1.0**.

Store: Numa Mattress (`7dbr1b-1q`). Legal name Valtora FZE.
