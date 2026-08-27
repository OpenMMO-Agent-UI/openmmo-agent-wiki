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

## Protocol v38 — client not yet released (current)

**The live server now requires v38.** Older clients are refused.

**New systems**

- **A banned-name list, so an already-created character that later lands
  on it is forced to rename at login** (2026-08-26) — new characters and
  renames already went through a format check and a case-insensitive
  duplicate check; they now also have to clear a `banned_names.txt` list
  loaded when the server starts (exact match only, trimmed and
  case-folded, no substring matching). A character that existed before its
  name was added to the list gets refused at its next entry attempt with
  `CharacterRenameRequired` (it does not enter the game), the
  character-select screen opens a rename prompt, and once the new name
  clears the same check the server replies `CharacterRenamed` and the
  client retries entry automatically. Friend block lists carry the new
  name across in the same transaction. Server-run NPC accounts (the
  `npc_` prefix) are exempt.

## Protocol v37 — client v0.34.1

**New systems**

- **Ambient monsters now spawn from movement instead of a standing clock**
  (2026-08-23) — the old system unconditionally handed every player 3 spawn
  allowances every 10 seconds (a theoretical cap of 1,080/hour), making
  standing still the most efficient way to hunt — logs showed one player
  racking up 20,817 kills in 23 hours from a single spot. The new rule drops
  allowances entirely: the server now rolls a chance on every movement tick
  based on distance travelled (8% per metre moved, ~81% cumulative over
  20m), placing the spawn in a ±30° cone around the direction you're facing,
  20m outside the screen edge, so the monster walks in from off-screen. A
  candidate only spawns if it lands on walkable ground (grass, no steep
  slopes or water) and can actually walk the line back to you. The live cap
  stays at 8 (corpses don't count). The server now fully owns spawn timing
  and placement — `SpawnMonsterRequest`, which let the client request a
  spawn, and `NoSpawnZones`, which only that request used, are both gone
  from the protocol, so third-party clients no longer have to reimplement
  spawn placement themselves. Older clients are refused and need a fresh
  download.
- **New monsters: Cyclop and Lizardfolk** (2026-08-25) — the Cyclop is level
  15, Guard 20, wields a greatclub for 3d8 damage, and spawns on dungeon
  floors 14–20; the Lizardfolk is level 13, Guard 15, wields a Steel
  Longsword, and spawns on floors 12–20. Both are aggressive.
- **Monster AI now runs entirely on the server** (2026-08-25) — monster
  movement and attack decisions used to run on whichever player's client
  owned that monster; now they run uniformly on the server, so other players
  no longer see a monster's position drift out of sync with someone else's
  network latency. This also fixed monsters getting stuck dragging in place
  at doors and walls, and added queueing so multiple monsters in a dungeon
  corridor no longer pile up on top of each other.

**Balance**

- **Spawn cone and chance retuned — encounters up sharply** (2026-08-24) —
  spawn candidates used to be drawn uniformly across the whole screen edge;
  measurements showed nearly 70% of monsters placed more than 30° off your
  heading despawned again before you noticed them. Narrowing candidates to a
  ±30° cone around your heading raised the encounter rate from 31% to 67%
  over the same distance, and the roll itself went from an initial 4% up to
  8%.
- **Corpses now linger twice as long** (2026-08-24) — 30 seconds up to 60
  before they're cleared.
- **Some monsters now have a chance to drop bonus food on a kill**
  (2026-08-24) — rolled independently of the weapon drop, at low odds (mostly
  1%, 5% for the Goblin Chief). Kobolds, Goblins, Orcs and Female Orcs,
  Hobgoblins, and the Goblin Chief currently carry a bonus drop — see
  [Monsters](../../database/monsters/#bonus-drops).
- **Bread and Lembas Wafer got pricier, and eating at full satiation is now
  refused** (2026-08-24) — Bread went from 20 to 60 coins, Lembas Wafer from
  60 to 120. Eating while already at the 1000 satiation cap is now refused
  outright and doesn't consume the item; the HP a meal heals now scales with
  the satiation it actually added rather than the food's full nutrition
  value, so topping off a nearly-full stomach heals proportionally less.

**Fix**

- **Dungeon stairs occasionally refused a floor change and snapped you back
  to the old floor (including boss-room doors that wouldn't open) — fixed**
  (2026-08-23) — a stair shaft's ramp is shared geometry between the two
  floors it connects, so both floors compute the identical Y there, and
  climbing the ramp necessarily strays from either floor's flat-ground
  height. Requiring the reported Y to match the target floor meant the
  transition could fail partway up. The floor is now derived straight from
  which stairway you walked, with Y no longer used as a rejection check.
- **Monsters at the edge of loaded terrain occasionally twitched in place or
  snapped back to their starting point — fixed** (2026-08-23) — a monster
  walking just past the edge of streamed terrain had its move report held by
  its owning client; once terrain caught up, the resulting jump could exceed
  the server's per-move distance budget and get rejected — 232 rejections in
  four hours, affecting 206 monsters. The server now warms an extra ring of
  heightmap data ahead of time to absorb that gap.
- **Rapid emote clicks could misfire as a stop — fixed** (2026-08-23) — the
  play/stop toggle used to judge clicks against the server-confirmed active
  animation, which lags a round trip behind, so clicking fast could turn a
  play into a stop for the dance you'd just commanded. Clicks are now judged
  against your own last-commanded intent instead, falling back to the
  server's echo once it confirms or a timeout assumes the command was
  rejected.
- **Monsters killed before a floor re-entry no longer stand back up — fixed**
  (2026-08-25) — a monster that was already dead now spawns straight into its
  corpse state when you re-enter the floor.
- **Clicking the wall beside a down staircase occasionally failed to walk you
  down — fixed** (2026-08-25) — the side wall that hides a descending shaft
  from the isometric camera now correctly registers as "go down the stairs"
  when the click lands just outside the shaft's footprint and below the
  current floor's walking surface.

**Performance**

- **Area of interest (AOI) narrowed from 43m to 32m** (2026-08-23) —
  recalculated from what the isometric camera actually shows on screen, this
  cuts the monsters and objects a single player needs synced by roughly 45%.

**Client**

- **Every miss now whooshes, not just your own** (2026-08-24) — other
  players' and monsters' missed swings now play a whoosh keyed to the
  attacker's weapon material, same as your own misses already did.
- **Small ground items are easier to click** (2026-08-24) — the pickup
  hotspot now has a 0.25m minimum radius so slim models like the Healing
  Potion catch nearby clicks; the Healing Potion's ground model is also 1.5×
  larger and easier to notice.
- **Emote panel gained a hover preview, and it now opens beside the social
  button that summons it** (2026-08-23 – 2026-08-26) — hovering an emote row
  shows a small preview of your character actually performing it beside the
  panel; the preview is off by default on low graphics presets and mobile to
  save performance.
- **Default SFX volume lowered to 50%** (2026-08-25).
- **The death cry now plays at the killing blow** (2026-08-25) — instead of
  waiting for the monster's attack-animation impact delay.

## Protocol v35–v36 — client not yet released

**New systems**

- **Dungeon bosses now respawn once a day at sunset, and the chest goes only
  to whoever felled it** (v35, 2026-08-21) — a dead boss no longer runs a
  fixed 30-minute respawn timer; its slot is held until the next sunset
  dungeon reset revives it. The reset teleports everyone in the dungeon back
  to its entrance and plays a roar in the distance. Only characters standing
  within 20m of the boss when it fell may open the chest it drops. Previously
  the last player leaving a floor would accidentally reset the boss's
  respawn clock too, letting it be refought within two minutes. Full rules in
  [Dungeons](../database/dungeons/#bosses).
- **New monster: Stone Golem** (2026-08-21) — level 10, Guard 17, unarmed
  attack (2d10), stone material, spawns on dungeon floors 11–20; also
  appears in the world past 630m from town, following the existing
  "distance = (level − 1) × 70m" rule.
- **Monsters now attack anyone who gets close, not just provoked targets**
  (2026-08-22) — both "attacks on sight" and "fights back only" monsters now
  attack the instant a player is within 5m, no provocation needed;
  previously a "fights back only" monster had to be hit first, and an
  "attacks on sight" one still needed a target acquired at range.
- **An emote panel and social menu make emotes discoverable outside chat**
  (2026-08-22) — emotes used to be reachable only via `/emote` commands;
  press G to open a panel of every emote, click to perform one, with looping
  dances marked and stoppable by clicking again. The social button now opens
  a flyout with Friends (F) and Emotes (G). `/emote` and its plain-text
  emote list still work as before.

**Balance**

- **Iron Sword's world drop chance halved** (2026-08-21) — from 1% to 0.5%;
  the Orc Warlord's guaranteed drop is unaffected.
- **Ambient monster cap raised again, and the field refills faster**
  (2026-08-22) — the per-player cap went from 6 to 8, and corpses no longer
  count against it (only live monsters do). When the field is under the cap,
  the server now offers up to three spawns per player per tick instead of
  one, so an emptied area fills back in noticeably faster.
- **Combat chase now runs at sprint speed** (2026-08-22) — moving while in
  combat automatically uses sprint speed, at the same satiation cost as a
  normal sprint, so a fleeing monster can no longer outrun you.

**New items & assets**

- **Greater Healing Potion** (2026-08-22) — 1g 500s, sold by Rica,
  consumable, heals 12d4 — twice the regular Healing Potion's 6d4.

**Fix**

- Monsters at dungeon and world-floor boundaries could occasionally get
  stuck twitching in place, or snap back to where they started — caused by
  the client reporting a height the server treated as stale whenever the
  terrain data for that tile hadn't streamed in yet, rejecting the move
  (2026-08-22).

**Client**

- **XP gain animation now rides the kill** (v36, 2026-08-21) — XP from a kill
  no longer applies instantly; the level badge waits until that monster
  actually goes down before sending a spark along the gauge to the new total,
  which bursts into a sparkle. A kill with no visible fall (despawn, out of
  range) still applies after a 2-second fallback.
- **Roar sound effect added on dungeon reset** (2026-08-21) — you hear a
  distant roar when sunset puts you out of a dungeon.
- **Repeated interaction animations now replay correctly** (2026-08-21) — the
  same interaction repeating (dancing twice in a row, or switching from
  dancing to clapping) used to be ignored; it now correctly switches to the
  new clip. Back-to-back pickups (e.g. while fishing) no longer drop a
  callback either.
- **Monsters get a death cry, players cry out in pain, and hits now make you
  flinch** (2026-08-22) — the death sound plays on the killing blow's impact
  frame rather than when the corpse lands; players cry out by gender when a
  hit actually lands, one at a time so it doesn't stutter; getting hit also
  plays a flinch reaction.
- **Dungeon floor and HP added to the HUD** (2026-08-22) — the sky widget
  shows your current floor while underground, and the level badge's tooltip
  gained an HP line.
- **Signs, stalls, and dungeon chests get hover names too** (2026-08-22) —
  same name label and gold target ring monsters and ground items already
  get; beds, barrels, and crates stay unlabeled on purpose.
- **Buying from a merchant now defaults to 10 units** (2026-08-22) — the
  quantity popup used to default to as much as your purse could afford; now
  it defaults to 10 (still capped by your gold or the merchant's stock).

## Protocol v33–v34 — client not yet released

**New systems**

- **Cape dyeing** (v33, 2026-08-18) — using a Cape Dye bottle dyes your
  equipped cape any colour you pick, with a live preview and nothing spent
  until you confirm; you can re-dye as many times as you like. The result
  rides the cape's item instance, and nearby players and the character
  select screen see the same colour you do. Full rules in
  [Cape Dyeing & Printing](../guides/cape/).
- **Cape printing** (v34, 2026-08-18) — using a Cape Transfer Kit uploads a
  picture that the server re-encodes and content-hashes for dedup, then
  prints onto your cape over the dyed colour, showing through wherever the
  print is transparent. Right-click a player to report their print; an admin
  blocking a hash reverts every cape using it back to its dye colour
  immediately. Full rules in [Cape Dyeing & Printing](../guides/cape/).
- **Opening a chest sends you back to town** (2026-08-19) — actually opening
  a treasure chest (re-clicking an emptied one doesn't count) starts a
  60-second timer; if you're still in the dungeon when it fires you're
  teleported to the spawn point with a warning message first. Logging out
  during that window banks the return immediately. The point is to stop
  parking a character on the deepest floor and only logging in each refill
  to loot it.
- **Enchanting now needs Whetstone Oil** (2026-08-20) — reading an enchant
  scroll now also spends one bottle of Whetstone Oil; without one the read
  is refused and the scroll isn't consumed. The oil has no other use — it's
  purely a gold sink on enchanting. Full rules in
  [Enchanting](../guides/enchant/).
- **A merchant's deal is now said out loud, and merchants may offer one
  unasked** (2026-08-21) — once a haggled price is granted, the merchant
  now announces it in a chat message too (the discount or markup, what it's
  for, how long it lasts) instead of showing only inside the trade window;
  merchants will also occasionally lead with a discount of their own,
  without you haggling first.

**Balance**

- **Ambient monster cap raised back up** (2026-08-19) — the per-player
  monster cap went from **4** back to **6**; on screen that reads as about
  four alive at once. The one-type-per-tick pacing and the dungeons' spawn
  rules are unchanged.
- **Hit chance now follows where you fight, not just what you fight**
  (2026-08-20) — monsters gain an extra to-hit bonus based on dungeon depth
  or distance from town (dungeons: +3 per floor past depth 5; the surface:
  +1 per 20m past 300m from town), so deep floors and remote wilderness get
  meaningfully more dangerous while the 300m ring around town and Old
  Crypt's first 5 floors keep their current difficulty. Monster level, HP,
  damage, and XP are all unchanged. Full rules in
  [Combat](../guides/combat/).
- **Ambient monster variety now follows distance from town, not player
  level** (2026-08-20) — each level's monster type now needs another 70m
  from town to appear (Goblin 70m, Orc 210m, Hobgoblin 280m, Gnoll 350m,
  Bugbear 420m, Ogre 490m, Troll 560m), instead of unlocking everywhere the
  moment you reach the level. The area right around town now stays low-level
  monsters with correspondingly low XP and drops.
- **Hobgoblins now carry a Notched Iron Sword** (2026-08-20) — their old
  drop, the Iron Sword, is replaced by the new Notched Iron Sword: same 1d8
  damage, but its sell price drops from 10,000c to 2,500c.
- **Enchant scroll world drops halved on low-level kills** (2026-08-20) —
  for kills at effective level (depth-adjusted) 8 or below, both enchant
  scrolls' world drop chance drops from 1% to 0.5%; chests and barrels/crates
  have no level and are unaffected.

**New items & assets**

- **Cape Dye** (2026-08-18) — 800c, sold by Rica, a consumable.
- **Cape Transfer Kit** (2026-08-18) — 5,000c, sold by Rica, a consumable.
- **Phoenix Talisman** (2026-08-20) — 5,000c, sold by Rica, and also a 0.2%
  world drop. The death dialog gains a use option that revives you in place,
  on the same floor, restoring 70% of max HP and spending one talisman; the
  death XP penalty already applied is unaffected, and there's no
  invulnerability window afterward. Full rules in
  [Combat](../guides/combat/).
- **Whetstone Oil** (2026-08-20) — 1g, sold by Rica, a consumable. Reading an
  enchant scroll spends one bottle alongside the scroll; see "Enchanting now
  needs Whetstone Oil" above.
- **Notched Iron Sword** (2026-08-20) — the sword Hobgoblins carry, 1d8,
  sells for 2,500c, not sold by merchants.

**Fixes**

- Dungeon corridors no longer generate hugging a room wall, which used to
  tear the wall open into absurdly wide doors (up to 17 cells); a floor that
  fails the check gets redrawn within the existing 30-attempt retry loop,
  same as other generation rules (2026-08-20).
- Dungeon floors now change only via a stairwell shaft, validated against
  your actual movement path server-side; previously reporting a height
  within tolerance could make the server judge you against the wrong
  floor's grid — usually uncarved rock — letting you walk through a boss
  door and every wall on the floor you actually stood on (2026-08-19).
- House storeys are now determined by the server from your stairwell path
  instead of trusting the height your client reports; previously reporting
  a height matching the storey above let the server check that storey's
  (usually wall-free) rooms, letting you walk through every wall of the
  storey you were actually standing on (2026-08-19).
- Fixed dungeon monsters sometimes walking partway, vanishing, and
  restarting from where they began — caused by two players entering the
  same floor and both adopting the same idle monster, where ownership
  didn't hand off cleanly; the losing client kept simulating the monster
  locally while the server kept snapping it back to its real position
  (2026-08-21).
- A build whose dungeon-layout generator no longer matches the server's is
  now refused at connect, the same way a protocol mismatch is — this
  usually means a stale client build. A connection stuck correcting against
  the same wall more than 10 times in a row is now disconnected by the
  server, and the web client reloads itself once to pick up a new build
  (2026-08-20).

**Client**

- **Character select preview re-equips on refresh** (2026-08-18) — the
  select screen now re-equips gear when the character list refreshes, so
  items dropped mid-session no longer linger on the preview.
- **Per-class cape collar tuning** (2026-08-18) — the collar bias and fade
  were retuned per model for the barbarians, knight, rogues, and valkyrie so
  the collar hugs the shoulders more closely.
- **Level badge on the HUD** (2026-08-19) — a 50px level badge sits by the
  hunger indicator in the top-left, its border a ring gauging progress to
  the next level, with a brief glow on XP gain and a reset-refill sweep on
  level-up. Click it to toggle the character panel; hover for exact XP.
- **Chest-open sound** (2026-08-19) — opening a dungeon chest now plays a
  lid-swing sound and a coin-spill sound.
- **Crate-break sound** (2026-08-19) — smashing a dungeon barrel or crate
  now plays a shatter sound.
- **Dropped shields lie face-up** (2026-08-19) — instead of standing
  half-buried in the ground.
- **Minimap and always-run now default on** (2026-08-18) — both settings
  used to default off; they now default on, and can still be turned off in
  settings, remembered per browser.
- **Hovering a dropped item shows its name** (2026-08-21) — styled like the
  player nametag, a notch smaller, with the enchant level folded into the
  name so +0 and +7 don't look alike at a glance.

## Protocol v31–v32 — client v0.29.0

**New systems**

- **Character select shows your geared character** (v32, 2026-08-18) — the
  select screen no longer shows a bare character; it now renders whatever
  you were wearing when you logged out — weapon, off-hand, cape, and a lit,
  glowing torch. Drag a character to spin it; drag the floor to spin
  whichever one is currently selected.
- **Capes are visible to everyone now** (v31, 2026-08-18) — wearing the Wool
  Cape lets nearby players see it sway as you walk, turn, and catch the wind
  — a live verlet-cloth simulation, no extra art needed. `/cape` and
  `/cape_depth` stay around for test-fitting a cape with nothing equipped.

**New items & assets**

- **Wool Cape** (2026-08-18) — a new back-slot item, 4,000c, +1 Guard, cloth
  material. Drops from Ogre Stronghold (T3) chests at a 37% roll.
- **Steel Longsword enters the drop pool** (2026-08-17) — steel_longsword
  (1d10, 16,000c) existed in the item data with no way to obtain it; it's
  now the Ogre Warlord's confirmed drop. The regular Ogre still carries a
  Greatclub.

**Balance**

- **Ambient monster density rework** (2026-08-18) — the per-player monster
  cap dropped from 30 to **4**, and the server now offers one monster type
  per tick instead of every eligible type at once, so the field fills in
  over roughly half a minute. What used to read as a dozen monsters
  standing around now settles at two or three. Dungeon spawn rules are
  unaffected — this only thins out the open field now that dungeons carry
  the dense fights.

## Protocol v30 — client not yet released

**New systems**

- **Player trading** (2026-08-16) — type `/trade <name>` in chat to send a
  trade request to a nearby player, using the same consent flow as `/party`
  (30 second TTL, up to 5 pending requests at once, anyone on `/block` is
  refused automatically); moving out of range during a trade cancels it
  outright. Each side has to **lock**, then **confirm** before anything
  moves, and changing the offer resets both sides' confirmations; an
  item's enchant level (like +7) is written directly into its name in the
  trade window so it can't be swapped unnoticed. Items placed on the table
  stay in your bag as soft-reserved — selling, dropping, using, or equipping
  them is refused until the trade ends or is cancelled — and a completed
  trade moves everything at once, written to the database immediately
  before either side is told it succeeded. Losing range, logging out, or
  dying cancels a trade; combat doesn't. Equipped items can't be placed on
  the table, the three starting weapons (Worn Iron Sword, Worn Torch, Worn
  Mandolin) can't be traded, and NPCs never take part. Full rules in
  [Player trading](../guides/trade/).
- **Merchant stalls became a trade entry point** (2026-08-16) — clicking
  someone else's laid-out stall opens a trade window with them directly, no
  invite needed; an NPC-owned stall still falls back to the normal shop
  flow. See [Shops & economy](../database/economy/#merchant-stalls-lay_stall).

**Fixes**

- Fixed the sealed-cell escape teleporting a player straight through solid
  rock in some dungeons — the check now reads the dungeon's actual wall
  layout instead of the passability cache; on Orc Warrens depth 9, 15 of
  its 26 sealed prop cells were being misread as open (2026-08-17).
- Fixed the sealed-cell rescue teleport sometimes getting undone a moment
  later by the next position correction, making the player look like they
  were never freed (2026-08-17).

## Protocol v29 — client not yet released

**New systems**

- **Debuff system** (2026-08-16) — a data-driven debuff framework
  (`data-src/debuffs.csv`) replaces the food-poisoning logic that used to be
  hardcoded. The same debuff never stacks — retriggering it just refreshes
  the duration — but different debuffs can be active together, and their
  multipliers multiply. Two exist so far:
  - **Bleeding** — a 35% chance on a hit from a gnoll's claws, lasting 8
    seconds at 1 damage per second and blocking HP regen; it can kill
    outright. The gnoll's damage die was lowered from 2d8 to 2d6 to make
    room for the new effect.
  - **Food Poisoning** — same numbers as before (70% chance on raw fish, 5
    minutes, ×0.6 move/attack/carry, ×4 satiation drain, blocks HP regen),
    just running through the new framework.

  Full rules in [Combat](../guides/combat/).
- **New monster: Bugbear** (2026-08-16) — level 7, Guard 14, carries a
  Morningstar, spawns on dungeon depths 8–20.
- **New monster: Ogre** (2026-08-16) — level 8, Guard 15, carries a
  Greatclub (2d8 damage), flesh rather than leather, spawns on dungeon
  depths 9–20.
- **Signe uses her own tip hat** (2026-08-16) — the town-square bard now
  sets down a busker's hat before she opens a set; coins dropped in it go
  straight to her wallet, and her schedule transitions pack up the stall
  and hat together automatically. Full rules in [Music](../guides/music/).
- **New monster: Troll** (2026-08-16) — level 9, Guard 16, claws (2d10
  damage) with a 35% chance to trigger Bleeding on hit, flesh, spawns on
  dungeon depths 10–20.
- **New dungeon: Ogre Stronghold** (2026-08-17) — 15 floors, its entrance
  in the plains northwest of Aldermark, farther out than Orc Warrens and
  clear of the road. The boss, the Ogre Warlord, is a guaranteed Greatclub
  drop; the chest guarantees Chain Mail, with Iron Gauntlets, Plate
  Greaves and Plate Boots each at 37% and a Gold Ring at 10%.

**Balance**

- **Deep monster pool caps** (2026-08-17) — the Stalker, Orc, Female Orc
  and Hobgoblin used to keep spawning all the way to dungeon depth 20. Each
  is now capped — at depths 11, 13, 12 and 15 respectively — so the deep
  monster pool tapers from eight species to four instead of dropping all at
  once. Orc Warrens' own spawn table (10 floors) is unaffected; the change
  only shows up on deeper floors such as Ogre Stronghold.

**New items & assets**

- **Morningstar, Greatclub** (2026-08-16) — the weapons the bugbear and
  ogre carry: Morningstar deals 1d8 (6,000 copper), Greatclub deals 1d8
  (600 copper). Neither is sold by merchants — the only source is drops.

**Fixes**

- Fixed the death animation index drifting out of sync with the animation
  name list — death played the attack clip instead of the dying clip, and
  the respawn dialog never opened (2026-08-16).
- Fixed a player getting permanently stuck if a dungeon restart sealed them
  inside a cell surrounded on all four sides by broken props or open doors
  — a dungeon's broken-prop and door state only lives at runtime, so a
  restart makes it solid again around whoever logged out standing there. A
  blocked move now checks whether the cell is sealed on all sides and, if
  so, relocates the player to an open neighbour before the correction is
  applied (2026-08-17).

**Client**

- **Text selection is now opt-in** (2026-08-16) — dragging over the
  inventory, character panel, or HUD text used to trigger the browser's
  text selection by accident. Now only text inputs, the chat transcript,
  announcement bodies, and login error messages allow it.

## Protocol v28 — client not yet released

**Protocol bumped to v28** — the client is still waiting on a repackage, and
older clients will be refused once the live server switches over. The same
day (Aug 13) also carried two item changes that didn't need the protocol
bump: the Silver Necklace got an effect and its own model, and the Coin Pile
got its own icon.

**New systems**

- **Tip hat** (v28) — any class can use the `tip_hat` item to set a hat down
  two cells ahead; using it again picks it back up. The item is never
  consumed. The hat only exists while its owner stays close — straying past
  5m, changing floor, or logging out packs it up automatically. Clicking
  someone else's hat opens a tip dialog after walking into reach; type
  `1g20s30c`-style amounts or a bare number for copper. The server checks
  the wallet, the distance (within 5m), and blocks tipping yourself. Rica
  stocks it for 200 copper.
- **Party kill XP sharing** (2026-08-13) — when a monster dies, any party
  member alive on the killer's floor and within 150m shares the kill: the
  XP pool gains +25% per eligible member, and the boosted total is split
  equally among everyone (killer included), floored, with a guaranteed
  minimum of 1. With two or more eligible members, no share can exceed
  what a solo kill would pay — padding the party can't beat soloing. With
  only 1 eligible member or no party, XP is unchanged. Full rules in
  [Party](../guides/party/).
- **Admin command `/tp`** (admin-only) — `/tp <x> <z> [y]` teleports to
  world coordinates, `/tp <name|number>` teleports to a named destination,
  and a bare `/tp` lists the available destinations (2026-08-13).
- **New monster: Hobgoblin** (2026-08-14) — level 6, Guard 12, carries an
  Iron Sword, spawns on dungeon depths 6–20.
- **New monster: Gnoll** (2026-08-15) — level 6, Guard 13, unarmed and
  attacks with claws (2d8 damage), spawns on dungeon depths 7–20.
- **Looping dance emotes** (2026-08-15) — `/emote twist`, `/emote macarena`,
  and `/emote chicken` join the emote list. Unlike the one-shot gestures
  (`excited`, `clap`), a dance keeps playing until the dancer moves or
  presses Escape.

**New items & assets**

- **Silver Necklace got an effect** (2026-08-13) — the previously inert
  Silver Necklace now slows satiation drain to 0.75x while equipped
  (sprinting included), and re-enters the dungeon chest pool at tier 2
  (10% roll). Every necklace already in circulation from the old chest
  rules gets the effect retroactively, and it picked up its own model and
  icon.
- **Coin Pile got its own icon** (2026-08-13) — it used to borrow the Iron
  Sword's icon; now it has its own stacked-coins icon.
- **Scroll of Enchant Armor** (2026-08-15) — new `scroll_of_enchant_armor`
  item: reading it enchants a random worn armor piece +1 Guard, with the
  same reading and consumption rules as the weapon scroll. Merchants don't
  sell it — the only source is a 1% world drop, priced at 1,200 copper.
  Full rules in [Enchanting](../guides/enchant/).

**Balance**

- **Hit rolls now use an exploding d20; monster attack bonus scales on full
  level** (2026-08-15) — under the old rule, Guard 24 made some dungeon
  monsters mathematically unable to land a hit. Now a natural 20 rolls
  again and adds, so every Guard stays reachable even as the odds fall off
  with the gap. Monster attack bonus also moved from half-level to full
  level, so deeper floors hit harder — the Orc Warlord's odds against a
  leather-set graduate go from 20% to 45%. Full numbers in
  [Combat](../guides/combat/).

**Fixes**

- Fixed the first attack swing after a break in combat freezing on its
  first frame — it played its sound but never animated (2026-08-13).
- Fixed the first attack swing after a break in combat not turning to
  face the target, keeping the old facing instead (2026-08-13).
- Fixed the bottom-floor treasure chest rendering at the wrong angle with
  no collision, so players could walk straight through it — it now faces
  south and blocks movement (2026-08-14).
- Fixed the dungeon floor slab flickering with self-shadow artifacts under
  torchlight and z-fighting against the down-shaft's side wall — the slab
  mesh was rebuilt seamless, clearing the seam artifacts while keeping
  shadows (2026-08-14).
- Fixed melee attacks landing through closed dungeon doors and stair-shaft
  walls — attacks now run through the same passability check as movement,
  and are blocked in both directions (2026-08-14).
- Fixed merchant NPCs starting a scheduled move the instant it came due,
  with no chance to pack up their stall or finish a song first — a
  schedule change now posts a `[Schedule]` notice and holds the move for
  one more NPC turn (or 30s), and a stall left standing at departure is
  packed as a backstop (2026-08-15).

**Client**

- **Dungeon bosses are now visually distinct** (2026-08-13) — boss
  monsters (the Goblin Chief, the Orc Warlord) no longer share regular
  monsters' model scale; they now render larger with a gold nameplate.
  Visual only — combat ranges and collision are unchanged.
- Fixed background music staying silent after being turned back on
  (unmuted, volume raised, or combat ended) while a nearby performance was
  already playing — it used to wait for the next song. Now it remembers
  the track and rejoins at the current offset as soon as it can play again
  (2026-08-15).

## Protocols v26–v27 — client v0.23.0

**The live server requires v27.** Older clients are refused. Two protocol
versions shipped over two days (Aug 6–7), each its own system: party
management and ground-item stacking. The same release window (Aug 6–12)
also carried a lot that didn't need a protocol bump: a new admin command,
an overhaul of ambient monster spawning, a change to dungeon chest loot,
and a handful of anti-cheat fixes.

**New systems**

- **Party kick and leader handover** (v26) — the leader can remove a member
  with `/party kick <name>` or hand the lead to someone else with
  `/party leader <name>`; a non-leader, a self-target, or targeting a
  non-member each get their own refusal reason. `/party leave` formally
  joins the `/party` subcommand set. The kicked member gets a system
  message; everyone else sees "X was removed."
- **Party vitals sync** (v26) — the party panel now shows every member's
  HP, max HP, and class live; the server pushes a party whose health
  changed once a second.
- **Ground-item stacking** (v27) — drop a stack of stackable items (say,
  twelve potions) and it now lands as **one pile** with a count badge,
  instead of twelve separate objects. Picking it up only takes what your
  bag has weight headroom for, leaving the rest behind with the badge
  updated — a pile too heavy to carry whole no longer blocks you from
  taking any of it. Loot and world drops still land one at a time.
- **Admin command `/spawnmob <type> [count]`** (admin-only) — spawns
  aggressive monsters in a ring around the admin for combat testing;
  capped at 10 per use and still bound by the global and spawn caps.

**Balance**

- **Party size cap 8 → 5** (2026-08-11).
- **Ambient monster spawning overhaul** (Aug 6–12) — the spawn cap changed
  from "server-wide × monster type" to **30 per player**, so monsters
  clustered near one player no longer starve everyone else's spawns.
  Monsters with no player around now **disappear immediately** instead of
  waiting out the old 60-second grace period. Measured at 5,000
  concurrent players / 134k monsters, peak monster count halved and a
  roaming player gets the same spawn rate as one standing still.
- **Dungeon boss chest loot now ejects onto the ground** (2026-08-11) —
  gear rolled from a treasure chest no longer goes straight into your bag;
  it scatters around the chest like regular loot, so anyone nearby can
  grab it. Gold still lands straight in your wallet. Clicking a chest
  already opened that night just shows you the lid swinging open on
  nothing.
- **The Gold Ring became an actual ring of adornment** (2026-08-12) — the
  previously inert Gold Ring now carries a CHA +1 bonus, widening your
  haggling price band by ±2 percentage points. It re-enters the dungeon
  chest pool at tier 3 (10% roll); every ring already in circulation from
  the old chest rules gets the effect retroactively, and it picked up its
  own model and icon.

**Fixes**

- Fixed a forged vertical coordinate (Y) letting players and monsters walk
  through walls and furniture — the server now derives collision height
  from the terrain data itself instead of trusting the client's reported
  Y (2026-08-11).
- Reject a client reporting a monster as "dead" directly, closing off a way
  to fake a kill and bypass the server's combat resolution (2026-08-07).
- Batch buy/drop quantities are now checked for overflow, so an
  oversized-quantity request can't cause an integer overflow (2026-08-08).
- Picking up a coin pile now reports the actual copper amount in chat,
  instead of a generic "picked up" line (2026-08-11).
- Fixed the LLM slipping in a stale `/play_music` right as an NPC lay down
  to sleep, leaving it stuck standing in its playing pose all night — the
  pose is now adopted the moment the command is sent instead of waiting
  for the server echo, and a finished song no longer forces a
  already-reposed NPC back onto its feet (2026-08-13).

**Client**

- **Registered the admin commands for `/help` and tab completion**
  (2026-08-12) — `/kick`, `/ban`, `/unban`, `/mute`, `/unmute`, `/summon`,
  and `/goto` were already handled server-side but missing from the
  client's command list, so `/help` never listed them and tab completion
  ignored them. All seven are now registered, with descriptions matching
  the server semantics (`/ban` is permanent unless given minutes, `/mute`
  defaults to 10 minutes, `/unban` also accepts an account name).
- Fixed unspaced chat text (common in Korean) overflowing the chat bubble —
  word-wrap now breaks by grapheme, so it can't split an emoji in half
  (2026-08-07).

## Protocols v23–v25 — client v0.21.0

Three protocol versions shipped over four days (Aug 6–10), each its own
system: friends, merchant stalls, and declining pushed trade offers.

**New systems**

- **Friend system** (v23) — `/friend add <name>` (or `/f`) sends a friend
  request; the other player has 120 seconds to accept it on a toast, and
  requesting each other simultaneously skips the answer and makes you
  friends immediately. Press **F** for the friend panel — whisper or invite
  to party in one click. Friendship and blocking are mutually exclusive:
  blocking a friend ends the friendship. Full rules in
  [Friends](../guides/friends/).
- **Merchant stalls** (v24) — the new `/lay_stall` command, merchant-class
  only, spreads a table outdoors as a visible "open for business" sign
  (`/pack_stall` folds it up, and logging out does too). It's purely a
  prop — trading still runs through the normal window.
- **Declining pushed trade offers** (v25) — a trade or deal window an NPC
  pushes at you now has a "Not now" button, and an unanswered toast that
  times out counts as a decline too. Once declined, **that NPC won't push
  another offer at you for 10 minutes.**

**Balance**

- **Wick, the night merchant**, now works the Aldermark road after dark,
  selling only night-travel essentials — a torch, healing potions, a
  campfire kit, bread, jerky, a scroll of return — and buying at **30%**
  of base price (Rica pays 40%). It's a convenience for being out after
  dark, not a better deal than waiting for Rica.
- **Rica can't trade while asleep** (2026-08-05) — while she's in bed at
  night, her shop window refuses to open (and an already-open one gets
  closed), which is the direct reason Wick exists: the town can't go a
  whole night with no counter open.
- **Roster NPCs like the guard Karl** now get their gear **issued and
  equipped automatically on login** (a spear plus a full leather armor
  set) instead of relying on the model's default look. Issued gear
  **can't be sold**, either direction, so logging an NPC in and out
  can't be farmed for free equipment.
- **NPCs remember you (favor)** — NPCs now keep a rolling window of the
  last 30 lines of conversation, and bards additionally remember the
  last 8 songs they played. Conversations also build up a **favor**
  score (±1 per turn, capped at ±5 total); once a player clears the
  threshold, the NPC starts treating them as a regular worth a private
  deal — the mechanism behind the keepsake trades mentioned in
  [Music & the bard](../guides/music/).

**Fixes**

- If an NPC agent process dies unexpectedly, the driver now respawns it
  after a delay instead of leaving it gone for good.
- Fixed surface objects (like shop signs) being visible floating in
  mid-air while underground in a dungeon.
- Fixed dungeon floor moves not snapping back into alignment with stairs
  when the server corrected them.
- Moves the server refuses (targets over 60m away, dead players,
  non-finite coordinates) now reliably send a position-correction packet
  back, instead of leaving agent NPCs stuck phantom-walking back and forth.

## Protocols v20–v22 — client v0.20.0

Three protocol versions shipped back-to-back over two days (Aug 6–7), all on
one theme: **the music system**. Gameplay details in
[Music & the bard](../guides/music/).

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
- Busker NPCs now equip their worn mandolin on session start instead of the gilded
  keepsake, so the keepsake stays in the bag for the private offer-to-a-regular
  flow (2026-08-07).

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
