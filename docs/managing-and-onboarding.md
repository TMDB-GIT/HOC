# Managing House of Clarence — repository & operations guide

The one place to understand **how this project is run day to day**: who edits what,
whether Shopify-admin changes come back into this repo, how to make and ship code
changes safely, and how to roll back. Plain-English first; commands where useful.

> Companion docs: **[CLAUDE.md](../CLAUDE.md)** (build reference / design system),
> **[nav-catalog-rooms-submenu.md](./nav-catalog-rooms-submenu.md)** (how the
> client wires the Catalog → rooms menu), **[theme-and-version-control.md](./theme-and-version-control.md)**
> (the Dawn/Feather background story).

---

## 0. Current state (live)

| Thing | Value |
| ----- | ----- |
| **Store** | `cu5fjv-v2.myshopify.com` |
| **Live theme** | **House of Clarence** — id `203201216843` (published) |
| **Rollback theme** | **Feather** — id `202445717835` (unpublished; the old live site) |
| **Repo** | `git@github.com:TMDB-GIT/HOC.git`, default branch **`main`** |
| **Deploy method** | **Shopify CLI** (`shopify theme push` / `publish`). _Not_ the Shopify↔GitHub auto-sync integration. |

The theme code is in `house-of-clarence/` (this folder). The live site is whatever
theme is **Published** in Shopify — today, House of Clarence.

---

## 1. The mental model: two separate worlds

A Shopify storefront is **two things that live in two different places**:

```
┌────────────────────────────────────────────────────────────┐
│  STORE DATA  — lives ONLY in Shopify's database (the Admin) │
│  • Products, prices, variants, product images              │
│  • Collections                                             │
│  • Navigation menus (incl. Catalog → rooms)                │
│  • Metafield VALUES (material, finish, room, …)            │
│  • Pages, blog posts, customers, orders, discounts         │
│  → NEVER in this repo. The client manages these in Admin.  │
├────────────────────────────────────────────────────────────┤
│  THEME  — the presentation layer (this Git repo)           │
│  • Liquid templates, sections, snippets                    │
│  • CSS / JS / fonts / icons (assets)                       │
│  • Locales (translations), metafield DEFINITIONS in schema │
│  • Theme settings & section content (the JSON config)      │
│  → THIS is what Git version-controls and what we deploy.   │
└────────────────────────────────────────────────────────────┘
```

The live page asks Shopify for the data at render time. That's why the preview
shows real products even though no product data exists in these files.

---

## 2. ⭐ "If I change things in the Shopify Admin, do they come back into this repo?"

**Short answer: No — not automatically.** This repo is deployed with the Shopify
CLI, and there is **no two-way GitHub sync** connected. So nothing you do in the
Admin writes back to Git on its own. Whether a change even *could* belong in the
repo depends on what kind of change it is:

| What you change in Admin | Where it lives | In this repo? | Notes |
| ------------------------ | -------------- | ------------- | ----- |
| Products, prices, variants, images | Store data | ❌ Never | Pure catalogue work — totally safe, untouched by deploys. |
| Collections | Store data | ❌ Never | |
| **Navigation menus** (Catalog → rooms) | Store data | ❌ Never | Set in **Online Store → Navigation**. |
| Metafield **values** | Store data | ❌ Never | |
| Pages / blog posts | Store data | ❌ Never | |
| **Theme editor** edits to the live theme (logo, colours, section text/order) — i.e. `config/settings_data.json` | On the **live theme in Shopify** | ⚠️ Not unless someone pulls it | Lives on the Shopify theme, **not** in Git. To capture it you must run `shopify theme pull` (see §8). |

**What this means for your plan** (“client works on the catalogue and stuff”):

> ✅ The client managing **products, collections, and the navigation menu** in the
> Admin is the safe zone. None of it is in the repo, none of it conflicts with
> code deploys, and re-deploying the theme will **not** wipe it.

The **only** thing that can drift between Shopify and Git is **theme-editor
customisation** (the `settings_data.json` file — logo, colour tweaks, the text you
type into sections in *Customize*). See §8 for how to keep that in sync.

