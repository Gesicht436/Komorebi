'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Edit2,
  Trash2,
  Plus,
  Minus,
  Flame,
  Brain,
  Dumbbell,
  Sparkles,
  Palette,
  Shield,
} from 'lucide-react';
import { Quest } from '@/types/database';
import { ATTRIBUTE_CONFIG, DIFFICULTY_CONFIG } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => Promise<void>;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => Promise<void>;
  onHabitChange?: (questId: string, delta: number) => Promise<void>;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
  onHabitChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFloatingReward, setShowFloatingReward] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const attrConfig = ATTRIBUTE_CONFIG[quest.attribute] || ATTRIBUTE_CONFIG.focus;
  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.medium;

  const AttributeIcon =
    quest.attribute === 'focus'
      ? Brain
      : quest.attribute === 'vitality'
      ? Dumbbell
      : quest.attribute === 'mindfulness'
      ? Sparkles
      : quest.attribute === 'creativity'
      ? Palette
      : Shield;

  const handleCheck = async () => {
    if (quest.is_completed || isProcessing) return;
    setIsProcessing(true);
    soundEngine.playQuestComplete();
    setShowFloatingReward(true);

    try {
      await onComplete(quest.id);
    } catch {
      setShowFloatingReward(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHabitDelta = async (delta: number) => {
    if (!onHabitChange || isProcessing) return;
    setIsProcessing(true);
    if (delta > 0) {
      soundEngine.playQuestComplete();
      setShowFloatingReward(true);
    } else {
      soundEngine.playClick();
    }

    try {
      await onHabitChange(quest.id, delta);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
        quest.is_completed
          ? 'bg-[#F9F7F4]/60 border-[#EFEBE9] opacity-75'
          : 'bg-white border-[#EFEBE9] hover:border-[#D7CCC8] shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Floating XP / Coin Animation */}
      <AnimatePresence>
        {showFloatingReward && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -45, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            onAnimationComplete={() => setShowFloatingReward(false)}
            className="absolute top-2 right-8 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E07A5F] text-white text-xs font-extrabold shadow-lg"
          >
            <span>+{quest.xp_reward} {attrConfig.label} XP</span>
            <span>+{quest.coin_reward} 🪙</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox / Habit Trigger */}
        {quest.type === 'habit' ? (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleHabitDelta(1)}
              disabled={isProcessing}
              title="Record positive habit repetition"
              className="w-7 h-7 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="text-[11px] font-bold text-[#5D4037] flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-[#F4A261] fill-[#F4A261]" />
              {quest.streak_count || 0}
            </div>
            <button
              onClick={() => handleHabitDelta(-1)}
              disabled={isProcessing}
              title="Decrement repetition"
              className="w-7 h-7 rounded-lg bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheck}
            disabled={quest.is_completed || isProcessing}
            aria-label={`Complete quest: ${quest.title}`}
            className={`w-7 h-7 mt-0.5 rounded-xl flex items-center justify-center transition-all border cursor-pointer ${
              quest.is_completed
                ? 'bg-[#81B29A] border-[#81B29A] text-white cursor-default'
                : 'border-[#D7CCC8] hover:border-[#E07A5F] hover:bg-[#FBE9E7] text-transparent hover:text-[#E07A5F]/40 active:scale-90'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        )}

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${attrConfig.badgeColor}`}
            >
              <AttributeIcon className="w-3.5 h-3.5" />
              {attrConfig.label} ({attrConfig.statCode})
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${diffConfig.color}`}
            >
              {diffConfig.label}
            </span>

            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8D6E63] bg-[#F5EFEB] px-1.5 py-0.5 rounded">
              {quest.type}
            </span>

            <span className="ml-auto text-[11px] font-bold text-[#E07A5F] flex items-center gap-1.5">
              <span>+{quest.xp_reward} {attrConfig.statCode} XP</span>
              <span className="text-[#8D6E63]">•</span>
              <span>+{quest.coin_reward} 🪙</span>
            </span>
          </div>

          <h3
            className={`text-sm sm:text-base font-bold text-[#3E2723] leading-snug transition-all ${
              quest.is_completed ? 'line-through text-[#8D6E63]' : ''
            }`}
          >
            {quest.title}
          </h3>

          {quest.description && (
            <p className="mt-1 text-xs text-[#6D4C41] leading-relaxed line-clamp-2">
              {quest.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0 focus-within:opacity-100'
          }`}
        >
          <button
            onClick={() => {
              soundEngine.playClick();
              onEdit(quest);
            }}
            aria-label="Edit Quest"
            className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              if (confirm('Are you sure you want to abandon this quest?')) {
                onDelete(quest.id);
              }
            }}
            aria-label="Delete Quest"
            className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#D32F2F] hover:bg-[#FFEBEE] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
