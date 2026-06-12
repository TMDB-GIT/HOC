# House of Clarence — Design Reference

> A single source of truth for building the House of Clarence storefront as a **custom Shopify (Liquid) theme**.
> Direction: **Lusso's commercial structure carrying Yana Prydalna's editorial mood.**
> Hand this file to Claude Code as the design brief. Build to it exactly; where it says *CONFIRM*, the decision depends on an asset or input not yet supplied.

---

## 0. How to use this document

- Sections 1–3 are the *why* (positioning, voice, principles). Read once, keep in mind throughout.
- Sections 4–7 are the *system* (tokens, type, components, motion). These map directly to CSS custom properties and `settings_schema.json`.
- Section 8 is the *page-by-page blueprint*, mapped to Shopify templates and sections.
- Section 9 is *theme architecture* — file structure, sections/blocks, metafields.
- Section 10 is the *quality floor*. Non-negotiable.
- Section 11 is a *phased build order* for Claude Code.
- Section 12 lists *open decisions* that need a human answer.

Every colour and type value below is a starting token. The **logo already exists**, so the palette and type must be tuned to it — see §12.

---

## 1. Brand foundation

### What House of Clarence is
The furnishings and finishes house for people building or renovating a home of substantial value. Where Market Design & Build builds the house, **House of Clarence furnishes it** — vanities, baths, brassware, kitchens, sofas, lighting, joinery, the things that go *inside*. Sister company; shared standard of care.

### Positioning
**Premium brand, premium clients, without premium pricing.**
The hard part: prices are lower than competitors, but the brand must never *read* as cheap. We win by behaving like the most confident, quietest house in the room — and letting the work imply the value.

**The rule that protects the position:** price is never the hook. No "SALE", no countdown timers, no "WAS £X NOW £Y" as a headline, no urgency klaxons. Value is communicated through restraint, material honesty, and quality of presentation. A client who can afford anything is reassured by calm, not by a discount.

### Audience
High-net-worth homeowners and their interior designers / project managers mid-renovation. Time-poor, taste-rich, allergic to anything that feels mass-market. Secondary: trade (designers, architects, builders) who need spec sheets, trade pricing, and bulk.

### The feeling (the Yana axis)
Calm, considered, tactile. "It's about how it makes you feel." Generous space, slow scroll, big honest photography of real materials. Imperfection welcomed (wabi-sabi): natural stone veining, oak grain, patinated brass. Nothing shouty. The site should feel like walking into a townhouse showroom, not a warehouse.

### The structure (the Lusso axis)
Genuinely shoppable. Deep, well-organised navigation by room and by product type. Editorial category tiles, buying guides, an ideabook/wishlist, trade membership, real product grids with filtering. The mood never gets in the way of finding and buying a vanity unit.

---

## 2. Design principles

1. **Material first.** The hero of any page is the product and its material, shot honestly. Photography does the talking; UI gets out of the way.
2. **Quiet confidence.** One bold move per page, everything else disciplined. No decoration that doesn't carry information.
3. **Space is luxury.** Generous margins and vertical rhythm signal premium more reliably than any gold accent.
4. **Specimen, not SKU.** Every product is presented like a curated specimen — material, finish, origin, dimensions — with the precision of an architect's spec sheet. (This is our signature; see §4.7.)
5. **Never cheap, never loud.** Price is stated plainly, never sold. No discount theatrics.
6. **Shoppable calm.** Commerce mechanics (filter, add to cart, mini-cart) are present and excellent, but rendered in the brand's quiet register.

---

## 3. Voice & tone

**Voice:** assured, plain-spoken, knowledgeable. A trusted maker, not a salesperson. British register, no Americanisms ("colour", "favourite", "£").

**Tone by context:**
- *Editorial / hero:* evocative but short. "Made to be lived in." Not paragraphs of poetry.
- *Product / spec:* precise and factual. Materials, dimensions, finishes, lead times — stated clearly.
- *UI / actions:* active and literal. "Add to bag", "Save to ideabook", "Request a sample". The button that says "Add to bag" produces a confirmation that says "Added".
- *Empty/error states:* directional, never apologetic. "Your bag is empty — start with the rooms." not "Oops!"

