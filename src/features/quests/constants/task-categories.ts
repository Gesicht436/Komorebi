import { QuestAttribute } from '@/types/database';

export interface TaskCategoryPreset {
  id: string;
  name: string;
  attribute: QuestAttribute;
  statLabel: string;
  statCode: string;
  badgeColor: string;
  suggestedTitles: string[];
}

export const TASK_CATEGORY_PRESETS: TaskCategoryPreset[] = [
  {
    id: 'coding',
    name: 'Coding & Dev',
    attribute: 'focus',
    statLabel: 'Intellect',
    statCode: 'INT',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    suggestedTitles: [
      'Implement API endpoints & test cases',
      'Solve 2 algorithm challenges',
      'Refactor state management logic',
      'Review open pull requests',
    ],
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    attribute: 'vitality',
    statLabel: 'Strength',
    statCode: 'STR',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    suggestedTitles: [
      'Hit the gym for 45-min strength training',
      '30-minute cardio & interval run',
      'Drink 2.5L of water & stretch',
      'Complete 50 pushups & core workout',
    ],
  },
  {
    id: 'mindfulness',
    name: 'Meditation & Zen',
    attribute: 'mindfulness',
    statLabel: 'Wisdom',
    statCode: 'WIS',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    suggestedTitles: [
      '15-minute mindfulness breathing session',
      'Write 3 things in gratitude journal',
      'Read 20 pages of inspiring literature',
      'Evening screen-free herbal tea reflection',
    ],
  },
  {
    id: 'creativity',
    name: 'Art & Design',
    attribute: 'creativity',
    statLabel: 'Creativity',
    statCode: 'CRT',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    suggestedTitles: [
      'Sketch character concept illustration',
      'Design high-fidelity UI layout',
      'Compose a 4-chord lo-fi piano progression',
      'Draft 500 words of creative writing',
    ],
  },
  {
    id: 'discipline',
    name: 'Routine & Chores',
    attribute: 'discipline',
    statLabel: 'Willpower',
    statCode: 'WIL',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    suggestedTitles: [
      'Tidy & disinfect study desk space',
      'Reach inbox zero & organize tasks',
      'Prepare healthy meal prep for tomorrow',
      'Execute uninterrupted morning routine',
    ],
  },
  {
    id: 'study',
    name: 'Study & Academics',
    attribute: 'focus',
    statLabel: 'Intellect',
    statCode: 'INT',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    suggestedTitles: [
      'Review lecture flashcards for 30 min',
      'Complete chapter problem set',
      'Annotate research paper methodology',
      'Practice foreign language vocabulary',
    ],
  },
];
