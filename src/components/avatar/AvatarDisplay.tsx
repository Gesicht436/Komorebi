'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AvatarDisplayProps {
  equippedHoodie?: string;
  equippedHeadphones?: string;
  equippedGlasses?: string;
  equippedPet?: string;
  isStudying?: boolean;
  level?: number;
  timeOfDay?: 'auto' | 'morning' | 'day' | 'dusk' | 'night';
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  equippedHoodie = 'knit_sweater',
  equippedHeadphones = 'none',
  equippedGlasses = 'none',
  equippedPet = 'none',
  isStudying = false,
  level = 1,
  timeOfDay = 'auto',
  className = '',
}) => {
  // Determine time of day
  const [activeTime, setActiveTime] = React.useState<'morning' | 'day' | 'dusk' | 'night'>(() => {
    if (timeOfDay !== 'auto') return timeOfDay;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  });

  // Hoodie color mapping
  const hoodieColors: Record<string, { main: string; shade: string; trim: string }> = {
    knit_sweater: { main: '#D7CCC8', shade: '#BCAAA4', trim: '#8D6E63' },
    matcha_hoodie: { main: '#A5D6A7', shade: '#81C784', trim: '#4CAF50' },
    lavender_hoodie: { main: '#CE93D8', shade: '#BA68C8', trim: '#8E24AA' },
    midnight_jacket: { main: '#283593', shade: '#1A237E', trim: '#FFD54F' },
  };

  const hoodie = hoodieColors[equippedHoodie] || hoodieColors.knit_sweater;

  return (
    <div className={`relative flex flex-col items-center justify-center p-2 select-none ${className}`}>
      {/* Time of Day Switcher Pills for Judges & Users */}
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
        aria-label="Komorebi Anime Study Avatar and Companion"
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

          {/* Steam Blur */}
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* 1. BACKGROUND WALL & WINDOW */}
        <rect x="20" y="20" width="360" height="300" rx="24" fill={activeTime === 'night' ? '#F7F4EF' : '#FDFBF7'} stroke="#EFEBE9" strokeWidth="3" />

        {/* Cozy Window Frame with Dynamic Sky */}
        <rect
          x="50"
          y="45"
          width="100"
          height="130"
          rx="12"
          fill={
            activeTime === 'morning'
              ? 'url(#skyMorning)'
              : activeTime === 'dusk'
              ? 'url(#skyDusk)'
              : activeTime === 'night'
              ? 'url(#skyNight)'
              : 'url(#skyDay)'
          }
          stroke="#D7CCC8"
          strokeWidth="4"
        />
        <line x1="100" y1="45" x2="100" y2="175" stroke="#D7CCC8" strokeWidth="3" />
        <line x1="50" y1="110" x2="150" y2="110" stroke="#D7CCC8" strokeWidth="3" />

        {/* Window Scenery based on Time */}
        {activeTime === 'night' ? (
          <g id="nightScenery">
            {/* Glowing Moon */}
            <circle cx="120" cy="75" r="10" fill="#FFF9C4" />
            <circle cx="123" cy="73" r="8" fill="#1C2541" />
            {/* Stars */}
            <circle cx="70" cy="65" r="1.5" fill="#FFFFFF" />
            <circle cx="85" cy="80" r="1" fill="#FFFFFF" />
            <circle cx="65" cy="95" r="1.2" fill="#FFFFFF" />
            <circle cx="135" cy="95" r="1.5" fill="#FFFFFF" />
            <circle cx="110" cy="130" r="1" fill="#FFFFFF" />
            {/* Dark Tree Silhouette */}
            <circle cx="85" cy="155" r="28" fill="#0B132B" fillOpacity="0.8" />
            <circle cx="120" cy="160" r="24" fill="#0B132B" fillOpacity="0.9" />
          </g>
        ) : (
          <g id="dayScenery">
            {/* Distant Trees / Sunlight Leaves (Komorebi Effect) */}
            <circle cx="85" cy="140" r="28" fill={activeTime === 'dusk' ? '#D84315' : '#81C784'} fillOpacity="0.4" />
            <circle cx="120" cy="150" r="24" fill={activeTime === 'dusk' ? '#E64A19' : '#A5D6A7'} fillOpacity="0.5" />
            <circle cx="65" cy="160" r="18" fill={activeTime === 'dusk' ? '#BF360C' : '#C8E6C9'} fillOpacity="0.6" />
          </g>
        )}
        <circle cx="65" cy="160" r="18" fill="#C8E6C9" fillOpacity="0.6" />

        {/* Bookshelf on the Right */}
        <rect x="270" y="55" width="90" height="12" rx="4" fill="#8D6E63" />
        <rect x="275" y="32" width="12" height="23" rx="2" fill="#E57373" />
        <rect x="290" y="26" width="16" height="29" rx="2" fill="#81B29A" />
        <rect x="309" y="35" width="14" height="20" rx="2" fill="#F4A261" />
        <rect x="326" y="28" width="18" height="27" rx="2" fill="#BA68C8" />
        {/* Little succulent plant */}
        <path d="M350 45 L354 55 L344 55 Z" fill="#D7CCC8" />
        <circle cx="347" cy="42" r="6" fill="#81C784" />

        {/* 2. LAMP & GLOW CONE */}
        <ellipse cx="295" cy="190" rx="65" ry="50" fill="url(#lampGlow)" />
        <path d="M315 240 L315 140 Q315 125 300 125 L290 125" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
        <path d="M280 125 L300 125 L308 142 L272 142 Z" fill="#F4A261" stroke="#E76F51" strokeWidth="2" />
        <line x1="290" y1="142" x2="290" y2="148" stroke="#FFE082" strokeWidth="3" />

        {/* 3. DESK SURFACE */}
        <path d="M30 240 L370 240 L360 305 L40 305 Z" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="4" />
        <rect x="110" y="245" width="180" height="55" rx="6" fill="#4E342E" fillOpacity="0.15" />

        {/* Steaming Coffee Mug */}
        <rect x="70" y="246" width="22" height="24" rx="4" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
        <path d="M92 252 C97 252 97 264 92 264" stroke="#8D6E63" strokeWidth="2" fill="none" />
        {/* Coffee Drink Surface */}
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
              "M78 244 Q75 236 80 230 Q85 224 81 218",
              "M80 244 Q85 236 78 230 Q75 224 83 218",
              "M78 244 Q75 236 80 230 Q85 224 81 218",
            ],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        />

        {/* Open Study Journal */}
        <polygon points="120,252 165,250 165,285 120,288" fill="#FFFDE7" stroke="#BCAAA4" strokeWidth="2" />
        <polygon points="165,250 210,252 210,288 165,285" fill="#FFFDE7" stroke="#BCAAA4" strokeWidth="2" />
        <line x1="128" y1="258" x2="157" y2="257" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
        <line x1="128" y1="266" x2="157" y2="265" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
        <line x1="173" y1="257" x2="202" y2="258" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />
        <line x1="173" y1="265" x2="202" y2="266" stroke="#D7CCC8" strokeWidth="2" strokeLinecap="round" />

        {/* 4. ANIME AVATAR (Centered at Desk) */}
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
          {/* Hoodie Strings */}
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
            {/* Blushing Cheeks */}
            <circle cx="180" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />
            <circle cx="220" cy="158" r="5" fill="#FFAB91" fillOpacity="0.5" />

            {/* Eyes (Gentle, Relaxed Anime Eyes) */}
            {isStudying ? (
              // Downward looking / study focus
              <g>
                <path d="M178 149 Q185 155 192 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M208 149 Q215 155 222 149" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              // Open cheerful / tranquil eyes
              <g>
                <ellipse cx="185" cy="148" rx="4" ry="5" fill="#3E2723" />
                <ellipse cx="215" cy="148" rx="4" ry="5" fill="#3E2723" />
                {/* Eye Sparkles */}
                <circle cx="183" cy="146" r="1.5" fill="#FFFFFF" />
                <circle cx="213" cy="146" r="1.5" fill="#FFFFFF" />
                {/* Eyebrows */}
                <path d="M178 141 Q185 138 192 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M208 141 Q215 138 222 141" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Gentle Smile */}
            <path d="M196 163 Q200 166 204 163" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Front Anime Bangs & Hair */}
            <path
              d="M168 135 C175 110 225 110 232 135 C222 130 215 142 205 134 C198 144 185 132 168 135 Z"
              fill="#4E342E"
            />
            {/* Side Hair Strands */}
            <path d="M168 135 C164 150 166 170 172 178" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M232 135 C236 150 234 170 228 178" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" fill="none" />

            {/* EQUIPPED GLASSES */}
            {equippedGlasses !== 'none' && (
              <g id="avatarGlasses">
                {equippedGlasses === 'wireframe_rounds' ? (
                  <g>
                    <circle cx="185" cy="148" r="9" stroke="#FFB300" strokeWidth="2" fill="none" />
                    <circle cx="215" cy="148" r="9" stroke="#FFB300" strokeWidth="2" fill="none" />
                    <line x1="194" y1="148" x2="206" y2="148" stroke="#FFB300" strokeWidth="2" />
                  </g>
                ) : (
                  // Tortoiseshell / classic frames
                  <g>
                    <rect x="175" y="140" width="20" height="15" rx="3" stroke="#5D4037" strokeWidth="2.5" fill="none" />
                    <rect x="205" y="140" width="20" height="15" rx="3" stroke="#5D4037" strokeWidth="2.5" fill="none" />
                    <line x1="195" y1="145" x2="205" y2="145" stroke="#5D4037" strokeWidth="3" />
                  </g>
                )}
              </g>
            )}

            {/* EQUIPPED HEADPHONES */}
            {equippedHeadphones !== 'none' && (
              <g id="avatarHeadphones">
                {equippedHeadphones === 'cat_ear_headset' ? (
                  <g>
                    {/* Headband */}
                    <path d="M165 145 C162 108 238 108 235 145" stroke="#F06292" strokeWidth="5" strokeLinecap="round" fill="none" />
                    {/* Cat Ears */}
                    <polygon points="172,118 184,95 194,115" fill="#F06292" />
                    <polygon points="176,115 184,101 190,114" fill="#F8BBD0" />
                    <polygon points="228,118 216,95 206,115" fill="#F06292" />
                    <polygon points="224,115 216,101 210,114" fill="#F8BBD0" />
                    {/* Ear Pads */}
                    <rect x="160" y="136" width="10" height="24" rx="4" fill="#EC407A" stroke="#C2185B" strokeWidth="1.5" />
                    <rect x="230" y="136" width="10" height="24" rx="4" fill="#EC407A" stroke="#C2185B" strokeWidth="1.5" />
                  </g>
                ) : (
                  // Studio Hi-Fi Over-Ears
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
          {/* Hands */}
          <circle cx="168" cy="268" r="8" fill="#FFDFC4" />
          <circle cx="203" cy="264" r="8" fill="#FFDFC4" />
          {/* Pencil */}
          <line x1="195" y1="272" x2="215" y2="250" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 5. EQUIPPED PET COMPANION */}
        {equippedPet !== 'none' && (
          <g id="petCompanion">
            {equippedPet === 'calico_cat' && (
              // Sleeping Calico Cat beside notebook
              <motion.g
                animate={{ scaleY: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                style={{ transformOrigin: '240px 255px' }}
              >
                {/* Body curled */}
                <ellipse cx="245" cy="254" rx="22" ry="15" fill="#FFF3E0" stroke="#FF8A65" strokeWidth="2" />
                {/* Calico Patches */}
                <path d="M232 245 Q240 240 248 248 Q238 255 232 245 Z" fill="#E65100" />
                <path d="M250 252 Q260 250 258 262 Q252 260 250 252 Z" fill="#3E2723" />
                {/* Cat Head */}
                <circle cx="230" cy="250" r="10" fill="#FFF3E0" stroke="#FF8A65" strokeWidth="1.5" />
                {/* Ears */}
                <polygon points="223,243 226,234 231,241" fill="#E65100" />
                <polygon points="232,241 236,235 238,243" fill="#3E2723" />
                {/* Sleeping Closed Eyes */}
                <path d="M225 251 Q228 254 231 251" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {/* Curled Tail */}
                <path d="M265 256 Q272 250 268 244" stroke="#FF8A65" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </motion.g>
            )}

            {equippedPet === 'shiba_inu' && (
              // Cheerful Shiba Inu sitting next to desk
              <motion.g
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ transformOrigin: '255px 250px' }}
              >
                <ellipse cx="252" cy="255" rx="18" ry="14" fill="#FFA726" stroke="#E65100" strokeWidth="2" />
                <circle cx="250" cy="242" r="12" fill="#FFA726" stroke="#E65100" strokeWidth="1.5" />
                {/* White snout */}
                <ellipse cx="250" cy="246" rx="6" ry="4" fill="#FFFFFF" />
                <circle cx="250" cy="244" r="2" fill="#3E2723" />
                {/* Smiling eyes */}
                <path d="M245 240 Q247 238 249 240" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M251 240 Q253 238 255 240" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {/* Perky Shiba Ears */}
                <polygon points="242,234 245,224 249,233" fill="#E65100" />
                <polygon points="251,233 255,224 258,234" fill="#E65100" />
              </motion.g>
            )}

            {equippedPet === 'sleepy_owl' && (
              // Wise little owl perched on study lamp
              <g>
                <ellipse cx="290" cy="115" rx="10" ry="13" fill="#78909C" stroke="#455A64" strokeWidth="1.5" />
                {/* Big Owl Eyes */}
                <circle cx="286" cy="112" r="4" fill="#FFF9C4" stroke="#37474F" strokeWidth="1" />
                <circle cx="294" cy="112" r="4" fill="#FFF9C4" stroke="#37474F" strokeWidth="1" />
                <circle cx="286" cy="112" r="2" fill="#263238" />
                <circle cx="294" cy="112" r="2" fill="#263238" />
                {/* Beak */}
                <polygon points="289,115 291,115 290,118" fill="#FFB300" />
              </g>
            )}
          </g>
        )}

        {/* 6. SUBTLE PROGRESSION BADGE */}
        <g transform="translate(35, 35)">
          <rect width="64" height="24" rx="12" fill="#FFFBF5" stroke="#EFEBE9" strokeWidth="2" />
          <text x="32" y="16" textAnchor="middle" fill="#5D4037" fontSize="11" fontWeight="bold">
            LVL {level}
          </text>
        </g>
      </svg>
    </div>
  );
};
