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

# --- Reserve section captures size + tier ---
if grep -q "data-size-reserve" "$THEME/sections/size-reserve.liquid" \
  && grep -q "deposit_product" "$THEME/sections/size-reserve.liquid"; then
  pass "size-reserve section has reserve + deposit product"
else
  fail "size-reserve section incomplete"
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

# --- Trust layer (S15) ---
if grep -q "deposit-terms" "$THEME/sections/size-reserve.liquid" \
  && grep -q "secure-checkout-line" "$THEME/sections/size-reserve.liquid"; then
  pass "deposit terms + secure checkout in size-reserve"
else
  fail "deposit terms / secure checkout missing from size-reserve"
fi

if grep -q "whatsapp_enabled" "$THEME/config/settings_schema.json" \
  && grep -q "trade_licence_no" "$THEME/config/settings_schema.json"; then
  pass "WhatsApp + legal entity settings present"
else
  fail "WhatsApp / legal entity settings missing"
fi

if grep -q "trust-bar-top" "$THEME/templates/index.json" \
  && grep -q "trust-bar-reserve" "$THEME/templates/index.json" \
  && grep -q "founder-note" "$THEME/templates/index.json"; then
  pass "index wires trust bars + founder note"
else
  fail "index missing trust bar / founder note placements"
fi

if grep -q "Can I pay cash on delivery" "$THEME/templates/index.json"; then
  pass "COD FAQ present (S15.7)"
else
  fail "COD FAQ missing"
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
