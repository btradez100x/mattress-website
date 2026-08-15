# 9.3.0 — easing-curve (named restore)

**Date:** 15 Aug 2026  
**This is a named rollback point**, not a SemVer export. `VERSION` was **not** bumped.

## Restore SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` snapshot | `35a221f` | Last deploy before the aesthetic-fix ask (~02:42, 15 Aug 2026) |
| Connect / `shopify-theme` snapshot | `e205c49` | Subtree of `valtora-theme/` at that moment |
| This freeze | *this deploy commit* | `35a221f` **plus** the one easing-curve token only |

`35a221f` message: *Fix homepage dark-band layout and keep the four brand durations.*

## What this freeze includes

Everything already shipped in `35a221f` / `e205c49`:

- Copy-spec, spec panel, section grounds
- Four durations: 120 / 280 / 450 / 600 + wipe
- Offer / press / swap full-bleed dark bands
- Product-page files present; flags **OFF** (`comfort_tops_enabled`, `sheets_enabled`, `pillows_enabled`)

**Plus** easing only, from `/Users/benacolatse/Downloads/10-BRAND-GUIDELINES-DEV.md` §3 Motion / §8 Tokens (~02:48):

- One curve: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`
- Never a second curve — leftover hover/panel `ease-out` uses `var(--ease)`
- Reveal / wipe / hero load already used `--ease`; durations unchanged

## What this freeze removes (work after ~02:51)

Do **not** treat these as part of this point:

- Aesthetic restore / card fills / Request-a-size redesign
- FAQ scroll unlock / `#specs` hash-open
- Size-guide table unclip / inverse-CTA audit
- `sectionsection--dark` class-space campaign
- Mobile tap-dot / qty centering

Those lived in `887a5ca` and `dd9bfa4` and are not in this tree.

## Package

- `preview-and-theme.tar.gz` — `preview/` + `valtora-theme/` at this freeze
- No Shopify zip / no VERSION bump (not an export; not “save a version”)

Restore locally:

```bash
tar -xzf checkpoints/9.3.0-easing-curve/preview-and-theme.tar.gz
```

Preview:

```bash
cd preview && python3 -m http.server 5173
```
