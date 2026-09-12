'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CloudRain,
  Disc,
  CheckCircle,
  Settings2,
  X,
  ShieldCheck,
  Coffee,
  RotateCw,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';
import { useGame, TimerMode, TimerDurations } from '@/context/GameContext';

interface PomodoroTimerProps {
  onSessionComplete?: (durationMinutes: number) => Promise<void>;
  onStudyStateChange?: (isStudying: boolean) => void;
}

const MODE_META: Record<TimerMode, { label: string; xp: number; coins: number; color: string; badge: string }> = {
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

export const PomodoroTimer: React.FC<PomodoroTimerProps> = () => {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    updateTimerDurations,
  } = useGame();

  const {
    mode,
    timeLeft,
    isRunning,
    justAutoResumed,
    durations,
    sessionsCompletedToday,
  } = timerState;

  const [isRainActive, setIsRainActive] = useState(soundEngine.getRainState());
  const [isVinylActive, setIsVinylActive] = useState(soundEngine.getVinylState());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Form state for duration settings
  const [customFocus, setCustomFocus] = useState(durations.focus);
  const [customShortBreak, setCustomShortBreak] = useState(durations.shortBreak);
  const [customLongBreak, setCustomLongBreak] = useState(durations.longBreak);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Sync settings form when durations change
  useEffect(() => {
    setCustomFocus(durations.focus);
    setCustomShortBreak(durations.shortBreak);
    setCustomLongBreak(durations.longBreak);
  }, [durations]);

  const currentDurationMinutes = durations[mode] || 25;
  const totalSeconds = currentDurationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    const newDurations: TimerDurations = {
      focus: Math.max(1, Math.min(180, Number(customFocus) || 25)),
      shortBreak: Math.max(1, Math.min(60, Number(customShortBreak) || 5)),
      longBreak: Math.max(1, Math.min(90, Number(customLongBreak) || 15)),
    };
    updateTimerDurations(newDurations);
    setSettingsSavedMessage(true);
    setTimeout(() => {
      setSettingsSavedMessage(false);
      setIsSettingsOpen(false);
    }, 900);
  };

  const handleResetToDefaults = () => {
    soundEngine.playClick();
    const defaults: TimerDurations = { focus: 25, shortBreak: 5, longBreak: 15 };
    setCustomFocus(defaults.focus);
    setCustomShortBreak(defaults.shortBreak);
    setCustomLongBreak(defaults.longBreak);
    updateTimerDurations(defaults);
    setSettingsSavedMessage(true);
    setTimeout(() => {
      setSettingsSavedMessage(false);
      setIsSettingsOpen(false);
    }, 900);
  };

  return (
    <div className="relative bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs text-center max-w-lg mx-auto overflow-hidden">
      {/* Auto-Resume Notification Banner */}
      <AnimatePresence>
        {justAutoResumed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#43A047] animate-spin" />
            <span>Resumed Deep Focus! Picked up right where you left off.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar: Mode Switcher & Duration Settings Button */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F5EFEB] rounded-2xl flex-1 justify-center max-w-sm">
          {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
            const isSelected = mode === m;
            const meta = MODE_META[m];
            const lengthMinutes = durations[m];
            return (
              <button
                key={m}
                onClick={() => setTimerMode(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#E07A5F] shadow-xs'
                    : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                {meta.label} ({lengthMinutes}m)
              </button>
            );
          })}
        </div>

        {/* Customization Settings Trigger */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsSettingsOpen(true);
          }}
          title="Customize Timer Durations"
          className="p-2.5 rounded-2xl bg-[#F5EFEB] text-[#5D4037] hover:bg-[#EFEBE9] hover:text-[#3E2723] transition-all cursor-pointer shrink-0"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Navigation Helper Badge */}
      <div className="mb-4">
        {mode === 'focus' ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF3E0] border border-[#FFE082]/60 text-[#E65100] text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FB8C00]" />
            <span>Pauses when leaving page, resumes upon return</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-[11px] font-medium">
            <Coffee className="w-3.5 h-3.5 text-[#43A047]" />
            <span>Break runs in background while you browse quests & shop</span>
          </div>
        )}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          {/* Background circle track */}
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke="#F5EFEB"
            strokeWidth="12"
            fill="none"
          />
          {/* Animated Progress circle */}
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke={MODE_META[mode].color}
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-[#3E2723] tracking-tight font-mono">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-semibold text-[#8D6E63] mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
            +{MODE_META[mode].xp} Focus XP • +{MODE_META[mode].coins} 🪙
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={resetTimer}
          title="Reset Timer"
          className="p-3 rounded-2xl bg-[#F5EFEB] text-[#5D4037] hover:bg-[#EFEBE9] transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleToggleTimer}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
            isRunning
              ? 'bg-[#5D4037] hover:bg-[#3E2723] shadow-[#5D4037]/20'
              : 'bg-[#E07A5F] hover:bg-[#D46A4F] shadow-[#E07A5F]/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>{mode === 'focus' ? 'Start Focus' : 'Start Rest'}</span>
            </>
          )}
        </button>
      </div>

      {/* Ambient Lo-Fi Audio Bar */}
      <div className="mt-8 pt-6 border-t border-[#EFEBE9] flex items-center justify-between text-xs text-[#8D6E63]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsRainActive(soundEngine.toggleRain());
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isRainActive
                ? 'bg-[#E1F5FE] text-[#0288D1] border-[#81D4FA]'
                : 'bg-white border-[#EFEBE9] text-[#8D6E63] hover:bg-[#F5EFEB]'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>Rain</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setIsVinylActive(soundEngine.toggleVinyl());
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isVinylActive
                ? 'bg-[#EDE7F6] text-[#7E57C2] border-[#D1C4E9]'
                : 'bg-white border-[#EFEBE9] text-[#8D6E63] hover:bg-[#F5EFEB]'
            }`}
          >
            <Disc className={`w-4 h-4 ${isVinylActive ? 'animate-spin' : ''}`} />
            <span>Vinyl</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-[#5D4037]">
          <CheckCircle className="w-4 h-4 text-[#81B29A]" />
          <span>{sessionsCompletedToday} completed today</span>
        </div>
      </div>

      {/* Duration Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/30 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-[#EFEBE9] text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F5EFEB] text-[#E07A5F]">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#3E2723]">Timer Durations</h3>
                    <p className="text-xs text-[#8D6E63]">Customize the length of each interval</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 rounded-xl text-[#8D6E63] hover:bg-[#F5EFEB] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">
                    Deep Focus (Minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customFocus}
                      onChange={(e) => setCustomFocus(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#EFEBE9] text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                    />
                    <span className="text-xs text-[#8D6E63] font-medium whitespace-nowrap">
                      Default: 25m
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">
                    Short Break (Minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={customShortBreak}
                      onChange={(e) => setCustomShortBreak(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#EFEBE9] text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#81B29A]/40"
                    />
                    <span className="text-xs text-[#8D6E63] font-medium whitespace-nowrap">
                      Default: 5m
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">
                    Long Rest (Minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={customLongBreak}
                      onChange={(e) => setCustomLongBreak(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#EFEBE9] text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#3D405B]/40"
                    />
                    <span className="text-xs text-[#8D6E63] font-medium whitespace-nowrap">
                      Default: 15m
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="flex items-center gap-1 text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-3 py-2 rounded-xl hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Reset to Defaults
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    {settingsSavedMessage ? 'Saved! ✓' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
