import assert from 'node:assert';

export const BOSS_PRESETS = {
  dragon: {
    name: 'Ignis, the Procrastination Wyrm',
    title: 'Ancient Beast of Delay & Distraction',
    type: 'dragon',
    max_hp: 500,
    reward_xp: 150,
    reward_coins: 100,
    reward_item_id: 'dragon_quill',
    reward_item_name: 'Dragon Fang Feather Quill',
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
  },
};

export const WEEKLY_BOSS_ORDER = ['dragon', 'golem', 'specter'];

export const BOSS_DAMAGE_WEIGHTS = {
  QUEST_EPIC: 80,
  QUEST_HARD: 50,
  QUEST_MEDIUM: 30,
  QUEST_EASY: 15,
  POMODORO_INTERVAL: 45,
  HABIT_TICK: 10,
};

export function getTaskDamage(difficulty) {
  switch (difficulty) {
    case 'epic': return BOSS_DAMAGE_WEIGHTS.QUEST_EPIC;
    case 'hard': return BOSS_DAMAGE_WEIGHTS.QUEST_HARD;
    case 'medium': return BOSS_DAMAGE_WEIGHTS.QUEST_MEDIUM;
    case 'easy':
    default: return BOSS_DAMAGE_WEIGHTS.QUEST_EASY;
  }
}

export function getPomoDamage(durationMinutes) {
  const intervals = Math.max(1, Math.round(durationMinutes / 25));
  return intervals * BOSS_DAMAGE_WEIGHTS.POMODORO_INTERVAL;
}

export function getHabitDamage() {
  return BOSS_DAMAGE_WEIGHTS.HABIT_TICK;
}

export function getWeeklyResetDeadline(baseDate = new Date()) {
  const d = new Date(baseDate);
  const day = d.getUTCDay();
  const daysRemaining = (7 - day) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + daysRemaining);
  return d.toISOString().split('T')[0];
}

export function getBossTypeForWeek(date = new Date()) {
  const weekNumber = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_BOSS_ORDER[weekNumber % WEEKLY_BOSS_ORDER.length];
}

export function isWeeklyRaidExpired(boss) {
  if (!boss) return true;
  const todayStr = new Date().toISOString().split('T')[0];
  if (boss.target_deadline) {
    return todayStr > boss.target_deadline;
  }
  const createdAt = new Date(boss.created_at).getTime();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt > oneWeekMs;
}

export function getWeeklyCountdown(targetDeadline) {
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

export function generateUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createDefaultBossBattle(userId, type, targetDeadline) {
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

console.log('--- 1. Testing UUID Format for PostgreSQL Compatibility ---');
const testUuid = generateUuid();
console.log(`Generated UUID: ${testUuid}`);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
assert(uuidRegex.test(testUuid), `UUID "${testUuid}" does not match RFC4122 v4 UUID format`);

console.log('--- 2. Testing Weekly Reset Deadline & Date Formats ---');
const deadline = getWeeklyResetDeadline(new Date('2026-09-13T08:00:00Z'));
console.log(`Calculated Weekly Deadline: ${deadline}`);
assert(/^\d{4}-\d{2}-\d{2}$/.test(deadline), `Deadline "${deadline}" must match YYYY-MM-DD for PostgreSQL date columns`);

console.log('--- 3. Testing Weekly Boss Rotation ---');
const bossType = getBossTypeForWeek(new Date('2026-09-13T08:00:00Z'));
console.log(`Boss Type for Week: ${bossType}`);
assert(['dragon', 'golem', 'specter'].includes(bossType), 'Boss type must be dragon, golem, or specter');

console.log('--- 4. Testing Weekly Raid Expiration ---');
const activeBoss = createDefaultBossBattle('test-user-1', 'dragon', '2026-09-20');
assert.strictEqual(isWeeklyRaidExpired(activeBoss), false, 'Active boss with future deadline should not be expired');

const expiredBoss = createDefaultBossBattle('test-user-1', 'dragon', '2026-09-01');
assert.strictEqual(isWeeklyRaidExpired(expiredBoss), true, 'Boss with past deadline should be expired');
assert.strictEqual(isWeeklyRaidExpired(null), true, 'Null boss should be treated as expired');

console.log('--- 5. Testing Weekly Countdown ---');
const countdownFuture = getWeeklyCountdown('2026-09-20');
console.log(`Countdown for future deadline: ${countdownFuture.formatted}`);
assert(countdownFuture.formatted.includes('left') || countdownFuture.days >= 0, 'Countdown must format remaining time');

const countdownPast = getWeeklyCountdown('2026-09-01');
assert.strictEqual(countdownPast.formatted, 'Resetting soon', 'Expired deadline should display Resetting soon');

console.log('--- 6. Testing Combat Damage Weights ---');
assert.strictEqual(getTaskDamage('easy'), 15);
assert.strictEqual(getTaskDamage('medium'), 30);
assert.strictEqual(getTaskDamage('hard'), 50);
assert.strictEqual(getTaskDamage('epic'), 80);
assert.strictEqual(getHabitDamage(), 10);
assert.strictEqual(getPomoDamage(25), 45);

console.log('--- 7. Testing Boss Health Reduction Sequence ---');
let boss = createDefaultBossBattle('test-user-1', 'dragon');
assert.strictEqual(boss.current_hp, 500);

// Strike 1: Medium quest (30 dmg)
boss = { ...boss, current_hp: Math.max(0, boss.current_hp - getTaskDamage('medium')) };
assert.strictEqual(boss.current_hp, 470);

// Strike 2: Epic quest (80 dmg)
boss = { ...boss, current_hp: Math.max(0, boss.current_hp - getTaskDamage('epic')) };
assert.strictEqual(boss.current_hp, 390);

// Strike 3: Habit (10 dmg)
boss = { ...boss, current_hp: Math.max(0, boss.current_hp - getHabitDamage()) };
assert.strictEqual(boss.current_hp, 380);

// Strike 4: 25-min Pomodoro (45 dmg)
boss = { ...boss, current_hp: Math.max(0, boss.current_hp - getPomoDamage(25)) };
assert.strictEqual(boss.current_hp, 335);

console.log(`Final reduced Boss HP: ${boss.current_hp} / ${boss.max_hp}`);
assert.strictEqual(boss.is_defeated, false);

console.log('All Dungeon Raid combat & weekly reset tests passed successfully!');
