'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings2,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { TimerMode, MODE_META } from '../types';
import { TimerDurationModal } from './TimerDurationModal';
import { TimerAmbientControls } from './TimerAmbientControls';
import { soundEngine } from '@/lib/audio/sound-engine';

export const PomodoroTimer: React.FC = () => {
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentDurationMinutes = durations[mode] || 25;
  const totalSeconds = currentDurationMinutes * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100)
  );

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
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke="#F5EFEB"
            strokeWidth="12"
            fill="none"
          />
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

      {/* Controls */}
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

      {/* Ambient Lo-Fi Controls Bar */}
      <TimerAmbientControls sessionsCompletedToday={sessionsCompletedToday} />

      {/* Duration Customization Modal */}
      <TimerDurationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        durations={durations}
        onSave={updateTimerDurations}
      />
    </div>
  );
};
