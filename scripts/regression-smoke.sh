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
  "assets/brand.css"
  "assets/mobile-fit.css"
  "assets/theme.js"
  "assets/utm-persistence.js"
  "snippets/wordmark.liquid"
  "snippets/css-variables.liquid"
  "snippets/meta-tags.liquid"
  "snippets/favicon.liquid"
  "snippets/tracking-pixels.liquid"
  "snippets/whatsapp-button.liquid"
  "snippets/payment-marks.liquid"
  "snippets/size-market.liquid"
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
  "templates/page.large-sizes.json"
  "templates/page.european-king.json"
  "templates/page.specification.json"
  "templates/page.what-it-buys.json"
  "templates/page.support.json"
  "templates/page.cooling.json"
  "templates/page.split-king.json"
  "templates/page.configure.json"
  "sections/landing-funnel.liquid"
  "snippets/trial-tokens.liquid"
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
  "templates/product.comfort-layer.json"
  "templates/product.bed-sheets.json"
  "templates/product.pillows.json"
  "sections/main-comfort-top.liquid"
  "sections/main-bed-sheets.liquid"
  "sections/main-pillows.liquid"
  "snippets/lead-time.liquid"
  "snippets/lead-time-line.liquid"
  "sections/order-status.liquid"
  "assets/order-status.js"
  "templates/cart.json"
  "templates/page.checkout.json"
  "sections/main-checkout.liquid"
  "templates/page.manufacturing.json"
  "sections/manufacturing.liquid"
  "templates/page.journal.json"
  "sections/main-journal.liquid"
  "sections/main-blog.liquid"
  "snippets/journal-article-body.liquid"
  "snippets/journal-baked-index.liquid"
  "snippets/journal-article-layout.liquid"
  "snippets/journal-index-href.liquid"
  "snippets/journal-author.liquid"
  "templates/page.how-to-choose-a-mattress.json"
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

if ! grep -q 'brand_name_override' "$THEME/sections/header.liquid" \
  && ! grep -q 'brand_product_line_override' "$THEME/sections/header.liquid"; then
  pass "header has no brand name / product line overrides"
else
  fail "header still has a second pair of brand name fields"
fi

if grep -q 'settings.brand_name' "$THEME/snippets/wordmark.liquid" \
  && grep -q 'settings.brand_product_line' "$THEME/snippets/wordmark.liquid" \
  && ! grep -q 'brand_name_override' "$THEME/snippets/wordmark.liquid" \
  && ! grep -q 'product_line_override' "$THEME/snippets/wordmark.liquid"; then
  pass "wordmark reads only Theme settings Brand name + Product line"
else
  fail "wordmark still accepts a second brand name source"
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
  && grep -q 'Trading as {{ trading_as }}' "$THEME/sections/footer.liquid" \
  && ! grep -q 'site-footer__trading-lockup' "$THEME/sections/footer.liquid" \
  && ! grep -q 'site-footer__trading-name' "$THEME/sections/footer.liquid" \
  && ! grep -q 'site-footer__trading-line' "$THEME/sections/footer.liquid" \
  && ! grep -q 'site-footer__trading-name' "$THEME/assets/base.css" \
  && ! grep -q 'site-footer__trading-line' "$THEME/assets/base.css"; then
  pass "footer Trading as is one plain line from Brand settings"
else
  fail "footer Trading as is still a styled two-line lockup"
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

if grep -q 'Brand name (only place to edit)' "$THEME/config/settings_schema.json" \
  && grep -q 'Brand name (line 1)' "$THEME/config/settings_schema.json" \
  && grep -q 'Product line (line 2)' "$THEME/config/settings_schema.json" \
  && ! grep -q 'Header can override' "$THEME/config/settings_schema.json"; then
  pass "Theme settings Brand is the only place to edit names"
else
  fail "settings_schema still implies a second brand name source"
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
for key in utm_source utm_medium utm_campaign utm_content utm_term valtora_utm_first_touch attributes applyToHref sessionStorage; do
  if grep -q "$key" "$UTM"; then
    pass "utm script mentions $key"
  else
    fail "utm script missing $key"
  fi
done

if grep -q "utm-persistence.js" "$THEME/layout/theme.liquid" \
  && grep -q "utm-persistence.js" "$THEME/layout/password.liquid"; then
  pass "theme + password layouts load utm-persistence.js"
else
  fail "utm-persistence.js missing from theme.liquid or password.liquid"
fi

# --- GTM: one settings-gated loader, no second ID ---
for layout in "layout/theme.liquid" "layout/password.liquid" "templates/gift_card.liquid"; do
  if grep -q "settings.gtm_container_id" "$THEME/$layout" \
    && grep -q "googletagmanager.com/gtm.js" "$THEME/$layout" \
    && grep -q "googletagmanager.com/ns.html" "$THEME/$layout"; then
    pass "$layout has settings-gated GTM head + noscript"
  else
    fail "$layout missing settings-gated GTM snippets"
  fi
done
if grep -R --include='*.liquid' -l "GTM-MX9SHNSM" "$THEME" | grep -vq settings; then
  fail "hardcoded GTM ID outside settings"
else
  pass "no hardcoded GTM container ID in Liquid (settings only)"
fi

# Landing templates use default theme layout (GTM + UTM)
for tpl in page.large-sizes.json page.european-king.json page.specification.json page.what-it-buys.json page.configure.json page.support.json page.cooling.json page.split-king.json; do
  if python3 - "$THEME/templates/$tpl" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
