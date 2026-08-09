---
title: Update log
description: OpenMMO's game updates, organised by protocol version.
---

Updates are organised around the **protocol version**, because the server
matches it exactly — when the protocol changes, older clients can't connect at
all. That axis answers two questions at once: what changed in the game, and
whether you need a new client.

## Categories

| Tag | Meaning |
|---|---|
| New system | A new gameplay mechanic |
| Balance | Changes to numbers, the economy, or drop rates |
| New items & assets | New weapons, armor, models, music |
| Fix | Bug fixes |
| Performance | Runtime efficiency and load times |
| Client | Desktop client only; nothing to do with the game server |

## Protocols v20–v22 — client v0.20.0 (current)

**The live server requires v22.** Older clients are refused. Three protocol
versions shipped back-to-back over two days (Aug 6–7), all on one theme:
**the music system**. Gameplay details in [Music & the bard](../guides/music/).

**New systems**

- **Music performance** (v20) — the new `/play_music [title]` emote: anyone
  with an instrument in their inventory can play. Titles match whole or as a
  fragment; leave it blank for a random tune. Everyone nearby hears it, and
  chat announces the title.
- **The listening experience** (v21) — background music makes way for a
  performance, and anyone walking up mid-song joins at the current position
  instead of from the start.
- **Tips, and items changing hands** (v22) — hand-offs between characters are
  now visible to everyone. Drop coins or trinkets at the bard's feet and she
  remembers they came from you.
- **The Bard class** — a new player-selectable class: d6 hit die, DEX +2,
  CHA +2, STR −2, CON −1, WIS −1, starting with a worn mandolin.
- **Signe, the resident bard NPC**, now busks in the town square — songs all
  day, requests between them, a campfire after dark, and yesterday's tips
  sold to Rica each morning. Her gilded mandolin is a **keepsake**: never in
  her browsable stock, sold only through a personal offer to a regular she
  has come to like.

**New items & assets**

- **Mandolin** (40 silver) and **Worn Mandolin** (unsellable) — the first two
  items in the new *instrument* category, with a dedicated model and the
  `/play_music` pose.

**Balance**

- **Scroll of Enchant Weapon** world drop rate 0.4% → **1%** (2026-08-05) —
  one expected per 100 kills.

## Protocol v19 — client v0.19.0

**New item**

