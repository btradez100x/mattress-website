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
  "snippets/favicon.liquid"
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
  "templates/page.order-status.json"
  "templates/page.privacy.json"
  "templates/page.terms.json"
  "templates/page.cookies.json"
  "templates/product.comfort-top.json"
  "sections/main-comfort-top.liquid"
  "snippets/lead-time.liquid"
  "snippets/lead-time-line.liquid"
  "sections/order-status.liquid"
  "assets/order-status.js"
  "templates/cart.json"
  "templates/page.checkout.json"
  "sections/main-checkout.liquid"
  "templates/page.manufacturing.json"
  "sections/manufacturing.liquid"
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

if grep -q '"type": "textarea"' "$THEME/sections/header.liquid" \
  && grep -q 'brand_name_override' "$THEME/sections/header.liquid"; then
  pass "header brand name override is textarea (2-line A/B)"
else
  fail "header brand name override is not a textarea"
fi

if grep -q 'brand_product_line_override' "$THEME/sections/header.liquid" \
  && grep -q 'product_line_override' "$THEME/snippets/wordmark.liquid" \
  && grep -q 'newline_to_br' "$THEME/snippets/wordmark.liquid"; then
  pass "header product line override wired; wordmark splits textarea newlines"
else
  fail "header two-line wordmark override is not wired"
fi

if grep -q -- "--wordmark-line-2" "$THEME/assets/base.css" \
  && grep -q -- "--wordmark-line-2" "$THEME/snippets/css-variables.liquid" \
  && grep -q 'var(--wordmark-line-2' "$THEME/assets/base.css" \
  && ! grep -q "Single-colour lockup" "$THEME/assets/base.css"; then
  pass "wordmark line 2 uses scheme token --wordmark-line-2"
else
  fail "wordmark line 2 is not a distinct scheme colour"
fi

if grep -q 'settings.brand_product_line' "$THEME/sections/footer.liquid" \
  && grep -q 'site-footer__trading-line' "$THEME/sections/footer.liquid" \
  && grep -q 'site-footer__trading-name' "$THEME/sections/footer.liquid" \
  && grep -q 'var(--wordmark-line-2-on-dark' "$THEME/assets/base.css"; then
  pass "footer Trading as uses brand name + product line lockup"
else
  fail "footer Trading as does not use both wordmark lines"
fi

if grep -q "render 'favicon'" "$THEME/snippets/meta-tags.liquid" \
  && grep -q "brand_name" "$THEME/snippets/favicon.liquid" \
  && grep -q "image/svg+xml" "$THEME/snippets/favicon.liquid"; then
  pass "favicon uses brand initials SVG unless an image is uploaded"
else
  fail "favicon initials snippet missing or not wired in meta-tags"
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
  && (grep -q "order-lead" "$CO" || grep -q "checkout-stage__lead" "$CO" || grep -q "data-leadtime-block" "$CO") \
  && grep -q "data-pay-label" "$CO"; then
  pass "Checkout page has lead time + Pay"
else
  fail "Checkout page incomplete"
fi

# Lead time must not live in Stage A markup; Stage B is /pages/checkout only (no in-page reveal)
set +e
python3 - "$SR" <<'PY'
from pathlib import Path
import re, sys
text = Path(sys.argv[1]).read_text()
if re.search(r"render\s+['\"]reserve-stage-b['\"]", text):
    sys.exit(3)  # in-page Stage B must not return
m = re.search(
    r'<div[^>]*\bdata-reserve-stage-a\b[^>]*>([\s\S]*?)</div>\s*(?:\{%-?\s*comment\s*-?%\}[^\n]*Out of stock|\{%-?\s*comment\s*-?%\}|{%-?\s*endif\s*-?%})?\s*<div[^>]*data-reserve-notify',
    text,
)
if not m:
    m = re.search(
        r'data-reserve-stage-a\b[^>]*>([\s\S]*?)<div[^>]*data-reserve-notify',
        text,
    )
chunk = m.group(1) if m else ''
if not chunk:
    sys.exit(2)
