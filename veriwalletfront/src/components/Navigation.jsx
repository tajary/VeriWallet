import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';
import UserMenu from './UserMenu';
import Login from '../pages/Login';
import { useStorage } from '../contexts/StorageContext';

export default function Navigation({ currentView, setCurrentView }) {
  const { userCredentials, userVerifiedCredentials, addUserVerifiedCredential } = useStorage();
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'credentials', 'perks'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setCurrentView]);

  const progress = (userCredentials.length / 22) * 100;

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40 nav-glow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:glow transition-all duration-300">
                <span className="text-white font-bold text-sm">VW</span>
              </div>
              <span className="font-bold text-xl text-white">VeriWallet</span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
                { id: 'credentials', name: 'Credentials', icon: '🆔' },
                { id: 'perks', name: 'Perks', icon: '🎁' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'text-indigo-400 bg-indigo-900 bg-opacity-50 glow'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-dark-700 px-3 py-1 rounded-full border border-dark-600">
              <span className="text-sm text-gray-400">Progress:</span>
              <ProgressBar progress={progress} size="sm" />
              <span className="text-sm font-medium text-white">
                {userCredentials.length}/22
              </span>
            </div>
            
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}