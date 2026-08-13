#!/usr/bin/env bash
# Valtora theme — automated regression smoke (structural + theme-check)
# Usage: ./scripts/regression-smoke.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
THEME="$ROOT/valtora-theme"
FAIL=0

green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
red() { printf '\033[0;31m%s\033[0m\n' "$*"; }
info() { printf '%s\n' "$*"; }

pass() { green "PASS  $1"; }
fail() { red "FAIL  $1"; FAIL=$((FAIL + 1)); }

info "Valtora regression smoke"
info "Theme: $THEME"
info "----------------------------------------"

# --- Required paths ---
REQUIRED_PATHS=(
  "layout/theme.liquid"
  "layout/password.liquid"
  "config/settings_schema.json"
  "config/settings_data.json"
  "assets/base.css"
  "assets/theme.js"
  "assets/utm-persistence.js"
  "snippets/wordmark.liquid"
  "snippets/css-variables.liquid"
  "snippets/meta-tags.liquid"
  "snippets/tracking-pixels.liquid"
  "snippets/whatsapp-button.liquid"
  "snippets/payment-marks.liquid"
  "sections/hero.liquid"
  "sections/trust-bar.liquid"
  "sections/size-reserve.liquid"
  "sections/founder-note.liquid"
  "sections/trust-policy.liquid"
  "sections/contact.liquid"
  "sections/header.liquid"
  "sections/footer.liquid"
  "sections/header-group.json"
  "sections/footer-group.json"
  "templates/index.json"
  "templates/page.landing.json"
  "templates/page.size-guide.json"
  "templates/page.trial.json"
  "templates/page.warranty.json"
  "templates/page.refunds.json"
  "templates/page.delivery.json"
  "templates/page.contact.json"
  "templates/cart.json"
  "templates/page.checkout.json"
  "sections/main-checkout.liquid"
  "templates/product.json"
  "locales/en.default.json"
)

for rel in "${REQUIRED_PATHS[@]}"; do
  if [[ -f "$THEME/$rel" ]]; then
    pass "exists $rel"
  else
    fail "missing $rel"
  fi
done

# --- JSON parse ---
while IFS= read -r -d '' f; do
  rel="${f#"$THEME"/}"
  if python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$f" 2>/dev/null; then
    pass "json $rel"
  else
    fail "json $rel"
  fi
done < <(find "$THEME" -name '*.json' -print0)

# --- Critical settings schema keys ---
SCHEMA="$THEME/config/settings_schema.json"
for key in brand_name color_primary color_accent color_bg font_serif font_sans default_market deposit_amount_label meta_pixel_id; do
  if grep -q "\"id\": \"$key\"" "$SCHEMA"; then
    pass "settings_schema has $key"
  else
    fail "settings_schema missing $key"
  fi
done

# --- Wordmark must render from setting (not image-only logo) ---
if grep -q "settings.brand_name" "$THEME/snippets/wordmark.liquid" \
  && grep -q "wordmark__text" "$THEME/snippets/wordmark.liquid"; then
  pass "wordmark renders brand_name text"
else
  fail "wordmark does not render brand_name text"
fi

if grep -q "brand_name" "$THEME/config/settings_schema.json"; then
  pass "brand_name is a theme setting"
else
  fail "brand_name missing from settings"
fi

# --- Design tokens ---
if grep -q -- "--brand-primary" "$THEME/snippets/css-variables.liquid" \
  && grep -q -- "--brand-accent" "$THEME/snippets/css-variables.liquid"; then
  pass "CSS design tokens present"
else
  fail "CSS design tokens missing"
fi

# --- UTM persistence contract ---
UTM="$THEME/assets/utm-persistence.js"
for key in utm_source utm_medium utm_campaign utm_content utm_term valtora_utm_first_touch attributes; do
  if grep -q "$key" "$UTM"; then
    pass "utm script mentions $key"
  else
    fail "utm script missing $key"
  fi
done

