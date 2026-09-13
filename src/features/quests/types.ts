import { Quest, QuestAttribute, QuestType, ActivityLog } from '@/types/database';

export interface QuestBoardProps {
  quests: Quest[];
  activityLogs?: ActivityLog[];
  onCompleteQuest: (questId: string) => Promise<void>;
  onCreateOrUpdateQuest: (questData: Partial<Quest>) => Promise<void>;
  onDeleteQuest: (questId: string) => Promise<void>;
  onHabitChange: (questId: string, delta: number) => Promise<void>;
}

export type QuestFilterTab = 'all' | QuestType;
export type AttributeFilter = 'all' | QuestAttribute;
