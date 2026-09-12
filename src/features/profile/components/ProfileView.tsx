'use client';

import React from 'react';
import { ProfileViewProps } from '../types';
import { ProfileHeroCard } from './ProfileHeroCard';
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

      {/* 2. 5 Life RPG Attributes Breakdown */}
      <ProfileAttributes profile={profile} />

      {/* 3. 30-Day Activity & Consistency Heatmap */}
      <ActivityHeatmap activityLogs={activityLogs} />

      {/* 4. Activity Logs History Timeline */}
      <ActivityChronicle activityLogs={activityLogs} />
    </div>
  );
};