- **Lembas Wafer** — elven waybread. 600 nutrition at only 0.15 kg for 60
  copper, which makes it **the most weight-efficient food in the game**
  (4,000 per kg against bread's 540) and the obvious choice for long trips.
  Rica now stocks it.

## Protocol v17 — client v0.18.0

An interim version. The server has already moved past it to v19, so this client
version can no longer connect either.

## Client updates (nothing to do with the game server)

**Client** ・ **Settings tabs reorganised** (from v0.18) — the old Automatic
play and Advanced tabs merged into **Agent**, Actions was renamed **Display**,
and a new **Audio** tab was added (BGM and sound effect volume).

**Client** ・ A **pause button** in the header. While paused the agent makes no
LLM calls, so it costs nothing — use it to take over by hand or to save money.

**Client** ・ Amounts now display as **1g = 100s = 10,000c** rather than one
long copper figure.

## Also shipped along the way

These landed between v17 and v22 without needing a protocol version of their
own, and are all included in the current server and client.

**Balance**

- **Provisions rebalanced** (2026-08-04). Bread becomes the "one meal a day"
  staple and jerky moves to the lightweight slot:

  | Food | Nutrition | Weight | Price |
  |---|---:|---:|---:|
  | Bread | 180 → **540** | 0.5 → **1 kg** | 8c → **20c** |
  | Jerky | 540 → **300** | 0.5 → **0.25 kg** | 40c → **30c** |
  | Cheese | 300 → **180** | 0.5 → **0.4 kg** | 20c → **12c** |
  | Apple | 60 (unchanged) | 0.3 kg | 3c |

  Full efficiency comparison in [Food and satiation](../database/food/).

**New systems**

- **HUD minimap** below the time widget (can be turned off), along with improved
  landmark and world-map markers.
- **Operator commands**: `/kick`, `/mute`, `/summon`, `/goto`.

**Fixes**

- One active session per account, enforced.
- Deletion refused for characters active in another session.
- Server-side player attack interval enforced.
- Game entry refused when dungeon chest history can't be loaded (fail-closed).
- Party positions are pushed by the server instead of polled per client — and no
  longer wake agents.

## Protocol v16 — client v0.17.0

**New systems**

- **Hunger and satiation**, implemented end to end. The character sheet gains a
  status tab for hunger effects, and the HUD shows satiation with a tooltip.
- **Campfires reworked** — replacing the procedural ones, with softened flames
  and better placement.
- Food can be **grilled** on a campfire (the `grillsInto` column in the item
  data).

**Balance**

- **Item economy rebalanced** across the board, with the weapon tier ladder laid
  out.
- Ambient monster spawns now **require a server allowance** rather than being
  decided client-side.
- Monster drops are **held server-side until the killing blow lands**, which
  stops sniping and duplication.

**New items & assets**

- `ring_of_protection`, with the cross-shield ring accessory model.
- The dagger gets its own model and icon.
- An ornate cross belt model and icon.

**Other**

- The world map records **dungeon entrances you have discovered.**
- Party invites show a **draining countdown gauge.**
- Worn torch particle rendering fixed.

## July 2026

### 7/17 — Google Sign-In

**New system** ・ Password login replaced entirely by Google Sign-In: the login
screen is a single Google button and the server verifies the ID token. The old
password path was retired for security.

New accounts get a random `player_xxxxxx` name, and **no email or profile name
is stored.**

### 7/16 — Off-hand shields, solid furniture blocks movement

**New items** ・ Wooden and Raven shields, each with a Guard stat that feeds into
combat and shows on the character sheet.

**New system** ・ Solid furniture now seals the tiles it occupies, so players and
NPCs walk **around** it rather than through it. The collision logic is shared
Rust, so the browser, bots and server all agree on which tiles are blocked.

### 7/14 — Dressing up Rica's shop

**Other** ・ A procedural "Rica's General Store" sign, the interior decorated
with item models placed as furniture, and stock updated to sell Healing Potions
and Scrolls of Return.

### 7/13 — Horizontal world wrapping

**Fix** ・ Completed the half-finished X-wrap, so the east and west edges
genuinely connect — no more fallback terrain or stuck map marker.

### 7/12 — Water shader rework

**Other** ・ Sea and river shaders rewritten and unified so the boundary blends
seamlessly, ocean wave motion improved, and splash effects added around river
obstacles like rocks and bridge posts.

## June 2026

### 6/30 — Quickslot bar

**New system** ・ A **10-slot quickslot bar** across the bottom of the screen.
Drag a bag item onto a slot to bind it (showing the icon and remaining count);
**double-click or press the slot's number key** (1–9, then 0) to use it —
equippables equip, consumables get used. Right-click clears it.

Bindings are keyed by item **definition**, not instance, so they survive a stack
being consumed and recreated, and persist per character in local storage. The
bottom HUD was reorganised at the same time: chat, quickslots and menu buttons
now share one row.

### 6/28 — Healing Potion

**New system** ・ The first drinkable consumable. Double-click a Healing Potion
in the bag and the server rolls **6d4** HP (NetHack dice), capped at max —
**a full-health or downed character keeps it instead of wasting it.** One is
consumed per drink and the health change broadcasts to nearby players.

**Other** ・ The item data's `damageDice` / `healDice` columns were folded into a
single `category` + `dice` pair, where `category` decides how `dice` is
interpreted (weapon → damage, healing potion → heal).

### 6/27 — Corridor doors

**Other** ・ Corridor mouths into rooms now get a click-to-open wooden double
door (the same leaves and stone arch as the surface entrance) instead of a bare
gap.

### 6/25 — Distinct corridor walls

**Other** ・ Dungeon corridors use a separate wall texture from rooms: rooms keep
the medieval stone blocks, corridors get rock, and wall runs break where the
texture flips. **Useful for telling whether you're in a corridor or a room.**

### 6/20 — Dungeon click pathing

**Fix** ・ Fixed a dungeon entrance-stair click bug where clicking the red-marked
floor area in a room routed the player back outside. The culprit was the hidden
surface entrance building: Three.js raycasts **still hit invisible objects**, so
its walls and roof were intercepting underground floor clicks.

### 6/18 — Breakable props, interactive chests and coin pickups

**New system** ・ Barrels and crates are **breakable** — click one and your
character walks up and swings once, and the whole model swaps to its
broken-debris variant at the contact frame (chests stay intact).
Server-authoritative, and the smashed cell becomes walkable.

**New system** ・ Dungeon chests are **interactive** — clicking one walks the
player up and swings the lid open. Opening spawns a real coin pile ground item
in front of the chest; picking it up credits **1–10 copper straight to the
wallet** instead of taking a bag slot.

### 6/17 — Stair passability

**Fix** ・ Blocked passability flags so current-floor monsters can't enter the
high side of the stairs — they were marching up the shaft and clipping through
the floor above.

### 6/15 — Torch shadow artifacts

**Fix** ・ Fixed dungeon torch-light shadow glitches. The key detail: three.js
records the shadow map from the **backface** by default, which self-biases
against acne but makes contact shadows peter-pan. Fixed with a 0.02 m contact
lift plus a larger shadow map and smaller bias.

### 6/14 — Procedural dungeons

**New system** ・ **Seed-deterministic**, NetHack-style maze dungeons, fixed per
entrance and up to 20 floors. Surface entrances reuse the housing procedural
geometry as a stone building, with terrain holed out to expose the stairs.
**The final floor holds a boss with loot.**

### 6/11 — Economy phase 2: LLM haggling

**New system** ・ Rica's LLM can grant **per-player** price deals via a new
`offer_deal` action. The server clamps offers to a CHA-derived price band,
enforces daily budgets and cooldowns, logs every decision, and the trade window
shows the haggled price.

The CHA-linked band runs roughly ±5–25 percentage points, with a 1 gold per game
day merchant budget, 40 silver per player, a 30-second cooldown, and deals that
are **single-use and expire after 5 minutes.**

### 6/10 — Goblin, player control FSM, economy phase 1

**New monster** ・ The Goblin.

**New system** ・ Player control converted to an explicit finite state machine.

**New system** ・ Single-currency gold and fixed-price merchant trading with Rica
(base price data, trade protocol, server validation, trade window UI).

### 6/08 — Kobold, Small Sword

**New monster** ・ The Kobold.

**New item** ・ The Small Sword.

The 2D → 3D asset workflow was documented at the same time.

:::note[Sources]
This page is compiled from the upstream
[devlog](https://github.com/OpenMMO-Agent-UI/OpenMMO/blob/master/doc/devlog/README.md),
in-game announcements, and the git history. The devlog sometimes lags the actual
commits by weeks, so the most recent sections come straight from git.
:::
