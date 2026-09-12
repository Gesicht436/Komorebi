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

  // Level Up Modal State
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  const fetchData = useCallback(async () => {
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
        // Fallback create if trigger had delay
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
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // COMPLETE QUEST
  const completeQuest = async (questId: string) => {
    if (!profile) return;

    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.is_completed) return;

    // Snapshot for rollback
    const prevQuests = [...quests];
    const prevProfile = { ...profile };

    // Process XP and Level Progression
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

    // Optimistic UI updates
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, is_completed: true, completed_at: new Date().toISOString() }
          : q
      )
    );
    setProfile(updatedProfile);

    // Show level up modal if leveled up!
    if (levelResult.levelsGained > 0) {
      setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
    }

    try {
      // 1. Update Quest in DB
      await supabase
        .from('quests')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', questId);

      // 2. Update Profile in DB
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

      // 3. Insert Activity Log
      const { data: newLog } = await supabase
        .from('activity_logs')
        .insert({
          user_id: profile.id,
          action_type: 'quest_completed',
          xp_gained: quest.xp_reward,
          coins_change: quest.coin_reward,
          attribute: quest.attribute,
          metadata: { quest_title: quest.title },
        })
        .select()
        .single();

      if (newLog) {
        setActivityLogs((prev) => [newLog as ActivityLog, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      console.error('Failed to complete quest, rolling back:', err);
      setQuests(prevQuests);
      setProfile(prevProfile);
      alert('Network error: Unable to save quest completion. Please check your connection.');
    }
  };

  // CREATE OR UPDATE QUEST
  const createOrUpdateQuest = async (questData: Partial<Quest>) => {
    if (!profile) return;

    if (questData.id) {
      // Update existing
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
      // Create new
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
    setQuests((prev) => prev.filter((q) => q.id !== questId));
    await supabase.from('quests').delete().eq('id', questId);
  };

  // UPDATE HABIT (+ / -)
  const updateHabit = async (questId: string, delta: number) => {
    if (!profile) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const newStreak = Math.max(0, (quest.streak_count || 0) + delta);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, streak_count: newStreak } : q))
    );

    if (delta > 0) {
      // Award XP & coin for habit repetition
      const xp = 15;
      const coins = 5;
      const levelResult = processXpGain(profile.level, profile.current_xp, xp);
      const updatedProfile = {
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

      const { data: newLog } = await supabase
        .from('activity_logs')
        .insert({
          user_id: profile.id,
          action_type: 'pomo_finished',
          xp_gained: xpEarned,
          coins_change: coinsEarned,
          attribute: 'focus',
          metadata: { duration_minutes: durationMinutes },
        })
        .select()
        .single();

      if (newLog) {
        setActivityLogs((prev) => [newLog as ActivityLog, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      console.error('Error logging pomodoro session:', err);
    }
  };

  // PURCHASE SHOP ITEM
  const purchaseShopItem = async (item: ShopItem) => {
    if (!profile || profile.coins < item.cost) return;

    const updatedCoins = profile.coins - item.cost;
    setProfile((prev) => (prev ? { ...prev, coins: updatedCoins } : null));

    const newInvItem: Partial<InventoryItem> = {
      user_id: profile.id,
      item_id: item.id,
      item_name: item.name,
      category: item.category,
    };

    try {
      const { data: insertedItem } = await supabase
        .from('inventory')
        .insert(newInvItem)
        .select()
        .single();

      if (insertedItem) {
        setInventory((prev) => [...prev, insertedItem as InventoryItem]);
      }

      await supabase
        .from('profiles')
        .update({ coins: updatedCoins })
        .eq('id', profile.id);

      // Auto equip purchased item
      await equipItem(item.category, item.id);
    } catch (err) {
      console.error('Error purchasing item:', err);
      // rollback
      setProfile((prev) => (prev ? { ...prev, coins: profile.coins } : null));
    }
  };

  // EQUIP ITEM
  const equipItem = async (category: string, itemId: string) => {
    if (!profile) return;

    const columnKey = `equipped_${category}` as keyof Profile;
    const updatedProfile = { ...profile, [columnKey]: itemId };
    setProfile(updatedProfile);

    await supabase
      .from('profiles')
      .update({ [columnKey]: itemId })
      .eq('id', profile.id);
  };

  // CREATE VOUCHER
  const createVoucher = async (title: string, cost: number, icon: string) => {
    if (!profile) return;

    const newVoucher = {
      user_id: profile.id,
      title,
      cost,
      icon,
      times_redeemed: 0,
    };

    const { data } = await supabase.from('vouchers').insert(newVoucher).select().single();
    if (data) {
      setVouchers((prev) => [data as Voucher, ...prev]);
    }
  };

  // REDEEM VOUCHER
  const redeemVoucher = async (voucher: Voucher) => {
    if (!profile || profile.coins < voucher.cost) return;

    const updatedCoins = profile.coins - voucher.cost;
    const updatedTimes = voucher.times_redeemed + 1;

    setProfile((prev) => (prev ? { ...prev, coins: updatedCoins } : null));
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucher.id ? { ...v, times_redeemed: updatedTimes } : v))
    );

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
    setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
    await supabase.from('vouchers').delete().eq('id', voucherId);
  };

  // UPDATE DISPLAY NAME
  const updateDisplayName = async (name: string) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, display_name: name } : null));
    await supabase.from('profiles').update({ display_name: name }).eq('id', profile.id);
  };

  // SIGN OUT
  const signOut = async () => {
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
