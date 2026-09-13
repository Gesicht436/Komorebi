import { Quest, ActivityLog } from '@/types/database';

export interface CalendarDayInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  completedCount: number;
  plannedCount: number;
  score: number;
}

export interface HeatmapDay {
  dateStr: string; // YYYY-MM-DD
  count: number;
  score: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapWeek {
  days: (HeatmapDay | null)[];
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD string into a friendly localized string
 */
export function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Checks if two date strings represent the same day
 */
export function isSameDay(d1: string, d2: string): boolean {
  return d1.slice(0, 10) === d2.slice(0, 10);
}

/**
 * Generates the full 35 or 42 calendar cells for a given month
 */
export function getMonthMatrix(
  year: number,
  month: number, // 0-11
  quests: Quest[] = [],
  activityLogs: ActivityLog[] = []
): CalendarDayInfo[] {
  const todayStr = getTodayDateStr();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const matrix: CalendarDayInfo[] = [];

  // 1. Previous month padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNumber);
    const dateStr = formatYmd(prevMonthDate);
    const summary = getDayQuestSummary(quests, activityLogs, dateStr);

    matrix.push({
      dateStr,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
      ...summary,
    });
  }

  // 2. Current month days
  for (let dayNumber = 1; dayNumber <= daysInCurrentMonth; dayNumber++) {
    const curDate = new Date(year, month, dayNumber);
    const dateStr = formatYmd(curDate);
    const summary = getDayQuestSummary(quests, activityLogs, dateStr);

    matrix.push({
      dateStr,
      dayNumber,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
      ...summary,
    });
  }

  // 3. Next month padding days to complete 7-day rows (up to 35 or 42 cells)
  const totalCells = matrix.length <= 35 ? 35 : 42;
  const remaining = totalCells - matrix.length;
  for (let dayNumber = 1; dayNumber <= remaining; dayNumber++) {
    const nextMonthDate = new Date(year, month + 1, dayNumber);
    const dateStr = formatYmd(nextMonthDate);
    const summary = getDayQuestSummary(quests, activityLogs, dateStr);

    matrix.push({
      dateStr,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
      ...summary,
    });
  }

  return matrix;
}

function formatYmd(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns completed and planned counts plus total daily score for a given day
 */
export function getDayQuestSummary(
  quests: Quest[],
  activityLogs: ActivityLog[],
  dateStr: string
): { completedCount: number; plannedCount: number; score: number } {
  let completedCount = 0;
  let plannedCount = 0;
  let score = 0;

  // Check quests completed on this date
  for (const q of quests) {
    if (q.completed_at && q.completed_at.slice(0, 10) === dateStr) {
      completedCount++;
    } else if (q.due_date && q.due_date.slice(0, 10) === dateStr) {
      if (q.is_completed) {
        completedCount++;
      } else {
        plannedCount++;
      }
    }
  }

  // Check activity logs for score earned on this date
  for (const log of activityLogs) {
    if (log.created_at && log.created_at.slice(0, 10) === dateStr) {
      if (log.action_type === 'quest_completed' || log.action_type === 'pomo_finished') {
        const gainedScore = (log.metadata?.daily_score_gained as number) || 0;
        score += gainedScore;
      }
    }
  }

  return { completedCount, plannedCount, score };
}

/**
 * Filters the list of quests associated with a specific calendar date
 */
export function getQuestsForDate(
  quests: Quest[],
  activityLogs: ActivityLog[],
  targetDateStr: string
): Quest[] {
  const todayStr = getTodayDateStr();

  if (targetDateStr === todayStr) {
    // Today: show active quests, quests due today, and quests completed today
    return quests.filter((q) => {
      if (q.due_date && q.due_date.slice(0, 10) === todayStr) return true;
      if (q.completed_at && q.completed_at.slice(0, 10) === todayStr) return true;
      // If no explicit due_date, include if not completed or completed today
      if (!q.due_date) {
        if (!q.is_completed) return true;
        if (q.completed_at && q.completed_at.slice(0, 10) === todayStr) return true;
      }
      return false;
    });
  }

  if (targetDateStr > todayStr) {
    // Future: show quests explicitly scheduled for this future date
    return quests.filter((q) => q.due_date && q.due_date.slice(0, 10) === targetDateStr);
  }

  // Past: show quests completed on that date or due and completed on that date
  const matched = quests.filter((q) => {
    if (q.completed_at && q.completed_at.slice(0, 10) === targetDateStr) return true;
    if (q.due_date && q.due_date.slice(0, 10) === targetDateStr && q.is_completed) return true;
    return false;
  });

  return matched;
}

/**
 * Generates 52-53 weeks of activity data for the GitHub-style Yearly Heatmap
 */
export function getYearlyHeatmapWeeks(
  quests: Quest[] = [],
  activityLogs: ActivityLog[] = []
): { weeks: HeatmapWeek[]; monthLabels: { label: string; weekIndex: number }[] } {
  const today = new Date();
  const weeks: HeatmapWeek[] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];

  // Start 52 weeks ago on Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  const startDay = startDate.getDay(); // 0 is Sunday
  startDate.setDate(startDate.getDate() - startDay); // Roll back to preceding Sunday

  let currentDate = new Date(startDate);
  let currentWeek: (HeatmapDay | null)[] = [];
  let lastMonth = -1;
  let weekIndex = 0;

  while (currentDate <= today || currentWeek.length > 0) {
    const curYmd = formatYmd(currentDate);
    const summary = getDayQuestSummary(quests, activityLogs, curYmd);

    // Calculate level (0 to 4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (summary.completedCount >= 4 || summary.score >= 75) {
      level = 4;
    } else if (summary.completedCount >= 3 || summary.score >= 50) {
      level = 3;
    } else if (summary.completedCount >= 2 || summary.score >= 25) {
      level = 2;
    } else if (summary.completedCount >= 1 || summary.score > 0) {
      level = 1;
    }

    const monthNum = currentDate.getMonth();
    if (monthNum !== lastMonth && currentWeek.length === 0) {
      monthLabels.push({
        label: currentDate.toLocaleDateString('en-US', { month: 'short' }),
        weekIndex,
      });
      lastMonth = monthNum;
    }

    currentWeek.push({
      dateStr: curYmd,
      count: summary.completedCount,
      score: summary.score,
      level,
    });

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
      weekIndex++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate > today && currentWeek.length === 0) {
      break;
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push({ days: currentWeek });
  }

  return { weeks, monthLabels };
}
