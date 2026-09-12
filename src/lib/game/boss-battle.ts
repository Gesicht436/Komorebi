import { QuestDifficulty, BossBattle } from '@/types/database';

export interface BossConfig {
  name: string;
  title: string;
  type: 'dragon' | 'golem' | 'specter';
  max_hp: number;
  reward_xp: number;
  reward_coins: number;
  reward_item_id: string;
  reward_item_name: string;
  description: string;
  accentColor: string;
}

export const BOSS_PRESETS: Record<'dragon' | 'golem' | 'specter', BossConfig> = {
  dragon: {
    name: 'Ignis, the Procrastination Wyrm',
    title: 'Ancient Beast of Delay & Distraction',
    type: 'dragon',
    max_hp: 500,
    reward_xp: 150,
    reward_coins: 100,
    reward_item_id: 'dragon_quill',
    reward_item_name: 'Dragon Fang Feather Quill',
    description: 'A colossal fiery dragon fed on postponed tasks and lingering doubts.',
    accentColor: '#E65100',
  },
  golem: {
    name: 'Chronos, the Deadline Golem',
    title: 'Relentless Titan of Stolen Hours',
    type: 'golem',
    max_hp: 750,
    reward_xp: 250,
    reward_coins: 180,
    reward_item_id: 'time_watch',
    reward_item_name: 'Sands of Time Pocketwatch',
    description: 'An unstoppable obsidian automaton forged from ticking clock gears.',
    accentColor: '#4A148C',
  },
  specter: {
    name: 'Phantasma, the Burnout Specter',
    title: 'Shadow of Overwork & Fatigue',
    type: 'specter',
    max_hp: 1000,
    reward_xp: 350,
    reward_coins: 250,
    reward_item_id: 'zen_crown',
    reward_item_name: 'Luminescent Zen Lotus Crown',
    description: 'A shadowy wraith that feeds on chaotic multitasking and neglected rest.',
    accentColor: '#004D40',
  },
};

export const BOSS_DAMAGE_WEIGHTS = {
  QUEST_EPIC: 80,
  QUEST_HARD: 50,
  QUEST_MEDIUM: 30,
  QUEST_EASY: 15,
  POMODORO_INTERVAL: 45, // per 25 min
  HABIT_TICK: 10,
};

export function getTaskDamage(difficulty: QuestDifficulty): number {
  switch (difficulty) {
    case 'epic':
      return BOSS_DAMAGE_WEIGHTS.QUEST_EPIC;
    case 'hard':
      return BOSS_DAMAGE_WEIGHTS.QUEST_HARD;
    case 'medium':
      return BOSS_DAMAGE_WEIGHTS.QUEST_MEDIUM;
    case 'easy':
    default:
      return BOSS_DAMAGE_WEIGHTS.QUEST_EASY;
  }
}

export function getPomoDamage(durationMinutes: number): number {
  const intervals = Math.max(1, Math.round(durationMinutes / 25));
  return intervals * BOSS_DAMAGE_WEIGHTS.POMODORO_INTERVAL;
}

export function getHabitDamage(): number {
  return BOSS_DAMAGE_WEIGHTS.HABIT_TICK;
}

export function createDefaultBossBattle(userId: string, type: 'dragon' | 'golem' | 'specter' = 'dragon'): BossBattle {
  const cfg = BOSS_PRESETS[type] || BOSS_PRESETS.dragon;
  return {
    id: `boss-${Date.now()}`,
    user_id: userId,
    boss_name: cfg.name,
    boss_title: cfg.title,
    boss_type: cfg.type,
    max_hp: cfg.max_hp,
    current_hp: cfg.max_hp,
    is_defeated: false,
    reward_xp: cfg.reward_xp,
    reward_coins: cfg.reward_coins,
    reward_item_id: cfg.reward_item_id,
    reward_item_name: cfg.reward_item_name,
    target_deadline: null,
    created_at: new Date().toISOString(),
    defeated_at: null,
  };
}
