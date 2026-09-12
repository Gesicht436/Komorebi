'use client';

import React from 'react';
import { TimeOfDay } from '../types';

interface AvatarWindowSkyProps {
  activeTime: TimeOfDay;
}

export const AvatarWindowSky: React.FC<AvatarWindowSkyProps> = ({ activeTime }) => {
  return (
    <g id="windowSky">
      {/* Window Frame */}
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

      {/* Dynamic Scenery */}
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
          {/* Distant Trees / Sunlight Foliage (Komorebi Effect) */}
          <circle
            cx="85"
            cy="140"
            r="28"
            fill={activeTime === 'dusk' ? '#D84315' : '#81C784'}
            fillOpacity="0.4"
          />
          <circle
            cx="120"
            cy="150"
            r="24"
            fill={activeTime === 'dusk' ? '#E64A19' : '#A5D6A7'}
            fillOpacity="0.5"
          />
          <circle
            cx="65"
            cy="160"
            r="18"
            fill={activeTime === 'dusk' ? '#BF360C' : '#C8E6C9'}
            fillOpacity="0.6"
          />
        </g>
      )}
      <circle cx="65" cy="160" r="18" fill="#C8E6C9" fillOpacity="0.6" />
    </g>
  );
};
