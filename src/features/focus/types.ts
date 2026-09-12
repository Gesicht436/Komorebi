export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerDurations {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  wasAutoPausedFocus: boolean;
  justAutoResumed: boolean;
  durations: TimerDurations;
  sessionsCompletedToday: number;
}

export const DEFAULT_DURATIONS: TimerDurations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const TIMER_STORAGE_KEY = 'komorebi_timer_settings';

export const MODE_META: Record<
  TimerMode,
  { label: string; xp: number; coins: number; color: string; badge: string }
> = {
  focus: {
    label: 'Deep Focus',
    xp: 35,
    coins: 12,
    color: '#E07A5F',
    badge: 'bg-[#FBE9E7] text-[#E07A5F]',
  },
  shortBreak: {
    label: 'Short Break',
    xp: 5,
    coins: 2,
    color: '#81B29A',
    badge: 'bg-[#E8F5E9] text-[#2E7D32]',
  },
  longBreak: {
    label: 'Long Rest',
    xp: 10,
    coins: 5,
    color: '#3D405B',
    badge: 'bg-[#EDE7F6] text-[#512DA8]',
  },
};

export const loadSavedDurations = (): TimerDurations => {
  if (typeof window === 'undefined') return DEFAULT_DURATIONS;
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.focus === 'number') {
        return {
          focus: Math.max(1, Math.min(180, parsed.focus || 25)),
          shortBreak: Math.max(1, Math.min(60, parsed.shortBreak || 5)),
          longBreak: Math.max(1, Math.min(90, parsed.longBreak || 15)),
        };
      }
    }
  } catch {}
  return DEFAULT_DURATIONS;
};
