import { Profile } from '@/types/database';

export type EvolutionTier = 0 | 1 | 2 | 3;

export interface PathEvolutionInfo {
  tier: EvolutionTier;
  tierName: string;
  currentExp: number;
  nextTierExp: number | null;
  progressPercent: number;
  description: string;
  visualEffect: string;
}

export interface CharacterEvolutionState {
  vitality: PathEvolutionInfo;
  focus: PathEvolutionInfo;
  zen: PathEvolutionInfo;
  overallStage: 1 | 2 | 3 | 4; // 1: Novice, 2: Awakened, 3: Adept, 4: Transcendent
  archetypeId: string;
  archetypeName: string;
  archetypeTitle: string;
  archetypeQuote: string;
  badgeColor: string;
  borderColor: string;
}

// EXP thresholds for each path
// Tier 0: 0 - 99 EXP
// Tier 1: 100 - 299 EXP
// Tier 2: 300 - 699 EXP
// Tier 3: 700+ EXP
export const EVOLUTION_THRESHOLDS = {
  TIER_1: 100,
  TIER_2: 300,
  TIER_3: 700,
} as const;

function calculateTier(exp: number): {
  tier: EvolutionTier;
  nextTierExp: number | null;
  progressPercent: number;
} {
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

export function getCharacterEvolution(
  stats: Partial<Pick<Profile, 'focus_exp' | 'vitality_exp' | 'mindfulness_exp' | 'discipline_exp' | 'creativity_exp'>>
): CharacterEvolutionState {
  const focusExp = stats.focus_exp || 0;
  const vitalityExp = stats.vitality_exp || 0;
  const mindfulnessExp = stats.mindfulness_exp || 0;
  const disciplineExp = stats.discipline_exp || 0;

  // Zen is a synthesis of Mindfulness (reflection) and Discipline (consistency)
  const zenExp = Math.round((mindfulnessExp * 0.6) + (disciplineExp * 0.4));

  const vitCalc = calculateTier(vitalityExp);
  const focCalc = calculateTier(focusExp);
  const zenCalc = calculateTier(zenExp);

  const vitalityInfo: PathEvolutionInfo = {
    tier: vitCalc.tier,
    tierName:
      vitCalc.tier === 3
        ? 'Titan Juggernaut'
        : vitCalc.tier === 2
        ? 'Muscular Frame'
        : vitCalc.tier === 1
        ? 'Athletic Build'
        : 'Novice Frame',
    currentExp: vitalityExp,
    nextTierExp: vitCalc.nextTierExp,
    progressPercent: vitCalc.progressPercent,
    description:
      vitCalc.tier === 3
        ? 'Heroic shoulder width, thick athletic forearms, and pro wrist wraps from dedicated gym discipline.'
        : vitCalc.tier === 2
        ? 'Broadened shoulders, defined forearms with rolled-up sleeves, and athletic wrist tape.'
        : vitCalc.tier === 1
        ? 'Subtly broadened shoulders, athletic posture, and single wrist sweatband.'
        : 'Slender, cozy student posture just beginning physical training.',
    visualEffect:
      vitCalc.tier === 3
        ? 'Titan Physique & Dual Pro Wraps'
        : vitCalc.tier === 2
        ? 'Muscular Silhouette & Rolled Sleeves'
        : vitCalc.tier === 1
        ? 'Athletic Shoulders & Sweatband'
        : 'Standard Silhouette',
  };

  const focusInfo: PathEvolutionInfo = {
    tier: focCalc.tier,
    tierName:
      focCalc.tier === 3
        ? 'Astral Archmage'
        : focCalc.tier === 2
        ? 'Cerebral Flow'
        : focCalc.tier === 1
        ? 'Spark of Insight'
        : 'Dormant Mind',
    currentExp: focusExp,
    nextTierExp: focCalc.nextTierExp,
    progressPercent: focCalc.progressPercent,
    description:
      focCalc.tier === 3
        ? 'Cosmic astral intellect nova with double radiating aura rings and orbiting celestial knowledge motes.'
        : focCalc.tier === 2
        ? 'Radiant sapphire intellect aura pulsing rhythmically behind the head with floating geometric insight runes.'
        : focCalc.tier === 1
        ? 'Soft azure luminescence and gentle glowing thought particles floating around the head.'
        : 'Calm student mind with potential waiting to be ignited through deep focus.',
    visualEffect:
      focCalc.tier === 3
        ? 'Astral Nova & Orbiting Glyphs'
        : focCalc.tier === 2
        ? 'Pulsing Sapphire Aura & Runes'
        : focCalc.tier === 1
        ? 'Soft Azure Glimmer & Motes'
        : 'None',
  };

  const zenInfo: PathEvolutionInfo = {
    tier: zenCalc.tier,
    tierName:
      zenCalc.tier === 3
        ? 'Transcendent Monk'
        : zenCalc.tier === 2
        ? 'Zen Serenity'
        : zenCalc.tier === 1
        ? 'Centered Presence'
        : 'Restless Spirit',
    currentExp: zenExp,
    nextTierExp: zenCalc.nextTierExp,
    progressPercent: zenCalc.progressPercent,
    description:
      zenCalc.tier === 3
        ? 'Multi-ringed golden mandala halo, floating lotus petals, and transcendent tranquil aura waves.'
        : zenCalc.tier === 2
        ? 'Luminous golden serenity ring hovering overhead, peaceful meditative eyes, and soft tea leaf drift.'
        : zenCalc.tier === 1
        ? 'Gentle jade warmth and peaceful serene breathing posture.'
        : 'Everyday state of mind preparing to build inner stillness and consistent habits.',
    visualEffect:
      zenCalc.tier === 3
        ? 'Mandala Lotus Halo & Zen Waves'
        : zenCalc.tier === 2
        ? 'Golden Serenity Ring & Floating Petals'
        : zenCalc.tier === 1
        ? 'Jade Serenity Glimmer'
        : 'None',
  };

  // Determine overall evolution stage (1 to 4)
  const maxTier = Math.max(vitCalc.tier, focCalc.tier, zenCalc.tier);
  const overallStage = (maxTier + 1) as 1 | 2 | 3 | 4;

  // Archetype Synthesis Logic
  let archetypeName = 'Novice Scholar';
  let archetypeId = 'novice';
  let archetypeTitle = 'Stage I • Novice Scholar';
  let archetypeQuote = 'The journey of personal transformation begins with a single focused hour.';
  let badgeColor = 'bg-stone-100 text-stone-700 border-stone-300';
  let borderColor = 'border-stone-200';

  const vT = vitCalc.tier;
  const fT = focCalc.tier;
  const zT = zenCalc.tier;

  // Tri-Hybrid Ascended Polymath
  if (vT >= 2 && fT >= 2 && zT >= 2) {
    archetypeName = 'Transcendent Polymath';
    archetypeId = 'polymath';
    archetypeTitle = 'Stage IV • Transcendent Polymath';
    archetypeQuote = 'A legendary harmony of physical titan strength, astral intellect, and unbroken zen stillness.';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse';
    borderColor = 'border-amber-300';
  }
  // Dual-Hybrid: Battle Scholar (Strength + Focus)
  else if (vT >= 2 && fT >= 2) {
    archetypeName = 'Battle Scholar';
    archetypeId = 'battle_scholar';
    archetypeTitle = `Stage ${Math.max(vT, fT) + 1} • Battle Scholar`;
    archetypeQuote = 'Forged through rigorous gym iron and intense code architecture. Mind and body move as one.';
    badgeColor = 'bg-indigo-100 text-indigo-900 border-indigo-300';
    borderColor = 'border-indigo-200';
  }
  // Dual-Hybrid: Iron Monk (Strength + Zen)
  else if (vT >= 2 && zT >= 2) {
    archetypeName = 'Iron Monk';
    archetypeId = 'iron_monk';
    archetypeTitle = `Stage ${Math.max(vT, zT) + 1} • Iron Monk`;
    archetypeQuote = 'Unflinching physical conditioning paired with absolute mental stillness. An immovable mountain.';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    borderColor = 'border-emerald-200';
  }
  // Dual-Hybrid: Mind Sage (Focus + Zen)
  else if (fT >= 2 && zT >= 2) {
    archetypeName = 'Mind Sage';
    archetypeId = 'mind_sage';
    archetypeTitle = `Stage ${Math.max(fT, zT) + 1} • Mind Sage`;
    archetypeQuote = 'Deep contemplative intellect radiating profound cosmic clarity and serene emotional peace.';
    badgeColor = 'bg-teal-100 text-teal-900 border-teal-300';
    borderColor = 'border-teal-200';
  }
  // Single Dominant: Titan Athlete
  else if (vT > fT && vT > zT && vT >= 1) {
    archetypeName = vT === 3 ? 'Titan of Vitality' : 'Iron Athlete';
    archetypeId = 'athlete';
    archetypeTitle = `Stage ${vT + 1} • ${archetypeName}`;
    archetypeQuote = 'Sculpted by relentless physical effort, workouts, and unbroken body discipline.';
    badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
    borderColor = 'border-rose-200';
  }
  // Single Dominant: Astral Savant
  else if (fT > vT && fT > zT && fT >= 1) {
    archetypeName = fT === 3 ? 'Grand Archmage' : 'Astral Savant';
    archetypeId = 'savant';
    archetypeTitle = `Stage ${fT + 1} • ${archetypeName}`;
    archetypeQuote = 'Surrounded by an undeniable aura of concentration, mathematical logic, and scholarly prowess.';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
    borderColor = 'border-blue-200';
  }
  // Single Dominant: Zen Ascetic
  else if (zT > vT && zT > fT && zT >= 1) {
    archetypeName = zT === 3 ? 'Transcendent Monk' : 'Zen Ascetic';
    archetypeId = 'monk';
    archetypeTitle = `Stage ${zT + 1} • ${archetypeName}`;
    archetypeQuote = 'Centered in unwavering calm, habit persistence, and peaceful mindfulness.';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    borderColor = 'border-emerald-200';
  }
  // Tier 1 Hybrid
  else if (vT >= 1 || fT >= 1 || zT >= 1) {
    archetypeName = 'Awakened Seeker';
    archetypeId = 'seeker';
    archetypeTitle = 'Stage II • Awakened Seeker';
    archetypeQuote = 'First manifestations of physical vigor and focused mental energy are taking shape.';
    badgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
    borderColor = 'border-sky-200';
  }

  return {
    vitality: vitalityInfo,
    focus: focusInfo,
    zen: zenInfo,
    overallStage,
    archetypeId,
    archetypeName,
    archetypeTitle,
    archetypeQuote,
    badgeColor,
    borderColor,
  };
}
