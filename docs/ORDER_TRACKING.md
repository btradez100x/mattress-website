# Order tracking

App Proxy for the status page. Email for every stage update and for the lookup link. That split is deliberate: the page can move off Shopify later; customers still get told when something changes.

The theme never talks to Shopify order types. It fetches a JSON contract from `settings.order_lookup_endpoint` (default `/apps/order`). If Shopify gets too expensive, point that setting at `https://api.valtora.com/order` and keep the same payload.

**Lookup is off until the worker is live.** Theme setting `order_lookup_enabled` defaults to false. The form stays disabled and says so.

---

## What the customer sees

| Path | What happens |
|---|---|
| Email | One-tap `/pages/order-status?t=TOKEN`. JS then calls `GET /apps/order?t=TOKEN`. No login. |
| Form | Order number + email. Always: “If that matches an order, we have sent you a link.” Never “order not found”. |
| Browse (no token) | The form plus all eight stages as an explanation. Idle state is the trust argument. |

Copy never says live tracking. It is updated by hand.

Eight stages. A live order only shows stages that have happened. Stage 5 is market-aware (UK or UAE). Only stage 7 shows a firm date.

1. Order confirmed (automatic: paid)
2. In production (tag `stage-2`)
3. Quality checked (`stage-3`)
4. In transit (`stage-4`)
5. Arrived locally (`stage-5`)
6. Delivery being arranged (`stage-6`)
7. Delivery booked (`stage-7` + `delivery_date`)
8. Delivered (automatic: fulfilled)

Exceptions: delayed (notice + revised window + cancel restated), cancelled, refunded. If `stage_updated_at` is older than 14 days: “Last updated X days ago…” plus contact.

---

## JSON contract

```json
{
  "status": "idle | ok | delayed | cancelled | refunded | sent | expired | error",
  "message": "If that matches an order, we have sent you a link.",
  "order": {
    "reference": "1042",
    "stage": 4,
    "stage_name": "In transit",
    "stages": [{ "n": 1, "name": "Order confirmed", "current": false }],
    "stage_updated_at": "2026-08-01T12:00:00Z",
    "size_label": "King",
    "size_dims": "180 × 200 cm",
    "delivery_window": "8 to 10 weeks",
    "delivery_date": null,
    "delay_notice": null,
    "revised_window": null,
    "batch_photo_url": null,
    "updated_by_hand": true,
    "next": "It is on its way. We will email when it arrives."
  }
}
```

No address, no payment, no prices. `delivery_date` is null unless stage is 7 or 8.

---

## Worker (Cloudflare)

Code: `apps/order-status-worker/`.

| Method | Path on the worker | Who calls it |
|---|---|---|
| GET | `/?t=TOKEN` | Theme, via App Proxy `/apps/order?t=` |
| POST | `/lookup` | Theme form, via `/apps/order/lookup` |
| POST | `/notify` | Shopify Flow only. Not via the proxy. Header `X-Notify-Secret`. |

Shopify custom app, App Proxy:

- Subpath prefix: `apps`
- Subpath: `order`
- Proxy URL: `https://valtora-order-status.valtora.workers.dev/`

The worker is deployed and reachable on public HTTPS (`GET /` returns `{"status":"idle"}`). The local preview server is not required for the worker.

**Lookup stays off** (`order_lookup_enabled` false) until the checklist below is done.

### Go-live checklist (paste in Admin)

1. Shopify custom app → App Proxy: prefix `apps`, subpath `order`, Proxy URL `https://valtora-order-status.valtora.workers.dev/`
2. Secrets (never in the theme or git):
   ```
   cd apps/order-status-worker
   npx wrangler secret put SHOPIFY_API_SECRET
   npx wrangler secret put SHOPIFY_ADMIN_TOKEN
   npx wrangler secret put TOKEN_SECRET
   npx wrangler secret put NOTIFY_SECRET
   npx wrangler secret put RESEND_API_KEY
   ```
3. Update `[vars]` in `wrangler.toml` (or Cloudflare dashboard) from placeholders to the real shop, status page URL, and from-address. Redeploy.
4. Then turn on `order_lookup_enabled` and set `order_lookup_endpoint` to `/apps/order`.

`.dev.vars` is local only and gitignored. Never put `localhost` or a tunnel URL in production `wrangler.toml`.

Secrets (`wrangler secret put`):

- `SHOPIFY_API_SECRET` — proxy signature
- `SHOPIFY_ADMIN_TOKEN` — `read_orders` (and `read_files` if you show a batch photo)
- `TOKEN_SECRET` — HMAC for email tokens (90 days)
- `NOTIFY_SECRET` — Flow to `/notify`
- `RESEND_API_KEY` — without it, lookup still returns the generic message and logs the skip

Vars in `wrangler.toml`: `SHOPIFY_SHOP`, `STATUS_PAGE_URL` (`https://your-domain.com/pages/order-status`), `EMAIL_FROM`.

Local: copy `.dev.vars.example` to `.dev.vars`. `ALLOW_UNSIGNED=1` is for local POST lookup only. Never set it in production.

POST `/lookup` without a Shopify proxy signature is rejected unless `ALLOW_UNSIGNED=1`. GET with a valid token is allowed without a proxy signature so the same worker can sit behind a non-Shopify origin later. The token is the auth.

---

## Cart attributes vs metafields

Checkout already writes cart attributes through `ValtoraUTM.setAttribute`:

`order_stage`, `stage_updated_at`, `delivery_window`, `size_label`, `size_dims`

Those land as **order note attributes**, not metafields. The theme cannot write Order metafields.