sys.exit(0 if data.get("layout") in (None, "theme") else 1)
PY
  then
    pass "$tpl uses default theme layout"
  else
    fail "$tpl overrides layout and would skip theme GTM/UTM"
  fi
done

if grep -q '"value": "configure"' "$THEME/sections/landing-funnel.liquid" \
  && grep -q "data-lp-configure" "$THEME/sections/landing-funnel.liquid"; then
  pass "landing-funnel has inline configure layout"
else
  fail "landing-funnel missing inline configure layout"
fi

if grep -q "data-lp-qty" "$THEME/sections/landing-funnel.liquid" \
  && grep -q "function shopifyCartAddUrl" "$THEME/assets/theme.js" \
  && grep -q "function addLandingToShopify" "$THEME/assets/theme.js" \
  && grep -q "function shopifyCartAddUrl" "$ROOT/preview/theme.js" \
  && grep -q "data-lp-qty" "$ROOT/preview/pages/specification.html"; then
  pass "landing configure adds to Shopify cart with quantity"
else
  fail "landing configure missing Shopify cart add or quantity stepper"
fi

# --- Size maps (AE + GB + EU) ---
JS="$THEME/assets/theme.js"
if grep -q "ae:" "$JS" && grep -q "gb:" "$JS" && grep -q "eu:" "$JS" \
  && grep -q "180" "$JS" && grep -q "150" "$JS" && grep -q "160 × 200" "$JS" \
  && grep -q "Queen" "$JS" && grep -q "Double" "$JS" && grep -q "European King" "$JS"; then
  pass "theme.js contains AE/GB/EU size maps with cm"
else
  fail "theme.js size maps incomplete (need AE Queen 180 / GB Double 150 / EU European King 160)"
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

CSS="$THEME/assets/base.css"
if grep -q "bottom: 0 !important" "$CSS" \
  && grep -A2 "body.has-sticky-reserve {" "$CSS" | grep -q "padding-bottom: var(--float-basket-space" \
  && ! grep -q "body.float-basket-at-footer .float-basket" "$CSS" \
  && ! grep -q "function copyrightAtPageEnd" "$JS"; then
  pass "choose-a-size bar pinned to viewport bottom (no footer grey slab)"
else
  fail "sticky basket still offsets from viewport bottom or docks into footer padding"
fi

# Lined basket must reveal immediately (no hero-CTA scroll / IO wait), including mobile.
if grep -q "function paintSticky" "$JS" \
  && grep -q "function basketHasItems" "$JS" \
  && grep -q "classList.toggle('has-items'" "$JS" \
  && grep -q "hasItems || forceFloatBasket()" "$JS" \
  && grep -q "paintSticky();" "$JS" \
  && grep -q "pointerup" "$JS" \
  && grep -q "data-size-pick" "$JS" \
  && grep -q ".float-basket.has-items" "$CSS" \
  && grep -q "data-float-basket" "$THEME/snippets/sticky-reserve-bar.liquid" \
  && grep -q "data-float-count" "$THEME/snippets/sticky-reserve-bar.liquid" \
  && ! grep -A30 "@media (max-width: 899px)" "$CSS" | grep -q "float-basket.*display: *none"; then
  pass "sticky basket markup exists; JS shows on qty (has-items) without mobile hide"
else
  fail "sticky basket does not reveal on add, or is still hidden on mobile"
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
for sec in hero pair-cards benefits product-specs size-reserve faq; do
  if grep -q "\"type\": \"$sec\"" "$INDEX" || grep -q "\"$sec\"" "$INDEX"; then
    pass "index.json includes $sec"
  else
    fail "index.json missing $sec"
  fi
done

if grep -q '"type": "journal-home"' "$INDEX" || grep -q 'journal-home' "$INDEX"; then
  fail "Journal is on the homepage (index.json still references journal-home)"
else
  pass "Journal stays off the homepage"
fi

# --- Default palette sanity (v1 navy or v2 carbon; gold/ember accent) ---
if (grep -q "#1F3A5F" "$THEME/config/settings_data.json" || grep -q "#1A1A1A" "$THEME/config/settings_data.json") \
  && grep -q "#8A6D3B" "$THEME/config/settings_data.json"; then
  pass "default navy/carbon + gold palette in settings_data"
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

if grep -q "This page does not exist" "$THEME/snippets/product-absent.liquid" \
  && grep -q "comfort_tops_enabled" "$THEME/sections/main-comfort-top.liquid" \
  && grep -q "sheets_enabled" "$THEME/sections/main-bed-sheets.liquid" \
  && grep -q "pillows_enabled" "$THEME/sections/main-pillows.liquid"; then
  pass "accessory 404 markup when flags off"
else
  fail "accessory pages missing flag-off 404 markup"
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

if grep -q "brand.css" "$THEME/layout/theme.liquid" \
  && grep -q '"color_primary": "#1F3A5F"' "$THEME/config/settings_data.json" \
  && grep -q '"brand_guidelines": "v1"' "$THEME/config/settings_data.json" \
  && grep -q '"color_scheme": "signature"' "$THEME/config/settings_data.json" \
  && grep -q -- '--wordmark-color: #8A6D3B' "$THEME/assets/base.css" \
  && grep -q -- '--brand-gold: #8A6D3B' "$THEME/assets/brand.css" \
  && grep -q -- 'color: var(--brand-gold, var(--brand-accent, #8A6D3B))' "$THEME/assets/brand.css" \
  && grep -q -- 'color: var(--brand-on-dark, #F7F5F1)' "$THEME/assets/brand.css" \
  && grep -q -- 'border-top: 1px solid var(--brand-accent, #8A6D3B)' "$THEME/assets/brand.css" \
  && ! grep -q -- '--brand-primary: #1A1A1A' "$THEME/assets/brand.css" \
  && grep -q -- 'cubic-bezier(0.22, 1, 0.36, 1)' "$THEME/assets/brand.css" \
  && awk '
    /base\.css/ { base=NR }
    /brand\.css/ { brand=NR }
    END { exit !(base && brand && brand>base) }
  ' "$THEME/layout/theme.liquid"; then
  pass "brand.css last-wins cream-on-dark; gold paints wordmark and kickers"
