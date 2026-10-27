// Portuguese names. Same export shape as zh.js and ko.js.
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
  accessory: 'Acessório',
  food: 'Comida',
  drink: 'Bebida',
  fish: 'Peixe cru',
  junk: 'Sucata',
  coin_catch: 'Moedas pescadas',
  currency: 'Moeda',
  healing_potion: 'Poção de cura',
  return_scroll: 'Pergaminho de retorno',
  enchant_scroll: 'Pergaminho de encantamento',
  enchant_armor_scroll: 'Pergaminho de encantar armadura',
  party_summon_scroll: 'Pergaminho de invocação de grupo',
  instrument: 'Instrumento',
  furniture: 'Móvel',
  fishing_rod: 'Equipamento de pesca',
  campfire_kit: 'Kit de fogueira',
  tip_hat: 'Chapéu de gorjetas',
  cape_dye: 'Tinta de capa',
  cape_texture: 'Estampa de capa',
  phoenix_talisman: 'Talismã da fênix',
  reagent: 'Reagente',
  timekeeper: 'Relógio',
  dungeon_key: 'Chave de masmorra',
  ammo: 'Munição',
  land_deed: 'Escritura de terra',
  tool: 'Ferramenta',
  landscaping_palette: 'Paleta de paisagismo',
  horse_reins: 'Rédeas de cavalo',
  rowboat: 'Barco a remo',
  estate_return_scroll: 'Pergaminho de retorno à propriedade',
  house_scroll: 'Pergaminho de casa',
  peddler_stall: 'Barraca de mascate',
  raid_token: 'Ficha de raide',
};

export const slotNames = {
  head: 'Cabeça',
  main_hand: 'Mão principal',
  off_hand: 'Mão secundária',
  chest: 'Peito',
  hands: 'Mãos',
  pants: 'Calças',
  boots: 'Botas',
  belt: 'Cinto',
  neck: 'Pescoço',
  ring: 'Anel',
  ear: 'Orelha',
  back: 'Costas',
};

export const materialNames = {
  metal: 'Metal',
  wood: 'Madeira',
  leather: 'Couro',
  flesh: 'Carne',
  cloth: 'Tecido',
  stone: 'Pedra',
};

export const behaviorNames = {
  brave: 'Ataca ao ver',
  timid: 'Só revida',
};

export const mapKindNames = {
  continent: 'Continente',
  capital: 'Capital',
  city: 'Cidade',
  town: 'Vila',
  sea: 'Mar',
  island: 'Ilha',
};

export const attributeNames = {
  STR: 'Força',
  DEX: 'Destreza',
  CON: 'Constituição',
  INT: 'Inteligência',
  WIS: 'Sabedoria',
  CHA: 'Carisma',
};

export const itemName = (id) => itemNames[id] ?? id;
export const monsterName = (id) => monsterNames[id] ?? id;
export const debuffName = (id) => debuffNames[id] ?? id;
