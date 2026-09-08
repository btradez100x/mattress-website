# 13.0.0 — section-lines

**Date:** Tuesday 8 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `0abe4eb` |
| `shopify-theme` | `d4dd811` |

## What shipped

The short gold hairline now sits under the section eyebrow, then the heading. Customer reviews no longer leaves that line on the rating block. The feel, Questions, As seen on, From social, Buy with confidence, How it works, and The changeable layer match Cool touch and the founder note.

Theme settings → Design tokens → Typography, beside Font set:

- **Gold lines under section titles** — checkbox, on by default. Off hides `hr.gold-rule`. Eyebrows stay.
- **Section titles** — Regular (Geist Mono 500) or Bold (Geist Mono 600). Default is Regular, the current look. Large headings stay on Font set.

Wired on `<html>` as `data-section-lines` and `data-eyebrow-weight`. The homepage preview config bar has the same two controls.

## What was left out

No VERSION bump. Emails, cart structure, password 404, lifestyle images, press assets, and Checkout cream were not shipped. Pair-card labels (The build / The feel) and Awards were left as labels, not section headings.
