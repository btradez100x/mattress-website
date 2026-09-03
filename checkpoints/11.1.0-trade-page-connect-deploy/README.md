# 11.1.0 — trade-page-connect-deploy

**Date:** Thursday 3 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **11.1.0** (`cta-spec`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `48a088d` | Trade page refresh commit |
| Connect / `shopify-theme` | `99dc00c` | Safe merge of the latest `valtora-theme/` subtree onto the current remote theme branch |

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped

- Replaced the old Trade funnel JSON with the new `main-trade` section template.
- Added `valtora-theme/sections/main-trade.liquid`, `valtora-theme/assets/trade.css`, and the Trade photography set.
- Updated Trade SEO title and description for the theme and preview.
- Mirrored the same Trade page refresh in `preview/` for parity.
- `VERSION` stays **11.1.0**.

## What was left out

- Shopify Admin cannot create the page from theme code. If `/pages/trade` still 404s, create a Page with handle **`trade`** and theme template **trade**.
- Mailboxes used on the page still need to exist in the store setup, especially **`trade@numamattress.com`**.
- Existing unrelated working-tree changes outside the Trade deploy scope were not included in the deploy commit.
- No VERSION bump. No MAJOR freeze.

## Store notes

- Branch `v9` now contains the Trade refresh commit.
- Branch `shopify-theme` required a safe merge because Shopify had already added two newer remote commits.
- Hard-refresh `/pages/trade` after Connect pulls the new theme branch.

Restore:
```bash
tar -xzf checkpoints/11.1.0-trade-page-connect-deploy/preview-and-theme.tar.gz
```
