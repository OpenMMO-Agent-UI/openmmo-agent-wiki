// Thai names. Same export shape as zh.js and ko.js.
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
  weapon: 'อาวุธ',
  armor: 'เกราะ',
  accessory: 'เครื่องประดับ',
  food: 'อาหาร',
  drink: 'เครื่องดื่ม',
  fish: 'ปลาสด',
  junk: 'เศษของ',
  coin_catch: 'เหรียญที่ตกได้',
  currency: 'สกุลเงิน',
  healing_potion: 'ยาฟื้นฟู',
  return_scroll: 'ม้วนคืนกลับ',
  enchant_scroll: 'ม้วนตีบวก',
  enchant_armor_scroll: 'ม้วนตีบวกเกราะ',
  party_summon_scroll: 'ม้วนเรียกปาร์ตี้',
  instrument: 'เครื่องดนตรี',
  furniture: 'เฟอร์นิเจอร์',
  fishing_rod: 'อุปกรณ์ตกปลา',
  campfire_kit: 'ชุดกองไฟ',
  tip_hat: 'หมวกรับทิป',
  cape_dye: 'สีย้อมผ้าคลุม',
  cape_texture: 'ลายพิมพ์ผ้าคลุม',
  phoenix_talisman: 'เครื่องรางฟีนิกซ์',
  reagent: 'สารตั้งต้น',
  timekeeper: 'เครื่องบอกเวลา',
  dungeon_key: 'กุญแจดันเจี้ยน',
  ammo: 'กระสุน',
  land_deed: 'โฉนดที่ดิน',
  tool: 'เครื่องมือ',
  landscaping_palette: 'จานแต่งภูมิทัศน์',
  horse_reins: 'สายบังเหียนม้า',
  rowboat: 'เรือพาย',
  estate_return_scroll: 'ม้วนคืนสู่ที่ดิน',
  house_scroll: 'ม้วนบ้าน',
  peddler_stall: 'แผงพ่อค้าเร่',
  raid_token: 'โทเคนบุก',
};

export const slotNames = {
  head: 'ศีรษะ',
  main_hand: 'มือหลัก',
  off_hand: 'มือรอง',
  chest: 'ลำตัว',
  hands: 'มือ',
  pants: 'ขา',
  boots: 'เท้า',
  belt: 'เข็มขัด',
  neck: 'คอ',
  ring: 'แหวน',
  ear: 'หู',
  back: 'หลัง',
};

export const materialNames = {
  metal: 'โลหะ',
  wood: 'ไม้',
  leather: 'หนัง',
  flesh: 'เนื้อ',
  cloth: 'ผ้า',
  stone: 'หิน',
};

export const behaviorNames = {
  brave: 'เห็นแล้วเข้าโจมตี',
  timid: 'โจมตีตอบเท่านั้น',
};

export const mapKindNames = {
  continent: 'ทวีป',
  capital: 'เมืองหลวง',
  city: 'นคร',
  town: 'เมือง',
  sea: 'ทะเล',
  island: 'เกาะ',
};

export const attributeNames = {
  STR: 'พลัง',
  DEX: 'ความคล่องแคล่ว',
  CON: 'ความอดทน',
  INT: 'สติปัญญา',
  WIS: 'ปัญญาญาณ',
  CHA: 'เสน่ห์',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
