import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export const useCards = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [loadingCardDetail, setLoadingCardDetail] = useState(false);

  const fetchCards = async () => {
    const cards = await api.fetchCards();
    setCards(cards);
  };

  const fetchCardDetails = async (cardId) => {
    setLoadingCardDetail(true);
    try {
      const details = await api.fetchCardDetails(cardId);
      setCardDetails(details);
    } finally {
      setLoadingCardDetail(false);
    }
  };

  const createCard = async (cardData) => {
    await api.createCard(cardData);
    await fetchCards(); // Refresh list
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    selectedCard,
    setSelectedCard,
    cardDetails,
    setCardDetails,
    loadingCardDetail,
    fetchCardDetails,
    createCard,
    refreshCards: fetchCards
  };
};