---

## 3. Who does what (roles)

| Role | Works in | Owns | Must NOT |
| ---- | -------- | ---- | -------- |
| **Client / merchant** | Shopify **Admin** | Catalogue (products, collections), navigation menus, page/blog content, day-to-day merchandising | Edit theme **code**; restructure the theme in *Customize* if a dev is mid-deploy (coordinate first — see §8) |
| **Developer** | This **Git repo** + Shopify CLI | All theme code (Liquid/CSS/JS/sections/snippets), releases, publishing | Hand-edit store data; push untested code straight to the live theme |

The two lanes rarely collide because they touch different things (code vs data).

---

## 4. Repository layout (orientation)

See **[CLAUDE.md](../CLAUDE.md)** for the full map. The essentials:

```
house-of-clarence/
  assets/        hoc-*.css / hoc-*.js  — House of Clarence styles & behaviour
  sections/      editable building blocks (hoc-header, collection-tiles, …)
  snippets/      reusable partials (product-card, hoc-icon, …)
  templates/     *.json page compositions (index, collection, product, …)
  layout/        theme.liquid (global shell)
  config/        settings_schema.json (editor controls) + settings_data.json (saved values)
  locales/       translations (UI is en-GB)
  docs/          ← you are here
```

---

## 5. Developer onboarding (first-time setup)

