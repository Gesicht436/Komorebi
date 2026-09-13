import assert from 'node:assert';

function getTodayDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatYmd(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayQuestSummary(quests, activityLogs, dateStr) {
  let completedCount = 0;
  let plannedCount = 0;
  let score = 0;

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

  for (const log of activityLogs) {
    if (log.created_at && log.created_at.slice(0, 10) === dateStr) {
      if (log.action_type === 'quest_completed' || log.action_type === 'pomo_finished') {
        const gainedScore = log.metadata?.daily_score_gained || 0;
        score += gainedScore;
      }
    }
  }

  return { completedCount, plannedCount, score };
}

function getMonthMatrix(year, month, quests = [], activityLogs = []) {
  const todayStr = getTodayDateStr();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const matrix = [];

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

function getQuestsForDate(quests, activityLogs, targetDateStr) {
  const todayStr = getTodayDateStr();

  if (targetDateStr === todayStr) {
    return quests.filter((q) => {
      if (q.due_date && q.due_date.slice(0, 10) === todayStr) return true;
      if (q.completed_at && q.completed_at.slice(0, 10) === todayStr) return true;
      if (!q.due_date) {
        if (!q.is_completed) return true;
        if (q.completed_at && q.completed_at.slice(0, 10) === todayStr) return true;
      }
      return false;
    });
  }

  if (targetDateStr > todayStr) {
    return quests.filter((q) => q.due_date && q.due_date.slice(0, 10) === targetDateStr);
  }

  return quests.filter((q) => {
    if (q.completed_at && q.completed_at.slice(0, 10) === targetDateStr) return true;
    if (q.due_date && q.due_date.slice(0, 10) === targetDateStr && q.is_completed) return true;
    return false;
  });
}

console.log('--- 1. Testing Month Matrix Generation ---');
const matrix = getMonthMatrix(2026, 8); // Sep 2026
assert(matrix.length === 35 || matrix.length === 42, 'Matrix must have 35 or 42 cells');
assert.strictEqual(matrix.length % 7, 0, 'Matrix must have full 7-day rows');
const sep13 = matrix.find((d) => d.dateStr === '2026-09-13');
assert(sep13 !== undefined, 'Sep 13, 2026 must be present in the matrix');
console.log(`Month matrix has ${matrix.length} cells. Sep 13 cell:`, sep13);

console.log('--- 2. Testing Date-Based Quest Filtering ---');
const todayStr = getTodayDateStr();
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = formatYmd(tomorrowDate);

const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterdayStr = formatYmd(yesterdayDate);

const sampleQuests = [
  { id: 'q1', title: "Today's Focus", is_completed: false, due_date: null, completed_at: null },
  { id: 'q2', title: "Today's Due", is_completed: false, due_date: todayStr, completed_at: null },
  { id: 'q3', title: "Finished Yesterday", is_completed: true, due_date: yesterdayStr, completed_at: `${yesterdayStr}T10:00:00Z` },
  { id: 'q4', title: "Scheduled Tomorrow", is_completed: false, due_date: tomorrowStr, completed_at: null },
];

const todayQuests = getQuestsForDate(sampleQuests, [], todayStr);
console.log(`Today's quests count: ${todayQuests.length}`);
assert(todayQuests.some((q) => q.id === 'q1'));
assert(todayQuests.some((q) => q.id === 'q2'));
assert(!todayQuests.some((q) => q.id === 'q4'), "Tomorrow's quest should not appear under Today");

const tomorrowQuests = getQuestsForDate(sampleQuests, [], tomorrowStr);
console.log(`Tomorrow's planned quests count: ${tomorrowQuests.length}`);
assert.strictEqual(tomorrowQuests.length, 1);
assert.strictEqual(tomorrowQuests[0].id, 'q4');

const yesterdayQuests = getQuestsForDate(sampleQuests, [], yesterdayStr);
console.log(`Yesterday's chronicle count: ${yesterdayQuests.length}`);
assert.strictEqual(yesterdayQuests.length, 1);
assert.strictEqual(yesterdayQuests[0].id, 'q3');

console.log('All Calendar & Date-Mapping tests passed successfully!');
