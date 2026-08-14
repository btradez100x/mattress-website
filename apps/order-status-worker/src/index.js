/**
 * Valtora order-status API.
 * Shopify App Proxy today; same JSON contract if the store leaves Shopify.
 *
 * GET  /?t=TOKEN          → order JSON (email one-tap)
 * POST /lookup            → { status: "sent" } always (form; emails a link if matched)
 * POST /notify            → Flow/server: send stage or link email (NOTIFY_SECRET)
 */

const STAGES = [
  { n: 1, key: "confirmed", name: "Order confirmed" },
  { n: 2, key: "production", name: "In production" },
  { n: 3, key: "quality", name: "Quality checked" },
  { n: 4, key: "transit", name: "In transit" },
  { n: 5, key: "arrived", name: "Arrived locally" },
  { n: 6, key: "arranging", name: "Delivery being arranged" },
  { n: 7, key: "booked", name: "Delivery booked" },
  { n: 8, key: "delivered", name: "Delivered" },
];

const GENERIC_SENT =
  "If that matches an order, we have sent you a link.";
const EXPIRED_MSG =
  "That link has expired. Enter your details and we will send a new one.";

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = normalizePath(url.pathname);

      if (request.method === "OPTIONS") {
        return cors(new Response(null, { status: 204 }));
      }

      if (request.method === "POST" && path === "/notify") {
        return cors(await handleNotify(request, env));
      }

      if (path === "/lookup" && request.method === "POST") {
        const url = new URL(request.url);
        const hasSig = url.searchParams.has("signature") || url.searchParams.has("hmac");
        if (hasSig) {
          const gate = await verifyShopifyProxy(url, env);
          if (!gate.ok) return cors(json({ status: "error", message: "Forbidden" }, 403));
        } else if (env.ALLOW_UNSIGNED !== "1") {
          return cors(json({ status: "error", message: "Forbidden" }, 403));
        }
        return cors(await handleLookup(request, env, ctx));
      }

      if ((path === "/" || path === "/status") && request.method === "GET") {
        const hasSig = url.searchParams.has("signature") || url.searchParams.has("hmac");
        if (hasSig) {
          const gate = await verifyShopifyProxy(url, env);
          if (!gate.ok) return cors(json({ status: "error", message: "Forbidden" }, 403));
        }
        const token = url.searchParams.get("t") || "";
        if (!token) return cors(json({ status: "idle" }));
        return cors(await handleToken(token, env));
      }

      return cors(json({ status: "error", message: "Not found" }, 404));
    } catch (err) {
      console.error(err);
      return cors(json({ status: "error", message: "Something went wrong." }, 500));
    }
  },
};

function normalizePath(pathname) {
  let p = String(pathname || "/").replace(/\/+$/, "") || "/";
  p = p.replace(/^\/apps\/order/, "") || "/";
  p = p.replace(/^\/order-status/, "") || "/";
  return p || "/";
}

