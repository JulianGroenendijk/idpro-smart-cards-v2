export const CardDetailModal = ({ 
  isOpen, 
  onClose, 
  selectedCard, 
  cardDetails, 
  loadingCardDetail 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedCard?.title}
            </h3>
            <button
              onClick={onClose}
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
