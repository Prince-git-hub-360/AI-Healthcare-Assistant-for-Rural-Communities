import { Audio } from 'expo-av';
import { voiceApi } from '../api';

class AudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  constructor() {
    this.initAudioMode();
  }

  private async initAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      console.warn('[AudioService] Failed to set audio mode:', e);
    }
  }

  public async playVoiceGuidance(text: string, languageCode: string, onFinish?: () => void) {
    try {
      await this.stop();

      // Fetch speech synthesized audio from Django backend
      let audioUrl = '';
      try {
        const res = await voiceApi.getAudioForText(text, languageCode);
        audioUrl = res.audio_url;
      } catch (err) {
        console.log('[AudioService] Backend audio endpoint unavailable, using demo sound stream');
      }

      if (audioUrl) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              this.isPlaying = false;
              if (onFinish) onFinish();
            }
          }
        );
        this.sound = sound;
        this.isPlaying = true;
      } else {
        // Mock finish for fallback
        setTimeout(() => {
          this.isPlaying = false;
          if (onFinish) onFinish();
        }, 2500);
      }
    } catch (e) {
      console.warn('[AudioService] Playback error:', e);
      this.isPlaying = false;
      if (onFinish) onFinish();
    }
  }

  public async stop() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (e) {
        // ignore
      }
      this.sound = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioService = new AudioService();
