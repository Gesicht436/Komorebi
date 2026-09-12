'use client';

import React from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import { TopNav } from '@/components/navigation/TopNav';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { profile, isLoading, signOut, isDemoMode, resetDemoData } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E07A5F] animate-pulse mb-4 flex items-center justify-center text-white font-black text-xl">
          木
        </div>
        <div className="text-sm font-bold text-[#3E2723]">Brewing Tea & Loading Study Room...</div>
        <div className="text-xs text-[#8D6E63] mt-1">Connecting to Komorebi cloud ledger</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#3E2723] flex flex-col">
      <TopNav
        profile={profile}
        onSignOut={signOut}
        isDemoMode={isDemoMode}
        onResetDemo={resetDemoData}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <DashboardShell>{children}</DashboardShell>
    </GameProvider>
  );
}
