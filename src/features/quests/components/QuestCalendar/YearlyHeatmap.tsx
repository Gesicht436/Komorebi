'use client';

import React, { useState, useMemo } from 'react';
import { Quest, ActivityLog } from '@/types/database';
import { getYearlyHeatmapWeeks, formatDateDisplay } from '../../lib/calendar-utils';
import { soundEngine } from '@/lib/audio/sound-engine';

interface YearlyHeatmapProps {
  quests: Quest[];
  activityLogs: ActivityLog[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
}

// Exactly matches profile ActivityHeatmap palette
const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#F5EFEB] border-[#EFEBE9]',
  1: 'bg-[#C8E6C9] border-[#A5D6A7]',
  2: 'bg-[#81C784] border-[#66BB6A]',
  3: 'bg-[#4CAF50] border-[#388E3C]',
  4: 'bg-[#2E7D32] border-[#1B5E20]',
};

export const YearlyHeatmap: React.FC<YearlyHeatmapProps> = ({
  quests,
  activityLogs,
  selectedDateStr,
  onSelectDate,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    count: number;
    score: number;
    x: number;
    y: number;
  } | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    return getYearlyHeatmapWeeks(quests, activityLogs);
  }, [quests, activityLogs]);

  // Total completed in the last year
  const totalCompletedLastYear = useMemo(() => {
    let count = 0;
    for (const w of weeks) {
      for (const d of w.days) {
        if (d) count += d.count;
      }
    }
    return count;
  }, [weeks]);

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#3E2723]">
            Yearly Study Consistency & Heatmap
          </h4>
          <p className="text-[11px] text-[#8D6E63]">
            {totalCompletedLastYear} quests conquered across 52 weeks
          </p>
        </div>
      </div>

      {/* Horizontal Scrollable Heatmap Canvas */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[680px] p-2.5 bg-white border border-[#EFEBE9] rounded-2xl">
          {/* Month Labels on Top */}
          <div className="flex text-[9px] font-bold text-[#8D6E63] pl-6 mb-1 relative h-4">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                className="absolute"
                style={{ left: `${m.weekIndex * 13 + 24}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Weekday Row Labels */}
            <div className="flex flex-col justify-between text-[9px] font-semibold text-[#8D6E63] pr-1.5 h-[98px] select-none">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>

            {/* Heatmap 52-Week Grid */}
            <div className="flex gap-1 relative">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.days.map((day, dIdx) => {
                    if (!day) {
                      return <div key={dIdx} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />;
                    }

                    const isSelected = day.dateStr === selectedDateStr;

                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          onSelectDate(day.dateStr);
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({
                            dateStr: day.dateStr,
                            count: day.count,
                            score: day.score,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        aria-label={`${day.count} quests on ${day.dateStr}`}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border transition-all cursor-pointer ${
                          LEVEL_COLORS[day.level]
                        } ${
                          isSelected
                            ? 'ring-2 ring-[#E07A5F] scale-125 z-10'
                            : 'hover:scale-125 hover:z-10'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="z-50 pointer-events-none px-2.5 py-1 rounded-lg bg-[#3E2723] text-white text-[10px] font-bold shadow-md whitespace-nowrap"
        >
          <div>{formatDateDisplay(hoveredDay.dateStr)}</div>
          <div className="text-[#FFE082] font-semibold">
            {hoveredDay.count} {hoveredDay.count === 1 ? 'quest' : 'quests'} completed
            {hoveredDay.score > 0 ? ` • ${hoveredDay.score} pts` : ''}
          </div>
        </div>
      )}

      {/* Legend matching Profile */}
      <div className="flex items-center justify-between gap-2 text-[10px] text-[#8D6E63] px-1 flex-wrap">
        <span>Click any day to inspect that day's quests below</span>

        <div className="flex items-center gap-1.5 text-[11px] text-[#8D6E63]">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#F5EFEB] border border-[#EFEBE9]" />
          <div className="w-3 h-3 rounded-sm bg-[#C8E6C9] border-[#A5D6A7]" />
          <div className="w-3 h-3 rounded-sm bg-[#81C784] border-[#66BB6A]" />
          <div className="w-3 h-3 rounded-sm bg-[#4CAF50] border-[#388E3C]" />
          <div className="w-3 h-3 rounded-sm bg-[#2E7D32] border-[#1B5E20]" />
          <span>More Active</span>
        </div>
      </div>
    </div>
  );
};
