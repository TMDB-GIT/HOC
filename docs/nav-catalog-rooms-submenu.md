# Adding the room sub-menu under “Catalog”

This guide is for the shop owner / staff. **No code or developer needed.** You do
everything in the Shopify admin, in plain English. It takes about five minutes.

## What you’re building

In the top navigation, the **Catalog** item gets a small drop-down. Hovering (or
tapping on mobile) reveals a list of rooms — Bathroom, Kitchen, Living, Lighting.
Clicking a room takes the visitor to the homepage **“Shop by room”** section and
slides it straight to that room.

```
Catalog ▾
 ├ Bathroom
 ├ Kitchen
 ├ Living
 └ Lighting
```

The theme already knows how to display a drop-down and how to glide to the right
room. **All you do is add the room links to the menu in the admin.** Add or
remove rooms here any time — the navigation follows automatically.

---

## Step 1 — Open the navigation editor

1. In your Shopify admin, go to **Online Store → Navigation**.
   (Left sidebar. If you don’t see “Online Store”, ask whoever has the
   *Themes / Navigation* permission.)
2. Click the menu named **Main menu** — this is the one the header uses.

You’ll see the current items, e.g. *Home*, *Catalog*, etc.

> If there is **no “Catalog” item** yet, add one first: click **Add menu item**,
> Name it `Catalog`, set the link to **Collections** (your “all products” page),
> and **Save**. Then carry on below.

## Step 2 — Add the first room as a sub-item

1. Click **Add menu item**.
2. **Name:** type the room name exactly as you want it shown, e.g. `Bathroom`.
3. **Link:** this is the important bit. Don’t pick from the suggestions — instead
   **type this in by hand** and press Enter:

   ```
   /#room-bathroom
   ```

   (Leading slash, then `#room-`, then the room name in lowercase.)
4. Click **Add**.

## Step 3 — Make it a sub-item of Catalog (nesting)

A new item is added at the bottom of the list. To turn it into a sub-item:

- **Drag** the `Bathroom` item by the ⠿ handle on its right, and drop it
  **slightly to the right, just underneath `Catalog`.** When it’s nested it
  shifts inward and shows a little indent.

That indent is what makes it appear inside the Catalog drop-down.

## Step 4 — Repeat for the other rooms

Add one item per room, the same way, nesting each one under **Catalog**:

| Room name (what you type as the Name) | Link (type this exactly into the Link box) |
| ------------------------------------- | ------------------------------------------ |
| Bathroom                              | `/#room-bathroom`                          |
| Kitchen                               | `/#room-kitchen`                           |
| Living                                | `/#room-living`                            |
| Lighting                              | `/#room-lighting`                          |

## Step 5 — Save

Click **Save menu** (top right). Open your storefront, hover **Catalog**, and the
rooms appear. Click one — it should land on the homepage and slide “Shop by room”
to that room.

---

## The one rule for the Link box

The link is always:

```
/#room-<the room’s handle>
```

The **handle** is just the room’s name in lowercase, with spaces turned into
hyphens and the `&` dropped. The theme builds it from each room tile on the
homepage. Examples:

| Room on the homepage | Handle              | Link to use                 |
| -------------------- | ------------------- | --------------------------- |
| Bathroom             | `bathroom`          | `/#room-bathroom`           |
| Kitchen              | `kitchen`           | `/#room-kitchen`            |
| Tiles & Surfaces     | `tiles-surfaces`    | `/#room-tiles-surfaces`     |

> **If a room tile is linked to a Shopify collection**, the handle is the
> *collection’s* handle instead of the name. You can see a collection’s handle in
> **Products → Collections →** (open the collection) **→** scroll to **Search
> engine listing → Edit →** the “URL handle” field. Use that value after
> `/#room-`. When in doubt, match it to the room exactly as it’s set up on the
> homepage “Shop by room” section.

---

## Tips & troubleshooting

- **The drop-down doesn’t appear.** Make sure the room items are *nested under*
  Catalog (indented), not sitting at the top level. Re-save the menu.
- **Clicking a room goes to the homepage but doesn’t move to the room.** Check the
  link is typed exactly, including the `#`, e.g. `/#room-kitchen` (no capital
  letters, no spaces). The part after `room-` must match the room’s handle.
- **You renamed a room.** The *Name* (what shows in the menu) can be anything. Only
  the *handle* in the link must match the room on the homepage. If you change a
  room’s name on the homepage and it isn’t tied to a collection, its handle
  changes too — update the link to match.
- **Mobile.** On phones the menu is the slide-out drawer; Catalog becomes an
  accordion — tap it to expand the rooms. The links work the same way.
- **Other menus.** This works for *any* menu item with sub-items, not just
  Catalog — nest sub-items under any top-level item and the theme shows a
  drop-down. Only items linking to `/#room-…` glide to a room; everything else
  behaves like a normal link.
