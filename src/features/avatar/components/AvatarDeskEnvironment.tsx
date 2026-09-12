'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimeOfDay } from '../types';

interface AvatarDeskEnvironmentProps {
  activeTime: TimeOfDay;
}

export const AvatarDeskEnvironment: React.FC<AvatarDeskEnvironmentProps> = ({ activeTime }) => {
  return (
    <g id="deskEnvironment">
      {/* Background Wall */}
      <rect
        x="20"
        y="20"
        width="360"
        height="300"
        rx="24"
        fill={activeTime === 'night' ? '#F7F4EF' : '#FDFBF7'}
        stroke="#EFEBE9"
        strokeWidth="3"
      />

      {/* Bookshelf on the Right */}
      <rect x="270" y="55" width="90" height="12" rx="4" fill="#8D6E63" />
      <rect x="275" y="32" width="12" height="23" rx="2" fill="#E57373" />
      <rect x="290" y="26" width="16" height="29" rx="2" fill="#81B29A" />
      <rect x="309" y="35" width="14" height="20" rx="2" fill="#F4A261" />
      <rect x="326" y="28" width="18" height="27" rx="2" fill="#BA68C8" />
      {/* Little succulent plant */}
      <path d="M350 45 L354 55 L344 55 Z" fill="#D7CCC8" />
      <circle cx="347" cy="42" r="6" fill="#81C784" />

      {/* Study Lamp & Glow Cone */}
      <ellipse cx="295" cy="190" rx="65" ry="50" fill="url(#lampGlow)" />
      <path
        d="M315 240 L315 140 Q315 125 300 125 L290 125"
        stroke="#5D4037"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M280 125 L300 125 L308 142 L272 142 Z" fill="#F4A261" stroke="#E76F51" strokeWidth="2" />
      <line x1="290" y1="142" x2="290" y2="148" stroke="#FFE082" strokeWidth="3" />

      {/* Desk Surface */}
      <path d="M30 240 L370 240 L360 305 L40 305 Z" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="4" />
      <rect x="110" y="245" width="180" height="55" rx="6" fill="#4E342E" fillOpacity="0.15" />

      {/* Steaming Coffee/Tea Mug */}
      <rect x="70" y="246" width="22" height="24" rx="4" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
      <path d="M92 252 C97 252 97 264 92 264" stroke="#8D6E63" strokeWidth="2" fill="none" />
      <ellipse cx="81" cy="249" rx="8" ry="3" fill="#5D4037" />

      {/* Animated Steam */}
      <motion.path
        d="M78 244 Q75 236 80 230 Q85 224 81 218"
        stroke="#D7CCC8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter="url(#softBlur)"
        animate={{
          d: [
            'M78 244 Q75 236 80 230 Q85 224 81 218',
            'M80 244 Q85 236 78 230 Q75 224 83 218',
            'M78 244 Q75 236 80 230 Q85 224 81 218',
          ],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      />

      {/* Open Study Journal */}
      <polygon points="120,252 165,250 165,285 120,288" fill="#FFFDE7" stroke="#BCAAA4" strokeWidth="2" />
      <polygon points="165,250 210,252 210,288 165,285" fill="#FFFDE7" stroke="#BCAAA4" strokeWidth="2" />
      <line x1="128" y1="258" x2="157" y2="257" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
      <line x1="128" y1="266" x2="157" y2="265" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
      <line x1="173" y1="257" x2="202" y2="258" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
      <line x1="173" y1="265" x2="202" y2="266" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};
