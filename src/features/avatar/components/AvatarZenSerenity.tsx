'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EvolutionTier } from '@/lib/game/evolution';

interface AvatarZenSerenityProps {
  tier: EvolutionTier;
}

export const AvatarZenSerenity: React.FC<AvatarZenSerenityProps> = ({ tier }) => {
  if (tier === 0) return null;

  return (
    <g id="avatarZenSerenity">
      {/* TIER 1: Centered Presence (Soft jade halo glimmer and gentle breathing vapor) */}
      {tier === 1 && (
        <g>
          {/* Faint Jade Breathing Circle */}
          <motion.circle
            cx="200"
            cy="148"
            r="42"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            animate={{
              scale: [0.98, 1.03, 0.98],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />

          {/* Gentle Floating Zen Spark */}
          <motion.circle
            cx="188"
            cy="112"
            r="1.5"
            fill="#34D399"
            animate={{ y: [0, -6, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          />
        </g>
      )}

      {/* TIER 2: Zen Serenity (Floating Golden Halo Ring, sunburst rays, and drifting cherry blossom / tea leaf) */}
      {tier === 2 && (
        <g>
          {/* Floating Golden Serenity Halo Ring above head */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          >
            {/* Halo Shadow / Glow */}
            <ellipse
              cx="200"
              cy="96"
              rx="28"
              ry="7"
              fill="url(#zenHaloGlow)"
              opacity="0.85"
            />
            {/* Primary Golden Ring */}
            <ellipse
              cx="200"
              cy="96"
              rx="26"
              ry="6"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <ellipse
              cx="200"
              cy="96"
              rx="24"
              ry="5"
              fill="none"
              stroke="#FEF08A"
              strokeWidth="1"
            />

            {/* Subtle Sunburst Radiance Spokes */}
            <line x1="200" y1="84" x2="200" y2="88" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="178" y1="89" x2="182" y2="92" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="222" y1="89" x2="218" y2="92" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>

          {/* Drifting Zen Leaf / Petal 1 */}
          <motion.path
            d="M172 108 Q174 114 178 112 Q176 106 172 108 Z"
            fill="#86EFAC"
            opacity="0.75"
            animate={{
              y: [0, 20],
              x: [0, -8],
              rotate: [0, 45],
              opacity: [0.8, 0],
            }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeOut' }}
          />

          {/* Drifting Zen Leaf / Petal 2 */}
          <motion.path
            d="M226 112 Q228 118 232 116 Q230 110 226 112 Z"
            fill="#F472B6"
            opacity="0.75"
            animate={{
              y: [0, 24],
              x: [0, 10],
              rotate: [0, -60],
              opacity: [0.8, 0],
            }}
            transition={{ repeat: Infinity, duration: 5, delay: 1.8, ease: 'easeOut' }}
          />
        </g>
      )}

      {/* TIER 3: Transcendent Monk (Sacred Mandala Lotus Halo, levitating lotus crest, radiant peace waves) */}
      {tier === 3 && (
        <g>
          {/* Sacred Mandala Halo behind head */}
          <g transform="translate(200, 142)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
            >
              {/* Outer Radiant Circle */}
              <circle cx="0" cy="0" r="52" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.65" />
              {/* Sacred 8-Petal Mandala Spikes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <line x1="0" y1="-52" x2="0" y2="-44" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="0" cy="-44" r="1.5" fill="#F59E0B" />
                </g>
              ))}
            </motion.g>

            {/* Inner Counter-Rotating Lotus Halo */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="44" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.8" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <path
                  key={angle}
                  d="M0 -44 Q4 -37 0 -32 Q-4 -37 0 -44 Z"
                  fill="#FDE047"
                  opacity="0.85"
                  transform={`rotate(${angle})`}
                />
              ))}
            </motion.g>
          </g>

          {/* Levitating Golden Lotus Crown Crest */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            transform="translate(200, 88)"
          >
            {/* Lotus Center Petal */}
            <path d="M0 -8 C2 -2 2 4 0 6 C-2 4 -2 -2 0 -8 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.75" />
            {/* Left Petal */}
            <path d="M-2 4 C-8 0 -9 -4 -7 -6 C-5 -3 -3 1 -2 4 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.75" />
            {/* Right Petal */}
            <path d="M2 4 C8 0 9 -4 7 -6 C5 -3 3 1 2 4 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.75" />
            {/* Center Core Pearl */}
            <circle cx="0" cy="4" r="2" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="0.5" />
          </motion.g>

          {/* Transcendent Peace Waves Expanding */}
          <motion.ellipse
            cx="200"
            cy="150"
            rx="48"
            ry="48"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="1.2"
            animate={{
              scale: [0.95, 1.18, 0.95],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
          />
        </g>
      )}
    </g>
  );
};
