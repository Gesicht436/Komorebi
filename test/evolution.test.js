import assert from 'node:assert';

const EVOLUTION_THRESHOLDS = {
  TIER_1: 100,
  TIER_2: 300,
  TIER_3: 700,
};

function calculateTier(exp) {
  if (exp >= EVOLUTION_THRESHOLDS.TIER_3) {
    return { tier: 3, nextTierExp: null, progressPercent: 100 };
  }
  if (exp >= EVOLUTION_THRESHOLDS.TIER_2) {
    const range = EVOLUTION_THRESHOLDS.TIER_3 - EVOLUTION_THRESHOLDS.TIER_2;
    const current = exp - EVOLUTION_THRESHOLDS.TIER_2;
    return {
      tier: 2,
      nextTierExp: EVOLUTION_THRESHOLDS.TIER_3,
      progressPercent: Math.min(100, Math.floor((current / range) * 100)),
    };
  }
  if (exp >= EVOLUTION_THRESHOLDS.TIER_1) {
    const range = EVOLUTION_THRESHOLDS.TIER_2 - EVOLUTION_THRESHOLDS.TIER_1;
    const current = exp - EVOLUTION_THRESHOLDS.TIER_1;
    return {
      tier: 1,
      nextTierExp: EVOLUTION_THRESHOLDS.TIER_2,
      progressPercent: Math.min(100, Math.floor((current / range) * 100)),
    };
  }
  return {
    tier: 0,
    nextTierExp: EVOLUTION_THRESHOLDS.TIER_1,
    progressPercent: Math.min(100, Math.floor((exp / EVOLUTION_THRESHOLDS.TIER_1) * 100)),
  };
}

function getCharacterEvolution(stats) {
  const focusExp = stats.focus_exp || 0;
  const vitalityExp = stats.vitality_exp || 0;
  const mindfulnessExp = stats.mindfulness_exp || 0;
  const disciplineExp = stats.discipline_exp || 0;

  const zenExp = Math.round((mindfulnessExp * 0.6) + (disciplineExp * 0.4));

  const vitCalc = calculateTier(vitalityExp);
  const focCalc = calculateTier(focusExp);
  const zenCalc = calculateTier(zenExp);

  const vT = vitCalc.tier;
  const fT = focCalc.tier;
  const zT = zenCalc.tier;

  let archetypeName = 'Novice Scholar';
  let archetypeId = 'novice';

  if (vT >= 2 && fT >= 2 && zT >= 2) {
    archetypeName = 'Transcendent Polymath';
    archetypeId = 'polymath';
  } else if (vT >= 2 && fT >= 2) {
    archetypeName = 'Battle Scholar';
    archetypeId = 'battle_scholar';
  } else if (vT >= 2 && zT >= 2) {
    archetypeName = 'Iron Monk';
    archetypeId = 'iron_monk';
  } else if (fT >= 2 && zT >= 2) {
    archetypeName = 'Mind Sage';
    archetypeId = 'mind_sage';
  } else if (vT > fT && vT > zT && vT >= 1) {
    archetypeName = vT === 3 ? 'Titan of Vitality' : 'Iron Athlete';
    archetypeId = 'athlete';
  } else if (fT > vT && fT > zT && fT >= 1) {
    archetypeName = fT === 3 ? 'Grand Archmage' : 'Astral Savant';
    archetypeId = 'savant';
  } else if (zT > vT && zT > fT && zT >= 1) {
    archetypeName = zT === 3 ? 'Transcendent Monk' : 'Zen Ascetic';
    archetypeId = 'monk';
  } else if (vT >= 1 || fT >= 1 || zT >= 1) {
    archetypeName = 'Awakened Seeker';
    archetypeId = 'seeker';
  }

  return {
    vitalityTier: vT,
    focusTier: fT,
    zenTier: zT,
    archetypeName,
    archetypeId,
  };
}

console.log('Testing Character Evolution Mathematical Logic...');

// 1. Novice test
const nov = getCharacterEvolution({ focus_exp: 0, vitality_exp: 0, mindfulness_exp: 0, discipline_exp: 0 });
assert.strictEqual(nov.vitalityTier, 0);
assert.strictEqual(nov.focusTier, 0);
assert.strictEqual(nov.zenTier, 0);
assert.strictEqual(nov.archetypeId, 'novice');
console.log('✓ Novice Scholar baseline confirmed (Tier 0 across all paths)');

// 2. Heavy Gym test (Vitality dominant)
const gym = getCharacterEvolution({ focus_exp: 50, vitality_exp: 750, mindfulness_exp: 20, discipline_exp: 30 });
assert.strictEqual(gym.vitalityTier, 3);
assert.strictEqual(gym.archetypeId, 'athlete');
assert.strictEqual(gym.archetypeName, 'Titan of Vitality');
console.log('✓ Heavy Gym progression confirmed (Titan of Vitality, Tier 3 Muscle)');

// 3. Heavy Study test (Focus dominant)
const study = getCharacterEvolution({ focus_exp: 800, vitality_exp: 40, mindfulness_exp: 50, discipline_exp: 40 });
assert.strictEqual(study.focusTier, 3);
assert.strictEqual(study.archetypeId, 'savant');
assert.strictEqual(study.archetypeName, 'Grand Archmage');
console.log('✓ Heavy Study progression confirmed (Grand Archmage, Tier 3 Intellect Aura)');

// 4. Heavy Discipline / Mindfulness test (Zen Monk dominant)
const zen = getCharacterEvolution({ focus_exp: 30, vitality_exp: 30, mindfulness_exp: 750, discipline_exp: 750 });
assert.strictEqual(zen.zenTier, 3);
assert.strictEqual(zen.archetypeId, 'monk');
assert.strictEqual(zen.archetypeName, 'Transcendent Monk');
console.log('✓ Heavy Discipline progression confirmed (Transcendent Monk, Tier 3 Lotus Halo)');

// 5. Battle Scholar Dual Hybrid (Gym + Study)
const hybrid = getCharacterEvolution({ focus_exp: 450, vitality_exp: 420, mindfulness_exp: 50, discipline_exp: 50 });
assert.strictEqual(hybrid.vitalityTier, 2);
assert.strictEqual(hybrid.focusTier, 2);
assert.strictEqual(hybrid.archetypeId, 'battle_scholar');
console.log('✓ Dual-Specialization confirmed (Battle Scholar: Muscular Physique + Cerebral Aura)');

// 6. Transcendent Polymath Tri-Hybrid
const polymath = getCharacterEvolution({ focus_exp: 720, vitality_exp: 750, mindfulness_exp: 710, discipline_exp: 700 });
assert.strictEqual(polymath.archetypeId, 'polymath');
console.log('✓ Supreme Ascended Polymath confirmed (High across all 3 disciplines)');

console.log('All 6 Character Evolution tests passed with 100% precision!');
