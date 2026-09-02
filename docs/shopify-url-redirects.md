# URL redirects (Numa Mattress admin)

Shopify 301s live in Admin, not in the theme. Liquid cannot create them.

Store: **7dbr1b-1q** (Numa Mattress).

Official help: [Creating and managing URL redirects](https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect).

## Where the screen is now (2026 admin)

Navigation is no longer under **Online Store**. URL redirects sit with menus:

1. Left sidebar → **Content** → **Menus**
2. **View URL redirects** (or **URL redirects**) on that page
3. **Create URL redirect**, or **Import** the CSV in this folder

### Paste these URLs for this store

Try them in order. The first two are the current paths; the third is the older bookmark that still often works.

- https://admin.shopify.com/store/7dbr1b-1q/content/menus
- https://admin.shopify.com/store/7dbr1b-1q/redirects
- https://admin.shopify.com/store/7dbr1b-1q/menus

If a URL loads and then says you do not have permission, that is a staff-role issue (below), not a missing feature.

### Search in Admin

Top search bar (or press `/`):

- `URL redirects`
- `redirects`
- `menus`

Do not look under **Online Store → Pages**. That list is pages only.

## Why Online Store only shows Pages and Preferences

Shopify split the old Online Store list:

| Used to be under Online Store | Where it is now | Permission that shows it |
|---|---|---|
| Navigation (and URL redirects) | **Content → Menus** | **Content → Menus** |
| Blog posts | **Content → Blog posts** | **Online store → Blog posts and pages** |
| Themes | **Online Store → Themes** | **Online store → Themes** |
| Pages | **Online Store → Pages** | **Online store → Blog posts and pages** |
| Preferences | **Online Store → Preferences** | **Store settings → Manage settings** |

Seeing **Pages** and **Preferences** and not **Themes** / **Navigation** is expected for a staff or collaborator account that has pages access but not Themes, and that is using the new admin where Navigation has moved.

The store owner (or someone with Users access) can fix a missing **Content → Menus** item:

1. **Settings → Users and permissions** (or **Settings → Users**)
2. Open the staff / collaborator role
3. Enable **Content → Menus**
4. To restore Themes: enable **Online store → Themes**
5. Save, then the staff user should refresh Admin

If **Content** is greyed out or missing, paste https://admin.shopify.com/store/7dbr1b-1q/content/menus anyway. Some roles can open the page by URL even when the sidebar item is hidden. If that still fails, the store owner has to grant **Menus**.

Password protection on the storefront does not hide Admin redirects. It only means testers must enter the storefront password after the 301.

## Import the CSV

File: `docs/shopify-url-redirects.csv`

Shopify headers (exact): `Redirect from`, `Redirect to`. Paths only, leading `/`, no domain.

1. Create the **Journal** page first (next section). `/journal` in the CSV points at `/pages/journal`.
2. Open URL redirects → **Import** → upload the CSV → **Import redirects**.
3. Shopify only fires a redirect when the **from** URL is a 404. These from-paths (`/about`, `/configure`, `/basket`, …) are not Shopify page URLs, so they should 404 until the redirect exists.
4. Do not import a **from** path that is already a live page (for example `/pages/checkout`). Checkout is not in this CSV and must stay untouched.

If a row is skipped, that from-path already has a redirect. Edit or delete the old one, then re-import.

## Map to the pages already in Admin

Open each page → bottom **Search engine listing** → the handle is the last part of `/pages/…`. Titles in the screenshot can differ from handles.

The theme looks up these handles. Prefer renaming the handle to match (Shopify can create an automatic redirect from the old handle). If you keep a different handle, change that row’s **Redirect to** in the CSV before import.

| Redirect from | Redirect to (theme handle) | Screenshot page | Notes |
|---|---|---|---|
| `/mattresses/large-sizes` | `/pages/large-sizes` | Emperor and Super King | Confirm handle is `large-sizes`, not `emperor-and-super-king`. Template: **large-sizes**. |
| `/mattresses/european-king` | `/pages/european-king` | European King | Likely already `european-king`. |
| `/mattresses/specification` | `/pages/specification` | Specification | Likely already `specification`. |
| `/what-it-buys` | `/pages/what-it-buys` | What It Buys | Likely already `what-it-buys`. |
| `/mattress-recycling` | `/pages/mattress-recycling` | Mattress Recycling | Likely already `mattress-recycling`. |
| `/about` | `/pages/about` | About | Likely already `about`. |
| `/manufacturing` | `/pages/manufacturing` | How it is made | Confirm handle is `manufacturing`, not `how-it-is-made`. Template: **manufacturing**. |
| `/configure` | `/pages/configure` | Choose your size | Confirm handle is `configure`, not `choose-your-size`. Template: **configure**. |
| `/journal` | `/pages/journal` | **Missing** | Create the page first. |
| `/mattresses/support` | `/pages/support` | Support | Template: **support**. Create the page if missing. |
| `/mattresses/cooling` | `/pages/cooling` | Cooling | Template: **cooling**. Create the page if missing. |
| `/mattresses/split-king` | `/pages/split-king` | Split King | Template: **split-king**. Create the page if missing. |
| `/support` | `/pages/support` | Support | Short path for ads. |
| `/cooling` | `/pages/cooling` | Cooling | Short path for ads. |
| `/split-king` | `/pages/split-king` | Split King | Short path for ads. |
| `/basket` | `/cart` | (Shopify cart) | No page needed. `/cart` cannot be a **from** path; it is a valid **to** path. |

Pages in Admin that are **not** in this redirect list (leave them): Contact, Cookies, Privacy, Terms, Cancellations and refunds, Warranty, Size Guide, Delivery, Checkout, Order Confirmed, Order Status, Sleep on it for a year (hidden).

**Checkout:** do not add a redirect involving `/pages/checkout` or `/checkout`. Do not edit checkout in the theme.

## Journal still needs to be created as a Page

It is not in the Pages list. The six notes are already baked in the theme. Without this page, `/pages/journal` 404s and the `/journal` redirect has nowhere useful to land.

1. **Online Store → Pages → Add page**
2. Title: **Journal**
3. Theme template: **journal**
4. Handle: **journal** (URL `/pages/journal`)
5. Save and set visibility to visible

Then import the CSV (or add `/journal` → `/pages/journal` by hand).

Optional later: **Content → Blog posts** if you want a Shopify blog with handle `journal`. The header uses that blog only when it has published articles; otherwise it uses the Page.

Do not deploy from this change. Redirects are Admin-only.
