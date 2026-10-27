// Spanish names. Same export shape as zh.js and ko.js.
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
  weapon: 'Arma',
  armor: 'Armadura',
  accessory: 'Accesorio',
  food: 'Comida',
  drink: 'Bebida',
  fish: 'Pescado crudo',
  junk: 'Chatarra',
  coin_catch: 'Monedas pescadas',
  currency: 'Moneda',
  healing_potion: 'Poción curativa',
  return_scroll: 'Pergamino de regreso',
  enchant_scroll: 'Pergamino de encantamiento',
  enchant_armor_scroll: 'Pergamino de encantar armadura',
  party_summon_scroll: 'Pergamino de invocación de grupo',
  instrument: 'Instrumento',
  furniture: 'Mueble',
  fishing_rod: 'Aparejo de pesca',
  campfire_kit: 'Equipo de hoguera',
  tip_hat: 'Sombrero de propinas',
  cape_dye: 'Tinte de capa',
  cape_texture: 'Estampa de capa',
  phoenix_talisman: 'Talismán de fénix',
  reagent: 'Reactivo',
  timekeeper: 'Reloj',
  dungeon_key: 'Llave de mazmorra',
  ammo: 'Munición',
  land_deed: 'Escritura de tierra',
  tool: 'Herramienta',
  landscaping_palette: 'Paleta de paisajismo',
  horse_reins: 'Riendas de caballo',
  rowboat: 'Bote de remos',
  estate_return_scroll: 'Pergamino de regreso a la propiedad',
  house_scroll: 'Pergamino de casa',
  peddler_stall: 'Puesto de buhonero',
  raid_token: 'Ficha de incursión',
};

export const slotNames = {
  head: 'Cabeza',
  main_hand: 'Mano principal',
  off_hand: 'Mano secundaria',
  chest: 'Pecho',
  hands: 'Manos',
  pants: 'Pantalones',
  boots: 'Botas',
  belt: 'Cinturón',
  neck: 'Cuello',
  ring: 'Anillo',
  ear: 'Oreja',
  back: 'Espalda',
};

export const materialNames = {
  metal: 'Metal',
  wood: 'Madera',
  leather: 'Cuero',
  flesh: 'Carne',
  cloth: 'Tela',
  stone: 'Piedra',
};

export const behaviorNames = {
  brave: 'Ataca al verte',
  timid: 'Solo responde',
};

export const mapKindNames = {
  continent: 'Continente',
  capital: 'Capital',
  city: 'Ciudad',
  town: 'Pueblo',
  sea: 'Mar',
  island: 'Isla',
};

export const attributeNames = {
  STR: 'Fuerza',
  DEX: 'Destreza',
  CON: 'Constitución',
  INT: 'Inteligencia',
  WIS: 'Sabiduría',
  CHA: 'Carisma',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
