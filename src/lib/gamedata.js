// Reads the vendored game data and turns it into what a player actually wants
// to know. Two things happen here that a raw CSV dump cannot do:
//
//   1. Blank monster columns are overrides, not zeroes — the server fills them
//      from the level. Showing them empty would be wrong, so we derive them
//      with the same formulas (server/src/game/combat.rs).
//   2. Prices are stored as a single copper integer; 1g = 100s = 10,000c is a
//      display-layer convention (doc/ECONOMY.md).

// Imported with ?raw so the CSVs are inlined at build time. Reading them from
// disk breaks once Vite moves this module into dist/chunks/.
import itemsCsv from '../data/game/items.csv?raw';
import monstersCsv from '../data/game/monsters.csv?raw';
import dungeonsCsv from '../data/game/dungeons.csv?raw';
import merchantsCsv from '../data/game/merchants.csv?raw';
import npcsCsv from '../data/game/npcs.csv?raw';
import worldDropCsv from '../data/game/world_drop.csv?raw';
import mapLabelsCsv from '../data/game/map_labels.csv?raw';

const sources = {
  items: itemsCsv,
  monsters: monstersCsv,
  dungeons: dungeonsCsv,
  merchants: merchantsCsv,
  npcs: npcsCsv,
  world_drop: worldDropCsv,
  map_labels: mapLabelsCsv,
};

function parseCsv(name) {
  const text = sources[name].trim();
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  row.push(field);
  rows.push(row);

  const [header, ...body] = rows;
  return body.map((cells) =>
    Object.fromEntries(header.map((key, i) => [key, (cells[i] ?? '').trim()]))
  );
}

const num = (v) => (v === '' || v === undefined ? null : Number(v));
const bool = (v) => v === 'true';

// --- currency ---------------------------------------------------------------

/** Copper integer -> "1g 20s 5c". Blank prices mean merchants refuse the item. */
export function formatCoins(copper) {
  if (copper === null || copper === undefined) return '—';
  if (copper === 0) return '0c';
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  return [g && `${g}g`, s && `${s}s`, c && `${c}c`].filter(Boolean).join(' ');
}

/** Rica pays this fraction of base price; see merchants.csv sellRatePercent. */
export function sellPrice(copper, ratePercent) {
  if (copper === null) return null;
  return Math.floor((copper * ratePercent) / 100);
}

// --- monsters ---------------------------------------------------------------

/** server/src/game/combat.rs: ceil(level * 9 / 2) */
export const healthForLevel = (level) => Math.ceil(Math.max(level, 1) * 9 / 2);

/** server/src/game/combat.rs: floor(level / 2) */
export const attackBonusForLevel = (level) => Math.floor(level / 2);

/** server/src/game/combat.rs: monster_damage_roll_for_level */
export function damageRollForLevel(level) {
  if (level <= 2) return '1d4';
  if (level <= 4) return '1d6';
  if (level <= 6) return '1d8';
  if (level <= 8) return '2d6';
  if (level <= 12) return '2d8';
  return '3d6';
}

/** Average of a `{n}d{sides}` roll, for comparing weapons and monsters. */
export function averageRoll(dice) {
  const m = /^(\d+)d(\d+)$/.exec(dice ?? '');
  if (!m) return null;
  return (Number(m[1]) * (Number(m[2]) + 1)) / 2;
}

// --- loading ----------------------------------------------------------------

export const items = parseCsv('items').map((r) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  weight: num(r.weight),
  equipSlot: r.equipSlot || null,
  stackable: bool(r.stackable),
  category: r.category,
  dice: r.dice || null,
  material: r.material || null,
  basePrice: num(r.basePrice),
  guard: num(r.guard),
  chaBonus: num(r.chaBonus),
  rarityTier: num(r.rarityTier),
  catchWeight: num(r.catchWeight),
  sizeDice: r.sizeDice || null,
  trophyCm: num(r.trophyCm),
  minFishingLevel: num(r.minFishingLevel),
  chestTier: num(r.chestTier),
  chestChance: num(r.chestChance),
  consumable: bool(r.consumable),
  nutrition: num(r.nutrition),
  grillsInto: r.grillsInto || null,
}));

export const itemsById = new Map(items.map((i) => [i.id, i]));

export const monsters = parseCsv('monsters').map((r) => {
  const level = num(r.level) ?? 1;
  return {
    id: r.id,
    name: r.name,
    level,
    guard: num(r.guard),
    health: num(r.health),
    healthEffective: num(r.health) ?? healthForLevel(level),
    healthDerived: num(r.health) === null,
    attackBonus: num(r.attackBonus),
    attackBonusEffective: num(r.attackBonus) ?? attackBonusForLevel(level),
    attackBonusDerived: num(r.attackBonus) === null,
    damageRoll: r.damageRoll || null,
    damageRollEffective: r.damageRoll || damageRollForLevel(level),
    damageRollDerived: !r.damageRoll,
    behavior: r.behavior || 'brave',
    walkSpeed: num(r.walkSpeed),
    runSpeed: num(r.runSpeed),
    attackRange: num(r.attackRange),
    chaseRange: num(r.chaseRange),
    attackCooldown: num(r.attackCooldown),
    weapon: r.weapon || null,
    weaponDropChance: num(r.weaponDropChance),
    dungeonMinDepth: num(r.dungeonMinDepth),
    dungeonMaxDepth: num(r.dungeonMaxDepth),
    dungeonWeight: num(r.dungeonWeight),
  };
});

export const dungeons = parseCsv('dungeons').map((r) => ({
  id: r.id,
  name: r.name,
  x: num(r.x),
  z: num(r.z),
  floors: num(r.floors),
  boss: r.boss || null,
  chestTier: num(r.chestTier),
  chestDrops: r.chestDrops || null,
}));

export const merchants = parseCsv('merchants').map((r) => ({
  id: r.id,
  npcName: r.npcName,
  sellRatePercent: num(r.sellRatePercent),
  catalog: r.catalog ? r.catalog.split(';') : [],
}));

export const npcs = parseCsv('npcs').map((r) => ({
  id: r.id,
  npcName: r.npcName,
  class: r.class,
  wishlist: r.wishlist ? r.wishlist.split(';') : [],
  wishlistRatePercent: num(r.wishlistRatePercent),
  salaryPerDay: num(r.salaryPerDay),
  walletCap: num(r.walletCap),
  keepsakes: r.keepsakes ? r.keepsakes.split(';') : [],
  loadout: r.loadout ? r.loadout.split(';') : [],
}));

export const worldDrops = parseCsv('world_drop').map((r) => ({
  id: r.id,
  chance: num(r.chance),
}));

export const mapLabels = parseCsv('map_labels').map((r) => ({
  id: r.id,
  name: r.name,
  kind: r.kind,
  x: num(r.x),
  z: num(r.z),
}));
