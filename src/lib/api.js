// API utilities for IDPRO Smart Cards
const getToken = () => localStorage.getItem('idpro_token');

const apiRequest = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Fetch all folders
  async fetchFolders() {
    try {
      const data = await apiRequest('/api/folders');
      return data.folders || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      return [];
    }
  },

  // Fetch all cards
  async fetchCards() {
    try {
      const data = await apiRequest('/api/cards');
      return data.cards || [];
    } catch (error) {
      console.error('Error fetching cards:', error);
      return [];
    }
  },

  // Fetch single card details
  async fetchCardDetails(cardId) {
    try {
      const data = await apiRequest(`/api/cards/${cardId}`);
      return data.card;
    } catch (error) {
      console.error('Error fetching card details:', error);
      return null;
    }
  },

  // Create new card
  async createCard(cardData) {
    try {
      const data = await apiRequest('/api/cards/create', {
        method: 'POST',
        body: JSON.stringify(cardData),
      });
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }
};
