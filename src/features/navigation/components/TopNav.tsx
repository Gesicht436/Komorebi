'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Home,
  CheckSquare,
  Timer,
  ShoppingBag,
  User,
  Menu,
  X,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';
import { useGame } from '@/context/GameContext';
import { TopNavProps } from '../types';
import { TopNavStatusPills } from './TopNavStatusPills';
import { TopNavMobileDrawer } from './TopNavMobileDrawer';

export const TopNav: React.FC<TopNavProps> = ({
  profile,
  onSignOut,
  isDemoMode = false,
  onResetDemo,
}) => {
  const pathname = usePathname();
  const { timerState } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Study Room', icon: Home },
    { href: '/quests', label: 'Quest Board', icon: CheckSquare },
    { href: '/focus', label: 'Pomodoro', icon: Timer },
    { href: '/shop', label: 'Shop & Vouchers', icon: ShoppingBag },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-[#EFEBE9] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/dashboard"
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#E07A5F] rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] flex items-center justify-center text-white shadow-sm shadow-[#E07A5F]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[#3E2723] flex items-center gap-1.5">
              Komorebi
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-[#FBE9E7] text-[#E07A5F]">
                Life RPG
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5EFEB]/60 p-1 rounded-2xl border border-[#EFEBE9]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isFocusLink = link.href === '/focus';
            const isBreakRunning = isFocusLink && timerState.isRunning && timerState.mode !== 'focus';
            const isFocusPaused = isFocusLink && timerState.wasAutoPausedFocus;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundEngine.playClick()}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#E07A5F] shadow-sm'
                    : 'text-[#5D4037] hover:text-[#3E2723] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E07A5F]' : 'text-[#8D6E63]'}`} />
                <span>{link.label}</span>
                {isBreakRunning && (
                  <span className="w-2 h-2 rounded-full bg-[#81B29A] animate-ping ml-0.5" title="Break in progress" />
                )}
                {isFocusPaused && (
                  <span className="w-2 h-2 rounded-full bg-[#E07A5F] ml-0.5" title="Focus session paused" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Badges, Audio Controls & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TopNavStatusPills
            profile={profile}
            onSignOut={onSignOut}
            isDemoMode={isDemoMode}
            onResetDemo={onResetDemo}
          />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#5D4037] hover:bg-[#F5EFEB] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <TopNavMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </header>
  );
};