function cors(res) {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Notify-Secret");
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function verifyShopifyProxy(url, env) {
  const secret = env.SHOPIFY_API_SECRET;
  if (!secret) return { ok: false };
  const params = {};
  url.searchParams.forEach((v, k) => {
    params[k] = v;
  });
  const signature = params.signature;
  const hmac = params.hmac;
  if (!signature && !hmac) {
    // Direct worker calls (local preview / post-Shopify) use NOTIFY_SECRET as Bearer
    return { ok: false };
  }
  if (signature) {
    const message = Object.keys(params)
      .filter((k) => k !== "signature")
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("");
    const digest = await hmacHex(secret, message);
    if (timingSafeEqual(digest, String(signature))) return { ok: true };
  }
  if (hmac) {
    const message = Object.keys(params)
      .filter((k) => k !== "hmac" && k !== "signature")
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&");
    const digest = await hmacHex(secret, message);
    if (timingSafeEqual(digest, String(hmac))) return { ok: true };
  }
  return { ok: false };
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const enc = new TextEncoder();
  const aa = enc.encode(a);
  const bb = enc.encode(b);
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa[i] ^ bb[i];
  return out === 0;
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacB64url(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64url(new Uint8Array(sig));
}

function b64url(bytes) {
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlFromString(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlToString(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return atob(b64);
}

function tokenSecret(env) {
  return env.TOKEN_SECRET || env.SHOPIFY_API_SECRET;
}

export async function mintToken(env, orderGid, email) {
  const days = parseInt(env.TOKEN_TTL_DAYS || "90", 10) || 90;
  const exp = Math.floor(Date.now() / 1000) + days * 86400;
  const payload = b64urlFromString(JSON.stringify({ o: orderGid, e: String(email).toLowerCase(), x: exp }));
  const sig = await hmacB64url(tokenSecret(env), payload);
  return `${payload}.${sig}`;
}

export async function readToken(env, token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return { ok: false, reason: "expired" };
  const [payload, sig] = parts;
  const expected = await hmacB64url(tokenSecret(env), payload);
  if (!timingSafeEqual(sig, expected)) return { ok: false, reason: "expired" };
  let data;
  try {
    data = JSON.parse(b64urlToString(payload));
  } catch (e) {
    return { ok: false, reason: "expired" };
  }
  if (!data || !data.o || !data.e || !data.x) return { ok: false, reason: "expired" };
  if (Number(data.x) < Math.floor(Date.now() / 1000)) return { ok: false, reason: "expired" };
  return { ok: true, orderGid: data.o, email: data.e };
}

async function handleToken(token, env) {
  const parsed = await readToken(env, token);
  if (!parsed.ok) return json({ status: "expired", message: EXPIRED_MSG });
  const order = await fetchOrderById(env, parsed.orderGid);
  if (!order || String(order.email || "").toLowerCase() !== parsed.email) {
    return json({ status: "sent", message: GENERIC_SENT });
  }
  return json(presentOrder(order));
}

async function handleLookup(request, env, ctx) {
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    body = {};
  }
  const email = String(body.email || "").trim().toLowerCase();
  const number = String(body.order || body.number || "").replace(/^#/, "").trim();

  if (!email || !number || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ status: "sent", message: GENERIC_SENT });
  }

  const limited = await rateLimited(env, email, ip);
  if (limited) return json({ status: "sent", message: GENERIC_SENT });

  const order = await fetchOrderByNumberEmail(env, number, email);
  if (order) {
    const token = await mintToken(env, order.id, email);
    const page = (env.STATUS_PAGE_URL || "").replace(/\/+$/, "");
    const link = `${page}?t=${encodeURIComponent(token)}`;
    ctx.waitUntil(sendEmail(env, email, linkEmail(order, link)));
  }
  return json({ status: "sent", message: GENERIC_SENT });
}

async function handleNotify(request, env) {
  const secret = env.NOTIFY_SECRET;
  const given =
    request.headers.get("X-Notify-Secret") ||
    (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!secret || !timingSafeEqual(String(given), String(secret))) {
    return json({ status: "error", message: "Forbidden" }, 403);
  }
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return json({ status: "error", message: "Bad JSON" }, 400);
  }
  const order = await fetchOrderById(env, body.order_id || body.id);
  if (!order || !order.email) return json({ status: "error", message: "No order" }, 404);
  const token = await mintToken(env, order.id, order.email);
  const page = (env.STATUS_PAGE_URL || "").replace(/\/+$/, "");
  const link = `${page}?t=${encodeURIComponent(token)}`;
  const type = body.type || "stage";
  const mail = type === "link" ? linkEmail(order, link) : stageEmail(order, link, presentOrder(order));
  const sent = await sendEmail(env, order.email, mail);
  return json({ status: sent ? "sent" : "queued", message: GENERIC_SENT });
}

async function rateLimited(env, email, ip) {
  const hour = Math.floor(Date.now() / 3600000);
  const emailKey = `rl:e:${email}:${hour}`;
  const ipKey = `rl:i:${ip}:${hour}`;
  const eCount = await bump(env, emailKey);
  const iCount = await bump(env, ipKey);
  return eCount > 5 || iCount > 20;
}

async function bump(env, key) {
  try {
    const cache = caches.default;
    const url = new URL("https://rate.limit/" + encodeURIComponent(key));
    const hit = await cache.match(url);
    let n = 1;
    if (hit) n = parseInt(await hit.text(), 10) + 1;
    await cache.put(
      url,
      new Response(String(n), { headers: { "Cache-Control": "max-age=3600" } })
    );
    return n;
  } catch (e) {
    return 1;
  }
}

async function shopifyGql(env, query, variables) {
  const shop = env.SHOPIFY_SHOP;
  const token = env.SHOPIFY_ADMIN_TOKEN;
  if (!shop || !token) return null;
  const res = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) return null;
  return res.json();
}

