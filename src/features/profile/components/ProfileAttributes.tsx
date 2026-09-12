'use client';

import React from 'react';
import { Brain, Heart, Sparkles, Palette, Shield } from 'lucide-react';
import { Profile } from '@/types/database';
import { ATTRIBUTE_CONFIG, getAttributeLevel } from '@/lib/game/engine';

interface ProfileAttributesProps {
  profile: Profile;
}

export const ProfileAttributes: React.FC<ProfileAttributesProps> = ({ profile }) => {
  const attributes = [
    {
      key: 'focus' as const,
      exp: profile.focus_exp,
      config: ATTRIBUTE_CONFIG.focus,
      icon: Brain,
    },
    {
      key: 'vitality' as const,
      exp: profile.vitality_exp,
      config: ATTRIBUTE_CONFIG.vitality,
      icon: Heart,
    },
    {
      key: 'mindfulness' as const,
      exp: profile.mindfulness_exp,
      config: ATTRIBUTE_CONFIG.mindfulness,
      icon: Sparkles,
    },
    {
      key: 'creativity' as const,
      exp: profile.creativity_exp,
      config: ATTRIBUTE_CONFIG.creativity,
      icon: Palette,
    },
    {
      key: 'discipline' as const,
      exp: profile.discipline_exp,
      config: ATTRIBUTE_CONFIG.discipline,
      icon: Shield,
    },
  ];

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
      <h2 className="text-xl font-extrabold text-[#3E2723] mb-1">Life RPG Attributes</h2>
      <p className="text-xs text-[#8D6E63] mb-6">
        Every quest you complete feeds into its respective life attribute, leveling up your real-world character stats.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributes.map(({ key, exp, config, icon: Icon }) => {
          const attrLvl = getAttributeLevel(exp);
          return (
            <div
              key={key}
              className="p-4 rounded-2xl border border-[#EFEBE9] bg-[#FDFBF7] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${config.badgeColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                  <span className="text-xs font-extrabold text-[#3E2723]">Level {attrLvl}</span>
                </div>

                <p className="text-[11px] text-[#8D6E63] mt-1 leading-normal">
                  {config.description}
                </p>
              </div>

              <div className="mt-4 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#5D4037] mb-1">
                  <span>Exp</span>
                  <span>{exp} EXP</span>
                </div>
                <div className="w-full h-2 bg-[#EFEBE9] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.barColor} rounded-full transition-all`}
                    style={{ width: `${Math.min(100, (exp % 150) / 1.5)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
