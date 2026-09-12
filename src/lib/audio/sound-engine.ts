// ==============================================================================
// KOMOREBI TACTILE AUDIO & PROCEDURAL LO-FI SOUND ENGINE
// Pure Web Audio API - Zero bandwidth, zero network delay, 100% offline capable
// With Master AnalyserNode for Real-Time Equalizer Visualizer & 3 Radio Channels
// ==============================================================================

export type RadioStation = 'cafe' | 'synth' | 'zen';
export type AmbientTrack = 'rain' | 'vinyl' | 'fire' | 'typing';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.4;
  private ambientVolume: number = 0.25;

  // Master bus & Web Audio Analyser for Real-Time Frequency Visualizer
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Ambient nodes
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private isRainPlaying: boolean = false;
  private rainVolume: number = 0.7;

  private vinylGain: GainNode | null = null;
  private vinylInterval: number | null = null;
  private isVinylPlaying: boolean = false;
  private vinylVolume: number = 0.4;

  private fireGain: GainNode | null = null;
  private fireInterval: number | null = null;
  private isFirePlaying: boolean = false;
  private fireVolume: number = 0.5;

  private typingInterval: number | null = null;
  private isTypingPlaying: boolean = false;
  private typingVolume: number = 0.35;

  // Procedural Radio Stations
  private currentStation: RadioStation = 'cafe';
  private isRadioPlaying: boolean = false;
  private radioInterval: number | null = null;
  private chordIndex: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Create Master Bus and AnalyserNode
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 1;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64; // 32 frequency bins
        this.analyser.smoothingTimeConstant = 0.8;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Returns live FFT audio frequency spectrum for visualizers
  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser && this.ctx && this.ctx.state === 'running' && !this.isMuted) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  public getMasterDestination(): AudioNode | null {
    this.initCtx();
    return this.masterGain || this.ctx?.destination || null;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    this.updateAmbientGains();
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  private updateAmbientGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.rainGain && this.isRainPlaying) {
      this.rainGain.gain.setValueAtTime(this.ambientVolume * this.rainVolume, now);
    }
    if (this.vinylGain && this.isVinylPlaying) {
      this.vinylGain.gain.setValueAtTime(this.ambientVolume * this.vinylVolume, now);
    }
    if (this.fireGain && this.isFirePlaying) {
      this.fireGain.gain.setValueAtTime(this.ambientVolume * this.fireVolume, now);
    }
  }

  // Soft tactile button tap
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const dest = this.getMasterDestination();
    if (!dest) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Japanese wind-chime / Kalimba pentatonic chime for quest completion
  public playQuestComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    // Pentatonic notes: E5 (659.25), G#5 (830.61), B5 (987.77), E6 (1318.51)
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      const startTime = this.ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // Celebratory Level-Up Fanfare: Lofi harp crescendo + gentle sparkle
  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    // Major 9th flourish: C5, E5, G5, B5, D6, G6
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

      const startTime = this.ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  }

  // Wooden / Ceramic Coin Clink
  public playCoinClink() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    [1800, 2400].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

      const startTime = this.ctx.currentTime + i * 0.05;
      gain.gain.setValueAtTime(this.sfxVolume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  // ============================================================================
  // BOSS BATTLE COMBAT SFX
  // ============================================================================

  public playCombatHit(isCrit: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;

    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(isCrit ? 60 : 90, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.18);

    subGain.gain.setValueAtTime(this.sfxVolume * (isCrit ? 0.75 : 0.5), now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(now);
    subOsc.stop(now + 0.25);

    // Metallic slash impact
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metalOsc.type = 'triangle';
    metalOsc.frequency.setValueAtTime(isCrit ? 880 : 540, now);
    metalOsc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

    metalGain.gain.setValueAtTime(this.sfxVolume * (isCrit ? 0.45 : 0.25), now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    metalOsc.connect(metalGain);
    metalGain.connect(dest);
    metalOsc.start(now);
    metalOsc.stop(now + 0.16);
  }

  // Grand Boss Defeat Fanfare
  public playBossDefeated() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    // Ascending victory chord: C4, G4, C5, E5, G5, C6
    const chord = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });
  }

  // ============================================================================
  // PROCEDURAL AMBIENT GENERATORS
  // ============================================================================

  // Procedural Rain Generator (Pink noise + low-pass filter)
  public toggleRain(): boolean {
    this.initCtx();
    if (!this.ctx) return false;
    const dest = this.getMasterDestination();
    if (!dest) return false;

    if (this.isRainPlaying) {
      if (this.rainGain) {
        this.rainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      }
      this.isRainPlaying = false;
      return false;
    }

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.153852;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.rainGain.gain.linearRampToValueAtTime(
      this.isMuted ? 0 : this.ambientVolume * this.rainVolume,
      this.ctx.currentTime + 0.5
    );

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(dest);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
    return true;
  }

  // Procedural Vinyl Record Crackle
  public toggleVinyl(): boolean {
    this.initCtx();
    if (!this.ctx) return false;
    const dest = this.getMasterDestination();
    if (!dest) return false;

    if (this.isVinylPlaying) {
      if (this.vinylInterval) clearInterval(this.vinylInterval);
      this.isVinylPlaying = false;
      return false;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.value = this.isMuted ? 0 : this.ambientVolume * this.vinylVolume;
    this.vinylGain.connect(dest);

    this.vinylInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isVinylPlaying || !this.vinylGain) return;
      if (Math.random() > 0.4) {
        const osc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100 + Math.random() * 400, this.ctx.currentTime);

        popGain.gain.setValueAtTime(0.05 * Math.random(), this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);

        osc.connect(popGain);
        popGain.connect(this.vinylGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
      }
    }, 60);

    this.isVinylPlaying = true;
    return true;
  }

  // Procedural Campfire Crackle
  public toggleFire(): boolean {
    this.initCtx();
    if (!this.ctx) return false;
    const dest = this.getMasterDestination();
    if (!dest) return false;

    if (this.isFirePlaying) {
      if (this.fireInterval) clearInterval(this.fireInterval);
      this.isFirePlaying = false;
      return false;
    }

    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.value = this.isMuted ? 0 : this.ambientVolume * this.fireVolume;
    this.fireGain.connect(dest);

    this.fireInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isFirePlaying || !this.fireGain) return;
      if (Math.random() > 0.55) {
        const osc = this.ctx.createOscillator();
        const pop = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(60 + Math.random() * 200, this.ctx.currentTime);

        pop.gain.setValueAtTime(0.06 * Math.random(), this.ctx.currentTime);
        pop.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

        osc.connect(pop);
        pop.connect(this.fireGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      }
    }, 85);

    this.isFirePlaying = true;
    return true;
  }

  // Procedural Mechanical Keyboard Typing Clacks
  public toggleTyping(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isTypingPlaying) {
      if (this.typingInterval) clearInterval(this.typingInterval);
      this.isTypingPlaying = false;
      return false;
    }

    this.isTypingPlaying = true;
    this.typingInterval = window.setInterval(() => {
      if (!this.isTypingPlaying) return;
      if (Math.random() > 0.3) {
        this.playKeyClack();
      }
    }, 180);

    return true;
  }

  public playKeyClack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const dest = this.getMasterDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(this.ambientVolume * this.typingVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // ============================================================================
  // PROCEDURAL LO-FI RADIO STATIONS (3 CHANNELS)
  // ============================================================================

  public setRadioStation(station: RadioStation) {
    this.currentStation = station;
    this.chordIndex = 0;
    if (this.isRadioPlaying) {
      this.stopRadio();
      this.startRadio(station);
    }
  }

  public getCurrentStation(): RadioStation {
    return this.currentStation;
  }

  public isRadioStationPlaying(): boolean {
    return this.isRadioPlaying;
  }

  public toggleRadio(station?: RadioStation): boolean {
    if (station && station !== this.currentStation) {
      this.currentStation = station;
      this.stopRadio();
      return this.startRadio(station);
    }

    if (this.isRadioPlaying) {
      this.stopRadio();
      return false;
    } else {
      return this.startRadio(this.currentStation);
    }
  }

  public startRadio(station: RadioStation = this.currentStation): boolean {
    this.initCtx();
    if (!this.ctx) return false;
    this.currentStation = station;

    if (this.radioInterval) clearInterval(this.radioInterval);
    this.isRadioPlaying = true;

    // Station 1: Cafe - Lush Rhodes Jazz Progressions (Dm9 -> G13 -> Cmaj9 -> A7b13)
    const cafeProgressions = [
      [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
      [98.0, 174.61, 246.94, 329.63], // G13
      [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9
      [110.0, 196.0, 277.18, 349.23], // A7b13
    ];

    // Station 2: Synthwave - Dreamy Analog Detuned Pads (Fmaj7 -> Em7 -> Dm7 -> Am9)
    const synthProgressions = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [110.0, 164.81, 220.0, 261.63, 329.63], // Am9
    ];

    // Station 3: Zen Garden - Pentatonic Koto & Bell Plucks
    const zenProgressions = [
      [146.83, 220.0, 293.66, 369.99], // D-A-D-F#
      [164.81, 246.94, 329.63, 392.0], // E-B-E-G
      [196.0, 293.66, 392.0, 493.88], // G-D-G-B
      [146.83, 220.0, 329.63, 440.0], // D-A-E-A
    ];

    const getProgression = () => {
      switch (this.currentStation) {
        case 'synth':
          return synthProgressions;
        case 'zen':
          return zenProgressions;
        default:
          return cafeProgressions;
      }
    };

    const playChord = (chordNotes: number[]) => {
      if (!this.ctx || this.isMuted || !this.isRadioPlaying) return;
      const dest = this.getMasterDestination();
      if (!dest) return;

      chordNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        if (this.currentStation === 'synth') {
          osc.type = 'sawtooth';
          overtone.type = 'sine';
          osc.detune.setValueAtTime(-6, now);
          overtone.detune.setValueAtTime(6, now);
        } else if (this.currentStation === 'zen') {
          osc.type = 'triangle';
          overtone.type = 'sine';
        } else {
          osc.type = 'sine';
          overtone.type = 'triangle';
        }

        osc.frequency.setValueAtTime(freq, now);
        overtone.frequency.setValueAtTime(freq * (this.currentStation === 'synth' ? 1 : 2), now);

        const noteDelay = idx * (this.currentStation === 'zen' ? 0.08 : 0.035);
        const startTime = now + noteDelay;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.ambientVolume * 0.14, startTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.1);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + 3.2);
        overtone.stop(startTime + 3.2);
      });
    };

    const progs = getProgression();
    playChord(progs[this.chordIndex]);
    this.chordIndex = (this.chordIndex + 1) % progs.length;

    this.radioInterval = window.setInterval(() => {
      const activeProgs = getProgression();
      playChord(activeProgs[this.chordIndex]);
      this.chordIndex = (this.chordIndex + 1) % activeProgs.length;
    }, 3200);

    return true;
  }

  public stopRadio(): void {
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
    this.isRadioPlaying = false;
  }

  // Backward compatibility alias for toggleLofiChords
  public toggleLofiChords(): boolean {
    return this.toggleRadio('cafe');
  }

  public getLofiChordsState(): boolean {
    return this.isRadioPlaying;
  }

  public getRainState(): boolean {
    return this.isRainPlaying;
  }

  public getVinylState(): boolean {
    return this.isVinylPlaying;
  }

  public getFireState(): boolean {
    return this.isFirePlaying;
  }

  public getTypingState(): boolean {
    return this.isTypingPlaying;
  }

  public setTrackVolume(track: AmbientTrack, vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    switch (track) {
      case 'rain':
        this.rainVolume = clamped;
        break;
      case 'vinyl':
        this.vinylVolume = clamped;
        break;
      case 'fire':
        this.fireVolume = clamped;
        break;
      case 'typing':
        this.typingVolume = clamped;
        break;
    }
    this.updateAmbientGains();
  }

  public getTrackVolume(track: AmbientTrack): number {
    switch (track) {
      case 'rain':
        return this.rainVolume;
      case 'vinyl':
        return this.vinylVolume;
      case 'fire':
        return this.fireVolume;
      case 'typing':
        return this.typingVolume;
    }
  }
}

export const soundEngine = new SoundEngine();
