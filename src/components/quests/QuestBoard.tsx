'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { Quest, QuestAttribute, QuestType } from '@/types/database';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { ATTRIBUTE_CONFIG } from '@/lib/game/engine';
import { soundEngine } from '@/lib/audio/sound-engine';

interface QuestBoardProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => Promise<void>;
  onCreateOrUpdateQuest: (questData: Partial<Quest>) => Promise<void>;
  onDeleteQuest: (questId: string) => Promise<void>;
  onHabitChange: (questId: string, delta: number) => Promise<void>;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  onCompleteQuest,
  onCreateOrUpdateQuest,
  onDeleteQuest,
  onHabitChange,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | QuestType>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<'all' | QuestAttribute>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const filteredQuests = useMemo(() => {
    return quests.filter((q) => {
      if (activeTab !== 'all' && q.type !== activeTab) return false;
      if (selectedAttribute !== 'all' && q.attribute !== selectedAttribute) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [quests, activeTab, selectedAttribute, searchQuery]);

  const completedCount = useMemo(() => {
    return quests.filter((q) => q.is_completed).length;
  }, [quests]);

  const totalCount = quests.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleOpenCreate = () => {
    soundEngine.playClick();
    setEditingQuest(null);
    setIsModalOpen(true);
  };

  const handleEditQuest = (quest: Quest) => {
    soundEngine.playClick();
    setEditingQuest(quest);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBE9E7] text-[#E07A5F] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Progression Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
              Active Quests & Habits
            </h1>
            <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
              Complete quests to earn XP, increase life attributes, and collect study coins.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Quest</span>
          </button>
        </div>

        {/* Completion Bar */}
        <div className="mt-5 pt-4 border-t border-[#EFEBE9]">
          <div className="flex items-center justify-between text-xs font-bold text-[#5D4037] mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#81B29A]" />
              Completion Rate
            </span>
            <span>
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F5EFEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#81B29A] to-[#A5D6A7] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Quests' },
            { id: 'daily', label: 'Dailies' },
            { id: 'habit', label: 'Habits' },
            { id: 'milestone', label: 'Milestones' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveTab(tab.id as 'all' | QuestType);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#3E2723] text-white shadow-xs'
                  : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attribute & Search Controls */}
        <div className="flex items-center gap-2">
          {/* Attribute Dropdown */}
          <div className="relative">
            <select
              value={selectedAttribute}
              onChange={(e) => {
                soundEngine.playClick();
                setSelectedAttribute(e.target.value as 'all' | QuestAttribute);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EFEBE9] text-[#5D4037] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#E07A5F] cursor-pointer"
            >
              <option value="all">All Attributes</option>
              {Object.entries(ATTRIBUTE_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EFEBE9] text-[#3E2723] text-xs placeholder:text-[#BCAAA4] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
            />
          </div>
        </div>
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={onCompleteQuest}
              onEdit={handleEditQuest}
              onDelete={onDeleteQuest}
              onHabitChange={onHabitChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/60 border-2 border-dashed border-[#EFEBE9] rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8E1] text-[#F4A261] flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#3E2723]">No quests found</h3>
          <p className="text-xs text-[#8D6E63] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedAttribute !== 'all' || activeTab !== 'all'
              ? 'Try changing your filters or search terms.'
              : 'Your quest journal is clear. Add your first daily quest or habit to start leveling up!'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#D46A4F] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Quest</span>
          </button>
        </div>
      )}

      {/* Quest Creation/Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreateOrUpdateQuest}
        initialQuest={editingQuest}
      />
    </div>
  );
};
