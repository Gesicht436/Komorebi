'use client';

import React, { useState } from 'react';
import { Plus, Gift, Trash2, Coins } from 'lucide-react';
import { Profile, Voucher } from '@/types/database';
import { soundEngine } from '@/lib/audio/sound-engine';

interface VoucherSectionProps {
  profile: Profile;
  vouchers: Voucher[];
  onRedeemVoucher: (voucher: Voucher) => Promise<void>;
  onDeleteVoucher: (voucherId: string) => Promise<void>;
  onOpenCreateModal: () => void;
}

export const VoucherSection: React.FC<VoucherSectionProps> = ({
  profile,
  vouchers,
  onRedeemVoucher,
  onDeleteVoucher,
  onOpenCreateModal,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedeem = async (voucher: Voucher) => {
    if (profile.coins < voucher.cost || isProcessing) return;
    setIsProcessing(true);
    soundEngine.playQuestComplete();
    try {
      await onRedeemVoucher(voucher);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (voucherId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    soundEngine.playClick();
    try {
      await onDeleteVoucher(voucherId);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create Voucher Trigger Card */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenCreateModal();
          }}
          className="border-2 border-dashed border-[#D7CCC8] hover:border-[#E07A5F] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center text-[#8D6E63] hover:text-[#E07A5F] hover:bg-white/50 transition-all cursor-pointer min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-full bg-[#F5EFEB] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#E07A5F]" />
          </div>
          <div>
            <div className="text-sm font-bold">Create Reward Voucher</div>
            <div className="text-xs text-[#A1887F] mt-0.5">
              Set real-life treats (e.g., Boba, Anime, Gaming)
            </div>
          </div>
        </button>

        {/* Existing Vouchers */}
        {vouchers.map((voucher) => {
          const canAfford = profile.coins >= voucher.cost;

          return (
            <div
              key={voucher.id}
              className="bg-white border border-[#EFEBE9] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#D7CCC8] transition-all relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-[#E07A5F]">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm font-extrabold text-[#E07A5F]">
                      <Coins className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
                      <span>{voucher.cost} 🪙</span>
                    </div>
                    <button
                      onClick={() => handleDelete(voucher.id)}
                      title="Delete Voucher"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#A1887F] hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#3E2723]">{voucher.title}</h3>
                <p className="text-xs text-[#8D6E63] mt-1">
                  Redeemed {voucher.times_redeemed || 0} times so far
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
  );
};
