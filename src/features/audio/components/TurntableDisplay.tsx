'use client';

import React, { useEffect, useRef, useState } from 'react';
import { soundEngine, RadioStation } from '@/lib/audio/sound-engine';
import { Disc3, Radio } from 'lucide-react';

interface TurntableDisplayProps {
  isPlaying: boolean;
  station: RadioStation;
  onTogglePlay: () => void;
}

export const TurntableDisplay: React.FC<TurntableDisplayProps> = ({
  isPlaying,
  station,
  onTogglePlay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);

  // Station theme styling
  const stationThemes = {
    cafe: {
      label: 'Rainy Cafe Rhodes',
      discColor: '#3E2723',
      labelColor: '#E07A5F',
      accent: '#F4A261',
      genre: 'Chillhop & Warm Piano',
    },
    synth: {
      label: 'Midnight Synthwave',
      discColor: '#261C2C',
      labelColor: '#6C5CE7',
      accent: '#A29BFE',
      genre: 'Dreamy Detuned Pads',
    },
    zen: {
      label: 'Sunlit Zen Garden',
      discColor: '#2C3E50',
      labelColor: '#2ECC71',
      accent: '#81ECEC',
      genre: 'Pentatonic Koto & Chimes',
    },
  };

  const currentTheme = stationThemes[station] || stationThemes.cafe;

  // Real-Time Web Audio Frequency Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      soundEngine.getFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 18;
      const barWidth = 4;
      const gap = 3;
      const totalWidth = barCount * (barWidth + gap);
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        // Sample frequency with subtle fallback gentle rhythm if paused or low
        let val = dataArray[i * 1] || 0;
        if (!isPlaying) {
          val = 4;
        }

        const percent = val / 255;
        const height = Math.max(3, percent * (canvas.height - 4));
        const x = startX + i * (barWidth + gap);
        const y = canvas.height - height;

        // Gradient color for equalizer bar
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, currentTheme.labelColor);
        gradient.addColorStop(1, currentTheme.accent);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      const frameId = requestAnimationFrame(render);
      setAnimationFrameId(frameId);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, station, currentTheme]);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Turntable Wooden Chassis */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-br from-[#EFEBE9] via-[#D7CCC8] to-[#BCAAA4] rounded-3xl p-4 shadow-xl border-4 border-[#A1887F]/40 flex items-center justify-center overflow-hidden">
        {/* Subtle Woodgrain / Brushed Aluminum Texture */}
        <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-black/10 pointer-events-none" />

        {/* Brushed Metallic Platter Base */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#9E9E9E] via-[#E0E0E0] to-[#757575] shadow-inner p-2 flex items-center justify-center">
          {/* Vinyl Disc that rotates when isPlaying */}
          <div
            onClick={onTogglePlay}
            className={`cursor-pointer group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-2xl transition-transform duration-700 flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : 'scale-[0.99]'
            }`}
            style={{
              backgroundColor: '#1E1E1E',
              backgroundImage: `repeating-radial-gradient(circle, #1E1E1E, #1E1E1E 2px, #121212 3px, #121212 4px)`,
              animationDuration: '3.8s',
            }}
          >
            {/* Vinyl Sheen Reflection Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Vinyl Center Label */}
            <div
              className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-md border-2 border-white/40 text-white"
              style={{ backgroundColor: currentTheme.labelColor }}
            >
              <Disc3 className="w-5 h-5 animate-pulse text-white/90" />
              <span className="text-[8px] font-black tracking-widest uppercase mt-0.5">
                Komorebi
              </span>
              <span className="text-[6px] font-medium opacity-80">33 RPM</span>

              {/* Center Spindle Hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#121212] border border-white/60 absolute" />
            </div>
          </div>
        </div>

        {/* Realistic Tonearm with Smooth Swivel Angle */}
        <div
          className="absolute top-3 right-3 pointer-events-none transition-transform duration-1000 ease-out origin-top-right"
          style={{
            transform: isPlaying ? 'rotate(22deg)' : 'rotate(0deg)',
          }}
        >
          {/* Tonearm Base Pivot */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CFD8DC] to-[#78909C] shadow-md border-2 border-[#546E7A] flex items-center justify-center relative">
            <div className="w-3 h-3 rounded-full bg-[#37474F]" />

            {/* Tonearm Metal Shaft */}
            <div
              className="absolute top-4 right-3.5 w-1.5 h-32 sm:h-36 bg-gradient-to-r from-[#ECEFF1] via-[#B0BEC5] to-[#78909C] rounded-full shadow-sm origin-top"
              style={{ transform: 'rotate(-12deg)' }}
            >
              {/* Tonearm Headshell & Needle Cartridge */}
              <div
                className="absolute -bottom-4 -left-1.5 w-4.5 h-7 rounded-xs bg-[#263238] border border-silver shadow-xs"
                style={{ transform: 'rotate(15deg)' }}
              >
                {/* Needle Tip Indicator */}
                <div
                  className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${
                    isPlaying ? 'bg-amber-400 animate-ping' : 'bg-stone-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Speed switch / Power light indicator */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              isPlaying ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-stone-400'
            }`}
          />
          <span className="text-[9px] font-bold text-[#5D4037] uppercase tracking-wider">
            {isPlaying ? 'Playing' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Real-time Frequency Equalizer Visualizer Strip */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <canvas
          ref={canvasRef}
          width={180}
          height={32}
          className="rounded-lg bg-[#3E2723]/5 p-1 backdrop-blur-xs"
        />

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3E2723]">
          <Radio className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
          <span>{currentTheme.label}</span>
          <span className="text-[10px] font-medium text-[#8D6E63]">• {currentTheme.genre}</span>
        </div>
      </div>
    </div>
  );
};
