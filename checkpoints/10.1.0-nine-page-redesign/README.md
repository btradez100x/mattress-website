# 10.1.0 — nine-page-redesign

**Date:** Wednesday 2 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `faf9f3e` | Ship the nine-page redesign so specification, manufacturing, and support match the supplied media pack |
| Connect / `shopify-theme` | `c650a1c` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two after the GitHub push. Hard-refresh `/pages/specification`, `/pages/manufacturing`, `/pages/about`, `/pages/support`, and the five landing pages.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Specification rewrite: hero, five-figure strip, eight numbered layers with `.layer-benefit`, argument, Adjust to Desire.
- Manufacturing replacement: factory videos (poster first; `preload="none"`; no `src` until scroll), materials, process.
- About: existing year-with-us copy, media, fifteen centimetres of comfort.
- Support: health / back-pain page.
- Landing pages (large-sizes, european-king, cooling, split-king, what-it-buys): media + spec figures. Shopify size picker kept.
- Nav: The mattress (→ specification), How it is made, Support, About, Trade.
- Spec figures everywhere: 20cm core, 15cm comfort, 35cm total.
- Tracking: `video_start`, `video_complete`, `spec_layer_view`, `spec_scroll_complete`, `media_gallery_view`, with `lp_variant` and `session_id`.
- `VERSION` stays **10.1.0**.

## What was left out

- No VERSION bump. No MAJOR freeze.
- Emails unchanged.
- `sections/manufacturing.liquid` is unused (templates use `redesign`).
- `share/v4` still has the previous nav and bodies.
- Shopify Admin cannot be created by a theme push. Existing Pages must keep templates **specification**, **manufacturing**, **about**, **support**, **large-sizes**, **european-king**, **cooling**, **split-king**, **what-it-buys**. `/pages/trade` still 404s until a Page with handle **trade** and template **trade** exists.

Restore:
```bash
tar -xzf checkpoints/10.1.0-nine-page-redesign/preview-and-theme.tar.gz
```
