import { ItemCategory, QuestAttribute, QuestDifficulty, ShopItem } from '@/types/database';

/**
 * Non-linear RPG Progression Engine
 * Formula: XP_required(L) = floor(100 * L^1.6)
 */
export function getXpRequiredForLevel(level: number): number {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.6));
}

export function getAttributeLevel(exp: number): number {
  // Attribute levels scale every 80 * level^1.4
  let lvl = 1;
  while (exp >= Math.floor(80 * Math.pow(lvl, 1.4))) {
    exp -= Math.floor(80 * Math.pow(lvl, 1.4));
    lvl++;
  }
  return lvl;
}

export function getTitleForLevel(level: number): string {
  if (level >= 15) return 'Transcendent Grandmaster';
  if (level >= 10) return 'Grand Archmage of Focus';
  if (level >= 8) return 'Enlightened Sensei';
  if (level >= 6) return 'Sage of Concentration';
  if (level >= 5) return 'Master of Zen';
  if (level >= 4) return 'Coffee Connoisseur';
  if (level >= 3) return 'Diligent Apprentice';
  if (level >= 2) return 'Avid Reader';
  return 'Novice Scholar';
}

export interface LevelCalculationResult {
  newLevel: number;
  newCurrentXp: number;
  levelsGained: number;
  xpRequired: number;
  progressPercent: number;
}

export function processXpGain(
  startingLevel: number,
  startingCurrentXp: number,
  xpEarned: number
): LevelCalculationResult {
  let level = startingLevel;
  let currentXp = startingCurrentXp + xpEarned;
  let levelsGained = 0;

  while (true) {
    const needed = getXpRequiredForLevel(level);
    if (currentXp >= needed) {
      currentXp -= needed;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const xpRequired = getXpRequiredForLevel(level);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentXp / xpRequired) * 100)));

  return {
    newLevel: level,
    newCurrentXp: currentXp,
    levelsGained,
    xpRequired,
    progressPercent,
  };
}

