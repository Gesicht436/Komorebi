'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Quest, QuestAttribute } from '@/types/database';
import { QuestBoardProps, QuestFilterTab, AttributeFilter } from '../types';
import { QuestStatsBanner } from './QuestStatsBanner';
import { QuestFilterBar } from './QuestFilterBar';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { soundEngine } from '@/lib/audio/sound-engine';

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  onCompleteQuest,
  onCreateOrUpdateQuest,
  onDeleteQuest,
  onHabitChange,
}) => {
  const [activeTab, setActiveTab] = useState<QuestFilterTab>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeFilter>('all');
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

  const questCounts = useMemo(() => {
    return {
      all: quests.length,
      daily: quests.filter((q) => q.type === 'daily').length,
      habit: quests.filter((q) => q.type === 'habit').length,
      milestone: quests.filter((q) => q.type === 'milestone').length,
    };
  }, [quests]);

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
      {/* Top Banner & Stats Overview */}
      <QuestStatsBanner
        completedCount={completedCount}
        totalCount={totalCount}
        progressPercent={progressPercent}
        onOpenCreate={handleOpenCreate}
      />

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
            <div className="bg-white border border-[#EFEBE9] rounded-3xl p-10 text-center text-[#8D6E63]">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-bold text-[#3E2723] text-sm">No Quests Found</h3>
              <p className="text-xs mt-1">
                {searchQuery || activeTab !== 'all' || selectedAttribute !== 'all'
                  ? 'Try changing your search query or attribute filters.'
                  : 'Your quest journal is currently empty. Click "New Quest" to begin!'}
              </p>
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
        />
      )}
    </div>
  );
};