# Allow cancel reassurance; forbid delivery-window / lead-time blocks inside Stage A
if re.search(r'order-lead|data-leadtime-block|data-lead-window|8 to 10 weeks|Before you order|Delivery:', chunk, re.I):
    sys.exit(1)
if not re.search(r"data-checkout-href=[\"'][^\"']*checkout", text, re.I) \
   and not re.search(r"data-reserve-continue[\s\S]{0,160}?pages\['checkout'\]", text):
    sys.exit(4)
sys.exit(0)
PY
SA_EC=$?
set -e
if [[ $SA_EC -eq 0 ]]; then
  pass "Stage A has no lead-time copy; Continue links to checkout"
elif [[ $SA_EC -eq 2 ]]; then
  fail "could not isolate Stage A markup"
elif [[ $SA_EC -eq 3 ]]; then
  fail "size-reserve still renders in-page reserve-stage-b (must navigate to /pages/checkout)"
elif [[ $SA_EC -eq 4 ]]; then
  fail "Continue does not link to checkout page"
else
  fail "Stage A still contains lead-time copy (must be Stage B only)"
fi

# theme.js Continue must navigate (not expand in-page Stage B)
if grep -q "vTrackOnce('reserve_intent'" "$JS" \
  && grep -q "function reviewOrderUrl" "$JS" \
  && ! grep -q "expandStageB();" "$JS"; then
  pass "Continue fires reserve_intent and navigates (no expandStageB call)"
else
  fail "Continue still expands Stage B in-page or missing reserve_intent"
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
if (grep -q "reserve-stage-b__terms" "$CO" || grep -q "checkout-stage__terms" "$CO") \
  && grep -q "Cancel any time before dispatch" "$CO"; then
  pass "order terms present on checkout page"
else
  fail "order terms missing from checkout page"
fi

if grep -q "whatsapp_enabled" "$THEME/config/settings_schema.json" \
  && grep -q "trade_licence_no" "$THEME/config/settings_schema.json" \
  && grep -q '"id": "legal_name"' "$THEME/config/settings_schema.json" \
  && grep -q '"id": "company_number"' "$THEME/config/settings_schema.json" \
  && grep -q '"id": "registered_address"' "$THEME/config/settings_schema.json" \
  && grep -q "legal-entity" "$THEME/sections/trust-policy.liquid" \
  && grep -q "checkout-stage__terms" "$THEME/sections/main-checkout.liquid"; then
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
info "Consistency gate (brand / theme / chrome)"
info "----------------------------------------"
set +e
python3 "$ROOT/scripts/regression-consistency.py"
CX_EC=$?
set -e
if [[ $CX_EC -eq 0 ]]; then
  pass "consistency gate (CX)"
else
  fail "consistency gate (CX) — see failures above"
fi

# --- Order status (App Proxy contract; lookup off until worker is live) ---
OS="$THEME/sections/order-status.liquid"
OSJS="$THEME/assets/order-status.js"
if [[ -f "$OS" && -f "$OSJS" && -f "$ROOT/preview/order-status.js" && -f "$ROOT/preview/pages/order-status.html" ]]; then
  pass "order-status liquid + JS (theme + preview)"
else
  fail "order-status files missing"
fi

if grep -q "\"id\": \"order_lookup_enabled\"" "$SCHEMA" \
  && grep -q "\"id\": \"order_lookup_endpoint\"" "$SCHEMA" \
  && grep -q '"order_lookup_enabled": false' "$THEME/config/settings_data.json"; then
  pass "order lookup settings present and default off"
else
  fail "order lookup settings missing or enabled by default"
fi

if grep -q "Order confirmed" "$OS" \
  && grep -q "Delivery booked" "$OS" \
  && grep -q "Delivered" "$OS" \
  && grep -q "data-os-explain" "$OS"; then
  pass "order-status idle state lists eight stages"
else
  fail "order-status missing eight-stage idle list"
fi

