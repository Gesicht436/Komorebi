export type TimeOfDay = 'morning' | 'day' | 'dusk' | 'night';

export interface AvatarDisplayProps {
  equippedHoodie?: string;
  equippedHeadphones?: string;
  equippedGlasses?: string;
  equippedPet?: string;
  isStudying?: boolean;
  level?: number;
  timeOfDay?: 'auto' | TimeOfDay;
  className?: string;
}

export const HOODIE_COLORS: Record<string, { main: string; shade: string; trim: string }> = {
  knit_sweater: { main: '#D7CCC8', shade: '#BCAAA4', trim: '#8D6E63' },
  matcha_hoodie: { main: '#A5D6A7', shade: '#81C784', trim: '#4CAF50' },
  lavender_hoodie: { main: '#CE93D8', shade: '#BA68C8', trim: '#8E24AA' },
  midnight_jacket: { main: '#283593', shade: '#1A237E', trim: '#FFD54F' },
};
