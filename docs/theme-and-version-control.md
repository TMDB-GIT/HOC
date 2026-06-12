# House of Clarence — Dawn, Feather, Git & "where the website really lives"

A plain-English map of how this project fits together, written to clear up two
things: **(1)** are we using Dawn or not, and where does "Feather" come in, and
**(2)** how version control works with Shopify and the GitHub repo.

> This doc is also meant to bring a second Claude Code chat up to speed — see the
> **"Exact status"** box at the bottom for the precise, current facts.

---

## TL;DR (read this first)

- **Dawn** = the free Shopify starter theme we used as a *skeleton*. We did **not**
  throw it away — we re-skinned it. Our theme is a **Dawn-based custom theme**:
  Dawn's reliable plumbing (cart, checkout, search) underneath, with the entire
  House of Clarence look built on top. So "are we still using Dawn?" → **Yes,
  underneath; but it no longer looks like Dawn.**
- **Feather** = a *different* theme that is currently **live** on your store. It
  has nothing to do with our build. We have never touched it.
- **Our House of Clarence work** currently lives only as **local files** (not yet
  committed to Git) plus a **temporary preview theme**. It is **not live**.
- **Shopify serves the live site from a theme stored in Shopify's own database**
  (right now: Feather). **GitHub is not what Shopify reads from at render time** —
  it's a versioned mirror/pipeline for *one* theme you connect to it.

---

## 1. Two separate layers — and Git only versions one of them

```
┌─────────────────────────────────────────────────────────┐
│  STORE DATA  (lives only in Shopify's database)          │
│  • Your 97 products, prices, variants, images            │
│  • Collections, customers, orders                        │
│  • Pages, blogs, navigation menus, metafields            │
│  → NOT in Git. Managed in the Shopify admin.             │
├─────────────────────────────────────────────────────────┤
│  THEME  (the presentation layer — code + settings)       │
│  • Liquid templates, CSS, JS, sections, snippets         │
│  • Theme settings & section content (the JSON files)     │
│  → THIS is the only part Git can version control.        │
└─────────────────────────────────────────────────────────┘
```

This is why the local preview shows your real 97 products even though no product
data exists in the theme files: the theme *asks* Shopify for the products at the
moment a page is rendered. The theme is the "skin"; the data is separate.

---

## 2. Dawn vs Feather vs our theme — what each one is

| Name | What it is | Where it is | Live? |
|---|---|---|---|
| **Dawn** | Shopify's free starter theme. Our starting point. | The first commit in our Git repo ("Initial Dawn base") | No |
| **Our HoC theme** | Dawn + all the House of Clarence design work from this build | Local folder `house-of-clarence/` (**uncommitted**) + a temporary "Development" preview theme on the store | No — preview only |
| **Feather** | A separate, already-customised theme | Stored in Shopify's database | **Yes — this is what visitors see today** |
| **Radiant** | Another draft theme sitting in the store | Shopify's database | No (unpublished) |

**Key point:** our HoC theme and Feather are unrelated. Building HoC has not
changed Feather. Nothing we've done is on the live site yet.

---

## 3. Where our work physically is right now

Three places a theme's code can exist; here's where *our* HoC build sits:

1. **Local files** in `house-of-clarence/` — the real work, but **not yet
   committed** to Git (31 changed/new files vs the "Initial Dawn base" commit).
2. **The "Development" preview theme** on the store — created automatically by
   `shopify theme dev`. It's **temporary** and disappears when the dev session
   ends. Do not treat it as a backup.
