import React, { useState } from 'react';

const IDPROSmartCardsApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [showCardDetail, setShowCardDetail] = useState(null);

  // Mock data for demonstration
  const mockFolders = [
    { id: 'inbox', name: 'Inbox', icon: '📥', count: 12 },
    { id: 'projects', name: 'Projects', icon: '💼', count: 8, children: [
      { id: 'project-a', name: 'Project Alpha', icon: '📋', count: 5 },
      { id: 'project-b', name: 'Project Beta', icon: '📋', count: 3 }
    ]},
    { id: 'contacts', name: 'Contacts', icon: '👥', count: 45 },
    { id: 'documents', name: 'Documents', icon: '📄', count: 23 },
    { id: 'shared', name: 'Shared', icon: '🔗', count: 7 },
    { id: 'archive', name: 'Archive', icon: '📦', count: 156 },
    { id: 'trash', name: 'Trash', icon: '🗑️', count: 2 }
  ];

  const mockCards = [
    { 
      id: 1, 
      title: 'Customer Onboarding Process', 
      type: 'project', 
      status: 'in_progress',
      tags: ['high-priority', 'customer', 'process'],
      lastModified: '2 hours ago',
      assignee: 'Julian G.',
      attachments: 3
    },
    { 
      id: 2, 
      title: 'John Doe - Lead Developer', 
      type: 'contact', 
      company: 'TechCorp B.V.',
      tags: ['developer', 'lead', 'netherlands'],
      lastModified: '1 day ago',
      assignee: 'Sarah M.',
      attachments: 1
    },
    { 
      id: 3, 
      title: 'Security Policy v2.1', 
      type: 'document', 
      status: 'review',
      tags: ['security', 'policy', 'compliance'],
      lastModified: '3 days ago',
      assignee: 'Admin',
      attachments: 5
    },
    { 
      id: 4, 
      title: 'Q4 Marketing Campaign', 
      type: 'project', 
      status: 'planning',
      tags: ['marketing', 'q4', 'campaign'],
      lastModified: '5 days ago',
      assignee: 'Emma K.',
      attachments: 8
    }
  ];

  const getCardIcon = (type) => {
    switch(type) {
      case 'project': return '💼';
      case 'contact': return '👤';
      case 'document': return '📄';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const FolderTree = ({ folders, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-4' : ''}`}>
      {folders.map(folder => (
        <div key={folder.id}>
          <div 
            className={`flex items-center p-2 hover:bg-blue-50 cursor-pointer rounded-md ${
              selectedFolder === folder.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => setSelectedFolder(folder.id)}
          >
            <span className="mr-2">{folder.icon}</span>
            <span className="flex-1 text-sm font-medium">{folder.name}</span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{folder.count}</span>
          </div>
          {folder.children && (
            <FolderTree folders={folder.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ID</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">IDPRO Smart Cards</h1>
              </div>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">Demo Organization</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search cards, folders, content..."
                  className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                + New Card
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">JG</span>
                </div>
                <span className="text-sm font-medium">Julian G.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Navigation</h2>
            <div className="space-y-1">
              <button 
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('dashboard')}
              >
                <span className="mr-3">📊</span>
                Dashboard
              </button>
              <button 
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  currentView === 'explorer' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('explorer')}
              >
                <span className="mr-3">📁</span>
                Explorer
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <span className="mr-3">⚡</span>
                Recent
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <span className="mr-3">⭐</span>
                Favorites
              </button>
            </div>
          </div>

          {currentView === 'explorer' && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Folders</h3>
              <FolderTree folders={mockFolders} />
            </div>
          )}

          <div className="px-4 pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cards</span>
                <span className="font-medium">253</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-medium">847 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {currentView === 'dashboard' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Cards</dt>
                        <dd className="text-lg font-medium text-gray-900">253</dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                        <dd className="text-lg font-medium text-gray-900">127</dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white">⏳</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                        <dd className="text-lg font-medium text-gray-900">89</dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                        <dd className="text-lg font-medium text-gray-900">24</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockCards.slice(0, 3).map(card => (
                      <div key={card.id} className="flex items-center space-x-4">
                        <span className="text-2xl">{getCardIcon(card.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{card.title}</p>
                          <p className="text-sm text-gray-500">Modified {card.lastModified} by {card.assignee}</p>
                        </div>
                        <div className="flex space-x-2">
                          {card.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'explorer' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Explorer</h2>
                  <p className="text-sm text-gray-500">
                    {mockFolders.find(f => f.id === selectedFolder)?.name || 'Inbox'} • {mockCards.length} cards
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Sort by: Last Modified</option>
                    <option>Sort by: Name</option>
                    <option>Sort by: Created Date</option>
                  </select>
                  
                  <div className="flex border border-gray-300 rounded-md">
                    <button className="px-3 py-2 text-sm bg-gray-50 border-r">📋</button>
                    <button className="px-3 py-2 text-sm">📊</button>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-4">
                {mockCards.map(card => (
                  <div 
                    key={card.id} 
                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowCardDetail(card)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl">{getCardIcon(card.type)}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{card.title}</h3>
                          {card.company && (
                            <p className="text-sm text-gray-600 mb-2">{card.company}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Modified {card.lastModified}</span>
                            <span>by {card.assignee}</span>
                            {card.attachments > 0 && (
                              <span className="flex items-center">
                                📎 {card.attachments} attachments
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {card.status && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                            {card.status.replace('_', ' ')}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {card.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Card Detail Modal */}
      {showCardDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{getCardIcon(showCardDetail.type)}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{showCardDetail.title}</h2>
                    {showCardDetail.company && (
                      <p className="text-gray-600">{showCardDetail.company}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowCardDetail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Status and Tags */}
                <div className="flex items-center space-x-4">
                  {showCardDetail.status && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(showCardDetail.status)}`}>
                      {showCardDetail.status.replace('_', ' ')}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {showCardDetail.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="prose max-w-none">
                  <h3>Description</h3>
                  <p className="text-gray-700">
                    This is a sample card demonstrating the IDPRO Smart Cards interface. 
                    In the full application, this would contain the actual card content, 
                    custom fields based on the card type, and real data from your PostgreSQL database.
                  </p>
                </div>

                {/* Attachments */}
                {showCardDetail.attachments > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments ({showCardDetail.attachments})</h3>
                    <div className="space-y-2">
                      {[...Array(showCardDetail.attachments)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                          <span>📄</span>
                          <span className="flex-1 text-sm">Document_{i + 1}.pdf</span>
                          <span className="text-xs text-gray-500">2.3 MB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Edit Card
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                    Share
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                    Move
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDPROSmartCardsApp;
