'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, Plus, Sparkles, CheckCircle2, History } from 'lucide-react';
import { Quest } from '@/types/database';
import { QuestBoardProps, QuestFilterTab, AttributeFilter } from '../types';
import { QuestStatsBanner } from './QuestStatsBanner';
import { QuestFilterBar } from './QuestFilterBar';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { QuestCalendarCard } from './QuestCalendar/QuestCalendarCard';
import { getTodayDateStr, formatDateDisplay, getQuestsForDate } from '../lib/calendar-utils';
import { soundEngine } from '@/lib/audio/sound-engine';

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  activityLogs = [],
  onCompleteQuest,
  onCreateOrUpdateQuest,
  onDeleteQuest,
  onHabitChange,
}) => {
  const todayStr = getTodayDateStr();
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<QuestFilterTab>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [modalDefaultDueDate, setModalDefaultDueDate] = useState<string | null>(null);

  const isViewingToday = selectedDateStr === todayStr;
  const isViewingFuture = selectedDateStr > todayStr;
  const isViewingPast = selectedDateStr < todayStr;

  // 1. Filter quests for the selected calendar date
  const dateQuests = useMemo(() => {
    return getQuestsForDate(quests, activityLogs, selectedDateStr);
  }, [quests, activityLogs, selectedDateStr]);

  // 2. Filter by tab, attribute, and search query
  const filteredQuests = useMemo(() => {
    return dateQuests.filter((q) => {
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
  }, [dateQuests, activeTab, selectedAttribute, searchQuery]);

  const completedCount = useMemo(() => {
    return quests.filter((q) => q.is_completed).length;
  }, [quests]);

  const totalCount = quests.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const questCounts = useMemo(() => {
    return {
      all: dateQuests.length,
      daily: dateQuests.filter((q) => q.type === 'daily').length,
      habit: dateQuests.filter((q) => q.type === 'habit').length,
      milestone: dateQuests.filter((q) => q.type === 'milestone').length,
    };
  }, [dateQuests]);

  const handleOpenCreate = (prefillDueDate?: string) => {
    soundEngine.playClick();
    setEditingQuest(null);
    setModalDefaultDueDate(prefillDueDate || (isViewingFuture ? selectedDateStr : null));
    setIsModalOpen(true);
  };

  const handleEditQuest = (quest: Quest) => {
    soundEngine.playClick();
    setEditingQuest(quest);
    setModalDefaultDueDate(quest.due_date || null);
    setIsModalOpen(true);
  };

  const handleReturnToToday = () => {
    soundEngine.playClick();
    setSelectedDateStr(todayStr);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <QuestStatsBanner
        completedCount={completedCount}
        totalCount={totalCount}
        progressPercent={progressPercent}
        onOpenCreate={() => handleOpenCreate()}
      />

      {/* Quest Calendar Card (Month View & GitHub-Style Heatmap) */}
      <QuestCalendarCard
        quests={quests}
        activityLogs={activityLogs}
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
      />

      {/* Date Context Section Header */}
      <div className="bg-[#FFFBF5] border border-[#EFEBE9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
              isViewingToday
                ? 'bg-[#E07A5F] text-white'
                : isViewingFuture
                ? 'bg-[#FFE082] text-[#B78103]'
                : 'bg-[#EFEBE9] text-[#6D4C41]'
            }`}
          >
            {isViewingToday ? (
              <Calendar className="w-5 h-5" />
            ) : isViewingFuture ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <History className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#3E2723]">
                {isViewingToday
                  ? "Today's Focus Quests"
                  : isViewingFuture
                  ? `Planned Quests for ${formatDateDisplay(selectedDateStr).split(',')[1]}`
                  : `Historical Chronicle: ${formatDateDisplay(selectedDateStr).split(',')[1]}`}
              </h3>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isViewingToday
                    ? 'bg-[#FBE9E7] text-[#E07A5F]'
                    : isViewingFuture
                    ? 'bg-[#FFF8E1] text-[#B78103]'
                    : 'bg-[#EFEBE9] text-[#6D4C41]'
                }`}
              >
                {isViewingToday ? 'Today' : isViewingFuture ? 'Future Planned' : 'Past Archive'}
              </span>
            </div>

            <p className="text-xs text-[#8D6E63] mt-0.5">
              {formatDateDisplay(selectedDateStr)} • {dateQuests.length}{' '}
              {dateQuests.length === 1 ? 'quest' : 'quests'}
            </p>
          </div>
        </div>

        {/* Quick Date Actions */}
        <div className="flex items-center gap-2">
          {!isViewingToday && (
            <button
              type="button"
              onClick={handleReturnToToday}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#EFEBE9] text-xs font-bold text-[#5D4037] transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Today</span>
            </button>
          )}

          {!isViewingPast && (
            <button
              type="button"
              onClick={() => handleOpenCreate(selectedDateStr)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isViewingToday ? 'Add Quest' : 'Schedule for this Day'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <QuestFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAttribute={selectedAttribute}
        setSelectedAttribute={setSelectedAttribute}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        questCounts={questCounts}
      />

      {/* Quests List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={onCompleteQuest}
                onEdit={handleEditQuest}
                onDelete={onDeleteQuest}
                onHabitChange={onHabitChange}
              />
            ))
          ) : (
            <div className="bg-white border border-[#EFEBE9] rounded-3xl p-10 text-center text-[#8D6E63] space-y-3">
              <div className="text-3xl">
                {isViewingPast ? '📜' : isViewingFuture ? '🗓️' : '🌱'}
              </div>
              <div>
                <h4 className="font-bold text-[#3E2723] text-sm">
                  {isViewingPast
                    ? 'No Quests Completed on this Day'
                    : isViewingFuture
                    ? 'No Quests Scheduled for this Date'
                    : 'All Focus Quests Cleared!'}
                </h4>
                <p className="text-xs mt-1 text-[#8D6E63] max-w-md mx-auto">
                  {isViewingPast
                    ? `No tasks or habit ticks were recorded on ${formatDateDisplay(selectedDateStr)}.`
                    : isViewingFuture
                    ? `Plan ahead and stay organized by adding a milestone or task for ${formatDateDisplay(selectedDateStr)}.`
                    : "You've conquered your active tasks for today. Take a break or add a new quest."}
                </p>
              </div>

              {!isViewingPast && (
                <button
                  type="button"
                  onClick={() => handleOpenCreate(selectedDateStr)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isViewingToday ? 'Add New Quest' : 'Schedule a Quest for this Date'}</span>
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quest Create / Edit Modal */}
      {isModalOpen && (
        <QuestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onCreateOrUpdateQuest}
          initialQuest={editingQuest}
          defaultDueDate={modalDefaultDueDate}
        />
      )}
    </div>
  );
};