3. **GitHub** — does **not** have our work yet (we haven't committed or pushed).

⚠️ **So today, the only durable copy of our work is the local folder.** The very
next sensible step is to **commit it to Git** so it's safe and versioned.

---

## 4. The source of truth: how Shopify decides what to render

> Shopify always renders the live site from the **theme record in its own
> database** — right now that's **Feather [live]**. GitHub is *not* consulted at
> render time.

Think of it like this:

- The **live website = the published theme inside Shopify** (Feather).
- **GitHub = a version-controlled mirror + deployment pipeline** for *one* theme
  you choose to connect. It is not the live source itself.

### Three "doors" can write into a single theme
All three edit the **same** theme record:

1. **Admin theme editor** (Online Store → Customize) — drag sections, change
   colours, edit text. *The merchant door.*
2. **Shopify CLI** — `shopify theme push` (local → store),
   `shopify theme pull` (store → local).
3. **GitHub integration** — connect a repo + branch to a theme in admin.

### What the GitHub integration actually does
When a repo/branch is connected to a specific theme, the sync is **two-way**:

- **Branch → Shopify:** pushing a commit to that branch auto-updates that theme.
- **Shopify → Branch:** editing that theme in the admin theme editor makes
  Shopify commit those changes *back* to your branch (authored by `shopify[bot]`).

So a connected theme and its GitHub branch chase each other to stay identical —
but the **authoritative renderer is still the theme inside Shopify**.

---

## 5. The danger to avoid

If two doors write to the same live theme — e.g. a person editing in admin **and**
code being pushed from Git — they can clobber each other.

> **Golden rule:** pick **one** theme as your Git-connected "source of truth," and
> make all *code* changes flow through Git. Treat content/section edits in the
> admin theme editor as the only admin changes (those sync back as bot commits).

Two more rules:

- **Never push our repo over Feather right now.** The committed repo is still
  plain Dawn, so pushing it to the live theme would replace Feather's site with
  blank Dawn. (Our HoC work isn't committed yet anyway.)
- **Store data stays in admin.** Products, prices, collections, menus, metafields
  are never in Git.

---

## 6. Recommended workflow for House of Clarence

The safe path that keeps Feather live until HoC is genuinely ready:

1. **Commit our HoC work to Git** (locally), then **push to GitHub**. This makes
   the build durable and versioned. *(Nothing goes live from this step.)*
2. **Create a new, unpublished HoC theme** in the store from this code — either:
   - push it with the CLI: `shopify theme push --unpublished` (creates a new
     theme named after the build), **or**
   - connect the GitHub repo/branch to a **new** theme in
     Admin → Online Store → Themes → Add theme → *Connect from GitHub*.
3. **Review** that unpublished theme via its preview link. Keep making code
   changes **through Git** (one door). Avoid editing it in the admin theme editor,
   or expect `shopify[bot]` commits back to the branch.
4. **When you're happy, click Publish** on the HoC theme. It becomes live and
   replaces Feather. **Feather stays as an unpublished backup** you can revert to.
5. Keep adding **products/collections/prices in admin** as normal — independent of
   all the above.

Day-to-day after that:
- Edit code locally → `git commit` → `git push` → (if connected) the theme
  updates, or run `shopify theme push -t <theme-id>`.
- Preview anytime with `shopify theme dev`.

---

## 7. One open item to check in admin

We can't tell from the command line **whether the `TMDB-GIT/HOC` repo is already
connected to a Shopify theme**, or which one. Check:

> Admin → **Online Store → Themes** → look for a theme showing a **GitHub /
> "Connected"** label, and see which branch it points to.

- If it's connected to **Feather**: do **not** push the current (Dawn-only)
  branch, or you'll overwrite the live site. Decide intent first.
- If it's connected to **nothing meaningful** or a spare theme: that's fine — we
  can make a clean HoC theme via step 6 above.

---

## Exact status (for a second chat / future reference)

Facts as verified on this machine, this session:

- **Repo:** `git@github.com-tmdb:TMDB-GIT/HOC.git`, branch `main`.
- **Commits:** exactly one — `Initial Dawn base`. So the *committed* tree = vanilla
  Dawn.
- **Working tree:** ~31 uncommitted changes = the full House of Clarence build
  (new `assets/hoc-*.css|js`, `snippets/hoc-*`, `sections/hoc-header|hoc-footer|
  hero-banner|trust-strip|collection-tiles|featured-products|editorial-split|
  cta-band|main-collection|main-product`, rebuilt `templates/index|collection|
  product.json`, edited `layout/theme.liquid`, plus `docs/`). **Not committed,
  not pushed.**
- **Store themes:** `Feather [live] #202445717835`, `Radiant [unpublished]
  #202467311947`, `Development (c25a5a-Mac) [development] #202483958091` (the
  temporary `shopify theme dev` preview of our build).
- **Therefore:** the HoC build is **previewable but not live, not committed, not
  pushed**. The committed/pushed repo would deploy *plain Dawn* if connected to a
  theme — so the immediate safe action is to **commit the HoC work** before any
  push/connect/publish.

> Correction for the other chat's note "the local repo contains plain Dawn": the
> *committed* repo is plain Dawn, but the *working directory* now contains the
> complete HoC theme (uncommitted). The "Development" theme on the store is that
> HoC build being previewed.

---

*Theme code lives in `house-of-clarence/`. Store data lives in Shopify admin.
The live site is whichever theme is **Published** in Shopify — today, Feather.*
