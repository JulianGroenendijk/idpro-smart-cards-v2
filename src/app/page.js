'use client'
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCards } from '../hooks/useCards';
import { useFolders } from '../hooks/useFolders';
import { Header } from '../components/layout/Header';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import { FolderSidebar } from '../components/folders/FolderSidebar';
import { CardsList } from '../components/cards/CardsList';
import { NewCardModal } from '../components/modals/NewCardModal';
import { CardDetailModal } from '../components/modals/CardDetailModal';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const { folders, selectedFolder, setSelectedFolder } = useFolders();
  const { 
    cards, 
    selectedCard, 
    setSelectedCard, 
    cardDetails, 
    setCardDetails,
    loadingCardDetail, 
    fetchCardDetails, 
    createCard 
  } = useCards();

  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardDetail(true);
    fetchCardDetails(card.id);
  };

  const handleCloseCardDetail = () => {
    setShowCardDetail(false);
    setSelectedCard(null);
    setCardDetails(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      
      <Header user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FolderSidebar 
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            onNewCard={() => setShowNewCardModal(true)}
          />
          
          <CardsList 
            cards={cards}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      <NewCardModal 
        isOpen={showNewCardModal}
        onClose={() => setShowNewCardModal(false)}
        onSubmit={createCard}
        folders={folders}
      />

      <CardDetailModal 
        isOpen={showCardDetail}
        onClose={handleCloseCardDetail}
        selectedCard={selectedCard}
        cardDetails={cardDetails}
        loadingCardDetail={loadingCardDetail}
      />
    </div>
  );
}