**Microcopy rules**
- Sentence case everywhere except the logo and small all-caps eyebrows.
- "Bag", not "Cart". "Ideabook", not "Wishlist" (borrowed from the Lusso pattern, fits the considered tone).
- Prices: `£1,397` — no `.00` unless pence are meaningful. Show ex-VAT in a smaller mono caption for trade credibility, e.g. `£1,397 · £1,164 ex. VAT`.
- Never write "cheap", "bargain", "deal", "discount". If something is reduced, it is simply priced at the lower figure with no drama.
- Eyebrows label, they don't decorate: "VANITY UNITS", "FOR THE KITCHEN", "TRADE".

---

## 4. Visual identity

### 4.1 Palette

A heritage-townhouse palette: warm stone and plaster, a deep sage anchor, and **antique brass as the only metallic accent**, used sparingly. Deliberately *not* the cream-and-terracotta luxury default.

```css
:root {
  /* Anchors */
  --hoc-ink:        #20201D; /* warm near-black — body text, strong UI, footer */
  --hoc-canvas:     #EAE7E0; /* warm stone/plaster — default page background */
  --hoc-paper:      #F6F4EF; /* lighter surface — cards, raised panels, PDP */

  /* Heritage secondary */
  --hoc-sage:       #3B4138; /* deep olive-sage — section blocks, footer, quiet drama */
  --hoc-sage-soft:  #5A6056; /* hover/disabled variant of sage */

  /* Metallic accent — USE SPARINGLY */
  --hoc-brass:      #9A7B4F; /* antique brass — hairline rules, hover, active detail */
  --hoc-brass-deep: #7C6240; /* pressed/active brass */

  /* Neutrals / structure */
  --hoc-stone:      #B9B3A7; /* dividers, muted captions, disabled text */
  --hoc-stone-line: #D8D3C9; /* hairline borders on canvas */

  /* Functional (kept in-key, never neon) */
  --hoc-success:    #4F6B4A;
  --hoc-error:      #8C4A3F;
}
```

**Usage discipline**
- Default page = `--hoc-canvas`. Product/editorial detail surfaces = `--hoc-paper`. Drama sections (a single full-bleed statement, footer) = `--hoc-sage` with `--hoc-canvas` text.
- **Brass is jewellery, not paint.** Hairline rules under eyebrows, link underlines on hover, the active filter pill, the focus ring tint. Never large fills, never gradients.
- Maintain **AA contrast** for all text. `--hoc-ink` on `--hoc-canvas`/`--hoc-paper` passes comfortably. `--hoc-stone` is for non-essential captions only — never body copy.
- *CONFIRM against logo:* if the logo carries a specific colour (e.g. a particular green or a black), bend `--hoc-sage` / `--hoc-ink` to match it exactly so the logo never looks pasted on.

### 4.2 Typography

Three roles. Avoid the obvious Didone luxury serif (Playfair et al.) — it's the default move. We pair a quiet, low-contrast serif with a clean grotesque body and a mono utility face that powers the specimen system.

| Role | Ideal (licensed) | Accessible fallback (Google/free) | Used for |
|------|------------------|-----------------------------------|----------|
| **Display serif** | Canela / Reckless / Ogg | **Spectral** or **Newsreader** | Headlines, hero, category titles |
| **Body grotesque** | Söhne / Suisse Int'l | **Hanken Grotesk** or **Schibsted Grotesk** | Body, nav, UI, buttons |
| **Mono utility** | Söhne Mono | **Spline Sans Mono** or **IBM Plex Mono** | Eyebrows, specs, prices, specimen labels, SKUs |

> Shopify note: load fonts via `font_picker` settings where possible for licensed Shopify fonts, otherwise self-host the chosen webfonts in `/assets` and preload the two most critical weights. Keep to **2 weights per family** to protect performance.

**Type scale** (1.25 major-third-ish, fluid with `clamp`):

```css
:root {
  --t-hero:   clamp(2.75rem, 5vw + 1rem, 5.5rem);   /* display serif, hero */
  --t-h1:     clamp(2rem, 3vw + 1rem, 3.25rem);     /* display serif */
  --t-h2:     clamp(1.5rem, 2vw + 0.5rem, 2.25rem); /* display serif */
  --t-h3:     1.375rem;                             /* display serif or grotesque medium */
  --t-body-l: 1.125rem;                             /* lead paragraphs (grotesque) */
  --t-body:   1rem;                                 /* body (grotesque) */
  --t-small:  0.875rem;                             /* captions (grotesque) */
  --t-mono:   0.75rem;                              /* eyebrows / specs (mono, +0.08em tracking, UPPERCASE) */
}
```

**Rules**
- Display serif: tight leading (1.05–1.1), normal weight, *never bold*. Let size carry weight.
- Body grotesque: leading 1.55, max line length ~68ch for editorial.
- Mono eyebrows: uppercase, letter-spacing `0.08em`, small. This is the thread that ties navigation, specs, and the specimen labels together.

