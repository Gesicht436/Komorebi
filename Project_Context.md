# Project Context: Komorebi Life RPG

## 1. Project Identity
- **Name**: Komorebi (木漏れ日) — Life RPG
- **Aesthetic / Theme**: Cozy Lo-Fi Anime Study Room
- **Tech Stack**:
  - Frontend: Next.js 16.3.5 (App Router), React 19.3.0, TypeScript, Tailwind CSS v4.3.3, Framer Motion 13.2.0, Canvas-Confetti 1.9.4, Lucide-React 1.45.0
  - Backend & Storage: Supabase (PostgreSQL + Auth + RLS)
  - Audio: Pure Web Audio API Procedural Sound Synthesizer & Lo-Fi Noise Generator
  - Hosting: Vercel (100% Free Hobby Tier, 0 Cold Starts)

## 2. Progression Formulas & Math
- Non-linear Level Curve: $XP(L) = \lfloor 100 \times L^{1.6} \rfloor$
- Attribute Level Curve: $EXP(L) = \lfloor 80 \times L^{1.4} \rfloor$
- Attributes: Focus (INT), Vitality (VIT), Mindfulness (MND), Creativity (CRT), Discipline (DIS)
- Streak Bonus: +5% XP multiplier per consecutive active day up to 10 days (+50%)

## 3. Database Architecture (Supabase PostgreSQL)
- `profiles`: User character sheet, equipped items, current XP, coins, streaks
- `quests`: Daily quests, habits (+/-), milestone projects, difficulty multipliers
- `inventory`: Unlocked and purchased avatar cosmetics & pet companions
- `vouchers`: Custom user-defined real-life rewards (e.g. boba treats, gaming hours)
- `activity_logs`: Historical audit trail for XP gains, streak updates, and transactions

## 4. Key Deliverables & Compliance
- Public GitHub Repo with clean multi-stage commits
- Free Vercel Live Deployment link
- 90–180s Walkthrough video (< 100MB) demonstrating auth, quest completion, leveling up, and hard refresh persistence
