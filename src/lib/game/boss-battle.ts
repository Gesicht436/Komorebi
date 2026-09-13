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

export const WEEKLY_BOSS_ORDER: ('dragon' | 'golem' | 'specter')[] = ['dragon', 'golem', 'specter'];

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

/**
 * Calculates the next weekly reset date (Sunday 23:59:59 UTC) formatted as YYYY-MM-DD
 */
export function getWeeklyResetDeadline(baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  const day = d.getUTCDay(); // 0 is Sunday
  const daysRemaining = (7 - day) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + daysRemaining);
  return d.toISOString().split('T')[0];
}

/**
 * Deterministically picks the boss type for the current calendar week
 */
export function getBossTypeForWeek(date: Date = new Date()): 'dragon' | 'golem' | 'specter' {
  const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_BOSS_ORDER[weekNumber % WEEKLY_BOSS_ORDER.length];
}

/**
 * Determines if a weekly raid boss has expired and needs refreshing
 */
export function isWeeklyRaidExpired(boss: BossBattle | null | undefined): boolean {
  if (!boss) return true;
  const todayStr = new Date().toISOString().split('T')[0];
  if (boss.target_deadline) {
    return todayStr > boss.target_deadline;
  }
  const createdAt = new Date(boss.created_at).getTime();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt > oneWeekMs;
}

/**
 * Returns a user-facing formatted countdown for the weekly event
 */
export function getWeeklyCountdown(targetDeadline?: string | null): {
  days: number;
  hours: number;
  formatted: string;
} {
  if (!targetDeadline) {
    return { days: 7, hours: 0, formatted: '7d left' };
  }
  const deadlineTime = new Date(`${targetDeadline}T23:59:59Z`).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, deadlineTime - now);
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days === 0 && hours === 0) {
    return { days: 0, hours: 0, formatted: 'Resetting soon' };
  }
  if (days === 0) {
    return { days: 0, hours, formatted: `${hours}h left` };
  }
  return { days, hours, formatted: `${days}d ${hours}h left` };
}

/**
 * Standard RFC4122 v4 UUID generator compatible with Postgres uuid columns
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createDefaultBossBattle(
  userId: string,
  type?: 'dragon' | 'golem' | 'specter',
  targetDeadline?: string
): BossBattle {
  const chosenType = type || getBossTypeForWeek(new Date());
  const cfg = BOSS_PRESETS[chosenType] || BOSS_PRESETS.dragon;
  const deadline = targetDeadline || getWeeklyResetDeadline(new Date());
  return {
    id: generateUuid(),
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
    target_deadline: deadline,
    created_at: new Date().toISOString(),
    defeated_at: null,
  };
}
