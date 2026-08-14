# Valtora order-status worker

Cloudflare Worker behind a Shopify App Proxy (`/apps/order`). Same JSON contract if the store leaves Shopify.

Full setup: [`docs/ORDER_TRACKING.md`](../../docs/ORDER_TRACKING.md).

```bash
cd apps/order-status-worker
cp .dev.vars.example .dev.vars
npx wrangler deploy
npx wrangler secret put SHOPIFY_API_SECRET
npx wrangler secret put SHOPIFY_ADMIN_TOKEN
npx wrangler secret put TOKEN_SECRET
npx wrangler secret put NOTIFY_SECRET
npx wrangler secret put RESEND_API_KEY
```

Do not set `ALLOW_UNSIGNED` in production.
