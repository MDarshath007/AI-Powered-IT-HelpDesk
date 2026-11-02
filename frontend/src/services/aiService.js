import { API_ENDPOINTS } from '../config/api';

/**
 * Handle error extraction from AI responses.
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data?.error;
    throw error;
  }

  return data;
}

export const aiService = {
  /**
   * Check whether Groq AI service is configured in the backend.
   */
  async getStatus() {
    try {
      const response = await fetch(API_ENDPOINTS.AI_STATUS);
      return await handleResponse(response);
    } catch (err) {
      return {
        success: false,
        configured: false,
        error: err.message,
      };
    }
  },

  /**
   * Send a message and conversation history to Groq via Express backend.
   * @param {string} message - Latest user input.
   * @param {Array<{role: string, content: string}>} conversation - History of messages.
   */
  async sendMessage(message, conversation = []) {
    try {
      const response = await fetch(API_ENDPOINTS.AI_CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, conversation }),
      });

      return await handleResponse(response);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(
          'Unable to reach backend server. Please verify Express is running on port 5000.'
        );
      }
      throw err;
    }
  },
};
