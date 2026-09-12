'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Sparkles,
  Lock,
  Check,
  Plus,
  Gift,
  Shirt,
  Headphones,
  Glasses,
  Cat,
  Sun,
  Coffee,
  Gamepad2,
  Film,
  Trash2,
} from 'lucide-react';
import { InventoryItem, Profile, ShopItem, Voucher } from '@/types/database';
import { SHOP_CATALOGUE } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';

interface ShopViewProps {
  profile: Profile;
  inventory: InventoryItem[];
  vouchers: Voucher[];
  onPurchaseItem: (item: ShopItem) => Promise<void>;
  onEquipItem: (category: string, itemId: string) => Promise<void>;
  onCreateVoucher: (title: string, cost: number, icon: string) => Promise<void>;
  onRedeemVoucher: (voucher: Voucher) => Promise<void>;
  onDeleteVoucher: (voucherId: string) => Promise<void>;
}

export const ShopView: React.FC<ShopViewProps> = ({
  profile,
  inventory,
  vouchers,
  onPurchaseItem,
  onEquipItem,
  onCreateVoucher,
  onRedeemVoucher,
  onDeleteVoucher,
}) => {
  const [activeTab, setActiveTab] = useState<'virtual' | 'vouchers'>('virtual');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherCost, setNewVoucherCost] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const ownedItemIds = new Set(inventory.map((i) => i.item_id));

  // Determine if item is currently equipped on profile
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
    soundEngine.playCoinClink();
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

  const handleCreateVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherTitle.trim() || isProcessing) return;
    setIsProcessing(true);
    soundEngine.playClick();
    try {
      await onCreateVoucher(newVoucherTitle.trim(), Number(newVoucherCost), 'gift');
      setNewVoucherTitle('');
      setNewVoucherCost(50);
      setIsVoucherModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedeem = async (voucher: Voucher) => {
    if (profile.coins < voucher.cost || isProcessing) return;
    if (confirm(`Redeem "${voucher.title}" for ${voucher.cost} coins?`)) {
      setIsProcessing(true);
      soundEngine.playQuestComplete();
      try {
        await onRedeemVoucher(voucher);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Shop Header Banner */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3E0] text-[#E65100] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Study Rewards & Armory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
            Boutique & Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
            Exchange your hard-earned study coins for cozy avatar gear or real-life rewards.
          </p>
        </div>

        {/* Coin Balance Pill */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] self-start sm:self-center shadow-xs">
          <Coins className="w-5 h-5 text-[#F57F17] fill-[#F57F17]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#8D6E63]">Available Balance</div>
            <div className="text-lg font-extrabold text-[#3E2723]">{profile.coins || 0} Coins</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#EFEBE9] pb-3">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('virtual');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'virtual'
              ? 'bg-[#E07A5F] text-white shadow-xs'
              : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
          }`}
        >
          Avatar Boutique & Pets
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('vouchers');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-[#E07A5F] text-white shadow-xs'
              : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
          }`}
        >
          Real-Life Vouchers ({vouchers.length})
        </button>
      </div>

      {/* TAB 1: VIRTUAL BOUTIQUE */}
      {activeTab === 'virtual' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'hoodie', label: 'Hoodies' },
              { id: 'headphones', label: 'Headphones' },
              { id: 'glasses', label: 'Glasses' },
              { id: 'pet', label: 'Pet Companions' },
              { id: 'theme', label: 'Room Themes' },
            ].map((cat) => (
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
                          className="w-full py-2.5 rounded-xl bg-[#5D4037] hover:bg-[#3E2723] text-white text-xs font-bold transition-all active:scale-98 cursor-pointer"
                        >
                          Equip
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford || isProcessing}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-[#E07A5F] hover:bg-[#D46A4F] text-white shadow-xs active:scale-98'
                            : 'bg-[#F5EFEB] text-[#A1887F] cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? `Purchase for ${item.cost} Coins` : 'Insufficient Coins'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REAL-LIFE VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8D6E63]">
              Hold yourself accountable by redeeming real treats only when you have earned the coins!
            </p>
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsVoucherModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Voucher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((voucher) => {
              const canAfford = profile.coins >= voucher.cost;
              return (
                <div
                  key={voucher.id}
                  className="bg-white border border-[#EFEBE9] rounded-2xl p-5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm font-extrabold text-[#E07A5F]">
                          <Coins className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
                          {voucher.cost} 🪙
                        </span>
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            if (confirm('Delete this voucher?')) {
                              onDeleteVoucher(voucher.id);
                            }
                          }}
                          className="p-1 text-[#8D6E63] hover:text-[#D32F2F]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#3E2723]">{voucher.title}</h3>
                    <p className="text-xs text-[#8D6E63] mt-1">
                      Redeemed {voucher.times_redeemed} times so far
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(voucher)}
                    disabled={!canAfford || isProcessing}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#81B29A] hover:bg-[#689F88] text-white shadow-xs active:scale-98'
                        : 'bg-[#F5EFEB] text-[#A1887F] cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher' : `Need ${voucher.cost - profile.coins} more 🪙`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE VOUCHER MODAL */}
      <AnimatePresence>
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/30 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFBF5] border border-[#EFEBE9] rounded-3xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-lg font-bold text-[#3E2723] mb-3">Create Custom Reward Voucher</h3>
              <form onSubmit={handleCreateVoucherSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">
                    Reward Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 1 Episode of Anime, Matcha Latte, Spa Day"
                    value={newVoucherTitle}
                    onChange={(e) => setNewVoucherTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D7CCC8] text-xs focus:ring-1 focus:ring-[#E07A5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">
                    Cost in Coins
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    required
                    value={newVoucherCost}
                    onChange={(e) => setNewVoucherCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D7CCC8] text-xs focus:ring-1 focus:ring-[#E07A5F]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-[#8D6E63] hover:bg-[#F5EFEB]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#D46A4F]"
                  >
                    Create Voucher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
