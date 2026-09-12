'use client';

import React from 'react';
import { Sparkles, Trophy, Brain, CheckCircle, Flame, Clock, Award } from 'lucide-react';
import { Profile, Quest } from '@/types/database';
import {
  getDailyScoreGrade,
  DAILY_SCORE_MAX,
  DAILY_SCORE_WEIGHTS,
} from '@/lib/game/daily-score';
import { motion } from 'framer-motion';

interface DailyProductivityScoreCardProps {
  profile: Profile;
  quests?: Quest[];
}

export const DailyProductivityScoreCard: React.FC<DailyProductivityScoreCardProps> = ({
  profile,
  quests = [],
}) => {
  const currentScore = Math.min(DAILY_SCORE_MAX, Math.max(0, profile.daily_score || 0));
  const gradeInfo = getDailyScoreGrade(currentScore);

  // SVG circular progress calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / DAILY_SCORE_MAX) * circumference;

  const claimedMilestones = profile.claimed_score_milestones || [];
  const hasClaimedRankA = claimedMilestones.includes(DAILY_SCORE_WEIGHTS.MILESTONES.RANK_A.id) || currentScore >= 80;
  const hasClaimedRankS = claimedMilestones.includes(DAILY_SCORE_WEIGHTS.MILESTONES.RANK_S.id) || currentScore >= 100;

  // Next milestone calculation
  const nextTarget = currentScore < 80 ? 80 : currentScore < 100 ? 100 : null;
  const pointsToNext = nextTarget ? nextTarget - currentScore : 0;

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#FFF8E1]/50 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#3E2723]">
              Daily Productivity Score
            </h2>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${gradeInfo.badgeClass}`}>
              Rank {gradeInfo.rank}
            </span>
          </div>
          <p className="text-xs text-[#8D6E63] mt-1">
            Starts at 0 each day. Complete high-impact tasks and deep study intervals to climb to 100.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#8D6E63] bg-[#FDFBF7] border border-[#EFEBE9] px-2.5 py-1 rounded-full">
            📅 Resets Daily at Midnight
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Score Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Track Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-[#EFEBE9]"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                stroke={gradeInfo.ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                key={gradeInfo.rank}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-black ${gradeInfo.textColor} tracking-tight leading-none`}
              >
                {gradeInfo.rank}
              </motion.span>
              <div className="text-lg font-black text-[#3E2723] mt-0.5 leading-none">
                {currentScore}
                <span className="text-xs text-[#8D6E63] font-bold">/100</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8D6E63] mt-1">
                {gradeInfo.title}
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-[#6D4C41] mt-2 max-w-xs leading-normal">
            {gradeInfo.description}
          </p>
        </div>

        {/* Right: Point Distribution Rules & Milestones */}
        <div className="md:col-span-7 space-y-4">
          {/* Activity Point Distribution Guide */}
          <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EFEBE9] space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5D4037] block">
              Task Effectiveness Weights
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="block text-[10px] font-bold text-purple-700">Epic (3hr Task)</span>
                <span className="text-xs font-extrabold text-purple-900">+25 pts</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="block text-[10px] font-bold text-rose-700">Hard (1-2hr Task)</span>
                <span className="text-xs font-extrabold text-rose-900">+20 pts</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="block text-[10px] font-bold text-blue-700">Medium Quest</span>
                <span className="text-xs font-extrabold text-blue-900">+12 pts</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="block text-[10px] font-bold text-amber-700">Deep Pomodoro</span>
                <span className="text-xs font-extrabold text-amber-900">+10 pts (Max 40)</span>
              </div>
            </div>
          </div>

          {/* Milestone Rewards Roadmap */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EFEBE9] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#5D4037]">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Daily Score Rewards
              </span>
              <span className="text-[11px] text-[#8D6E63]">
                {pointsToNext > 0
                  ? `${pointsToNext} pts to Rank ${nextTarget === 80 ? 'A' : 'S'}`
                  : '✨ All Daily Milestones Claimed!'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 80 Points Milestone */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  hasClaimedRankA
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div>
                  <div className="text-xs font-black flex items-center gap-1">
                    {hasClaimedRankA ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 inline-block text-[9px] text-center">
                        80
                      </span>
                    )}
                    <span>Rank A Milestone</span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63] block">Target: 80 Points</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-amber-600">+15 🪙 +30 XP</span>
                  <span className="text-[9px] block text-stone-500 font-bold">
                    {hasClaimedRankA ? 'Earned' : 'Locked'}
                  </span>
                </div>
              </div>

              {/* 100 Points Milestone */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  hasClaimedRankS
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div>
                  <div className="text-xs font-black flex items-center gap-1">
                    {hasClaimedRankS ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 inline-block text-[9px] text-center">
                        100
                      </span>
                    )}
                    <span>Rank S Perfection</span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63] block">Target: 100 Points</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-amber-600">+25 🪙 +50 XP</span>
                  <span className="text-[9px] block text-stone-500 font-bold">
                    {hasClaimedRankS ? 'Earned' : 'Locked'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
