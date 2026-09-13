import { PersistedState, DEMO_STORAGE_KEY, getInitialDemoState } from './demo-data';
import { isWeeklyRaidExpired, createDefaultBossBattle } from '@/lib/game/boss-battle';

export const loadPersistedDemoState = (): PersistedState => {
  if (typeof window === 'undefined') return getInitialDemoState();
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.quests)) {
        if (!parsed.bossBattle || isWeeklyRaidExpired(parsed.bossBattle)) {
          const userId = parsed.profile?.id || 'demo-judge-id';
          parsed.bossBattle = createDefaultBossBattle(userId);
        }
        if (Array.isArray(parsed.activityLogs)) {
          const seen = new Set<string>();
          parsed.activityLogs = parsed.activityLogs.map((log: any, idx: number) => {
            if (!log || !log.id || seen.has(log.id)) {
              const uniqueId = `log-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
              return { ...log, id: uniqueId };
            }
            seen.add(log.id);
            return log;
          });
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading persisted demo state:', err);
  }
  return getInitialDemoState();
};

export const savePersistedDemoState = (partial: Partial<PersistedState>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadPersistedDemoState();
    const updated: PersistedState = { ...current, ...partial };
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));

    // Also persist directly to specific local scholar account if email exists
    if (updated.profile?.email) {
      const userKey = `komorebi_user_${updated.profile.email.trim().toLowerCase()}`;
      localStorage.setItem(userKey, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Error saving persisted demo state:', err);
  }
};

export const resetPersistedDemoState = (): PersistedState => {
  if (typeof window === 'undefined') return getInitialDemoState();
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing demo storage:', err);
  }
  const fresh = getInitialDemoState();
  savePersistedDemoState(fresh);
  return fresh;
};