1. **Install tools:** [Shopify CLI](https://shopify.dev/docs/themes/tools/cli), Node, Git.
2. **Clone:** `git clone git@github.com:TMDB-GIT/HOC.git && cd HOC/house-of-clarence`
3. **Log in to the store:** `shopify theme dev --store cu5fjv-v2.myshopify.com`
   (opens a browser to authenticate; creates a temporary preview theme).
4. **Local dev server with hot reload:** `shopify theme dev` — edit files, see
   changes instantly at the printed `http://127.0.0.1:9292` URL. This preview
   pulls **real store data**, so it looks like the live site.
5. **Before committing:** `shopify theme check` (lint) and
   `npx prettier --write .` (format).

---

## 6. Day-to-day: making a change (the workflow)

Always work on a branch and ship through a PR — never commit straight to `main`.

```sh
git checkout main && git pull
git checkout -b feature/<short-name>      # e.g. feature/pdp-gallery-zoom

# …edit code…
shopify theme dev                          # preview locally
shopify theme check                        # lint (fix errors)
npx prettier --write .                     # format

git add -A && git commit -m "Describe the change"
git push -u origin feature/<short-name>
gh pr create --fill                        # open a PR for review
```

After review, **merge the PR into `main`**. `main` is the source of truth for code
and the thing we deploy.

---

## 7. Releasing / publishing (the safe path)

We use a **push-unpublished → preview → publish** flow so the live site never
changes until you've eyeballed it.

```sh
git checkout main && git pull              # release exactly what's on main

# 1) Upload main to a NEW unpublished theme (customers see nothing yet)
shopify theme push --unpublished -t "House of Clarence YYYY-MM-DD" --json
#    → returns the new theme id + preview_url

# 2) Preview that theme id, click around (desktop + mobile)

# 3) Go live — makes it the published storefront
shopify theme publish -t <new-theme-id> --force
```

**Rollback** (instant): publish the previous theme.

```sh
shopify theme list                         # find the prior theme's id
shopify theme publish -t 202445717835 --force   # 202445717835 = Feather (old live)
```

> Tip: keep the previous live theme around (unpublished) after each release as a
> one-click rollback. Don’t delete it until the new release is proven.

### Updating the existing live theme in place (alternative)

If you prefer to update the current live theme rather than swap to a new one, push
to its id **but preserve merchant theme-editor settings** (see §8):

```sh
shopify theme push -t 203201216843 --allow-live -x config/settings_data.json
```

The push-to-new-theme flow above is safer and is the recommended default.

---

## 8. Keeping the repo and the live theme in sync (the one trap)

The only file that can drift is **`config/settings_data.json`** — it holds whatever
is set in Shopify *Customize* (logo, colours, the text typed into sections, section
order). Two doors can write it: a developer (via Git) and the client (via the
theme editor). If you ignore this, a deploy can silently overwrite the client's
editor tweaks, or a `theme pull` can overwrite the repo.

**Rules that prevent pain:**

1. **Decide the source of truth for theme settings.** Simplest for this project:
   the **repo** is canonical for code; if the client makes editor changes you want
   to keep, *pull them into Git* before the next deploy:
   ```sh
   shopify theme pull -t 203201216843 --only config/settings_data.json --only templates
   git add -A && git commit -m "Sync live theme settings from Admin"
   ```
2. **When updating the live theme in place, exclude settings** so you don't clobber
   the client: `-x config/settings_data.json` (shown in §7).
3. **Prefer the push-to-new-theme release flow** — it sidesteps most of this; just
   remember a brand-new theme starts from the repo's `settings_data.json`, so set
   the baseline (logo etc.) there or re-apply in *Customize* after publishing.
4. **Store data (products/collections/menus) is never affected by any of this.**

---

## 9. Optional: connect Git to Shopify for auto-deploy

Shopify can link a repo+branch to a theme so pushes to that branch auto-update it
(**Admin → Online Store → Themes → Add theme → Connect from GitHub**). Tradeoffs:

- ➕ Push to `main` ⇒ the connected theme updates automatically (no CLI step).
- ➖ It's **two-way**: editing that theme in *Customize* commits changes **back** to
  the branch as `shopify[bot]`, which can surprise you and cause merge conflicts.
- ➖ Easy to accidentally connect it to the **live** theme and ship instantly.

We are **not** using this today (we deploy via CLI). If you adopt it, connect it to
a **staging** theme, keep publishing a manual gate, and brief the client not to
restructure that theme in *Customize*.

---

## 10. Command cheat sheet

```sh
shopify theme dev                       # local hot-reload preview (uses real store data)
shopify theme check                     # lint / theme-check
shopify theme list                      # all themes + which is live
shopify theme push --unpublished -t "NAME"   # upload to a new unpublished theme
shopify theme push -t <id> --allow-live -x config/settings_data.json  # update live, keep settings
shopify theme publish -t <id> --force   # make a theme the live storefront
shopify theme pull -t <id> --only config/settings_data.json          # bring editor settings into Git
npx prettier --write .                  # format Liquid/CSS/JS

git checkout -b feature/x   →   commit   →   git push   →   gh pr create --fill   →   merge to main
```

---

## 11. Golden rules

1. **Code flows through Git → `main` → a reviewed release.** Don't hand-edit the live theme's code.
2. **Store data (catalogue, collections, menus) stays in the Admin.** It's never in the repo and deploys can't harm it.
3. **Only `settings_data.json` can drift** — handle it per §8.
4. **Always preview an unpublished theme before publishing.**
5. **Keep the previous live theme as a rollback** until the new one is proven.
6. **British English, “never cheap, never loud”** — see CLAUDE.md before shipping UI copy.

---

## 12. Onboarding checklists

**New developer**
- [ ] Shopify CLI + Node + Git installed
- [ ] `git clone` the repo; `cd house-of-clarence`
- [ ] `shopify theme dev --store cu5fjv-v2.myshopify.com` (authenticate once)
- [ ] Read CLAUDE.md (design system) + this doc (workflow)
- [ ] Make a trial change on a branch → PR → see it merge & deploy

**Client / merchant**
- [ ] Add products and group them into **collections** (e.g. one per room)
- [ ] Build **Online Store → Navigation → Main menu**: Catalog with the rooms
      nested under it (see [nav-catalog-rooms-submenu.md](./nav-catalog-rooms-submenu.md))
- [ ] Set logo, colours and section copy in **Online Store → Themes → Customize**
- [ ] Fill product **metafields** (material, finish, room, …) so specimen labels & filters work
- [ ] Tell the dev team if you make big *Customize* changes you want kept (so they
      pull them into Git before the next release — §8)
