# 10.1.0 — trade-page-and-collage-ground

**Date:** Wednesday 2 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **10.1.0** (`manufacturing-and-landing-cart`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `0ba9123` | Put Styled by Numa on snow so it no longer shares navy with the footer |
| Connect / `shopify-theme` | `78a6f1c` | Subtree of `valtora-theme/` at this deploy |

`0ba9123` sits on `992e5c4` (trade page). Together they ship the trade template and the collage colour.

Shopify Connect should pull `shopify-theme` onto the live theme. Connect can lag a minute or two after the GitHub push.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- Homepage **Styled by Numa** collage is snow (`ground: bg`, `--brand-bg` / `#F7F5F1`). Live had it on dark, the same navy as the footer. FAQ stays stone; footer stays navy.
- New `/pages/trade` (template `page.trade`) from the B2B brief. Reply copy is **within 5 working days, approximately**, driven by Theme settings → **Reply within (working days)** (`reply_working_days`, default 5) via `[D]` / `[D-days]` / `[D-reply]`. Trade email is `trade_email` (default `trade@numamattress.com`).
- Trade is in the header nav and in the footer as Trade and contract.
- Trade outcome section is stone, not navy, so it does not run into the footer.
- `VERSION` stays **10.1.0**.

## What was left out

- Shopify Admin page. Theme deploy cannot create it. Live `/pages/trade` 404s until a Page exists with handle **`trade`** and template **trade**.
- Mailbox `trade@numamattress.com` must exist on the store.
- Product flags. Comfort layer / sheets / pillows remain off.
- Contact email remains `hello@aligna.com`.
- No VERSION bump. No MAJOR freeze.

Restore:
```bash
tar -xzf checkpoints/10.1.0-trade-page-and-collage-ground/preview-and-theme.tar.gz
```