const ORDER_FIELDS = `
  id
  name
  email
  cancelledAt
  processedAt
  displayFinancialStatus
  displayFulfillmentStatus
  shippingAddress { countryCodeV2 }
  customAttributes { key value }
  metafields(first: 25, namespace: "custom") {
    edges { node { key value type reference { ... on MediaImage { image { url } } } } }
  }
  refunds(first: 5) { createdAt }
`;

async function fetchOrderById(env, gid) {
  if (!gid) return null;
  const data = await shopifyGql(
    env,
    `query ($id: ID!) { order(id: $id) { ${ORDER_FIELDS} } }`,
    { id: gid }
  );
  return data && data.data && data.data.order;
}

async function fetchOrderByNumberEmail(env, number, email) {
  const q = `name:#${number} email:${email}`;
  const data = await shopifyGql(
    env,
    `query ($q: String!) { orders(first: 1, query: $q) { edges { node { ${ORDER_FIELDS} } } } }`,
    { q }
  );
  const node =
    data &&
    data.data &&
    data.data.orders &&
    data.data.orders.edges &&
    data.data.orders.edges[0] &&
    data.data.orders.edges[0].node;
  if (!node) return null;
  if (String(node.email || "").toLowerCase() !== email) return null;
  return node;
}

function mf(order, key) {
  const edges = (order.metafields && order.metafields.edges) || [];
  const hit = edges.find((e) => e.node && e.node.key === key);
  return hit ? hit.node : null;
}

function mfText(order, key) {
  const node = mf(order, key);
  return node && node.value ? String(node.value) : "";
}

function attr(order, key) {
  const list = order.customAttributes || [];
  const hit = list.find((a) => a && a.key === key);
  return hit && hit.value ? String(hit.value) : "";
}

function mfTextOrAttr(order, key) {
  return mfText(order, key) || attr(order, key);
}