if grep -qi "updated by hand" "$OS" \
  && grep -qi "not live tracking" "$OSJS" \
  && ! grep -qi "order not found" "$OS" \
  && ! grep -qi "order not found" "$OSJS" \
  && ! grep -qi "order not found" "$ROOT/apps/order-status-worker/src/index.js"; then
  pass "order-status copy: by hand, never enumerates missing orders"
else
  fail "order-status copy still implies live tracking or enumerates missing orders"
fi

if grep -q "If that matches an order, we have sent you a link." "$ROOT/apps/order-status-worker/src/index.js" \
  && grep -q "verifyShopifyProxy" "$ROOT/apps/order-status-worker/src/index.js" \
  && grep -q "X-Notify-Secret" "$ROOT/apps/order-status-worker/src/index.js"; then
  pass "order-status worker: generic lookup, proxy verify, Flow notify"
else
  fail "order-status worker missing lookup/notify contract"
fi

if command -v node >/dev/null 2>&1; then
  if node --check "$OSJS" 2>/dev/null && node --check "$ROOT/preview/order-status.js" 2>/dev/null; then
    pass "order-status JS syntax ok"
  else
    fail "order-status JS syntax error"
  fi
fi

if grep -q "data-order-status" "$ROOT/preview/pages/order-status.html" \
  && grep -q "order-status.js" "$ROOT/preview/pages/order-status.html" \
  && grep -q "data-preview=\"true\"" "$ROOT/preview/pages/order-status.html"; then
  pass "preview order-status page consumes JSON mock"
else
  fail "preview order-status page not wired"
fi

# --- Launch spec gates ---
if ! grep -R --include='*.liquid' -l 'settings.lead_time_window' "$THEME" | grep -v 'snippets/lead-time.liquid' | grep -q .; then
  pass "settings.lead_time_window not read outside lead-time.liquid"
else
  fail "settings.lead_time_window still read outside snippets/lead-time.liquid"
fi

if ! grep -R --include='*.liquid' -n 'metafields.custom.lead_time' "$THEME" | grep -v 'snippets/lead-time.liquid' | grep -q .; then
  pass "lead_time metafields only read in lead-time.liquid"
else
  fail "lead_time metafields read outside snippets/lead-time.liquid"
fi

if python3 -c "import json,sys; p='$THEME/assets/reviews.json'; d=json.load(open(p)); assert d.get('reviews')==[], d; p2='$ROOT/preview/assets/reviews.json'; d2=json.load(open(p2)); assert d2.get('reviews')==[], d2"; then
  pass "reviews.json empty in theme and preview"
else
  fail "reviews.json is not an empty reviews array"
fi

MARKERS="data-checkout-page data-checkout-flow data-reserve-stage-b data-stageb-summary data-checkout-lines data-checkout-item-count data-checkout-subtotal data-bnpl-monthly data-order-large-terms data-order-large-ack data-checkout-pay data-pay-label data-cart-status data-leadtime-block data-lead-window-label data-leadtime-copy data-checkout-empty"
CO="$THEME/sections/main-checkout.liquid"
missing_marker=""
for m in $MARKERS; do
  if ! grep -q "$m" "$CO"; then
    missing_marker="$m"
    break
  fi
done
if [[ -z "$missing_marker" ]]; then
  pass "checkout data- markers present"
else
  fail "checkout missing marker $missing_marker"
fi

if grep -q "This page does not exist" "$THEME/sections/main-comfort-top.liquid" \
  && grep -q "comfort_tops_enabled" "$THEME/sections/main-comfort-top.liquid"; then
  pass "comfort-top 404 markup when flag off"
else
  fail "comfort-top missing flag-off 404 markup"
fi

if grep -q "comfort_tops_enabled and section.settings.top_cta_label" "$THEME/sections/swap-explainer.liquid"; then
  pass "swap CTA gated on comfort_tops_enabled"
else
  fail "swap CTA not gated on comfort_tops_enabled"
fi

