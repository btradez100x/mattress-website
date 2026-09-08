# 13.0.0 — order-panel-and-logo-svg

**Date:** Tuesday 8 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `956d8cc` | Order panel no longer covers Add. Outlined lockup SVGs in the theme. |
| Connect / `shopify-theme` | `bb55871` | Subtree of `valtora-theme/` at this deploy (parented on `2e3721d`) |

Live update depends on **Shopify Connect** pulling `shopify-theme`.

## What shipped

- Your order sits beside the size list only when both columns fit. Below that it sits under the list and cannot cover Add.
- Size sections follow the size name when the SizeType metafield is empty.
- Outlined lockup SVGs from the logo package are in `assets/logo-svg/` for email, checkout upload, and social. Ember checkbox and live-text lockup were already live (`797870b` / `2e3721d`).

## What was left out, and why

These were in the working tree and would break the live store if pushed:

- `password.json` points the password page at the 404 section.
- Collage `.webp` files are deleted.
- `brand.css` removes the cream-on-navy Checkout lock.
- Press and theme-image drop the lazy/low-priority flags the storefront relies on.

Emails were not re-baked. `settings_data.json` brand name is still `Numa`, so a bake would write Numa again. Checkout logo still has to be uploaded in Shopify Settings → Checkout. Theme code cannot set that.

## Rollback

**13.0.0 brand-name-fields:**

| Tree | SHA |
|---|---|
| `v9` | `797870b` |
| `shopify-theme` | `2e3721d` |
| Folder | `checkpoints/13.0.0-brand-name-fields/` |

Store: Numa Mattress (`7dbr1b-1q`).
