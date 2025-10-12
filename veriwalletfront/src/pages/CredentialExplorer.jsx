import { useState } from 'react';
import { credentials, credentialCategories } from '../data/credentials';
import CredentialCard from '../components/CredentialCard';
import ProgressBar from '../components/ProgressBar';
import { useStorage } from '../contexts/StorageContext';

export default function CredentialExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { userCredentials, userVerifiedCredentials, addUserVerifiedCredential } = useStorage();

  const filteredCredentials = selectedCategory === 'All'
    ? credentials
    : credentials.filter(cred => cred.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Credential Explorer</h1>
        <p className="text-gray-400">
          Collect credentials across {credentialCategories.length - 1} categories to build your digital identity.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {credentialCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white glow'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600'
              }`}
          >
            {category} {category !== 'All' && `(${credentials.filter(c => c.category === category).length})`}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="card hover:glow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Your Progress</h3>
            <p className="text-gray-400">
              {userCredentials.length} of {credentials.length} credentials collected
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {Math.round((userCredentials.length / credentials.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map(credential => (
          <CredentialCard key={credential.id} credential={credential} />
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No credentials found in this category.</p>
        </div>
      )}
    </div>
  );
}