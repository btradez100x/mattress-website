# 11.1.0 — size-selector-rows

**Date:** Thursday 3 Sep 2026  
This is a named deploy checkpoint (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **11.1.0** (`cta-spec`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `e1bdf81` | SizeType tabs, column header, size-help, row selector |
| Connect / `shopify-theme` | `c29e527` | Subtree of `valtora-theme/` at this deploy |

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Hard-refresh: `/pages/configure` and the homepage `#reserve` section.

## What shipped (theme / code)

- Four-column **row** selector (not the card grid)
- Footprint drawn to scale in a shared dashed frame
- Add → − / + quantity, capped at 20
- **SizeType tabs** when there are more than five mattress sizes and more than one category. Count rule, never `if market == UAE`. Home market first.
- Column header **Size / Footprint, drawn to scale / Each / Quantity** as a sibling of the list (not an `<li>`)
- **Not sure which size you need?** helper
- Variant JSON now includes `custom.SizeType` (list)

## What was left out

- Availability states Notify me UI from `numa-size-selector-states.html`
- Dedicated mobile order sheet / “Add N mattresses to basket” label
- New `preview-and-theme.tar.gz` (disk was full; do not restore old 9.x/10.x tars)

Store: Numa Mattress (`7dbr1b-1q`).