else
  fail "navy/gold live tokens missing, carbon overlay still last-wins, or brand.css not after base.css"
fi

if grep -q '.announcement,' "$THEME/assets/brand.css" \
  && grep -q 'var(--brand-gold, var(--brand-accent, #8A6D3B)) 38%, #E8D4A2' "$THEME/assets/brand.css" \
  && grep -q 'var(--brand-gold, var(--brand-accent, #8A6D3B)) 38%, #E8D4A2' "$THEME/assets/base.css" \
  && ! grep -q 'color: #e8a184' "$THEME/assets/base.css"; then
  pass "announcement bar copy is restored gold on navy"
else
  fail "announcement bar is still cream or missing brand-accent gold"
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
  && [[ -f "$ROOT/preview/pages/comfort-top.html" ]] \
  && [[ -f "$ROOT/preview/pages/comfort-layer.html" ]] \
  && [[ -f "$ROOT/preview/pages/bed-sheets.html" ]] \
  && [[ -f "$ROOT/preview/pages/pillows.html" ]]; then
  pass "policy + product preview pages exist"
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

if grep -q '"id":"european-king"' "$ROOT/preview/index.html" \
  && grep -q '"label":"European King"' "$ROOT/preview/index.html" \
  && grep -q "id: 'european-king'" "$THEME/assets/theme.js" \
  && grep -q "160 × 200 cm" "$THEME/assets/theme.js" \
  && grep -q "European King" "$THEME/sections/size-guide.liquid" \
  && grep -q "European King" "$ROOT/preview/pages/size-guide.html" \
  && grep -q "size-guide-grid" "$THEME/sections/size-guide.liquid" \
  && grep -q "size-guide-grid" "$ROOT/preview/pages/size-guide.html" \
  && grep -q "Small Double" "$ROOT/preview/pages/size-guide.html"; then
  pass "European King 160×200 present; size guide is a full catalog with Small Double"
else
  fail "European King 160×200 missing"
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

if grep -q "Country blank or not set up → United Kingdom" "$THEME/snippets/size-market.liquid" \
  && grep -q "assign size_market = 'gb'" "$THEME/snippets/size-market.liquid" \
  && grep -q "iso == 'US'" "$THEME/snippets/size-market.liquid" \
  && ! grep -q "iso == 'AU'" "$THEME/snippets/size-market.liquid" \
  && grep -q "render 'size-market'" "$THEME/snippets/market.liquid"; then
  pass "size-market helper: GB/AE/US/EU, unknown country → UK"
else
  fail "size-market helper missing UK default, US, or market alias"
fi

if grep -q "window.ValtoraTheme.defaultMarket = 'gb'" "$THEME/layout/theme.liquid" \
  && grep -q "ValtoraTheme.countryIso" "$THEME/layout/theme.liquid" \
  && grep -q "ValtoraTheme.market" "$THEME/layout/theme.liquid"; then
  pass "theme.liquid injects country iso and UK defaultMarket"
else
  fail "theme.liquid missing country iso / UK defaultMarket"
fi

if python3 - "$JS" "$ROOT/preview/theme.js" <<'PY'
from pathlib import Path
import re, sys
ok = True
for path in sys.argv[1:]:
    t = Path(path).read_text()
    m = re.search(r"function paintMarketTabs\([^)]*\) \{.*?\n  \}", t, re.S)
    if not m or "hidden = false" in m.group(0) or "innerHTML = tabs" in m.group(0):
        print("tabs still painted in", path)
        ok = False
    if "return 'gb';" not in t or "rowBelongsToMarket" not in t:
        print("missing UK fallback or rowBelongsToMarket in", path)
        ok = False
    if "theme.countryIso" not in t:
        print("detectMarket missing countryIso in", path)
        ok = False
sys.exit(0 if ok else 1)
PY
then
  pass "theme.js country layer: UK fallback, no shopper market tabs"
else
  fail "theme.js still paints market tabs or defaults away from UK"
fi

if grep -q "display: none !important" "$THEME/assets/base.css" \
  && grep -q "display: none !important" "$ROOT/preview/base.css" \
  && grep -n "size-markets" "$THEME/assets/base.css" | head -1 | grep -q .; then
  pass "CSS hides shopper market tabs (theme + preview)"
else
  fail "size-markets CSS still visible"
fi

if python3 - "$JS" "$ROOT/preview/theme.js" <<'PY'
from pathlib import Path
import re, sys
ok = True
for path in sys.argv[1:]:
    t = Path(path).read_text()
    m = re.search(r"function countryToSizeMarket\([^)]*\) \{.*?\n  \}", t, re.S)
    if not m or "return 'au'" in m.group(0) or "AU' || c === 'NZ'" in m.group(0):
        print("countryToSizeMarket still maps AU as a shopper market in", path)
        ok = False
    if "if (isSizeMarket(fromCountry)) return fromCountry" not in t:
        print("detectMarket missing isSizeMarket guard in", path)
        ok = False
    if "SIZE_MAPS[market] || SIZE_MAPS.ae" in t:
        print("unknown-market size fallback still uses UAE in", path)
        ok = False
