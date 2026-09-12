'use client';

import React, { useState } from 'react';
import {
  Coins,
  Lock,
  Check,
  Shirt,
  Headphones,
  Glasses,
  Cat,
  Sun,
} from 'lucide-react';
import { InventoryItem, Profile, ShopItem } from '@/types/database';
import { SHOP_CATALOGUE } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';
import { SHOP_CATEGORIES } from '../types';

interface BoutiqueSectionProps {
  profile: Profile;
  inventory: InventoryItem[];
  onPurchaseItem: (item: ShopItem) => Promise<void>;
  onEquipItem: (category: string, itemId: string) => Promise<void>;
}

export const BoutiqueSection: React.FC<BoutiqueSectionProps> = ({
  profile,
  inventory,
  onPurchaseItem,
  onEquipItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const ownedItemIds = new Set(inventory.map((i) => i.item_id));

  const isItemEquipped = (item: ShopItem): boolean => {
    if (item.category === 'hoodie') return profile.equipped_hoodie === item.id;
    if (item.category === 'headphones') return profile.equipped_headphones === item.id;
    if (item.category === 'glasses') return profile.equipped_glasses === item.id;
    if (item.category === 'pet') return profile.equipped_pet === item.id;
    if (item.category === 'theme') return profile.equipped_theme === item.id;
    return false;
  };

  const filteredShopItems = SHOP_CATALOGUE.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleBuy = async (item: ShopItem) => {
    if (profile.coins < item.cost || profile.level < item.levelRequired || isProcessing) return;
    setIsProcessing(true);
    soundEngine.playClick();
    try {
      await onPurchaseItem(item);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    if (isProcessing) return;
    setIsProcessing(true);
    soundEngine.playClick();
    try {
      await onEquipItem(item.category, item.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnequip = async (category: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    soundEngine.playClick();
    try {
      await onEquipItem(category, 'none');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundEngine.playClick();
              setSelectedCategory(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#3E2723] text-white'
                : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShopItems.map((item) => {
          const isOwned = ownedItemIds.has(item.id);
          const isEquipped = isItemEquipped(item);
          const isLockedByLevel = profile.level < item.levelRequired;
          const canAfford = profile.coins >= item.cost;

          const Icon =
            item.category === 'hoodie'
              ? Shirt
              : item.category === 'headphones'
              ? Headphones
              : item.category === 'glasses'
              ? Glasses
              : item.category === 'pet'
              ? Cat
              : Sun;

          return (
            <div
              key={item.id}
              className="bg-white border border-[#EFEBE9] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#D7CCC8] transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: item.previewColor || '#8D6E63' }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    {isOwned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold">
                        <Check className="w-3 h-3" />
                        Owned
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-sm font-extrabold text-[#E07A5F]">
                        <Coins className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
                        <span>{item.cost} 🪙</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#3E2723]">{item.name}</h3>
                <p className="text-xs text-[#8D6E63] mt-1 leading-relaxed">
                  {item.description}
                </p>

                {item.bonusText && (
                  <div className="mt-2.5 inline-block px-2 py-0.5 rounded-md bg-[#FBE9E7] text-[#E07A5F] text-[10px] font-bold">
                    ⭐ {item.bonusText}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-[#EFEBE9]">
                {isLockedByLevel ? (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#8D6E63] bg-[#F5EFEB] rounded-xl">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlocks at Level {item.levelRequired}</span>
                  </div>
                ) : isOwned ? (
                  isEquipped ? (
                    <div className="flex items-center gap-2">
                      <span className="flex-1 py-2 text-center text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-xl">
                        ✓ Currently Equipped
                      </span>
                      {item.category !== 'hoodie' && (
                        <button
                          onClick={() => handleUnequip(item.category)}
                          disabled={isProcessing}
                          className="px-3 py-2 text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] bg-[#F5EFEB] rounded-xl cursor-pointer"
                        >
                          Unequip
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEquip(item)}
                      disabled={isProcessing}
                      className="w-full py-2 bg-[#3E2723] hover:bg-[#2C1810] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Equip on Avatar
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford || isProcessing}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#E07A5F] hover:bg-[#D46A4F] text-white shadow-xs'
                        : 'bg-[#F5EFEB] text-[#A1887F] cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Purchase for ${item.cost} Coins` : `Need ${item.cost - profile.coins} More Coins`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
