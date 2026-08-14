# V3 checkpoint

Saved before re-adding the homepage section reorder panel.

- `Valtora-Shopify-Theme-V3.zip` — upload to Shopify (Online Store → Themes → Add theme → Upload)
- `preview-and-theme.tar.gz` — full local rollback of `preview/` + `valtora-theme/`

Restore theme only:
```bash
rm -rf valtora-theme && mkdir valtora-theme && unzip -q checkpoints/V3/Valtora-Shopify-Theme-V3.zip -d valtora-theme
```

Restore preview + theme:
```bash
tar -xzf checkpoints/V3/preview-and-theme.tar.gz
```
