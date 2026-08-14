# V9 checkpoint

Shopify-ready export of the working V9 theme, including later V9 work (basket UX, Klarna/Tabby empty-state rules, brand-initials favicon, checkout funnel, manufacturing, journal). Succeeded by V9.1.

- `Valtora-Shopify-Theme-V9.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload zip)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore:
```bash
tar -xzf checkpoints/V9/preview-and-theme.tar.gz
```

Preview locally:
```bash
cd preview && python3 -m http.server 5173
# http://127.0.0.1:5173/
```
