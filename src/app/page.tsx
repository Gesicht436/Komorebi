'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  Timer,
  ShoppingBag,
  Volume2,
  Heart,
  Brain,
  Palette,
  Shield,
} from 'lucide-react';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { soundEngine } from '@/lib/audio/sound-engine';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#3E2723]">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] flex items-center justify-center text-white shadow-sm shadow-[#E07A5F]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#3E2723]">
            Komorebi
            <span className="ml-1.5 text-xs font-bold text-[#E07A5F] uppercase tracking-wider bg-[#FBE9E7] px-2 py-0.5 rounded-md">
              Life RPG
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            onClick={() => soundEngine.playClick()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5D4037] hover:bg-[#F5EFEB] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => soundEngine.playClick()}
            className="px-5 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-sm shadow-[#E07A5F]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Begin Journey
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBE9E7] border border-[#FFCCBC] text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gamified Lo-Fi Productivity</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#3E2723] tracking-tight leading-[1.1]">
              Turn Daily Routines into an{' '}
              <span className="text-[#E07A5F]">Anime Study RPG</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6D4C41] leading-relaxed max-w-xl">
              Traditional to-do lists feel like chores. Komorebi gives your real-world habits an immersive virtual progression system with non-linear leveling, study companion customization, procedural lo-fi rain soundscapes, and tangible rewards.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/signup"
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-extrabold text-sm shadow-md shadow-[#E07A5F]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter Your Study Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => soundEngine.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#D7CCC8] hover:bg-[#F5EFEB] text-[#5D4037] font-bold text-sm shadow-xs transition-colors"
              >
                <span>Existing Scholar Sign In</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EFEBE9]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F4A261] fill-[#F4A261]" />
                <span className="text-xs font-bold text-[#5D4037]">Daily Streaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#81B29A]" />
                <span className="text-xs font-bold text-[#5D4037]">Lo-Fi Pomodoro</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#7E57C2]" />
                <span className="text-xs font-bold text-[#5D4037]">Procedural Audio</span>
              </div>
            </div>
          </div>

          {/* Hero Right Avatar Scene */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border-2 border-[#EFEBE9] rounded-3xl p-4 sm:p-6 shadow-xl relative">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#E07A5F] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                Interactive Companion
              </div>
              <AvatarDisplay
                equippedHoodie="matcha_hoodie"
                equippedHeadphones="cat_ear_headset"
                equippedGlasses="wireframe_rounds"
                equippedPet="calico_cat"
                level={3}
                isStudying={true}
              />
              <div className="mt-3 text-center">
                <div className="text-xs font-bold text-[#3E2723]">Level 3 Scholar</div>
                <div className="text-[11px] text-[#8D6E63]">Equipped: Matcha Hoodie, Cat Headset & Calico Cat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <section className="mt-20 pt-12 border-t border-[#EFEBE9]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#3E2723]">
              Engineered for Genuine Dopamine & Focus
            </h2>
            <p className="text-xs sm:text-sm text-[#8D6E63] mt-2">
              Every detail is designed to feel alive, tactile, and deeply satisfying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2723]">Non-Linear Leveling</h3>
              <p className="text-xs text-[#8D6E63] mt-2 leading-relaxed">
                XP requirements scale exponentially (XP = 100 × L^1.6). Earn attributes across Focus, Vitality, Mindfulness, Creativity, and Discipline.
              </p>
            </div>

            <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center mb-4">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2723]">Pomodoro with Lo-Fi Audio</h3>
              <p className="text-xs text-[#8D6E63] mt-2 leading-relaxed">
                Built-in 25/5 study timer generating procedural pink noise rain, vinyl crackle, and soft tactile chimes with zero network lag.
              </p>
            </div>

            <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#3E2723]">Dual Rewards Economy</h3>
              <p className="text-xs text-[#8D6E63] mt-2 leading-relaxed">
                Spend study coins on virtual pet companions and cozy hoodies, or redeem custom self-reward vouchers like boba breaks and gaming hours.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
