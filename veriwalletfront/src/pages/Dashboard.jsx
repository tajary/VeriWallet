import { useState } from 'react';
import { credentials, credentialCategories } from '../data/credentials';
import { perks } from '../data/perks';
import ProgressBar from '../components/ProgressBar';
import CredentialCard from '../components/CredentialCard';
import { useStorage } from '../contexts/StorageContext';

export default function Dashboard() {
  const { userCredentials, userVerifiedCredentials, addUserVerifiedCredential } = useStorage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const progress = (userCredentials.length / credentials.length) * 100;
  const availablePerks = perks.filter(perk => 
    perk.required.every(req => userCredentials.includes(req))
  ).length;

  // Filter credentials by category for the dashboard preview
  const filteredCredentials = selectedCategory === 'All' 
    ? credentials 
    : credentials.filter(cred => cred.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to VeriWallet
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Build your digital identity across 8 categories and unlock exclusive Web3 perks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center hover:glow">
          <div className="text-3xl font-bold text-indigo-400 mb-2">
            {userCredentials.length}
          </div>
          <div className="text-gray-400">Credentials Collected</div>
        </div>
        
        <div className="card text-center hover:glow">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {availablePerks}
          </div>
          <div className="text-gray-400">Available Perks</div>
        </div>
        
        <div className="card text-center hover:glow">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {Math.round(progress)}%
          </div>
          <div className="text-gray-400">Passport Complete</div>
        </div>
      </div>

      {/* Progress */}
      <div className="card hover:glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Passport Progress</h2>
          <span className="text-gray-400">{userCredentials.length}/{credentials.length}</span>
        </div>
        <ProgressBar progress={progress} size="lg" />
      </div>

      {/* Category Filter for Dashboard */}
      <div className="card hover:glow">
        <h2 className="text-xl font-semibold text-white mb-4">Explore by Category</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {credentialCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white glow'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCredentials.slice(0, 6).map(credential => (
            <CredentialCard key={credential.id} credential={credential} />
          ))}
        </div>

        {filteredCredentials.length > 6 && (
          <div className="text-center mt-6">
            <button 
              onClick={() => window.location.hash = '#credentials'}
              className="btn-primary glow px-6 py-3"
            >
              View All {filteredCredentials.length} Credentials
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card cursor-pointer group" 
             onClick={() => window.location.hash = '#credentials'}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center group-hover:bg-indigo-800 transition-colors glow">
              <span className="text-2xl text-indigo-400">🆔</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Explore All Credentials</h3>
              <p className="text-gray-400">Browse {credentials.length} credentials across {credentialCategories.length - 1} categories</p>
            </div>
          </div>
        </div>

        <div className="card cursor-pointer group"
             onClick={() => window.location.hash = '#perks'}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center group-hover:bg-green-800 transition-colors glow">
              <span className="text-2xl text-green-400">🎁</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Discover All Perks</h3>
              <p className="text-gray-400">Unlock {perks.length} perks across 8 categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}