# CLAUDE.md — House of Clarence

Technical reference for the House of Clarence storefront. For full specs, voice, and rationale see **[prd.md](./prd.md)** — this file is the scannable build guide, not a replacement.

## Summary

Custom **Shopify Online Store 2.0 (Liquid) theme** for House of Clarence — a premium furnishings & finishes house (vanities, baths, brassware, kitchens, lighting, joinery). Built on **Dawn**, replacing its design layer wholesale.

Design direction: **Lusso's commercial structure carrying Yana Prydalna's editorial mood** — calm, tactile, material-first, genuinely shoppable. The non-negotiable rule: **never cheap, never loud.** Price is stated, never sold — no "SALE", countdowns, urgency, or discount theatrics anywhere in the theme. The signature device is the **Specimen Label** (§4.7 PRD), used *instead of* sale badges.

Theme lives in `house-of-clarence/`. Current state: **vanilla Dawn** — the HoC layer described below is to be built.

## CLI commands

Run from `house-of-clarence/`. Requires [Shopify CLI](https://shopify.dev/docs/themes/tools/cli).

```sh
shopify theme dev            # local dev server with hot reload
shopify theme check          # lint / theme-check (config: .theme-check.yml)
shopify theme push           # upload to a store (use --unpublished for review)
shopify theme pull           # pull live theme changes
shopify theme push -t <id>   # push to a specific theme
npx prettier --write .       # format (config: .prettierrc.json — @shopify/prettier-plugin-liquid)
```

## Architecture

Dawn / OS 2.0: **JSON templates compose sections; sections compose snippets.** Merchants rearrange sections in the theme editor — keep everything modular and editable via `{% schema %}`.

```
/layout/theme.liquid        ← global shell; outputs :root tokens from settings
/templates/*.json           ← page composition (index, collection, product, cart, search, page.*, blog, article)
/sections/*.liquid          ← editable blocks, each with a {% schema %}
/snippets/*.liquid          ← reusable partials (product-card, specimen-block, price, swatch, icon)
/config/settings_schema.json ← theme settings; mirror design tokens here as colour/font/range pickers
/config/settings_data.json   ← saved setting values
/assets/                    ← css, js, fonts, svg
/locales/*.json             ← translations (UI strings are en-GB — British English only)
```

Render flow: `theme.liquid` → template JSON → `{% section %}` → `{% render 'snippet' %}`.

### Sections to build (PRD §8)

`hero-banner` · `collection-tiles` · `featured-products` · `editorial-split` · `trust-strip` · `journal-teaser` · `cta-band`, plus customised `header` / `footer` / `main-collection` / `main-product` / `main-cart`.

### Metafields power the specimen system + filters (PRD §9)

`custom.material` · `custom.finish` · `custom.origin` · `custom.dimensions` · `custom.weight` · `custom.lead_time` · `custom.care` · `custom.room` · `custom.sample_available` (bool → "Request a sample"). Filters via Shopify **Search & Discovery** app keyed off these.

## File naming conventions

- **HoC CSS** lives in dedicated, purpose-named assets (do not bloat Dawn's `base.css`):
  - `hoc-base.css` — `:root` design tokens (colour, type, spacing, radii)
  - `hoc-type.css` — `@font-face` + preloads
  - `hoc-components.css` — component styles (§6)
- **HoC JS:** `hoc-<behaviour>.js` — small, dependency-light, vanilla, one behaviour per file.
- **Sections:** kebab-case matching purpose (`editorial-split.liquid`). `main-*` = primary template section.
- **Snippets:** kebab-case nouns (`product-card.liquid`, `specimen-block.liquid`).
- **Icons:** thin line SVGs, `icon-<name>.svg`; monochrome, ~1.25px stroke, no fills/duotone.
- **Images:** always meaningful `alt` describing material + piece, never "image1".

## Design tokens (CSS variables — emit in `theme.liquid` `:root`)

Mirror these in `settings_schema.json` so merchants can nudge the brand. Full rationale in PRD §4–§5.

```css
:root {
  /* Colour — anchors */
  --hoc-ink:        #20201D;  /* warm near-black — text, strong UI, footer */
  --hoc-canvas:     #EAE7E0;  /* warm stone — default page background */
  --hoc-paper:      #F6F4EF;  /* lighter surface — cards, PDP */
  /* Heritage secondary */
  --hoc-sage:       #3B4138;  /* deep sage — drama sections, footer */
  --hoc-sage-soft:  #5A6056;  /* sage hover/disabled */
  /* Metallic accent — USE SPARINGLY (jewellery, not paint) */
  --hoc-brass:      #9A7B4F;  /* hairline rules, hover, active detail */
  --hoc-brass-deep: #7C6240;  /* pressed/active */
  /* Neutrals / structure */
  --hoc-stone:      #B9B3A7;  /* dividers, muted captions (never body copy) */
  --hoc-stone-line: #D8D3C9;  /* hairline borders on canvas */
  /* Functional — in-key, never neon */
  --hoc-success:    #4F6B4A;
  --hoc-error:      #8C4A3F;

  /* Type scale — fluid, ~1.25 major third */
  --t-hero:   clamp(2.75rem, 5vw + 1rem, 5.5rem);
  --t-h1:     clamp(2rem, 3vw + 1rem, 3.25rem);
  --t-h2:     clamp(1.5rem, 2vw + 0.5rem, 2.25rem);
  --t-h3:     1.375rem;
  --t-body-l: 1.125rem;
  --t-body:   1rem;
  --t-small:  0.875rem;
  --t-mono:   0.75rem;   /* eyebrows/specs — UPPERCASE, +0.08em tracking */

  /* Spacing (8px base) */
  --s-1:.5rem; --s-2:1rem; --s-3:1.5rem; --s-4:2rem;
  --s-5:3rem;  --s-6:4rem; --s-7:6rem;   --s-8:8rem;  --s-9:12rem;

  /* Layout */
  --container:1440px; --container-text:720px; --gutter:clamp(1rem,4vw,4rem);
  --radius:3px;  /* near-square corners — architectural, not rounded */
}
```

**Type roles:** display serif (Spectral/Newsreader — headlines, *never bold*, leading 1.05–1.1) · body grotesque (Hanken/Schibsted Grotesk — UI, leading 1.55, ~68ch) · mono (Spline Sans Mono/IBM Plex Mono — eyebrows, specs, prices, SKUs). Max 2 weights per family, `font-display: swap`, preload the 2 critical weights.

**Usage discipline:** `--hoc-canvas` default page · `--hoc-paper` detail surfaces · `--hoc-sage` (with canvas text) for single drama sections + footer. Brass only on hairlines/hover/active/focus — never large fills or gradients. AA contrast everywhere; `--hoc-stone` for captions only.

**Breakpoints:** `480 / 768 / 1024 / 1280 / 1440`. Mobile-first; excellent at 375px. Grids 3-up desktop / 2-up tablet / 1–2-up mobile.

## Key JS behaviours

Keep JS minimal and vanilla (Dawn pattern: HTML-first, JS only as needed). Target Lighthouse ≥90 mobile.

- **Add to bag → mini-cart** ("Your bag" slide-over drawer): line items show thumbnail + specimen caption, quiet qty stepper, plain subtotal, "Checkout". Confirmation reads "Added". Empty state: *"Your bag is empty — start with the rooms."* (Dawn: `cart-drawer.js`, `cart-notification.js`.)
- **Ideabook (wishlist):** bookmark save from card/PDP → dedicated curated board page. Term is **"Ideabook"**, not "Wishlist"; **"Bag"**, not "Cart".
- **Mega-menu / mobile drawer:** room-led nav opens full-width panel (type columns + one editorial image tile); mobile = off-canvas accordion. ARIA + focus trapping required.
- **Predictive search drawer:** popular products + trending searches; full results reuse the filter rail.
- **Collection filters/sort:** left rail (desktop) / drawer (mobile); material/finish as swatch chips; active = removable brass-outlined pills. Default sort **"Curated"**, never price-low-to-high. (Dawn: `facets.js`.)
- **PDP gallery:** 4:5 primary, thumbnail/swipe, click-to-zoom, material macro shots. (Dawn: `media-gallery.js`, `magnify.js`.)
- **Product variants / swatches:** real-texture chips, selected = brass ring; "Request a sample" where `sample_available`.
- **Motion (PRD §7):** one restrained hero reveal + headline fade-up; fade-up on scroll runs *once*; hover crossfade/underline ~200–250ms ease-out. **All transforms/parallax disabled under `@media (prefers-reduced-motion: reduce)`.** (Dawn: `animations.js`.)

## Quality floor (non-negotiable — PRD §10)

AA contrast · visible keyboard focus everywhere · labelled fields · alt text · ARIA + focus trapping on drawers/modals · reduced-motion respected · **no layout shift** (reserve image ratios with `aspect-ratio`) · semantic HTML + sensible heading order · **British English** throughout · **no dark patterns** (no fake urgency/scarcity, no pre-ticked opt-ins). Microcopy: sentence case (except logo + small all-caps eyebrows); prices `£1,397` (no `.00`), ex-VAT in mono; never "cheap/bargain/deal/discount".

## Build order (PRD §11)

Foundation (tokens, type, header/footer) → Components → Home → Collection+filters → Product → Cart+search → Editorial → Polish. **Stop and review against the "never cheap, never loud" test after Home, Product, and Polish.**

## Open decisions (PRD §12 — need human input before locking)

Logo artwork/colourways (tune `--hoc-ink`/`--hoc-sage` to match) · licensed vs free fonts · final catalogue taxonomy (rooms/types) · sharing for Ideabook · Trade at v1? · how prominently to surface Market Design & Build · confirm zero sale UI ever.
