# House of Clarence — Project status & handoff

**Last updated:** 2026-06-11
**Read me first** if you're a new Claude instance picking this up. For the *why*
behind the design see [`prd.md`](../prd.md); for the scannable build rules see
[`CLAUDE.md`](../CLAUDE.md); for Shopify/Git mechanics see
[`docs/theme-and-version-control.md`](./theme-and-version-control.md); for
organising the catalogue see [`docs/collections-setup.md`](./collections-setup.md);
for a running log of changes since the initial build see
[`docs/CHANGELOG.md`](./CHANGELOG.md).

---

## 1. One-paragraph summary

We are building the **House of Clarence** storefront as a **custom, Dawn-based
Shopify (Online Store 2.0) theme** in `house-of-clarence/`. We re-skinned Dawn:
kept its plumbing (cart, checkout, search), replaced the entire look with a
House of Clarence design layer. **All 8 build phases are complete** (foundation →
components → home → collection → product → bag/search → about/contact → polish).
The store has ~97 real bathroom products (test catalogue). The work is **built
and previewable, but NOT committed to Git, NOT pushed, and NOT live.**

---

## 2. Current state at a glance

- ✅ Homepage, Collection page, Product page, Bag drawer, Predictive search,
  About + Contact pages, editable palette, scroll-reveal motion — all built and
  rendering with **no Liquid errors**.
