# Numa website — download this on your Mac

**This Cloud Agent VM is not your Mac.** Paths like `/home/ubuntu/Downloads` and `/home/benacolatse/Downloads` on the agent do **not** appear in Finder.

## Download (Chrome on your Mac)

Open this GitHub URL while logged into GitHub as the repo owner:

https://github.com/btradez100x/mattress-website/raw/cursor/lates-changes-29th-2577/exports/Numa-website-latest.tar.gz

That archive is `preview/` + `valtora-theme/` at **10.1.0** (filled snow/cream cards + shopify-theme `54934aa`). `*.zip` is gitignored, so the committed file is `.tar.gz`.

### Shopify Admin zip

Shopify Admin → Online Store → Themes → Add theme → Upload zip wants a **zip** of the theme folders (`layout/`, `assets/`, …) at the zip root. On your Mac:

```bash
tar -xzf ~/Downloads/Numa-website-latest.tar.gz
cd valtora-theme && zip -r ../Numa-website-latest.zip .
```

Then upload `Numa-website-latest.zip`. Do not zip the `preview/` folder into the Shopify upload.

## Cursor Cloud Agent artifacts (not Finder Downloads)

Agent run: https://cursor.com/agents/bc-180dd207-6760-5ec7-8f73-5422b2919d48

Copies with simple names (inside the **remote VM**, not your Mac):

- `/opt/cursor/artifacts/Numa-website-latest.zip`
- `/opt/cursor/artifacts/Numa-website-latest.tar.gz`
- `/workspace/Downloads/Numa-website-latest.zip`
- `/workspace/Downloads/Numa-website-latest.tar.gz`

`*.zip` is gitignored. GitHub is the path that works in Chrome without SSH.

VERSION stays **10.1.0**. Checkout was not modified. Legal name Valtora FZE.
Pack SHA: `8526d79`.
