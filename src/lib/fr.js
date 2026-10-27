// French names. Same export shape as zh.js and ko.js.
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
  weapon: 'Arme',
  armor: 'Armure',
  accessory: 'Accessoire',
  food: 'Nourriture',
  drink: 'Boisson',
  fish: 'Poisson cru',
  junk: 'Rebut',
  coin_catch: 'Pièces pêchées',
  currency: 'Monnaie',
  healing_potion: 'Potion de soin',
  return_scroll: 'Parchemin de retour',
  enchant_scroll: 'Parchemin d’enchantement',
  enchant_armor_scroll: 'Parchemin d’enchantement d’armure',
  party_summon_scroll: 'Parchemin d’invocation de groupe',
  instrument: 'Instrument',
  furniture: 'Meuble',
  fishing_rod: 'Matériel de pêche',
  campfire_kit: 'Kit de feu de camp',
  tip_hat: 'Chapeau à pourboires',
  cape_dye: 'Teinture de cape',
  cape_texture: 'Impression de cape',
  phoenix_talisman: 'Talisman du phénix',
  reagent: 'Réactif',
  timekeeper: 'Horloge',
  dungeon_key: 'Clé de donjon',
  ammo: 'Munitions',
  land_deed: 'Titre de propriété',
  tool: 'Outil',
  landscaping_palette: 'Palette d’aménagement',
  horse_reins: 'Rênes de cheval',
  rowboat: 'Barque',
  estate_return_scroll: 'Parchemin de retour au domaine',
  house_scroll: 'Parchemin de maison',
  peddler_stall: 'Étal de colporteur',
  raid_token: 'Jeton de raid',
};

export const slotNames = {
  head: 'Tête',
  main_hand: 'Main directrice',
  off_hand: 'Main secondaire',
  chest: 'Torse',
  hands: 'Mains',
  pants: 'Jambes',
  boots: 'Bottes',
  belt: 'Ceinture',
  neck: 'Cou',
  ring: 'Bague',
  ear: 'Oreille',
  back: 'Dos',
};

export const materialNames = {
  metal: 'Métal',
  wood: 'Bois',
  leather: 'Cuir',
  flesh: 'Chair',
  cloth: 'Tissu',
  stone: 'Pierre',
};

export const behaviorNames = {
  brave: 'Attaque à vue',
  timid: 'Riposte seulement',
};

export const mapKindNames = {
  continent: 'Continent',
  capital: 'Capitale',
  city: 'Ville',
  town: 'Bourg',
  sea: 'Mer',
  island: 'Île',
};

export const attributeNames = {
  STR: 'Force',
  DEX: 'Dextérité',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Sagesse',
  CHA: 'Charisme',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
