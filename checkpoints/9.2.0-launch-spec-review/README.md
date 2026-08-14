# 9.2.0 — launch-spec-review (check export)

**Export:** `Valtora-Shopify-Theme-9.2.0-launch-spec-review.zip`

Review package of launch-spec work on the **9.2.0** theme. Version number was **not** bumped (`VERSION` and Shopify `theme_version` stay `9.2.0`). This does not replace `9.2.0-order-status-app-proxy`.

Includes: lead-time resolver, cart mix (tops refused when flag off), comfort-top template (404 vs full), COPY-LAUNCH mattress copy, privacy/terms/cookies, empty `reviews.json`, motion tokens, order-status worker URL in docs. Lookup still **off**. Comfort tops flag still **off** by default.

- `Valtora-Shopify-Theme-9.2.0-launch-spec-review.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/`

Worker (not in the Shopify zip): `apps/order-status-worker/` at `https://valtora-order-status.valtora.workers.dev`. Setup: `docs/ORDER_TRACKING.md`.

Restore:
```bash
tar -xzf checkpoints/9.2.0-launch-spec-review/preview-and-theme.tar.gz
```
