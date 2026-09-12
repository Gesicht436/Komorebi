# 🌿 Komorebi (木漏れ日) — Life RPG

> **Transform mundane real-world tasks and study sessions into an immersive, cozy anime study RPG progression system.**

[![Live Deployed App](https://img.shields.io/badge/Live_Demo-komorebi--ashy.vercel.app-E07A5F?style=for-the-badge&logo=vercel)](https://komorebi-ashy.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployment-100%25_Free_Tier-000000?style=for-the-badge&logo=vercel)](https://komorebi-ashy.vercel.app)

---

## 🔗 Quick Links
- **Live Deployed Application**: [https://komorebi-ashy.vercel.app](https://komorebi-ashy.vercel.app)
- **GitHub Repository**: [https://github.com/Gesicht436/Komorebi](https://github.com/Gesicht436/Komorebi)
- **Database Backend**: Supabase PostgreSQL with Row Level Security (RLS)
- **Specification Compliance**: Fully aligned with `TZPSv2.pdf` Life RPG problem statement

---

## 📖 Table of Contents
- [1. Creative Soul & Product Feel](#1-creative-soul--product-feel)
- [2. High-Impact Signature Systems](#2-high-impact-signature-systems)
  - [⚔️ Procrastination Boss Battles (Dungeon Raids)](#-procrastination-boss-battles-dungeon-raids)
  - [🎵 Vinyl Turntable Lounge & Procedural Soundscape](#-vinyl-turntable-lounge--procedural-soundscape)
  - [🧬 Character Evolution System](#-character-evolution-system)
  - [📊 Daily Productivity Score & Letter Grades](#-daily-productivity-score--letter-grades)
  - [🛡️ Expanded Reward Economy & Boutique](#-expanded-reward-economy--boutique)
- [3. Core RPG Mechanics & Non-Linear Leveling](#3-core-rpg-mechanics--non-linear-leveling)
- [4. Full-Stack Architecture & Database Persistence](#4-full-stack-architecture--database-persistence)
- [5. Local Development Setup](#5-local-development-setup)
- [6. Free Tier Deployment Instructions](#6-free-tier-deployment-instructions)
- [7. TZPSv2 Specification Compliance Matrix](#7-tzpsv2-specification-compliance-matrix)
- [8. Walkthrough Video Demonstration Guide](#8-walkthrough-video-demonstration-guide)

---

## 1. Creative Soul & Product Feel

Traditional to-do apps feel like chores because real-life rewards (passing exams, building muscle, learning a language) take months of delayed gratification. **Komorebi** solves this by converting daily efforts into instant, tactile RPG feedback:

- 🍵 **Alive & Tactile Study Room**: An animated anime study companion seated at a cozy desk with steaming tea, an ambient desk lamp, and a dynamic window reflecting real-time morning dawn, sunlight, golden dusk, or midnight moonlight.
- 🎨 **Thematically Cohesive**: Every component speaks the language of a serene anime scholar: *"Quests"* (not tasks), *"Study Coins"* (not points), *"Boutique"* (not store), *"Accountability Dungeon Raids"* (not deadline alerts).
- ⚡ **Optimistic & Fast**: State updates reflect instantaneously on client interaction while persisting asynchronously to Supabase PostgreSQL in the background.

---

## 2. High-Impact Signature Systems

### ⚔️ Procrastination Boss Battles (Dungeon Raids)
Turn lingering deadlines and tasks into animated RPG monsters:
- **Boss Roster**:
  - *Ignis, the Procrastination Wyrm* (500 HP) — Feeds on delayed assignments.
  - *Chronos, the Deadline Golem* (750 HP) — Obsidian titan forged from ticking clock gears.
  - *Phantasma, the Burnout Specter* (1,000 HP) — Shadow wraith feeding on chaotic overwork.
- **Direct Combat Strikes**:
  - Completing tasks or Pomodoro sessions strikes the boss in real-time.
  - Epic Tasks deal **80 DMG (Critical Astral Strike)**; Pomodoros deal **45 DMG**; Habits deal **10 DMG**.
  - Animated SVG boss with breathing cycles, glowing eyes, and recoil shake when taking damage.
  - Floating damage numbers, metallic combat SFX, and orchestral defeat fanfare.
  - Slaying a boss forges legendary trophy items deposited directly into your inventory.

### 🎵 Vinyl Turntable Lounge & Procedural Soundscape
- **Real-Time Canvas Frequency Visualizer**: 24-band animated equalizer connected to a Web Audio `AnalyserNode` (`fftSize = 64`).
- **Tactile 33 RPM Vinyl Record**: Rotating vinyl disc with groove reflections and a moving metallic tonearm that pivots onto the record when playing.
- **3 Procedural Lo-Fi Radio Stations**: *Rainy Cafe Rhodes Jazz*, *Midnight Synthwave Pads*, and *Sunlit Zen Koto*.
- **Tactile Multi-Track Ambient Faders**: Independent volume sliders for Procedural Rain, Vinyl Dust/Crackle, Fireplace, and Mechanical Keyboard Typing.
- **Persistent Floating Mini-Player**: Bottom-right floating widget accessible across every page.

### 🧬 Character Evolution System
Your physical avatar visibly evolves based on how you live your life:
- **Gym & Workout (VIT)**: Slender Student → Athletic Posture → Muscular Frame with Gym Wrist Wraps → Heavy-Duty Titan Juggernaut.
- **Deep Study (INT)**: Spark of Insight → Radiant Sapphire Intellect Aura → Cosmic Astral Nova with Counter-Rotating Runic Rings.
- **Discipline & Habits (DIS/MND)**: Centered Presence → Floating Golden Serenity Halo & Blossom Particles → 8-Petal Mandala Halo with Lotus Crown.
- **Interactive Stage Previewer**: Test-drive any evolution tier dynamically on your profile.

### 📊 Daily Productivity Score & Letter Grades
- **Daily Performance Meter (0–100 pts)**: Resets automatically at midnight.
- **Point Weights**: Pomodoro Focus (+10 pts), Epic Task (+25 pts), Hard Task (+20 pts), Medium Task (+12 pts), Easy Task (+6 pts), Habit (+4 pts).
- **Letter Ranks**: **Rank S (100 pts)**, **Rank A (80–99 pts)**, **Rank B (60–79 pts)**, **Rank C (40–59 pts)**, **Rank D (0–39 pts)**.
- **Daily Milestone Bonuses**: Reaching Rank A grants **+15 Coins & +30 XP**; Rank S grants **+25 Coins & +50 XP**.

### 🛡️ Expanded Reward Economy & Boutique
- **Streak Freeze Shields**: Stack up to 3 shields (50 🪙 each). Automatically consumed to protect streaks if a day is missed.
- **Mystery Capsule Gacha Machine (30 🪙)**: 8 collectible desk artifacts across 5 rarity tiers (*Common, Uncommon, Rare, Legendary, Jackpot*).
- **Itemized Coin Transaction Ledger**: Track all lifetime earnings, expenditures, and color-coded transaction logs.
- **Custom Real-Life Vouchers**: Redeem study coins for guilt-free real-world treats (*"Boba Milk Tea"*, *"1 Hour Gaming"*).

---

## 3. Core RPG Mechanics & Non-Linear Leveling

Komorebi implements a mathematical non-linear progression curve where each level requires exponentially more XP:

$$\text{XP Required for Level } L = \lfloor 100 \times L^{1.6} \rfloor$$

| Level | XP Required | Cumulative XP | Unlocked Title & Perks |
|:---:|:---:|:---:|:---|
| **1** | 100 XP | 100 XP | **Novice Scholar** (Starter Cozy Knit Sweater) |
| **2** | 303 XP | 403 XP | **Avid Reader** (Matcha Hoodie & Calico Cat) |
| **3** | 579 XP | 982 XP | **Diligent Apprentice** (Dusk Lavender Hoodie) |
| **4** | 918 XP | 1,900 XP | **Coffee Connoisseur** (Cat-Ear Headset & Shiba Inu) |
| **5** | 1,313 XP | 3,213 XP | **Master of Zen** (Velvet Bomber & Celestial Attic) |
| **10**| 3,981 XP | 18,348 XP | **Grand Archmage of Focus** |

### Life RPG Attributes
Tasks level up 5 distinct life pillars:
- 🧠 **Focus (INT)**: Deep study, coding, and Pomodoro sessions.
- ❤️ **Vitality (VIT)**: Gym, workouts, hydration, and sleep.
- ✨ **Mindfulness (MND)**: Meditation, reading, and gratitude journaling.
- 🎨 **Creativity (CRT)**: Art, writing, music, and design.
- 🛡️ **Discipline (DIS)**: Daily habits, chores, and workspace cleanliness.

---

## 4. Full-Stack Architecture & Database Persistence

All primary user data strictly persists to a relational PostgreSQL database on Supabase with Row Level Security (RLS). **No fake `localStorage`-only persistence is used for authenticated user data.**

### Relational Tables in PostgreSQL:
1. `profiles`: Level, XP, coins, streaks, shields, daily score, equipped vanity items, and attribute EXP.
2. `quests`: Tasks, recurring habits (+/-), difficulty tiers, attribute tags, and completion timestamps.
3. `inventory`: Owned apparel, glasses, headphones, desk pets, and collectible boss loot.
4. `vouchers`: Custom real-world reward vouchers and redemption counters.
5. `activity_logs`: Historical audit trail for XP gains, streak shields, and store purchases.
6. `boss_battles`: Active dungeon raid boss, max HP, current HP, rewards, and target deadlines.

---

## 5. Local Development Setup

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+` or `v11+`
- Free Supabase Account ([supabase.com](https://supabase.com))

### Installation
```bash
# 1. Clone repository
git clone https://github.com/Gesicht436/Komorebi.git
cd Komorebi

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Free Tier Deployment Instructions

Komorebi is deployed on **Vercel** with continuous deployment from GitHub:
1. Fork or import repository `Gesicht436/Komorebi` on [vercel.com](https://vercel.com).
2. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**. Vercel will build and assign your live URL.
4. In Supabase Dashboard -> **Authentication -> URL Configuration**, add your Vercel URL to **Site URL** and **Redirect URLs** (`https://<app>.vercel.app/**`).

---

## 7. TZPSv2 Specification Compliance Matrix

| Requirement / Zero-Tolerance Rule | Requirement Details | Komorebi Compliance Status |
|:---|:---|:---|
| **User Authentication & Security** | Secure signup, login, session management; users only access own data. | **100% Compliant**. Supabase Auth with RLS enabled on all 6 tables; auto-confirm Postgres trigger active. |
| **Database Schema & CRUD** | Thoughtfully designed relational schema for Users, Tasks, and Attributes with full CRUD. | **100% Compliant**. Full CRUD for quests, habits, vouchers, inventory, and raid bosses. |
| **The RPG Progression Engine** | Non-linear leveling system (each level requires exponentially more XP than last). | **100% Compliant**. Formula: $XP = 100 \times L^{1.6}$, verified by progression unit tests. |
| **Streaks** | System tracking consecutive active days. | **100% Compliant**. Flame streak counter with Streak Freeze Shield insurance. |
| **Attributes** | Categorize tasks so they level up specific character stats. | **100% Compliant**. 5 pillars: Focus, Vitality, Mindfulness, Creativity, Discipline. |
| **Rewards / Economy** | Earn currency to buy items, themes, or profile badges. | **100% Compliant**. Virtual Boutique, 30 🪙 Gacha Machine, Real-Life Vouchers, Coin Ledger. |
| **Responsive & Accessible UI** | Fully responsive (mobile to desktop), keyboard navigable, screen reader sound. | **100% Compliant**. Mobile drawer navigation, keyboard focus rings, semantic tags. |
| **Broken Links** | Public GitHub repo, working live deployed link. | **100% Compliant**. Repo is public; live link [komorebi-ashy.vercel.app](https://komorebi-ashy.vercel.app) is active. |
| **Fake Data Persistence** | Zero reliance on `localStorage` for primary user data. | **100% Compliant**. All authenticated user data persists directly to Supabase PostgreSQL. |
| **Build / Deployment Failure** | Live app doesn't crash, builds cleanly with 0 errors. | **100% Compliant**. `npm run build` compiles with 0 errors on Next.js 16 / Turbopack. |
| **Console / Runtime Crashes** | No unhandled runtime exceptions or blank-screen crashes. | **100% Compliant**. Zero console errors; hydration suppressed for extension attributes. |
| **Invalid Repository** | Contains ≥ 3 chronological commits, includes backend code. | **100% Compliant**. Clean chronological commit history documenting all milestones. |
| **Walkthrough Video** | 90–180 seconds, under 100MB, demonstrates key flows. | **Ready for Recording**. Exact script provided below. |

---

## 8. Walkthrough Video Demonstration Guide

For your submission recording (strictly **90–180 seconds**, **under 100MB**):

1. **[0:00 - 0:25] Sign In & Living Study Room Scene**:
   - Open [komorebi-ashy.vercel.app](https://komorebi-ashy.vercel.app) and sign in.
   - Highlight the animated study companion sitting at the desk, dynamic time-of-day window, and current Level.
2. **[0:25 - 0:50] Quest Board & Combat Boss Raid Strike**:
   - Navigate to `/quests`. Add a new Quest (*"Study Distributed Systems"*, Focus, Medium).
   - Complete the quest: show the floating `+35 XP! +12 🪙` reward animation.
   - Open the **Boss Battle Arena** on the dashboard and show the monster taking damage recoil and floating critical damage numbers.
3. **[0:50 - 1:15] Level Up & Boutique Customization**:
   - Cross the XP threshold to trigger the celebratory **Level Up Modal** with confetti burst.
   - Go to `/shop`, pull the **Mystery Capsule Gacha Machine**, and equip new items to see your avatar change live.
4. **[1:15 - 1:35] Vinyl Turntable Lounge & Focus Pomodoro**:
   - Open the floating Vinyl mini-player, toggle procedural jazz/rain audio, and show the live frequency visualizer bars animating.
   - Start a Pomodoro timer and watch your companion enter study focus mode.
5. **[1:35 - 1:55] Page Refresh Persistence Proof (Crucial)**:
   - Perform a hard browser refresh (`Ctrl + F5` or `Cmd + Shift + R`).
   - Highlight that your level, coin balance, equipped gear, and completed quests instantly reload from Supabase PostgreSQL.