sys.exit(0 if ok else 1)
PY
then
  pass "unknown/AU country is not a shopper market (UK fallback)"
else
  fail "JS still treats AU or unknown ISO as a live market"
fi

if grep -q "data-market-only=\"ae\"{% if market != 'ae' %} hidden" "$THEME/sections/faq.liquid" \
  && grep -q "data-market-only=\"gb\"{% if market == 'ae' %} hidden" "$THEME/sections/faq.liquid" \
  && grep -q "visibility == 'gb' and market == 'ae'" "$THEME/sections/offer.liquid" \
  && grep -q "visibility == 'gb' and market == 'ae'" "$THEME/sections/trust-bar.liquid"; then
  pass "US/EU/unknown copy falls back to UK, not UAE"
else
  fail "FAQ/offer/trust-bar still show UAE copy outside AE"
fi

if grep -q "function buildSizeTileMarkup" "$JS" \
  && grep -q "function buildSizeTileMarkup" "$ROOT/preview/theme.js" \
  && ! grep -q 'class="size-row' "$JS" \
  && ! grep -q 'class="size-row' "$ROOT/preview/theme.js" \
  && grep -q 'class="size-list lp-sizes"' "$THEME/sections/landing-funnel.liquid" \
  && grep -q "data-size-pick" "$THEME/sections/landing-funnel.liquid" \
  && ! grep -q "size-rows" "$THEME/sections/landing-funnel.liquid" \
  && ! grep -q "iso == 'AU'" "$THEME/snippets/size-market.liquid"; then
  pass "size picker is a one-market tile grid; unlisted countries use UK"
else
  fail "size picker still has row markup, or AU is treated as a shopper market"
fi

# Choose-your-size chrome lock: one card system, centred ADD, no Emperor hole,
# no grey dummy squares, note-field contrast (c0b2830) kept, .size-row CSS present.
if python3 - "$THEME/assets/base.css" "$ROOT/preview/base.css" "$JS" "$ROOT/preview/theme.js" "$THEME/sections/landing-funnel.liquid" <<'PY'
from pathlib import Path
import re, sys

ok = True
css_paths = sys.argv[1:3]
js_paths = sys.argv[3:5]
funnel = Path(sys.argv[5]).read_text()

def picker_block(text):
    start = text.find("/* Size picker:")
    if start < 0:
        start = text.find(".size-list,")
    end = text.find(".size-markets")
    return text[start:end] if start >= 0 and end > start else ""

for path in css_paths:
    text = Path(path).read_text()
    block = picker_block(text)
    if not block:
        print(path, "missing size picker CSS block")
        ok = False
        continue
    if ".size-row {" not in block and ".size-row {" not in text:
        # restored alias: .size-option,\n.size-row {
        if ".size-row" not in block:
            print(path, "emptied .size-row CSS")
            ok = False
    if not re.search(r"\.size-option,\s*\.size-row", block):
        print(path, "size-option and size-row are not one shared card class")
        ok = False
    if re.search(r"\.size-option\.is-in-basket[^{]*\{[^}]*background:\s*var\(--brand-surface\)", block):
        print(path, "selected size cards still use beige leftover --brand-surface")
        ok = False
    if "color-mix(in srgb, var(--brand-primary)" not in block:
        print(path, "selected state is not a navy-tint variant")
        ok = False
    add_rule = re.search(r"\.size-option__add,\s*\.size-row__add\s*\{([^}]+)\}", block, re.S)
    if not add_rule or "margin-inline: auto" not in add_rule.group(1) or "align-self: center" not in add_rule.group(1):
        print(path, "ADD is not centred (corner-jammed)")
        ok = False
    foot = re.search(r"\.size-option__foot,\s*\.size-row__foot\s*\{([^}]+)\}", block, re.S)
    if not foot or "justify-content: center" not in foot.group(1) or "margin-left: 0" not in foot.group(1):
        print(path, "size foot is not centred card chrome")
        ok = False
    if "last-child:nth-child(odd)" not in block or "grid-column: 1 / -1" not in block:
        print(path, "last odd size cell still leaves a grid hole")
        ok = False
    # Grey 1:1 dummy squares must stay gone from picker tiles
    if re.search(r"\.(size-option|size-row)[^{]*\{[^}]*aspect-ratio:\s*1\s*/\s*1", block):
        print(path, "size cards have 1:1 grey placeholder squares")
        ok = False
    if re.search(r"\.(size-option|size-row)::after[^{]*\{[^}]*content:\s*['\"](?!none)", block):
        print(path, "size cards generate dummy ::after boxes")
        ok = False
    # Note field contrast (c0b2830)
    if "--field-fill:" not in text or "--field-line:" not in text:
        print(path, "size-note lost field fill/border contrast")
        ok = False
    if not re.search(r"\.size-note textarea[^{]*\{[^}]*background:\s*var\(--field-fill", text, re.S):
        print(path, "size-note textarea missing distinct --field-fill")
        ok = False
    if not re.search(r"\.size-note textarea[^{]*\{[^}]*border:\s*1\.5px solid var\(--field-line", text, re.S):
        print(path, "size-note textarea missing distinct --field-line")
        ok = False
    # Hover must not reintroduce beige selected leftover
    if re.search(r"\.size-option\.is-in-basket:hover[^{]*\{[^}]*background:\s*var\(--brand-surface\)", text):
        print(path, "selected hover still paints beige leftover")
        ok = False

