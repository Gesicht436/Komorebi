'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Swords,
  ShieldAlert,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  Timer,
  CheckCircle2,
  Calendar,
  X,
  RefreshCw,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BossBattle, Profile, Quest } from '@/types/database';
import { BOSS_PRESETS, getTaskDamage, getWeeklyCountdown } from '@/lib/game/boss-battle';
import { soundEngine } from '@/lib/audio/sound-engine';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { getCharacterEvolution } from '@/lib/game/evolution';
import { BossDragonSvg } from './BossDragonSvg';

interface BossBattleArenaProps {
  boss: BossBattle;
  profile: Profile;
  quests: Quest[];
  onDamageBoss: (damage: number, sourceName: string) => Promise<void>;
  onResetBoss: (type: 'dragon' | 'golem' | 'specter', targetDeadline?: string) => Promise<void>;
  onCompleteQuest: (questId: string) => Promise<void>;
  onClose?: () => void;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  boss,
  profile,
  quests,
  onDamageBoss,
  onResetBoss,
  onCompleteQuest,
  onClose,
}) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; isCrit: boolean } | null>(null);
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `⚔️ ${boss.boss_name} challenges you! Complete study tasks to inflict heavy damage.`,
  ]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  // Character evolution stats
  const evolution = getCharacterEvolution({
    focus_exp: profile.focus_exp,
    vitality_exp: profile.vitality_exp,
    mindfulness_exp: profile.mindfulness_exp,
    discipline_exp: profile.discipline_exp,
    creativity_exp: profile.creativity_exp,
  });

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.current_hp / boss.max_hp) * 100)));
  const isDefeated = boss.is_defeated || boss.current_hp <= 0;
  const countdown = getWeeklyCountdown(boss.target_deadline);

  const pendingQuests = quests.filter((q) => !q.is_completed);

  // Trigger Combat Attack
  const handleStrikeWithQuest = async (quest: Quest) => {
    if (isAttacking || isDefeated) return;
    setIsAttacking(true);

    const dmg = getTaskDamage(quest.difficulty);
    const isCrit = quest.difficulty === 'epic' || quest.difficulty === 'hard';

    soundEngine.playCombatHit(isCrit);

    // Trigger Floating Damage Text
    setFloatingDamage({
      id: Date.now(),
      text: `-${dmg} DMG! ${isCrit ? 'CRITICAL ASTRAL STRIKE!' : ''}`,
      isCrit,
    });

    // Append to battle log
    setCombatLogs((prev) => [
      `💥 Struck ${boss.boss_name} with "${quest.title}" for ${dmg} DMG!`,
      ...prev.slice(0, 4),
    ]);

    // Complete quest (which applies direct combat damage to the boss)
    await onCompleteQuest(quest.id);

    if (boss.current_hp - dmg <= 0) {
      soundEngine.playBossDefeated();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setShowVictoryModal(true);
    }

    setTimeout(() => {
      setIsAttacking(false);
      setFloatingDamage(null);
    }, 900);
  };

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Dark fantasy ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-red-500/10 via-orange-500/5 to-transparent pointer-events-none" />

      {/* Arena Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs border border-red-200">
            <Swords className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#3E2723]">
                Accountability Dungeon Raid
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                Weekly Boss Battle
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
                <Timer className="w-2.5 h-2.5 text-stone-500" />
                Resets: {countdown.formatted}
              </span>
            </div>
            <p className="text-xs text-[#8D6E63]">
              Defeat your procrastination in combat. Every completed task inflicts devastating damage!
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#8D6E63] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Boss Health Meter */}
      <div className="bg-[#FFFBF5] border border-[#EFEBE9] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-sm sm:text-base font-black text-[#3E2723]">
                {boss.boss_name}
              </span>
              <span className="text-xs font-semibold text-[#8D6E63] ml-2 hidden sm:inline">
                • {boss.boss_title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-black text-sm text-[#3E2723]">
            <span>
              {Math.max(0, boss.current_hp)} / {boss.max_hp} HP
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                hpPercent > 50
                  ? 'bg-emerald-100 text-emerald-800'
                  : hpPercent > 20
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800 animate-pulse'
              }`}
            >
              {hpPercent}%
            </span>
          </div>
        </div>

        {/* Grand Health Bar */}
        <div className="w-full h-5 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hpPercent > 50
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400'
                : hpPercent > 20
                ? 'bg-gradient-to-r from-red-700 via-red-500 to-orange-500'
                : 'bg-gradient-to-r from-red-900 via-red-600 to-red-500 animate-pulse'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Target Deadline Badge */}
        {boss.target_deadline && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-[#8D6E63]">
            <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Assigned Deadline:</span>
            <span className="text-[#3E2723]">{boss.target_deadline}</span>
          </div>
        )}
      </div>

      {/* The 1v1 Arena Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6 py-4 bg-radial from-[#FFF8E1]/30 to-transparent rounded-3xl border border-dashed border-[#D7CCC8]">
        {/* Left Side: Scholar Champion */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBE9E7] text-[#E07A5F] border border-[#FFCCBC]">
              Level {profile.level} Scholar
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${evolution.badgeColor}`}>
              {evolution.archetypeTitle}
            </span>
          </div>

          <div className="relative w-56 sm:w-64 max-w-full">
            <AvatarDisplay
              equippedHoodie={profile.equipped_hoodie}
              equippedHeadphones={profile.equipped_headphones}
              equippedGlasses={profile.equipped_glasses}
              equippedPet={profile.equipped_pet}
              level={profile.level}
              isStudying={isAttacking}
              vitalityTier={evolution.vitality.tier}
              focusTier={evolution.focus.tier}
              zenTier={evolution.zen.tier}
              archetypeTitle={evolution.archetypeTitle}
              badgeColor={evolution.badgeColor}
            />
          </div>
        </div>

        {/* VS Center Clashing Emblem & Floating Damage */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center relative py-2">
          {floatingDamage && (
            <div
              className={`absolute -top-6 z-30 font-black text-sm sm:text-base px-3 py-1 rounded-full shadow-lg border animate-bounce ${
                floatingDamage.isCrit
                  ? 'bg-amber-400 text-red-950 border-amber-300 ring-2 ring-red-500'
                  : 'bg-red-600 text-white border-red-500'
              }`}
            >
              {floatingDamage.text}
            </div>
          )}

          <div className="w-12 h-12 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-[#FFE082]">
            VS
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8D6E63] mt-1">
            Clash
          </span>
        </div>

        {/* Right Side: Animated Boss */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-red-500" />
              {isDefeated ? 'Defeated' : 'Enraged Wyrm'}
            </span>
          </div>

          <BossDragonSvg
            bossType={boss.boss_type}
            isDamaged={isAttacking}
            isDefeated={isDefeated}
          />
        </div>
      </div>

      {/* Live Combat Log Bar */}
      <div className="bg-stone-900 text-amber-200/90 rounded-2xl p-3.5 mb-6 text-xs font-mono border border-stone-800 shadow-inner">
        <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Live Battle Chronicle</span>
        </div>
        <div className="space-y-1">
          {combatLogs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'text-amber-300 font-bold' : 'text-stone-400 text-[11px]'}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Action Deck: Strike with Active Quests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#3E2723] flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#E07A5F]" />
            <span>Launch Task Strikes Against Boss</span>
          </h3>
          <Link
            href="/focus"
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E07A5F] hover:underline"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Launch 25m Focus Strike (+45 DMG)</span>
          </Link>
        </div>

        {pendingQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingQuests.slice(0, 4).map((quest) => {
              const dmg = getTaskDamage(quest.difficulty);
              return (
                <div
                  key={quest.id}
                  className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#EFEBE9] hover:border-[#E07A5F] transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {quest.difficulty}
                      </span>
                      <span className="text-xs font-bold text-[#3E2723] line-clamp-1">
                        {quest.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8D6E63] flex items-center gap-2">
                      <span className="text-red-600 font-extrabold">⚔️ Inflicts {dmg} DMG</span>
                      <span>• +{quest.xp_reward} XP</span>
                      <span>• +{quest.coin_reward} 🪙</span>
                    </div>
                  </div>

                  <button
                    disabled={isAttacking || isDefeated}
                    onClick={() => handleStrikeWithQuest(quest)}
                    className="px-3.5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-extrabold shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    Strike!
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-[#FFFBF5] border border-dashed border-[#EFEBE9] rounded-2xl p-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-[#3E2723]">No pending focus quests on your desk!</p>
            <p className="text-[11px] text-[#8D6E63] mt-0.5">
              Add new quests from the Quest Board or launch a Pomodoro session to deal damage.
            </p>
            <Link
              href="/quests"
              onClick={() => soundEngine.playClick()}
              className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E07A5F] text-white text-xs font-bold"
            >
              <span>Add More Quests</span>
            </Link>
          </div>
        )}
      </div>

      {/* Victory Celebration Modal */}
      {(showVictoryModal || isDefeated) && (
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-tr from-[#FFF8E1] via-[#FFF3E0] to-[#E8F5E9] border-2 border-[#FFE082] shadow-lg text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center mx-auto shadow-md animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E65100]">
              Victory Achieved
            </span>
            <h3 className="text-2xl font-black text-[#3E2723]">
              {boss.boss_name} Has Been Slain!
            </h3>
            <p className="text-xs text-[#8D6E63] max-w-md mx-auto mt-1">
              Your dedication and daily consistency proved victorious. You have conquered your procrastination and earned legendary loot!
            </p>
          </div>

          {/* Grand Spoils Cards */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-2xl bg-white border border-[#FFE082] font-black text-xs text-[#F57F17] flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>+{boss.reward_xp} Scholar XP</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white border border-[#FFE082] font-black text-xs text-[#E65100] flex items-center gap-1.5 shadow-2xs">
              <span className="text-base">🪙</span>
              <span>+{boss.reward_coins} Study Coins</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white border border-[#C8E6C9] font-black text-xs text-emerald-800 flex items-center gap-1.5 shadow-2xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{boss.reward_item_name} Unlocked</span>
            </div>
          </div>

          {/* Summon Next Boss Selector */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => {
                soundEngine.playLevelUp();
                onResetBoss('dragon');
                setShowVictoryModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold transition-all cursor-pointer"
            >
              🐲 Summon Next Wyrm (500 HP)
            </button>
            <button
              onClick={() => {
                soundEngine.playLevelUp();
                onResetBoss('golem');
                setShowVictoryModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              🗿 Summon Deadline Golem (750 HP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
