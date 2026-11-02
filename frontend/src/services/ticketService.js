import { API_ENDPOINTS } from '../config/api';

/**
 * Handles error extraction from responses or network exceptions.
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Wrap fetch calls with friendly network error message if backend is unreachable.
 */
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (err) {
    // If it's a TypeError from fetch, backend is likely down or blocked
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the backend server. Please verify Express is running on port 5000.'
      );
    }
    throw err;
  }
}

export const ticketService = {
  /**
   * Fetch all tickets from backend SQLite API.
   * Supports optional query filtering.
   */
  async getAllTickets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const result = await safeFetch(`${API_ENDPOINTS.TICKETS}${queryString}`);
    return result.data || [];
  },

  /**
   * Fetch a single ticket by its ID.
   */
  async getTicketById(id) {
    const result = await safeFetch(API_ENDPOINTS.TICKET_BY_ID(id));
    return result.data;
  },

  /**
   * Create a new ticket.
   */
  async createTicket(ticketData) {
    const result = await safeFetch(API_ENDPOINTS.TICKETS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    return result.data;
  },

  /**
   * Update an existing ticket's status.
   */
  async updateTicketStatus(id, status) {
    const result = await safeFetch(API_ENDPOINTS.TICKET_BY_ID(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return result.data;
  },

  /**
   * Delete a ticket by its ID.
   */
  async deleteTicket(id) {
    const result = await safeFetch(API_ENDPOINTS.TICKET_BY_ID(id), {
      method: 'DELETE',
    });
    return result;
  },
};

/**
 * Format SQLite timestamps (e.g. "2026-11-02 14:48:29" or ISO) into readable date strings.
 */
export function formatTicketDate(dateString) {
  if (!dateString) return 'Just now';
  try {
    // SQLite datetime('now') returns "YYYY-MM-DD HH:MM:SS" (UTC)
    const normalized = dateString.includes('T')
      ? dateString
      : dateString.replace(' ', 'T') + (dateString.endsWith('Z') ? '' : 'Z');
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