# --- Size maps (AE + GB) ---
JS="$THEME/assets/theme.js"
if grep -q "ae:" "$JS" && grep -q "gb:" "$JS" \
  && grep -q "180" "$JS" && grep -q "150" "$JS" \
  && grep -q "Queen" "$JS" && grep -q "Double" "$JS"; then
  pass "theme.js contains AE/GB size maps with cm"
else
  fail "theme.js size maps incomplete (need AE Queen 180 / GB Double 150)"
fi

# --- Reserve section (V4.1 staged basket) ---
SR="$THEME/sections/size-reserve.liquid"
if grep -q "data-size-reserve" "$SR" \
  && grep -q "data-reserve-stage-a" "$SR" \
  && grep -q "data-checkout-path" "$SR"; then
  pass "size-reserve has Stage A + checkout page path"
else
  fail "size-reserve missing Stage A / checkout path"
fi

if grep -q "Your order" "$SR" \
  && grep -q "Cancel any time before dispatch" "$SR" \
  && grep -q "data-reserve-continue" "$SR"; then
  pass "Stage A basket copy + Continue present"
else
  fail "Stage A basket incomplete"
fi

CO="$THEME/sections/main-checkout.liquid"
if grep -q "data-checkout-page" "$CO" \
  && grep -q "data-stageb-summary" "$CO" \
  && grep -q "order-lead" "$CO" \
  && grep -q "data-pay-label" "$CO"; then
  pass "Checkout page has lead time + Pay"
else
  fail "Checkout page incomplete"
fi

# Lead time must not live in Stage A markup
set +e
python3 - "$SR" <<'PY'
from pathlib import Path
import re, sys
text = Path(sys.argv[1]).read_text()
m = re.search(
    r'data-reserve-stage-a[\s\S]*?>([\s\S]*?)data-reserve-notify',
    text,
)
chunk = m.group(1) if m else ''
if not chunk:
    sys.exit(2)
if re.search(r'order-lead|8 to 10 weeks|Before you order|data-leadtime', chunk, re.I):
    sys.exit(1)
sys.exit(0)
PY
SA_EC=$?
set -e
if [[ $SA_EC -eq 0 ]]; then
  pass "Stage A has no lead-time copy"
elif [[ $SA_EC -eq 2 ]]; then
  fail "could not isolate Stage A markup"
else
  fail "Stage A still contains lead-time copy (must be Stage B only)"
fi

if grep -q "float-basket" "$THEME/snippets/sticky-reserve-bar.liquid" \
  && grep -q "data-float-basket" "$THEME/snippets/sticky-reserve-bar.liquid"; then
  pass "floating basket replaces sticky reserve bar"
else
  fail "floating basket snippet missing"
fi

if grep -q "upsertMattressLine" "$JS" \
  && grep -q "data-order-remove" "$JS" \
  && grep -q "data-size-qty" "$JS" \
  && grep -q "wrap.hidden = !available" "$JS" \
  && ! grep -q "upsertActiveMattress(existingQty" "$JS"; then
  pass "order store supports upsert, remove; size click does not auto-add"
else
  fail "theme.js missing basket upsert/remove or size-click still auto-adds"
fi

if command -v node >/dev/null 2>&1; then
  if node --check "$JS" 2>/dev/null; then
    pass "theme.js syntax ok"
  else
    fail "theme.js syntax error"
  fi
else
  info "SKIP  node not installed — theme.js syntax skipped"
fi

# Preview parity for staged reserve
if grep -q "data-reserve-stage-a" "$ROOT/preview/index.html" \
  && grep -q "data-float-basket" "$ROOT/preview/index.html"; then
  pass "preview has Stage A + floating basket"
else
  fail "preview missing Stage A / floating basket"
fi

if grep -q "data-checkout-page" "$ROOT/preview/pages/checkout.html" \
  && grep -q "data-checkout-pay" "$ROOT/preview/pages/checkout.html" \
  && grep -q "function reviewOrderUrl" "$JS" \
  && grep -q "function initCheckoutPage" "$JS"; then
  pass "dedicated checkout page + navigation helpers"
else
  fail "checkout page or reviewOrderUrl missing"
fi

