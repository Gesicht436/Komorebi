'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Radio,
  CloudRain,
  Disc3,
  Flame,
  Keyboard,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';
import { soundEngine, RadioStation, AmbientTrack } from '@/lib/audio/sound-engine';
import { TurntableDisplay } from './TurntableDisplay';

interface VinylLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VinylLoungeModal: React.FC<VinylLoungeModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isRadioStationPlaying());
  const [currentStation, setCurrentStation] = useState<RadioStation>(
    soundEngine.getCurrentStation()
  );
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [masterVolume, setMasterVolume] = useState(soundEngine.getAmbientVolume());

  // Ambient tracks state
  const [ambientTracks, setAmbientTracks] = useState<{
    rain: boolean;
    vinyl: boolean;
    fire: boolean;
    typing: boolean;
  }>({
    rain: soundEngine.getRainState(),
    vinyl: soundEngine.getVinylState(),
    fire: soundEngine.getFireState(),
    typing: soundEngine.getTypingState(),
  });

  const [trackVolumes, setTrackVolumes] = useState<{
    rain: number;
    vinyl: number;
    fire: number;
    typing: number;
  }>({
    rain: soundEngine.getTrackVolume('rain'),
    vinyl: soundEngine.getTrackVolume('vinyl'),
    fire: soundEngine.getTrackVolume('fire'),
    typing: soundEngine.getTrackVolume('typing'),
  });

  useEffect(() => {
    setIsPlaying(soundEngine.isRadioStationPlaying());
    setCurrentStation(soundEngine.getCurrentStation());
    setIsMuted(soundEngine.getMuted());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    const nextState = soundEngine.toggleRadio(currentStation);
    setIsPlaying(nextState);
  };

  const handleSelectStation = (station: RadioStation) => {
    setCurrentStation(station);
    soundEngine.setRadioStation(station);
    if (!isPlaying) {
      soundEngine.startRadio(station);
      setIsPlaying(true);
    }
  };

  const handleToggleTrack = (track: AmbientTrack) => {
    soundEngine.playClick();
    let nextState = false;
    switch (track) {
      case 'rain':
        nextState = soundEngine.toggleRain();
        break;
      case 'vinyl':
        nextState = soundEngine.toggleVinyl();
        break;
      case 'fire':
        nextState = soundEngine.toggleFire();
        break;
      case 'typing':
        nextState = soundEngine.toggleTyping();
        break;
    }
    setAmbientTracks((prev) => ({ ...prev, [track]: nextState }));
  };

  const handleVolumeChange = (track: AmbientTrack, val: number) => {
    soundEngine.setTrackVolume(track, val);
    setTrackVolumes((prev) => ({ ...prev, [track]: val }));
  };

  const handleMasterVolume = (val: number) => {
    soundEngine.setAmbientVolume(val);
    setMasterVolume(val);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Preset Configurations
  const applyPreset = (preset: 'cafe' | 'midnight' | 'zen') => {
    soundEngine.playClick();
    if (preset === 'cafe') {
      handleSelectStation('cafe');
      if (!ambientTracks.rain) soundEngine.toggleRain();
      if (!ambientTracks.vinyl) soundEngine.toggleVinyl();
      if (ambientTracks.fire) soundEngine.toggleFire();
      if (ambientTracks.typing) soundEngine.toggleTyping();
      setAmbientTracks({ rain: true, vinyl: true, fire: false, typing: false });
    } else if (preset === 'midnight') {
      handleSelectStation('synth');
      if (ambientTracks.rain) soundEngine.toggleRain();
      if (!ambientTracks.vinyl) soundEngine.toggleVinyl();
      if (!ambientTracks.typing) soundEngine.toggleTyping();
      if (ambientTracks.fire) soundEngine.toggleFire();
      setAmbientTracks({ rain: false, vinyl: true, fire: false, typing: true });
    } else if (preset === 'zen') {
      handleSelectStation('zen');
      if (ambientTracks.rain) soundEngine.toggleRain();
      if (ambientTracks.vinyl) soundEngine.toggleVinyl();
      if (!ambientTracks.fire) soundEngine.toggleFire();
      if (ambientTracks.typing) soundEngine.toggleTyping();
      setAmbientTracks({ rain: false, vinyl: false, fire: true, typing: false });
    }
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFBF5] border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#FFE082]/30 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FBE9E7] text-[#E07A5F] flex items-center justify-center shadow-xs">
              <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#3E2723]">
                Komorebi Vinyl Lounge
              </h2>
              <p className="text-xs text-[#8D6E63]">
                Procedural Lo-Fi radio stations & ambient soundscape mixer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[#EFEBE9] flex items-center justify-center text-[#8D6E63] hover:text-[#3E2723] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Turntable & Live Audio Spectrum */}
        <div className="py-2">
          <TurntableDisplay
            isPlaying={isPlaying}
            station={currentStation}
            onTogglePlay={handleTogglePlay}
          />
        </div>

        {/* Master Playback Controls */}
        <div className="flex items-center justify-center gap-4 my-5">
          <button
            onClick={handleTogglePlay}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-sm font-extrabold shadow-md shadow-[#E07A5F]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Turntable' : 'Spin Vinyl Record'}</span>
          </button>

          <button
            onClick={handleToggleMute}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Station Selectors (3 Channels) */}
        <div className="space-y-2 mb-6">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D6E63] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Procedural Lo-Fi Radio Channels</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'cafe',
                title: 'Rainy Cafe',
                desc: 'Warm Rhodes Jazz',
                icon: '☕',
                badge: 'Rhodes Chords',
              },
              {
                id: 'synth',
                title: 'Midnight Solitude',
                desc: 'Analog Synthwave',
                icon: '🌃',
                badge: 'Dreamy Pads',
              },
              {
                id: 'zen',
                title: 'Sunlit Zen',
                desc: 'Koto & Chimes',
                icon: '🎋',
                badge: 'Pentatonic',
              },
            ].map((st) => {
              const active = currentStation === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st.id as RadioStation)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    active
                      ? 'bg-white border-[#E07A5F] shadow-sm ring-2 ring-[#E07A5F]/20'
                      : 'bg-white/60 border-[#EFEBE9] hover:bg-white text-[#8D6E63]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{st.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-[#FBE9E7] text-[#E07A5F]' : 'bg-[#EFEBE9] text-[#8D6E63]'
                      }`}
                    >
                      {st.badge}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-[#3E2723]">{st.title}</div>
                  <div className="text-[10px] text-[#8D6E63]">{st.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambient Soundscape Multi-Track Mixer */}
        <div className="space-y-3 mb-6 bg-white/80 border border-[#EFEBE9] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D6E63]">
              Ambient Layer Mixer
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8D6E63]">
              <span>Master Ambience</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                className="w-20 accent-[#E07A5F] cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'rain' as AmbientTrack,
                name: 'Rainfall',
                icon: CloudRain,
                active: ambientTracks.rain,
                color: 'text-sky-600',
              },
              {
                id: 'vinyl' as AmbientTrack,
                name: 'Vinyl Dust Crackle',
                icon: Disc3,
                active: ambientTracks.vinyl,
                color: 'text-amber-700',
              },
              {
                id: 'fire' as AmbientTrack,
                name: 'Cozy Hearth Fire',
                icon: Flame,
                active: ambientTracks.fire,
                color: 'text-orange-600',
              },
              {
                id: 'typing' as AmbientTrack,
                name: 'Mechanical Keystrokes',
                icon: Keyboard,
                active: ambientTracks.typing,
                color: 'text-stone-700',
              },
            ].map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    track.active
                      ? 'bg-[#FFFBF5] border-[#E07A5F]/40 shadow-xs'
                      : 'bg-white/40 border-[#EFEBE9]'
                  }`}
                >
                  <button
                    onClick={() => handleToggleTrack(track.id)}
                    className="flex items-center gap-2 text-left cursor-pointer grow"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        track.active ? 'bg-white shadow-xs ' + track.color : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#3E2723]">{track.name}</div>
                      <div className="text-[10px] text-[#8D6E63]">
                        {track.active ? 'Layer Active' : 'Off'}
                      </div>
                    </div>
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={trackVolumes[track.id]}
                    onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                    disabled={!track.active}
                    className="w-16 accent-[#E07A5F] cursor-pointer disabled:opacity-30"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Mood Presets */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[#EFEBE9]">
          <span className="text-[11px] font-bold text-[#8D6E63] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F4A261]" />
            Quick Study Moods:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset('cafe')}
              className="px-3 py-1 rounded-xl bg-white border border-[#EFEBE9] hover:bg-[#FBE9E7] text-[#5D4037] text-[11px] font-bold transition-all cursor-pointer"
            >
              ☕ Rainy Cafe
            </button>
            <button
              onClick={() => applyPreset('midnight')}
              className="px-3 py-1 rounded-xl bg-white border border-[#EFEBE9] hover:bg-[#EDE7F6] text-[#5D4037] text-[11px] font-bold transition-all cursor-pointer"
            >
              🌃 Midnight Code
            </button>
            <button
              onClick={() => applyPreset('zen')}
              className="px-3 py-1 rounded-xl bg-white border border-[#EFEBE9] hover:bg-[#E8F5E9] text-[#5D4037] text-[11px] font-bold transition-all cursor-pointer"
            >
              🎋 Zen Sanctuary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
