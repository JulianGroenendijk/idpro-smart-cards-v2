import { useState } from 'react';

export const NewCardModal = ({ isOpen, onClose, onSubmit, folders }) => {
  const [cardData, setCardData] = useState({
    title: '',
    body: '',
    folderId: ''
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!cardData.title.trim()) return;
    
    setCreating(true);
    try {
      await onSubmit({
        ...cardData,
        folderId: cardData.folderId || folders[0]?.id
      });
      setCardData({ title: '', body: '', folderId: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create card');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Card</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={cardData.title}
                onChange={(e) => setCardData({...cardData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter card title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={cardData.body}
                onChange={(e) => setCardData({...cardData, body: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter card description"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
