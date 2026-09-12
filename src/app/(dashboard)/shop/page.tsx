'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { ShopView } from '@/components/shop/ShopView';

export default function ShopPage() {
  const {
    profile,
    inventory,
    vouchers,
    purchaseShopItem,
    equipItem,
    createVoucher,
    redeemVoucher,
    deleteVoucher,
  } = useGame();

  if (!profile) return null;

  return (
    <div>
      <ShopView
        profile={profile}
        inventory={inventory}
        vouchers={vouchers}
        onPurchaseItem={purchaseShopItem}
        onEquipItem={equipItem}
        onCreateVoucher={createVoucher}
        onRedeemVoucher={redeemVoucher}
        onDeleteVoucher={deleteVoucher}
      />
    </div>
  );
}
