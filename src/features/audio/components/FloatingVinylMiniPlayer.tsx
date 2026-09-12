'use client';

import React, { useState, useEffect } from 'react';
import { Disc3, Play, Pause, Radio, Sliders } from 'lucide-react';
import { soundEngine, RadioStation } from '@/lib/audio/sound-engine';
import { VinylLoungeModal } from './VinylLoungeModal';

export const FloatingVinylMiniPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [station, setStation] = useState<RadioStation>('cafe');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setIsPlaying(soundEngine.isRadioStationPlaying());
      setStation(soundEngine.getCurrentStation());
    };

    updateState();
    const interval = setInterval(updateState, 600);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = soundEngine.toggleRadio(station);
    setIsPlaying(state);
  };

  const stationLabels: Record<RadioStation, { name: string; icon: string }> = {
    cafe: { name: 'Rainy Cafe', icon: '☕' },
    synth: { name: 'Midnight Synth', icon: '🌃' },
    zen: { name: 'Sunlit Zen', icon: '🎋' },
  };

  const current = stationLabels[station] || stationLabels.cafe;

  return (
    <>
      {/* Floating Mini Vinyl Pill */}
      <div className="fixed bottom-5 right-5 z-40 animate-fade-in">
        <div
          onClick={() => {
            soundEngine.playClick();
            setIsModalOpen(true);
          }}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#EFEBE9] shadow-lg hover:shadow-xl text-[#3E2723] hover:border-[#E07A5F] transition-all hover:scale-105 cursor-pointer"
        >
          {/* Spinning Mini Disc */}
          <div
            className={`w-7 h-7 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shadow-xs ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <Disc3 className="w-4 h-4 text-[#E07A5F]" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-[#8D6E63] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Vinyl Lounge
            </span>
            <span className="text-xs font-black text-[#3E2723] leading-none flex items-center gap-1">
              <span>{current.icon}</span>
              <span>{current.name}</span>
            </span>
          </div>

          {/* Quick Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="w-7 h-7 rounded-full bg-[#FBE9E7] hover:bg-[#E07A5F] text-[#E07A5F] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 ml-1"
            title={isPlaying ? 'Pause music' : 'Play lo-fi radio'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Studio Open Indicator */}
          <Sliders className="w-3.5 h-3.5 text-[#8D6E63] group-hover:text-[#E07A5F] transition-colors" />
        </div>
      </div>

      {/* Full Studio Modal */}
      <VinylLoungeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
