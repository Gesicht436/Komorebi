'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Quest, ActivityLog } from '@/types/database';
import { getMonthMatrix, getTodayDateStr } from '../../lib/calendar-utils';
import { CalendarDayCell } from './CalendarDayCell';
import { soundEngine } from '@/lib/audio/sound-engine';

interface MonthViewProps {
  quests: Quest[];
  activityLogs: ActivityLog[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({
  quests,
  activityLogs,
  selectedDateStr,
  onSelectDate,
}) => {
  const todayStr = getTodayDateStr();
  const [todayYear, todayMonth] = todayStr.split('-').map(Number);

  // Default to the month of the selectedDate or today
  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth - 1); // 0-indexed

  const monthMatrix = getMonthMatrix(viewYear, viewMonth, quests, activityLogs);

  const handlePrevMonth = () => {
    soundEngine.playClick();
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    soundEngine.playClick();
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    soundEngine.playClick();
    setViewYear(todayYear);
    setViewMonth(todayMonth - 1);
    onSelectDate(todayStr);
  };

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-3">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#8D6E63]" />
          <h4 className="text-sm sm:text-base font-extrabold text-[#3E2723]">{monthName}</h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleJumpToToday}
            type="button"
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#EFEBE9]/60 border border-[#EFEBE9] transition-all cursor-pointer"
          >
            Today
          </button>

          <button
            onClick={handlePrevMonth}
            type="button"
            aria-label="Previous Month"
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#EFEBE9] border border-[#EFEBE9] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextMonth}
            type="button"
            aria-label="Next Month"
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#EFEBE9] border border-[#EFEBE9] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider py-1 border-b border-[#EFEBE9]">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 7-Column Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {monthMatrix.map((day) => (
          <CalendarDayCell
            key={day.dateStr}
            day={day}
            isSelected={day.dateStr === selectedDateStr}
            onSelect={onSelectDate}
          />
        ))}
      </div>

      {/* Profile-matching Consistency Legend */}
      <div className="flex items-center justify-between gap-2 text-[10px] text-[#8D6E63] pt-2 border-t border-[#EFEBE9] flex-wrap">
        <span>Click any day to view or schedule quests</span>

        <div className="flex items-center gap-1.5 text-[11px] text-[#8D6E63]">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#F5EFEB]" />
          <div className="w-3 h-3 rounded-sm bg-[#C8E6C9]" />
          <div className="w-3 h-3 rounded-sm bg-[#81C784]" />
          <div className="w-3 h-3 rounded-sm bg-[#2E7D32]" />
          <span>More Active</span>
        </div>
      </div>
    </div>
  );
};
