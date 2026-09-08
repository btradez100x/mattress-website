# 13.0.0 — brand-name-fields

**Date:** Tuesday 8 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `797870b` | Lockup and brand lines read Theme settings → Brand |
| Connect / `shopify-theme` | `2e3721d` | Subtree of `valtora-theme/` at this deploy (parented on `cb5970c`) |

Live update depends on **Shopify Connect** pulling `shopify-theme`. GitHub Action skips CLI push (secrets unset). Connect can lag a minute or two.

Change the name in Theme settings → Brand. Header, footer, password lockup, Trading as, and Styled by follow that field.

## What shipped (theme / code)

- Header, footer, and password lockup wordmark and descriptor come from Brand name and Product line. Not from separate lockup text fields.
- Ember ampersand is a checkbox again (Theme settings → Logo lockup).
- Duplicate lockup name fields (`oo_logo_two_line_*`, `oo_logo_three_line_*`) removed.
- Trading as and Styled by always show the Brand name, including after a saved “Styled by Numa” heading.
- Founder note, FAQ, manufacturing, landing copy, and share title replace frozen Numa with the Brand name.

## What was left out

- Lifestyle collage image fallbacks, press logos, `brand.css`, `theme-image.liquid`, and `password.json` stayed in the working tree.
- Emails: templates still bake from the current `brand_name` in `settings_data.json` via `scripts/bake-email-brand.py`. Not re-baked in this deploy.
- No VERSION bump. No MAJOR freeze.

## Rollback

**13.0.0 sticky-header** (before this brand-name wiring):

| Tree | SHA |
|---|---|
| `v9` | `5bb7b9d` |
| `shopify-theme` | `cb5970c` |
| Folder | `checkpoints/13.0.0-sticky-header/` |

Store: Numa Mattress (`7dbr1b-1q`).
