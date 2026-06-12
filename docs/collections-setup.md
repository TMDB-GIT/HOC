# House of Clarence — Setting up collections & wiring them to the site

A plain-English guide for when you move past the proof-of-concept and start
organising the full catalogue. No coding required — everything here is done in
the **Shopify admin** (`admin.shopify.com`) and the **theme editor**.

> **The short version:** A *collection* is a named group of products (e.g.
> "Bathroom" or "Vanity Units"). You create collections in Shopify admin, then
> point parts of the website at them (the homepage tiles, the menus, the
> featured row). The collection page design is already built — once a collection
> exists, visiting it just works and looks right.

---

## 0. First: delete the sample "example" products

Your store currently contains **8 placeholder products** that came with the
theme (their names are "Example product"). The website already hides them, but
you should delete them so they don't clutter your admin or your counts.

1. Admin → **Products**.
2. In the search box type **`Example`** (or sort by name).
3. Tick the checkbox on each "Example product" row (or the top checkbox to
   select all on the page).
4. Click **More actions → Delete products** → confirm.

That's it — they're gone for good, and your product count becomes a clean 97.

---

## 1. How to think about collections for House of Clarence

You have two natural ways to group products. **You can use both at once** — a
product can live in many collections.

| Grouping | Examples | Used for |
|---|---|---|
| **By room** | Bathroom, Kitchen, Living, Bedroom, Lighting | The homepage "Shop by room" tiles and the main menu |
| **By type** | Vanity Units, Mirrors, Basins, Bathtubs | Deeper browsing / filtering within a room |

Right now your catalogue is **all bathroom** (82 vanity units, 49 mirrors, 15
basins, 13 bathtubs), so a sensible starting point is:

- One **room** collection: **Bathroom**
- Four **type** collections: **Vanity Units**, **Mirrors**, **Basins**, **Bathtubs**

When you add kitchen products later, you'd add a **Kitchen** room collection and
its types (e.g. Cabinetry, Worktops, Sinks, Taps), and so on.

---

## 2. Two ways to build a collection

### Method A — Manual (you pick the products by hand)
Best when you want full control over exactly what's in a collection (e.g. a
curated "Featured" set for the homepage).

1. Admin → **Products → Collections → Create collection**.
2. **Title**: e.g. `Bathroom`.
3. **Collection type**: choose **Manual**.
4. Save, then click **Add products** and tick the ones you want.

### Method B — Automated / "smart" (Shopify fills it for you) — recommended
Best for type/room collections, because Shopify keeps them up to date
automatically as you add products. Your products already have a **Type** and
**Tags**, which makes this effortless.

1. Admin → **Products → Collections → Create collection**.
2. **Title**: e.g. `Vanity Units`.
3. **Collection type**: choose **Automated**.
4. Set the condition. Two reliable options:
   - **Product type** `is equal to` `Vanity Unit` ← uses the Type already on
     your products. Perfect for the four type collections.
   - or **Product tag** `is equal to` `White Oak` ← uses your tags, handy for
     material-based groupings.
5. Choose **"Products must match: all conditions"** (or "any" if you want a
   broader net), then **Save**.

> **Tip for the Bathroom room collection:** since *everything* is bathroom right
> now, you can make an automated collection with the condition
> **Product type** `is equal to` `Vanity Unit` **OR** ... — or simply make it
> manual and add all, or (easiest) use the condition **Tag** `is equal to`
> `HOC Catalogue 165` which every product carries.

---

## 3. Make the collection look good (image + description)

The collection page has an **editorial header** that shows the collection's
**title**, **description**, and a **banner image**. Fill these in for a premium
feel:

- On the collection's admin page, scroll to:
  - **Description** — one or two calm sentences (this appears under the title).
    e.g. *"A curated collection of elemental forms — solid oak, honed marble and
    unlacquered brass, made to age gracefully with the architecture."*
  - **Image** (right-hand side, "Collection image") — upload a calm, full-bleed
    lifestyle shot. This becomes the wide banner.
- **Sort order** (under "Products" on the collection page): set to **Manually**
  if you want to curate the order. The site labels this **"Curated"** — it's the
  default we lead with (never "price, low to high").

