# 9.2.0 — emperor-splitit-review (check export)

**Export:** `Valtora-Shopify-Theme-9.2.0-emperor-splitit-review.zip`

Review package. Version number was **not** bumped (`VERSION` and Shopify `theme_version` stay `9.2.0`). This does not replace `9.2.0-order-status-app-proxy` or `9.2.0-launch-spec-review`.

Includes, on top of the Shopify-prices + Klarna work:

- GB **Emperor** size, 200 × 200 cm (preview listed, not yet available; £3,599 is a preview stand-in until you set the Shopify price)
- Size guide maps UAE Super King 200×200 to UK Emperor
- **Splitit** behind `splitit_enabled` + merchant ID, both required, default off, UK only. Off means no script, no markup, no customer-facing mention
- `begin_checkout` sends `size` so Klarna-cap drop-off on King / Super King / Emperor can be measured

- `Valtora-Shopify-Theme-9.2.0-emperor-splitit-review.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/`

Admin walkthrough: `docs/PRICE_SETS_AND_AVAILABILITY.md`.

Restore:
```bash
tar -xzf checkpoints/9.2.0-emperor-splitit-review/preview-and-theme.tar.gz
```
