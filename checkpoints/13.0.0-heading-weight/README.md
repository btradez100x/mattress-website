# 13.0.0 — heading-weight

**Date:** Tuesday 8 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `7d65775` |
| `shopify-theme` | `84e58b1` |

Parented on Shopify Connect `9ec4440` (merchant editor save). Only `settings_schema.json` and `assets/brand.css` were replaced. Password, lifestyle images, press, and that editor save were not shipped.

## What shipped

Theme settings → Brand → **Heading weight**, the dropdown directly under Brand name (line 1). Not under a second header. Not under Design tokens.

- Guidelines (700) — brand guidelines. Live default.
- Wordmark (600)
- Light (500)

`data-heading-weight` on `<html>` sets `--heading-weight`. Instrument Sans headings follow 700, 600, or 500. The wordmark stays 600.

The previous control sat under a Brand header named Heading weight. The theme editor treats that header as a collapsed group, so the select was not on the first Brand screen.

## What was left out

No copy changes. Password, lifestyle images, press, and Checkout cream were not shipped. Gold lines and section title weight stay under Design tokens.
