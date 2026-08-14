# V8 checkpoint

Includes empty-basket lower-bar CTA (“See sizes and prices” → #reserve), configurable share copy, manufacturing contrast fixes, hideable preview config, lead-line / exit-intent settings, checkout/thank-you funnel, and basket persistence.

- `Valtora-Shopify-Theme-V8.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore:
```bash
tar -xzf checkpoints/V8/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/
```
