'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOODIE_COLORS } from '../types';

interface AvatarApparelProps {
  equippedHoodie?: string;
  equippedHeadphones?: string;
  equippedGlasses?: string;
  isStudying?: boolean;
}

export const AvatarApparel: React.FC<AvatarApparelProps> = ({
  equippedHoodie = 'knit_sweater',
  equippedHeadphones = 'none',
  equippedGlasses = 'none',
  isStudying = false,
}) => {
  const hoodie = HOODIE_COLORS[equippedHoodie] || HOODIE_COLORS.knit_sweater;

  return (
    <g id="avatarBody">
      {/* Back Hair */}
      <path
        d="M170 120 C155 100 150 160 150 190 C165 205 235 205 250 190 C250 160 245 100 230 120 Z"
        fill="#3E2723"
      />

      {/* Hoodie Body */}
      <path
        d="M160 200 C150 215 140 250 135 285 L265 285 C260 250 250 215 240 200 C225 210 175 210 160 200 Z"
        fill={hoodie.main}
        stroke={hoodie.shade}
        strokeWidth="3"
      />

      {/* Hoodie Kangaroo Pocket / Seams */}
      <path d="M168 250 Q200 256 232 250 L228 280 L172 280 Z" fill={hoodie.shade} fillOpacity="0.4" />
      <line x1="192" y1="205" x2="192" y2="228" stroke={hoodie.trim} strokeWidth="3" strokeLinecap="round" />
      <line x1="208" y1="205" x2="208" y2="225" stroke={hoodie.trim} strokeWidth="3" strokeLinecap="round" />

      {/* Neck */}
      <rect x="190" y="175" width="20" height="22" rx="4" fill="#FFDFC4" />

      {/* Head & Face */}
      <motion.g
        animate={isStudying ? { y: [0, 2, 0] } : { y: [0, -1, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <ellipse cx="200" cy="150" rx="32" ry="34" fill="#FFDFC4" />
        <circle cx="180" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />
        <circle cx="220" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />

        {/* Eyes (Gentle, Relaxed Anime Eyes with Study Reactions) */}
        {isStudying ? (
          <g>
            <path d="M178 149 Q185 155 192 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M208 149 Q215 155 222 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g>
            <ellipse cx="185" cy="148" rx="4" ry="5" fill="#3E2723" />
            <ellipse cx="215" cy="148" rx="4" ry="5" fill="#3E2723" />
            <circle cx="183" cy="146" r="1.5" fill="#FFFFFF" />
            <circle cx="213" cy="146" r="1.5" fill="#FFFFFF" />
            <path d="M178 141 Q185 138 192 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M208 141 Q215 138 222 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Gentle Smile */}
        <path d="M196 163 Q200 166 204 163" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />

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

      {/* Arms & Hands writing in journal */}
      <path d="M142 230 Q150 265 168 268" stroke={hoodie.shade} strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M258 230 Q250 265 205 264" stroke={hoodie.shade} strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="168" cy="268" r="8" fill="#FFDFC4" />
      <circle cx="203" cy="264" r="8" fill="#FFDFC4" />
      <line x1="195" y1="272" x2="215" y2="250" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
};
