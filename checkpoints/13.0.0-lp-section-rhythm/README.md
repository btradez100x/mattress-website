# 13.0.0 — lp-section-rhythm

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `51d0487` |
| `shopify-theme` | `449c96d` |

## What shipped

CSS-only landing-page vertical rhythm aligned to brand §12 spacing:

- `--sec` → brand `--space-section` (**72px** mobile / **128px** desktop at 860px)
- Section padding top-only (no 2× stacked empties); last section keeps bottom pad
- Same-ground neighbours (`bone+bone`, `dark+dark`) use `--s5` (48px), not a full second section
- Hero `.line` uses **24px** (brand hairline ~22px) unless `.press` follows (then `--sec`)
- Assurance-only blocks drop extra `margin-top`
- Homepage `#press` + `#configure` under LPs forced to brand 72/128; adjacent tops collapsed
- Theme + preview `lp.css` synced

## What was left out

- No Liquid/JSON edits (avoids fighting parallel LP agents)
- No VERSION bump
- Cart untouched
