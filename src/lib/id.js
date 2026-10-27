// Indonesian names. Same export shape as zh.js and ko.js.
//
// Item, monster, dungeon and debuff names come straight from the game CSV
// rather than a hand-kept table, exactly as en.js does — and deliberately.
// Those strings are what the game client itself puts on screen, in English,
// whatever language this wiki is read in; a translated item name would be a
// name the reader cannot find in their own inventory. The enum labels below
// are this wiki's own words, so those are translated.

import { items, monsters, dungeons, debuffs } from './gamedata.js';

export const itemNames = Object.fromEntries(items.map((i) => [i.id, i.name]));
export const itemDescriptions = Object.fromEntries(items.map((i) => [i.id, i.description]));
export const monsterNames = Object.fromEntries(monsters.map((m) => [m.id, m.name]));
export const dungeonNames = Object.fromEntries(dungeons.map((d) => [d.id, d.name]));
export const debuffNames = Object.fromEntries(debuffs.map((d) => [d.id, d.name]));

export const categoryNames = {
  weapon: 'Senjata',
  armor: 'Pelindung',
  accessory: 'Aksesori',
  food: 'Makanan',
  drink: 'Minuman',
  fish: 'Ikan mentah',
  junk: 'Rongsokan',
  coin_catch: 'Koin pancingan',
  currency: 'Mata uang',
  healing_potion: 'Ramuan penyembuh',
  return_scroll: 'Gulungan kembali',
  enchant_scroll: 'Gulungan peningkatan',
  enchant_armor_scroll: 'Gulungan peningkatan pelindung',
  party_summon_scroll: 'Gulungan panggil party',
  instrument: 'Alat musik',
  furniture: 'Perabot',
  fishing_rod: 'Perlengkapan pancing',
  campfire_kit: 'Perangkat api unggun',
  tip_hat: 'Topi tip',
  cape_dye: 'Pewarna jubah',
  cape_texture: 'Cetak jubah',
  phoenix_talisman: 'Azimat phoenix',
  reagent: 'Reagen',
  timekeeper: 'Penunjuk waktu',
  dungeon_key: 'Kunci dungeon',
  ammo: 'Amunisi',
  land_deed: 'Akta tanah',
  tool: 'Perkakas',
  landscaping_palette: 'Palet lansekap',
  horse_reins: 'Tali kekang kuda',
  rowboat: 'Perahu dayung',
  estate_return_scroll: 'Gulungan kembali ke properti',
  house_scroll: 'Gulungan rumah',
  peddler_stall: 'Kios pedagang',
  raid_token: 'Token raid',
};

export const slotNames = {
  head: 'Kepala',
  main_hand: 'Tangan utama',
  off_hand: 'Tangan kiri',
  chest: 'Badan',
  hands: 'Tangan',
  pants: 'Celana',
  boots: 'Sepatu',
  belt: 'Ikat pinggang',
  neck: 'Leher',
  ring: 'Cincin',
  ear: 'Telinga',
  back: 'Punggung',
};

export const materialNames = {
  metal: 'Logam',
  wood: 'Kayu',
  leather: 'Kulit',
  flesh: 'Daging',
  cloth: 'Kain',
  stone: 'Batu',
};

export const behaviorNames = {
  brave: 'Menyerang saat melihat',
  timid: 'Hanya membalas',
};

export const mapKindNames = {
  continent: 'Benua',
  capital: 'Ibu kota',
  city: 'Kota',
  town: 'Kota kecil',
  sea: 'Laut',
  island: 'Pulau',
};

export const attributeNames = {
  STR: 'Kekuatan',
  DEX: 'Ketangkasan',
  CON: 'Ketahanan',
  INT: 'Kecerdasan',
  WIS: 'Kebijaksanaan',
  CHA: 'Karisma',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
