# 9.4.0 — numa-pages-emails

**Date:** Saturday 29 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **9.4.0** (`landing-pages-and-gtm`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `d4609b4` | Ship about, recycling, 30-day trial, and lifecycle emails so live pages can be created |
| Connect / `shopify-theme` | `eefa9e9` | Subtree of `valtora-theme/` at this deploy |

`d4609b4` message: *Ship about, recycling, 30-day trial, and lifecycle emails so live pages can be created.*

Templates are on Connect (`shopify-theme`). Shopify Connect should pull this onto the live theme. **Create Admin pages** with handles `about` and `mattress-recycling` and assign templates `page.about` and `page.mattress-recycling`. Existing landing handles still need pages if they 404.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

From `/Users/benacolatse/Downloads/numa-complete`. No VERSION bump. Product flags stay **OFF**.

- Templates `page.about` and `page.mattress-recycling`. About in header and footer. Recycling linked from the basket (mandatory).
- Landing copy for large sizes, European King, specification, and what it buys. Depth **35cm**. Comfort layer named value **£299**. Verb is **make**.
- **30-day** sleep trial. Emperor is not covered by the 30-day return trial. Statutory rights sentence unchanged.
- Banner: Concierge unpacking **included with every mattress**, dismissible per session.
- Basket: Old mattress removal and recycling **Complimentary** with link “We carry the cost. Read what happens to it”. Concierge unpacking **Included**.
- Sixteen lifecycle emails in `emails/`. Short name and wordmark from Theme settings → Brand name (line 1), first word only. Product line is not used. Shopify is an event source only.

## What was left out

- Shopify Admin pages at handles `about` and `mattress-recycling` (create these now; assign the new templates).
- Optional redirects `/mattresses/large-sizes` → `/pages/large-sizes`, and the same pattern for european-king / specification / what-it-buys.
- ESP flows and the five custom event webhooks (`order_in_production`, `delivery_booked`, `delivered`, `layer_requested`, `return_requested`).
- SemVer export / zip. `VERSION` stays **9.4.0**.
- Product flags. Comfort layer / sheets / pillows remain off.

Restore:
```bash
tar -xzf checkpoints/9.4.0-numa-pages-emails/preview-and-theme.tar.gz
```
