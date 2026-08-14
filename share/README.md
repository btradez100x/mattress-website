# Shareable previews · V3 & V4

## Live public link (refresh on every deploy)

```bash
./scripts/deploy-preview.sh
```

That command always:
1. Runs `scripts/regression-smoke.sh` (blocks deploy on fail)
2. Syncs `preview/` → `share/v4/`
3. Serves the share hub and refreshes the external tunnel

**Current public URL** (also in `PUBLIC_URL.txt`):

- Hub: https://deep-adults-roll.loca.lt/
- **V4 (current):** https://deep-adults-roll.loca.lt/v4/
- Reserve flow: https://deep-adults-roll.loca.lt/v4/#reserve

Local:

```bash
cd preview && python3 -m http.server 5173
cd share && python3 -m http.server 5190
```

## Files for someone else

| File | What it is |
|---|---|
| `Valtora-Preview-V3.zip` | Static V3 website |
| `Valtora-Preview-V4.zip` | Static V4 website |
| `../Valtora-Shopify-Theme-V3.zip` | Shopify theme upload · V3 |
| `../Valtora-Shopify-Theme-V4.zip` | Shopify theme upload · V4 |

### Manufacturing page
- Preview path: `/pages/manufacturing.html`
