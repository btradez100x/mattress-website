# 11.1.0 — cta-spec

**Date:** Wednesday 2 Sep 2026  
**Export version:** `VERSION` and Shopify `theme_version` are **11.1.0** (`cta-spec`).

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | `preview/` + `valtora-theme/` at this deploy |
| `cta-spec-desktop.png` | Standalone spec page (hierarchy, radius 0) |
| `homepage-hero.png` | Homepage hero CTAs |
| `specification-cta.png` | Specification page CTAs |
| `configure-cta.png` | Configure / size picker CTAs |
| `large-sizes-cta.png` | Large-sizes landing header CTA |
| `cta-spec-mobile.png` | Spec page at 390px |
| `homepage-mobile.png` | Homepage at 390px (preview chrome is sticky) |

Restore:
```bash
tar -xzf checkpoints/11.1.0-cta-spec/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `1efe6e1` | CTA spec + standalone preview page |
| Connect source `v9` | `1efe6e1` | Forced with lease from the feature branch |
| Connect / `shopify-theme` | `09b672b` | Subtree of `valtora-theme/` at `1efe6e1` |

Shopify Connect should pull `v9` → `valtora-theme/` and/or `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` runs on the `v9` push and **skips** CLI `theme push` unless Action secrets are set.

Store: Numa Mattress (`7dbr1b-1q`). Storefront is password-protected: https://7dbr1b-1q.myshopify.com/

## What shipped

CTA specification from `numa-cta-spec.html`:

- **Radius 0** on the `--radius` token. Buttons, basket counter, and size cards follow it. Not 12px buttons.
- **Three levels:** primary (Carbon `#1A1A1A` fill, Snow text), secondary (hairline / `.btn--line` / `.btn--ghost`), quiet (underline / `.btn--quiet`).
- **Sizes:** small 11/20 40px (header, basket, in-card ADD), default 15/30 48px, large 19/38 56px on Checkout only (cart / reserve continue — not `main-checkout.liquid`).
- **States:** hover Graphite, active `#000`, focus Ember 2px / 3px offset, disabled Hair/Graphite. No scale, shadow, or gold fill.
- **On dark:** Snow fill / Carbon text. Secondary uses dark hairline.
- **Mobile:** stack and full-width below 600px. Gap 14px, 34px above a group.
- **Labels:** sentence case. **Reserve yours** / **See sizes and prices** unchanged. Never “Configure yours”.
- Standalone preview: `preview/cta-spec.html`.

Navy `#1F3A5F` / cream `#F7F5F1` / gold `#8A6D3B` stay for grounds, wordmark, eyebrows. Gold is not a button fill.

## Left out

- Checkout files (`main-checkout.liquid`, `page.checkout.json`, `preview/pages/checkout.html`) were not edited.
- `.size-row` chrome was not emptied. MarketShown tokenizer untouched. GH→GB catalog stays.
- Journal stays off the homepage.
- Live storefront password wall was not opened; verification is local preview + spec HTML.

Checkout was not modified. Legal name **Valtora FZE**.
