export type QuestType = 'daily' | 'habit' | 'milestone';
export type QuestAttribute = 'focus' | 'vitality' | 'mindfulness' | 'creativity' | 'discipline';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type ItemCategory = 'hoodie' | 'headphones' | 'glasses' | 'pet' | 'theme' | 'collectible' | 'utility';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  equipped_hoodie: string;
  equipped_headphones: string;
  equipped_glasses: string;
  equipped_pet: string;
  equipped_theme: string;
  level: number;
  current_xp: number;
  total_xp: number;
  coins: number;
  streak_count: number;
  streak_shields: number;
  last_active_date: string;
  daily_score: number;
  last_score_date?: string;
  claimed_score_milestones?: string[];
  focus_exp: number;
  vitality_exp: number;
  mindfulness_exp: number;
  creativity_exp: number;
  discipline_exp: number;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: QuestType;
  attribute: QuestAttribute;
  difficulty: QuestDifficulty;
  xp_reward: number;
  coin_reward: number;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  habit_direction?: 'positive' | 'both';
  streak_count?: number;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  category: ItemCategory;
  acquired_at: string;
}

export interface Voucher {
  id: string;
  user_id: string;
  title: string;
  cost: number;
  icon: string;
  times_redeemed: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type:
    | 'quest_completed'
    | 'pomo_finished'
    | 'item_purchased'
    | 'voucher_redeemed'
    | 'streak_updated'
    | 'streak_shield_bought'
    | 'gacha_pulled'
    | 'streak_shield_used'
    | 'daily_score_milestone'
    | 'boss_attacked'
    | 'boss_defeated';
  xp_gained: number;
  coins_change: number;
  attribute?: QuestAttribute;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface BossBattle {
  id: string;
  user_id: string;
  boss_name: string;
  boss_title: string;
  boss_type: 'dragon' | 'golem' | 'specter';
  max_hp: number;
  current_hp: number;
  is_defeated: boolean;
  reward_xp: number;
  reward_coins: number;
  reward_item_id: string;
  reward_item_name: string;
  target_deadline: string | null;
  created_at: string;
  defeated_at?: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  cost: number;
  levelRequired: number;
  icon: string;
  previewColor?: string;
  bonusText?: string;
}

