import {
  Profile,
  Quest,
  InventoryItem,
  Voucher,
  ActivityLog,
} from '@/types/database';

export interface PersistedState {
  profile: Profile;
  quests: Quest[];
  inventory: InventoryItem[];
  vouchers: Voucher[];
  activityLogs: ActivityLog[];
}

export const DEMO_STORAGE_KEY = 'komorebi_demo_state';

export const DEMO_PROFILE: Profile = {
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

export const DEMO_QUESTS: Quest[] = [
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

export const DEMO_INVENTORY: InventoryItem[] = [
  { id: 'demo-inv1', user_id: 'demo-judge-id', item_id: 'knit_sweater', item_name: 'Cozy Knit Sweater', category: 'hoodie', acquired_at: new Date().toISOString() },
  { id: 'demo-inv2', user_id: 'demo-judge-id', item_id: 'matcha_hoodie', item_name: 'Matcha Oversized Hoodie', category: 'hoodie', acquired_at: new Date().toISOString() },
  { id: 'demo-inv3', user_id: 'demo-judge-id', item_id: 'cat_ear_headset', item_name: 'Glowing Cat-Ear Headset', category: 'headphones', acquired_at: new Date().toISOString() },
  { id: 'demo-inv4', user_id: 'demo-judge-id', item_id: 'wireframe_rounds', item_name: 'Wireframe Round Glasses', category: 'glasses', acquired_at: new Date().toISOString() },
  { id: 'demo-inv5', user_id: 'demo-judge-id', item_id: 'calico_cat', item_name: 'Mochi the Calico Cat', category: 'pet', acquired_at: new Date().toISOString() },
];

export const DEMO_VOUCHERS: Voucher[] = [
  {
    id: 'demo-v1',
    user_id: 'demo-judge-id',
    title: '30-Min Lo-Fi Manga Break',
    cost: 30,
    icon: 'book',
    times_redeemed: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-v2',
    user_id: 'demo-judge-id',
    title: 'Matcha Boba Tea Delivery',
    cost: 100,
    icon: 'coffee',
    times_redeemed: 0,
    created_at: new Date().toISOString(),
  },
];

export const DEMO_LOGS: ActivityLog[] = [
  {
    id: 'demo-log1',
    user_id: 'demo-judge-id',
    action_type: 'quest_completed',
    xp_gained: 35,
    coins_change: 12,
    attribute: 'focus',
    metadata: { quest_title: 'Read TZPS Spec & Setup Clean Architecture' },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-log2',
    user_id: 'demo-judge-id',
    action_type: 'pomo_finished',
    xp_gained: 35,
    coins_change: 12,
    attribute: 'focus',
    metadata: { duration_minutes: 25 },
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'demo-log3',
    user_id: 'demo-judge-id',
    action_type: 'item_purchased',
    xp_gained: 0,
    coins_change: -80,
    attribute: undefined,
    metadata: { item_name: 'Glowing Cat-Ear Headset' },
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

export const getInitialDemoState = (): PersistedState => ({
  profile: { ...DEMO_PROFILE },
  quests: DEMO_QUESTS.map((q) => ({ ...q })),
  inventory: DEMO_INVENTORY.map((i) => ({ ...i })),
  vouchers: DEMO_VOUCHERS.map((v) => ({ ...v })),
  activityLogs: DEMO_LOGS.map((l) => ({ ...l })),
});
