import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TimerMode,
  TimerDurations,
  TimerState,
  DEFAULT_DURATIONS,
  TIMER_STORAGE_KEY,
  loadSavedDurations,
} from '../types';
import { soundEngine } from '@/lib/audio/sound-engine';

interface UsePomodoroTimerOptions {
  onSessionComplete: (durationMinutes: number) => Promise<void>;
}

export function usePomodoroTimer({ onSessionComplete }: UsePomodoroTimerOptions) {
  const [timerDurations, setTimerDurations] = useState<TimerDurations>(DEFAULT_DURATIONS);
  const [timerMode, setTimerModeState] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATIONS.focus * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [wasAutoPausedFocus, setWasAutoPausedFocus] = useState<boolean>(false);
  const [justAutoResumed, setJustAutoResumed] = useState<boolean>(false);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(0);

  // Load saved durations from localStorage on mount
  useEffect(() => {
    const saved = loadSavedDurations();
    setTimerDurations(saved);
    setTimeLeft(saved.focus * 60);
  }, []);

  // Stable refs to prevent unmount / interval closure traps
  const isTimerRunningRef = useRef(isTimerRunning);
  isTimerRunningRef.current = isTimerRunning;
  const timerModeRef = useRef(timerMode);
  timerModeRef.current = timerMode;
  const timerDurationsRef = useRef(timerDurations);
  timerDurationsRef.current = timerDurations;
  const wasAutoPausedFocusRef = useRef(wasAutoPausedFocus);
  wasAutoPausedFocusRef.current = wasAutoPausedFocus;

  // Handle timer reaching zero
  const handleTimerComplete = useCallback(async () => {
    setIsTimerRunning(false);
    setWasAutoPausedFocus(false);
    soundEngine.playQuestComplete();

    const currentMode = timerModeRef.current;
    const currentDurations = timerDurationsRef.current;

    if (currentMode === 'focus') {
      setSessionsCompletedToday((prev) => prev + 1);
      await onSessionComplete(currentDurations.focus);
      setTimerModeState('shortBreak');
      setTimeLeft(currentDurations.shortBreak * 60);
    } else {
      setTimerModeState('focus');
      setTimeLeft(currentDurations.focus * 60);
    }
  }, [onSessionComplete]);

  // Global 1-second tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, handleTimerComplete]);

  // Page lifecycle handlers:
  // Auto-pause Deep Focus when leaving the focus room
  const onLeaveFocusPage = useCallback(() => {
    if (timerModeRef.current === 'focus' && isTimerRunningRef.current) {
      setIsTimerRunning(false);
      setWasAutoPausedFocus(true);
    }
  }, []);

  // Auto-resume Deep Focus when re-entering the focus room
  const onEnterFocusPage = useCallback(() => {
    if (timerModeRef.current === 'focus' && wasAutoPausedFocusRef.current) {
      setIsTimerRunning(true);
      setWasAutoPausedFocus(false);
      setJustAutoResumed(true);
      setTimeout(() => {
        setJustAutoResumed(false);
      }, 4000);
    }
  }, []);

  const startTimer = useCallback(() => {
    soundEngine.playClick();
    setIsTimerRunning(true);
    setWasAutoPausedFocus(false);
  }, []);

  const pauseTimer = useCallback(() => {
    soundEngine.playClick();
    setIsTimerRunning(false);
    setWasAutoPausedFocus(false);
  }, []);

  const resetTimer = useCallback(() => {
    soundEngine.playClick();
    setIsTimerRunning(false);
    setWasAutoPausedFocus(false);
    setTimeLeft(timerDurations[timerMode] * 60);
  }, [timerDurations, timerMode]);

  const setTimerMode = useCallback((mode: TimerMode) => {
    soundEngine.playClick();
    setIsTimerRunning(false);
    setWasAutoPausedFocus(false);
    setTimerModeState(mode);
    setTimeLeft(timerDurations[mode] * 60);
  }, [timerDurations]);

  const updateTimerDurations = useCallback((newDurations: TimerDurations) => {
    const validated: TimerDurations = {
      focus: Math.max(1, Math.min(180, Number(newDurations.focus) || 25)),
      shortBreak: Math.max(1, Math.min(60, Number(newDurations.shortBreak) || 5)),
      longBreak: Math.max(1, Math.min(90, Number(newDurations.longBreak) || 15)),
    };
    setTimerDurations(validated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(validated));
    }
    if (!isTimerRunningRef.current) {
      setTimeLeft(validated[timerModeRef.current] * 60);
    }
  }, []);

  const timerState: TimerState = {
    mode: timerMode,
    timeLeft,
    isRunning: isTimerRunning,
    wasAutoPausedFocus,
    justAutoResumed,
    durations: timerDurations,
    sessionsCompletedToday,
  };

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    updateTimerDurations,
    onEnterFocusPage,
    onLeaveFocusPage,
  };
}
