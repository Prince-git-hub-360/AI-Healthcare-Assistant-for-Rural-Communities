import { request } from './client';

export const healthVaultApi = {
  async getMedicalDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/medical-documents/${query ? `?${query}` : ''}`;
    return request(url);
  },

  async uploadMedicalDocument(formData, lang = null) {
    const targetLang = lang || formData.get('language') || formData.get('target_language');
    const url = `/medical-documents/${targetLang ? `?lang=${targetLang}` : ''}`;
    return request(url, {
      method: 'POST',
      body: formData,
    });
  },

  async deleteMedicalDocument(docId) {
    return request(`/medical-documents/${docId}/`, {
      method: 'DELETE',
    });
  },
};
