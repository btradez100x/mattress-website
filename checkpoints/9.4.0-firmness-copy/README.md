# 9.4.0 — firmness-copy

**Date:** Wednesday 26 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **9.4.0** (`landing-pages-and-gtm`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `69ce5d6` | Ship medium / medium firm copy so the storefront matches the new mattress module |
| Connect / `shopify-theme` | `b42859f` | Subtree of `valtora-theme/` at this deploy |

`69ce5d6` message: *Ship medium / medium firm copy so the storefront matches the new mattress module.*

Templates are on Connect (`shopify-theme`). Shopify Connect should pull this onto the live theme.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

From `/Users/benacolatse/Downloads/12-FIRMNESS-COPY.md`. No VERSION bump. Product flags stay **OFF**.

- Mattress feel is **Medium / Medium Firm**, not Soft / Medium Soft.
- Benefits block 1: **Decide later.** Flip is a choice between two good options, not a rescue from firmness. `Too firm? Flip it.` is gone.
- Product specs: flippable comfort layer is `10cm, 2cm 2540 over 8cm 2580`. Medium one side, medium firm the other.
- Size-reserve Stage A and configure: **Medium one side, medium firm the other. Turn it over whenever you want.**
- FAQ: feel, how to flip, and **What if I want it softer or firmer than that?** Comfort layers move it further either way.
- Homepage FAQ dropped **How does the replaceable layer work?** so the JSON stays at 16 blocks (Shopify zip upload limit). Swap explainer still covers replacement.
- Comfort layer selector: three structures (Soft / Medium Soft, Medium / Medium Firm, Firm), not three single firmnesses. Note: two of the three flip.
- Landing pages (specification, large sizes, European King, what it buys) no longer say firm on one face, soft on the other.
- Cart / order default firmness attribute is `Medium / Medium firm`.

## What was left out

- **First-customer stock policy.** Units already held are the old Soft / Medium Soft build (two per size, 5cm + 5cm). The site now describes the new module. Copy must match what actually ships; that choice was not made in this deploy.
- Comfort layer spec table still shows the old 5cm + 5cm soft/firm faces. Selector copy is the new three-structure wording; construction rows were not in the brief.
- SemVer export / zip. `VERSION` stays **9.4.0**.
- Product flags. Comfort layer / sheets / pillows remain off.
- Blog firmness guides (generic industry copy, not this mattress).
- `share/v4/` snapshot (updates on next `deploy-preview.sh`).

Restore:
```bash
tar -xzf checkpoints/9.4.0-firmness-copy/preview-and-theme.tar.gz
```
