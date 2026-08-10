import { request } from './client';

export const medicationApi = {
  async getReminders() {
    return request('/reminders/');
  },

  async createReminder(reminderData) {
    return request('/reminders/', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  async toggleReminder(reminderId, is_taken) {
    return request(`/reminders/${reminderId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_taken }),
    });
  },

  async deleteReminder(reminderId) {
    return request(`/reminders/${reminderId}/`, {
      method: 'DELETE',
    });
  },
};
