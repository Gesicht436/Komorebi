'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { QuestAttribute, QuestType } from '@/types/database';
import { ATTRIBUTE_CONFIG } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';
import { QuestFilterTab, AttributeFilter } from '../types';

interface QuestFilterBarProps {
  activeTab: QuestFilterTab;
  setActiveTab: (tab: QuestFilterTab) => void;
  selectedAttribute: AttributeFilter;
  setSelectedAttribute: (attr: AttributeFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  questCounts: {
    all: number;
    daily: number;
    habit: number;
    milestone: number;
  };
}

export const QuestFilterBar: React.FC<QuestFilterBarProps> = ({
  activeTab,
  setActiveTab,
  selectedAttribute,
  setSelectedAttribute,
  searchQuery,
  setSearchQuery,
  questCounts,
}) => {
  const tabs: { id: QuestFilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Quests', count: questCounts.all },
    { id: 'daily', label: 'Dailies', count: questCounts.daily },
    { id: 'habit', label: 'Habits (+/-)', count: questCounts.habit },
    { id: 'milestone', label: 'Milestones', count: questCounts.milestone },
  ];

  return (
    <div className="space-y-3">
      {/* Type Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#F5EFEB] rounded-2xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#E07A5F] shadow-xs'
                  : 'text-[#5D4037] hover:text-[#3E2723]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#EFEBE9] text-xs text-[#3E2723] placeholder-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
          />
        </div>
      </div>

      {/* Attribute Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            soundEngine.playClick();
            setSelectedAttribute('all');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedAttribute === 'all'
              ? 'bg-[#3E2723] text-white'
              : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
          }`}
        >
          All Attributes
        </button>

        {(Object.keys(ATTRIBUTE_CONFIG) as QuestAttribute[]).map((attr) => (
          <button
            key={attr}
            onClick={() => {
              soundEngine.playClick();
              setSelectedAttribute(attr);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize cursor-pointer ${
              selectedAttribute === attr
                ? 'bg-[#3E2723] text-white'
                : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
            }`}
          >
            {ATTRIBUTE_CONFIG[attr].label}
          </button>
        ))}
      </div>
    </div>
  );
};
