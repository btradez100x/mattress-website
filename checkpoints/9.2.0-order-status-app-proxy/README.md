# 9.2.0 — order-status-app-proxy (current)

**Export:** `Valtora-Shopify-Theme-9.2.0-order-status-app-proxy.zip`

V9.1 plus order tracking (App Proxy contract). Eight production stages on the order-status page; lookup stays **off** until the Cloudflare worker is live. Email + `/apps/order` JSON — not Shopify’s native status page — so the same contract can move off Shopify later.

- `Valtora-Shopify-Theme-9.2.0-order-status-app-proxy.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Same bytes as the earlier `checkpoints/V9.2/` package (pre-SemVer filename).

Worker (not in the Shopify zip): `apps/order-status-worker/`. Setup: `docs/ORDER_TRACKING.md`.

Restore:
```bash
tar -xzf checkpoints/9.2.0-order-status-app-proxy/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/pages/order-status.html
```
