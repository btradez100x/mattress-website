# 13.0.0 — heading-weight

**Date:** Tuesday 8 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `1162a1b` |
| `shopify-theme` | `e7592bd` |

## What shipped

Theme settings → Brand → Heading weight is the only switch. Faces stay Instrument Sans, Inter, and Geist Mono. The wordmark stays 600.

- Guidelines (700) — brand guidelines. Live default, so the store does not change until they pick another option.
- Wordmark (600) — same face, slightly looser tracking, matches the Onni London wordmark.
- Light (500) — the lighter previous page.

The buried Font set pair under Design tokens is gone. `data-heading-weight` on `<html>` drives the page.

## What was left out

No copy changes. Password, lifestyle images, press, and Checkout cream were not shipped.