---

## 4. Wiring collections into the website

Once collections exist, connect them in **three** places. All are
point-and-click — no code.

### 4a. The homepage "Shop by room" tiles
1. From the dev preview (or your live store), open the **theme editor**:
   Admin → **Online Store → Themes → Customize**.
2. On the **Home page**, click the **"Collection tiles"** section.
3. Each tile is a block. Click a tile and:
   - **Collection**: choose e.g. `Bathroom`.
   - **Image override** (optional): pick a specific image, otherwise it uses the
     collection's image.
   - **Label override** (optional): otherwise it shows the collection title.
4. Add or remove tiles with **"Add block"** / the bin icon. **Save**.

### 4b. The homepage "Featured curations" row
1. In the theme editor, click the **"Featured products"** section.
2. Set **Collection** to the one you want to showcase (e.g. a manual "Featured"
   collection, or "Bathroom").
3. Choose how many products to show. **Save.**

### 4c. The navigation menus (header + footer)
This powers the links across the top of the site and in the footer.
1. Admin → **Online Store → Navigation**.
2. Click **`main-menu`** (this is the header's room nav).
3. **Add menu item** → Name it `Bathroom` → in the link box, search and select
   your **Bathroom** collection. Repeat for Kitchen, etc.
4. **Save.** The header updates automatically.
5. (Optional) Do the same for the **`footer`** menu to control the footer
   columns. In the theme editor, the footer's columns each point at a menu —
   you can choose which menu each column uses.

### 4d. The collection page itself
Nothing to do — it's already built. Visiting `…/collections/bathroom` shows the
editorial header, the specimen product grid, sort, and (once set up) filters.

---

## 5. Prices

Your imported products currently have **no price**, so the site shows
**"Price on application"**. To show a real price:

1. Admin → **Products** → open a product.
2. Under **Pricing**, set the **Price** (e.g. `1397`). For size variants, set a
   price on each variant under **Variants**.
3. **Save.** The product page now shows `£1,397 · £1,164 ex. VAT`.

(There's nothing to change in the theme — pricing is pulled live from Shopify.)

---

## 6. Filters on the collection page (optional, recommended later)

The left-hand **filter rail** (Type, Material, Finish, Price…) is powered by
Shopify's free **Search & Discovery** app.

1. Admin → **Apps** → search **"Search & Discovery"** (by Shopify) → install.
2. Open it → **Filters** → add filters based on **Product type**, **Tags**,
   **Price**, or **metafields** (see §7).
3. Save. The collection page rail populates automatically. If no filters are
   configured, the rail simply hides and the grid runs full width.

---

## 7. Richer specimen labels (optional, future)

The "Specimen Label" (e.g. `WHITE OAK · FLUTED`) currently reads from your
**tags**. For maximum precision you can add **metafields** to each product:

1. Admin → **Settings → Custom data → Products → Add definition**.
2. Create these (namespace **`custom`**), all "Single line text":
   `material`, `finish`, `origin`, `dimensions`, `weight`, `lead_time`,
   `care`, `guarantee`.
3. Fill them in on each product (or via a CSV/bulk editor).

The product card and the product page's **Specimen block** will automatically
prefer these when present, falling back to tags/type when they're empty. No code
changes needed.

---

## 8. Quick reference — which website element is edited where

| Website element | Where you change it |
|---|---|
| Header room links | Admin → Online Store → Navigation → `main-menu` |
| Footer columns | Theme editor → Footer section (each column points at a menu) |
| Homepage "Shop by room" tiles | Theme editor → Home → Collection tiles |
| Homepage "Featured curations" | Theme editor → Home → Featured products |
| Collection page banner/intro | Admin → Products → Collections → (the collection) → Image + Description |
| Collection product order | The collection's **Sort** setting (use "Manually" = "Curated") |
| Prices | Admin → Products → (product) → Pricing |
| Filters (left rail) | Search & Discovery app |
| Specimen label data | Product **tags**, or `custom.*` **metafields** |

---

*Built for House of Clarence. The theme code lives in `house-of-clarence/`;
everything above is configured in Shopify, not in code.*
