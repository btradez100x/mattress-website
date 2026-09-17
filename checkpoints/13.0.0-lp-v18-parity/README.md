# 13.0.0 — lp-v18-parity

**Date:** Thursday 17 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `efb8bcaa94b36f1add4ab82639f030411c95d82d` |
| Connect / `shopify-theme` | `cb477d234d6250b8b462852252f4a60cd9df7175` |

## What was wrong vs the HTML

- Preview assurance blocks sat **outside** `.lp`, so plaque CSS (`.lp .assure`) never applied — full-bleed unstyled text instead of the bordered three-panel plaque with Ember icons.
- Arrive section **bottom padding collapsed to 0** before `#configure`, so the dark band sat flush against size-reserve (HTML keeps full `--sec` / 88px).
- Size-reserve under LPs inherited **brand navy** (`#1F3A5F`) for body/headings instead of Carbon.

## What we fixed

- Wrapped preview assurance in `.lp`; hardened `lp.css` so `section.bone .assure` also styles; Ember `.ic` squares force `display:block`.
- Keep full arrive/dark section padding when followed by configure; only collapse consecutive light LP pads.
- Configure under LPs forces Carbon ink and bone `#E4E1DA` ground (no navy bleed).
- Kept: zip-stem handles, rearrangeable blocks, live size-reserve at `#configure`, dynamic From, Coolweave tokens, figures, `--heading-weight` 700, tracking, hidden lead time, `allowed_size_ids`. Cart protected.

## Intentional differences

- Shopify / preview header, footer, announcement colour, and brand wordmark (not the HTML NUMA shell).
- Live size-reserve picker vs the HTML stub list + "See all sizes" button.
- Reviews aggregate **4.96 / 500** from `reviews.json` (not the HTML placeholder 4.89 / 312).
- Heading weight **700** via `var(--heading-weight)` (HTML prototypes use 600).

## Left out

- No VERSION bump.
- Cart / `main-cart` / checkout protected surfaces untouched.