**Do not trust browser `order_stage`.** Stage 1 is “Order paid”. Flow copies size/window/label from note attributes onto metafields after pay.

Confirm on a £1 order that those note attributes actually appear on the order (see Verification).

---

## Metafields (Order, namespace `custom`)

Run the mutations in `apps/order-status-worker/shopify/metafield-definitions.graphql`.

Order metafields:

| Key | Type | Notes |
|---|---|---|
| `order_stage` | single_line_text | `"1"` to `"8"` |
| `stage_updated_at` | date_time | Set by Flow, not the browser |
| `delivery_window` | single_line_text | Copied from note attributes on pay |
| `delivery_date` | date | Only at stage 7 |
| `delay_notice` | multi_line_text | Blank unless delayed |
| `revised_window` | single_line_text | Blank unless delayed |
| `batch_photo` | file_reference | Optional; shop-level run image later, not per-order |
| `size_label` | single_line_text | Copied from note attributes |
| `size_dims` | single_line_text | Copied from note attributes |

Product / variant metafields (lead time resolver + comfort top):

| Key | Owner | Type | Notes |
|---|---|---|---|
| `lead_time_min_weeks` | Product, Variant | integer | Variant overrides product |
| `lead_time_max_weeks` | Product, Variant | integer | Variant overrides product |
| `lead_time_note` | Product, Variant | single_line_text | Optional display override |
| `firmness_number` | Product | integer | Comfort top: 4 / 6 / 8 |
| `suits` | Product | single_line_text | Who the feel is for |

Comfort top Admin product (owner publishes): type `top`, 12 variants (Size × Firmness). Assign `product.comfort-top`. When `comfort_tops_enabled` is off, unpublish the product so sitemaps get a real HTTP 404; the template also renders a 404 body + noindex.

Shopify Flow cannot trigger on metafield change. Stages 2 to 7 are tags `stage-2` … `stage-7`. Flow writes the metafield plus timestamp, then HTTP to the worker for email.

---

## Flow (create these four)

### 1. Order paid to stage 1

Trigger: Order paid.

Actions:

1. Update order metafield `custom.order_stage` = `1`
2. Update `custom.stage_updated_at` = now
3. Copy note attributes `size_label`, `size_dims`, `delivery_window` onto the matching metafields if present
4. HTTP POST `https://valtora-order-status.valtora.workers.dev/notify`  
   Header: `X-Notify-Secret: <NOTIFY_SECRET>`  
   Body: `{ "order_id": "{{ order.admin_graphql_api_id }}", "type": "stage" }`

### 2. Tag `stage-2` … `stage-7`

Trigger: Order tagged.

Condition: tag is one of `stage-2` … `stage-7`.

Actions: set `order_stage` to the matching number, set `stage_updated_at`, HTTP `/notify` as above. For `stage-7`, staff must also fill `delivery_date` on the order or the page will still only show the window.

Admin habit: add the tag, save. Under 10 seconds.

### 3. Order fulfilled to stage 8

Trigger: Order fulfilled. Same metafield + notify pattern with stage `8`.

### 4. Delay (optional)

When you fill `delay_notice` / `revised_window`, send `/notify` with `"type": "stage"` from a manual Flow run, or include the delay copy in the next stage email. There is no metafield-change trigger.

Saved views in admin: orders tagged `stage-N`; orders whose stage has not moved in 14 days (filter by tag age if the metafield filter is missing).

---

## Email copy

From: `EMAIL_FROM` via Resend. Status URL: `STATUS_PAGE_URL?t=TOKEN`.

**Lookup / new link**

Subject: `Your order 1042 — view status`

```
Here is the link to your mattress order 1042.

https://your-domain.com/pages/order-status?t=…

This page is updated by hand as your mattress moves through production. It is not live tracking.
The link works for 90 days. If it expires, enter your order number and email on the same page and we will send a new one.
```

**Stage change**

Subject: `Order 1042 — In production`

```
An update on your mattress (order 1042): In production.

The factory has your order. We update this by hand when the next stage is done.

View status (updated by hand, not live tracking):
https://your-domain.com/pages/order-status?t=…
```

Put the same status URL into Shopify’s own order-confirmation template once lookup is on (Theme settings, Enable order lookup). Until then, do not promise a working link.

---

## Theme settings

| Setting | Default | When to change |
|---|---|---|
| `order_lookup_enabled` | false | true after proxy + Resend + Flow are proven |
| `order_lookup_endpoint` | `/apps/order` | `https://api.valtora.com/order` if you leave Shopify |

Preview (`preview/pages/order-status.html`) mocks every page state. It does not call the worker.

---

## Leaving Shopify later

1. Keep this JSON contract.
2. Point `order_lookup_endpoint` at your API.
3. Keep Resend and the same email copy.
4. Replace Admin GraphQL in the worker with your own order store.
5. Put `/lookup` behind your own origin (no Shopify proxy signature). Tokens still authenticate GET.

---

## Verification (not code)

1. £1 order with `?utm_source=test&utm_medium=verify` — UTMs on the order and in CSV.
2. Same order: note attributes `order_stage`, `stage_updated_at`, `delivery_window`, `size_label`, `size_dims`. Then confirm Flow copied size/window onto metafields and set stage 1 from paid, not from the browser value.
3. With lookup on: form always returns the generic sentence, including a wrong email.
4. Email link opens the page at the current stage; expired token shows the form plus expiry sentence.
5. Tag `stage-5` on a UK order vs UAE order — copy says the right country.
6. Fulfil the order — page shows Delivered.
