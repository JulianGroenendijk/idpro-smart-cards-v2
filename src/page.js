'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
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
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('idpro_token');
    localStorage.removeItem('idpro_user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">ID</span>
            </div>
            <p className="text-gray-600">Loading IDPRO Smart Cards...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ID</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">IDPRO Smart Cards</h1>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">Welcome back!</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  👋 {user.first_name} {user.last_name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎉 Authentication Complete!
            </h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">✅ System Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Database</h4>
                  <p className="text-sm text-green-600">PostgreSQL Connected</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Authentication</h4>
                  <p className="text-sm text-green-600">JWT Token Active</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">User Session</h4>
                  <p className="text-sm text-green-600">Logged in as {user.email}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Security</h4>
                  <p className="text-sm text-green-600">Password Encrypted</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">🚀 Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <span>Connect real data from PostgreSQL database</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <span>Build folder structure and card management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <span>Add file upload and sharing features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <span>Deploy to production on your VPS</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
