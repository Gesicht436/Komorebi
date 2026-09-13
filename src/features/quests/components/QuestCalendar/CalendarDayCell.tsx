'use client';

import React from 'react';
import { CalendarDayInfo } from '../../lib/calendar-utils';
import { soundEngine } from '@/lib/audio/sound-engine';

interface CalendarDayCellProps {
  day: CalendarDayInfo;
  isSelected: boolean;
  onSelect: (dateStr: string) => void;
}

const WEEKDAY_NARROW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    soundEngine.playClick();
    onSelect(day.dateStr);
  };

  const [year, month, dayNum] = day.dateStr.split('-').map(Number);
  const cellDate = new Date(year, month - 1, dayNum);
  const weekdayLetter = WEEKDAY_NARROW[cellDate.getDay()];

  const totalCount = day.completedCount + day.plannedCount;

  // Exact profile calendar color styling
  let colorClass = 'bg-[#F5EFEB] text-[#A1887F]';
  if (!day.isCurrentMonth) {
    colorClass = 'bg-[#FAF8F5]/40 text-[#D7CCC8] border-transparent opacity-40';
  } else if (day.completedCount >= 3) {
    colorClass = 'bg-[#2E7D32] text-white font-bold shadow-xs';
  } else if (day.completedCount === 2) {
    colorClass = 'bg-[#81C784] text-white font-bold shadow-xs';
  } else if (day.completedCount === 1) {
    colorClass = 'bg-[#C8E6C9] text-[#2E7D32] font-bold';
  } else if (day.plannedCount > 0) {
    // Scheduled / planned future tasks
    colorClass = 'bg-[#FFE082]/70 text-[#B78103] font-bold';
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      title={`${day.dateStr}: ${day.completedCount} completed, ${day.plannedCount} planned`}
      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none border border-transparent ${colorClass} ${
        isSelected
          ? 'ring-2 ring-[#E07A5F] shadow-sm scale-105 z-10'
          : day.isToday
          ? 'ring-2 ring-[#E07A5F]/80'
          : 'hover:scale-105'
      }`}
    >
      <span className="text-[10px] sm:text-[11px] font-bold">{day.dayNumber}</span>
      <span className="text-[8px] uppercase opacity-75 font-semibold tracking-wider">
        {weekdayLetter}
      </span>
      {day.completedCount > 0 && day.completedCount < 3 && (
        <span className="w-1 h-1 rounded-full bg-[#2E7D32] mt-0.5" />
      )}
      {day.plannedCount > 0 && day.completedCount === 0 && (
        <span className="w-1 h-1 rounded-full bg-[#E07A5F] mt-0.5" />
      )}
    </button>
  );
};
