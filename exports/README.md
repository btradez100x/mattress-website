# Numa website — download this on your Mac

**This Cloud Agent VM is not your Mac.** Paths like `/home/benacolatse/Downloads` and `/Users/benacolatse/Downloads` on the agent do **not** appear in Finder.

## Download (Chrome on your Mac)

Open this GitHub URL while logged into GitHub as the repo owner:

https://github.com/btradez100x/mattress-website/raw/cursor/theme-mac-download-9190/exports/Numa-website-latest.tar.gz

That file is the Shopify theme (same contents as `Numa-website-latest.zip`). `*.zip` is gitignored, so the committed archive is `.tar.gz`.

### Turn it into a zip for Shopify Admin

Shopify Admin → Online Store → Themes → Add theme → Upload zip wants a **zip**. On your Mac:

```bash
mkdir numa-theme && tar -xzf ~/Downloads/Numa-website-latest.tar.gz -C numa-theme
cd numa-theme && zip -r ../Numa-website-latest.zip .
```

Then upload `Numa-website-latest.zip`.

## Cursor Cloud Agent artifacts (not Finder Downloads)

Agent run: https://cursor.com/agents/bc-e6e2f398-1483-5dca-bd0c-1695767e9190

Copies with simple names (inside the **remote VM**, not your Mac):

- `/opt/cursor/artifacts/Numa-website-latest.zip`
- `/opt/cursor/artifacts/Numa-website-latest.tar.gz`
- `/workspace/artifacts/Numa-website-latest.zip`
- `/workspace/artifacts/Numa-website-latest.tar.gz`

`*.zip` is gitignored. GitHub is the path that works in Chrome without SSH.

VERSION stays **10.1.0**. Legal name Valtora FZE.
