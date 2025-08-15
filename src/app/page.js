'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardData, setNewCardData] = useState({
    title: '',
    body: '',
    folderId: ''
  });
  const [creating, setCreating] = useState(false);
  
  // NEW STATES for clickable cards
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [loadingCardDetail, setLoadingCardDetail] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('idpro_token');
    const userData = localStorage.getItem('idpro_user');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchFolders();
    fetchCards();
    setLoading(false);
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('idpro_token');
      const response = await fetch('/api/folders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('idpro_token');
      const response = await fetch('/api/cards', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  // NEW FUNCTION for fetching card details
  const fetchCardDetails = async (cardId) => {
    setLoadingCardDetail(true);
    try {
      const token = localStorage.getItem('idpro_token');
      const response = await fetch(`/api/cards/${cardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCardDetails(data.card);
      } else {
        console.error('Failed to fetch card details');
      }
    } catch (error) {
      console.error('Error fetching card details:', error);
    } finally {
      setLoadingCardDetail(false);
    }
  };

  const createCard = async () => {
    if (!newCardData.title.trim()) return;
    
    setCreating(true);
    try {
      const token = localStorage.getItem('idpro_token');
      const response = await fetch('/api/cards/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newCardData.title,
          body: newCardData.body,
          folderId: newCardData.folderId || folders[0]?.id
        })
      });

      if (response.ok) {
        setShowNewCardModal(false);
        setNewCardData({ title: '', body: '', folderId: '' });
        fetchCards();
      } else {
        console.error('Failed to create card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('idpro_token');
    localStorage.removeItem('idpro_user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">ID</span>
          </div>
          <p className="text-gray-600">Loading IDPRO Smart Cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">IDPRO Smart Cards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.displayName}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Folders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {folders.map(folder => (
                    <div
                      key={folder.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFolder === folder.name.toLowerCase() 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedFolder(folder.name.toLowerCase())}
                    >
                      <span className="mr-3 text-lg">{folder.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{folder.name}</span>
                          <span className="text-xs text-gray-500">{folder.count || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewCardModal(true)}
                  className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + New Card
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Cards</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cards.map(card => (
                    <div 
                      key={card.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowCardDetail(true);
                        fetchCardDetails(card.id);
                      }}
                    >
                      <h4 className="font-medium text-gray-900">{card.title}</h4>
                      {card.body && <p className="text-sm text-gray-600 mt-1">{card.body}</p>}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          Created: {new Date(card.createdAt).toLocaleString()}
                        </p>
                        <span className="text-xs text-blue-600 hover:text-blue-800">
                          View Details →
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {cards.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No cards yet. Create your first card!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewCardModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newCardData.title}
                    onChange={(e) => setNewCardData({...newCardData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter card title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCardData.body}
                    onChange={(e) => setNewCardData({...newCardData, body: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter card description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewCardModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={createCard}
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCardDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedCard?.title}
                </h3>
                <button
                  onClick={() => {
                    setShowCardDetail(false);
                    setSelectedCard(null);
                    setCardDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                {loadingCardDetail ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : cardDetails ? (
                  <div className="space-y-4">
                    {cardDetails.body && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{cardDetails.body}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Folder:</span> {cardDetails.folderName}</p>
                        <p><span className="font-medium">Created by:</span> {cardDetails.createdBy}</p>
                        <p><span className="font-medium">Created:</span> {new Date(cardDetails.createdAt).toLocaleString()}</p>
                        <p><span className="font-medium">Updated:</span> {new Date(cardDetails.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Failed to load card details</p>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowCardDetail(false);
                    setSelectedCard(null);
                    setCardDetails(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
