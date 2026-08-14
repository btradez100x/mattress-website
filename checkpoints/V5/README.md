# V5 checkpoint (checkout + thank-you redesign)

Includes dedicated checkout Stage B page (Pay early, brand panel), multi-item basket persistence, preview brand chrome on secondary pages, and thank-you page with alternating grounds + order stage line.

- `Valtora-Shopify-Theme-V5.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore:
```bash
tar -xzf checkpoints/V5/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/
# Checkout: /pages/checkout.html
# Thank you: /pages/order-confirmed.html
```
