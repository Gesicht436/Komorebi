'use client';

import React, { useState } from 'react';
import { Shield, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Profile } from '@/types/database';
import { STREAK_SHIELD_CONFIG } from '../constants/streak-shield';
import { soundEngine } from '@/lib/audio/sound-engine';

interface StreakShieldCardProps {
  profile: Profile;
  onBuyShield: () => Promise<void>;
}

export const StreakShieldCard: React.FC<StreakShieldCardProps> = ({
  profile,
  onBuyShield,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const currentShields = profile.streak_shields || 0;
  const isMaxed = currentShields >= STREAK_SHIELD_CONFIG.maxShields;
  const canAfford = profile.coins >= STREAK_SHIELD_CONFIG.cost;

  const handlePurchase = async () => {
    if (isMaxed || !canAfford || isProcessing) return;
    setIsProcessing(true);
    soundEngine.playLevelUp();
    try {
      await onBuyShield();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFBF5] to-[#F5EFEB] border border-[#E0D7D0] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-sky-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            {currentShields > 0 ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <Shield className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#3E2723]">
                {STREAK_SHIELD_CONFIG.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {currentShields} / {STREAK_SHIELD_CONFIG.maxShields} Active
              </span>
            </div>

            <p className="text-xs text-[#6D4C41] mt-1 max-w-xl leading-relaxed">
              {STREAK_SHIELD_CONFIG.description}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-[#8D6E63]">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
                Auto-absorbs 1 missed study day
              </span>
              <span>•</span>
              <span className="font-semibold">
                Cost: <span className="font-bold text-[#E07A5F]">{STREAK_SHIELD_CONFIG.cost} 🪙</span>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 shrink-0">
          <button
            onClick={handlePurchase}
            disabled={isMaxed || !canAfford || isProcessing}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              isMaxed
                ? 'bg-[#EFEBE9] text-[#8D6E63] cursor-not-allowed'
                : canAfford
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-[#D7CCC8] text-white cursor-not-allowed opacity-75'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>
              {isMaxed
                ? 'Max Capacity (3/3)'
                : isProcessing
                ? 'Activating Shield...'
                : `Buy Streak Shield (${STREAK_SHIELD_CONFIG.cost} 🪙)`}
            </span>
          </button>

          {!canAfford && !isMaxed && (
            <span className="text-[11px] text-rose-600 flex items-center justify-center md:justify-end gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" />
              Need {STREAK_SHIELD_CONFIG.cost - profile.coins} more coins
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
