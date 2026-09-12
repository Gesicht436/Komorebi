'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';
import { getTitleForLevel } from '@/lib/game/engine';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, newLevel, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playLevelUp();
      // Multi-stage confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E07A5F', '#F4A261', '#81B29A', '#EDE7F6', '#FFE082'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#E07A5F', '#81B29A', '#F4A261'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#E07A5F', '#81B29A', '#F4A261'],
          });
        }, 250);
      } catch {
        // Fallback gracefully if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const title = getTitleForLevel(newLevel);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/40 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative max-w-sm w-full bg-[#FFFBF5] border-2 border-[#EFEBE9] rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Japanese Komorebi Ray Glow */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#FFE082]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#FBE9E7]/60 rounded-full blur-2xl pointer-events-none" />

          {/* Trophy / Level Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] flex items-center justify-center text-white shadow-lg shadow-[#E07A5F]/30 mb-4 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE9E7] text-[#E07A5F] text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Level Up!
          </div>

          <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-tight">
            Level {newLevel} Reached
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#8D6E63]">
            Title Unlocked: <span className="text-[#E07A5F]">{title}</span>
          </p>

          <p className="mt-4 text-xs text-[#6D4C41] leading-relaxed">
            Your daily dedication has borne fruit. New items and companions are now unlocked in the Shop!
          </p>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-md shadow-[#E07A5F]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
