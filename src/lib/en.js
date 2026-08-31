// English names. Same export shape as zh.js and ko.js, but the game is already
// English — item and monster names come straight from the CSV rather than a
// hand-maintained table, so they cannot drift from what the client shows.

import { items, monsters, dungeons, debuffs } from './gamedata.js';

export const itemNames = Object.fromEntries(items.map((i) => [i.id, i.name]));
export const itemDescriptions = Object.fromEntries(items.map((i) => [i.id, i.description]));
export const monsterNames = Object.fromEntries(monsters.map((m) => [m.id, m.name]));
export const dungeonNames = Object.fromEntries(dungeons.map((d) => [d.id, d.name]));
export const debuffNames = Object.fromEntries(debuffs.map((d) => [d.id, d.name]));

export const categoryNames = {
  weapon: 'Weapon',
  armor: 'Armor',
  accessory: 'Accessory',
  food: 'Food',
  fish: 'Raw fish',
  junk: 'Junk',
  coin_catch: 'Coin catch',
  currency: 'Currency',
  healing_potion: 'Healing potion',
  return_scroll: 'Return scroll',
  enchant_scroll: 'Enchant scroll',
  enchant_armor_scroll: 'Armor enchant scroll',
  party_summon_scroll: 'Summon scroll',
  instrument: 'Instrument',
  furniture: 'Furniture',
  fishing_rod: 'Fishing gear',
  campfire_kit: 'Campfire',
  tip_hat: 'Tip hat',
  cape_dye: 'Cape dye',
  cape_texture: 'Cape print',
  phoenix_talisman: 'Phoenix talisman',
  reagent: 'Reagent',
  timekeeper: 'Timekeeper',
  dungeon_key: 'Dungeon key',
};

export const slotNames = {
  head: 'Head',
  main_hand: 'Main hand',
  off_hand: 'Off hand',
  chest: 'Chest',
  hands: 'Hands',
  pants: 'Pants',
  boots: 'Boots',
  belt: 'Belt',
  neck: 'Neck',
  ring: 'Ring',
  ear: 'Ear',
  back: 'Back',
};

export const materialNames = {
  metal: 'Metal',
  wood: 'Wood',
  leather: 'Leather',
  flesh: 'Flesh',
  cloth: 'Cloth',
  stone: 'Stone',
};

export const behaviorNames = {
  brave: 'Attacks on sight',
  timid: 'Fights back only',
};

export const mapKindNames = {
  continent: 'Continent',
  capital: 'Capital',
  city: 'City',
  town: 'Town',
  sea: 'Sea',
  island: 'Island',
};

export const attributeNames = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
export const className = (id) => id.charAt(0).toUpperCase() + id.slice(1);
