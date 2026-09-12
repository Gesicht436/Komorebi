'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ActivityLog,
  InventoryItem,
  Profile,
  Quest,
  ShopItem,
  Voucher,
} from '@/types/database';
import {
  processXpGain,
  calculateStreakUpdate,
  getXpRequiredForLevel,
} from '@/lib/game/engine';
import { LevelUpModal } from '@/components/modals/LevelUpModal';

const DEMO_STORAGE_KEY = 'komorebi_demo_state';

const DEMO_PROFILE: Profile = {
  id: 'demo-judge-id',
  email: 'judge@hackathon.dev',
  display_name: 'Judge Satsuki (Demo)',
  avatar_url: 'avatar_default',
  equipped_hoodie: 'matcha_hoodie',
  equipped_headphones: 'cat_ear_headset',
  equipped_glasses: 'wireframe_rounds',
  equipped_pet: 'calico_cat',
  equipped_theme: 'lofi_day',
  level: 3,
  current_xp: 240,
  total_xp: 643,
  coins: 140,
  streak_count: 5,
  last_active_date: new Date().toISOString().split('T')[0],
  focus_exp: 280,
  vitality_exp: 150,
  mindfulness_exp: 90,
  creativity_exp: 70,
  discipline_exp: 120,
  created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_QUESTS: Quest[] = [
  {
    id: 'demo-q1',
    user_id: 'demo-judge-id',
    title: 'Audit Komorebi RPG Progression Engine',
    description: 'Verify non-linear leveling formula and streak multipliers',
    type: 'daily',
    attribute: 'focus',
    difficulty: 'hard',
    xp_reward: 70,
    coin_reward: 25,
    is_completed: false,
    completed_at: null,
    due_date: null,
    streak_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-q2',
    user_id: 'demo-judge-id',
    title: '25-Min Focus Sprint with Ambient Rain',
    description: 'Test the Pomodoro study chamber with lo-fi vinyl audio',
    type: 'daily',
    attribute: 'mindfulness',
    difficulty: 'medium',
    xp_reward: 35,
    coin_reward: 12,
    is_completed: false,
    completed_at: null,
    due_date: null,
    streak_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-q3',
    user_id: 'demo-judge-id',
    title: 'Hydration & Posture Reset',
    description: 'Drink warm water and stretch desk shoulders',
    type: 'habit',
    attribute: 'vitality',
    difficulty: 'easy',
    xp_reward: 15,
    coin_reward: 5,
    is_completed: false,
    completed_at: null,
    due_date: null,
    streak_count: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-q4',
    user_id: 'demo-judge-id',
    title: 'Unlock Shiba Inu Companion in Boutique',
    description: 'Save 130 coins to purchase Hachi the Shiba Inu',
    type: 'milestone',
    attribute: 'discipline',
    difficulty: 'epic',
    xp_reward: 150,
    coin_reward: 60,
    is_completed: false,
    completed_at: null,
    due_date: null,
    streak_count: 0,
    created_at: new Date().toISOString(),
  },
];

const DEMO_INVENTORY: InventoryItem[] = [
  { id: 'demo-inv1', user_id: 'demo-judge-id', item_id: 'knit_sweater', item_name: 'Cozy Knit Sweater', category: 'hoodie', acquired_at: new Date().toISOString() },
  { id: 'demo-inv2', user_id: 'demo-judge-id', item_id: 'matcha_hoodie', item_name: 'Matcha Oversized Hoodie', category: 'hoodie', acquired_at: new Date().toISOString() },
  { id: 'demo-inv3', user_id: 'demo-judge-id', item_id: 'cat_ear_headset', item_name: 'Lo-Fi Cat-Ear Headset', category: 'headphones', acquired_at: new Date().toISOString() },
  { id: 'demo-inv4', user_id: 'demo-judge-id', item_id: 'wireframe_rounds', item_name: 'Wireframe Round Glasses', category: 'glasses', acquired_at: new Date().toISOString() },
  { id: 'demo-inv5', user_id: 'demo-judge-id', item_id: 'calico_cat', item_name: 'Mochi the Calico Cat', category: 'pet', acquired_at: new Date().toISOString() },
  { id: 'demo-inv6', user_id: 'demo-judge-id', item_id: 'lofi_day', item_name: 'Morning Sunlight Tavern', category: 'theme', acquired_at: new Date().toISOString() },
];

const DEMO_VOUCHERS: Voucher[] = [
  { id: 'demo-v1', user_id: 'demo-judge-id', title: '30-Minute Gaming Break', cost: 40, icon: 'gift', times_redeemed: 2, created_at: new Date().toISOString() },
  { id: 'demo-v2', user_id: 'demo-judge-id', title: 'Boba Milk Tea or Coffee Treat', cost: 80, icon: 'gift', times_redeemed: 1, created_at: new Date().toISOString() },
  { id: 'demo-v3', user_id: 'demo-judge-id', title: 'Guilt-Free Movie Night', cost: 150, icon: 'gift', times_redeemed: 0, created_at: new Date().toISOString() },
];

const DEMO_LOGS: ActivityLog[] = [
  { id: 'log-1', user_id: 'demo-judge-id', action_type: 'quest_completed', xp_gained: 70, coins_change: 25, attribute: 'focus', created_at: new Date().toISOString() },
  { id: 'log-2', user_id: 'demo-judge-id', action_type: 'pomo_finished', xp_gained: 35, coins_change: 12, attribute: 'focus', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'log-3', user_id: 'demo-judge-id', action_type: 'quest_completed', xp_gained: 35, coins_change: 12, attribute: 'vitality', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'log-4', user_id: 'demo-judge-id', action_type: 'quest_completed', xp_gained: 15, coins_change: 5, attribute: 'discipline', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'log-5', user_id: 'demo-judge-id', action_type: 'item_purchased', xp_gained: 0, coins_change: -75, attribute: 'mindfulness', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
];

interface PersistedState {
  profile: Profile;
  quests: Quest[];
  inventory: InventoryItem[];
  vouchers: Voucher[];
  activityLogs: ActivityLog[];
}

const getInitialDemoState = (): PersistedState => ({
  profile: DEMO_PROFILE,
  quests: DEMO_QUESTS,
  inventory: DEMO_INVENTORY,
  vouchers: DEMO_VOUCHERS,
  activityLogs: DEMO_LOGS,
});

const loadPersistedDemoState = (): PersistedState => {
  if (typeof window === 'undefined') return getInitialDemoState();
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.quests)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading persisted demo state:', err);
  }
  return getInitialDemoState();
};