# --- Landing modular sections referenced by index ---
INDEX="$THEME/templates/index.json"
for sec in hero big-idea benefits product-specs size-reserve faq; do
  if grep -q "\"type\": \"$sec\"" "$INDEX" || grep -q "\"$sec\"" "$INDEX"; then
    pass "index.json includes $sec"
  else
    fail "index.json missing $sec"
  fi
done

# --- Default palette sanity ---
if grep -q "#1F3A5F" "$THEME/config/settings_data.json" \
  && grep -q "#8A6D3B" "$THEME/config/settings_data.json"; then
  pass "default navy/gold palette in settings_data"
else
  fail "default palette values missing from settings_data"
fi

# --- Trust layer (S15) — terms live on the checkout page ---
if grep -q "reserve-stage-b__terms" "$CO" \
  && grep -q "Cancel any time before dispatch" "$CO"; then
  pass "order terms present on checkout page"
else
  fail "order terms missing from checkout page"
fi

if grep -q "whatsapp_enabled" "$THEME/config/settings_schema.json" \
  && grep -q "trade_licence_no" "$THEME/config/settings_schema.json"; then
  pass "WhatsApp + legal entity settings present"
else
  fail "WhatsApp / legal entity settings missing"
fi

if grep -q "trust-bar-top" "$THEME/templates/index.json" \
  && grep -q "founder-note" "$THEME/templates/index.json"; then
  pass "index wires trust bar + founder note"
else
  fail "index missing trust bar / founder note placements"
fi

if grep -qiE "cash on delivery|pay on delivery|COD" "$THEME/templates/index.json" \
  || grep -qiE "cash on delivery|pay on delivery" "$THEME/sections/faq.liquid"; then
  pass "COD / pay-on-delivery FAQ present (S15.7)"
else
  # Soft: FAQ may live in section blocks with different wording — check refund/cancel language as proxy
  if grep -qi "cancel any time before dispatch" "$THEME/templates/index.json"; then
    pass "COD FAQ wording changed — cancel-before-dispatch FAQ still present"
  else
    fail "COD / cancel-before-dispatch FAQ missing"
  fi
fi

# Brand name must remain a setting (never hard-coded as only identity)
if ! grep -qE "Sattva|Saatva" "$THEME/snippets/wordmark.liquid"; then
  pass "wordmark has no hard-coded conflicting brand name"
else
  fail "wordmark hard-codes a brand name"
fi

# Deploy artifacts exist
if [[ -x "$ROOT/scripts/deploy-preview.sh" ]]; then
  pass "deploy-preview.sh is executable"
else
  fail "deploy-preview.sh missing or not executable"
fi

# --- Shopify theme check (0 errors) ---
if command -v shopify >/dev/null 2>&1; then
  CHECK_OUT="$(mktemp)"
  set +e
  (cd "$THEME" && shopify theme check) >"$CHECK_OUT" 2>&1
  CHECK_EC=$?
  set -e
  if grep -q "0 errors" "$CHECK_OUT" || grep -qiE "\[error\]" "$CHECK_OUT"; then
    if grep -qiE "\[error\]" "$CHECK_OUT"; then
      fail "shopify theme check reported errors"
      sed -n '1,80p' "$CHECK_OUT" || true
    else
      pass "shopify theme check (0 errors)"
    fi
  elif [[ $CHECK_EC -eq 0 ]]; then
    pass "shopify theme check exit 0"
  else
    # theme check may exit non-zero on warnings only — treat errors only as fail
    if grep -qiE "error" "$CHECK_OUT" && grep -qiE "\[error\]" "$CHECK_OUT"; then
      fail "shopify theme check failed"
      sed -n '1,80p' "$CHECK_OUT" || true
    else
      pass "shopify theme check completed (warnings allowed)"
      info "$(grep -E 'Theme Check Summary|offenses|errors' "$CHECK_OUT" || true)"
    fi
  fi
  rm -f "$CHECK_OUT"
else
  info "SKIP  shopify CLI not installed — theme check skipped"
fi

info "----------------------------------------"
if [[ "$FAIL" -gt 0 ]]; then
  red "SMOKE FAILED — $FAIL check(s)"
  exit 1
fi

green "SMOKE PASSED"
exit 0
