// Arabic names. Same export shape as zh.js and ko.js.
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
  weapon: 'سلاح',
  armor: 'درع',
  accessory: 'حلية',
  food: 'طعام',
  drink: 'شراب',
  fish: 'سمك نيء',
  junk: 'نفايات',
  coin_catch: 'عملات مصطادة',
  currency: 'عملة',
  healing_potion: 'جرعة شفاء',
  return_scroll: 'لفيفة عودة',
  enchant_scroll: 'لفيفة تحسين',
  enchant_armor_scroll: 'لفيفة تحسين الدرع',
  party_summon_scroll: 'لفيفة استدعاء المجموعة',
  instrument: 'آلة موسيقية',
  furniture: 'أثاث',
  fishing_rod: 'عتاد صيد',
  campfire_kit: 'طقم نار المخيم',
  tip_hat: 'قبعة الإكراميات',
  cape_dye: 'صباغ العباءة',
  cape_texture: 'طبعة العباءة',
  phoenix_talisman: 'تميمة العنقاء',
  reagent: 'مادة محفزة',
  timekeeper: 'ساعة',
  dungeon_key: 'مفتاح قبو',
  ammo: 'ذخيرة',
  land_deed: 'سند أرض',
  tool: 'أداة',
  landscaping_palette: 'لوحة تنسيق الأرض',
  horse_reins: 'أعنة الفرس',
  rowboat: 'قارب تجديف',
  estate_return_scroll: 'لفيفة العودة إلى العقار',
  house_scroll: 'لفيفة منزل',
  peddler_stall: 'بسطة بائع متجول',
  raid_token: 'رمز الغزوة',
};

export const slotNames = {
  head: 'الرأس',
  main_hand: 'اليد الرئيسية',
  off_hand: 'اليد الثانية',
  chest: 'الصدر',
  hands: 'اليدان',
  pants: 'الساقان',
  boots: 'الحذاء',
  belt: 'الحزام',
  neck: 'العنق',
  ring: 'الخاتم',
  ear: 'الأذن',
  back: 'الظهر',
};

export const materialNames = {
  metal: 'معدن',
  wood: 'خشب',
  leather: 'جلد',
  flesh: 'لحم',
  cloth: 'قماش',
  stone: 'حجر',
};

export const behaviorNames = {
  brave: 'يهجم عند الرؤية',
  timid: 'يرد فقط',
};

export const mapKindNames = {
  continent: 'قارة',
  capital: 'عاصمة',
  city: 'مدينة',
  town: 'بلدة',
  sea: 'بحر',
  island: 'جزيرة',
};

export const attributeNames = {
  STR: 'القوة',
  DEX: 'الرشاقة',
  CON: 'البنية',
  INT: 'الذكاء',
  WIS: 'الحكمة',
  CHA: 'الجاذبية',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