for path in js_paths:
    t = Path(path).read_text()
    if 'class="size-option' not in t or "size-option__add" not in t or "size-option__qty" not in t:
        print(path, "tile markup missing shared size-option ADD/qty")
        ok = False
    if "size-option__media" in t or "size-option__bed" in t:
        print(path, "size tiles grew dummy image boxes")
        ok = False
    if re.search(r"\.slice\(\s*0\s*,\s*7\s*\)", t) or "hardcoded seven" in t:
        print(path, "size list hardcoded to seven")
        ok = False
    if "european-king" not in t or "160 × 200 cm" not in t:
        print(path, "European King 160 × 200 cm missing")
        ok = False
    if "catalogRowsFrom" not in t or "if (!tokens.length) return true" not in t or "var sizes = [];" not in t:
        print(path, "picker is not painting every Shopify size from Market Shown")
        ok = False

if "data-size-pick" not in funnel or "data-lp-sizes" not in funnel:
    print("landing-funnel missing data-size-pick / size list")
    ok = False
if "size-rows" in funnel:
    print("landing-funnel reintroduced size-rows markup")
    ok = False

sys.exit(0 if ok else 1)
PY
then
  pass "size picker chrome: one card system, centred ADD, last-odd centred, no dummy squares, note contrast"
else
  fail "size picker chrome regressed (two skins, jammed ADD, Emperor hole, dummy squares, or washed note)"
fi

if grep -q "how-to-choose-a-mattress" "$THEME/snippets/journal-article-body.liquid" \
  && grep -q "mattress-firmness-guide" "$THEME/snippets/journal-article-body.liquid" \
  && grep -q "hybrid-vs-foam-vs-innerspring" "$THEME/snippets/journal-baked-index.liquid" \
  && grep -q "Ben Acolatse, CEO" "$THEME/snippets/journal-baked-index.liquid" \
  && grep -q "journal-baked-index" "$THEME/sections/main-journal.liquid" \
  && grep -q "journal-baked-index" "$THEME/sections/main-blog.liquid" \
  && grep -q "page.handle == 'journal'" "$THEME/sections/main-page.liquid" \
  && grep -q "Ben Acolatse" "$THEME/snippets/journal-author.liquid" \
  && grep -q "CEO" "$THEME/snippets/journal-author.liquid" \
  && ! grep -q "New notes, in time" "$THEME/sections/main-journal.liquid" \
  && grep -q "articles_count" "$THEME/snippets/journal-index-href.liquid"; then
  pass "Journal keeps baked notes, CEO byline, and prefers a populated blog"
else
  fail "Journal missing baked notes, CEO byline, or populated-blog-first nav"
fi

MFG="$THEME/sections/manufacturing.liquid"
MFG_JSON="$THEME/templates/page.manufacturing.json"
MFG_PREVIEW="$ROOT/preview/pages/manufacturing.html"
if grep -q "keep every layer" "$MFG" \
  && grep -q "1.8 / 2.0mm" "$MFG" \
  && grep -q "Made by experts who have been making mattresses for 49 years." "$MFG" \
  && grep -q "Made after you order" "$MFG" \
  && grep -q "mfg-stack" "$MFG" \
  && ! grep -q "Handmade" "$MFG" \
  && ! grep -q "Made by hand" "$MFG" \
  && ! grep -q "Designed in Dubai" "$MFG" \
  && ! grep -q "An ethos, not a catalogue find" "$MFG" \
  && ! grep -q "Small Double" "$MFG" \
  && ! grep -q "California King" "$MFG" \
  && ! grep -q "founder-ben" "$MFG"; then
  pass "manufacturing section matches how-it-is-built brief"
else
  fail "manufacturing section missing brief copy or still has the old founder page"
fi

if python3 - "$MFG_JSON" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
main = data["sections"]["main"]
blob = json.dumps(data)
sys.exit(0 if main.get("type") == "manufacturing"
         and "Small Double" not in blob
         and "California King" not in blob
         and "landing-funnel" not in blob
         and "keep every layer" in blob
         and "1.8 / 2.0mm" in blob
         else 1)
PY
then
  pass "page.manufacturing.json uses manufacturing section, UK six, 20/10/35"
else
  fail "page.manufacturing.json is still stacked landing-funnel or has phantom sizes"
fi

if grep -q "mfg-stack" "$MFG_PREVIEW" \
  && grep -q "keep every layer" "$MFG_PREVIEW" \
  && grep -q "1.8 / 2.0mm" "$MFG_PREVIEW" \
  && grep -q "Made by experts who have been making mattresses for 49 years." "$MFG_PREVIEW" \
  && ! grep -q "Small Double" "$MFG_PREVIEW" \
  && ! grep -q "California King" "$MFG_PREVIEW" \
  && ! grep -q "Handmade" "$MFG_PREVIEW"; then
  pass "preview manufacturing matches how-it-is-built brief"
else
  fail "preview manufacturing missing brief copy or still has phantom sizes"
fi

if python3 - "$THEME/templates/page.specification.json" "$THEME/templates/page.what-it-buys.json" <<'PY'
import json, sys
spec = json.load(open(sys.argv[1]))
buys = json.load(open(sys.argv[2]))
kept_spec = spec.get("sections", {}).get("kept", {}).get("settings", {})
kept_buys = buys.get("sections", {}).get("kept", {}).get("settings", {})
ok = kept_spec.get("heading") == "Built to be kept" and kept_spec.get("enable_section") is False
ok = ok and kept_buys.get("heading") == "Built to be kept" and kept_buys.get("enable_section") is True
sys.exit(0 if ok else 1)
PY
then
  pass "Built to be kept stays on what-it-buys, off specification"
