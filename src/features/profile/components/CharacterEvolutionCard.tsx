'use client';

import React, { useState } from 'react';
import { Dumbbell, Brain, Sparkles, Shield, Eye, Flame } from 'lucide-react';
import { Profile } from '@/types/database';
import { getCharacterEvolution, EvolutionTier } from '@/lib/game/evolution';
import { AvatarDisplay } from '@/features/avatar';
import { soundEngine } from '@/lib/audio/sound-engine';

interface CharacterEvolutionCardProps {
  profile: Profile;
}

export const CharacterEvolutionCard: React.FC<CharacterEvolutionCardProps> = ({ profile }) => {
  const evolution = getCharacterEvolution({
    focus_exp: profile.focus_exp,
    vitality_exp: profile.vitality_exp,
    mindfulness_exp: profile.mindfulness_exp,
    discipline_exp: profile.discipline_exp,
    creativity_exp: profile.creativity_exp,
  });

  // Interactive Evolution Stage Preview (allows previewing all 4 stages)
  const [previewTier, setPreviewTier] = useState<EvolutionTier | 'live'>('live');

  const activeVitalityTier: EvolutionTier =
    previewTier === 'live' ? evolution.vitality.tier : previewTier;
  const activeFocusTier: EvolutionTier =
    previewTier === 'live' ? evolution.focus.tier : previewTier;
  const activeZenTier: EvolutionTier =
    previewTier === 'live' ? evolution.zen.tier : previewTier;

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-[#3E2723]">Character Evolution</h2>
            <span
              className={`text-xs font-bold px-3 py-0.5 rounded-full border shadow-2xs ${evolution.badgeColor}`}
            >
              {evolution.archetypeTitle}
            </span>
          </div>
          <p className="text-xs text-[#8D6E63] italic">
            &ldquo;{evolution.archetypeQuote}&rdquo;
          </p>
        </div>

        {/* Preview Selector Pills */}
        <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-2xl border border-[#EFEBE9] self-start sm:self-auto">
          <span className="text-[10px] font-bold text-[#8D6E63] px-2 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Preview:
          </span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setPreviewTier('live');
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              previewTier === 'live'
                ? 'bg-[#E07A5F] text-white shadow-xs'
                : 'text-[#5D4037] hover:bg-[#EFEBE9]'
            }`}
          >
            My State
          </button>
          {([0, 1, 2, 3] as EvolutionTier[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setPreviewTier(t);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                previewTier === t
                  ? 'bg-[#3E2723] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              T{t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Transformation Preview Scene */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm bg-radial from-[#FFF8E1]/60 via-[#FFFBF5] to-transparent p-2 rounded-3xl border border-[#FBE9E7]">
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#EFEBE9] text-[10px] font-extrabold text-[#5D4037] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FFA726]" />
                {previewTier === 'live'
                  ? 'Active Evolution State'
                  : `Previewing Tier ${previewTier} Form`}
              </span>
            </div>

            <AvatarDisplay
              equippedHoodie={profile.equipped_hoodie}
              equippedHeadphones={profile.equipped_headphones}
              equippedGlasses={profile.equipped_glasses}
              equippedPet={profile.equipped_pet}
              level={profile.level}
              vitalityTier={activeVitalityTier}
              focusTier={activeFocusTier}
              zenTier={activeZenTier}
              archetypeTitle={evolution.archetypeTitle}
              showEvolutionBadge={false}
            />

            {/* Current Active Effects Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-2 px-2 pb-2">
              {activeVitalityTier > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
                  🏋️ {evolution.vitality.visualEffect}
                </span>
              )}
              {activeFocusTier > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800">
                  🧠 {evolution.focus.visualEffect}
                </span>
              )}
              {activeZenTier > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                  🧘 {evolution.zen.visualEffect}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Evolution Paths Progression */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Heavy Gym / Vitality Path */}
          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3E2723]">
                    Physical Strength & Physique
                  </h3>
                  <span className="text-[11px] font-bold text-rose-700">
                    Tier {evolution.vitality.tier} • {evolution.vitality.tierName}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-600">
                {evolution.vitality.currentExp} EXP
              </span>
            </div>

            <p className="text-xs text-[#6D4C41] mt-1 mb-2.5">
              {evolution.vitality.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-[#8D6E63]">
                <span>Gym & Workout Prowess</span>
                <span>
                  {evolution.vitality.nextTierExp
                    ? `${evolution.vitality.progressPercent}% to Tier ${evolution.vitality.tier + 1} (${evolution.vitality.nextTierExp} EXP)`
                    : 'Max Tier Unlocked'}
                </span>
              </div>
              <div className="w-full bg-rose-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${evolution.vitality.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Heavy Study / Intellect Aura Path */}
          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3E2723]">
                    Intellect Aura & Focus Mind
                  </h3>
                  <span className="text-[11px] font-bold text-blue-700">
                    Tier {evolution.focus.tier} • {evolution.focus.tierName}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-600">
                {evolution.focus.currentExp} EXP
              </span>
            </div>

            <p className="text-xs text-[#6D4C41] mt-1 mb-2.5">
              {evolution.focus.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-[#8D6E63]">
                <span>Coding & Study Flow Aura</span>
                <span>
                  {evolution.focus.nextTierExp
                    ? `${evolution.focus.progressPercent}% to Tier ${evolution.focus.tier + 1} (${evolution.focus.nextTierExp} EXP)`
                    : 'Max Tier Unlocked'}
                </span>
              </div>
              <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${evolution.focus.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. Consistency / Discipline & Monk Zen Path */}
          <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3E2723]">
                    Discipline Balance & Monk State
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Tier {evolution.zen.tier} • {evolution.zen.tierName}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-600">
                {evolution.zen.currentExp} EXP
              </span>
            </div>

            <p className="text-xs text-[#6D4C41] mt-1 mb-2.5">
              {evolution.zen.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-[#8D6E63]">
                <span>Habit Consistency & Mindfulness Halo</span>
                <span>
                  {evolution.zen.nextTierExp
                    ? `${evolution.zen.progressPercent}% to Tier ${evolution.zen.tier + 1} (${evolution.zen.nextTierExp} EXP)`
                    : 'Max Tier Unlocked'}
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${evolution.zen.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
