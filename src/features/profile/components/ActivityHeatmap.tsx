'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { ActivityLog } from '@/types/database';

interface ActivityHeatmapProps {
  activityLogs: ActivityLog[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activityLogs }) => {
  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#8D6E63]" />
          <h2 className="text-xl font-extrabold text-[#3E2723]">30-Day Study Consistency</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8D6E63]">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#F5EFEB]" />
          <div className="w-3 h-3 rounded-sm bg-[#C8E6C9]" />
          <div className="w-3 h-3 rounded-sm bg-[#81C784]" />
          <div className="w-3 h-3 rounded-sm bg-[#2E7D32]" />
          <span>More Active</span>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
        {Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          const dateStr = d.toISOString().split('T')[0];
          const count = activityLogs.filter((l) => l.created_at?.startsWith(dateStr)).length;
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const colorClass =
            count === 0
              ? 'bg-[#F5EFEB] text-[#A1887F]'
              : count === 1
              ? 'bg-[#C8E6C9] text-[#2E7D32]'
              : count === 2
              ? 'bg-[#81C784] text-white font-bold'
              : 'bg-[#2E7D32] text-white font-bold';

          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${count} activity events`}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${colorClass} ${
                isToday ? 'ring-2 ring-[#E07A5F]' : ''
              }`}
            >
              <span className="text-[10px] font-bold">{d.getDate()}</span>
              <span className="text-[8px] uppercase opacity-75">
                {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
