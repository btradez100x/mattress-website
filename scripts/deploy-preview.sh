#!/usr/bin/env bash
# Valtora — deploy preview + public share link
# Always: run regression → sync share/v4 → refresh external tunnel URL
#
# Usage:
#   ./scripts/deploy-preview.sh
#   ./scripts/deploy-preview.sh --skip-tunnel   # local share hub only
#   PUBLIC_SUBDOMAIN=my-name ./scripts/deploy-preview.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PREVIEW="$ROOT/preview"
SHARE="$ROOT/share"
V4="$SHARE/v4"
PUBLIC_FILE="$SHARE/PUBLIC_URL.txt"
HUB_PORT="${HUB_PORT:-5190}"
PREVIEW_PORT="${PREVIEW_PORT:-5173}"
SUBDOMAIN="${PUBLIC_SUBDOMAIN:-deep-adults-roll}"
SKIP_TUNNEL=0

for arg in "$@"; do
  case "$arg" in
    --skip-tunnel) SKIP_TUNNEL=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
  esac
done

green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
red() { printf '\033[0;31m%s\033[0m\n' "$*"; }
info() { printf '%s\n' "$*"; }

cd "$ROOT"

info "========================================"
info "Valtora deploy"
info "========================================"

# --- 1. Regression (hard gate) ---
info ""
info "1/4  Regression smoke"
if ! "$ROOT/scripts/regression-smoke.sh"; then
  red "Deploy aborted — regression failed."
  exit 1
fi

# --- 2. Sync live preview → share/v4 ---
info ""
info "2/4  Sync preview → share/v4"
mkdir -p "$V4"
rsync -a --delete \
  --exclude '.DS_Store' \
  --exclude 'PUBLIC_URL.txt' \
  "$PREVIEW/" "$V4/"
green "Synced share/v4 from preview/"

# --- 3. Local servers ---
info ""
info "3/4  Local servers (preview :$PREVIEW_PORT, hub :$HUB_PORT)"

ensure_server() {
  local port="$1"
  local dir="$2"
  local label="$3"
  if curl -sf -o /dev/null "http://127.0.0.1:${port}/"; then
    green "$label already up on :$port"
    return 0
  fi
  # free port if a dead listener exists
  lsof -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | awk 'NR>1{print $2}' | sort -u | xargs kill 2>/dev/null || true
  sleep 0.3
  (
    cd "$dir"
    nohup python3 -m http.server "$port" >"/tmp/valtora-${label}-${port}.log" 2>&1 &
    echo $! >"/tmp/valtora-${label}-${port}.pid"
  )
  sleep 0.6
  if curl -sf -o /dev/null "http://127.0.0.1:${port}/"; then
    green "Started $label on :$port"
  else
    red "Failed to start $label on :$port"
    exit 1
  fi
}

ensure_server "$PREVIEW_PORT" "$PREVIEW" "preview"
ensure_server "$HUB_PORT" "$SHARE" "share-hub"

# --- 4. External public link ---
PUBLIC_URL="http://127.0.0.1:${HUB_PORT}/"
info ""
info "4/4  External facing link"

if [[ "$SKIP_TUNNEL" -eq 1 ]]; then
  info "Tunnel skipped (--skip-tunnel). Local hub: $PUBLIC_URL"
else
  # Kill prior localtunnel for this port / subdomain
  pkill -f "localtunnel --port ${HUB_PORT}" 2>/dev/null || true
  pkill -f "lt --port ${HUB_PORT}" 2>/dev/null || true
  sleep 0.4

  TUNNEL_LOG="/tmp/valtora-localtunnel-${HUB_PORT}.log"
  rm -f "$TUNNEL_LOG"
  (
    cd "$ROOT"
    nohup npx --yes localtunnel --port "$HUB_PORT" --subdomain "$SUBDOMAIN" >"$TUNNEL_LOG" 2>&1 &
    echo $! >"/tmp/valtora-localtunnel-${HUB_PORT}.pid"
  )

  # Wait for URL line
  PUBLIC_TUNNEL=""
  for _ in $(seq 1 40); do
    if grep -q 'your url is:' "$TUNNEL_LOG" 2>/dev/null; then
      PUBLIC_TUNNEL="$(grep -E 'your url is:' "$TUNNEL_LOG" | tail -1 | sed -E 's/.*your url is:[[:space:]]*//')"
      break
    fi
    sleep 0.25
  done

  if [[ -n "$PUBLIC_TUNNEL" ]]; then
    PUBLIC_URL="${PUBLIC_TUNNEL%/}"
    if [[ "$PUBLIC_URL" != *"$SUBDOMAIN"* ]]; then
      info "Note: requested subdomain '$SUBDOMAIN' was unavailable; using assigned URL."
    fi
    # Probe (bypass interstitial when possible)
    if curl -sf -o /dev/null -m 20 -H 'bypass-tunnel-reminder: 1' "${PUBLIC_URL}/"; then
      green "Public hub: ${PUBLIC_URL}/"
    else
      info "Tunnel reported ${PUBLIC_URL}/ (probe soft-failed — open in browser; loca.lt may show a click-through)"
    fi
  else
    red "Tunnel did not return a URL. Local hub still available: http://127.0.0.1:${HUB_PORT}/"
    info "Last tunnel log:"
    tail -20 "$TUNNEL_LOG" 2>/dev/null || true
    PUBLIC_URL="http://127.0.0.1:${HUB_PORT}/"
  fi
