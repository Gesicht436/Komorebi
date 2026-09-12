import { Profile, Quest, InventoryItem, Voucher, ActivityLog } from '@/types/database';
import { PersistedState, DEMO_STORAGE_KEY } from './demo-data';

export function createLocalScholarProfile(displayName: string, email: string): PersistedState {
  const trimmedName = displayName.trim() || 'Cozy Scholar';
  const trimmedEmail = email.trim();
  const userId = `local-${Date.now()}`;

  const profile: Profile = {
    id: userId,
    email: trimmedEmail,
    display_name: trimmedName,
    avatar_url: 'avatar_default',
    equipped_hoodie: 'knit_sweater',
    equipped_headphones: 'none',
    equipped_glasses: 'none',
    equipped_pet: 'none',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const quests: Quest[] = [
    {
      id: `quest-${Date.now()}-1`,
      user_id: userId,
      title: 'Begin Your Komorebi Journey',
      description: 'Explore your study room and check the Pomodoro timer',
      type: 'daily',
      attribute: 'mindfulness',
      difficulty: 'easy',
      xp_reward: 15,
      coin_reward: 5,
      is_completed: false,
      completed_at: null,
      due_date: null,
      streak_count: 0,
      created_at: new Date().toISOString(),
    },
    {
      id: `quest-${Date.now()}-2`,
      user_id: userId,
      title: '25-Min Deep Focus Sprint',
      description: 'Complete your first focused study interval with lo-fi rain',
      type: 'daily',
      attribute: 'focus',
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
      id: `quest-${Date.now()}-3`,
      user_id: userId,
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
      streak_count: 0,
      created_at: new Date().toISOString(),
    },
  ];

  const inventory: InventoryItem[] = [
    {
      id: `inv-${Date.now()}-1`,
      user_id: userId,
      item_id: 'knit_sweater',
      item_name: 'Cozy Knit Sweater',
      category: 'hoodie',
      acquired_at: new Date().toISOString(),
    },
  ];

  const vouchers: Voucher[] = [
    {
      id: `vouch-${Date.now()}-1`,
      user_id: userId,
      title: '30-Min Lo-Fi Manga Break',
      cost: 30,
      icon: 'book',
      times_redeemed: 0,
      created_at: new Date().toISOString(),
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: `log-${Date.now()}`,
      user_id: userId,
      action_type: 'streak_updated',
      xp_gained: 0,
      coins_change: 50,
      attribute: undefined,
      metadata: { note: 'Starter scholar enrollment bonus' },
      created_at: new Date().toISOString(),
    },
  ];

  const state: PersistedState = {
    profile,
    quests,
    inventory,
    vouchers,
    activityLogs,
  };

  if (typeof window !== 'undefined') {
    const userKey = `komorebi_user_${trimmedEmail.toLowerCase()}`;
    localStorage.setItem(userKey, JSON.stringify(state));
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    document.cookie = 'komorebi_demo=true; path=/; max-age=86400';
  }

  return state;
}

export function loginLocalScholar(email: string): void {
  if (typeof window === 'undefined') return;

  const trimmedEmail = email.trim().toLowerCase();
  const userKey = `komorebi_user_${trimmedEmail}`;

  // Check if a local profile exists for THIS email
  const existingUserRaw = localStorage.getItem(userKey);
  if (existingUserRaw) {
    try {
      const parsed: PersistedState = JSON.parse(existingUserRaw);
      if (parsed && parsed.profile) {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(parsed));
        document.cookie = 'komorebi_demo=true; path=/; max-age=86400';
        return;
      }
    } catch {}
  }

  // Otherwise generate a fresh scholar for this specific email
  const nameFromEmail = email.split('@')[0] || 'Cozy Scholar';
  createLocalScholarProfile(nameFromEmail, email);
}