- ✅ Theme-check clean for all our files (the only 2 lint *errors* are
  pre-existing in Dawn's own `featured-product` / `main-*` files — not ours).
- ⏳ Not committed / not pushed / not live. Live theme is still **Feather**.
- 🧩 Deferred to "phase 2": mega-menu, Ideabook (wishlist) save logic, Journal/
  blog, dedicated Trade page/pricing.

---

## 3. Critical facts & gotchas (read before editing CSS or testing)

1. **Dawn uses a 10px rem base** (`html { font-size: 62.5% }`). All our tokens in
   `hoc-base.css` are written for that base (e.g. `--t-body: 1.6rem` = 16px,
   `--s-2: 1.6rem` = 16px). **Do not assume 1rem = 16px.** This was the cause of
   an early "everything looks tiny" bug — now fixed.
2. **Palette is the "cream/Stitch" direction, not the PRD's stone.** Canvas
   `#fcf9f2`, ink `#1c1c18`, **near-black footer `#1c1c1a`** (the mock-up uses
   near-black, not the PRD's sage — this was a deliberate client choice). Sage is
   still available for drama sections. All colours are now **editable in the
   theme editor** (Theme settings → "House of Clarence").
3. **Products have no prices yet** → the price snippet shows **"Price on
   application"** when price is 0/blank. Real prices show automatically once set
   in admin.
4. **No product metafields** → the **Specimen Label** (`WHITE OAK · FLUTED`) is
   derived from product **tags** (skipping `HOC Catalogue` / `Code:` tags), then
   product type. `snippets/hoc-specimen-meta.liquid` owns this logic; the PDP
   spec sheet (`hoc-specimen-block.liquid`) prefers `custom.*` metafields when
   present.
5. **Example/sample products are hidden in code** (handles containing
   `example-product` / `asset-pack`) in the collection grid, featured row, and
   "pairs well". The permanent fix is deleting them in admin (8 of them).
6. **No Playwright MCP** is connected to the CLI session. Verify rendered output
   with `curl` against the dev server. **The dev server rate-limits rapid
   curls (429)** — space them out; don't loop many pages quickly.
7. **Headless-Chrome screenshots of the dev server hang** (live-reload socket) —
   rely on the user for visual screenshots at review points.

---

## 4. File inventory (everything we added/changed lives under `house-of-clarence/`)

**Assets (CSS/JS)**
- `assets/hoc-base.css` — design tokens (`:root`), base resets, scroll-reveal +
  reduced-motion rules. Loaded after Dawn's `base.css` so it wins; also re-maps
  Dawn's `--color-*` / font vars to the HoC palette.
- `assets/hoc-type.css` — type roles (display serif / body grotesque / mono
  specimen), `.hoc-eyebrow`, `.hoc-specimen`, `.hoc-link`.
- `assets/hoc-components.css` — buttons, header, mobile drawer, footer, trust
  strip, **bag drawer**, **search drawer**, **form fields**.
- `assets/hoc-shop.css` — product card, hero, "Shop by room" scroller, editorial
  split, CTA band, collection page, product page, page header, contact.
- `assets/hoc-header.js` — sticky shading + mobile menu drawer (focus trap).
- `assets/hoc-room-scroll.js` — "Shop by room" pinned horizontal scroll (desktop,
  gated on `.hoc-anim`; lead-in/out holds, scroll/hover dim+title reveal). See
  `docs/CHANGELOG.md` for the full evolution.
- `assets/hoc-collection.js` — auto-submit sort/filter.
- `assets/hoc-product.js` — gallery thumbnails + variant picker (live price).
- `assets/hoc-cart.js` — AJAX add-to-bag + drawer (Section Rendering API).
- `assets/hoc-search.js` — predictive search drawer.
- `assets/hoc-reveal.js` — scroll-reveal (gated on `.hoc-anim`, fail-safe reveal).
- `assets/hoc-hero-kitchen.jpg` — an earlier hero photo (2560×1920), kept as a
  spare; superseded by the client render below.
- **Placeholder photography** (see `docs/image-credits.md` for sources/licences):
  `hoc-hero-kitchen-island.jpg` (2560×1920, the client's own kitchen render —
  the active hero via `default_image_filename` in `index.json`),
  `hoc-tile-{bathroom,kitchen,living,lighting}.jpg` (1200×1200 room tiles;
  kitchen is a 1:1 detail crop of the hero render, the rest are
  Unsplash/Pexels), `hoc-editorial-stone.jpg` + `hoc-editorial-oak.jpg`
  (1600×1200 editorial splits, home/About), `hoc-pageheader-about.jpg`
  (2000×1125 About header). All are wired through a `default_image_filename`
  text setting (the hero's existing fallback pattern, now also added to
  `collection-tiles`, `editorial-split` and `page-header`) — a theme-editor
  image, once picked, always wins. Bundled `/assets` images can't use Shopify's
  responsive `image_url` resizing — for production, upload final photos via the
  theme editor (image picker) so they get a responsive `srcset`.

**Snippets**
- `hoc-icon.liquid` (thin-line SVG set), `hoc-price.liquid` (£/ex-VAT/POA),
  `hoc-product-card.liquid` (layouts: featured/collection/pairs),
  `hoc-specimen-meta.liquid`, `hoc-specimen-block.liquid`.

**Sections**
- Header/footer: `hoc-header.liquid`, `hoc-footer.liquid`.
- Home: `hero-banner`, `trust-strip`, `collection-tiles`, `featured-products`,
  `editorial-split`, `cta-band`.
- Templates' main sections: `main-collection.liquid`, `main-product.liquid`.
- Drawers (rendered in `theme.liquid`): `hoc-cart-drawer.liquid`,
  `hoc-search-drawer.liquid`.
- Content: `page-header.liquid`, `hoc-rich-text.liquid`, `hoc-contact-form.liquid`.

**Templates (JSON)**
- `index.json`, `collection.json`, `product.json` (rebuilt to use our sections),
  `page.about.json`, `page.contact.json`.

**Layout / config**
- `layout/theme.liquid` — loads Google fonts + HoC CSS/JS, outputs the editable
  palette as `:root`, renders the bag + search drawers, enables scroll-reveal.
- `config/settings_schema.json` — added a "House of Clarence" colour-settings group.
- `sections/header-group.json`, `footer-group.json` — point at `hoc-header` /
  `hoc-footer` (announcement bar removed — no sale theatrics).

**Docs:** `docs/collections-setup.md`, `docs/theme-and-version-control.md`,
`docs/CHANGELOG.md` (running updates log), this file.

---

## 5. Conventions

- All custom files are prefixed `hoc-` (and new sections use HoC-specific names)
  so Dawn originals are never clobbered; Dawn files we deliberately replaced are
  `main-collection.liquid` and `main-product.liquid`.
- British English, sentence case, mono eyebrows. **Never** "sale/discount/cheap",
  no urgency, no countdowns (PRD "never cheap, never loud").
- Money: `£1,397` (no `.00`), optional `· £1,164 ex. VAT` mono caption.
- Verify changes with `shopify theme check` + a single `curl` to the dev server.

---

## 6. Shopify / Git state (see theme-and-version-control.md for full detail)

- **Repo:** `git@github.com-tmdb:TMDB-GIT/HOC.git`, branch `main`. One commit:
  "Initial Dawn base". **Our entire build is uncommitted in the working tree.**
- **Store themes:** `Feather [live]`, `Radiant [unpublished]`,
  `Development (…Mac) [development]` (the temporary `shopify theme dev` preview of
  our build).
- **Source of truth:** Shopify renders the live site from the *published theme in
  its DB* (Feather). GitHub is a two-way mirror for *one* connected theme — our
  build isn't connected/published yet.
- **Safe next step when ready:** commit our work to a branch → push → create a new
  *unpublished* HoC theme (CLI `theme push --unpublished` or connect repo) →
  review → publish (Feather becomes the backup). Store data (products/prices/
  collections) always stays in admin, never in Git.

---

## 7. How to preview

```sh
cd house-of-clarence
shopify theme dev          # opens a local preview (e.g. http://127.0.0.1:9292)
```
Test routes: `/`, `/collections/all`, `/products/hoc-fk502` (size variants),
`/pages/contact`. For About, create a page in admin and set its template to
`page.about`.

---

## 8. Open items / next steps

- **Imagery (user):** the hero + kitchen tile are the client's own render; the
  other 6 slots are licensed stock placeholders (`docs/image-credits.md`).
  Swap in real client/product photography as it arrives, ideally via the theme
  editor's image pickers so Shopify serves responsive sizes.
- **Admin (user):** delete the 8 example products; set prices on test products;
  create collections + wire nav/tiles (see `collections-setup.md`); create the
  About page and assign `page.about`.
- **Possible future work:** mobile 375px QA pass; mega-menu; Ideabook save logic;
  Journal/blog; Trade page; product metafields for richer specimen data; commit +
  publish workflow.
- **Logo:** still the serif wordmark; drop an SVG into `assets/` and wire it into
  `hoc-header`/`hoc-footer` when available, and tune ink/sage to match it.

---

*Theme code: `house-of-clarence/`. Store data: Shopify admin. Live site: whichever
theme is Published in Shopify (currently Feather).*