### 4.3 Logo usage
Logo exists (*CONFIRM artwork + colourways*). Provide it as SVG for the header, a single-colour version for the footer (in `--hoc-canvas` on sage), and a favicon/app-icon set. Minimum clear space = the cap-height of the wordmark on all sides. Never recolour outside the brand palette, never place on busy imagery without a scrim.

### 4.4 Iconography
Thin line icons, ~1.25px optical stroke, rounded joins, monochrome `--hoc-ink`. Keep the set tiny: search, account, bag, ideabook (a simple bookmark/heart-outline — *CONFIRM*), chevron, close, filter, plus/minus. No filled or duotone icons.

### 4.5 Imagery art direction (the most important asset)
This is where the Yana mood lives, and where the "not cheap" promise is kept or broken.

- **Big, honest, full-bleed.** Lifestyle shots run edge-to-edge. Products shot in real, beautifully styled rooms — soft daylight, natural shadow, real materials.
- **Tactile close-ups.** Pair each room shot with a macro of the material: marble veining, oak grain, brass patina. Celebrate imperfection.
- **Restrained styling.** Calm, lived-in interiors. No clutter, no stock-photo gloss, no people grinning at camera.
- **Consistent grade.** Warm, slightly muted, natural. A shared LUT so the catalogue feels like one house, not a marketplace.
- **Aspect ratios:** hero 16:9 (and a 4:5 mobile crop), category tiles 1:1 or 4:5, PDP gallery 4:5 portrait primary + 1:1 detail shots. Define these as ratio tokens and enforce with `aspect-ratio` so the grid never jumps.
- **Always provide `alt`** describing the material and piece, not "image1".

### 4.6 Layout feel
Editorial, asymmetric where it earns it; disciplined grid underneath. Lots of whitespace. Hairline `--hoc-stone-line` dividers rather than boxes and shadows. Border-radius near-zero (2–4px max) — squared corners read more architectural and considered than rounded.

### 4.7 Signature element — the Specimen Label
The one thing that makes House of Clarence unmistakable, and it's grounded in what you actually sell: finishes and materials.

Every product card and PDP carries a small **mono specimen caption**, set like an architect's or museum label:

```
OAK · NATURAL  /  HONED MARBLE BASIN  /  800MM  /  £1,397
```

