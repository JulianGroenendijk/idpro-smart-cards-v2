export const LoadingSpinner = () => {
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
};
