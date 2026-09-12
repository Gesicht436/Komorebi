'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Coins,
  Trophy,
  Trees,
  PenTool,
  Coffee,
  Disc,
  Gem,
  X,
  RefreshCw,
  Gift,
} from 'lucide-react';
import { InventoryItem, Profile } from '@/types/database';
import {
  GACHA_POOL,
  GACHA_PULL_COST,
  GachaItem,
  RARITY_CONFIG,
} from '../constants/gacha-pool';
import { soundEngine } from '@/lib/audio/sound-engine';

interface GachaMachineProps {
  profile: Profile;
  inventory: InventoryItem[];
  onPullGacha: () => Promise<GachaItem | null>;
}

export const GachaMachine: React.FC<GachaMachineProps> = ({
  profile,
  inventory,
  onPullGacha,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [pulledItem, setPulledItem] = useState<GachaItem | null>(null);

  const ownedItemIds = new Set(
    inventory.filter((i) => i.category === 'collectible').map((i) => i.item_id)
  );

  const canAfford = profile.coins >= GACHA_PULL_COST;

  const handleCrank = async () => {
    if (!canAfford || isRolling) return;
    setIsRolling(true);
    setPulledItem(null);
    soundEngine.playClick();

    try {
      const item = await onPullGacha();
      if (item) {
        // Dramatic reveal timing
        setTimeout(() => {
          soundEngine.playLevelUp();
          setPulledItem(item);
          setIsRolling(false);
        }, 1200);
      } else {
        setIsRolling(false);
      }
    } catch {
      setIsRolling(false);
    }
  };

  const getGachaIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Trees':
        return <Trees className={className} />;
      case 'PenTool':
        return <PenTool className={className} />;
      case 'Coffee':
        return <Coffee className={className} />;
      case 'Disc':
        return <Disc className={className} />;
      case 'Gem':
        return <Gem className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Gacha Dispenser Hero Card */}
      <div className="bg-gradient-to-tr from-[#FFF8E1] via-white to-[#FBE9E7] border border-[#FFE082] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Machine Graphic / Dial */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <motion.div
                animate={isRolling ? { rotate: [0, -20, 20, -10, 10, 0], scale: [1, 1.05, 0.95, 1] } : {}}
                transition={{ repeat: isRolling ? Infinity : 0, duration: 0.6 }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] text-white flex items-center justify-center shadow-lg shadow-[#E07A5F]/30"
              >
                {isRolling ? (
                  <RefreshCw className="w-12 h-12 animate-spin text-white" />
                ) : (
                  <Gift className="w-12 h-12 text-white" />
                )}
              </motion.div>
              {/* Crank Knob Badge */}
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#3E2723] text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                30 🪙 / Pull
              </div>
            </div>

            <h3 className="text-base font-extrabold text-[#3E2723] mt-4">
              Retro Gacha Dispenser
            </h3>
            <p className="text-xs text-[#8D6E63] mt-0.5">
              Pull for collectible desk treasures & jackpot coin pouches!
            </p>
          </div>

          {/* Machine Description & Action */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(RARITY_CONFIG).map(([rarityKey, cfg]) => (
                <span
                  key={rarityKey}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.badgeColor}`}
                >
                  {cfg.label} ({cfg.dropRate})
                </span>
              ))}
            </div>

            <p className="text-xs text-[#6D4C41] leading-relaxed">
              Each turn dispenses a mystery capsule containing vintage desk trinkets, study artifacts, or jackpot coins. All collectibles are permanently displayed in your Scholar Trophy Showcase.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCrank}
                disabled={!canAfford || isRolling}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  isRolling
                    ? 'bg-[#EFEBE9] text-[#8D6E63]'
                    : canAfford
                    ? 'bg-[#E07A5F] hover:bg-[#D46A4F] text-white hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-[#D7CCC8] text-white cursor-not-allowed opacity-75'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isRolling
                    ? 'Cranking Capsule Machine...'
                    : `Insert ${GACHA_PULL_COST} 🪙 & Crank Dial`}
                </span>
              </button>

              <div className="text-xs font-semibold text-[#8D6E63]">
                Your Balance: <span className="font-bold text-[#E07A5F]">{profile.coins} 🪙</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Reveal Modal */}
      <AnimatePresence>
        {pulledItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              {/* Top celebration glow */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-70 pointer-events-none"
                style={{ backgroundColor: pulledItem.glowColor }}
              />

              <button
                onClick={() => setPulledItem(null)}
                className="absolute right-4 top-4 p-1.5 rounded-xl text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#F5EFEB] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 space-y-4">
                <span
                  className={`inline-block text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                    RARITY_CONFIG[pulledItem.rarity].badgeColor
                  }`}
                >
                  {RARITY_CONFIG[pulledItem.rarity].label} Capsule
                </span>

                {/* Unlocked Icon */}
                <div
                  className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white shadow-lg animate-float"
                  style={{ backgroundColor: pulledItem.color }}
                >
                  {getGachaIcon(pulledItem.icon, 'w-10 h-10')}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#3E2723]">
                    {pulledItem.name}
                  </h3>
                  <p className="text-xs text-[#6D4C41] mt-1 leading-relaxed">
                    {pulledItem.description}
                  </p>
                </div>

                {pulledItem.bonusCoins && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>+{pulledItem.bonusCoins} Bonus Coins Added!</span>
                  </div>
                )}

                <button
                  onClick={() => setPulledItem(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Collect & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collectibles Showcase Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#3E2723]">
              Your Capsule Collection
            </h3>
            <p className="text-xs text-[#8D6E63]">
              Collect all 8 study treasures from the capsule dispenser.
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#E07A5F] bg-[#FBE9E7] px-3 py-1 rounded-full">
            {ownedItemIds.size} / {GACHA_POOL.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GACHA_POOL.map((item) => {
            const isOwned = ownedItemIds.has(item.id) || item.rarity === 'jackpot';
            const rarityCfg = RARITY_CONFIG[item.rarity];

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isOwned
                    ? 'bg-white border-[#EFEBE9] shadow-xs hover:border-[#D7CCC8]'
                    : 'bg-[#F9F7F4] border-[#EFEBE9] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${rarityCfg.badgeColor}`}
                    >
                      {rarityCfg.label}
                    </span>
                    {isOwned && (
                      <span className="text-[9px] font-bold text-emerald-600">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 ${
                      isOwned ? '' : 'grayscale opacity-50'
                    }`}
                    style={{ backgroundColor: item.color }}
                  >
                    {getGachaIcon(item.icon, 'w-5 h-5')}
                  </div>

                  <h4 className="text-xs font-bold text-[#3E2723] leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#8D6E63] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
