# 9.3.0 — size-guide-and-mobile-qty (surgical)

**Date:** 15 Aug 2026  
**This is a named deploy checkpoint**, not a SemVer export. `VERSION` was **not** bumped.

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `ec51aec` | Surgical size-guide + mobile qty set on top of the easing restore |
| Connect / `shopify-theme` | `9f03cf6` | Same `valtora-theme/` CSS + JS |
| Kept base (`v9`) | `c535af6` | `35a221f` plus one easing curve |
| Kept base (Connect) | `a4e8bf7` | Same `valtora-theme/` tree as `c535af6` |

`ec51aec` message: *Fix size-guide contrast, unclip the sizes table, and space mobile qty controls.*

## What shipped

Kept `35a221f` + easing (`--ease: cubic-bezier(0.22, 1, 0.36, 1)`, durations 120 / 280 / 450 / 600). Product flags **OFF**.

Five surgical fixes only:

1. **Inverse dark primary CTA** — `.section--dark` / `[data-section-ground="dark"]` primary `.btn` uses `--brand-on-dark` fill + `--brand-primary` text (Snow on Carbon 16.4:1). Ember is never a button fill.
2. **Size-guide table** — `.size-guide-page .table-wrap` / `.policy-table` overflow visible, no max-height clip; `.size-table` `min-width: 0`. All rows including Emperor. Page scroll only.
3. **Mobile Add / −/+ track** — `≤899px`, size rows (not Request) use a centred qty column with a real gap from size copy. Price stays right; radio stays left. Desktop grid unchanged.
4. **Mobile tap-to-add** — `≤899px`, tap the size row / radio adds once. Already in basket → select only. Desktop still uses Add. Dots fill only when in basket.
5. **Request a size** — hide the qty spacer; 3-column text track (`1rem minmax(10rem, 1fr) auto`); solid fill matching size rows. CUSTOM stays visible. No inner scrollbar. No site-wide card rewrite.

## What was left out

- Aesthetic restore / card-system rewrite
- Request-a-size form redesign
- FAQ scroll unlock / `#specs` hash-open
- `sectionsection--dark` class-space campaign
- Padding-token rewrite
- VERSION bump / export zip

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this deploy
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-size-guide-and-mobile-qty/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
