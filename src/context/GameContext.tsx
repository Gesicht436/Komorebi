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
} from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';
import { LevelUpModal } from '@/components/modals/LevelUpModal';
import {
  usePomodoroTimer,
  TimerMode,
  TimerDurations,
  TimerState,
} from '@/features/focus';
import {
  loadPersistedDemoState,
  savePersistedDemoState,
  resetPersistedDemoState,
} from '@/features/game-state/demo-storage';
import { GameContextType } from '@/features/game-state/types';
import { STREAK_SHIELD_CONFIG } from '@/features/shop/constants/streak-shield';
import { GACHA_PULL_COST, GachaItem, drawGachaItem } from '@/features/shop/constants/gacha-pool';

export type { TimerMode, TimerDurations, TimerState };

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
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Level Up Modal State
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  // Demo state loaders
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
    const fresh = resetPersistedDemoState();
    setProfile(fresh.profile);
    setQuests(fresh.quests);
    setInventory(fresh.inventory);
    setVouchers(fresh.vouchers);
    setActivityLogs(fresh.activityLogs);
  }, []);

  // Fetch initial profile & game state
  const fetchData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Authenticated Supabase account takes precedence! Clear any stale demo cookie
        setIsDemoMode(false);
        if (typeof document !== 'undefined') {
          document.cookie = 'komorebi_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

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
          streak_shields: 0,
          last_active_date: new Date().toISOString().split('T')[0],
          focus_exp: 0,
          vitality_exp: 0,
          mindfulness_exp: 0,
          creativity_exp: 0,
          discipline_exp: 0,
        };
        const { data: created } = await supabase.from('profiles').insert(initialProfile).select().single();
        setProfile(created as Profile);
      } else {
        const today = new Date().toISOString().split('T')[0];
        const streakResult = calculateStreakUpdate(
          profileData.last_active_date,
          profileData.streak_count,
          profileData.streak_shields
        );
        const updates: Partial<Profile> = {};
        if (streakResult.newStreak !== profileData.streak_count) {
          updates.streak_count = streakResult.newStreak;
          profileData.streak_count = streakResult.newStreak;
        }
        if (streakResult.remainingShields !== profileData.streak_shields) {
          updates.streak_shields = streakResult.remainingShields;
          profileData.streak_shields = streakResult.remainingShields;
        }
        if (profileData.last_active_date !== today) {
          updates.last_active_date = today;
          profileData.last_active_date = today;
        }

        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').update(updates).eq('id', user.id);
          if (streakResult.consumedShield) {
            await supabase.from('activity_logs').insert({
              user_id: user.id,
              action_type: 'streak_shield_used',
              xp_gained: 0,
              coins_change: 0,
              metadata: { preserved_streak: streakResult.newStreak, remaining_shields: streakResult.remainingShields },
            });
          }
        }
        setProfile(profileData as Profile);
      }

      const [questsRes, invRes, vouchersRes, logsRes] = await Promise.all([
        supabase.from('quests').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').order('acquired_at', { ascending: false }),
        supabase.from('vouchers').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      setQuests((questsRes.data as Quest[]) || []);
      setInventory((invRes.data as InventoryItem[]) || []);
      setVouchers((vouchersRes.data as Voucher[]) || []);
      setActivityLogs((logsRes.data as ActivityLog[]) || []);
    } else {
      // No active Supabase session
      if (typeof document !== 'undefined' && document.cookie.includes('komorebi_demo=true')) {
        loadDemoState();
        return;
      }
      setProfile(null);
    }
    } catch (err) {
      console.error('Error fetching game data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadDemoState, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // COMPLETE POMODORO SESSION
  const completePomodoroSession = useCallback(async (durationMinutes: number) => {
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
      await supabase.from('profiles').update({
        level: updatedProfile.level,
        current_xp: updatedProfile.current_xp,
        total_xp: updatedProfile.total_xp,
        coins: updatedProfile.coins,
        focus_exp: updatedProfile.focus_exp,
      }).eq('id', profile.id);

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
  }, [profile, isDemoMode, activityLogs, supabase]);

  // Hook into dedicated Pomodoro Timer Engine
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    updateTimerDurations,
    onEnterFocusPage,
    onLeaveFocusPage,
  } = usePomodoroTimer({ onSessionComplete: completePomodoroSession });

  // COMPLETE QUEST
  const completeQuest = async (questId: string) => {
    if (!profile) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.is_completed) return;

    const levelResult = processXpGain(profile.level, profile.current_xp, quest.xp_reward);
    const attrKey = `${quest.attribute}_exp` as keyof Profile;
    const currentAttrExp = (profile[attrKey] as number) || 0;

    const updatedProfile: Profile = {
      ...profile,
      level: levelResult.newLevel,
      current_xp: levelResult.newCurrentXp,
      total_xp: profile.total_xp + quest.xp_reward,
      coins: profile.coins + quest.coin_reward,
      [attrKey]: currentAttrExp + quest.xp_reward,
    };

    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, is_completed: true, completed_at: new Date().toISOString() } : q
    );

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
    setProfile(updatedProfile);
    setQuests(updatedQuests);
    setActivityLogs(updatedLogs);

    if (levelResult.levelsGained > 0) {
      soundEngine.playLevelUp();
      setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
    } else {
      soundEngine.playQuestComplete();
    }

    if (isDemoMode) {
      savePersistedDemoState({ quests: updatedQuests, profile: updatedProfile, activityLogs: updatedLogs });
      return;
    }

    try {
      await supabase.from('quests').update({ is_completed: true, completed_at: new Date().toISOString() }).eq('id', questId);
      await supabase.from('profiles').update({
        level: updatedProfile.level,
        current_xp: updatedProfile.current_xp,
        total_xp: updatedProfile.total_xp,
        coins: updatedProfile.coins,
        [attrKey]: updatedProfile[attrKey],
      }).eq('id', profile.id);
      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'quest_completed',
        xp_gained: quest.xp_reward,
        coins_change: quest.coin_reward,
        attribute: quest.attribute,
        metadata: { quest_title: quest.title },
      });
    } catch (err) {
      console.error('Failed to complete quest on server:', err);
    }
  };

  // CREATE OR UPDATE QUEST
  const createOrUpdateQuest = async (questData: Partial<Quest>) => {
    if (!profile) return;
    if (isDemoMode) {
      let nextQuests: Quest[];
      if (questData.id) {
        nextQuests = quests.map((q) => (q.id === questData.id ? ({ ...q, ...questData } as Quest) : q));
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
      const { data, error } = await supabase.from('quests').update(questData).eq('id', questData.id).select().single();
      if (!error && data) {
        setQuests((prev) => prev.map((q) => (q.id === data.id ? (data as Quest) : q)));
      }
    } else {
      const newQuest = { ...questData, user_id: profile.id, is_completed: false, streak_count: 0 };
      const { data, error } = await supabase.from('quests').insert(newQuest).select().single();
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
    const updatedQuests = quests.map((q) => (q.id === questId ? { ...q, streak_count: newStreak } : q));
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
      await supabase.from('profiles').update({
        level: updatedProfile.level,
        current_xp: updatedProfile.current_xp,
        total_xp: updatedProfile.total_xp,
        coins: updatedProfile.coins,
        discipline_exp: updatedProfile.discipline_exp,
      }).eq('id', profile.id);
    }
    await supabase.from('quests').update({ streak_count: newStreak }).eq('id', questId);
  };

  // PURCHASE SHOP ITEM
  const purchaseShopItem = async (item: ShopItem) => {
    if (!profile || profile.coins < item.cost) return;
    soundEngine.playClick();
    const updatedCoins = profile.coins - item.cost;
    const updatedProfile = { ...profile, coins: updatedCoins };
    setProfile(updatedProfile);

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      user_id: profile.id,
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      acquired_at: new Date().toISOString(),
    };
    const updatedInventory = [newItem, ...inventory];
    setInventory(updatedInventory);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'item_purchased',
      xp_gained: 0,
      coins_change: -item.cost,
      attribute: undefined,
      metadata: { item_name: item.name },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile, inventory: updatedInventory, activityLogs: updatedLogs });
      return;
    }

    try {
      await supabase.from('profiles').update({ coins: updatedCoins }).eq('id', profile.id);
      await supabase.from('inventory').insert({
        user_id: profile.id,
        item_id: item.id,
        item_name: item.name,
        category: item.category,
      });
      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'item_purchased',
        xp_gained: 0,
        coins_change: -item.cost,
        attribute: null,
        metadata: { item_name: item.name },
      });
    } catch (err) {
      console.error('Error buying item:', err);
    }
  };

  // EQUIP ITEM
  const equipItem = async (category: string, itemId: string) => {
    if (!profile) return;
    soundEngine.playClick();
    const fieldMap: Record<string, keyof Profile> = {
      hoodie: 'equipped_hoodie',
      headphones: 'equipped_headphones',
      glasses: 'equipped_glasses',
      pet: 'equipped_pet',
      theme: 'equipped_theme',
    };
    const field = fieldMap[category];
    if (!field) return;

    const updatedProfile = { ...profile, [field]: itemId };
    setProfile(updatedProfile);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile });
      return;
    }

    try {
      await supabase.from('profiles').update({ [field]: itemId }).eq('id', profile.id);
    } catch (err) {
      console.error('Error equipping item:', err);
    }
  };

  // CREATE VOUCHER
  const createVoucher = async (title: string, cost: number, icon: string) => {
    if (!profile) return;
    soundEngine.playClick();
    const newVoucher: Voucher = {
      id: `vouch-${Date.now()}`,
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

    try {
      await supabase.from('vouchers').insert({ user_id: profile.id, title, cost, icon });
    } catch (err) {
      console.error('Error creating voucher:', err);
    }
  };

  // REDEEM VOUCHER
  const redeemVoucher = async (voucher: Voucher) => {
    if (!profile || profile.coins < voucher.cost) return;
    soundEngine.playQuestComplete();
    const updatedCoins = profile.coins - voucher.cost;
    const updatedProfile = { ...profile, coins: updatedCoins };
    setProfile(updatedProfile);

    const updatedVouchers = vouchers.map((v) =>
      v.id === voucher.id ? { ...v, times_redeemed: (v.times_redeemed || 0) + 1 } : v
    );
    setVouchers(updatedVouchers);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'voucher_redeemed',
      xp_gained: 0,
      coins_change: -voucher.cost,
      attribute: undefined,
      metadata: { voucher_title: voucher.title },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({ profile: updatedProfile, vouchers: updatedVouchers, activityLogs: updatedLogs });
      return;
    }

    try {
      await supabase.from('profiles').update({ coins: updatedCoins }).eq('id', profile.id);
      await supabase.from('vouchers').update({ times_redeemed: (voucher.times_redeemed || 0) + 1 }).eq('id', voucher.id);
      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'voucher_redeemed',
        xp_gained: 0,
        coins_change: -voucher.cost,
        attribute: null,
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
    try {
      await supabase.from('vouchers').delete().eq('id', voucherId);
    } catch (err) {
      console.error('Error deleting voucher:', err);
    }
  };

  // BUY STREAK SHIELD
  const buyStreakShield = async () => {
    if (!profile) return;
    if (profile.coins < STREAK_SHIELD_CONFIG.cost) return;
    if ((profile.streak_shields || 0) >= STREAK_SHIELD_CONFIG.maxShields) return;

    soundEngine.playClick();
    const updatedCoins = profile.coins - STREAK_SHIELD_CONFIG.cost;
    const updatedShields = (profile.streak_shields || 0) + 1;
    const updatedProfile: Profile = {
      ...profile,
      coins: updatedCoins,
      streak_shields: updatedShields,
    };
    setProfile(updatedProfile);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'streak_shield_bought',
      xp_gained: 0,
      coins_change: -STREAK_SHIELD_CONFIG.cost,
      attribute: undefined,
      metadata: { shield_count: updatedShields },
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
        .update({ coins: updatedCoins, streak_shields: updatedShields })
        .eq('id', profile.id);

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'streak_shield_bought',
        xp_gained: 0,
        coins_change: -STREAK_SHIELD_CONFIG.cost,
        attribute: null,
        metadata: { shield_count: updatedShields },
      });
    } catch (err) {
      console.error('Error buying streak shield:', err);
    }
  };

  // PULL GACHA
  const pullGacha = async (): Promise<GachaItem | null> => {
    if (!profile || profile.coins < GACHA_PULL_COST) return null;

    const wonItem = drawGachaItem();
    const isJackpot = wonItem.rarity === 'jackpot';
    const bonusCoins = wonItem.bonusCoins || 0;
    const coinDelta = bonusCoins - GACHA_PULL_COST;
    const updatedCoins = profile.coins + coinDelta;

    if (isJackpot || wonItem.rarity === 'legendary') {
      soundEngine.playLevelUp();
    } else {
      soundEngine.playQuestComplete();
    }

    const updatedProfile: Profile = {
      ...profile,
      coins: updatedCoins,
    };
    setProfile(updatedProfile);

    let updatedInventory = inventory;
    const alreadyOwned = inventory.some((item) => item.item_id === wonItem.id);
    if (!isJackpot && !alreadyOwned) {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        user_id: profile.id,
        item_id: wonItem.id,
        item_name: wonItem.name,
        category: 'collectible',
        acquired_at: new Date().toISOString(),
      };
      updatedInventory = [newItem, ...inventory];
      setInventory(updatedInventory);
    }

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: profile.id,
      action_type: 'gacha_pulled',
      xp_gained: 0,
      coins_change: coinDelta,
      attribute: undefined,
      metadata: {
        item_id: wonItem.id,
        item_name: wonItem.name,
        rarity: wonItem.rarity,
        bonus_coins: bonusCoins,
      },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    if (isDemoMode) {
      savePersistedDemoState({
        profile: updatedProfile,
        inventory: updatedInventory,
        activityLogs: updatedLogs,
      });
      return wonItem;
    }

    try {
      await supabase.from('profiles').update({ coins: updatedCoins }).eq('id', profile.id);

      if (!isJackpot && !alreadyOwned) {
        await supabase.from('inventory').insert({
          user_id: profile.id,
          item_id: wonItem.id,
          item_name: wonItem.name,
          category: 'collectible',
        });
      }

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'gacha_pulled',
        xp_gained: 0,
        coins_change: coinDelta,
        attribute: null,
        metadata: {
          item_id: wonItem.id,
          item_name: wonItem.name,
          rarity: wonItem.rarity,
          bonus_coins: bonusCoins,
        },
      });
    } catch (err) {
      console.error('Error recording gacha pull:', err);
    }

    return wonItem;
  };

  // UPDATE DISPLAY NAME
  const updateDisplayName = async (name: string) => {
    if (!profile) return;
    const updated = { ...profile, display_name: name };
    setProfile(updated);
    if (isDemoMode) {
      savePersistedDemoState({ profile: updated });
      return;
    }
    try {
      await supabase.from('profiles').update({ display_name: name }).eq('id', profile.id);
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  // SIGN OUT
  const signOut = async () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'komorebi_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setIsDemoMode(false);
    await supabase.auth.signOut();
    setProfile(null);
    setQuests([]);
    setInventory([]);
    setVouchers([]);
    setActivityLogs([]);
    router.push('/login');
    router.refresh();
  };

  const isStudying = timerState.isRunning && timerState.mode === 'focus';

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
        setIsStudying: () => {},
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
        buyStreakShield,
        pullGacha,
        updateDisplayName,
        signOut,
        refreshData: fetchData,
        isDemoMode,
        loadDemoMode,
        resetDemoData,

        // Timer Engine from dedicated hook
        timerState,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerMode,
        updateTimerDurations,
        onEnterFocusPage,
        onLeaveFocusPage,
      }}
    >
      {children}
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
