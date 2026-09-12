'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { QuestBoard } from '@/components/quests/QuestBoard';

export default function QuestsPage() {
  const {
    quests,
    completeQuest,
    createOrUpdateQuest,
    deleteQuest,
    updateHabit,
  } = useGame();

  return (
    <div>
      <QuestBoard
        quests={quests}
        onCompleteQuest={completeQuest}
        onCreateOrUpdateQuest={createOrUpdateQuest}
        onDeleteQuest={deleteQuest}
        onHabitChange={updateHabit}
      />
    </div>
  );
}
