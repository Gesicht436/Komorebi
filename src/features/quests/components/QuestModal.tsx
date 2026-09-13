'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus } from 'lucide-react';
import { Quest, QuestAttribute, QuestDifficulty, QuestType } from '@/types/database';
import { ATTRIBUTE_CONFIG, DIFFICULTY_CONFIG } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';
import { TASK_CATEGORY_PRESETS, TaskCategoryPreset } from '../constants/task-categories';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: Partial<Quest>) => Promise<void>;
  initialQuest?: Quest | null;
  defaultDueDate?: string | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuest,
  defaultDueDate,
}) => {
  const [title, setTitle] = useState(initialQuest?.title || '');
  const [description, setDescription] = useState(initialQuest?.description || '');
  const [type, setType] = useState<QuestType>(initialQuest?.type || 'daily');
  const [attribute, setAttribute] = useState<QuestAttribute>(initialQuest?.attribute || 'focus');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(initialQuest?.difficulty || 'medium');
  const [dueDate, setDueDate] = useState<string>(initialQuest?.due_date || defaultDueDate || '');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: TaskCategoryPreset) => {
    soundEngine.playClick();
    setSelectedPresetId(preset.id);
    setAttribute(preset.attribute);
    if (!title || TASK_CATEGORY_PRESETS.some((p) => p.suggestedTitles.includes(title))) {
      // Pick the first suggested title if user hasn't typed a custom one yet
      setTitle(preset.suggestedTitles[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a quest title.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    soundEngine.playClick();

    const config = DIFFICULTY_CONFIG[difficulty];

    try {
      await onSubmit({
        id: initialQuest?.id,
        title: title.trim(),
        description: description.trim(),
        type,
        attribute,
        difficulty,
        xp_reward: config.xp,
        coin_reward: config.coins,
        due_date: dueDate.trim() ? dueDate.trim() : null,
      });
      onClose();
    } catch {
      setError('Failed to save quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAttrConfig = ATTRIBUTE_CONFIG[attribute];
  const rewardConfig = DIFFICULTY_CONFIG[difficulty];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/30 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-w-lg w-full max-h-[92vh] overflow-y-auto bg-[#FFFBF5] border border-[#EFEBE9] rounded-3xl p-6 sm:p-7 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE9]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FBE9E7] text-[#E07A5F] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#3E2723]">
                {initialQuest ? 'Edit Quest' : 'Record New Quest'}
              </h2>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl text-[#8D6E63] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Quick Category Presets */}
          <div className="mt-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">
              Quick Category Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TASK_CATEGORY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedPresetId === preset.id || attribute === preset.attribute
                      ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-xs'
                      : 'bg-white text-[#5D4037] border-[#EFEBE9] hover:bg-[#F5EFEB]'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className="ml-1 text-[10px] opacity-80">({preset.statCode})</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1">
                Quest Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build auth endpoints, 45 min Gym session, 15m Meditation"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D7CCC8] text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1">
                Description / Notes (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add checklist, link, or reflection notes..."
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#D7CCC8] text-[#3E2723] text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F] transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1.5">
                Quest Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'habit', 'milestone'] as QuestType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                      type === t
                        ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-xs'
                        : 'bg-white text-[#5D4037] border-[#EFEBE9] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    {t === 'daily' ? 'Daily Quest' : t === 'habit' ? 'Recurring Habit' : 'Milestone Project'}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Attribute / Stat */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037]">
                  Character Stat to Level Up
                </label>
                <span className="text-[11px] font-bold text-[#E07A5F]">
                  Levels up: {activeAttrConfig.rpgStat}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(ATTRIBUTE_CONFIG) as QuestAttribute[]).map((attr) => {
                  const cfg = ATTRIBUTE_CONFIG[attr];
                  const isSelected = attribute === attr;
                  return (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setAttribute(attr);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#E07A5F] bg-[#FBE9E7] shadow-xs ring-1 ring-[#E07A5F]'
                          : 'border-[#EFEBE9] bg-white hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#3E2723]">{cfg.rpgStat}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${cfg.badgeColor}`}>
                          {cfg.statCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6D4C41] mt-0.5">{cfg.description}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {cfg.categoryExamples.map((ex) => (
                          <span
                            key={ex}
                            className="text-[9px] font-medium bg-[#F5EFEB] text-[#8D6E63] px-1.5 py-0.2 rounded"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stat Leveling Live Preview Banner */}
            <div className="p-3 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-xs text-[#8D6E63] flex items-center justify-between">
              <span className="font-semibold text-[#5D4037]">
                Stat Reward: <span className="font-bold text-[#E07A5F]">+{rewardConfig.xp} {activeAttrConfig.label} EXP</span>
              </span>
              <span className="font-bold text-[#B78103]">+{rewardConfig.coins} Coins 🪙</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1.5">
                Difficulty & Rewards
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(DIFFICULTY_CONFIG) as QuestDifficulty[]).map((diff) => {
                  const cfg = DIFFICULTY_CONFIG[diff];
                  const isSelected = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`p-2 text-center rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#E07A5F] bg-[#FBE9E7] shadow-xs ring-1 ring-[#E07A5F]'
                          : 'border-[#EFEBE9] bg-white hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <div className="text-xs font-bold capitalize text-[#3E2723]">{cfg.label}</div>
                      <div className="text-[10px] font-semibold text-[#E07A5F] mt-0.5">
                        +{cfg.xp} XP | +{cfg.coins} 🪙
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Due Date Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5D4037]">
                  Scheduled Date (Optional)
                </label>
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="text-[10px] font-bold text-[#E07A5F] hover:underline cursor-pointer"
                  >
                    Clear Date
                  </button>
                )}
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EFEBE9] rounded-2xl text-xs text-[#3E2723] focus:outline-none focus:border-[#E07A5F] cursor-pointer"
              />
              <p className="text-[10px] text-[#8D6E63] mt-1">
                Choose a specific date to schedule this quest on your calendar. Leave empty for today.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : initialQuest ? 'Save Changes' : 'Accept Quest'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