fi

# --- Bake brand + absolute Open Graph URLs for phone link previews ---
V4_PUBLIC="${PUBLIC_URL%/}/v4/"
if [[ "$V4_PUBLIC" == http://127.0.0.1* ]] || [[ "$V4_PUBLIC" == http://localhost* ]]; then
  info "Share meta: using local hub base (tunnel unavailable)"
fi
if python3 "$ROOT/scripts/inject-share-meta.py" "$V4_PUBLIC"; then
  green "Share meta injected (brand + og:image) → share/v4/index.html"
else
  info "Share meta inject skipped or failed (non-blocking)"
fi

# --- Write public URL artifacts ---
{
  echo "# Valtora public preview (updated by scripts/deploy-preview.sh)"
  echo "updated=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "hub=${PUBLIC_URL%/}/"
  echo "v4=${PUBLIC_URL%/}/v4/"
  echo "reserve=${PUBLIC_URL%/}/v4/#reserve"
  echo "checkout=${PUBLIC_URL%/}/v4/pages/checkout.html"
  echo "thank_you=${PUBLIC_URL%/}/v4/pages/order-confirmed.html"
  echo "local_preview=http://127.0.0.1:${PREVIEW_PORT}/"
  echo "local_hub=http://127.0.0.1:${HUB_PORT}/"
} >"$PUBLIC_FILE"

# Refresh share README pointer
cat >"$SHARE/README.md" <<EOF
# Shareable previews · V3 & V4

## Live public link (refresh on every deploy)

Run:

\`\`\`bash
./scripts/deploy-preview.sh
\`\`\`

That command always:
1. Runs \`scripts/regression-smoke.sh\` (blocks deploy on fail)
2. Syncs \`preview/\` → \`share/v4/\`
3. Serves the share hub and refreshes the external tunnel

**Current public URL** (also in \`PUBLIC_URL.txt\`):

- Hub: ${PUBLIC_URL%/}/
- **V4 (current):** ${PUBLIC_URL%/}/v4/
- Reserve flow: ${PUBLIC_URL%/}/v4/#reserve

Local:

\`\`\`bash
# Preview (working copy)
cd preview && python3 -m http.server ${PREVIEW_PORT}

# Share hub
cd share && python3 -m http.server ${HUB_PORT}
\`\`\`

Then open http://127.0.0.1:${HUB_PORT}/

## Files for someone else

| File | What it is |
|---|---|
| \`Valtora-Preview-V3.zip\` | Static V3 website |
| \`Valtora-Preview-V4.zip\` | Static V4 website |
| \`../Valtora-Shopify-Theme-V3.zip\` | Shopify theme upload · V3 |
| \`../Valtora-Shopify-Theme-V4.zip\` | Shopify theme upload · V4 |

### Manufacturing page
- Preview path: \`/pages/manufacturing.html\`
- Shopify: Online Store → Pages → Add page → Title **Manufacturing** → Theme template **manufacturing** → Save
EOF

# Append deploy run line to regression results
{
  echo ""
  echo "### Deploy $(date -u +%Y-%m-%d) - Automated smoke + public link"
  echo "- Environment: local preview + share hub"
  echo "- Public: ${PUBLIC_URL%/}/v4/"
  echo "- Command: \`./scripts/deploy-preview.sh\`"
  echo "- SM-12 / deploy smoke: Pass (gate)"
  echo "- Decision: Preview published"
  echo ""
} >>"$ROOT/docs/regression-results.md"

info ""
info "========================================"
green "DEPLOY OK"
info "Local preview:  http://127.0.0.1:${PREVIEW_PORT}/"
info "Local hub:      http://127.0.0.1:${HUB_PORT}/"
info "Public hub:     ${PUBLIC_URL%/}/"
info "Public V4:      ${PUBLIC_URL%/}/v4/"
info "Reserve:        ${PUBLIC_URL%/}/v4/#reserve"
info "URL file:       share/PUBLIC_URL.txt"
info "========================================"
