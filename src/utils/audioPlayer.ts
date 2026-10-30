/**
 * Real Kinyarwanda Audio Player and TTS Integration
 * Connects to server-side Gemini 3.8 TTS for authentic, fluent Rwandan speech
 * with intelligent client-side phonetic fallback and audio waveform state.
 */

export type KinyarwandaSpeaker = 'keza' | 'mugisha';
export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

export interface AudioPlayerListener {
  onStateChange: (state: AudioPlaybackState) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onError: (errorMsg: string) => void;
}

// In-memory cache for synthesized audio to prevent duplicate API roundtrips
const audioCache = new Map<string, string>();

class KinyarwandaAudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentText: string = '';
  private currentSpeaker: KinyarwandaSpeaker = 'keza';
  private currentSpeed: number = 1.0;
  private activeIdentifier: string | null = null;
  private state: AudioPlaybackState = 'idle';
  private listeners: Set<AudioPlayerListener> = new Set();
  private isSpeechSynthesisActive: boolean = false;
  private fallbackTimer: any = null;

  public subscribe(listener: AudioPlayerListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyState(newState: AudioPlaybackState) {
    this.state = newState;
    this.listeners.forEach((l) => l.onStateChange(newState));
  }

  private notifyTime(current: number, duration: number) {
    this.listeners.forEach((l) => l.onTimeUpdate(current, duration));
  }

  private notifyError(err: string) {
    this.listeners.forEach((l) => l.onError(err));
  }

  public getState(): AudioPlaybackState {
    return this.state;
  }

  public getActiveIdentifier(): string | null {
    return this.activeIdentifier;
  }

  public getSpeaker(): KinyarwandaSpeaker {
    return this.currentSpeaker;
  }

  public setSpeaker(speaker: KinyarwandaSpeaker) {
    this.currentSpeaker = speaker;
    if (this.state === 'playing' && this.currentText && this.activeIdentifier) {
      // Re-trigger with new speaker voice
      const id = this.activeIdentifier;
      const text = this.currentText;
      this.stop();
      this.play(text, id);
    }
  }

  public getSpeed(): number {
    return this.currentSpeed;
  }

  public setSpeed(speed: number) {
    this.currentSpeed = speed;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }

  /**
   * Phonetically normalize abbreviations and agricultural terms for natural Kinyarwanda speech
   */
  public normalizeKinyarwandaPhonetics(text: string): string {
    return text
      .replace(/\bHa\b/g, 'hegitari')
      .replace(/\bha\b/g, 'hegitari')
      .replace(/\bkg\b/g, 'ibiro')
      .replace(/\bRWF\b/g, 'amafaranga y\'u Rwanda')
      .replace(/\brwf\b/g, 'amafaranga')
      .replace(/\bDAP\b/g, 'di-ape')
      .replace(/\bNPK\b/g, 'ene-pe-ka')
      .replace(/\bPPE\b/g, 'ibikoresho byo kwirinda')
      .replace(/\bPHI\b/g, 'iminsi yo gutegereza gusarura')
      .replace(/\bRAB\b/g, 'ikigo gishinzwe iterambere ry\'ubuhinzi RAB')
      .replace(/\bPAN 53\b/g, 'pani mirongo itanu na bitatu')
      .replace(/\bMINICOM\b/g, 'minisiteri y\'ubucuruzi')
      .replace(/\b75cm\b/g, 'santimetero mirongo irindwi na gatanu')
      .replace(/\b25cm\b/g, 'santimetero mirongo ibiri na gatanu')
      .replace(/\b100kg\b/g, 'ibiro ijana')
      .replace(/\b53,000\b/g, 'ibihumbi mirongo itanu na bitatu');
  }

  /**
   * Play audio for a given text and identifier (e.g. lesson ID or weather day)
   */
  public async play(rawText: string, identifier: string): Promise<void> {
    // If already playing this exact item, toggle pause
    if (this.activeIdentifier === identifier && this.state === 'playing') {
      this.pause();
      return;
    }

    // If paused on this exact item, resume
    if (this.activeIdentifier === identifier && this.state === 'paused' && this.currentAudio) {
      this.currentAudio.play();
      this.notifyState('playing');
      return;
    }

    // Stop whatever was playing previously
    this.stop();

    this.activeIdentifier = identifier;
    this.currentText = rawText;
    const normalizedText = this.normalizeKinyarwandaPhonetics(rawText);
    const cacheKey = `${this.currentSpeaker}_${this.currentSpeed}_${normalizedText}`;

    this.notifyState('loading');

    // 1. Check in-memory cache
    if (audioCache.has(cacheKey)) {
      const cachedBase64 = audioCache.get(cacheKey)!;
      this.playBase64Wav(cachedBase64);
      return;
    }

    // 2. Attempt high-fidelity server TTS via Gemini 3.8 Flash Lite TTS
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: normalizedText,
          speaker: this.currentSpeaker,
          speed: this.currentSpeed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          audioCache.set(cacheKey, data.audioBase64);
          this.playBase64Wav(data.audioBase64);
          return;
        }
      }
    } catch {
      // Server TTS call failed or offline; continue to fallback
    }

    // 3. Fallback: High-clarity native speech synthesizer with African phonetics
    this.playSpeechSynthesisFallback(normalizedText);
  }

  private playBase64Wav(base64: string) {
    try {
      const audioUrl = `data:audio/wav;base64,${base64}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      audio.playbackRate = this.currentSpeed;

      audio.onloadedmetadata = () => {
        this.notifyTime(0, audio.duration || 60);
      };

      audio.ontimeupdate = () => {
        this.notifyTime(audio.currentTime, audio.duration || 60);
      };

      audio.onended = () => {
        this.notifyState('idle');
        this.activeIdentifier = null;
      };

      audio.onerror = () => {
        // If WAV decoding fails in browser, fallback
        if (this.currentText) {
          this.playSpeechSynthesisFallback(this.normalizeKinyarwandaPhonetics(this.currentText));
        } else {
          this.notifyState('idle');
        }
      };

      audio.play().then(() => {
        this.notifyState('playing');
      }).catch(() => {
        if (this.currentText) {
          this.playSpeechSynthesisFallback(this.normalizeKinyarwandaPhonetics(this.currentText));
        }
      });
    } catch (e: any) {
      this.notifyError('Audio playback initialization failed.');
      this.notifyState('idle');
    }
  }

  private playSpeechSynthesisFallback(text: string) {
    if (!('speechSynthesis' in window)) {
      this.notifyError('Audio synthesis is not supported on this browser.');
      this.notifyState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Keza is slightly higher pitch and gentle; Mugisha is lower pitch and grounded
    utterance.pitch = this.currentSpeaker === 'keza' ? 1.05 : 0.92;
    utterance.rate = this.currentSpeed * 0.9; // Slightly slower for clear phonetic articulation

    const voices = window.speechSynthesis.getVoices();
    // Prioritize African accents or French/Swahili acoustic sets for Bantu phonetics
    const matchingVoice =
      voices.find((v) => v.lang.startsWith('rw')) ||
      voices.find((v) => v.lang.startsWith('sw')) ||
      voices.find((v) => v.lang.includes('KE') || v.lang.includes('TZ') || v.lang.includes('ZA')) ||
      voices.find((v) => v.lang.startsWith('fr')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    let fakeCurrentTime = 0;
    const estimatedDuration = Math.max(10, Math.round(text.split(' ').length * 0.45));

    utterance.onstart = () => {
      this.isSpeechSynthesisActive = true;
      this.notifyState('playing');

      // Emulate time updates for visual timer
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = setInterval(() => {
        fakeCurrentTime += 1;
        this.notifyTime(fakeCurrentTime, estimatedDuration);
        if (fakeCurrentTime >= estimatedDuration) {
          clearInterval(this.fallbackTimer);
        }
      }, 1000);
    };

    utterance.onend = () => {
      this.isSpeechSynthesisActive = false;
      clearInterval(this.fallbackTimer);
      this.notifyState('idle');
      this.activeIdentifier = null;
    };

    utterance.onerror = () => {
      this.isSpeechSynthesisActive = false;
      clearInterval(this.fallbackTimer);
      this.notifyState('idle');
      this.activeIdentifier = null;
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.notifyState('paused');
    } else if (this.isSpeechSynthesisActive && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.notifyState('paused');
    }
  }

  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
      this.notifyState('playing');
    } else if (this.isSpeechSynthesisActive && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.notifyState('playing');
    }
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(this.fallbackTimer);
    this.isSpeechSynthesisActive = false;
    this.activeIdentifier = null;
    this.notifyState('idle');
    this.notifyTime(0, 0);
  }
}

export const KinyarwandaAudio = new KinyarwandaAudioService();
