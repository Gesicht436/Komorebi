'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { ShopView } from '@/components/shop/ShopView';

export default function ShopPage() {
  const {
    profile,
    inventory,
    vouchers,
    activityLogs,
    purchaseShopItem,
    equipItem,
    createVoucher,
    redeemVoucher,
    deleteVoucher,
    buyStreakShield,
    pullGacha,
  } = useGame();

  if (!profile) return null;

  return (
    <div>
      <ShopView
        profile={profile}
        inventory={inventory}
        vouchers={vouchers}
        activityLogs={activityLogs}
        onPurchaseItem={purchaseShopItem}
        onEquipItem={equipItem}
        onCreateVoucher={createVoucher}
        onRedeemVoucher={redeemVoucher}
        onDeleteVoucher={deleteVoucher}
        onBuyStreakShield={buyStreakShield}
        onPullGacha={pullGacha}
      />
    </div>
  );
}
