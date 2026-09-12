import {
  Profile,
  Quest,
  InventoryItem,
  Voucher,
  ActivityLog,
  ShopItem,
  BossBattle,
} from '@/types/database';
import { TimerState, TimerMode, TimerDurations } from '../focus/types';
import { GachaItem } from '../shop/constants/gacha-pool';

export interface GameContextType {
  profile: Profile | null;
  quests: Quest[];
  inventory: InventoryItem[];
  vouchers: Voucher[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  isStudying: boolean;
  setIsStudying: (studying: boolean) => void;
  completeQuest: (questId: string) => Promise<void>;
  createOrUpdateQuest: (questData: Partial<Quest>) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  updateHabit: (questId: string, delta: number) => Promise<void>;
  completePomodoroSession: (minutes: number) => Promise<void>;
  purchaseShopItem: (item: ShopItem) => Promise<void>;
  equipItem: (category: string, itemId: string) => Promise<void>;
  createVoucher: (title: string, cost: number, icon: string) => Promise<void>;
  redeemVoucher: (voucher: Voucher) => Promise<void>;
  deleteVoucher: (voucherId: string) => Promise<void>;
  buyStreakShield: () => Promise<void>;
  pullGacha: () => Promise<GachaItem | null>;
  updateDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  isDemoMode: boolean;
  loadDemoMode: () => void;
  resetDemoData: () => void;

  // Global Pomodoro Timer Engine
  timerState: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  updateTimerDurations: (durations: TimerDurations) => void;
  onEnterFocusPage: () => void;
  onLeaveFocusPage: () => void;

  // Boss Battle Dungeon Raid
  bossBattle: BossBattle | null;
  damageBoss: (damage: number, sourceName: string) => Promise<void>;
  resetBoss: (type: 'dragon' | 'golem' | 'specter', targetDeadline?: string) => Promise<void>;
}