export function calculateStreakUpdate(lastActiveDateStr: string | null): {
  newStreak: number;
  streakIncremented: boolean;
  todayStr: string;
} {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (!lastActiveDateStr) {
    return { newStreak: 1, streakIncremented: true, todayStr };
  }

  const lastActive = new Date(lastActiveDateStr);
  const diffTime = Math.abs(today.getTime() - lastActive.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (lastActiveDateStr === todayStr) {
    // Already active today
    return { newStreak: 0, streakIncremented: false, todayStr };
  } else if (diffDays === 1) {
    // Consecutive day
    return { newStreak: 1, streakIncremented: true, todayStr };
  } else {
    // Streak broken, reset to 1
    return { newStreak: 1, streakIncremented: true, todayStr };
  }
}

export const DIFFICULTY_CONFIG: Record<
  QuestDifficulty,
  { xp: number; coins: number; label: string; color: string }
> = {
  easy: { xp: 15, coins: 5, label: 'Easy', color: 'bg-emerald-100 text-emerald-800' },
  medium: { xp: 35, coins: 12, label: 'Medium', color: 'bg-amber-100 text-amber-800' },
  hard: { xp: 70, coins: 25, label: 'Hard', color: 'bg-orange-100 text-orange-800' },
  epic: { xp: 150, coins: 60, label: 'Epic', color: 'bg-purple-100 text-purple-800' },
};

export interface AttributeConfigItem {
  label: string;
  rpgStat: string;
  statCode: string;
  description: string;
  categoryExamples: string[];
  icon: string;
  badgeColor: string;
  barColor: string;
}

export const ATTRIBUTE_CONFIG: Record<QuestAttribute, AttributeConfigItem> = {
  focus: {
    label: 'Intellect',
    rpgStat: 'Intellect (INT)',
    statCode: 'INT',
    description: 'Coding, programming, algorithms, academic research & deep study',
    categoryExamples: ['Coding', 'Algorithms', 'Deep Study', 'Reading'],
    icon: 'Brain',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    barColor: 'bg-sky-500',
  },
  vitality: {
    label: 'Strength',
    rpgStat: 'Strength (STR)',
    statCode: 'STR',
    description: 'Gym workouts, weightlifting, cardio, sports, hydration & sleep',
    categoryExamples: ['Gym', 'Weightlifting', 'Cardio', 'Hydration'],
    icon: 'Dumbbell',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    barColor: 'bg-rose-500',
  },
  mindfulness: {
    label: 'Wisdom',
    rpgStat: 'Wisdom (WIS)',
    statCode: 'WIS',
    description: 'Meditation, journaling, breathwork, reflection & zen mindfulness',
    categoryExamples: ['Meditation', 'Journaling', 'Breathwork', 'Zen'],
    icon: 'Sparkles',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    barColor: 'bg-teal-500',
  },
  creativity: {
    label: 'Creativity',
    rpgStat: 'Creativity (CRT)',
    statCode: 'CRT',
    description: 'Digital art, UI/UX design, music composition & creative writing',
    categoryExamples: ['UI Design', 'Digital Art', 'Music', 'Writing'],
    icon: 'Palette',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    barColor: 'bg-indigo-500',
  },
  discipline: {
    label: 'Willpower',
    rpgStat: 'Willpower (WIL)',
    statCode: 'WIL',
    description: 'Daily recurring habits, tidy workspace, morning routines & grit',
    categoryExamples: ['Tidy Desk', 'Morning Routine', 'Inbox Zero', 'Chores'],
    icon: 'Shield',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    barColor: 'bg-amber-500',
  },
};

export const SHOP_CATALOGUE: ShopItem[] = [
  // Hoodies & Apparel
  {
    id: 'knit_sweater',
    name: 'Cozy Knit Sweater',
    description: 'Warm, soft cable-knit sweater made for rainy afternoons.',
    category: 'hoodie',
    cost: 0,
    levelRequired: 1,
    icon: 'Shirt',
    previewColor: '#8D6E63',
  },
  {
    id: 'matcha_hoodie',
    name: 'Matcha Oversized Hoodie',
    description: 'Soothing sage green hoodie that promotes calm concentration.',
    category: 'hoodie',
    cost: 50,
    levelRequired: 2,
    icon: 'Shirt',
    previewColor: '#66BB6A',
    bonusText: '+5% Focus XP',
  },
  {
    id: 'lavender_hoodie',
    name: 'Dusk Lavender Hoodie',
    description: 'Pastel purple hoodie woven with evening study calmness.',
    category: 'hoodie',
    cost: 80,
    levelRequired: 3,
    icon: 'Shirt',
    previewColor: '#AB47BC',
    bonusText: '+5% Mindfulness XP',
  },
  {
    id: 'midnight_jacket',
    name: 'Midnight Velvet Bomber',
    description: 'A sleek deep navy bomber jacket for late-night deep work.',
    category: 'hoodie',
    cost: 150,
    levelRequired: 5,
    icon: 'Shirt',
    previewColor: '#1A237E',
    bonusText: '+10% All XP',
  },

  // Headphones
  {
    id: 'studio_hifi',
    name: 'Studio Hi-Fi Over-Ears',
    description: 'Sound-dampening over-ear headphones for immersive flow.',
    category: 'headphones',
    cost: 60,
    levelRequired: 2,
    icon: 'Headphones',
    previewColor: '#455A64',
  },
  {
    id: 'cat_ear_headset',
    name: 'Lo-Fi Cat-Ear Headset',
    description: 'Playful headset with subtle glowing pink ears.',
    category: 'headphones',
    cost: 110,
    levelRequired: 4,
    icon: 'Headphones',
    previewColor: '#F06292',
    bonusText: '+10% Pomodoro XP',
  },

  // Glasses
  {
    id: 'wireframe_rounds',
    name: 'Wireframe Round Glasses',
    description: 'Classic intellectual round glasses for deep study.',
    category: 'glasses',
    cost: 40,
    levelRequired: 1,
    icon: 'Glasses',
    previewColor: '#FFB300',
  },
  {
    id: 'tortoise_frames',
    name: 'Tortoiseshell Readers',
    description: 'Vintage acetate frames that radiate academic wisdom.',
    category: 'glasses',
    cost: 75,
    levelRequired: 3,
    icon: 'Glasses',
    previewColor: '#6D4C41',
  },

  // Pets & Companions
  {
    id: 'calico_cat',
    name: 'Mochi the Calico Cat',
    description: 'A sweet sleeping calico cat curled up beside your notebook.',
    category: 'pet',
    cost: 75,
    levelRequired: 2,
    icon: 'Cat',
    previewColor: '#FF8A65',
    bonusText: 'Purrs during focus timer',
  },
  {
    id: 'shiba_inu',
    name: 'Hachi the Shiba Inu',
    description: 'An attentive, smiling pup that stays loyal by your desk.',
    category: 'pet',
    cost: 130,
    levelRequired: 4,
    icon: 'Dog',
    previewColor: '#FFA726',
    bonusText: '+15% Streak Multiplier',
  },
  {
    id: 'sleepy_owl',
    name: 'Kuro the Night Owl',
    description: 'A wise little owl perched on your study lamp.',
    category: 'pet',
    cost: 200,
    levelRequired: 6,
    icon: 'Bird',
    previewColor: '#78909C',
    bonusText: '+20% Coins from Epic quests',
  },

  // Room Themes
  {
    id: 'lofi_day',
    name: 'Morning Sunlight Tavern',
    description: 'Warm morning rays filtering through the curtains.',
    category: 'theme',
    cost: 0,
    levelRequired: 1,
    icon: 'Sun',
    previewColor: '#FFF8E1',
  },
  {
    id: 'rainy_evening',
    name: 'Rainy Cafe Window',
    description: 'Gentle raindrops running down the window pane at dusk.',
    category: 'theme',
    cost: 90,
    levelRequired: 3,
    icon: 'CloudRain',
    previewColor: '#ECEFF1',
  },
  {
    id: 'midnight_stars',
    name: 'Starlit Celestial Attic',
    description: 'Cozy loft bathed in moonlight and starry skies.',
    category: 'theme',
    cost: 180,
    levelRequired: 5,
    icon: 'Moon',
    previewColor: '#263238',
  },
];
