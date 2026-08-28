/**
 * speech.js
 * Universal Spoken Voice Audio Engine for Swasthya Sanchar AI.
 * Uses browser-native voices when available, otherwise falls back to backend TTS audio.
 * Includes explicit audio cancellation/stop capabilities.
 */
import { api } from '../../services/api';

const LANG_VOICE_MAP = {
  hi: 'hi-IN', // Hindi
  kn: 'kn-IN', // Kannada
  ta: 'ta-IN', // Tamil
  te: 'te-IN', // Telugu
  mr: 'mr-IN', // Marathi
  bn: 'bn-IN', // Bengali
  gu: 'gu-IN', // Gujarati
  ml: 'ml-IN', // Malayalam
  pa: 'pa-IN', // Punjabi
  or: 'or-IN', // Odia
  as: 'as-IN', // Assamese
  ur: 'ur-IN', // Urdu
  en: 'en-IN', // English (India)
};

let currentAudioInstance = null;

export const stopNativeAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
    } catch {
      // Ignore
    }
    currentAudioInstance = null;
  }
};

const playAudioUrl = (url) => {
  stopNativeAudio();
  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      currentAudioInstance = audio;
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.onended = () => {
        currentAudioInstance = null;
        resolve(true);
      };
      audio.onerror = () => {
        currentAudioInstance = null;
        resolve(false);
      };
      audio.play().catch(() => {
        currentAudioInstance = null;
        resolve(false);
      });
    } catch {
      currentAudioInstance = null;
      resolve(false);
    }
  });
};

const getVoicesAsync = () => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 400);
  });
};

export const speakNativeAudio = async (text, langCode = 'hi', rate = 0.85) => {
  if (!text) return false;

  stopNativeAudio();

  const targetLang = langCode.toLowerCase();
  const bcpTag = LANG_VOICE_MAP[targetLang] || `${targetLang}-IN`;

  // 1. Use browser-native speech if available.
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const voices = await getVoicesAsync();
      const matchingVoice = voices.find(
        (v) => v.lang === bcpTag || v.lang.replace('_', '-').toLowerCase().startsWith(targetLang)
      );

      if (matchingVoice) {
        return new Promise((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = bcpTag;
          utterance.voice = matchingVoice;
          utterance.rate = typeof rate === 'number' ? rate : 0.85;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.onend = () => resolve(true);
          utterance.onerror = async (e) => {
            // If audio was stopped or canceled by user action, do not fallback
            if (e?.error === 'canceled' || e?.error === 'interrupted') {
              resolve(false);
              return;
            }
            resolve(await fallbackToBackendAudio(text, targetLang));
          };
          window.speechSynthesis.speak(utterance);
        });
      }
    } catch {
      // Fall through to backend TTS fallback
    }
  }

  return await fallbackToBackendAudio(text, targetLang);
};

const fallbackToBackendAudio = async (text, targetLang) => {
  try {
    const response = await api.textToSpeech(text, targetLang);
    if (response && response.audio_url) {
      return await playAudioUrl(response.audio_url);
    }
  } catch {
    // Ignore backend failures and return false
  }

  return false;
};
