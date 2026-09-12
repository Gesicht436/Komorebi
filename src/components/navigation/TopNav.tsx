'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Coins,
  Volume2,
  VolumeX,
  CloudRain,
  Disc,
  Music,
  Home,
  CheckSquare,
  Timer,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';
import { Profile } from '@/types/database';

interface TopNavProps {
  profile: Profile | null;
  onSignOut: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ profile, onSignOut }) => {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isRainActive, setIsRainActive] = useState(soundEngine.getRainState());
  const [isVinylActive, setIsVinylActive] = useState(soundEngine.getVinylState());
  const [isChordsActive, setIsChordsActive] = useState(soundEngine.getLofiChordsState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleMute = () => {
    soundEngine.playClick();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleRain = () => {
    soundEngine.playClick();
    const active = soundEngine.toggleRain();
    setIsRainActive(active);
  };

  const handleToggleVinyl = () => {
    soundEngine.playClick();
    const active = soundEngine.toggleVinyl();
    setIsVinylActive(active);
  };

  const handleToggleChords = () => {
    soundEngine.playClick();
    const active = soundEngine.toggleLofiChords();
    setIsChordsActive(active);
  };

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
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Pills & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          {profile && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-[#F57F17] text-xs sm:text-sm font-semibold shadow-xs"
              title="Consecutive Days of Progress"
            >
              <Flame className="w-4 h-4 fill-[#F57F17] animate-flame" />
              <span>{profile.streak_count || 0}d</span>
            </div>
          )}

          {/* Coins Badge */}
          {profile && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF3E0] border border-[#FFCC80] text-[#E65100] text-xs sm:text-sm font-semibold shadow-xs"
              title="Study Coins"
            >
              <Coins className="w-4 h-4 fill-[#FFA726]" />
              <span>{profile.coins || 0}</span>
            </div>
          )}

          {/* Procedural Ambient Audio Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white border border-[#EFEBE9] p-1 rounded-xl shadow-xs">
            <button
              onClick={handleToggleRain}
              title={isRainActive ? 'Stop Rain Ambient' : 'Play Lo-Fi Rain'}
              className={`p-1.5 rounded-lg transition-all ${
                isRainActive
                  ? 'bg-[#E1F5FE] text-[#0288D1] ring-1 ring-[#0288D1]'
                  : 'text-[#8D6E63] hover:bg-[#F5EFEB]'
              }`}
            >
              <CloudRain className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleVinyl}
              title={isVinylActive ? 'Stop Vinyl Crackle' : 'Play Lo-Fi Vinyl Crackle'}
              className={`p-1.5 rounded-lg transition-all ${
                isVinylActive
                  ? 'bg-[#EDE7F6] text-[#7E57C2] ring-1 ring-[#7E57C2]'
                  : 'text-[#8D6E63] hover:bg-[#F5EFEB]'
              }`}
            >
              <Disc className={`w-4 h-4 ${isVinylActive ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleToggleChords}
              title={isChordsActive ? 'Stop Lo-Fi Beats' : 'Play Lo-Fi Rhodes Piano Beats'}
              className={`p-1.5 rounded-lg transition-all ${
                isChordsActive
                  ? 'bg-[#FFF3E0] text-[#E65100] ring-1 ring-[#E65100]'
                  : 'text-[#8D6E63] hover:bg-[#F5EFEB]'
              }`}
            >
              <Music className={`w-4 h-4 ${isChordsActive ? 'animate-bounce' : ''}`} />
            </button>
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#F5EFEB] transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSignOut();
            }}
            title="Sign Out"
            className="p-2 rounded-xl text-[#8D6E63] hover:text-[#D32F2F] hover:bg-[#FFEBEE] transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#5D4037] hover:bg-[#F5EFEB]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#EFEBE9] flex flex-col gap-2 pb-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  soundEngine.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-[#FBE9E7] text-[#E07A5F]' : 'text-[#5D4037] hover:bg-[#F5EFEB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          {/* Mobile Ambient Audio Toggles */}
          <div className="flex items-center justify-around pt-2 border-t border-[#EFEBE9]">
            <button
              onClick={handleToggleRain}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                isRainActive ? 'bg-[#E1F5FE] text-[#0288D1]' : 'text-[#8D6E63]'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Rain</span>
            </button>
            <button
              onClick={handleToggleVinyl}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                isVinylActive ? 'bg-[#EDE7F6] text-[#7E57C2]' : 'text-[#8D6E63]'
              }`}
            >
              <Disc className="w-4 h-4" />
              <span>Vinyl</span>
            </button>
            <button
              onClick={handleToggleChords}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                isChordsActive ? 'bg-[#FFF3E0] text-[#E65100]' : 'text-[#8D6E63]'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Beats</span>
            </button>
            <button
              onClick={handleToggleMute}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-[#8D6E63]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Audio'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
