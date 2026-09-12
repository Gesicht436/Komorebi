'use client';

import React from 'react';
import { Brain, Dumbbell, Sparkles, Palette, Shield } from 'lucide-react';
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
      icon: Dumbbell,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <h2 className="text-xl font-extrabold text-[#3E2723]">Character RPG Attributes</h2>
        <span className="text-xs font-bold text-[#E07A5F] bg-[#FBE9E7] px-3 py-1 rounded-full self-start">
          5 Core Life Attributes
        </span>
      </div>
      <p className="text-xs text-[#8D6E63] mb-6">
        Every task you complete levels up specific character stats (e.g., Coding increases <strong>Intellect</strong>, Gym workouts increase <strong>Strength</strong>).
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
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${config.badgeColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.rpgStat}</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#3E2723] bg-white px-2 py-0.5 rounded-md border border-[#EFEBE9]">
                    Lvl {attrLvl}
                  </span>
                </div>

                <p className="text-[11px] text-[#6D4C41] mt-1 leading-normal">
                  {config.description}
                </p>

                {/* Category Tags that level up this stat */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D6E63] block mb-1">
                    Level Up Activities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {config.categoryExamples.map((ex) => (
                      <span
                        key={ex}
                        className="text-[9px] font-semibold bg-white border border-[#EFEBE9] text-[#5D4037] px-1.5 py-0.5 rounded"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#EFEBE9]/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#5D4037] mb-1">
                  <span>Attribute Experience</span>
                  <span className="font-bold">{exp} EXP</span>
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
