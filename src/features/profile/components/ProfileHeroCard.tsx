'use client';

import React, { useState } from 'react';
import { Flame, Coins, Trophy, Edit3, Check } from 'lucide-react';
import { Profile } from '@/types/database';
import { getTitleForLevel, getXpRequiredForLevel } from '@/lib/game/engine';
import { AvatarDisplay } from '@/features/avatar';
import { soundEngine } from '@/lib/audio/sound-engine';

interface ProfileHeroCardProps {
  profile: Profile;
  onUpdateDisplayName: (name: string) => Promise<void>;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  profile,
  onUpdateDisplayName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.display_name || '');
  const [isSaving, setIsSaving] = useState(false);

  const title = getTitleForLevel(profile.level);
  const xpRequired = getXpRequiredForLevel(profile.level);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((profile.current_xp / xpRequired) * 100))
  );

  const handleSaveName = async () => {
    if (!nameInput.trim() || isSaving) return;
    setIsSaving(true);
    soundEngine.playClick();
    try {
      await onUpdateDisplayName(nameInput.trim());
      setIsEditingName(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Avatar Preview */}
        <div className="md:col-span-5 flex justify-center">
          <AvatarDisplay
            equippedHoodie={profile.equipped_hoodie}
            equippedHeadphones={profile.equipped_headphones}
            equippedGlasses={profile.equipped_glasses}
            equippedPet={profile.equipped_pet}
            level={profile.level}
            className="max-w-xs"
          />
        </div>

        {/* Profile Stats Overview */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FBE9E7] text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
              Level {profile.level} Scholar
            </span>
            <span className="text-xs font-bold text-[#8D6E63] italic">• {title}</span>
          </div>

          {/* Display Name Edit */}
          <div className="flex items-center gap-3">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D7CCC8] text-xl font-extrabold text-[#3E2723] focus:ring-1 focus:ring-[#E07A5F]"
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="p-2 rounded-xl bg-[#E07A5F] text-white hover:bg-[#D46A4F] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
                  {profile.display_name}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-[#8D6E63] hover:text-[#3E2723] cursor-pointer"
                  title="Change Name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Level XP Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#5D4037]">
              <span>Overall Experience</span>
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
            <div className="text-[11px] text-[#8D6E63] text-right">
              Total Lifetime XP: {profile.total_xp}
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[#F57F17] mb-0.5">
                <Flame className="w-4 h-4 fill-[#F57F17] animate-flame" />
                <span className="text-base font-extrabold">{profile.streak_count}</span>
              </div>
              <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Active Streak</div>
            </div>

            <div className="bg-[#FFF3E0] border border-[#FFCC80] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[#E65100] mb-0.5">
                <Coins className="w-4 h-4 fill-[#FFA726]" />
                <span className="text-base font-extrabold">{profile.coins}</span>
              </div>
              <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Study Coins</div>
            </div>

            <div className="bg-[#EDE7F6] border border-[#D1C4E9] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[#5E35B1] mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-base font-extrabold">{profile.level}</span>
              </div>
              <div className="text-[10px] font-bold text-[#8D6E63] uppercase">Player Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
