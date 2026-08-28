import { request } from './client';

export const aiAssistantApi = {
  /**
   * Query the Swasthya Mitr AI Medicine Assistant backend (Google Gemini proxy).
   * @param {Object} payload - { question, medicine, language, conversation_history }
   */
  async queryMedicineAssistant(payload) {
    return request('/ai-assistant/medicine/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
