/**
 * Centralized API configuration module.
 * Exposes API base URL and endpoint helpers using environment variables.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  TICKETS: `${API_BASE_URL}/tickets`,
  TICKET_BY_ID: (id) => `${API_BASE_URL}/tickets/${id}`,
  AI_CHAT: `${API_BASE_URL}/ai/chat`,
  AI_STATUS: `${API_BASE_URL}/ai/status`,
};

