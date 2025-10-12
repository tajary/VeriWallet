import { useState } from 'react';
import { perks, perkCategories } from '../data/perks';
import { credentials } from '../data/credentials';
import PerkCard from '../components/PerkCard';
import { useStorage } from '../contexts/StorageContext';

export default function PerkExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { userCredentials, userVerifiedCredentials, addUserVerifiedCredential } = useStorage();

  let filteredPerks = selectedCategory === 'All'
    ? perks
    : perks.filter(perk => perk.category === selectedCategory);

  if (selectedCategory === 'Available') {
    filteredPerks = perks.filter(perk =>
      perk.required.every(req => userCredentials.includes(req))
    )
  }

  const availablePerks = perks.filter(perk =>
    perk.required.every(req => userCredentials.includes(req))
  ).length;


  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Perk Explorer</h1>
        <p className="text-gray-400">
          Discover {perks.length} exclusive benefits across {perkCategories.length - 2} categories.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {perkCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white glow'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-dark-600'
              }`}
          >
            {category} {(category !== 'All' && category !== 'Available') && `(${perks.filter(p => p.category === category).length})`}
                       {(category == 'Available') && `(${availablePerks})`}  
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card hover:glow">
          <div onClick={() => setSelectedCategory('Available')} className="flex items-center justify-between">
            <div>
              <button className="font-semibold text-white">Available Perks</button>
              <p className="text-gray-400">Ready to claim right now</p>
            </div>
            <button className="text-2xl font-bold text-green-400">
              {availablePerks}
            </button>
          </div>
        </div>

        <div className="card hover:glow">
          <div onClick={() => setSelectedCategory('All')}  className="flex items-center justify-between">
            <div>
              <button className="font-semibold text-white">Total Perks</button>
              <p className="text-gray-400">Across all categories</p>
            </div>
            <button className="text-2xl font-bold text-purple-400">
              {perks.length}
            </button>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPerks.map(perk => (
          <PerkCard key={perk.id} perk={perk} credentials={credentials} />
        ))}
      </div>

      {filteredPerks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No perks found in this category.</p>
        </div>
      )}
    </div>
  );
}