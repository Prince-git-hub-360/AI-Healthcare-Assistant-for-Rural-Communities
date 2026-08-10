/**
 * speech.js
 * Universal Spoken Voice Audio Engine for Swasthya Sanchar AI.
 * Uses browser-native voices when available, otherwise falls back to backend TTS audio.
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

const playAudioUrl = (url) => {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.onended = () => resolve(true);
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    } catch {
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

export const speakNativeAudio = async (text, langCode = 'hi') => {
  if (!text) return false;

  const targetLang = langCode.toLowerCase();
  const bcpTag = LANG_VOICE_MAP[targetLang] || `${targetLang}-IN`;

  // 1. Use browser-native speech if available.
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const voices = await getVoicesAsync();
      const matchingVoice = voices.find(
        (v) => v.lang === bcpTag || v.lang.replace('_', '-').toLowerCase().startsWith(targetLang)
      );

      if (matchingVoice) {
        return new Promise((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = bcpTag;
          utterance.voice = matchingVoice;
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.onend = () => resolve(true);
          utterance.onerror = async () => resolve(await fallbackToBackendAudio(text, targetLang));
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
