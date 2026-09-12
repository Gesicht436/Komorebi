'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EvolutionTier } from '@/lib/game/evolution';

interface AvatarIntellectAuraProps {
  tier: EvolutionTier;
  isStudying?: boolean;
}

export const AvatarIntellectAura: React.FC<AvatarIntellectAuraProps> = ({
  tier,
  isStudying = false,
}) => {
  if (tier === 0) return null;

  return (
    <g id="avatarIntellectAura">
      {/* TIER 1: Spark of Insight (Soft azure luminescence & floating motes) */}
      {tier === 1 && (
        <g>
          {/* Subtle head glow */}
          <motion.circle
            cx="200"
            cy="150"
            r="48"
            fill="url(#intellectGlowSoft)"
            animate={{
              r: isStudying ? [46, 52, 46] : [45, 49, 45],
              opacity: isStudying ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4],
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          />

          {/* Floating Insight Motes */}
          <motion.circle
            cx="175"
            cy="120"
            r="2"
            fill="#60A5FA"
            animate={{ y: [-2, -8, -2], opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="225"
            cy="125"
            r="1.8"
            fill="#93C5FD"
            animate={{ y: [0, -7, 0], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.7, delay: 0.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="200"
            cy="105"
            r="1.5"
            fill="#BFDBFE"
            animate={{ y: [-1, -6, -1], opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 3, delay: 1, ease: 'easeInOut' }}
          />
        </g>
      )}

      {/* TIER 2: Cerebral Flow (Radiant sapphire aura, geometric runes & pulse wave) */}
      {tier === 2 && (
        <g>
          {/* Pulsing Energy Rings */}
          <motion.ellipse
            cx="200"
            cy="152"
            rx="56"
            ry="58"
            fill="url(#intellectGlowMedium)"
            animate={{
              rx: isStudying ? [54, 62, 54] : [53, 58, 53],
              ry: isStudying ? [56, 64, 56] : [55, 60, 55],
              opacity: [0.65, 0.95, 0.65],
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          />

          {/* Orbiting Insight Runes / Glyphs */}
          <g transform="translate(200, 150)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            >
              {/* Rune 1 - Top Left */}
              <polygon
                points="-38,-38 -34,-42 -30,-38 -34,-34"
                fill="#93C5FD"
                stroke="#3B82F6"
                strokeWidth="0.75"
                opacity="0.85"
              />
              {/* Rune 2 - Top Right */}
              <polygon
                points="38,-38 42,-42 46,-38 42,-34"
                fill="#A5B4FC"
                stroke="#6366F1"
                strokeWidth="0.75"
                opacity="0.85"
              />
              {/* Rune 3 - Far Right */}
              <circle cx="50" cy="5" r="2.5" fill="#60A5FA" opacity="0.9" />
              {/* Rune 4 - Far Left */}
              <circle cx="-50" cy="5" r="2.5" fill="#818CF8" opacity="0.9" />
            </motion.g>
          </g>

          {/* Electric Focus Corona Arcs */}
          <motion.path
            d="M152 145 C150 115 175 95 200 95 C225 95 250 115 248 145"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            fill="none"
            animate={{ strokeDashoffset: [0, 20] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
        </g>
      )}

      {/* TIER 3: Astral Archmage (Cosmic intellect nova, double aura rings, luminescent motes) */}
      {tier === 3 && (
        <g>
          {/* Outer Cosmic Nova Glow */}
          <motion.ellipse
            cx="200"
            cy="155"
            rx="70"
            ry="72"
            fill="url(#astralNovaGlow)"
            animate={{
              rx: [68, 76, 68],
              ry: [70, 78, 70],
              opacity: isStudying ? [0.8, 1, 0.8] : [0.65, 0.85, 0.65],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />

          {/* Dual Counter-Rotating Cosmic Rings */}
          <g transform="translate(200, 150)">
            {/* Clockwise Ring */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            >
              <ellipse
                cx="0"
                cy="0"
                rx="58"
                ry="48"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                fill="none"
                opacity="0.8"
              />
              <circle cx="58" cy="0" r="3.5" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1" />
              <circle cx="-58" cy="0" r="3.5" fill="#C084FC" stroke="#6D28D9" strokeWidth="1" />
            </motion.g>

            {/* Counter-Clockwise Inner Ring */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            >
              <ellipse
                cx="0"
                cy="0"
                rx="48"
                ry="56"
                stroke="#A855F7"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                fill="none"
                opacity="0.7"
              />
              <polygon points="0,-56 -3,-50 3,-50" fill="#E879F9" />
              <polygon points="0,56 -3,50 3,50" fill="#38BDF8" />
            </motion.g>
          </g>

          {/* Forehead Third-Eye Insight Star */}
          <motion.g
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            transform="translate(200, 137)"
          >
            <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="1.5" fill="#60A5FA" />
          </motion.g>
        </g>
      )}
    </g>
  );
};
