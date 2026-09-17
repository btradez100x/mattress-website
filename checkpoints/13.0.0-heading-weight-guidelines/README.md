# 13.0.0 — heading-weight-guidelines

**Date:** Thursday 17 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `a8ab33b05d606a58392216d4cad3892bd0511a89` |
| Connect / `shopify-theme` | `1dad045ef93b5d515abd56a173d1a8de6e40fbae` (CSS ship `fc95a7b`) |

## What shipped

Sitewide headings match the heavy Guidelines **700** H1 (“Built to last. Adjusted to suit.”), including Full specification.

- `css-variables.liquid`: emits `--heading-weight` from Brand setting (default **700**); v2 `h3`/`h4` use the token instead of locked 600.
- `base.css`: `:root` default `--heading-weight: 700`; v2 `h3`/`h4` and `.lp-svc h3` use `var(--heading-weight, 700)`; `.pdp-spec__lbl` on the token.
- `brand.css`: `.vspec__label` / `.pdp-spec__lbl` in heading-weight chrome; fixed invalid `h6 {{` double-brace rule.
- Preview: `base.css` / `brand.css` synced; `brand-boot.js` injects `--heading-weight`.
- `settings_data.json` remains `"heading_weight": "700"`.

Local Playwright after change: homepage H1 and `.vspec__label` both computed **700**.

## What was left out

- No VERSION bump. Cart layout / protected cart helpers untouched (font-weight only).
- Wordmark, body buttons, mono eyebrows / kickers stay fixed weights.
- Theme setting dropdown still allows 600 / 500; Guidelines default and repo settings stay 700.
- Pre-existing smoke fails unchanged (landing configure, Trade reply, section grounds).
