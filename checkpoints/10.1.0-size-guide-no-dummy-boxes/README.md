# 10.1.0 — size-guide-no-dummy-boxes

**Date:** Wednesday 2 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `bf24e1a` | Remove the grey size-guide placeholder slabs |
| Connect / `shopify-theme` | `dfaa09c` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two after the GitHub push. Hard-refresh `/pages/size-guide` if the grey slabs are still cached.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Size Guide cards no longer show the grey filled mattress rectangles (or outline stand-ins). Those read as unfinished image placeholders.
- Each tile is name, centimetres, price, and Reserve this size.
- Brand guidelines: icons outline only, never filled; avoid cheap bed pictograms. Removing the graphic is the fit.
- Regression forbids `.size-guide-tile__shape`, `__plan`, and `__bed` dummy boxes.
- `VERSION` stays **10.1.0**.

## What was left out

- No replacement size pictogram. Centimetres already name the footprint.
- Product flags. Comfort layer / sheets / pillows remain off.
- Contact email remains `hello@aligna.com`.
- No VERSION bump. No MAJOR freeze.

Restore:
```bash
tar -xzf checkpoints/10.1.0-size-guide-no-dummy-boxes/preview-and-theme.tar.gz
```
