export const FolderItem = ({ folder, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-blue-50 text-blue-700' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick(folder.name.toLowerCase())}
    >
      <span className="mr-3 text-lg">{folder.icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{folder.name}</span>
          <span className="text-xs text-gray-500">{folder.count || 0}</span>
        </div>
      </div>
    </div>
  );
};
