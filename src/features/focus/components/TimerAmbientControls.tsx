'use client';

import React, { useState } from 'react';
import { CloudRain, Disc, CheckCircle } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';

interface TimerAmbientControlsProps {
  sessionsCompletedToday: number;
}

export const TimerAmbientControls: React.FC<TimerAmbientControlsProps> = ({
  sessionsCompletedToday,
}) => {
  const [isRainActive, setIsRainActive] = useState(soundEngine.getRainState());
  const [isVinylActive, setIsVinylActive] = useState(soundEngine.getVinylState());

  const handleToggleRain = () => {
    soundEngine.playClick();
    setIsRainActive(soundEngine.toggleRain());
  };

  const handleToggleVinyl = () => {
    soundEngine.playClick();
    setIsVinylActive(soundEngine.toggleVinyl());
  };

  return (
    <div className="mt-8 pt-6 border-t border-[#EFEBE9] flex items-center justify-between text-xs text-[#8D6E63]">
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleRain}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            isRainActive
              ? 'bg-[#E1F5FE] text-[#0288D1] border-[#81D4FA]'
              : 'bg-white border-[#EFEBE9] text-[#8D6E63] hover:bg-[#F5EFEB]'
          }`}
          title="Toggle ambient rain sound"
        >
          <CloudRain className="w-4 h-4" />
          <span>Rain</span>
        </button>

        <button
          onClick={handleToggleVinyl}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            isVinylActive
              ? 'bg-[#EDE7F6] text-[#7E57C2] border-[#D1C4E9]'
              : 'bg-white border-[#EFEBE9] text-[#8D6E63] hover:bg-[#F5EFEB]'
          }`}
          title="Toggle vinyl crackle"
        >
          <Disc className={`w-4 h-4 ${isVinylActive ? 'animate-spin' : ''}`} />
          <span>Vinyl</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 font-semibold text-[#5D4037]">
        <CheckCircle className="w-4 h-4 text-[#81B29A]" />
        <span>{sessionsCompletedToday} completed today</span>
      </div>
    </div>
  );
};
