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
  BossBattle,
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
import { DEMO_BOSS_BATTLE } from '@/features/game-state/demo-data';
import { GameContextType } from '@/features/game-state/types';
import { STREAK_SHIELD_CONFIG } from '@/features/shop/constants/streak-shield';
import { GACHA_PULL_COST, GachaItem, drawGachaItem } from '@/features/shop/constants/gacha-pool';
import {
  DAILY_SCORE_MAX,
  DAILY_SCORE_WEIGHTS,
  getTaskScorePoints,
  getPomoScorePoints,
  evaluateScoreMilestones,
  checkDailyScoreReset,
} from '@/lib/game/daily-score';
import {
  createDefaultBossBattle,
  getTaskDamage,
  getPomoDamage,
  getHabitDamage,
} from '@/lib/game/boss-battle';

export type { TimerMode, TimerDurations, TimerState };

export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const sanitizeLogs = (logs: ActivityLog[]): ActivityLog[] => {
  const seen = new Set<string>();
  return (logs || []).map((log, idx) => {
    if (!log || !log.id || seen.has(log.id)) {
      const uniqueId = `log-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
      return { ...log, id: uniqueId };
    }
    seen.add(log.id);
    return log;
  });
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [bossBattle, setBossBattle] = useState<BossBattle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Stable refs for real-time combat & timer events
  const profileRef = React.useRef(profile);
  profileRef.current = profile;
  const questsRef = React.useRef(quests);
  questsRef.current = quests;
  const inventoryRef = React.useRef(inventory);
  inventoryRef.current = inventory;
  const activityLogsRef = React.useRef(activityLogs);
  activityLogsRef.current = activityLogs;
  const bossBattleRef = React.useRef(bossBattle);
  bossBattleRef.current = bossBattle;
  const isDemoModeRef = React.useRef(isDemoMode);
  isDemoModeRef.current = isDemoMode;

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
    const cleanLogs = sanitizeLogs(state.activityLogs);
    setProfile(state.profile);
    setQuests(state.quests);
    setInventory(state.inventory);
    setVouchers(state.vouchers);
    setActivityLogs(cleanLogs);
    activityLogsRef.current = cleanLogs;
    setBossBattle(state.bossBattle || DEMO_BOSS_BATTLE);
    setIsLoading(false);
  }, []);

  const loadDemoMode = useCallback(() => {
    loadDemoState();
    router.push('/dashboard');
  }, [loadDemoState, router]);

  const resetDemoData = useCallback(() => {
    const fresh = resetPersistedDemoState();
    const cleanLogs = sanitizeLogs(fresh.activityLogs);
    setProfile(fresh.profile);
    setQuests(fresh.quests);
    setInventory(fresh.inventory);
    setVouchers(fresh.vouchers);
    setActivityLogs(cleanLogs);
    activityLogsRef.current = cleanLogs;
    setBossBattle(fresh.bossBattle || DEMO_BOSS_BATTLE);
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
          daily_score: 0,
          last_score_date: new Date().toISOString().split('T')[0],
          claimed_score_milestones: [],
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

        // Check if daily productivity score should reset for a new day
        const scoreResetCheck = checkDailyScoreReset(profileData.last_score_date);
        if (scoreResetCheck.shouldReset) {
          updates.daily_score = 0;
          updates.last_score_date = scoreResetCheck.todayStr;
          updates.claimed_score_milestones = [];
          profileData.daily_score = 0;
          profileData.last_score_date = scoreResetCheck.todayStr;
          profileData.claimed_score_milestones = [];
        }

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

      const [questsRes, invRes, vouchersRes, logsRes, bossRes] = await Promise.all([
        supabase.from('quests').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').order('acquired_at', { ascending: false }),
        supabase.from('vouchers').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('boss_battles').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      ]);

      setQuests((questsRes.data as Quest[]) || []);
      setInventory((invRes.data as InventoryItem[]) || []);
      setVouchers((vouchersRes.data as Voucher[]) || []);
      const cleanLogs = sanitizeLogs((logsRes.data as ActivityLog[]) || []);
      setActivityLogs(cleanLogs);
      activityLogsRef.current = cleanLogs;

      let currentBoss = bossRes.data?.[0] as BossBattle | undefined;
      if (!currentBoss) {
        const defaultBoss = createDefaultBossBattle(user.id, 'dragon');
        const { data: createdBoss } = await supabase.from('boss_battles').insert(defaultBoss).select().single();
        currentBoss = (createdBoss as BossBattle) || defaultBoss;
      }
      setBossBattle(currentBoss);
      bossBattleRef.current = currentBoss;
    } else {
      // No active Supabase session
      if (typeof document !== 'undefined' && document.cookie.includes('komorebi_demo=true')) {
        loadDemoState();
        return;
      }
      setProfile(null);
      setBossBattle(null);
      bossBattleRef.current = null;
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

  // DAMAGE BOSS BATTLE (Active Dungeon Raid)
  const damageBoss = useCallback(
    async (damage: number, sourceName: string = 'Quest Completion') => {
      const currentBoss = bossBattleRef.current;
      const currentProfile = profileRef.current;
      const isDemo = isDemoModeRef.current;
      if (!currentBoss || !currentProfile) return;
      if (currentBoss.is_defeated || currentBoss.current_hp <= 0) return;

      const newHp = Math.max(0, currentBoss.current_hp - damage);
      const nowDefeated = newHp === 0 && !currentBoss.is_defeated;

      const updatedBoss: BossBattle = {
        ...currentBoss,
        current_hp: newHp,
        is_defeated: nowDefeated ? true : currentBoss.is_defeated,
        defeated_at: nowDefeated ? new Date().toISOString() : currentBoss.defeated_at,
      };
      bossBattleRef.current = updatedBoss;
      setBossBattle(updatedBoss);

      if (nowDefeated) {
        soundEngine.playBossDefeated();

        // Award Boss Raid Victory Rewards
        const bonusXp = currentBoss.reward_xp;
        const bonusCoins = currentBoss.reward_coins;
        const levelResult = processXpGain(currentProfile.level, currentProfile.current_xp, bonusXp);

        const updatedProfile: Profile = {
          ...currentProfile,
          level: levelResult.newLevel,
          current_xp: levelResult.newCurrentXp,
          total_xp: currentProfile.total_xp + bonusXp,
          coins: currentProfile.coins + bonusCoins,
        };
        profileRef.current = updatedProfile;
        setProfile(updatedProfile);

        // Forge legendary loot trophy into inventory
        const newLootItem: InventoryItem = {
          id: generateUniqueId('loot'),
          user_id: currentProfile.id,
          item_id: currentBoss.reward_item_id,
          item_name: currentBoss.reward_item_name,
          category: 'collectible',
          acquired_at: new Date().toISOString(),
        };
        const updatedInventory = [newLootItem, ...inventoryRef.current];
        inventoryRef.current = updatedInventory;
        setInventory(updatedInventory);

        const defeatLog: ActivityLog = {
          id: generateUniqueId('log'),
          user_id: currentProfile.id,
          action_type: 'boss_defeated',
          xp_gained: bonusXp,
          coins_change: bonusCoins,
          metadata: {
            boss_name: currentBoss.boss_name,
            reward_item: currentBoss.reward_item_name,
          },
          created_at: new Date().toISOString(),
        };
        const updatedLogs = [defeatLog, ...activityLogsRef.current.slice(0, 19)];
        activityLogsRef.current = updatedLogs;
        setActivityLogs(updatedLogs);

        if (levelResult.levelsGained > 0) {
          soundEngine.playLevelUp();
          setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
        }

        if (isDemo) {
          savePersistedDemoState({
            bossBattle: updatedBoss,
            profile: updatedProfile,
            inventory: updatedInventory,
            activityLogs: updatedLogs,
          });
          return;
        }

        try {
          await supabase.from('boss_battles').update({
            current_hp: 0,
            is_defeated: true,
            defeated_at: new Date().toISOString(),
          }).eq('id', currentBoss.id);

          await supabase.from('profiles').update({
            level: updatedProfile.level,
            current_xp: updatedProfile.current_xp,
            total_xp: updatedProfile.total_xp,
            coins: updatedProfile.coins,
          }).eq('id', currentProfile.id);

          await supabase.from('inventory').insert(newLootItem);
          await supabase.from('activity_logs').insert(defeatLog);
        } catch (err) {
          console.error('Error recording boss defeat:', err);
        }
      } else {
        const strikeLog: ActivityLog = {
          id: generateUniqueId('log'),
          user_id: currentProfile.id,
          action_type: 'boss_attacked',
          xp_gained: 0,
          coins_change: 0,
          metadata: {
            boss_name: currentBoss.boss_name,
            damage_dealt: damage,
            source: sourceName,
            remaining_hp: newHp,
          },
          created_at: new Date().toISOString(),
        };
        const updatedLogs = [strikeLog, ...activityLogsRef.current.slice(0, 19)];
        activityLogsRef.current = updatedLogs;
        setActivityLogs(updatedLogs);

        if (isDemo) {
          savePersistedDemoState({ bossBattle: updatedBoss, activityLogs: updatedLogs });
          return;
        }

        try {
          await supabase.from('boss_battles').update({ current_hp: newHp }).eq('id', currentBoss.id);
          await supabase.from('activity_logs').insert(strikeLog);
        } catch (err) {
          console.error('Error updating boss HP:', err);
        }
      }
    },
    [supabase]
  );

  // RESET / SUMMON NEW BOSS BATTLE
  const resetBoss = useCallback(
    async (type: 'dragon' | 'golem' | 'specter' = 'dragon', targetDeadline?: string) => {
      const currentProfile = profileRef.current;
      if (!currentProfile) return;
      const newBoss = createDefaultBossBattle(currentProfile.id, type);
      if (targetDeadline) {
        newBoss.target_deadline = targetDeadline;
      }
      bossBattleRef.current = newBoss;
      setBossBattle(newBoss);

      if (isDemoModeRef.current) {
        savePersistedDemoState({ bossBattle: newBoss });
        return;
      }

      try {
        const { data, error } = await supabase.from('boss_battles').insert(newBoss).select().single();
        if (!error && data) {
          const loaded = data as BossBattle;
          bossBattleRef.current = loaded;
          setBossBattle(loaded);
        }
      } catch (err) {
        console.error('Error creating new boss battle:', err);
      }
    },
    [supabase]
  );

  // COMPLETE POMODORO SESSION
  const completePomodoroSession = useCallback(async (durationMinutes: number) => {
    if (!profile) return;
    const xpEarned = 35;
    const coinsEarned = 12;

    // Daily Productivity Score & Milestone Evaluation
    const pomoPoints = getPomoScorePoints(durationMinutes);
    const newDailyScore = Math.min(DAILY_SCORE_MAX, (profile.daily_score || 0) + pomoPoints);
    const milestoneEval = evaluateScoreMilestones(newDailyScore, profile.claimed_score_milestones || []);

    const totalCoinsEarned = coinsEarned + milestoneEval.bonusCoins;
    const totalXpEarned = xpEarned + milestoneEval.bonusXp;

    const levelResult = processXpGain(profile.level, profile.current_xp, totalXpEarned);
    const updatedClaimedMilestones = [
      ...(profile.claimed_score_milestones || []),
      ...milestoneEval.unlockedMilestones,
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedProfile: Profile = {
      ...profile,
      level: levelResult.newLevel,
      current_xp: levelResult.newCurrentXp,
      total_xp: profile.total_xp + totalXpEarned,
      coins: profile.coins + totalCoinsEarned,
      focus_exp: profile.focus_exp + xpEarned,
      daily_score: newDailyScore,
      last_score_date: todayStr,
      claimed_score_milestones: updatedClaimedMilestones,
    };
    setProfile(updatedProfile);

    if (levelResult.levelsGained > 0 || milestoneEval.unlockedMilestones.length > 0) {
      soundEngine.playLevelUp();
      if (levelResult.levelsGained > 0) {
        setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
      }
    }

    const newLog: ActivityLog = {
      id: generateUniqueId('log'),
      user_id: profile.id,
      action_type: 'pomo_finished',
      xp_gained: totalXpEarned,
      coins_change: totalCoinsEarned,
      attribute: 'focus',
      metadata: {
        duration_minutes: durationMinutes,
        daily_score_gained: pomoPoints,
        milestones: milestoneEval.unlockedMilestones,
      },
      created_at: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setActivityLogs(updatedLogs);

    profileRef.current = updatedProfile;
    activityLogsRef.current = updatedLogs;

    // Direct combat damage to active Boss Raid
    await damageBoss(getPomoDamage(durationMinutes), 'Pomodoro Focus Session');

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
        daily_score: newDailyScore,
        last_score_date: todayStr,
        claimed_score_milestones: updatedClaimedMilestones,
      }).eq('id', profile.id);

      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'pomo_finished',
        xp_gained: totalXpEarned,
        coins_change: totalCoinsEarned,
        attribute: 'focus',
        metadata: {
          duration_minutes: durationMinutes,
          daily_score_gained: pomoPoints,
          milestones: milestoneEval.unlockedMilestones,
        },
      });
    } catch (err) {
      console.error('Error logging pomodoro session:', err);
    }
  }, [profile, isDemoMode, activityLogs, supabase, damageBoss]);

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

    // Daily Productivity Score & Milestone Evaluation
    const questScorePoints = getTaskScorePoints(quest.difficulty);
    const newDailyScore = Math.min(DAILY_SCORE_MAX, (profile.daily_score || 0) + questScorePoints);
    const milestoneEval = evaluateScoreMilestones(newDailyScore, profile.claimed_score_milestones || []);

    const totalCoinsEarned = quest.coin_reward + milestoneEval.bonusCoins;
    const totalXpEarned = quest.xp_reward + milestoneEval.bonusXp;

    const levelResult = processXpGain(profile.level, profile.current_xp, totalXpEarned);
    const attrKey = `${quest.attribute}_exp` as keyof Profile;
    const currentAttrExp = (profile[attrKey] as number) || 0;
    const updatedClaimedMilestones = [
      ...(profile.claimed_score_milestones || []),
      ...milestoneEval.unlockedMilestones,
    ];
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedProfile: Profile = {
      ...profile,
      level: levelResult.newLevel,
      current_xp: levelResult.newCurrentXp,
      total_xp: profile.total_xp + totalXpEarned,
      coins: profile.coins + totalCoinsEarned,
      [attrKey]: currentAttrExp + quest.xp_reward,
      daily_score: newDailyScore,
      last_score_date: todayStr,
      claimed_score_milestones: updatedClaimedMilestones,
    };

    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, is_completed: true, completed_at: new Date().toISOString() } : q
    );

    const newLog: ActivityLog = {
      id: generateUniqueId('log'),
      user_id: profile.id,
      action_type: 'quest_completed',
      xp_gained: totalXpEarned,
      coins_change: totalCoinsEarned,
      attribute: quest.attribute,
      metadata: {
        quest_title: quest.title,
        difficulty: quest.difficulty,
        daily_score_gained: questScorePoints,
        milestones: milestoneEval.unlockedMilestones,
      },
      created_at: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
    setProfile(updatedProfile);
    setQuests(updatedQuests);
    setActivityLogs(updatedLogs);

    if (levelResult.levelsGained > 0 || milestoneEval.unlockedMilestones.length > 0) {
      soundEngine.playLevelUp();
      if (levelResult.levelsGained > 0) {
        setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
      }
    } else {
      soundEngine.playQuestComplete();
    }

    profileRef.current = updatedProfile;
    questsRef.current = updatedQuests;
    activityLogsRef.current = updatedLogs;

    // Direct combat damage to active Boss Raid
    await damageBoss(getTaskDamage(quest.difficulty), quest.title);

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
        daily_score: newDailyScore,
        last_score_date: todayStr,
        claimed_score_milestones: updatedClaimedMilestones,
      }).eq('id', profile.id);
      await supabase.from('activity_logs').insert({
        user_id: profile.id,
        action_type: 'quest_completed',
        xp_gained: totalXpEarned,
        coins_change: totalCoinsEarned,
        attribute: quest.attribute,
        metadata: {
          quest_title: quest.title,
          difficulty: quest.difficulty,
          daily_score_gained: questScorePoints,
          milestones: milestoneEval.unlockedMilestones,
        },
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
          id: generateUniqueId('quest'),
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

      // Daily Productivity Score & Milestone Evaluation
      const habitScorePoints = DAILY_SCORE_WEIGHTS.HABIT_TICK_POINTS;
      const newDailyScore = Math.min(DAILY_SCORE_MAX, (profile.daily_score || 0) + habitScorePoints);
      const milestoneEval = evaluateScoreMilestones(newDailyScore, profile.claimed_score_milestones || []);

      const totalCoinsEarned = coins + milestoneEval.bonusCoins;
      const totalXpEarned = xp + milestoneEval.bonusXp;

      const levelResult = processXpGain(profile.level, profile.current_xp, totalXpEarned);
      const updatedClaimedMilestones = [
        ...(profile.claimed_score_milestones || []),
        ...milestoneEval.unlockedMilestones,
      ];
      const todayStr = new Date().toISOString().split('T')[0];

      updatedProfile = {
        ...profile,
        level: levelResult.newLevel,
        current_xp: levelResult.newCurrentXp,
        total_xp: profile.total_xp + totalXpEarned,
        coins: profile.coins + totalCoinsEarned,
        discipline_exp: profile.discipline_exp + xp,
        daily_score: newDailyScore,
        last_score_date: todayStr,
        claimed_score_milestones: updatedClaimedMilestones,
      };
      setProfile(updatedProfile);

      if (levelResult.levelsGained > 0 || milestoneEval.unlockedMilestones.length > 0) {
        soundEngine.playLevelUp();
        if (levelResult.levelsGained > 0) {
          setLevelUpModal({ isOpen: true, newLevel: levelResult.newLevel });
        }
      } else {
        soundEngine.playQuestComplete();
      }

      const newLog: ActivityLog = {
        id: generateUniqueId('log'),
        user_id: profile.id,
        action_type: 'streak_updated',
        xp_gained: totalXpEarned,
        coins_change: totalCoinsEarned,
        attribute: 'discipline',
        metadata: {
          habit_title: quest.title,
          daily_score_gained: habitScorePoints,
          milestones: milestoneEval.unlockedMilestones,
        },
        created_at: new Date().toISOString(),
      };
      const updatedLogs = [newLog, ...activityLogs.slice(0, 19)];
      setActivityLogs(updatedLogs);

      profileRef.current = updatedProfile;
      questsRef.current = updatedQuests;
      activityLogsRef.current = updatedLogs;

      // Direct combat damage to active Boss Raid
      await damageBoss(getHabitDamage(), quest.title);

      if (isDemoMode) {
        savePersistedDemoState({ quests: updatedQuests, profile: updatedProfile, activityLogs: updatedLogs });
        return;
      }

      try {
        await supabase.from('profiles').update({
          level: updatedProfile.level,
          current_xp: updatedProfile.current_xp,
          total_xp: updatedProfile.total_xp,
          coins: updatedProfile.coins,
          discipline_exp: updatedProfile.discipline_exp,
          daily_score: newDailyScore,
          last_score_date: todayStr,
          claimed_score_milestones: updatedClaimedMilestones,
        }).eq('id', profile.id);

        await supabase.from('activity_logs').insert({
          user_id: profile.id,
          action_type: 'streak_updated',
          xp_gained: totalXpEarned,
          coins_change: totalCoinsEarned,
          attribute: 'discipline',
          metadata: {
            habit_title: quest.title,
            daily_score_gained: habitScorePoints,
            milestones: milestoneEval.unlockedMilestones,
          },
        });
        await supabase.from('quests').update({ streak_count: newStreak }).eq('id', questId);
      } catch (err) {
        console.error('Failed to update habit on server:', err);
      }
      return;
    }

    if (isDemoMode) {
      savePersistedDemoState({ quests: updatedQuests, profile: updatedProfile });
      return;
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
      id: generateUniqueId('inv'),
      user_id: profile.id,
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      acquired_at: new Date().toISOString(),
    };
    const updatedInventory = [newItem, ...inventory];
    setInventory(updatedInventory);

    const newLog: ActivityLog = {
      id: generateUniqueId('log'),
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
      id: generateUniqueId('vouch'),
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
      id: generateUniqueId('log'),
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
      id: generateUniqueId('log'),
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
        id: generateUniqueId('inv'),
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
      id: generateUniqueId('log'),
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

        // Boss Battle Dungeon Raid
        bossBattle,
        damageBoss,
        resetBoss,
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
