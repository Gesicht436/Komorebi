'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, RotateCw } from 'lucide-react';
import { TimerDurations } from '../types';
import { soundEngine } from '@/lib/audio/sound-engine';

interface TimerDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  durations: TimerDurations;
  onSave: (newDurations: TimerDurations) => void;
}

export const TimerDurationModal: React.FC<TimerDurationModalProps> = ({
  isOpen,
  onClose,
  durations,
  onSave,
}) => {
  const [customFocus, setCustomFocus] = useState(durations.focus);
  const [customShortBreak, setCustomShortBreak] = useState(durations.shortBreak);
  const [customLongBreak, setCustomLongBreak] = useState(durations.longBreak);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setCustomFocus(durations.focus);
    setCustomShortBreak(durations.shortBreak);
    setCustomLongBreak(durations.longBreak);
  }, [durations, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    onSave({
      focus: customFocus,
      shortBreak: customShortBreak,
      longBreak: customLongBreak,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    soundEngine.playClick();
    const defaults = { focus: 25, shortBreak: 5, longBreak: 15 };
    setCustomFocus(defaults.focus);
    setCustomShortBreak(defaults.shortBreak);
    setCustomLongBreak(defaults.longBreak);
    onSave(defaults);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/30 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-[#EFEBE9] text-left"
          >
            {/* Header */}
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
                onClick={onClose}
                className="p-2 rounded-xl text-[#8D6E63] hover:bg-[#F5EFEB] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1 text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-3 py-2 rounded-xl hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Reset to Defaults
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {savedSuccess ? 'Saved! ✓' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
