'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Disc, Music } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';

export const TopNavAudioControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isRainActive, setIsRainActive] = useState(soundEngine.getRainState());
  const [isVinylActive, setIsVinylActive] = useState(soundEngine.getVinylState());
  const [isChordsActive, setIsChordsActive] = useState(soundEngine.getLofiChordsState());

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

  return (
    <div className="hidden sm:flex items-center gap-1 bg-white border border-[#EFEBE9] p-1 rounded-xl shadow-xs">
      <button
        onClick={handleToggleRain}
        title={isRainActive ? 'Stop Rain Ambient' : 'Play Lo-Fi Rain'}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
        className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#F5EFEB] transition-all cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
