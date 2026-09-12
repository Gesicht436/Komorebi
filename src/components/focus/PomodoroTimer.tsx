'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, CloudRain, Disc, CheckCircle } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';

interface PomodoroTimerProps {
  onSessionComplete: (durationMinutes: number) => Promise<void>;
  onStudyStateChange?: (isStudying: boolean) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<TimerMode, { label: string; duration: number; xp: number; coins: number }> = {
  focus: { label: 'Deep Focus', duration: 25 * 60, xp: 35, coins: 12 },
  shortBreak: { label: 'Short Break', duration: 5 * 60, xp: 5, coins: 2 },
  longBreak: { label: 'Long Rest', duration: 15 * 60, xp: 10, coins: 5 },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onSessionComplete,
  onStudyStateChange,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIG.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isRainActive, setIsRainActive] = useState(soundEngine.getRainState());
  const [isVinylActive, setIsVinylActive] = useState(soundEngine.getVinylState());
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = MODE_CONFIG[mode].duration;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning) {
      onStudyStateChange?.(mode === 'focus');
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onStudyStateChange?.(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleComplete = async () => {
    setIsRunning(false);
    onStudyStateChange?.(false);
    soundEngine.playQuestComplete();

    if (mode === 'focus') {
      setSessionsCompletedToday((prev) => prev + 1);
      await onSessionComplete(25);
    }

    // Reset to break or next mode
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(MODE_CONFIG.shortBreak.duration);
    } else {
      setMode('focus');
      setTimeLeft(MODE_CONFIG.focus.duration);
    }
  };

  const handleToggleTimer = () => {
    soundEngine.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setIsRunning(false);
    onStudyStateChange?.(false);
    setTimeLeft(MODE_CONFIG[mode].duration);
  };

  const handleModeChange = (newMode: TimerMode) => {
    soundEngine.playClick();
    setIsRunning(false);
    onStudyStateChange?.(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].duration);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs text-center max-w-lg mx-auto">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#F5EFEB] rounded-2xl max-w-xs mx-auto mb-6">
        {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === m
                ? 'bg-white text-[#E07A5F] shadow-xs'
                : 'text-[#5D4037] hover:text-[#3E2723]'
            }`}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
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
          {/* Progress circle */}
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke={mode === 'focus' ? '#E07A5F' : '#81B29A'}
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />
        </svg>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-[#3E2723] tracking-tight font-mono">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-semibold text-[#8D6E63] mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
            +{MODE_CONFIG[mode].xp} Focus XP • +{MODE_CONFIG[mode].coins} 🪙
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={handleReset}
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
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
        </button>
      </div>

      {/* Ambient Lo-Fi Controls Bar */}
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
    </div>
  );
};
