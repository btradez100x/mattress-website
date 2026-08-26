# 9.4.0 — go-live

**Date:** Wednesday 26 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **9.4.0** (`landing-pages-and-gtm`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | *pending* | Go-live theme pass from `numa-go-live.md` |
| Connect / `shopify-theme` | *pending* | Subtree of `valtora-theme/` at this deploy |

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

From `/Users/benacolatse/Downloads/numa-go-live.md`. No VERSION bump. Product flags stay **OFF**.

- Header fallback nav: The mattress, Sizes (Large sizes, European King, Size guide), Specification, How it is made, Journal. Nested Shopify menus render if assigned in Admin.
- Footer: Shop / Help / Policies. `privacy_link`, `terms_link`, `cookies_link` filled. Policies **Refunds** → `/pages/refunds`. Configure / trust bar still use `/pages/refunds-deposit`.
- Shop accessories (Comfort layer, Bed sheets, Pillows) only appear when those product flags are on. Flags remain false.
- Configure `leadtime_placement` **inline**. 8 to 10 week line (`lead_time_line`, still includes Current window) sits above Add to basket on configure and on landing-funnel configure.
- `warranty_years` **25** and `trial_nights` **100** stay explicit. Hardcoded 100-night / 100 nights copy now uses `[N]` / `[N]-night` tokens.
- Reviews section **off** (`reviews_enabled` false; social-proof `enable_section` false). Social clips stay disabled.
- `page.landing` and `page.checkout` kept. Checkout is the funnel destination when continue path is blank. Landing is unassigned until you create a page for it.
- Both `product.comfort-layer` and `product.comfort-top` kept. Live handle in the theme is `comfort-layer`. Neither is public while flags are off.

## What was left out (Admin, legal, or not in the brief as code)

- Shopify Pages at the handles in stage 02 (including mismatched `100-night-trial` → template `trial`, `delivery-lead-time` → `delivery`, `refunds-deposit` → `refunds`).
- Admin Navigation menus. Theme fallback ships the header/footer without them.
- Custom domain as primary, password off, Markets / AED, Single inventory, European King SKU, UAE-sized variants.
- Klarna client ID, GB legal entity, origin-story copy, Emperor trial carve-out (legal question).
- Comfort layer / sheets / pillows flags. Copy still talks about the replaceable layer; `[layer]` still resolves from Theme settings (£250 / AED 1,200), not from a live product.
- Deleting `page.landing`, `page.checkout`, or `product.comfort-top`.
- Invented legal copy, prices, or warranty/trial lengths other than the settings already in the theme.

Restore:
```bash
tar -xzf checkpoints/9.4.0-go-live/preview-and-theme.tar.gz
```
