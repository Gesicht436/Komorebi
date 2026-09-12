// ==============================================================================
// KOMOREBI TACTILE AUDIO & PROCEDURAL LO-FI SOUND ENGINE
// Pure Web Audio API - Zero bandwidth, zero network delay, 100% offline capable
// ==============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.4;
  private ambientVolume: number = 0.25;

  // Ambient nodes
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private isRainPlaying: boolean = false;

  private vinylGain: GainNode | null = null;
  private vinylInterval: number | null = null;
  private isVinylPlaying: boolean = false;

  private fireGain: GainNode | null = null;
  private fireNode: AudioNode | null = null;
  private isFirePlaying: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.rainGain) this.rainGain.gain.value = 0;
      if (this.vinylGain) this.vinylGain.gain.value = 0;
      if (this.fireGain) this.fireGain.gain.value = 0;
    } else {
      if (this.rainGain && this.isRainPlaying) this.rainGain.gain.value = this.ambientVolume;
      if (this.vinylGain && this.isVinylPlaying) this.vinylGain.gain.value = this.ambientVolume * 0.5;
      if (this.fireGain && this.isFirePlaying) this.fireGain.gain.value = this.ambientVolume * 0.6;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted) {
      if (this.rainGain && this.isRainPlaying) this.rainGain.gain.value = this.ambientVolume;
      if (this.vinylGain && this.isVinylPlaying) this.vinylGain.gain.value = this.ambientVolume * 0.5;
      if (this.fireGain && this.isFirePlaying) this.fireGain.gain.value = this.ambientVolume * 0.6;
    }
  }

  // Soft tactile button tap
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Japanese wind-chime / Kalimba pentatonic chime for quest completion
  public playQuestComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

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
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // Celebratory Level-Up Fanfare: Lofi harp crescendo + gentle sparkle
  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

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
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  }

  // Wooden / Ceramic Coin Clink
  public playCoinClink() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

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
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  // Procedural Rain Generator (Pink noise + low-pass filter)
  public toggleRain(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

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
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
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
    this.rainGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime + 0.5);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
    return true;
  }

  // Procedural Vinyl Record Crackle
  public toggleVinyl(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isVinylPlaying) {
      if (this.vinylInterval) clearInterval(this.vinylInterval);
      this.isVinylPlaying = false;
      return false;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.value = this.isMuted ? 0 : this.ambientVolume * 0.4;
    this.vinylGain.connect(this.ctx.destination);

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

  // Procedural Lo-Fi Rhodes Piano Chords Generator
  private chordsInterval: number | null = null;
  private isChordsPlaying: boolean = false;
  private chordIndex: number = 0;

  public toggleLofiChords(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isChordsPlaying) {
      if (this.chordsInterval) clearInterval(this.chordsInterval);
      this.isChordsPlaying = false;
      return false;
    }

    // Lush 4-chord Lo-Fi jazz progression: Dm9 -> G13 -> Cmaj9 -> A7b13
    const progressions = [
      [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
      [98.0, 174.61, 246.94, 329.63],          // G13
      [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9
      [110.0, 196.0, 277.18, 349.23],          // A7b13
    ];

    const playChord = (chordNotes: number[]) => {
      if (!this.ctx || this.isMuted || !this.isChordsPlaying) return;
      chordNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        // Warm electric piano tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, now);

        const noteDelay = idx * 0.04; // Gentle strum effect
        const startTime = now + noteDelay;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.ambientVolume * 0.12, startTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.9);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + 3.0);
        overtone.stop(startTime + 3.0);
      });
    };

    this.isChordsPlaying = true;
    playChord(progressions[this.chordIndex]);
    this.chordIndex = (this.chordIndex + 1) % progressions.length;

    this.chordsInterval = window.setInterval(() => {
      playChord(progressions[this.chordIndex]);
      this.chordIndex = (this.chordIndex + 1) % progressions.length;
    }, 3200);

    return true;
  }

  public getRainState(): boolean {
    return this.isRainPlaying;
  }

  public getVinylState(): boolean {
    return this.isVinylPlaying;
  }

  public getLofiChordsState(): boolean {
    return this.isChordsPlaying;
  }
}

export const soundEngine = new SoundEngine();

