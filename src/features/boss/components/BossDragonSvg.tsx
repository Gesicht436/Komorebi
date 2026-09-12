'use client';

import React from 'react';

interface BossDragonSvgProps {
  bossType?: 'dragon' | 'golem' | 'specter';
  isDamaged?: boolean;
  isDefeated?: boolean;
}

export const BossDragonSvg: React.FC<BossDragonSvgProps> = ({
  bossType = 'dragon',
  isDamaged = false,
  isDefeated = false,
}) => {
  if (bossType === 'golem') {
    return (
      <div
        className={`relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center transition-all ${
          isDamaged ? 'animate-shake filter brightness-125' : ''
        }`}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="golemCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D500F9" />
              <stop offset="70%" stopColor="#4A148C" />
              <stop offset="100%" stopColor="#1A0033" />
            </radialGradient>
            <linearGradient id="obsidian" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#37474F" />
              <stop offset="50%" stopColor="#212121" />
              <stop offset="100%" stopColor="#0D0D0D" />
            </linearGradient>
          </defs>

          {/* Golem Body Silhouette */}
          <rect x="75" y="110" width="150" height="120" rx="24" fill="url(#obsidian)" stroke="#7C4DFF" strokeWidth="3" />
          {/* Glowing Rune Core */}
          <circle cx="150" cy="170" r="32" fill="url(#golemCore)" className="animate-pulse" />
          <polygon points="150,145 168,175 132,175" fill="none" stroke="#E040FB" strokeWidth="3" />

          {/* Heavy Shoulders */}
          <circle cx="65" cy="130" r="36" fill="url(#obsidian)" stroke="#7C4DFF" strokeWidth="2" />
          <circle cx="235" cy="130" r="36" fill="url(#obsidian)" stroke="#7C4DFF" strokeWidth="2" />

          {/* Head & Glowing Eyes */}
          <rect x="110" y="55" width="80" height="60" rx="14" fill="url(#obsidian)" stroke="#7C4DFF" strokeWidth="3" />
          <rect x="125" y="78" width="16" height="6" rx="2" fill={isDefeated ? '#78909C' : '#E040FB'} className={isDefeated ? '' : 'animate-ping'} />
          <rect x="159" y="78" width="16" height="6" rx="2" fill={isDefeated ? '#78909C' : '#E040FB'} className={isDefeated ? '' : 'animate-ping'} />

          {/* Clock Gears Motif */}
          <circle cx="150" cy="170" r="42" fill="none" stroke="#BA68C8" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
      </div>
    );
  }

  // Default: Ignis the Procrastination Wyrm (Dragon)
  return (
    <div
      className={`relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center select-none transition-all ${
        isDamaged ? 'animate-shake filter brightness-125 saturate-150' : ''
      }`}
    >
      {/* Fiery Background Aura */}
      <div
        className={`absolute inset-0 rounded-full bg-radial from-orange-500/25 via-red-500/10 to-transparent blur-xl pointer-events-none transition-opacity duration-700 ${
          isDefeated ? 'opacity-20' : 'opacity-100 animate-pulse'
        }`}
      />

      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="dragonScale" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isDefeated ? '#FFE082' : '#FF5722'} />
            <stop offset="40%" stopColor={isDefeated ? '#FFB74D' : '#D84315'} />
            <stop offset="100%" stopColor={isDefeated ? '#FFA000' : '#4E0D00'} />
          </linearGradient>

          <radialGradient id="dragonCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>

          <linearGradient id="wingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDefeated ? '#FFF8E1' : '#FF8A65'} />
            <stop offset="100%" stopColor={isDefeated ? '#FFD54F' : '#3E2723'} />
          </linearGradient>
        </defs>

        {/* Back Wing */}
        <g className={isDefeated ? '' : 'animate-float'} style={{ animationDuration: '4s' }}>
          <path
            d="M260 180 Q320 80 370 120 Q340 180 300 220 Z"
            fill="url(#wingGradient)"
            opacity="0.85"
            stroke="#BF360C"
            strokeWidth="2"
          />
          <path d="M260 180 Q310 130 350 140" stroke="#FFE082" strokeWidth="1.5" fill="none" />
        </g>

        {/* Dragon Coiled Tail */}
        <path
          d="M170 300 Q130 350 70 320 Q30 280 60 250 Q80 230 110 260"
          fill="none"
          stroke="url(#dragonScale)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Tail Spikes */}
        <polygon points="50,290 35,270 65,275" fill="#FFAB91" />
        <polygon points="70,320 60,340 85,330" fill="#FFAB91" />

        {/* Dragon Muscular Body & Torso */}
        <path
          d="M160 170 Q240 180 230 280 Q200 320 150 300 Q110 260 160 170 Z"
          fill="url(#dragonScale)"
          stroke="#4E0D00"
          strokeWidth="3"
        />

        {/* Fiery Chest Underbelly Plates */}
        <path
          d="M155 195 Q190 205 185 270 Q160 285 140 260 Q130 220 155 195 Z"
          fill="url(#dragonCore)"
          className={isDefeated ? '' : 'animate-pulse'}
          stroke="#FFD54F"
          strokeWidth="1.5"
        />

        {/* Forefront Wing */}
        <g className={isDefeated ? '' : 'animate-float'} style={{ animationDuration: '3.2s' }}>
          <path
            d="M190 200 Q260 60 330 90 Q300 180 230 230 Z"
            fill="url(#wingGradient)"
            stroke="#BF360C"
            strokeWidth="3"
          />
          <path d="M190 200 Q250 110 310 115" stroke="#FFE082" strokeWidth="2" fill="none" />
          <path d="M210 210 Q260 150 285 170" stroke="#FFE082" strokeWidth="1.5" fill="none" />
        </g>

        {/* Dragon Serpentine Neck & Head */}
        <path
          d="M165 185 Q130 140 140 95 Q170 85 195 105 Q190 145 185 185 Z"
          fill="url(#dragonScale)"
          stroke="#4E0D00"
          strokeWidth="2.5"
        />

        {/* Dragon Horns (Majestic Obsidian / Lava Crest) */}
        <path
          d="M150 85 Q130 30 110 40 Q135 65 145 88 Z"
          fill={isDefeated ? '#FFE082' : '#3E2723'}
          stroke="#FFAB91"
          strokeWidth="2"
        />
        <path
          d="M170 80 Q175 25 160 30 Q165 60 168 82 Z"
          fill={isDefeated ? '#FFE082' : '#3E2723'}
          stroke="#FFAB91"
          strokeWidth="2"
        />

        {/* Dragon Snout & Fierce Jaw */}
        <path
          d="M140 95 L95 110 L115 130 L150 120 Z"
          fill="url(#dragonScale)"
          stroke="#4E0D00"
          strokeWidth="2"
        />
        {/* Teeth / Fangs */}
        <polygon points="105,115 110,123 115,116" fill="#FFF9C4" />
        <polygon points="120,118 124,125 128,118" fill="#FFF9C4" />

        {/* Glowing Dragon Eye */}
        {isDefeated ? (
          // Peaceful closed eye
          <path d="M130 102 Q140 106 148 102" stroke="#4E0D00" strokeWidth="2.5" fill="none" />
        ) : (
          <g>
            <ellipse cx="140" cy="100" rx="9" ry="7" fill="#FFEB3B" />
            <ellipse cx="141" cy="100" rx="3.5" ry="6" fill="#D50000" />
            <circle cx="143" cy="98" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Smoke & Ember Wisps from Snout */}
        {!isDefeated && (
          <g className="animate-float" style={{ animationDuration: '2s' }}>
            <circle cx="85" cy="105" r="3" fill="#FF7043" opacity="0.8" />
            <circle cx="70" cy="95" r="4.5" fill="#FFA726" opacity="0.6" />
            <circle cx="55" cy="80" r="6" fill="#FFE082" opacity="0.4" />
          </g>
        )}

        {/* Defeated Aura: Golden Zen Halo */}
        {isDefeated && (
          <g className="animate-pulse">
            <ellipse cx="155" cy="50" rx="40" ry="12" fill="none" stroke="#FFD700" strokeWidth="4" />
            <circle cx="155" cy="50" r="3" fill="#FFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
