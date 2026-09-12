'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Coins,
  ArrowRight,
  CheckCircle2,
  Timer,
  ShoppingBag,
  Plus,
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { QuestCard } from '@/components/quests/QuestCard';
import { getTitleForLevel, getXpRequiredForLevel } from '@/lib/game/engine';
import { getCharacterEvolution } from '@/lib/game/evolution';
import { soundEngine } from '@/lib/audio/sound-engine';
import { DailyProductivityScoreCard } from '@/features/dashboard';

export default function StudyRoomPage() {
  const {
    profile,
    quests,
    completeQuest,
    deleteQuest,
    updateHabit,
    isStudying,
  } = useGame();

  if (!profile) return null;

  const title = getTitleForLevel(profile.level);
  const xpRequired = getXpRequiredForLevel(profile.level);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((profile.current_xp / xpRequired) * 100))
  );

  const evolution = getCharacterEvolution({
    focus_exp: profile.focus_exp,
    vitality_exp: profile.vitality_exp,
    mindfulness_exp: profile.mindfulness_exp,
    discipline_exp: profile.discipline_exp,
    creativity_exp: profile.creativity_exp,
  });

  const pendingQuests = quests.filter((q) => !q.is_completed).slice(0, 4);
  const completedToday = quests.filter((q) => q.is_completed).length;

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Desk Overview */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar Study Room Scene */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute top-2 left-2 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#EFEBE9] text-[10px] font-extrabold uppercase tracking-wider text-[#5D4037] shadow-xs">
                {isStudying ? '✨ Deep Focus Mode' : '🍵 Relaxing at Desk'}
              </div>
              <AvatarDisplay
                equippedHoodie={profile.equipped_hoodie}
                equippedHeadphones={profile.equipped_headphones}
                equippedGlasses={profile.equipped_glasses}
                equippedPet={profile.equipped_pet}
                level={profile.level}
                isStudying={isStudying}
                vitalityTier={evolution.vitality.tier}
                focusTier={evolution.focus.tier}
                zenTier={evolution.zen.tier}
                archetypeTitle={evolution.archetypeTitle}
                badgeColor={evolution.badgeColor}
              />
            </div>
          </div>

          {/* Scholar Progression Sheet */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE9E7] text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Level {profile.level} • {title}
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${evolution.badgeColor}`}>
                  {evolution.archetypeTitle}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
                Good day, {profile.display_name}
              </h1>
              <p className="text-xs sm:text-sm text-[#8D6E63]">
                Your study desk is prepared. Every task completed brings you closer to your next milestone.
              </p>
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#5D4037]">
                <span>Progress to Level {profile.level + 1}</span>
                <span>
                  {profile.current_xp} / {xpRequired} XP ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#F5EFEB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E07A5F] to-[#F4A261] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#F57F17] mb-0.5">
                  <Flame className="w-4 h-4 fill-[#F57F17] animate-flame" />
                  <span className="text-base font-extrabold">{profile.streak_count}d</span>
                </div>
                <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Streak</div>
              </div>

              <div className="bg-[#FFF3E0] border border-[#FFCC80] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#E65100] mb-0.5">
                  <Coins className="w-4 h-4 fill-[#FFA726]" />
                  <span className="text-base font-extrabold">{profile.coins}</span>
                </div>
                <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Coins</div>
              </div>

              <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#2E7D32] mb-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-base font-extrabold">{completedToday}</span>
                </div>
                <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Finished</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                href="/focus"
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                <span>Start Pomodoro Session</span>
              </Link>
              <Link
                href="/quests"
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EFEBE9] hover:bg-[#F5EFEB] text-[#5D4037] text-xs font-bold transition-all cursor-pointer"
              >
                <span>View All Quests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
 
       {/* Daily Productivity Score (0-100 pts) */}
       <DailyProductivityScoreCard profile={profile} quests={quests} />

       {/* Priority Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#3E2723]">Today's Focus Quests</h2>
            <p className="text-xs text-[#8D6E63]">High-priority tasks waiting on your desk.</p>
          </div>
          <Link
            href="/quests"
            onClick={() => soundEngine.playClick()}
            className="text-xs font-bold text-[#E07A5F] hover:underline flex items-center gap-1"
          >
            <span>Open Quest Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={completeQuest}
                onEdit={() => {}}
                onDelete={deleteQuest}
                onHabitChange={updateHabit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white border border-[#EFEBE9] rounded-3xl p-6">
            <CheckCircle2 className="w-10 h-10 text-[#81B29A] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#3E2723]">All focus quests cleared!</h3>
            <p className="text-xs text-[#8D6E63] mt-1">
              You've completed all active focus tasks. Take a well-deserved break or add new ones.
            </p>
            <Link
              href="/quests"
              onClick={() => soundEngine.playClick()}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Quests</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
