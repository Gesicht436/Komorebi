import { PersistedState, DEMO_STORAGE_KEY, getInitialDemoState } from './demo-data';

export const loadPersistedDemoState = (): PersistedState => {
  if (typeof window === 'undefined') return getInitialDemoState();
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.quests)) {
        if (!parsed.bossBattle) {
          parsed.bossBattle = { ...getInitialDemoState().bossBattle };
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
