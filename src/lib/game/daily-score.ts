import { QuestDifficulty, Profile } from '@/types/database';

export const DAILY_SCORE_MAX = 100;

export const DAILY_SCORE_WEIGHTS = {
  // Focus intervals (scaled up to 40 max)
  POMO_SESSION_POINTS: 10,
  MAX_FOCUS_POINTS: 40,

  // Tasks & Quests by difficulty (up to 60+ points)
  QUEST_DIFFICULTY_POINTS: {
    epic: 25, // Heavy 3-hour learning / major milestone
    hard: 20, // Demanding 1-2 hour problem solving / intense workout
    medium: 12, // Standard daily quest (30-45 mins)
    easy: 6, // Quick checklist item / hydration / tidy space
  } as Record<QuestDifficulty, number>,

  // Habit positive streak tick
  HABIT_TICK_POINTS: 4,

  // Milestones & High Score Rewards
  MILESTONES: {
    RANK_A: {
      id: 'milestone_rank_a',
      threshold: 80,
      name: 'Rank A • Deep Effectiveness',
      coinBonus: 15,
      xpBonus: 30,
    },
    RANK_S: {
      id: 'milestone_rank_s',
      threshold: 100,
      name: 'Rank S • Perfectionist Mastery',
      coinBonus: 25,
      xpBonus: 50,
    },
  },
} as const;

export type DailyScoreRank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface DailyScoreGradeInfo {
  rank: DailyScoreRank;
  title: string;
  description: string;
  badgeClass: string;
  ringColor: string;
  textColor: string;
}

export function getDailyScoreGrade(score: number): DailyScoreGradeInfo {
  const clamped = Math.max(0, Math.min(DAILY_SCORE_MAX, score));
  if (clamped >= 95) {
    return {
      rank: 'S',
      title: 'Transcendent Mastery',
      description: 'Flawless execution across deep focus and key priorities.',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400 animate-pulse',
      ringColor: '#F59E0B',
      textColor: 'text-amber-600',
    };
  }
  if (clamped >= 80) {
    return {
      rank: 'A',
      title: 'Deep Effectiveness',
      description: 'Superb dedication! Major objectives achieved today.',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      ringColor: '#10B981',
      textColor: 'text-emerald-600',
    };
  }
  if (clamped >= 65) {
    return {
      rank: 'B',
      title: 'Solid Momentum',
      description: 'Steady productivity with meaningful headway made.',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      ringColor: '#3B82F6',
      textColor: 'text-blue-600',
    };
  }
  if (clamped >= 40) {
    return {
      rank: 'C',
      title: 'Building Flow',
      description: 'Good starter momentum. Keep pushing to break into Rank B.',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      ringColor: '#8B5CF6',
      textColor: 'text-purple-600',
    };
  }
  return {
    rank: 'D',
    title: 'Warming Up',
    description: 'The desk is ready. Complete tasks and focus intervals to climb.',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    ringColor: '#D7CCC8',
    textColor: 'text-stone-500',
  };
}

export function getTaskScorePoints(difficulty: QuestDifficulty): number {
  return DAILY_SCORE_WEIGHTS.QUEST_DIFFICULTY_POINTS[difficulty] || 12;
}

export function getPomoScorePoints(durationMinutes: number): number {
  // 10 pts per standard 25-min session, scaled proportionally
  const points = Math.round((durationMinutes / 25) * DAILY_SCORE_WEIGHTS.POMO_SESSION_POINTS);
  return Math.max(5, points);
}

/**
 * Check if the daily score should be reset for a new calendar day
 */
export function checkDailyScoreReset(lastScoreDate?: string | null): {
  shouldReset: boolean;
  todayStr: string;
} {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!lastScoreDate || lastScoreDate !== todayStr) {
    return { shouldReset: true, todayStr };
  }
  return { shouldReset: false, todayStr };
}

/**
 * Check and calculate unlocked milestones when score changes
 */
export function evaluateScoreMilestones(
  newScore: number,
  alreadyClaimed: string[] = []
): {
  unlockedMilestones: string[];
  bonusCoins: number;
  bonusXp: number;
  notificationMessages: string[];
} {
  const unlocked: string[] = [];
  let bonusCoins = 0;
  let bonusXp = 0;
  const notificationMessages: string[] = [];

  const { RANK_A, RANK_S } = DAILY_SCORE_WEIGHTS.MILESTONES;

  if (newScore >= RANK_A.threshold && !alreadyClaimed.includes(RANK_A.id)) {
    unlocked.push(RANK_A.id);
    bonusCoins += RANK_A.coinBonus;
    bonusXp += RANK_A.xpBonus;
    notificationMessages.push(`🌟 Rank A Achieved! +${RANK_A.coinBonus} 🪙 and +${RANK_A.xpBonus} XP bonus!`);
  }

  if (newScore >= RANK_S.threshold && !alreadyClaimed.includes(RANK_S.id)) {
    unlocked.push(RANK_S.id);
    bonusCoins += RANK_S.coinBonus;
    bonusXp += RANK_S.xpBonus;
    notificationMessages.push(`👑 Rank S Perfection Achieved! +${RANK_S.coinBonus} 🪙 and +${RANK_S.xpBonus} XP bonus!`);
  }

  return {
    unlockedMilestones: unlocked,
    bonusCoins,
    bonusXp,
    notificationMessages,
  };
}
