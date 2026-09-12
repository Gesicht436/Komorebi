'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Coins,
  Brain,
  Heart,
  Sparkles,
  Palette,
  Shield,
  Clock,
  Calendar,
  Edit3,
  Check,
} from 'lucide-react';
import { ActivityLog, Profile } from '@/types/database';
import {
  ATTRIBUTE_CONFIG,
  getAttributeLevel,
  getTitleForLevel,
  getXpRequiredForLevel,
} from '@/lib/game/engine';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { soundEngine } from '@/lib/audio/sound-engine';

interface ProfileViewProps {
  profile: Profile;
  activityLogs: ActivityLog[];
  onUpdateDisplayName: (name: string) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  activityLogs,
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

  const attributes = [
    {
      key: 'focus' as const,
      exp: profile.focus_exp,
      config: ATTRIBUTE_CONFIG.focus,
      icon: Brain,
    },
    {
      key: 'vitality' as const,
      exp: profile.vitality_exp,
      config: ATTRIBUTE_CONFIG.vitality,
      icon: Heart,
    },
    {
      key: 'mindfulness' as const,
      exp: profile.mindfulness_exp,
      config: ATTRIBUTE_CONFIG.mindfulness,
      icon: Sparkles,
    },
    {
      key: 'creativity' as const,
      exp: profile.creativity_exp,
      config: ATTRIBUTE_CONFIG.creativity,
      icon: Palette,
    },
    {
      key: 'discipline' as const,
      exp: profile.discipline_exp,
      config: ATTRIBUTE_CONFIG.discipline,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Character Card */}
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
                    className="p-2 rounded-xl bg-[#E07A5F] text-white hover:bg-[#D46A4F]"
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
                    className="p-1 text-[#8D6E63] hover:text-[#3E2723]"
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

      {/* Attributes Breakdown */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-extrabold text-[#3E2723] mb-1">Life RPG Attributes</h2>
        <p className="text-xs text-[#8D6E63] mb-6">
          Every quest you complete feeds into its respective life attribute, leveling up your real-world character stats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attributes.map(({ key, exp, config, icon: Icon }) => {
            const attrLvl = getAttributeLevel(exp);
            return (
              <div
                key={key}
                className="p-4 rounded-2xl border border-[#EFEBE9] bg-[#FDFBF7] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${config.badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                    <span className="text-xs font-extrabold text-[#3E2723]">Level {attrLvl}</span>
                  </div>

                  <p className="text-[11px] text-[#8D6E63] mt-1 leading-normal">
                    {config.description}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#5D4037] mb-1">
                    <span>Exp</span>
                    <span>{exp} EXP</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEBE9] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.barColor} rounded-full transition-all`}
                      style={{ width: `${Math.min(100, (exp % 150) / 1.5)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Activity Consistency Heatmap */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8D6E63]" />
            <h2 className="text-xl font-extrabold text-[#3E2723]">30-Day Study Consistency</h2>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8D6E63]">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-[#F5EFEB]" />
            <div className="w-3 h-3 rounded-sm bg-[#C8E6C9]" />
            <div className="w-3 h-3 rounded-sm bg-[#81C784]" />
            <div className="w-3 h-3 rounded-sm bg-[#2E7D32]" />
            <span>More Active</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
          {Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dateStr = d.toISOString().split('T')[0];
            const count = activityLogs.filter((l) => l.created_at?.startsWith(dateStr)).length;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const colorClass =
              count === 0
                ? 'bg-[#F5EFEB] text-[#A1887F]'
                : count === 1
                ? 'bg-[#C8E6C9] text-[#2E7D32]'
                : count === 2
                ? 'bg-[#81C784] text-white font-bold'
                : 'bg-[#2E7D32] text-white font-bold';

            return (
              <div
                key={dateStr}
                title={`${dateStr}: ${count} activity events`}
                className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${colorClass} ${
                  isToday ? 'ring-2 ring-[#E07A5F]' : ''
                }`}
              >
                <span className="text-[10px] font-bold">{d.getDate()}</span>
                <span className="text-[8px] uppercase opacity-75">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Logs History */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#8D6E63]" />
          <h2 className="text-xl font-extrabold text-[#3E2723]">Progression Chronicle</h2>
        </div>

        {activityLogs.length > 0 ? (
          <div className="divide-y divide-[#EFEBE9] max-h-80 overflow-y-auto pr-2">
            {activityLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#3E2723] capitalize">
                    {log.action_type.replace('_', ' ')}
                  </span>
                  {log.attribute && (
                    <span className="ml-2 text-[10px] text-[#8D6E63] capitalize">
                      ({log.attribute})
                    </span>
                  )}
                  <div className="text-[10px] text-[#BCAAA4]">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-bold">
                  {log.xp_gained > 0 && (
                    <span className="text-[#E07A5F]">+{log.xp_gained} XP</span>
                  )}
                  {log.coins_change !== 0 && (
                    <span className={log.coins_change > 0 ? 'text-[#F57F17]' : 'text-red-500'}>
                      {log.coins_change > 0 ? `+${log.coins_change}` : log.coins_change} 🪙
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8D6E63] italic">
            No activity logs recorded yet. Begin your journey on the Quest Board!
          </p>
        )}
      </div>
    </div>
  );
};
