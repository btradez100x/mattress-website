# 13.0.0 — lp-v18-visual-parity

**Date:** Wednesday 16 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `2ec8e7c5065dc4bbf7fea000bb06b83371841ce6` |
| Connect / `shopify-theme` | `8ba06d75bbb08ad648184c008ea7478fdd6f4529` |

## What shipped

Visual parity pass against `numa-landing-pages-v18.zip` for the nine zip-stem handles.

### What was wrong vs the HTML
- `lp.css` had been retuned to brand **72/128** section rhythm and top-only pads; the HTML uses `--s7:88px` / `--sec` with padding on both sides, and a full `--sec` hairline before reviews/press.
- Klarna pay chips used pink colour marks; the HTML is mono hairline chips only.
- Assurance sat **before** `#configure` on most templates; the HTML puts the plaque after size selection inside the bone configure block.
- Mobile-fit global `.hero h1` clamp could fight LP prototype type on small screens.

### What we fixed
- Regenerated scoped `lp.css` from the v18 prototype styles (`--s7:88px`, `--sec:var(--s7)`, section padding both sides, line margin `--sec`), keeping `var(--heading-weight, 700)`, layers CSS, and theme integration.
- Plain mono Klarna chips (Visa…Klarna 3 / 24) — no pink badges.
- Moved assurance after configure in page JSON + preview; bone ground on assurance; configure under LPs uses bone `#E4E1DA` at 88px pad.
- Guarded LP hero type scale in `mobile-fit.css`.
- Reviews stay visible **4.96** out of 5; press wordmarks (no awards); lead time hidden; dynamic From; zip-stem handles; cart protected files untouched.

### Browser compare
- Desktop + mobile screenshots: `size`, `premium`, `temperature` vs zip HTML — hero grid, size strip, pay, reviews, press match the prototype layout.

## What was left out

- No VERSION bump.
- Cart / main-cart protected files untouched.
- Site chrome (announcement colour, store nav/logo) differs from the standalone HTML shell by design.
- Pre-existing smoke fails (legacy landers, Trade reply copy, section grounds) left as-is.
