# V6 checkpoint

Includes manufacturing contrast fixes, configurable lead line / exit-intent, share Open Graph brand meta, hideable preview config bar, checkout/thank-you funnel, and basket persistence.

- `Valtora-Shopify-Theme-V6.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore:
```bash
tar -xzf checkpoints/V6/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/
```
