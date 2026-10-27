// Japanese names. Same export shape as zh.js and ko.js.
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
  weapon: '武器',
  armor: '防具',
  accessory: 'アクセサリー',
  food: '食料',
  drink: '飲み物',
  fish: '生魚',
  junk: 'がらくた',
  coin_catch: '釣り銭',
  currency: '通貨',
  healing_potion: '回復ポーション',
  return_scroll: '帰還の巻物',
  enchant_scroll: '強化の巻物',
  enchant_armor_scroll: '防具強化の巻物',
  party_summon_scroll: 'パーティー召喚の巻物',
  instrument: '楽器',
  furniture: '家具',
  fishing_rod: '釣り具',
  campfire_kit: '焚き火セット',
  tip_hat: 'チップ帽',
  cape_dye: 'マント染料',
  cape_texture: 'マントプリント',
  phoenix_talisman: '不死鳥の護符',
  reagent: '触媒',
  timekeeper: '時計',
  dungeon_key: 'ダンジョンの鍵',
  ammo: '弾薬',
  land_deed: '土地権利書',
  tool: '道具',
  landscaping_palette: '造園パレット',
  horse_reins: '馬の手綱',
  rowboat: '手漕ぎ舟',
  estate_return_scroll: '領地帰還の巻物',
  house_scroll: '家の巻物',
  peddler_stall: '行商人の露店',
  raid_token: 'レイドトークン',
};

export const slotNames = {
  head: '頭',
  main_hand: 'メインハンド',
  off_hand: 'オフハンド',
  chest: '胴',
  hands: '手',
  pants: '脚',
  boots: '靴',
  belt: 'ベルト',
  neck: '首',
  ring: '指輪',
  ear: '耳',
  back: '背中',
};

export const materialNames = {
  metal: '金属',
  wood: '木',
  leather: '革',
  flesh: '肉',
  cloth: '布',
  stone: '石',
};

export const behaviorNames = {
  brave: '見つけ次第襲う',
  timid: '反撃のみ',
};

export const mapKindNames = {
  continent: '大陸',
  capital: '首都',
  city: '都市',
  town: '町',
  sea: '海',
  island: '島',
};

export const attributeNames = {
  STR: '筋力',
  DEX: '敏捷',
  CON: '体力',
  INT: '知力',
  WIS: '精神',
  CHA: '魅力',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
