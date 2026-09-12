import assert from 'node:assert';

function getXpRequiredForLevel(level) {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.6));
}

function processXpGain(startingLevel, startingCurrentXp, xpEarned) {
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

  return { newLevel: level, newCurrentXp: currentXp, levelsGained, xpRequired, progressPercent };
}

// TEST 1: Non-linear XP scaling (each level requires strictly more XP than previous)
console.log('Testing Non-Linear Level Curve...');
let prevXp = 0;
for (let lvl = 1; lvl <= 10; lvl++) {
  const req = getXpRequiredForLevel(lvl);
  console.log(`Level ${lvl}: ${req} XP`);
  assert(req > prevXp, `Level ${lvl} must require more XP than level ${lvl - 1}`);
  prevXp = req;
}

// TEST 2: Process XP Gain & Multi-Level Up
console.log('Testing XP Gain & Level Progression...');
const res1 = processXpGain(1, 0, 50);
assert.strictEqual(res1.newLevel, 1);
assert.strictEqual(res1.newCurrentXp, 50);
assert.strictEqual(res1.levelsGained, 0);

const res2 = processXpGain(1, 50, 60); // 50 + 60 = 110 >= 100
assert.strictEqual(res2.newLevel, 2);
assert.strictEqual(res2.newCurrentXp, 10);
assert.strictEqual(res2.levelsGained, 1);

console.log('All RPG math tests passed successfully!');
