const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('sursadhana_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async updateUserPreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async updateUserStats(stats) {
    return this.request('/users/stats', {
      method: 'PUT',
      body: JSON.stringify(stats)
    });
  }

  // Practice methods
  async getPracticeSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/practice/sessions?${queryString}`);
  }

  async createPracticeSession(sessionData) {
    return this.request('/practice/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  async getPracticeSession(id) {
    return this.request(`/practice/sessions/${id}`);
  }

  async updatePracticeSession(id, sessionData) {
    return this.request(`/practice/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    });
  }

  async deletePracticeSession(id) {
    return this.request(`/practice/sessions/${id}`, {
      method: 'DELETE'
    });
  }

  async getPracticeStats() {
    return this.request('/practice/stats');
  }

  // Subscription methods
  async getSubscriptionStatus() {
    return this.request('/subscription/status');
  }

  async upgradeSubscription(plan) {
    return this.request('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan })
    });
  }

  async cancelSubscription() {
    return this.request('/subscription/cancel', {
      method: 'POST'
    });
  }

  async getSubscriptionPlans() {
    return this.request('/subscription/plans');
  }
}

export default new ApiService();