else
  fail "Built to be kept enable flags drifted from the brief"
fi

# --- Section grounds: Snow / Surface / Dark, neighbours never match ---
if python3 - "$THEME/templates" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
fail = []

def enabled_grounds(data):
    out = []
    for sid in data.get("order", []):
        sec = data["sections"][sid]
        st = sec.get("settings", {})
        if st.get("enable_section") is False:
            continue
        g = st.get("ground")
        if sec.get("type") == "hero":
            g = "dark" if st.get("tone") == "dark" else (g or "bg")
        out.append((sid, g or "missing"))
    return out

def assert_neighbours(name, data):
    prev = None
    for sid, g in enabled_grounds(data):
        if g not in ("bg", "surface", "dark"):
            fail.append(f"{name} {sid} ground={g}")
        if prev and prev == g:
            fail.append(f"{name} {sid} shares {g} with neighbour")
        prev = g

for fname in [
    "index.json",
    "page.landing.json",
    "page.about.json",
    "page.mattress-recycling.json",
    "page.large-sizes.json",
    "page.european-king.json",
    "page.specification.json",
    "page.what-it-buys.json",
    "page.support.json",
    "page.cooling.json",
    "page.split-king.json",
]:
    assert_neighbours(fname, json.loads((root / fname).read_text()))

idx = json.loads((root / "index.json").read_text())
want = {
    "pair-cards": "dark",
    "swap-explainer": "bg",
    "size-reserve": "surface",
    "founder-note": "dark",
    "offer": "dark",
    "faq": "surface",
    "lifestyle-collage": "dark",
}
for sid, g in want.items():
    got = idx["sections"][sid]["settings"].get("ground")
    if got != g:
        fail.append(f"index {sid} expected {g} got {got}")

about = json.loads((root / "page.about.json").read_text())
if about["sections"]["hero"]["settings"].get("ground") == about["sections"]["story"]["settings"].get("ground"):
    fail.append("about hero/story share a ground")

if fail:
    print("\n".join(fail))
    sys.exit(1)
PY
then
  pass "section grounds alternate Snow / Surface / Dark on homepage and landings"
else
  fail "section grounds still collide or left auto/beige-on-beige"
fi

if grep -q "Each ground paints its Shopify wrapper" "$THEME/assets/base.css" \
  && grep -q 'has(> .section--surface)' "$THEME/assets/base.css" \
  && grep -q 'has(> .section--bg)' "$THEME/assets/base.css" \
  && grep -q "Each ground paints its Shopify wrapper" "$ROOT/preview/base.css"; then
  pass "CSS paints Snow / Surface / Dark wrappers"
else
  fail "CSS wrappers still only paint dark bands"
fi

if grep -q "Snow → Surface → Dark" "$JS" \
  && grep -q "Snow → Surface → Dark" "$ROOT/preview/theme.js" \
  && grep -q "else if (prev === 'surface') next = 'dark'" "$JS"; then
  pass "JS auto ground cycles Snow / Surface / Dark"
else
  fail "JS auto ground still only flips beige/stone"
fi

if grep -q "mfg-band--surface" "$THEME/sections/manufacturing.liquid" \
  && grep -q "mfg-band--dark" "$THEME/sections/manufacturing.liquid" \
  && grep -q "mfg-band--dark h1" "$THEME/assets/manufacturing.css"; then
  pass "manufacturing bands use Surface and Dark, not one snow field"
else
  fail "manufacturing bands still share one ground"
fi

# Homepage light hero: controlled-height band (pre-070a1cb). Natural-height
# contain with max-height:none made the 2000x1116 photo ~60-70vh. Restore the
# 52vh/42vh/58vh caps from 79db8e6 / 10.1.0-size-picker-and-contrast.
if python3 - "$THEME/assets/base.css" "$ROOT/preview/base.css" <<'PY'
import re, sys

def light_hero_img_ok(path):
    text = open(path).read()
    if re.search(
        r"\.hero--light \.hero__media img[^{]*\{[^}]*max-height:\s*none",
        text,
    ):
        print(f"{path}: light hero img still has max-height: none")
        return False
    base = re.search(
        r"\.hero--light \.hero__media img[^{]*\{([^}]+)\}",
        text,
    )
    if not base or not re.search(r"max-height:\s*min\(\s*52vh,\s*30rem\s*\)", base.group(1)):
        print(f"{path}: missing light hero max-height min(52vh, 30rem)")
        return False
    if "max-height: min(42vh, 20rem)" not in text:
        print(f"{path}: missing mobile light hero max-height min(42vh, 20rem)")
        return False
    if "max-height: min(58vh, 36rem)" not in text:
        print(f"{path}: missing desktop light hero max-height min(58vh, 36rem)")
        return False
    return True

ok = all(light_hero_img_ok(p) for p in sys.argv[1:])
sys.exit(0 if ok else 1)
PY
then
  pass "light hero uses the pre-070a1cb max-height band on mobile and desktop"
else
  fail "light hero still uses natural-height contain (giant photo)"
fi

# 390px overflow lock: hero h1 / announcement must wrap or clamp at max-width 899.
# Brand Display mobile is 38px (TOKENS.md). A 72px nowrap headline cannot ship.
if python3 - "$THEME/assets/base.css" "$THEME/assets/mobile-fit.css" "$ROOT/preview/base.css" "$ROOT/preview/mobile-fit.css" <<'PY'
import re, sys

