# 13.0.0 — heading-weight

**Date:** Tuesday 8 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `4e7a58f` |
| `shopify-theme` | `9ffb28b` |

Parented on Shopify Connect `84e58b1`. Only `config/settings_schema.json` was replaced. Password, lifestyle images, press, and Checkout cream were not shipped.

## What shipped

Theme settings → Brand. Heading weight is the second setting, immediately after Brand name (line 1), and before any header.

- Guidelines (700) — brand guidelines. Live default.
- Wordmark (600)
- Light (500)

The previous live schema (`84e58b1`) already had the select under Brand name, but that pair sat after the header “Brand name (only place to edit)”. The theme editor treats a header as a collapsed subsection, so the first Brand screen never showed the dropdown.

`data-heading-weight` on `<html>` sets `--heading-weight`. Instrument Sans headings follow 700, 600, or 500. The wordmark stays 600.

## What was left out

No copy changes. Password, lifestyle images, press, and Checkout cream were not shipped. Gold lines and section title weight stay under Design tokens.
