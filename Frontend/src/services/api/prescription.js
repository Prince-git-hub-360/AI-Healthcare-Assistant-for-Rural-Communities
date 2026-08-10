import { request } from './client';

export const prescriptionApi = {
  async translateText(text, target_language = 'hi') {
    return request('/translate/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },

  async textToSpeech(text, target_language = 'hi') {
    return request('/voice/text-to-speech/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },
};
