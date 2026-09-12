import { Profile, ActivityLog } from '@/types/database';

export interface ProfileViewProps {
  profile: Profile;
  activityLogs: ActivityLog[];
  onUpdateDisplayName: (name: string) => Promise<void>;
}
