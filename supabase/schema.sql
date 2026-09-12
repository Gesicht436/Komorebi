-- ==============================================================================
-- KOMOREBI LIFE RPG - SUPABASE POSTGRESQL SCHEMA
-- 100% Free Forever Architecture with Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUM TYPES
do $$ begin
  create type quest_type as enum ('daily', 'habit', 'milestone');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type quest_attribute as enum ('focus', 'vitality', 'mindfulness', 'creativity', 'discipline');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type quest_difficulty as enum ('easy', 'medium', 'hard', 'epic');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE (RPG Character Sheet)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text default 'Cozy Scholar',
  avatar_url text default 'avatar_default',
  
  -- Equipped Items
  equipped_hoodie text default 'knit_sweater',
  equipped_headphones text default 'none',
  equipped_glasses text default 'none',
  equipped_pet text default 'none',
  equipped_theme text default 'lofi_day',
  
  -- Core RPG Progression
  level integer default 1 not null,
  current_xp integer default 0 not null,
  total_xp integer default 0 not null,
  coins integer default 50 not null, -- Welcome starter coins
  streak_count integer default 0 not null,
  streak_shields integer default 0 not null,
  last_active_date date default current_date,
  
  -- Daily Productivity Score (0 to 100 points, resets daily)
  daily_score integer default 0 not null,
  last_score_date date default current_date,
  claimed_score_milestones jsonb default '[]'::jsonb,
  
  -- Life RPG Attributes (XP earned per attribute)
  focus_exp integer default 0 not null,
  vitality_exp integer default 0 not null,
  mindfulness_exp integer default 0 not null,
  creativity_exp integer default 0 not null,
  discipline_exp integer default 0 not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. QUESTS TABLE (Daily Quests, Habits, Milestones)
create table if not exists public.quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  type quest_type default 'daily' not null,
  attribute quest_attribute default 'focus' not null,
  difficulty quest_difficulty default 'medium' not null,
  xp_reward integer not null default 30,
  coin_reward integer not null default 10,
  is_completed boolean default false not null,
  completed_at timestamp with time zone,
  due_date date,
  habit_direction text default 'positive', -- 'positive', 'both'
  streak_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. INVENTORY TABLE (Purchased / Unlocked cosmetics & companions)
create table if not exists public.inventory (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id text not null,
  item_name text not null,
  category text not null, -- 'hoodie', 'headphones', 'glasses', 'pet', 'theme'
  acquired_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id)
);

-- 6. REAL-LIFE REWARD VOUCHERS (Custom rewards bought with study coins)
create table if not exists public.vouchers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  cost integer not null default 50,
  icon text default 'gift',
  times_redeemed integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ACTIVITY & PROGRESSION LOGS (Analytics & Historical Records)
create table if not exists public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null, -- 'quest_completed', 'pomo_finished', 'item_purchased', 'voucher_redeemed', 'streak_updated'
  xp_gained integer default 0,
  coins_change integer default 0,
  attribute quest_attribute,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. AUTOMATIC PROFILE INITIALIZATION ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );

  -- Seed starter items in inventory
  insert into public.inventory (user_id, item_id, item_name, category)
  values
    (new.id, 'knit_sweater', 'Cozy Knit Sweater', 'hoodie'),
    (new.id, 'lofi_day', 'Morning Sunlight Room', 'theme');

  -- Seed starter beginner quests
  insert into public.quests (user_id, title, description, type, attribute, difficulty, xp_reward, coin_reward)
  values
    (new.id, 'Morning Hydration', 'Drink a warm glass of water or green tea', 'daily', 'vitality', 'easy', 15, 5),
    (new.id, '25-Min Deep Focus Session', 'Complete your first Pomodoro study session', 'daily', 'focus', 'medium', 35, 12),
    (new.id, 'Daily Reflection', 'Write down 3 things you are grateful for today', 'daily', 'mindfulness', 'easy', 15, 5),
    (new.id, 'Tidy the Workspace', 'Organize your physical desk for maximum clarity', 'habit', 'discipline', 'easy', 20, 8);

  -- Seed starter vouchers
  insert into public.vouchers (user_id, title, cost, icon)
  values
    (new.id, '30-Minute Gaming Break', 40, 'gamepad-2'),
    (new.id, 'Boba Milk Tea or Coffee Treat', 80, 'coffee'),
    (new.id, 'Guilt-Free Movie Night', 150, 'film');

  return new;
end;
$$;

-- Revoke direct API execution of trigger function
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Trigger to run after a new user is created in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. COVERING INDEXES FOR PERFORMANCE
create index if not exists idx_quests_user_id on public.quests(user_id);
create index if not exists idx_vouchers_user_id on public.vouchers(user_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_inventory_user_id on public.inventory(user_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.inventory enable row level security;
alter table public.vouchers enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles: Users can select and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id);

-- Quests: Users can CRUD their own quests
create policy "Users can view own quests"
  on public.quests for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own quests"
  on public.quests for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own quests"
  on public.quests for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own quests"
  on public.quests for delete
  using ((select auth.uid()) = user_id);

-- Inventory: Users can view and add to own inventory
create policy "Users can view own inventory"
  on public.inventory for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own inventory"
  on public.inventory for insert
  with check ((select auth.uid()) = user_id);

-- Vouchers: Users can view and manage their vouchers
create policy "Users can view own vouchers"
  on public.vouchers for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own vouchers"
  on public.vouchers for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own vouchers"
  on public.vouchers for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own vouchers"
  on public.vouchers for delete
  using ((select auth.uid()) = user_id);

-- Activity Logs: Users can view and insert own logs
create policy "Users can view own activity logs"
  on public.activity_logs for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own activity logs"
  on public.activity_logs for insert
  with check ((select auth.uid()) = user_id);
