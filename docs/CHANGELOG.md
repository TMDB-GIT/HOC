# House of Clarence — updates log

A running, reverse-chronological log of changes to the theme since the initial
build. For the overall state and handoff notes see
[`PROJECT-STATUS.md`](./PROJECT-STATUS.md); for the design *why* see
[`prd.md`](../prd.md).

Each entry notes the date, the branch the work was done on, what changed and
why, and the files touched. Dates are absolute (British English throughout).

---

## "Shop by room" scroll-through — current state

**Branch:** `feature/shop-by-room-scroll` · **Status:** built & previewable.

The homepage "Shop by room" section (`collection-tiles`) is a **scroll-through
gallery**: each room (Bathroom, Kitchen, Living, Lighting) is one large,
individual card the visitor moves through one at a time.

- **Desktop + motion allowed** (`<html class="hoc-anim">`, ≥1024px): the section
  **pins** and the room track **slides horizontally** in step with vertical
  scroll. A **lead-in** hold lets the visitor land on the heading before motion
  starts, and a **lead-out** hold lets the last room rest before the page
  continues (both tunable in the theme editor, % of screen height).
- **Desktop, reduced motion / no-JS:** degrades to a **native horizontal scroll
  row** (scroll-snap) — no scroll-jacking.
- **Mobile (<1024px):** **simple stacked tiles**.

**Layout:** each room is a **full-width slot**, so exactly one room is in view on
any screen size (no neighbour peek, consistent across window shapes). The photo
sits in a **centred frame at its true 8:5 ratio** — shown whole, never stretched
or cropped. Header is **centred** with a thin **vertical drop-line** above the
heading and a centred "View all" beneath; it's pinned at the top so it can't clip.

**Card title + dim:** clean image at rest; a **dim overlay + centred room name**
fade in (~900ms) while the visitor **scrolls through the rooms** or **hovers** a
card, then fade out after. Title is large (`clamp(2.25rem, 4vw, 4rem)`).

**Theme-editor settings** (Collection tiles section):
- "Pin & scroll horizontally on desktop" (checkbox, default on).
- "Pause before scrolling (lead-in)" (range, %, default 60).
- "Pause after scrolling (lead-out)" (range, %, default 35).

**Files:**
- `sections/collection-tiles.liquid` — room-card markup + the settings above
  (schema/blocks unchanged, so `index.json` data is untouched).
- `assets/hoc-shop.css` — the `.hoc-roomscroll` system.
- `assets/hoc-room-scroll.js` — pinned-scroll behaviour (gated on `hoc-anim` +
  1024px; lead-in/out, scroll/hover dim+title reveal).
- `layout/theme.liquid` — loads `hoc-room-scroll.js`.
- `assets/hoc-tile-{bathroom,kitchen,living,lighting}.jpg` — room photography.

**Verified:** `shopify theme check` clean for these files (the only remaining
lint errors are pre-existing in Dawn's own files); JS passes `node --check`.

---

## Evolution (newest first)

### 2026-06-22 — PR #5 review fixes
Addressed 6 findings from automated review:
- **Perf (LCP):** first room now loads `eager` + `fetchpriority="high"` (it's the
  above-the-fold hero / likely LCP); later rooms stay `lazy`.
- **A11y:** added a `:focus-within` reveal so a keyboard-focused room stays
  labelled (the brief `is-scrolling` flash didn't persist, and the first room
  fired no scroll event at all).
- **Correctness:** keyboard-nav scroll target measured the panel relative to the
  track's left edge (`offsetLeft - track.offsetLeft`) so it no longer overshoots
  by the viewport inset.
- **Cosmetic:** progress bar `display: block` scoped to `.is-pinned` so it isn't
  a dead element under reduced-motion / no-JS / pin-off.
- **Efficiency:** `onScroll` early-outs once the section is off-screen.
- **Cleanup:** resize handler only re-`measure()`s an already-active instance
  (avoids a double-measure when a breakpoint is crossed).

### 2026-06-22
- **Name-only label.** Removed the index counter ("01 / 04") — the card shows
  only the room name. Dropped the now-unused `tile_index`/`tile_total` Liquid
  assigns and `.hoc-roompanel__index` style.
- **Slower, larger reveal.** Dim/title fade slowed to **900ms**; room name
  enlarged to `clamp(2.25rem, 4vw, 4rem)`.
- **Hover reveal.** The dim + title now also appear on **hover** over a card (not
  only while scrolling). Both triggers raise the same opacity, so they layer
  cleanly and don't fight the scroll-driven slide.

### 2026-06-17
- **Scroll-reveal title + dim.** Card title centred and hidden by default on the
  pinned scroller; a dim overlay + title fade in while scrolling (JS toggles an
  `is-scrolling` class, ~280ms debounce), out shortly after. Titles stay visible
  (no dim) on mobile / reduced motion.
- **Larger imagery.** Trimmed the surrounding chrome (smaller side margins via
  new `--hoc-room-inset`, tighter gaps, shorter drop-line) so the photo runs
  bigger while keeping its true 8:5 ratio.
- **Centred editorial header.** Restyled from a left-aligned title (with "View
  all" right, divider beneath) to a centred layout with a thin vertical drop-line
  above the heading. Replaces `.hoc-section-head` here with
  `.hoc-roomscroll__head` + `.hoc-roomscroll__rule`.
- **Consistent across screen sizes.** The earlier "size the room to the image
  ratio and centre it" made rooms narrower than the frame on wide/short screens,
  so a neighbour peeked in and the heading could clip. Re-architected to
  full-width slots (one room in view everywhere) with a centred 8:5 photo frame;
  heading pinned at the top. JS reverted to the simple continuous slide.

### 2026-06-16 — initial build & same-day iterations
- **Initial scroll-through.** Reworked the static four-up tile grid into the
  pinned horizontal scroller with lead-in/lead-out holds; replaced the old
  `.hoc-tiles` grid with `.hoc-roomscroll`; added `hoc-room-scroll.js`.
- **Sizing.** Iterated from container-bound → full-bleed → inset-to-gutter with a
  gap between rooms, and enlarged the panels.
- **Centred stepped motion — tried & reverted.** Briefly stepped one room to
  centre at a time (with a "Scroll length per room" setting); reverted to the
  continuous slide at the client's request; setting removed.
- **Image proportions fix.** Stopped forcing a fixed-height full-width box (which
  made `object-fit: cover` crop/zoom and read as "stretched"); moved to the true
  8:5 framing.
- **New room photography.** Replaced the four 1200×1200 squares with high-res
  **2400×1500 landscape** imagery, on theme: bathroom = hi-res of the existing
  warm-stone scene; kitchen = Calacatta marble island + brass lantern (Unsplash,
  swapped off the client render which had a flip-clock in frame); living = sage
  linen sofa + walnut + brass (Unsplash); lighting = glowing globe pendants
  (Unsplash). Filenames unchanged; sources logged in `docs/image-credits.md`;
  originals backed up to `/tmp/hoc-tile-backup`.
