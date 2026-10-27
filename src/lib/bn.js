// Bengali names. Same export shape as zh.js and ko.js.
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
  weapon: 'অস্ত্র',
  armor: 'বর্ম',
  accessory: 'অলংকার',
  food: 'খাদ্য',
  drink: 'পানীয়',
  fish: 'কাঁচা মাছ',
  junk: 'আবর্জনা',
  coin_catch: 'ধরা পড়া মুদ্রা',
  currency: 'মুদ্রা',
  healing_potion: 'আরোগ্য ঔষধ',
  return_scroll: 'প্রত্যাবর্তন স্ক্রল',
  enchant_scroll: 'এনচ্যান্ট স্ক্রল',
  enchant_armor_scroll: 'বর্ম এনচ্যান্ট স্ক্রল',
  party_summon_scroll: 'পার্টি আহ্বান স্ক্রল',
  instrument: 'বাদ্যযন্ত্র',
  furniture: 'আসবাব',
  fishing_rod: 'মাছ ধরার সরঞ্জাম',
  campfire_kit: 'ক্যাম্পফায়ার কিট',
  tip_hat: 'টিপ টুপি',
  cape_dye: 'কেপ রং',
  cape_texture: 'কেপ ছাপ',
  phoenix_talisman: 'ফিনিক্স তাবিজ',
  reagent: 'বিকারক',
  timekeeper: 'সময়মাপক',
  dungeon_key: 'ডানজন চাবি',
  ammo: 'গুলি',
  land_deed: 'ভূমি দলিল',
  tool: 'যন্ত্রপাতি',
  landscaping_palette: 'ভূদৃশ্য প্যালেট',
  horse_reins: 'ঘোড়ার লাগাম',
  rowboat: 'দাঁড়বাওয়া নৌকা',
  estate_return_scroll: 'এস্টেট প্রত্যাবর্তন স্ক্রল',
  house_scroll: 'বাড়ি স্ক্রল',
  peddler_stall: 'ফেরিওয়ালার দোকান',
  raid_token: 'রেইড টোকেন',
};

export const slotNames = {
  head: 'মাথা',
  main_hand: 'প্রধান হাত',
  off_hand: 'সহায়ক হাত',
  chest: 'বুক',
  hands: 'হাত',
  pants: 'পা',
  boots: 'জুতো',
  belt: 'কোমরবন্ধ',
  neck: 'গলা',
  ring: 'আংটি',
  ear: 'কান',
  back: 'পিঠ',
};

export const materialNames = {
  metal: 'ধাতু',
  wood: 'কাঠ',
  leather: 'চামড়া',
  flesh: 'মাংস',
  cloth: 'কাপড়',
  stone: 'পাথর',
};

export const behaviorNames = {
  brave: 'দেখলেই আক্রমণ',
  timid: 'কেবল পাল্টা আঘাত',
};

export const mapKindNames = {
  continent: 'মহাদেশ',
  capital: 'রাজধানী',
  city: 'মহানগর',
  town: 'শহর',
  sea: 'সমুদ্র',
  island: 'দ্বীপ',
};

export const attributeNames = {
  STR: 'শক্তি',
  DEX: 'ক্ষিপ্রতা',
  CON: 'সহনশক্তি',
  INT: 'বুদ্ধি',
  WIS: 'প্রজ্ঞা',
  CHA: 'আকর্ষণ',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
