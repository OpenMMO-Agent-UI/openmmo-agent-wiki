// Class, race, and progression data. Unlike items and monsters this is not in
// data-src/ — it lives in the server's Rust source and doc/COMBAT.md, so it is
// transcribed here and has to be re-checked when the combat doc changes.

/** Hit die by class — decides level-1 HP and how much each level-up gives. */
const HIT_DIE = {
  knight: 10, barbarian: 10, caveman: 10, valkyrie: 10,
  ranger: 8, samurai: 8, monk: 8, priest: 8,
  archaeologist: 6, healer: 6, rogue: 6, wizard: 6, bard: 6,
  tourist: 4,
  merchant: 4, guard: 10, maid: 4,
};

/** doc/COMBAT.md. Some classes adjust differently by gender. */
export const classes = [
  { id: 'barbarian', en: 'Barbarian', zh: '蠻族', variants: { M: [3, 0, 2, -2, -2, -1], F: [2, 1, 1, -2, -1, -1] } },
  { id: 'caveman', en: 'Caveman', zh: '穴居人', variants: { M: [2, 0, 2, -2, 0, -2], F: [1, 1, 1, -2, 1, -2] } },
  { id: 'knight', en: 'Knight', zh: '騎士', variants: { M: [1, -1, 1, -1, 0, 0], F: [0, 0, 0, -1, 1, 0] } },
  { id: 'valkyrie', en: 'Valkyrie', zh: '女武神', adjust: [2, 1, 1, -1, -2, -1] },
  { id: 'ranger', en: 'Ranger', zh: '遊俠', adjust: [1, 2, 0, -1, 0, -2] },
  { id: 'samurai', en: 'Samurai', zh: '武士', adjust: [1, 0, 2, -1, 0, -2] },
  { id: 'monk', en: 'Monk', zh: '武僧', adjust: [-1, 2, 0, -1, 2, -2] },
  { id: 'priest', en: 'Priest', zh: '祭司', adjust: [-1, -1, 1, -1, 3, -1] },
  { id: 'archaeologist', en: 'Archaeologist', zh: '考古學家', adjust: [-1, 1, 0, 2, 1, -3] },
  { id: 'healer', en: 'Healer', zh: '治療者', adjust: [-2, -1, 1, 1, 2, -1] },
  { id: 'rogue', en: 'Rogue', zh: '盜賊', adjust: [-1, 3, 0, 1, -1, -2] },
  { id: 'wizard', en: 'Wizard', zh: '法師', adjust: [-2, 0, -1, 3, 2, -2] },
  { id: 'tourist', en: 'Tourist', zh: '觀光客', adjust: [-1, 0, -1, 1, -1, 2] },
  { id: 'bard', en: 'Bard', zh: '吟遊詩人', adjust: [-2, 2, -1, 0, -1, 2] },
].map((c) => ({ ...c, hitDie: HIT_DIE[c.id] }));

/** NPC-only. Players cannot pick these. */
export const hiddenClasses = [
  { id: 'merchant', en: 'Merchant', zh: '商人', adjust: [-2, 0, -1, 1, -1, 3], hitDie: HIT_DIE.merchant, who: 'Rica' },
  { id: 'guard', en: 'Guard', zh: '衛兵', adjust: [2, 0, 2, -2, -1, -1], hitDie: HIT_DIE.guard, who: 'Karl' },
  { id: 'maid', en: 'Maid', zh: '女僕', adjust: [-2, 1, -1, -1, 1, 2], hitDie: HIT_DIE.maid, who: 'Miriel, Cocoly' },
];

export const races = [
  { en: 'Dwarf', zh: '矮人', hpBonus: 4 },
  { en: 'Human', zh: '人類', hpBonus: 2 },
  { en: 'Elf', zh: '精靈', hpBonus: 1 },
  { en: 'Gnome', zh: '侏儒', hpBonus: 1 },
  { en: 'Orc', zh: '獸人', hpBonus: 1 },
];

export const attributes = [
  { abbr: 'STR', en: 'Strength', zh: '力量', effect: '近戰攻擊力與命中、裝備限制、最大負重(STR × 15)' },
  { abbr: 'DEX', en: 'Dexterity', zh: '敏捷', effect: '決定 Guard(被命中的難度)、迴避、遠程攻擊' },
  { abbr: 'CON', en: 'Constitution', zh: '體質', effect: '生命值加成、生命自然回復量' },
  { abbr: 'INT', en: 'Intelligence', zh: '智力', effect: '魔法效果、技能' },
  { abbr: 'WIS', en: 'Wisdom', zh: '感知', effect: '回復力、抗性' },
  { abbr: 'CHA', en: 'Charisma', zh: '魅力', effect: 'NPC 反應、交易議價的價格帶寬度' },
];

/** Rust integer division truncates toward zero — not the same as floor for negatives. */
export const abilityModifier = (score) => Math.trunc((score - 10) / 2);

export const guardFromDex = (dex) => Math.min(20, Math.max(1, 10 + abilityModifier(dex)));

export const level1Hp = (hitDie, con, raceBonus) => hitDie + abilityModifier(con) + raceBonus;

/** doc/LEVEL_CURVE.md: cumulative XP for levels 2..=50, table-driven and paced by play time. */
const LEVEL_XP = [
  17, 76, 226, 586, 1256, 2356, 4056, 6556, 9956, 17156, 29156, 48156, 74156, 110156, 158156,
  219156, 296156, 391156, 511156, 651156, 811156, 1001156, 1231156, 1491156, 1791156, 2131156,
  2521156, 2961156, 3451156, 3991156, 4581156, 5221156, 5911156, 6661156, 7471156, 8341156,
  9271156, 10271156, 11371156, 12571156, 13771156, 15071156, 16471156, 17971156, 19571156,
  21271156, 23071156, 24971156, 26971156,
];

/** Past level 50 every level doubles the level-50 total. */
export const xpForLevel = (level) => {
  if (level <= 1) return 0;
  const top = LEVEL_XP.length + 1;
  if (level <= top) return LEVEL_XP[level - 2];
  return LEVEL_XP[LEVEL_XP.length - 1] * 2 ** (level - top);
};

/** doc/COMBAT.md: xp = 1 + level^2 + max(guard - 10, 0) x 2 */
export const monsterXp = (level, guard) => 1 + level ** 2 + Math.max(guard - 10, 0) * 2;

/**
 * Exploding d20 + bonus > guard (doc/COMBAT.md). A natural 20 rolls again
 * and adds, so every gap stays reachable instead of flooring at 0%: each
 * band of 20 needed above the first cuts the odds by another 1/20.
 */
export function hitChance(attackBonus, targetGuard) {
  const needed = targetGuard - attackBonus + 1;
  const atLeast = (t) => {
    if (t <= 1) return 1;
    if (t <= 20) return (21 - t) / 20;
    return atLeast(t - 20) / 20;
  };
  return atLeast(needed);
}

/** Expected HP change per level, up or down — E(max(roll, HD/2)) before con_mod. */
export function expectedHitDieGain(hitDie) {
  const half = hitDie / 2;
  let total = 0;
  for (let roll = 1; roll <= hitDie; roll++) total += Math.max(roll, half);
  return total / hitDie;
}
