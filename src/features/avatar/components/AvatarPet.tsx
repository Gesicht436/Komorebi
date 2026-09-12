'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AvatarPetProps {
  equippedPet?: string;
}

export const AvatarPet: React.FC<AvatarPetProps> = ({ equippedPet = 'none' }) => {
  if (equippedPet === 'none') return null;

  return (
    <g id="petCompanion">
      {/* 1. Sleeping Calico Cat */}
      {equippedPet === 'calico_cat' && (
        <motion.g
          animate={{ scaleY: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{ transformOrigin: '240px 255px' }}
        >
          <ellipse cx="245" cy="254" rx="22" ry="15" fill="#FFF3E0" stroke="#FF8A65" strokeWidth="2" />
          <path d="M232 245 Q240 240 248 248 Q238 255 232 245 Z" fill="#E65100" />
          <path d="M250 252 Q260 250 258 262 Q252 260 250 252 Z" fill="#3E2723" />
          <circle cx="230" cy="250" r="10" fill="#FFF3E0" stroke="#FF8A65" strokeWidth="1.5" />
          <polygon points="223,243 226,234 231,241" fill="#E65100" />
          <polygon points="232,241 236,235 238,243" fill="#3E2723" />
          <path d="M225 251 Q228 254 231 251" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M265 256 Q272 250 268 244" stroke="#FF8A65" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </motion.g>
      )}

      {/* 2. Cheerful Shiba Inu */}
      {equippedPet === 'shiba_inu' && (
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ transformOrigin: '255px 250px' }}
        >
          <ellipse cx="252" cy="255" rx="18" ry="14" fill="#FFA726" stroke="#E65100" strokeWidth="2" />
          <circle cx="250" cy="242" r="12" fill="#FFA726" stroke="#E65100" strokeWidth="1.5" />
          <ellipse cx="250" cy="246" rx="6" ry="4" fill="#FFFFFF" />
          <circle cx="250" cy="244" r="2" fill="#3E2723" />
          <path d="M245 240 Q247 238 249 240" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M251 240 Q253 238 255 240" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <polygon points="242,234 245,224 249,233" fill="#E65100" />
          <polygon points="251,233 255,224 258,234" fill="#E65100" />
        </motion.g>
      )}

      {/* 3. Wise Sleepy Owl */}
      {equippedPet === 'sleepy_owl' && (
        <g>
          <ellipse cx="290" cy="115" rx="10" ry="13" fill="#78909C" stroke="#455A64" strokeWidth="1.5" />
          <circle cx="286" cy="112" r="4" fill="#FFF9C4" stroke="#37474F" strokeWidth="1" />
          <circle cx="294" cy="112" r="4" fill="#FFF9C4" stroke="#37474F" strokeWidth="1" />
          <circle cx="286" cy="112" r="2" fill="#263238" />
          <circle cx="294" cy="112" r="2" fill="#263238" />
          <polygon points="289,115 291,115 290,118" fill="#FFB300" />
        </g>
      )}
    </g>
  );
};
