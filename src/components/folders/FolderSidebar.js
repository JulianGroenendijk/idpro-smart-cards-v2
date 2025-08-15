import { FolderItem } from './FolderItem';

export const FolderSidebar = ({ folders, selectedFolder, onFolderSelect, onNewCard }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Folders</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {folders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                isSelected={selectedFolder === folder.name.toLowerCase()}
                onClick={onFolderSelect}
              />
            ))}
          </div>

          <button
            onClick={onNewCard}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Card
          </button>
        </div>
      </div>
    </div>
  );
};
