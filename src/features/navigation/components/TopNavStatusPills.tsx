'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Coins,
  RotateCcw,
  LogOut,
  Coffee,
  Timer,
} from 'lucide-react';
import { Profile } from '@/types/database';
import { soundEngine } from '@/lib/audio/sound-engine';
import { useGame } from '@/context/GameContext';
import { TopNavAudioControls } from './TopNavAudioControls';

interface TopNavStatusPillsProps {
  profile: Profile | null;
  onSignOut: () => void;
  isDemoMode?: boolean;
  onResetDemo?: () => void;
}

export const TopNavStatusPills: React.FC<TopNavStatusPillsProps> = ({
  profile,
  onSignOut,
  isDemoMode = false,
  onResetDemo,
}) => {
  const pathname = usePathname();
  const { timerState } = useGame();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Active Background Break Pill */}
      {timerState.isRunning && timerState.mode !== 'focus' && pathname !== '/focus' && (
        <Link
          href="/focus"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] text-xs font-semibold hover:bg-[#C8E6C9] transition-all shadow-xs animate-pulse"
          title="Break timer running in background - click to view"
        >
          <Coffee className="w-3.5 h-3.5 text-[#43A047]" />
          <span>
            Break: {Math.floor(timerState.timeLeft / 60)}:
            {String(timerState.timeLeft % 60).padStart(2, '0')}
          </span>
        </Link>
      )}

      {/* Auto-Paused Focus Pill */}
      {timerState.wasAutoPausedFocus && pathname !== '/focus' && (
        <Link
          href="/focus"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF3E0] border border-[#FFE082] text-[#E65100] text-xs font-semibold hover:bg-[#FFE082]/60 transition-all shadow-xs"
          title="Deep Focus auto-paused while away - click to resume"
        >
          <Timer className="w-3.5 h-3.5 text-[#FB8C00]" />
          <span>Resume Focus</span>
        </Link>
      )}

      {/* Streak Badge */}
      {profile && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-[#F57F17] text-xs sm:text-sm font-semibold shadow-xs"
          title="Consecutive Days of Progress"
        >
          <Flame className="w-4 h-4 fill-[#F57F17] animate-flame" />
          <span>{profile.streak_count || 0}d</span>
        </div>
      )}

      {/* Coins Badge */}
      {profile && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF3E0] border border-[#FFCC80] text-[#E65100] text-xs sm:text-sm font-semibold shadow-xs"
          title="Study Coins"
        >
          <Coins className="w-4 h-4 fill-[#FFA726]" />
          <span>{profile.coins || 0}</span>
        </div>
      )}

      {/* Reset Demo Data Button */}
      {isDemoMode && onResetDemo && (
        <button
          onClick={() => {
            if (confirm('Reset all demo data (quests, coins, inventory) back to defaults?')) {
              soundEngine.playLevelUp();
              onResetDemo();
            }
          }}
          title="Reset demo data back to default"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDE7F6] border border-[#D1C4E9] text-[#5E35B1] hover:bg-[#D1C4E9] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      )}

      {/* Procedural Audio Controls */}
      <TopNavAudioControls />

      {/* Sign Out */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onSignOut();
        }}
        title="Sign Out"
        className="p-2 rounded-xl text-[#8D6E63] hover:text-[#D32F2F] hover:bg-[#FFEBEE] transition-all cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
