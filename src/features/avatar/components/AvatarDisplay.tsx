'use client';

import React, { useState } from 'react';
import { AvatarDisplayProps, TimeOfDay } from '../types';
import { AvatarWindowSky } from './AvatarWindowSky';
import { AvatarDeskEnvironment } from './AvatarDeskEnvironment';
import { AvatarApparel } from './AvatarApparel';
import { AvatarPet } from './AvatarPet';
import { AvatarIntellectAura } from './AvatarIntellectAura';
import { AvatarZenSerenity } from './AvatarZenSerenity';

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  equippedHoodie = 'knit_sweater',
  equippedHeadphones = 'none',
  equippedGlasses = 'none',
  equippedPet = 'none',
  isStudying = false,
  level = 1,
  timeOfDay = 'auto',
  className = '',
  vitalityTier = 0,
  focusTier = 0,
  zenTier = 0,
  archetypeTitle,
  badgeColor = 'bg-stone-100 text-stone-700 border-stone-300',
  showEvolutionBadge = true,
}) => {
  const [activeTime, setActiveTime] = useState<TimeOfDay>(() => {
    if (timeOfDay !== 'auto') return timeOfDay;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  });

  return (
    <div className={`relative flex flex-col items-center justify-center p-2 select-none ${className}`}>
      {/* Time of Day Switcher Pills */}
      <div className="flex items-center gap-1 mb-2 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-full border border-[#EFEBE9] text-[10px] font-bold text-[#8D6E63] shadow-xs">
        {(['morning', 'day', 'dusk', 'night'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTime(t)}
            className={`px-2 py-0.5 rounded-full capitalize transition-all cursor-pointer ${
              activeTime === t
                ? 'bg-[#E07A5F] text-white shadow-xs'
                : 'hover:text-[#3E2723] hover:bg-[#F5EFEB]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 400 340"
        className="w-full max-w-md h-auto drop-shadow-md transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Komorebi Anime Study Avatar and Evolution Companion"
      >
        <defs>
          {/* Warm Study Lamp Glow */}
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity={activeTime === 'night' ? '0.95' : '0.8'} />
            <stop offset="60%" stopColor="#FFF59D" stopOpacity={activeTime === 'night' ? '0.45' : '0.3'} />
            <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0" />
          </radialGradient>

          {/* Dynamic Window Sky Gradients */}
          <linearGradient id="skyMorning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFCC80" />
            <stop offset="100%" stopColor="#F8BBD0" />
          </linearGradient>

          <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E1F5FE" />
            <stop offset="70%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFE0B2" />
          </linearGradient>

          <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7E57C2" />
            <stop offset="50%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#FFA726" />
          </linearGradient>

          <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="60%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#3A506B" />
          </linearGradient>

          {/* INTELLECT AURA GRADIENTS */}
          <radialGradient id="intellectGlowSoft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="intellectGlowMedium" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#818CF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="astralNovaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#C084FC" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>

          {/* ZEN HALO GRADIENT */}
          <radialGradient id="zenHaloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Steam Blur */}
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* 1. Window & Sky Scenery */}
        <AvatarWindowSky activeTime={activeTime} />

        {/* 2. Room, Desk & Lamp Environment */}
        <AvatarDeskEnvironment activeTime={activeTime} />

        {/* 3. Character Evolution: Intellect Aura (behind character) */}
        <AvatarIntellectAura tier={focusTier} isStudying={isStudying} />

        {/* 4. Character Evolution: Zen Serenity (Halo & Peace waves) */}
        <AvatarZenSerenity tier={zenTier} />

        {/* 5. Character Body, Apparel & Muscular Evolution */}
        <AvatarApparel
          equippedHoodie={equippedHoodie}
          equippedHeadphones={equippedHeadphones}
          equippedGlasses={equippedGlasses}
          isStudying={isStudying}
          vitalityTier={vitalityTier}
          zenTier={zenTier}
          focusTier={focusTier}
        />

        {/* 6. Desk Companion Pet */}
        <AvatarPet equippedPet={equippedPet} />

        {/* 7. Level Badge */}
        <g transform="translate(35, 35)">
          <rect width="64" height="24" rx="12" fill="#FFFBF5" stroke="#EFEBE9" strokeWidth="2" />
          <text x="32" y="16" textAnchor="middle" fill="#5D4037" fontSize="11" fontWeight="bold">
            LVL {level}
          </text>
        </g>

        {/* 8. Archetype Evolution Pill (if active and high tier) */}
        {showEvolutionBadge && archetypeTitle && (
          <g transform="translate(245, 35)">
            <rect
              width="120"
              height="24"
              rx="12"
              fill="#FFFBF5"
              stroke="#FFE0B2"
              strokeWidth="1.5"
              className="drop-shadow-xs"
            />
            <text
              x="60"
              y="16"
              textAnchor="middle"
              fill="#D97706"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.2"
            >
              {archetypeTitle.split('•')[1]?.trim() || archetypeTitle}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
