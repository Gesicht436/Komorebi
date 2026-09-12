'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, Flame, ArrowRight, ShieldAlert, Trophy } from 'lucide-react';
import { BossBattle } from '@/types/database';
import { soundEngine } from '@/lib/audio/sound-engine';

interface BossRaidPreviewCardProps {
  boss: BossBattle;
  onOpenArena: () => void;
}

export const BossRaidPreviewCard: React.FC<BossRaidPreviewCardProps> = ({
  boss,
  onOpenArena,
}) => {
  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.current_hp / boss.max_hp) * 100)));
  const isDefeated = boss.is_defeated || boss.current_hp <= 0;

  return (
    <div className="bg-gradient-to-br from-[#FFFBF5] to-white border border-[#EFEBE9] rounded-3xl p-6 shadow-xs relative overflow-hidden">
      {/* Background Red/Amber Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-red-500/10 via-orange-500/5 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            {isDefeated ? <Trophy className="w-6 h-6 text-yellow-200" /> : <Flame className="w-6 h-6 animate-pulse" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-600">
                Active Dungeon Raid
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isDefeated
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isDefeated ? 'Defeated!' : `${hpPercent}% HP Remaining`}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#3E2723]">
              {boss.boss_name}
            </h3>
            <p className="text-xs text-[#8D6E63]">
              Every task & Pomodoro session deals direct combat damage to slay this monster.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenArena();
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-extrabold text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Swords className="w-4 h-4" />
          <span>{isDefeated ? 'Claim Spoils / Summon Next' : 'Enter Battle Arena'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Boss Health Bar */}
      <div className="mt-4 pt-3 border-t border-[#EFEBE9] space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#5D4037]">
          <span>Boss Health</span>
          <span>
            {Math.max(0, boss.current_hp)} / {boss.max_hp} HP
          </span>
        </div>
        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hpPercent > 50
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400'
                : hpPercent > 20
                ? 'bg-gradient-to-r from-red-700 via-red-500 to-orange-500'
                : 'bg-gradient-to-r from-red-900 via-red-600 to-red-500 animate-pulse'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