const savePersistedDemoState = (partial: Partial<PersistedState>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadPersistedDemoState();
    const updated: PersistedState = { ...current, ...partial };
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving persisted demo state:', err);
  }
};

interface GameContextType {
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
  updateDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  isDemoMode: boolean;
  loadDemoMode: () => void;
  resetDemoData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudying, setIsStudying] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Level Up Modal State
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  // Load or restore demo state from persistent storage
  const loadDemoState = useCallback(() => {
    setIsDemoMode(true);
    if (typeof document !== 'undefined') {
      document.cookie = 'komorebi_demo=true; path=/; max-age=86400';
    }
    const state = loadPersistedDemoState();
    setProfile(state.profile);
    setQuests(state.quests);
    setInventory(state.inventory);
    setVouchers(state.vouchers);
    setActivityLogs(state.activityLogs);
    setIsLoading(false);
  }, []);

  const loadDemoMode = useCallback(() => {
    loadDemoState();
    router.push('/dashboard');
  }, [loadDemoState, router]);

  const resetDemoData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
    const fresh = getInitialDemoState();
    setProfile(fresh.profile);
    setQuests(fresh.quests);
    setInventory(fresh.inventory);
    setVouchers(fresh.vouchers);
    setActivityLogs(fresh.activityLogs);
    savePersistedDemoState(fresh);
  }, []);

  const fetchData = useCallback(async () => {
    if (typeof document !== 'undefined' && document.cookie.includes('komorebi_demo=true')) {
      loadDemoState();
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      // 1. Fetch or initialize profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileErr || !profileData) {
        const initialProfile: Partial<Profile> = {
          id: user.id,
          email: user.email || '',
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Cozy Scholar',
          equipped_hoodie: 'knit_sweater',
          equipped_theme: 'lofi_day',
          level: 1,
          current_xp: 0,
          total_xp: 0,
          coins: 50,
          streak_count: 1,
          last_active_date: new Date().toISOString().split('T')[0],
          focus_exp: 0,
          vitality_exp: 0,
          mindfulness_exp: 0,
          creativity_exp: 0,
          discipline_exp: 0,
        };
        const { data: createdProf } = await supabase
          .from('profiles')
          .insert(initialProfile)
          .select()
          .single();
        setProfile(createdProf as Profile);
      } else {
        setProfile(profileData as Profile);
      }

      // 2. Fetch Quests
      const { data: questsData } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setQuests((questsData || []) as Quest[]);

      // 3. Fetch Inventory
      const { data: invData } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);
      setInventory((invData || []) as InventoryItem[]);

      // 4. Fetch Vouchers
      const { data: voucherData } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setVouchers((voucherData || []) as Voucher[]);

      // 5. Fetch Activity Logs
      const { data: logData } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setActivityLogs((logData || []) as ActivityLog[]);
    } catch (err) {
      console.error('Error fetching game data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, loadDemoState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // COMPLETE QUEST
  const completeQuest = async (questId: string) => {
    if (!profile) return;

    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.is_completed) return;

    const prevQuests = [...quests];
    const prevProfile = { ...profile };

    const levelResult = processXpGain(profile.level, profile.current_xp, quest.xp_reward);
    const streakUpdate = calculateStreakUpdate(profile.last_active_date);

    const newStreak = streakUpdate.streakIncremented
      ? profile.streak_count + 1
      : profile.streak_count;

    const attrKey = `${quest.attribute}_exp` as keyof Profile;
    const currentAttrExp = (profile[attrKey] as number) || 0;

    const updatedProfile: Profile = {
      ...profile,
      level: levelResult.newLevel,
      current_xp: levelResult.newCurrentXp,
      total_xp: profile.total_xp + quest.xp_reward,
      coins: profile.coins + quest.coin_reward,
      streak_count: newStreak,
      last_active_date: streakUpdate.todayStr,
      [attrKey]: currentAttrExp + quest.xp_reward,
    };

    const updatedQuests = quests.map((q) =>
      q.id === questId
        ? { ...q, is_completed: true, completed_at: new Date().toISOString() }
        : q
    );

    setQuests(updatedQuests);
    setProfile(updatedProfile);

    if (levelResult.levelsGained > 0) {
      setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
    }

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'quest_completed',
      xp_gained: quest.xp_reward,
      coins_change: quest.coin_reward,
      attribute: quest.attribute,
      metadata: { quest_title: quest.title },
      created_at: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({
        profile: updatedProfile,
        quests: updatedQuests,
        activityLogs: updatedLogs,
      });
      return;
    }

    try {
      await supabase
        .from('quests')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', questId);

      await supabase
        .from('profiles')
        .update({
          level: updatedProfile.level,
          current_xp: updatedProfile.current_xp,
          total_xp: updatedProfile.total_xp,
          coins: updatedProfile.coins,
          streak_count: updatedProfile.streak_count,
          last_active_date: updatedProfile.last_active_date,
          [attrKey]: updatedProfile[attrKey],
        })
        .eq('id', profile.id);

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'quest_completed',
        xp_gained: quest.xp_reward,
        coins_change: quest.coin_reward,
        attribute: quest.attribute,
        metadata: { quest_title: quest.title },
      });
    } catch (err) {
      console.error('Failed to complete quest on server, rolling back:', err);
      setQuests(prevQuests);
      setProfile(prevProfile);
      alert('Network error: Unable to save quest completion. Please check your connection.');
    }
  };

  // CREATE OR UPDATE QUEST
  const createOrUpdateQuest = async (questData: Partial<Quest>) => {
    if (!profile) return;

    if (isDemoMode) {
      let nextQuests: Quest[];
      if (questData.id) {
        nextQuests = quests.map((q) =>
          q.id === questData.id ? ({ ...q, ...questData } as Quest) : q
        );
      } else {
        const newDemoQuest: Quest = {
          id: `demo-q-${Date.now()}`,
          user_id: profile.id,
          title: questData.title || '',
          description: questData.description || '',
          type: questData.type || 'daily',
          attribute: questData.attribute || 'focus',
          difficulty: questData.difficulty || 'medium',
          xp_reward: questData.xp_reward || 35,
          coin_reward: questData.coin_reward || 12,
          is_completed: false,
          completed_at: null,
          due_date: null,
          streak_count: 0,
          created_at: new Date().toISOString(),
        };
        nextQuests = [newDemoQuest, ...quests];
      }
      setQuests(nextQuests);
      savePersistedDemoState({ quests: nextQuests });
      return;
    }

    if (questData.id) {
      const { data, error } = await supabase
        .from('quests')
        .update(questData)
        .eq('id', questData.id)
        .select()
        .single();

      if (!error && data) {
        setQuests((prev) => prev.map((q) => (q.id === data.id ? (data as Quest) : q)));
      }
    } else {
      const newQuest = {
        ...questData,
        user_id: profile.id,
        is_completed: false,
        streak_count: 0,
      };
      const { data, error } = await supabase
        .from('quests')
        .insert(newQuest)
        .select()
        .single();

      if (!error && data) {
        setQuests((prev) => [data as Quest, ...prev]);
      }
    }
  };

  // DELETE QUEST
  const deleteQuest = async (questId: string) => {
    const updatedQuests = quests.filter((q) => q.id !== questId);
    setQuests(updatedQuests);

    if (isDemoMode) {
      savePersistedDemoState({ quests: updatedQuests });
      return;
    }

    try {
      await supabase.from('quests').delete().eq('id', questId);
    } catch (err) {
      console.error('Error deleting quest from database:', err);
    }
  };

  // UPDATE HABIT (+ / -)
  const updateHabit = async (questId: string, delta: number) => {
    if (!profile) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const newStreak = Math.max(0, (quest.streak_count || 0) + delta);
    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, streak_count: newStreak } : q
    );
    setQuests(updatedQuests);

    let updatedProfile = profile;
    if (delta > 0) {
      const xp = 15;
      const coins = 5;
      const levelResult = processXpGain(profile.level, profile.current_xp, xp);
      updatedProfile = {
        ...profile,
        level: levelResult.newLevel,
        current_xp: levelResult.newCurrentXp,
        total_xp: profile.total_xp + xp,
        coins: profile.coins + coins,
        discipline_exp: profile.discipline_exp + xp,
      };
      setProfile(updatedProfile);

      if (levelResult.levelsGained > 0) {
        setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
      }
    }

    if (isDemoMode) {
      savePersistedDemoState({ quests: updatedQuests, profile: updatedProfile });
      return;
    }

    if (delta > 0) {
      await supabase
        .from('profiles')
        .update({
          level: updatedProfile.level,
          current_xp: updatedProfile.current_xp,
          total_xp: updatedProfile.total_xp,
          coins: updatedProfile.coins,
          discipline_exp: updatedProfile.discipline_exp,
        })
        .eq('id', profile.id);
    }

    await supabase.from('quests').update({ streak_count: newStreak }).eq('id', questId);
  };

  // COMPLETE POMODORO SESSION
  const completePomodoroSession = async (durationMinutes: number) => {
    if (!profile) return;

    const xpEarned = 35;
    const coinsEarned = 12;

    const levelResult = processXpGain(profile.level, profile.current_xp, xpEarned);
    const updatedProfile: Profile = {
      ...profile,
      level: levelResult.newLevel,
      current_xp: levelResult.newCurrentXp,
      total_xp: profile.total_xp + xpEarned,
      coins: profile.coins + coinsEarned,
      focus_exp: profile.focus_exp + xpEarned,
    };

    setProfile(updatedProfile);

    if (levelResult.levelsGained > 0) {
      setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
    }

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'pomo_finished',
      xp_gained: xpEarned,
      coins_change: coinsEarned,
      attribute: 'focus',
      metadata: { duration_minutes: durationMinutes },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile, activityLogs: updatedLogs });
      return;
    }

    try {
      await supabase
        .from('profiles')
        .update({
          level: updatedProfile.level,
          current_xp: updatedProfile.current_xp,
          total_xp: updatedProfile.total_xp,
          coins: updatedProfile.coins,
          focus_exp: updatedProfile.focus_exp,
        })
        .eq('id', profile.id);

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'pomo_finished',
        xp_gained: xpEarned,
        coins_change: coinsEarned,
        attribute: 'focus',
        metadata: { duration_minutes: durationMinutes },
      });
    } catch (err) {
      console.error('Error logging pomodoro session:', err);
    }
  };

  // PURCHASE SHOP ITEM
  const purchaseShopItem = async (item: ShopItem) => {
    if (!profile || profile.coins < item.cost) return;

    const updatedCoins = profile.coins - item.cost;
    const updatedProfile = { ...profile, coins: updatedCoins };
    setProfile(updatedProfile);

    const newInvItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      user_id: profile.id,
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      acquired_at: new Date().toISOString(),
    };

    const updatedInv = [...inventory, newInvItem];
    setInventory(updatedInv);

    const columnKey = `equipped_${item.category}` as keyof Profile;
    const finalProfile = { ...updatedProfile, [columnKey]: item.id };
    setProfile(finalProfile);

    if (isDemoMode) {
      savePersistedDemoState({ profile: finalProfile, inventory: updatedInv });
      return;
    }

    try {
      await supabase.from('inventory').insert({
        user_id: profile.id,
        item_id: item.id,
        item_name: item.name,
        category: item.category,
      });

      await supabase
        .from('profiles')
        .update({ coins: updatedCoins, [columnKey]: item.id })
        .eq('id', profile.id);
    } catch (err) {
      console.error('Error purchasing item:', err);
    }
  };

  // EQUIP ITEM
  const equipItem = async (category: string, itemId: string) => {
    if (!profile) return;

    const columnKey = `equipped_${category}` as keyof Profile;
    const updatedProfile = { ...profile, [columnKey]: itemId };
    setProfile(updatedProfile);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile });
      return;
    }

    await supabase
      .from('profiles')
      .update({ [columnKey]: itemId })
      .eq('id', profile.id);
  };

  // CREATE VOUCHER
  const createVoucher = async (title: string, cost: number, icon: string) => {
    if (!profile) return;

    const newVoucher: Voucher = {
      id: `voucher-${Date.now()}`,
      user_id: profile.id,
      title,
      cost,
      icon,
      times_redeemed: 0,
      created_at: new Date().toISOString(),
    };

    const updatedVouchers = [newVoucher, ...vouchers];
    setVouchers(updatedVouchers);

    if (isDemoMode) {
      savePersistedDemoState({ vouchers: updatedVouchers });
      return;
    }

    await supabase.from('vouchers').insert({
      user_id: profile.id,
      title,
      cost,
      icon,
      times_redeemed: 0,
    });
  };

  // REDEEM VOUCHER
  const redeemVoucher = async (voucher: Voucher) => {
    if (!profile || profile.coins < voucher.cost) return;

    const updatedCoins = profile.coins - voucher.cost;
    const updatedTimes = voucher.times_redeemed + 1;

    const updatedProfile = { ...profile, coins: updatedCoins };
    setProfile(updatedProfile);

    const updatedVouchers = vouchers.map((v) =>
      v.id === voucher.id ? { ...v, times_redeemed: updatedTimes } : v
    );
    setVouchers(updatedVouchers);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'voucher_redeemed',
      coins_change: -voucher.cost,
      xp_gained: 0,
      metadata: { voucher_title: voucher.title },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({
        profile: updatedProfile,
        vouchers: updatedVouchers,
        activityLogs: updatedLogs,
      });
      return;
    }

    try {
      await supabase
        .from('profiles')
        .update({ coins: updatedCoins })
        .eq('id', profile.id);

      await supabase
        .from('vouchers')
        .update({ times_redeemed: updatedTimes })
        .eq('id', voucher.id);

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'voucher_redeemed',
        coins_change: -voucher.cost,
        metadata: { voucher_title: voucher.title },
      });
    } catch (err) {
      console.error('Error redeeming voucher:', err);
    }
  };

  // DELETE VOUCHER
  const deleteVoucher = async (voucherId: string) => {
    const updatedVouchers = vouchers.filter((v) => v.id !== voucherId);
    setVouchers(updatedVouchers);

    if (isDemoMode) {
      savePersistedDemoState({ vouchers: updatedVouchers });
      return;
    }

    await supabase.from('vouchers').delete().eq('id', voucherId);
  };

  // UPDATE DISPLAY NAME
  const updateDisplayName = async (name: string) => {
    if (!profile) return;
    const updatedProfile = { ...profile, display_name: name };
    setProfile(updatedProfile);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile });
      return;
    }

    await supabase.from('profiles').update({ display_name: name }).eq('id', profile.id);
  };

  // SIGN OUT
  const signOut = async () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'komorebi_demo=; path=/; max-age=0';
    }
    setIsDemoMode(false);
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        quests,
        inventory,
        vouchers,
        activityLogs,
        isLoading,
        isStudying,
        setIsStudying,
        completeQuest,
        createOrUpdateQuest,
        deleteQuest,
        updateHabit,
        completePomodoroSession,
        purchaseShopItem,
        equipItem,
        createVoucher,
        redeemVoucher,
        deleteVoucher,
        updateDisplayName,
        signOut,
        refreshData: fetchData,
        isDemoMode,
        loadDemoMode,
        resetDemoData,
      }}
    >
      {children}

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        newLevel={levelUpModal.newLevel}
        onClose={() => setLevelUpModal({ isOpen: false, newLevel: 1 })}
      />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
