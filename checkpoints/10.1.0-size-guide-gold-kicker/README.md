# 10.1.0 — size-guide-gold-kicker

**Date:** Wednesday 2 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `8260b26` | Centre the Size Guide gold stub under the Next kicker |
| Connect / `shopify-theme` | `8f906fc` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute. Hard-refresh `/pages/size-guide`.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Size Guide **Next** gold rule sits under the kicker, not against the left of the band.
- Cause: `brand.css` last-wins reset `.gold-rule` to `margin-left: 0` after `.policy-cta .gold-rule { margin-inline: auto }`.
- Kickers on this page are a shrink-wrapped `.gold-kicker` stack. The centred Next stack uses `.gold-kicker--center`.
- Brand stub stays **40px / 2.5rem**.
- `VERSION` stays **10.1.0**.

## What was left out

- Other policy Next bands get the CSS last-wins; only Size Guide markup uses `.gold-kicker` so far.
- No VERSION bump. No MAJOR freeze.

Restore:
```bash
tar -xzf checkpoints/10.1.0-size-guide-gold-kicker/preview-and-theme.tar.gz
```
