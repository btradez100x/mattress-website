# 10.1.0 — adjust-to-desire (29 August pack)

**Date:** Saturday 29 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `cec14f1` | Ship the 29 August review pack |
| Connect / `shopify-theme` | `23579e7` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` (or `v9` → `valtora-theme/`) onto the live theme. Connect can lag a minute or two after the GitHub push. The GitHub Action `Deploy Shopify theme` also runs on push to `v9`.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Variant-driven size selector: market tabs, full-width rows, ember left rule, per-row stepper, optional note (`Anything we should know`), policy strip.
- First click adds one unit; stepper owns quantity; several sizes can sit in the basket. Landing qty syncs with `/cart/add.js` then `/cart/change.js`. No redirect on first add.
- Construction **20cm core / 10cm layer / 35cm / 1.8 / 2.0mm wire**. Product metafields `depth_cm` / `core_depth_cm` / `layer_depth_cm` override specs when set.
- Copy: **Adjust to Desire** (year), Handmade → Made to order, Ben Acolatse, keep-every-layer, **Made by experts who have been making mattresses for 49 years** (Manufacturing + footer). Legal name stays **Valtora FZE**.
- Homepage: **Built to last. Adjusted to suit.** Two-card band (The build / The feel). big-idea and swap-process disabled. Founder note rewritten. Specification drops Built to be kept (kept on what-it-buys). Manufacturing size grid is UK six only.
- Policy settings: `return_window_days` 30, `adjustment_period_months` 12. Trial / terms / refunds / privacy / warranty rewritten. Emails 07/13/16 baked.

Checkout was not modified (it is part of testing).

## What was left for Admin

- Create metafields and SKUs from the workbook; add Small Double and US variants; Single inventory; GBP→AED rate.
- Cole Commerce Ltd later if that becomes the entity.
- Live pages still need Admin pages if they 404.

Restore:
```bash
tar -xzf checkpoints/10.1.0-adjust-to-desire/preview-and-theme.tar.gz
```
