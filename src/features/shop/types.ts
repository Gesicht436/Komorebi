import { Profile, InventoryItem, Voucher, ShopItem, ActivityLog } from '@/types/database';
import { GachaItem } from './constants/gacha-pool';

export interface ShopViewProps {
  profile: Profile;
  inventory: InventoryItem[];
  vouchers: Voucher[];
  activityLogs: ActivityLog[];
  onPurchaseItem: (item: ShopItem) => Promise<void>;
  onEquipItem: (category: string, itemId: string) => Promise<void>;
  onCreateVoucher: (title: string, cost: number, icon: string) => Promise<void>;
  onRedeemVoucher: (voucher: Voucher) => Promise<void>;
  onDeleteVoucher: (voucherId: string) => Promise<void>;
  onBuyStreakShield: () => Promise<void>;
  onPullGacha: () => Promise<GachaItem | null>;
}

export type ShopTab = 'virtual' | 'vouchers' | 'gacha' | 'ledger';

export const SHOP_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'hoodie', label: 'Hoodies' },
  { id: 'headphones', label: 'Audio' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'pet', label: 'Desk Pets' },
  { id: 'theme', label: 'Themes' },
] as const;
