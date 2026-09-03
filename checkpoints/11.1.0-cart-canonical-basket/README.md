# 11.1.0 — cart-canonical-basket

**Date:** Thursday 3 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **11.1.0** (`cta-spec`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `a74ccce` | Make `/cart` the canonical order page from New mods v2 |
| Connect / `shopify-theme` | `062defe` | Subtree of `valtora-theme/` at this deploy |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two after the GitHub push. Hard-refresh `/cart`. `/pages/checkout` should send you to `/cart`.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Native `/cart` is the order surface. `/pages/checkout` redirects to `/cart`. Shopify hosted `/checkout` is payment only.
- Lead time stays the full-width Carbon band above the items. Below 720px it collapses to a compact strip with a **Why** disclosure (`lead_time_expand`).
- Summary is one aggregate line. Both Pay buttons read **Pay £x** / **Pay AED x**, with `begin_checkout` `source` of `summary` or `sticky_bar`.
- Concierge unpacking is optional (default on). Old mattress removal is a stepper counted by mattress line qty, not physical units. Split King = 1.
- Cart attributes: `Old mattress removal` (`N of N` / `None`), `Concierge unpacking` (`Yes` / `No - leave boxed in room of choice`).
- `basket_view` fires on `/cart` only, gated on the lead band.
- CTA 11.1.0 radius token kept on Pay (`--cta-radius`). Carbon fill kept from the basket spec.
- Copy: no “flown to the UK”, no “no questions asked”, “Handmade to order” → “Made to order”.
- `VERSION` stays **11.1.0**.

## What was left out

- Size-selector redesign from New mods v2 (`sizes.html`) was not implemented.
- GitHub Action still skips CLI `theme push` unless secrets are set. Live update depends on Connect.
- Shopify Admin still needs a 301 (or delete) of the Checkout **page** if `/pages/checkout` keeps serving.
- Packing slip, confirmation email, AIT delivery booking, and the order webhook must read the new attribute keys. Theme cannot do those four surfaces.
- Confirmation email must not hardcode “Included” for concierge.

Store: Numa Mattress (`7dbr1b-1q`). Storefront is password-protected: https://7dbr1b-1q.myshopify.com/

Restore:
```bash
tar -xzf checkpoints/11.1.0-cart-canonical-basket/preview-and-theme.tar.gz
```
