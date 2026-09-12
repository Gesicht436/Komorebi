'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { ProfileView } from '@/components/profile/ProfileView';

export default function ProfilePage() {
  const { profile, activityLogs, updateDisplayName } = useGame();

  if (!profile) return null;

  return (
    <div>
      <ProfileView
        profile={profile}
        activityLogs={activityLogs}
        onUpdateDisplayName={updateDisplayName}
      />
    </div>
  );
}