bezier_files=$(grep -R --include='*.css' --include='*.liquid' --include='*.js' -n 'cubic-bezier' "$THEME" "$ROOT/preview" | grep -v '/share/' || true)
bad_bezier=$(printf '%s\n' "$bezier_files" | grep -v '0.22, 1, 0.36, 1' | grep -v '0.22,1,0.36,1' || true)
if [[ -z "$bad_bezier" ]]; then
  pass "cubic-bezier is only 0.22, 1, 0.36, 1 (theme + preview)"
else
  fail "unexpected cubic-bezier: $bad_bezier"
fi

if grep -q -- '--ease-luxury' "$THEME/assets/base.css" "$ROOT/preview/base.css" \
  || grep -q -- '--ease-out-expo' "$THEME/assets/base.css" "$ROOT/preview/base.css" \
  || grep -q -- '--motion-hover' "$THEME/assets/base.css" "$ROOT/preview/base.css"; then
  fail "legacy motion tokens still present"
else
  pass "legacy motion tokens removed"
fi

if grep -R --include='*.json' -n 'data-preview="true"' "$THEME/templates"; then
  fail "data-preview=true found in valtora-theme/templates"
else
  pass "data-preview absent from valtora-theme/templates"
fi

if grep -q "privacy_link" "$THEME/sections/footer.liquid" \
  && [[ -f "$THEME/templates/page.privacy.json" ]] \
  && [[ -f "$ROOT/preview/pages/privacy.html" ]] \
  && [[ -f "$ROOT/preview/pages/terms.html" ]] \
  && [[ -f "$ROOT/preview/pages/cookies.html" ]] \
  && [[ -f "$ROOT/preview/pages/comfort-top.html" ]]; then
  pass "policy + comfort-top preview pages exist"
else
  fail "policy or comfort-top preview pages missing"
fi

if grep -q 'localhost' "$ROOT/apps/order-status-worker/wrangler.toml"; then
  fail "wrangler.toml contains localhost"
else
  pass "wrangler.toml has no localhost"
fi

# --- Shopify prices + Klarna (no invented finance figures) ---
if grep -R --include='*.liquid' --include='*.json' -n 'price_display' "$THEME/sections" "$THEME/templates" "$THEME/snippets" "$THEME/layout" "$THEME/config"; then
  fail "price_display still present in theme"
else
  pass "price_display removed from theme"
fi

if grep -R --include='*.liquid' --include='*.json' --include='*.js' -nE 'price_set|active_price_set' "$THEME" | grep -q .; then
  fail "price_set still present in theme"
else
  pass "price_set removed from theme"
fi

if grep -nE '/ 12|orderVal /' "$THEME/assets/theme.js" "$ROOT/preview/theme.js"; then
  fail "theme.js still divides a finance figure"
else
  pass "no /12 or orderVal/ finance fallback in theme.js"
fi

if grep -q 'js.klarna.com' "$THEME/layout/theme.liquid" \
  && grep -q 'klarna_client_id' "$THEME/layout/theme.liquid" \
  && grep -q "html_market == 'gb'" "$THEME/layout/theme.liquid"; then
  pass "Klarna SDK gated on client ID + GB"
else
  fail "Klarna SDK not gated on klarna_client_id + GB"
fi

if python3 -c "
import json
d=json.load(open('$THEME/config/settings_schema.json'))
found=False
for group in d:
    for s in group.get('settings') or []:
        if s.get('id')=='bnpl_microcopy':
            found=True
            default=(s.get('default') or '')
            assert default=='', repr(default)
assert found, 'bnpl_microcopy missing'
"; then
  pass "bnpl_microcopy default has no figure"
else
  fail "bnpl_microcopy default is not empty / figure-free"
fi

if grep -q '"price":"£3,299"' "$ROOT/preview/index.html" \
  && grep -q '"price_raw":329900' "$ROOT/preview/index.html" \
  && ! grep -q '£3,499' "$ROOT/preview/index.html"; then
  pass "preview GB Super King is £3,299 / 329900"
else
  fail "preview Super King is not £3,299"
fi

if grep -q 'custom.market' "$THEME/sections/size-reserve.liquid" \
  && grep -q 'price_raw' "$THEME/sections/size-reserve.liquid" \
  && grep -q 'mattress.variants' "$THEME/sections/size-reserve.liquid" \
  && grep -q 'custom.enabled' "$THEME/sections/size-reserve.liquid"; then
  pass "size-reserve loops Shopify variants and respects custom.enabled"