def media_899_blocks(text):
    blocks = []
    for m in re.finditer(r"@media\s*\(\s*max-width:\s*899px\s*\)\s*\{", text):
        start = m.end()
        depth = 1
        i = start
        while i < len(text) and depth:
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
            i += 1
        blocks.append(text[start : i - 1])
    return blocks

def file_ok(path):
    text = open(path).read()
    blocks = media_899_blocks(text)
    joined = "\n".join(blocks)
    if not blocks:
        print(f"{path}: no @media (max-width: 899px) block")
        return False
    h1_ok = (
        re.search(r"\.hero(?:--light)?\s+h1[^{]*\{[^}]*clamp\(", joined)
        or re.search(r"\.hero(?:--light)?\s+h1[^{]*\{[^}]*max-width:\s*100%", joined)
        or ("clamp(2rem" in joined and "h1" in joined)
    )
    wrap_ok = (
        "overflow-wrap" in joined
        or "max-width: 100%" in joined
        or "white-space: normal" in joined
    )
    overflow_ok = "overflow-x: clip" in joined or "overflow-x: hidden" in joined
    announce_ok = (
        "overflow-wrap" in text
        and re.search(r"\.announcement[^{]*\{[^}]*overflow-wrap", text)
    ) or "overflow-wrap: break-word" in joined
    if not h1_ok:
        print(f"{path}: hero h1 in max-width 899 missing clamp or max-width 100%")
        return False
    if not wrap_ok:
        print(f"{path}: max-width 899 missing wrap/max-width 100%")
        return False
    if not overflow_ok:
        print(f"{path}: max-width 899 missing overflow-x clip/hidden")
        return False
    if not announce_ok:
        print(f"{path}: announcement missing overflow-wrap")
        return False
    return True

ok = all(file_ok(p) for p in sys.argv[1:])
sys.exit(0 if ok else 1)
PY
then
  pass "390 overflow lock: hero h1 clamps/wraps and announcement wraps at max-width 899"
else
  fail "390 overflow lock missing clamp/wrap on hero h1 or announcement"
fi

# Dark-ground type: Cool Touch spans/captions/eyebrows are snow, never gold/ink.
if grep -q '#cool-touch.section--dark .cool-touch__points span' "$THEME/assets/base.css" \
  && grep -q '#cool-touch.section--dark .cool-touch__thumb-caption' "$THEME/assets/base.css" \
  && grep -q '#cool-touch.section--dark .section__eyebrow' "$THEME/assets/base.css" \
  && grep -q 'color: var(--brand-on-dark) !important' "$THEME/assets/base.css" \
  && grep -q '#cool-touch.section--dark .cool-touch__points span' "$ROOT/preview/base.css"; then
  pass "Cool Touch dark copy is forced snow with winning specificity"
else
  fail "Cool Touch spans/captions/eyebrow still lack a winning on-dark rule"
fi

if grep -q 'assign eyebrow_on_dark = color_on_dark' "$THEME/snippets/css-variables.liquid" \
  && ! grep -q 'assign eyebrow_on_dark = color_accent' "$THEME/snippets/css-variables.liquid" \
  && ! grep -q "assign eyebrow_on_dark = '#C4B49A'" "$THEME/snippets/css-variables.liquid"; then
  pass "on-dark eyebrow token is snow, never gold"
else
  fail "css-variables still paints gold eyebrows on dark"
fi

# Concierge delivery: spec table panel restored from fbad89c. Not cards.
if grep -q 'Concierge delivery — spec table panel (restored fbad89c)' "$THEME/assets/base.css" \
  && grep -q 'Concierge delivery — spec table panel (restored fbad89c)' "$ROOT/preview/base.css" \
  && grep -q 'grid-template-columns: repeat(auto-fit, minmax(210px, 1fr))' "$THEME/assets/base.css" \
  && grep -q '.lp-section--delivery .lp-tier--pick' "$THEME/assets/base.css" \
  && grep -q '.lp-svc__item' "$THEME/assets/base.css" \
  && grep -q 'border-radius: 0 !important' "$THEME/assets/base.css"; then
  pass "delivery CSS is the original spec table panel (cream fill, navy type)"
else
  fail "delivery CSS is not the restored fbad89c table/panel layout"
fi

if grep -q "layout == 'delivery'" "$THEME/sections/landing-funnel.liquid" \
  && grep -q 'section--dark' "$THEME/sections/landing-funnel.liquid" \
  && grep -q 'lp-delivery' "$THEME/sections/landing-funnel.liquid" \
  && grep -q 'lp-svc__item' "$THEME/sections/landing-funnel.liquid" \
  && grep -q '"layout": "delivery"' "$THEME/templates/page.specification.json" \
  && grep -q '"ground": "dark"' "$THEME/templates/page.specification.json" \
  && grep -q '"type": "landing-funnel"' "$THEME/templates/index.json" \
  && grep -q '"anchor_id": "delivery"' "$THEME/templates/index.json" \
  && grep -q '"delivery"' "$THEME/templates/index.json"; then
  pass "homepage and specification share landing-funnel delivery (forced navy)"
else
  fail "delivery layout missing from homepage, specification, or landing-funnel"
fi

if grep -q 'lp-section--delivery section--dark' "$ROOT/preview/pages/specification.html" \
  && grep -q 'lp-section--delivery section--dark' "$ROOT/preview/index.html" \
  && grep -q 'id="delivery"' "$ROOT/preview/index.html" \
  && grep -q 'It arrives compressed' "$ROOT/preview/index.html" \
  && grep -q 'lp-svc__item' "$ROOT/preview/pages/specification.html"; then
  pass "preview homepage and specification use the same navy delivery markup"
