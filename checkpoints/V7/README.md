# V7 checkpoint

Includes configurable share / link-preview copy, manufacturing hero + panel contrast fixes, hideable preview config bar, lead-line / exit-intent settings, checkout/thank-you funnel, and basket persistence.

- `Valtora-Shopify-Theme-V7.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore:
```bash
tar -xzf checkpoints/V7/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/
```