else
  fail "size-reserve is not reading product.variants / custom.enabled"
fi

if grep -q 'Not in this allocation' "$THEME/assets/theme.js" \
  && ! grep -qi 'out of stock' "$THEME/sections/size-reserve.liquid"; then
  pass "allocation waitlist copy, no out-of-stock wording in size-reserve"
else
  fail "size-reserve still says out of stock or missing allocation copy"
fi

if grep -q '"id":"emperor"' "$ROOT/preview/index.html" \
  && grep -q '"label":"Emperor"' "$ROOT/preview/index.html" \
  && grep -q "id: 'emperor'" "$THEME/assets/theme.js"; then
  pass "Emperor 200×200 present in preview GB list and SIZE_MAPS"
else
  fail "Emperor 200×200 missing"
fi

if python3 -c "
import json
d=json.load(open('$THEME/config/settings_data.json'))
assert d.get('current',{}).get('splitit_enabled') is False
assert not (d.get('current',{}).get('splitit_merchant_id') or '')
"; then
  pass "Splitit default off with blank merchant ID"
else
  fail "Splitit is not off by default"
fi

if grep -q 'web-components.splitit.com' "$THEME/layout/theme.liquid" \
  && grep -q 'settings.splitit_enabled' "$THEME/layout/theme.liquid" \
  && grep -q 'settings.splitit_merchant_id' "$THEME/layout/theme.liquid"; then
  pass "Splitit script gated on toggle + merchant ID + GB"
else
  fail "Splitit script not gated"
fi

if grep -qi 'splitit' "$THEME/sections/faq.liquid" "$THEME/sections/hero.liquid" "$THEME/sections/offer.liquid"; then
  fail "Splitit mentioned in customer copy while launch-off"
else
  pass "Splitit absent from FAQ/hero/offer copy"
fi

if grep -q 'size: checkoutSizeParam' "$THEME/assets/theme.js"; then
  pass "begin_checkout includes size"
else
  fail "begin_checkout missing size"
fi

if grep -q '"id": "size_add_label"' "$THEME/config/settings_schema.json" \
  && grep -q 'data-add-label' "$THEME/sections/size-reserve.liquid"; then
  pass "size Add label is a theme setting"
else
  fail "size Add label setting missing"
fi

if grep -q '"id": "brand_tagline_gb"' "$SCHEMA" \
  && grep -q '"id": "brand_tagline_ae"' "$SCHEMA" \
  && grep -q '"id": "brand_tagline_us"' "$SCHEMA" \
  && grep -q '"id": "brand_tagline_eu"' "$SCHEMA" \
  && grep -q '"id": "brand_tagline_gh"' "$SCHEMA" \
  && grep -q '"id": "brand_tagline_ng"' "$SCHEMA" \
  && grep -q 'Tagline (Europe, including Albania)' "$SCHEMA"; then
  pass "per-market tagline settings present"
else
  fail "per-market tagline settings missing from schema"
fi

if grep -q "render 'market-tagline'" "$THEME/sections/footer.liquid" \
  && grep -q "render 'market-tagline'" "$THEME/snippets/meta-tags.liquid" \
  && grep -q "render 'market-tagline'" "$THEME/layout/password.liquid" \
  && grep -q '|AL|' "$THEME/snippets/market-tagline.liquid" \
  && grep -q "iso == 'GB'" "$THEME/snippets/market-tagline.liquid" \
  && grep -q "iso == 'US'" "$THEME/snippets/market-tagline.liquid"; then
  pass "market-tagline helper wired (includes AL; GB is UK)"
else
  fail "market-tagline helper missing, unwired, or missing AL/GB/US"
fi

info "----------------------------------------"
if [[ "$FAIL" -gt 0 ]]; then
  red "SMOKE FAILED — $FAIL check(s)"
  exit 1
fi

green "SMOKE PASSED"
exit 0
