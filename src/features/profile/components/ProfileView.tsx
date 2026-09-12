'use client';

import React from 'react';
import { ProfileViewProps } from '../types';
import { ProfileHeroCard } from './ProfileHeroCard';
import { CharacterEvolutionCard } from './CharacterEvolutionCard';
import { ProfileAttributes } from './ProfileAttributes';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ActivityChronicle } from './ActivityChronicle';

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  activityLogs,
  onUpdateDisplayName,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Hero Character Card with Avatar, Level XP & Quick Stats */}
      <ProfileHeroCard
        profile={profile}
        onUpdateDisplayName={onUpdateDisplayName}
      />

      {/* 2. Character Evolution System (Visual Identity & Dynamic Transformations) */}
      <CharacterEvolutionCard profile={profile} />

      {/* 3. 5 Life RPG Attributes Breakdown */}
      <ProfileAttributes profile={profile} />

      {/* 4. 30-Day Activity & Consistency Heatmap */}
      <ActivityHeatmap activityLogs={activityLogs} />

      {/* 5. Activity Logs History Timeline */}
      <ActivityChronicle activityLogs={activityLogs} />
    </div>
  );
};
