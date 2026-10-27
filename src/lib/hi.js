// Hindi names. Same export shape as zh.js and ko.js.
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
  weapon: 'हथियार',
  armor: 'कवच',
  accessory: 'आभूषण',
  food: 'भोजन',
  drink: 'पेय',
  fish: 'कच्ची मछली',
  junk: 'कबाड़',
  coin_catch: 'पकड़े गए सिक्के',
  currency: 'मुद्रा',
  healing_potion: 'उपचार औषधि',
  return_scroll: 'वापसी स्क्रॉल',
  enchant_scroll: 'एनचैंट स्क्रॉल',
  enchant_armor_scroll: 'कवच एनचैंट स्क्रॉल',
  party_summon_scroll: 'पार्टी बुलावा स्क्रॉल',
  instrument: 'वाद्य यंत्र',
  furniture: 'फ़र्नीचर',
  fishing_rod: 'मछली पकड़ने का सामान',
  campfire_kit: 'कैम्पफ़ायर किट',
  tip_hat: 'टिप टोपी',
  cape_dye: 'लबादा रंग',
  cape_texture: 'लबादा छपाई',
  phoenix_talisman: 'फ़ीनिक्स तावीज़',
  reagent: 'अभिकर्मक',
  timekeeper: 'समयमापी',
  dungeon_key: 'तहख़ाना कुंजी',
  ammo: 'गोला-बारूद',
  land_deed: 'भूमि दस्तावेज़',
  tool: 'उपकरण',
  landscaping_palette: 'भू-दृश्य पट्टिका',
  horse_reins: 'घोड़े की रास',
  rowboat: 'नाव',
  estate_return_scroll: 'सम्पदा वापसी स्क्रॉल',
  house_scroll: 'घर स्क्रॉल',
  peddler_stall: 'फेरीवाले की दुकान',
  raid_token: 'रेड टोकन',
};

export const slotNames = {
  head: 'सिर',
  main_hand: 'मुख्य हाथ',
  off_hand: 'दूसरा हाथ',
  chest: 'छाती',
  hands: 'हाथ',
  pants: 'पैर',
  boots: 'जूते',
  belt: 'कमरबंद',
  neck: 'गला',
  ring: 'अंगूठी',
  ear: 'कान',
  back: 'पीठ',
};

export const materialNames = {
  metal: 'धातु',
  wood: 'लकड़ी',
  leather: 'चमड़ा',
  flesh: 'मांस',
  cloth: 'कपड़ा',
  stone: 'पत्थर',
};

export const behaviorNames = {
  brave: 'देखते ही हमला',
  timid: 'केवल पलटवार',
};

export const mapKindNames = {
  continent: 'महाद्वीप',
  capital: 'राजधानी',
  city: 'महानगर',
  town: 'नगर',
  sea: 'समुद्र',
  island: 'द्वीप',
};

export const attributeNames = {
  STR: 'शक्ति',
  DEX: 'फुर्ती',
  CON: 'दमखम',
  INT: 'बुद्धि',
  WIS: 'विवेक',
  CHA: 'आकर्षण',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
