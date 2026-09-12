'use client';

import React from 'react';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface QuestStatsBannerProps {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  onOpenCreate: () => void;
}

export const QuestStatsBanner: React.FC<QuestStatsBannerProps> = ({
  completedCount,
  totalCount,
  progressPercent,
  onOpenCreate,
}) => {
  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBE9E7] text-[#E07A5F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Daily Progression Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
            Active Quests & Habits
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
            Complete quests to earn XP, increase life attributes, and collect study coins.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Completion Bar */}
      <div className="mt-5 pt-4 border-t border-[#EFEBE9]">
        <div className="flex items-center justify-between text-xs font-bold text-[#5D4037] mb-1.5">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#81B29A]" />
            Completion Rate
          </span>
          <span>
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#F5EFEB] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#81B29A] to-[#E07A5F] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
