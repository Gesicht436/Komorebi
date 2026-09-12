'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';

export default function FocusPage() {
  const { profile, completePomodoroSession, isStudying, setIsStudying } = useGame();

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
          Lo-Fi Study Chamber
        </h1>
        <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
          Lock in for 25 minutes of deep focus. Turn on ambient rain, hear the soft vinyl crackle, and earn Focus XP when your session completes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Animated Avatar Studying Scene */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-white border border-[#EFEBE9] rounded-3xl p-4 shadow-xs">
            <AvatarDisplay
              equippedHoodie={profile.equipped_hoodie}
              equippedHeadphones={profile.equipped_headphones}
              equippedGlasses={profile.equipped_glasses}
              equippedPet={profile.equipped_pet}
              level={profile.level}
              isStudying={isStudying}
            />
            <div className="text-center text-xs font-semibold text-[#8D6E63] mt-2">
              {isStudying ? '✨ Concentrating deeply...' : 'Take a breath and press Start'}
            </div>
          </div>
        </div>

        {/* The Pomodoro Timer */}
        <div className="lg:col-span-7">
          <PomodoroTimer
            onSessionComplete={completePomodoroSession}
            onStudyStateChange={setIsStudying}
          />
        </div>
      </div>
    </div>
  );
}
