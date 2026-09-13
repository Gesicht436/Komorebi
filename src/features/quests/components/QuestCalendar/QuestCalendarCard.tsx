'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Grid, Activity } from 'lucide-react';
import { Quest, ActivityLog } from '@/types/database';
import { MonthView } from './MonthView';
import { YearlyHeatmap } from './YearlyHeatmap';
import { soundEngine } from '@/lib/audio/sound-engine';

interface QuestCalendarCardProps {
  quests: Quest[];
  activityLogs: ActivityLog[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
}

export type CalendarViewTab = 'month' | 'heatmap';

export const QuestCalendarCard: React.FC<QuestCalendarCardProps> = ({
  quests,
  activityLogs,
  selectedDateStr,
  onSelectDate,
}) => {
  const [activeTab, setActiveTab] = useState<CalendarViewTab>('month');

  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
      {/* Top Header & View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEBE9]">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#8D6E63]" />
          <h2 className="text-xl font-extrabold text-[#3E2723]">
            Quest Calendar & Consistency
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F5EFEB] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('month');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'month'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#8D6E63] hover:text-[#3E2723]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Month Grid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('heatmap');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'heatmap'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#8D6E63] hover:text-[#3E2723]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Yearly Heatmap</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'month' ? (
        <MonthView
          quests={quests}
          activityLogs={activityLogs}
          selectedDateStr={selectedDateStr}
          onSelectDate={onSelectDate}
        />
      ) : (
        <YearlyHeatmap
          quests={quests}
          activityLogs={activityLogs}
          selectedDateStr={selectedDateStr}
          onSelectDate={onSelectDate}
        />
      )}
    </div>
  );
};