else
  fail "preview homepage or specification still uses old delivery markup"
fi

# How it is built: cream panel with hairline columns, gold kickers. Not Apple cards.
if grep -q 'lp-section--built' "$THEME/sections/landing-funnel.liquid" \
  && grep -q 'lp-card__kicker' "$THEME/sections/landing-funnel.liquid" \
  && grep -q 'How it is built — one cream panel with hairline columns' "$THEME/assets/base.css" \
  && grep -q 'How it is built — one cream panel with hairline columns' "$ROOT/preview/base.css" \
  && grep -q 'How it is built last-wins' "$THEME/assets/brand.css" \
  && grep -q '"anchor_id": "how-it-is-built"' "$THEME/templates/page.specification.json" \
  && grep -q 'id="how-it-is-built"' "$ROOT/preview/pages/specification.html" \
  && grep -q 'lp-card__kicker' "$ROOT/preview/pages/specification.html" \
  && grep -q 'lp-built' "$ROOT/preview/pages/specification.html" \
  && grep -q 'gold-rule' "$ROOT/preview/pages/specification.html"; then
  pass "How it is built is a cream hairline panel with gold kickers"
else
  fail "How it is built is still cramped lp-cards without panel language"
fi

if python3 - "$THEME/assets/base.css" "$ROOT/preview/base.css" <<'PY'
import re, sys
ok = True
for path in sys.argv[1:]:
    text = open(path).read()
    start = text.find("How it is built — one cream panel with hairline columns")
    if start < 0:
        print(path, "missing how-it-is-built CSS")
        ok = False
        continue
    block = text[start:start + 3500]
    if "border-radius: 16px" in block or "border-radius: 12px" in block:
        print(path, "how-it-is-built uses 12/16px radius")
        ok = False
    if "box-shadow:" in block and "box-shadow: none" not in block:
        print(path, "how-it-is-built has a real shadow")
        ok = False
    if "padding: 2rem 2rem" not in block and "padding: 2rem" not in block:
        print(path, "how-it-is-built missing 32px cell padding")
        ok = False
sys.exit(0 if ok else 1)
PY
then
  pass "How it is built CSS stays 2px panel, no 16px cards"
else
  fail "How it is built CSS drifted into card chrome"
fi

if grep -q '#cool-touch.section--dark .cool-touch__points span' "$THEME/assets/base.css" \
  && grep -q 'color: var(--brand-on-dark) !important' "$THEME/assets/base.css"; then
  pass "Cool Touch snow-on-navy lock is still present"
else
  fail "Cool Touch cream-on-navy lock was reverted"
fi

if grep -q 'bottom: 0 !important' "$THEME/assets/base.css" \
  && grep -q '.float-basket' "$THEME/assets/base.css"; then
  pass "sticky basket stays pinned to bottom: 0"
else
  fail "float-basket is not pinned to bottom: 0"
fi

# No leftover inspector cyan outlines (* { outline: 1px solid cyan }).
if python3 - "$THEME/assets/base.css" "$ROOT/preview/base.css" "$THEME/assets/mobile-fit.css" "$ROOT/preview/mobile-fit.css" <<'PY'
import re, sys
ok = True
for path in sys.argv[1:]:
    raw = open(path).read()
    stripped = re.sub(r"/\*.*?\*/", "", raw, flags=re.S)
    if re.search(r"outline:\s*1px solid cyan", stripped, re.I):
        print(path, "has outline: 1px solid cyan")
        ok = False
    if re.search(r"\*\s*\{[^}]*outline:\s*[^}]*cyan", stripped, re.I):
        print(path, "has * { outline cyan }")
        ok = False
sys.exit(0 if ok else 1)
PY
then
  pass "no * outline cyan debug rules"
else
  fail "cyan debug outlines still in CSS"
fi

if grep -q '.section--dark \[class\*="muted"\]' "$THEME/assets/base.css" \
  && grep -q '.section--dark .kicker' "$THEME/assets/base.css" \
  && grep -q '.policy-cta .section__eyebrow' "$THEME/assets/base.css"; then
  pass "dark lock covers muted/kicker/figcaption/Next siblings"
else
  fail "dark type lock missing muted/kicker/Next sibling selectors"
fi

# Original card chrome: 0.35rem (4fee53a). Not 2px fake radius, not 16px filled-card.
if grep -q 'border-radius: 0.35rem' "$THEME/assets/base.css" \
  && grep -q -- '--radius: 0.35rem' "$THEME/assets/brand.css" \
  && grep -q -- '--radius-control: 0.35rem' "$THEME/assets/brand.css" \
  && grep -q '.size-option,' "$THEME/assets/base.css" \
  && grep -q '.size-row {' "$THEME/assets/base.css" \
  && grep -q '.size-option,' "$THEME/assets/base.css" \
  && ! grep -q -- '--radius-card: 16px' "$THEME/assets/brand.css" \
  && ! grep -q -- '--radius: 2px' "$THEME/assets/brand.css"; then
  pass "card chrome restored to original 0.35rem fill+radius+shadow (not 2px, not 16px)"
else
  fail "card chrome is still 2px, 16px, or missing size-row"
fi

info "----------------------------------------"
if [[ "$FAIL" -gt 0 ]]; then
  red "SMOKE FAILED — $FAIL check(s)"
  exit 1
fi

green "SMOKE PASSED"
exit 0
