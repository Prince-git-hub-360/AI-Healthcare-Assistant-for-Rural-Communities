import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export class VoiceAssistantService {
  private static isSpeaking = false;

  /**
   * Speak a text message in the user's selected language
   * @param text The text to speak (e.g. Hindi, Marathi, English)
   * @param languageCode 'hi' | 'mr' | 'ta' | 'te' | 'en'
   * @param onDone Callback when speech completes
   */
  static speak(
    text: string,
    languageCode: string = 'hi',
    onDone?: () => void
  ) {
    try {
      this.stop();

      // Map language code to BCP-47 tag
      let langTag = 'hi-IN';
      if (languageCode === 'mr') langTag = 'mr-IN';
      else if (languageCode === 'ta') langTag = 'ta-IN';
      else if (languageCode === 'te') langTag = 'te-IN';
      else if (languageCode === 'en') langTag = 'en-IN';

      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langTag;
        utterance.rate = 0.9; // Slightly slower for clear rural health understanding
        utterance.pitch = 1.0;

        utterance.onend = () => {
          this.isSpeaking = false;
          onDone?.();
        };
        utterance.onerror = () => {
          this.isSpeaking = false;
          onDone?.();
        };

        this.isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      } else {
        this.isSpeaking = true;
        Speech.speak(text, {
          language: langTag,
          rate: 0.9,
          pitch: 1.0,
          onDone: () => {
            this.isSpeaking = false;
            onDone?.();
          },
          onStopped: () => {
            this.isSpeaking = false;
            onDone?.();
          },
          onError: () => {
            this.isSpeaking = false;
            onDone?.();
          },
        });
      }
    } catch (e) {
      console.warn('VoiceAssistantService error:', e);
      this.isSpeaking = false;
      onDone?.();
    }
  }

  static stop() {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    } catch (e) {
      // Ignore
    }
    this.isSpeaking = false;
  }

  static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