function presentOrder(order) {
  const financial = String(order.displayFinancialStatus || "").toUpperCase();
  const fulfillment = String(order.displayFulfillmentStatus || "").toUpperCase();
  const cancelledAt = order.cancelledAt || null;
  const refundedAt =
    financial === "REFUNDED" || financial === "PARTIALLY_REFUNDED"
      ? (order.refunds && order.refunds[0] && order.refunds[0].createdAt) || order.processedAt
      : null;

  if (cancelledAt) {
    return {
      status: "cancelled",
      message: `This order was cancelled on ${formatDate(cancelledAt)}. If that is wrong, contact us.`,
      order: publicOrder(order, { exception: "cancelled", cancelled_at: cancelledAt }),
    };
  }
  if (financial === "REFUNDED") {
    return {
      status: "refunded",
      message: `Refunded on ${formatDate(refundedAt)}.`,
      order: publicOrder(order, { exception: "refunded", refunded_at: refundedAt }),
    };
  }

  let stage = parseInt(mfText(order, "order_stage"), 10) || 0;
  if (financial === "PAID" || financial === "PARTIALLY_REFUNDED") stage = Math.max(stage, 1);
  if (fulfillment === "FULFILLED") stage = 8;
  if (stage < 1) stage = 1;
  if (stage > 8) stage = 8;

  const delayNotice = mfText(order, "delay_notice");
  const revised = mfText(order, "revised_window");
  const delayed = !!(delayNotice || revised);
  const country = (order.shippingAddress && order.shippingAddress.countryCodeV2) || "";
  const arrivedName = country === "AE" ? "Arrived in the UAE" : "Arrived in the UK";

  const names = STAGES.map((s) =>
    s.n === 5 ? { ...s, name: arrivedName } : s
  );
  const visible = names.filter((s) => s.n <= stage).map((s) => ({
    n: s.n,
    name: s.name,
    current: s.n === stage,
  }));

  const updated = mfText(order, "stage_updated_at") || order.processedAt;
  const photoNode = mf(order, "batch_photo");
  const photo =
    (photoNode &&
      photoNode.reference &&
      photoNode.reference.image &&
      photoNode.reference.image.url) ||
    null;

  return {
    status: delayed ? "delayed" : "ok",
    message: delayed ? delayNotice : "",
    order: publicOrder(order, {
      stage,
      stage_name: names[stage - 1].name,
      stages: visible,
      stage_updated_at: updated,
      delay_notice: delayNotice || null,
      revised_window: revised || null,
      batch_photo_url: photo,
      next: nextCopy(stage, names[stage - 1].name, mfText(order, "delivery_date")),
    }),
  };
}

function publicOrder(order, extra) {
  const date = mfText(order, "delivery_date");
  const stage = extra.stage || 0;
  return {
    reference: String(order.name || "").replace(/^#/, ""),
    size_label: mfTextOrAttr(order, "size_label") || null,
    size_dims: mfTextOrAttr(order, "size_dims") || null,
    delivery_window: mfTextOrAttr(order, "delivery_window") || null,
    delivery_date: stage >= 7 ? date || null : null,
    updated_by_hand: true,
    ...extra,
  };
}

function nextCopy(stage, name, date) {
  if (stage === 7 && date) return `Delivery is booked for ${formatDate(date)}.`;
  const map = {
    1: "Your order is confirmed. We will email when production starts.",
    2: "The factory has your order. We update this by hand when the next stage is done.",
    3: "Quality check is done. Next is packing and dispatch.",
    4: "It is on its way. We will email when it arrives.",
    5: "It has arrived locally. We will email when delivery is being arranged.",
    6: "We are arranging delivery. We will email when a date is booked.",
    7: "Delivery is booked. We will email if that date changes.",
    8: "Delivered.",
  };
  return map[stage] || name;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function linkEmail(order, link) {
  const ref = String(order.name || "").replace(/^#/, "");
  return {
    subject: `Your order ${ref} — view status`,
    text:
      `Here is the link to your mattress order ${ref}.\n\n${link}\n\n` +
      `This page is updated by hand as your mattress moves through production. It is not live tracking.\n` +
      `The link works for 90 days. If it expires, enter your order number and email on the same page and we will send a new one.`,
  };
}

function stageEmail(order, link, presented) {
  const ref = String(order.name || "").replace(/^#/, "");
  const name = (presented.order && presented.order.stage_name) || "updated";
  return {
    subject: `Order ${ref} — ${name}`,
    text:
      `An update on your mattress (order ${ref}): ${name}.\n\n` +
      `${(presented.order && presented.order.next) || ""}\n\n` +
      `View status (updated by hand, not live tracking):\n${link}\n`,
  };
}

async function sendEmail(env, to, mail) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.log("email_skipped", to, mail.subject);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject: mail.subject,
      text: mail.text,
    }),
  });
  return res.ok;
}
