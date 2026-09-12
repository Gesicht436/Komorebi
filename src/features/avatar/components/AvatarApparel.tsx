'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOODIE_COLORS } from '../types';
import { EvolutionTier } from '@/lib/game/evolution';

interface AvatarApparelProps {
  equippedHoodie?: string;
  equippedHeadphones?: string;
  equippedGlasses?: string;
  isStudying?: boolean;
  vitalityTier?: EvolutionTier;
  zenTier?: EvolutionTier;
  focusTier?: EvolutionTier;
}

export const AvatarApparel: React.FC<AvatarApparelProps> = ({
  equippedHoodie = 'knit_sweater',
  equippedHeadphones = 'none',
  equippedGlasses = 'none',
  isStudying = false,
  vitalityTier = 0,
  zenTier = 0,
  focusTier = 0,
}) => {
  const hoodie = HOODIE_COLORS[equippedHoodie] || HOODIE_COLORS.knit_sweater;

  // Muscle / Physique scaling variables
  const neckWidth = vitalityTier === 3 ? 30 : vitalityTier === 2 ? 26 : vitalityTier === 1 ? 23 : 20;
  const neckX = 200 - neckWidth / 2;

  const armStrokeWidth = vitalityTier === 3 ? 26 : vitalityTier === 2 ? 22 : vitalityTier === 1 ? 19 : 16;

  // Dynamic torso paths based on muscular evolution
  const getTorsoPath = () => {
    switch (vitalityTier) {
      case 3:
        // Titan Juggernaut: Broadest deltoid shoulders (138 to 262), powerful upper chest
        return 'M138 200 C130 215 132 250 130 285 L270 285 C268 250 270 215 262 200 C242 206 158 206 138 200 Z';
      case 2:
        // Muscular: Broad shoulders (146 to 254), tapered torso
        return 'M146 200 C138 215 136 250 133 285 L267 285 C264 250 262 215 254 200 C236 208 164 208 146 200 Z';
      case 1:
        // Athletic: Athletic shoulders (153 to 247)
        return 'M153 200 C144 215 138 250 134 285 L266 285 C262 250 256 215 247 200 C230 209 170 209 153 200 Z';
      default:
        // Novice: Slender cozy starter silhouette (160 to 240)
        return 'M160 200 C150 215 140 250 135 285 L265 285 C260 250 250 215 240 200 C225 210 175 210 160 200 Z';
    }
  };

  return (
    <g id="avatarBody">
      {/* Back Hair */}
      <path
        d="M170 120 C155 100 150 160 150 190 C165 205 235 205 250 190 C250 160 245 100 230 120 Z"
        fill="#3E2723"
      />

      {/* Muscular Trapezius Contours (Visible for Tier 2 and 3) */}
      {vitalityTier >= 2 && (
        <path
          d="M172 196 Q200 188 228 196 L236 208 Q200 204 164 208 Z"
          fill={hoodie.shade}
          opacity="0.6"
        />
      )}

      {/* Hoodie / Torso Body */}
      <path
        d={getTorsoPath()}
        fill={hoodie.main}
        stroke={hoodie.shade}
        strokeWidth="3"
      />

      {/* Chest Pectoral & Athletic Contour Lines (Tier 2 & 3) */}
      {vitalityTier >= 2 && (
        <g id="pectoralContours" opacity="0.45">
          <path
            d="M168 222 Q200 228 232 222"
            stroke={hoodie.shade}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="200" y1="215" x2="200" y2="238" stroke={hoodie.shade} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* Hoodie Kangaroo Pocket / Seams */}
      <path d="M168 250 Q200 256 232 250 L228 280 L172 280 Z" fill={hoodie.shade} fillOpacity="0.4" />
      <line x1="192" y1="205" x2="192" y2="228" stroke={hoodie.trim} strokeWidth="3" strokeLinecap="round" />
      <line x1="208" y1="205" x2="208" y2="225" stroke={hoodie.trim} strokeWidth="3" strokeLinecap="round" />

      {/* Neck (Thickens with gym strength progression) */}
      <rect x={neckX} y="175" width={neckWidth} height="22" rx="4" fill="#FFDFC4" />
      {vitalityTier >= 2 && (
        <path
          d={`M${neckX + 3} 184 Q200 188 M${neckX + neckWidth - 3} 184 Q200 188`}
          stroke="#F8BBD0"
          strokeWidth="1.5"
          opacity="0.6"
        />
      )}

      {/* Head & Face */}
      <motion.g
        animate={isStudying ? { y: [0, 2, 0] } : { y: [0, -1, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <ellipse cx="200" cy="150" rx="32" ry="34" fill="#FFDFC4" />
        <circle cx="180" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />
        <circle cx="220" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />

        {/* Eyes: Dynamic Expression based on Zen / Study / Standard */}
        {isStudying ? (
          /* Focused Study Eyes */
          <g>
            <path d="M178 149 Q185 155 192 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M208 149 Q215 155 222 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        ) : zenTier >= 2 ? (
          /* Serene Meditative Zen Eyelids (Monk State) */
          <g>
            <path d="M178 148 Q185 143 192 148" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M208 148 Q215 143 222 148" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M178 141 Q185 137 192 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M208 141 Q215 137 222 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Standard Anime Eyes */
          <g>
            <ellipse cx="185" cy="148" rx="4" ry="5" fill="#3E2723" />
            <ellipse cx="215" cy="148" rx="4" ry="5" fill="#3E2723" />
            <circle cx="183" cy="146" r="1.5" fill="#FFFFFF" />
            <circle cx="213" cy="146" r="1.5" fill="#FFFFFF" />
            {/* Intellect Glint (Focus Tier 2+) */}
            {focusTier >= 2 && (
              <g>
                <circle cx="186" cy="150" r="1" fill="#60A5FA" />
                <circle cx="216" cy="150" r="1" fill="#60A5FA" />
              </g>
            )}
            <path d="M178 141 Q185 138 192 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M208 141 Q215 138 222 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Gentle Smile */}
        <path
          d={zenTier >= 2 ? 'M195 163 Q200 167 205 163' : 'M196 163 Q200 166 204 163'}
          stroke="#3E2723"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Anime Bangs & Hair */}
        <path
          d="M168 135 C175 110 225 110 232 135 C222 130 215 142 205 134 C198 144 185 132 168 135 Z"
          fill="#4E342E"
        />
        <path d="M168 135 C164 150 166 170 172 178" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M232 135 C236 150 234 170 228 178" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* Glasses */}
        {equippedGlasses !== 'none' && (
          <g id="avatarGlasses">
            {equippedGlasses === 'wireframe_rounds' ? (
              <g>
                <circle cx="185" cy="148" r="9" stroke="#FFB300" strokeWidth="2" fill="none" />
                <circle cx="215" cy="148" r="9" stroke="#FFB300" strokeWidth="2" fill="none" />
                <line x1="194" y1="148" x2="206" y2="148" stroke="#FFB300" strokeWidth="2" />
              </g>
            ) : (
              <g>
                <rect x="175" y="140" width="20" height="15" rx="3" stroke="#5D4037" strokeWidth="2.5" fill="none" />
                <rect x="205" y="140" width="20" height="15" rx="3" stroke="#5D4037" strokeWidth="2.5" fill="none" />
                <line x1="195" y1="145" x2="205" y2="145" stroke="#5D4037" strokeWidth="3" />
              </g>
            )}
          </g>
        )}

        {/* Headphones */}
        {equippedHeadphones !== 'none' && (
          <g id="avatarHeadphones">
            {equippedHeadphones === 'cat_ear_headset' ? (
              <g>
                <path d="M165 145 C162 108 238 108 235 145" stroke="#F06292" strokeWidth="5" strokeLinecap="round" fill="none" />
                <polygon points="172,118 184,95 194,115" fill="#F06292" />
                <polygon points="176,115 184,101 190,114" fill="#F8BBD0" />
                <polygon points="228,118 216,95 206,115" fill="#F06292" />
                <polygon points="224,115 216,101 210,114" fill="#F8BBD0" />
                <rect x="160" y="136" width="10" height="24" rx="4" fill="#EC407A" stroke="#C2185B" strokeWidth="1.5" />
                <rect x="230" y="136" width="10" height="24" rx="4" fill="#EC407A" stroke="#C2185B" strokeWidth="1.5" />
              </g>
            ) : (
              <g>
                <path d="M165 145 C162 108 238 108 235 145" stroke="#37474F" strokeWidth="6" strokeLinecap="round" fill="none" />
                <rect x="159" y="136" width="11" height="25" rx="5" fill="#263238" stroke="#ECEFF1" strokeWidth="1" />
                <rect x="230" y="136" width="11" height="25" rx="5" fill="#263238" stroke="#ECEFF1" strokeWidth="1" />
              </g>
            )}
          </g>
        )}
      </motion.g>

      {/* Arms & Hands (Thickens and equips gym wraps / mala beads based on evolution) */}
      {/* Left Arm */}
      <path
        d="M142 230 Q150 265 168 268"
        stroke={hoodie.shade}
        strokeWidth={armStrokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* Right Arm */}
      <path
        d="M258 230 Q250 265 205 264"
        stroke={hoodie.shade}
        strokeWidth={armStrokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {/* Left Hand */}
      <circle cx="168" cy="268" r={vitalityTier >= 2 ? 9 : 8} fill="#FFDFC4" />
      {/* Right Hand */}
      <circle cx="203" cy="264" r={vitalityTier >= 2 ? 9 : 8} fill="#FFDFC4" />

      {/* VITALITY WRAPS / SWEATBANDS */}
      {vitalityTier === 1 && (
        /* Tier 1: Athletic Black Sweatband on Left Wrist */
        <rect x="158" y="261" width="14" height="6" rx="2" fill="#263238" stroke="#455A64" strokeWidth="0.8" />
      )}

      {vitalityTier === 2 && (
        /* Tier 2: Dual Athletic White Gym Wrist Wraps */
        <g id="gymWrapsTier2">
          <rect x="157" y="260" width="16" height="7" rx="2" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1" />
          <line x1="157" y1="263" x2="173" y2="263" stroke="#78909C" strokeWidth="0.8" />
          <rect x="207" y="257" width="14" height="7" rx="2" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1" />
        </g>
      )}

      {vitalityTier === 3 && (
        /* Tier 3: Pro Heavy-Duty Titan Lifting Wraps (Charcoal & Red) */
        <g id="titanWrapsTier3">
          <rect x="155" y="259" width="18" height="9" rx="2.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <line x1="155" y1="263.5" x2="173" y2="263.5" stroke="#EF4444" strokeWidth="2" />
          <rect x="206" y="256" width="16" height="9" rx="2.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <line x1="206" y1="260.5" x2="222" y2="260.5" stroke="#EF4444" strokeWidth="2" />
        </g>
      )}

      {/* ZEN MALA BEADS on Right Wrist (If Zen Tier 2+ and not Titan) */}
      {zenTier >= 2 && vitalityTier < 3 && (
        <g id="zenMalaBeads">
          <circle cx="214" cy="261" r="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="0.5" />
          <circle cx="217" cy="263" r="2" fill="#A1887F" stroke="#5D4037" strokeWidth="0.5" />
          <circle cx="218" cy="266" r="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="0.5" />
          <circle cx="216" cy="269" r="2" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.5" />
        </g>
      )}

      {/* Pen / Journal Writing Tool */}
      <line x1="195" y1="272" x2="215" y2="250" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
};