- Set in the mono utility face, uppercase, `--hoc-stone` for the metadata and `--hoc-ink` for the price, separated by thin brass `·` or `/` dividers.
- On the PDP, expands into a full **specimen block**: Material, Finish, Origin, Dimensions, Weight, Lead time, Care — laid out like a spec sheet (echoes Yana's master-drawings precision).
- This single device does the heavy lifting: it signals expertise and quality, justifies the premium feel, and never once mentions a discount.

Use this *instead of* sale badges. It's the antidote to "cheap".

---

## 5. Layout system

```css
:root {
  /* Spacing scale (8px base) */
  --s-1: 0.5rem;  --s-2: 1rem;   --s-3: 1.5rem;  --s-4: 2rem;
  --s-5: 3rem;    --s-6: 4rem;   --s-7: 6rem;    --s-8: 8rem;  --s-9: 12rem;

  /* Containers */
  --container:     1440px;  /* max content width */
  --container-text: 720px;  /* editorial reading column */
  --gutter:        clamp(1rem, 4vw, 4rem);

  /* Radii */
  --radius: 3px;
}
```

- **Grid:** 12-column on desktop, 6 on tablet, 1–2 on mobile. Category and product grids: 3-up desktop / 2-up tablet / 1–2-up mobile.
- **Vertical rhythm:** sections separated by `--s-7`/`--s-8`; generosity is the point. Don't crowd.
- **Breakpoints:** `480 / 768 / 1024 / 1280 / 1440`. Mobile-first. Everything must be excellent at 375px wide.

---

## 6. Components

All components quiet by default; brass and motion reserved for interaction. Square-ish corners, hairline borders, no drop shadows except a barely-there one on the sticky header and mini-cart.

### Buttons
- **Primary:** `--hoc-ink` fill, `--hoc-canvas` text, no radius beyond `--radius`. Hover: fill shifts to `--hoc-sage`. Label is a verb ("Add to bag").
- **Secondary:** transparent, `1px --hoc-ink` border, ink text. Hover: border + text → `--hoc-brass-deep`.
- **Text/quiet link:** ink text, brass underline appearing on hover (animated from 0 width).
- All buttons: visible focus ring (`2px --hoc-brass` offset). Generous tap target (min 44px).

### Header / navigation
- Sticky, slim, `--hoc-canvas`/`--hoc-paper` with a hairline bottom border that deepens on scroll.
- Left: logo. Centre or left-aligned: primary nav (**room-led**, since categories are even across the home). Right: Search, Account, Ideabook, Bag.
- **Mega-menu** (Lusso pattern, HoC restraint): primary nav opens a full-width panel with columns by product type plus one editorial image tile per room. Mono eyebrow headings, body links, brass hairline under the open item.
- Primary nav (whole-home): **Bathroom · Kitchen · Living · Bedroom · Lighting · Hardware · Tiles & Surfaces · Homeware** + a quiet **Trade** and **Journal** link. (Adjust to real catalogue taxonomy — see §9 metafields.)
- Mobile: off-canvas drawer, accordion categories, the same mono eyebrows.

### Footer
- `--hoc-sage` background, `--hoc-canvas` text, brass hairlines.
- Columns: Shop by room · Shop by type · The House (about, heritage, journal) · Trade · Help (delivery, returns, guarantees, FAQs) · Contact. Newsletter sign-up ("Inspiration, occasionally" — no spam tone). Social row. Legal strip.

### Product card
```
┌────────────────────┐
│   [4:5 product img] │  ← hover: crossfade to detail/in-room shot
│                     │
├────────────────────┤
│ Hampton Vanity Unit │  ← display serif, h3
│ OAK · HONED MARBLE  │  ← mono specimen caption
│ £1,397              │  ← ink, body
│ [ Save ]  (on hover)│  ← quiet ideabook bookmark, top-right
└────────────────────┘
```
- No sale badge. If genuinely reduced, show the lower price plainly; optionally a hairline strikethrough of the old price in `--hoc-stone`, no "SALE" word, no red.
- Hover: image crossfade + caption nudges up to reveal a quiet "View" affordance. Respect reduced-motion.

### Collection / category tiles (home + landing)
Editorial tiles, 1:1 or 4:5, image with a mono eyebrow, serif title, and a quiet text link ("Shop vanity units"). Big imagery, lots of air between tiles. This is the Lusso "TRANSFORM YOUR SPACE" pattern in HoC clothing.

### Filters & sort (collection page)
- Left rail (desktop) / drawer (mobile). Filter groups: Room, Type, Material, Finish, Colour, Price range, Brand. Material/Finish as small swatch chips. Active filters as removable brass-outlined pills.
- Sort: a quiet select. Default sort = "Curated" (manual/featured), never "Price: low to high" by default — we don't lead with price.

### Specimen block (PDP) — see §4.7
Spec-sheet table: Material / Finish / Origin / Dimensions / Weight / Lead time / Care / Guarantee. Mono labels, body values, hairline row dividers.

### Material / finish swatches
Real-texture swatch chips (small images of the actual marble/oak/brass), square, hairline border, selected state = brass ring. Used in filters and PDP variant selection. "Request a sample" CTA where relevant — a premium service touch that costs nothing to offer and reinforces "not cheap".

### Forms & inputs
Underline-style inputs (hairline `--hoc-stone-line`, focus → brass), generous height, mono labels above. Errors are directional text in `--hoc-error`, never a shouty banner.

### Trust strip (NOT a discount strip)
A slim band stating quiet reassurances: "Trade & private clients" · "White-glove delivery" · "Considered guarantees" · "Sister to Market Design & Build". This replaces the usual "FREE SHIPPING / SALE NOW ON" bar. Calm proof, not promotion.

### Mini-cart ("Your bag")
Slide-over drawer. Line items with thumbnail + specimen caption, quiet quantity stepper, subtotal stated plainly, primary "Checkout" button. Empty state: "Your bag is empty — start with the rooms." with quick links.

### Ideabook (wishlist)
Save from card/PDP (bookmark icon). A dedicated page presenting saved pieces as a curated board, shareable. Borrowed from Lusso's "Ideabook" — fits the considered-client journey better than "wishlist".

---

## 7. Motion & interaction

Less is more — over-animation is the fastest way to look generated and to undercut "premium calm".

- **Page-load:** a single restrained reveal — hero image settles (subtle scale-down from 1.04 to 1.0 over ~600ms) and headline fades up once. Not a cascade of everything.
- **Scroll:** gentle fade-up on section entry, generous threshold, runs *once*. Big imagery may have a very subtle parallax (≤8%) — optional, skip if it risks jank.
- **Hover:** product image crossfade, link underline draw, button colour shift. ~200–250ms, ease-out.
- **Always:** `@media (prefers-reduced-motion: reduce)` disables transforms/parallax and keeps instant, accessible states.

---

## 8. Page blueprints (mapped to Shopify)

> Template files in `/templates`, composed of sections in `/sections`. Each blueprint below lists its key sections so Claude Code can build modular, merchant-editable sections with `{% schema %}`.

### 8.1 Home — `index.json`
1. **Hero** — full-bleed lifestyle image, mono eyebrow, serif statement ("Made to be lived in."), one quiet CTA ("Explore the rooms"). *Section: `hero-banner`.*
2. **Shop by room** — grid of editorial room tiles (Bathroom, Kitchen, Living, Bedroom…). *Section: `collection-tiles`.*
3. **Featured collection** — curated product row (specimen cards). *Section: `featured-products`.*
4. **The material story** — split editorial block, macro material shot + short copy (the wabi-sabi/craft moment). *Section: `editorial-split`.*
5. **Trust strip** — quiet reassurances (§6). *Section: `trust-strip`.*
6. **Buying guides / Journal teaser** — Lusso "Expertly Curated Advice" pattern. *Section: `journal-teaser`.*
7. **Trade invitation** — understated band for designers/builders, link to Trade. *Section: `cta-band`.*
8. **Newsletter + footer.**

### 8.2 Collection / room landing — `collection.json`
- Editorial collection header (image + eyebrow + serif title + one-line intro).
- Filter rail + sort (default "Curated").
- Product grid (specimen cards), 3-up desktop.
- Pagination or "Load more" (no infinite scroll that breaks footer access).
- Optional buying-guide cross-link at the foot.

### 8.3 Product detail — `product.json`
- Gallery: 4:5 primary, thumbnail rail / swipe on mobile, zoom on click. Detail/material macro shots included.
- Right column: serif product title, specimen caption, price (plain, + ex-VAT mono), variant/swatch selectors ("Request a sample" where apt), quantity, **Add to bag** (primary), **Save to ideabook** (quiet).
- **Specimen block** (§4.7) — the spec sheet.
- Description: editorial, material-led, not bullet spam.
- Delivery & guarantees accordion. Trade pricing note (gated).
- "Pairs well" / "Complete the room" related products.
- *No* "X people viewing", *no* urgency, *no* countdowns.

### 8.4 Journal / buying guides — `blog.json`, `article.json`
Editorial reading column (720px), big imagery, serif headings. The content engine that supports the considered purchase and quietly carries SEO. (Mirrors Lusso's buying guides + "Our World".)

### 8.5 The House / heritage — `page.about.json`
The story: House of Clarence as sister to Market Design & Build, the standard of care, the people. Big imagery, calm copy. This page does a lot of the "premium, trustworthy" work.

### 8.6 Trade — `page.trade.json`
Trade membership / account application (designers, architects, builders). Spec downloads, trade pricing access, dedicated contact. Lusso's "Trade Membership" pattern.

### 8.7 Contact — `page.contact.json`
Phone, email, hours, project enquiry form ("Discuss a project"). Lusso's "Get in touch" warmth without the gloss.

### 8.8 Search — `search.json`
Predictive search drawer (popular products + trending searches, Lusso pattern), full results page with the same filter rail.

### 8.9 Cart — `cart.json` + mini-cart drawer (§6).

---

## 9. Shopify theme architecture

### Recommended starting point
Build on **Shopify's Online Store 2.0** architecture (JSON templates + sections everywhere) so the merchant can rearrange home/landing sections without code. Either start from a clean copy of **Dawn** and replace its design layer wholesale, or scaffold fresh — Dawn is the safer base for performance and Theme Store compatibility.

### Suggested file structure
```
/assets
  hoc-base.css            ← tokens (§4,§5) as :root custom properties
  hoc-type.css            ← @font-face / preloads
  hoc-components.css       ← components (§6)
  hoc-*.js                 ← small, dependency-light JS per behaviour
  (fonts, logo.svg, icons.svg sprite)
/config
  settings_schema.json     ← expose tokens as theme settings (colours, fonts, ratios)
/layout
  theme.liquid
/sections
  hero-banner.liquid
  collection-tiles.liquid
  featured-products.liquid
  editorial-split.liquid
  trust-strip.liquid
  journal-teaser.liquid
  cta-band.liquid
  header.liquid  footer.liquid
  main-collection.liquid  main-product.liquid  main-cart.liquid ...
/snippets
  product-card.liquid       ← includes specimen caption
  specimen-block.liquid
  swatch.liquid  price.liquid  icon.liquid
/templates
  index.json  collection.json  product.json  cart.json  search.json
  page.about.json  page.trade.json  page.contact.json
  blog.json  article.json
```

### Tokens → theme settings
Mirror the §4/§5 custom properties in `settings_schema.json` (colour pickers for ink/canvas/sage/brass, font pickers for the three roles, range for container width) and output them as `:root` variables in `theme.liquid`. This lets the merchant nudge the brand without breaking the system.

### Metafields (power the specimen system + filtering)
Define product metafields so the specimen caption/block and filters are data-driven, not hand-typed:
- `custom.material` (single line / list)
- `custom.finish`
- `custom.origin`
- `custom.dimensions` (or structured: width/height/depth)
- `custom.weight`
- `custom.lead_time`
- `custom.care`
- `custom.room` (for whole-home navigation/filtering)
- `custom.sample_available` (boolean → shows "Request a sample")

Use Shopify's native **Search & Discovery** app for filters keyed off these metafields and product options.

### Performance (part of looking premium)
- Lazy-load below-the-fold imagery; eager-load + `fetchpriority="high"` the hero only.
- Serve responsive `srcset` via Shopify's `image_url` filters; enforce `aspect-ratio` to prevent layout shift (CLS).
- ≤2 weights per font family, `font-display: swap`, preload the 2 critical weights.
- Keep JS minimal and vanilla; avoid heavy sliders. Target Lighthouse ≥90 on mobile.

---

## 10. Quality floor (non-negotiable)

- **Responsive** and excellent at 375px → 1440px+.
- **Accessible:** AA contrast, visible keyboard focus everywhere, logical tab order, labelled form fields, alt text on all imagery, ARIA on drawers/menus, focus trapping in modals/mini-cart.
- **Reduced motion** respected (§7).
- **No layout shift** — reserved image ratios, no late-loading banners pushing content.
- **Semantic HTML**, sensible headings hierarchy.
- **British English** throughout the UI.
- **No dark patterns** — no fake urgency, fake scarcity, or pre-ticked marketing opt-ins.

---

## 11. Phased build order for Claude Code

1. **Foundation** — scaffold the theme; implement `hoc-base.css` tokens, type loading, `settings_schema.json` mappings. Get `theme.liquid`, header, footer right first.
2. **Components** — buttons, links, product-card snippet (with specimen caption), price snippet, swatch, forms, icons sprite. Build a hidden `/components` preview page to review them together.
3. **Home** — assemble `index.json` from sections (§8.1). This sets the mood; review before going further.
4. **Collection + filters** — `main-collection`, filter rail, Search & Discovery wiring.
5. **Product** — `main-product`, gallery, specimen block, variants/swatches, add-to-bag, ideabook save.
6. **Cart + mini-cart**, search drawer.
7. **Editorial** — journal/article, About/heritage, Trade, Contact.
8. **Polish** — motion, reduced-motion, performance pass, accessibility audit, mobile QA.

After steps 3, 5, and 8, stop and review against this document — especially the "never cheap, never loud" test.

---

## 12. Open decisions (need a human answer)

1. **Logo artwork & colourways** — supply SVG + colour values. The palette (`--hoc-ink`, `--hoc-sage`) should be tuned to match so the logo never looks pasted on.
2. **Fonts** — confirm budget for licensed faces (Canela/Söhne tier) vs the free fallbacks (Spectral + Hanken Grotesk + Spline Sans Mono). Either works; the licensed tier lifts the premium feel a notch.
3. **Exact catalogue taxonomy** — final list of rooms and product types, to lock the mega-menu and metafield `room`/`type` values. (Current nav in §6 is a sensible placeholder.)
4. **"Ideabook" vs "Wishlist"** — confirm the term (recommend Ideabook) and whether sharing is needed at launch.
5. **Trade at launch?** — is trade membership/pricing a v1 feature or phase 2?
6. **Market Design & Build relationship** — how prominently to surface the sister-company link, and whether any shared visual identity must carry across.
7. **Reduced/sale pricing** — confirm we will *never* run visible sale theatrics, only quiet lower prices, so I can keep all discount UI out of the theme entirely.

---

*End of reference. Build to the system, spend boldness only on the specimen signature and the photography, and keep everything else quiet.*