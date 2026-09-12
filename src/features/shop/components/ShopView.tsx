'use client';

import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';
import { ShopViewProps, ShopTab } from '../types';
import { BoutiqueSection } from './BoutiqueSection';
import { VoucherSection } from './VoucherSection';
import { CreateVoucherModal } from './CreateVoucherModal';

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
  const [activeTab, setActiveTab] = useState<ShopTab>('virtual');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
            Boutique & Reward Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
            Exchange your earned study coins for cute anime companion apparel, desk pets, and real-life treats.
          </p>
        </div>

        {/* Available Balance Pill */}
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

      {/* Tab 1: Virtual Boutique */}
      {activeTab === 'virtual' && (
        <BoutiqueSection
          profile={profile}
          inventory={inventory}
          onPurchaseItem={onPurchaseItem}
          onEquipItem={onEquipItem}
        />
      )}

      {/* Tab 2: Real-Life Vouchers */}
      {activeTab === 'vouchers' && (
        <VoucherSection
          profile={profile}
          vouchers={vouchers}
          onRedeemVoucher={onRedeemVoucher}
          onDeleteVoucher={onDeleteVoucher}
          onOpenCreateModal={() => setIsVoucherModalOpen(true)}
        />
      )}

      {/* Custom Voucher Creation Modal */}
      <CreateVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onCreate={onCreateVoucher}
      />
    </div>
  );
};
