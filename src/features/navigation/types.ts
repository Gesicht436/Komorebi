import { Profile } from '@/types/database';

export interface TopNavProps {
  profile: Profile | null;
  onSignOut: () => void;
  isDemoMode?: boolean;
  onResetDemo?: () => void;
}
