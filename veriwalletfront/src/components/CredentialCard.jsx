import { useState } from 'react';
import CategoryBadge from './CategoryBadge';
import { perks } from '../data/perks';
import Modal from './Modal';
import { useStorage } from '../contexts/StorageContext';

export default function CredentialCard({ credential }) {
  //const [userCredentials, setUserCredentials] = useLocalStorage('userCredentials', []);
  
  const{userCredentials} = useStorage();
  
  const [isEarning, setIsEarning] = useState(false);
  const hasCredential = userCredentials.includes(credential.id);
  const [showModal, setShowModal] = useState(false);
  const[availablePerks, setAvailablePerks] = useState([]);

  const handleGetCredential = () => {
    setIsEarning(true);

    setTimeout(() => {
      if (!hasCredential) {
        const newCredentials = [...userCredentials, credential.id];
        //setUserCredentials(newCredentials);
      }
      setIsEarning(false);
    }, 1500);
  };

  function showCredentialPerks(perkId, perkName){
    console.log(perkId)
    let p = perks.filter(perk => perk.required.includes(perkId));
    setAvailablePerks(p)
    setShowModal(true)
    console.log("Corresponding perks", p)
  }

  return (
    <>
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl transform group-hover:scale-110 transition-transform">
            {credential.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{credential.name}</h3>
            <div className="mt-1">
              <CategoryBadge category={credential.category} type="credential" />
            </div>
          </div>
        </div>
        <div>
          {hasCredential ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center glow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 bg-dark-600 rounded-full border border-dark-500" />
          )}
          
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">
          <button onClick={()=>showCredentialPerks(credential.id, credential.name)} className='pb-4 text-right block w-full'>Perks (🎁)</button>
        
        {credential.description}
      </p>

      <a
        // onClick={handleGetCredential}
        href={credential.url}
        disabled={hasCredential || isEarning}
        className={`block text-center w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${hasCredential
            ? 'bg-green-900 text-green-300 cursor-not-allowed border border-green-800'
            : isEarning
              ? 'bg-indigo-700 text-white cursor-not-allowed'
              : 'btn-primary glow'
          }`}
      >
        {isEarning ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Acquiring...
          </span>
        ) : hasCredential ? (
          'Credential Obtained'
        ) : (
          'Get Credential'
        )}
      </a>
    </div>

<Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Corresponding Perks"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            This credential will be used in the following perks:
          </p>
          <div className="space-y-2">
            {availablePerks.map(perk => (
              <div key={perk.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-dark-600">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    {perk.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{perk.name}</p>
                    <p className="text-sm text-gray-400">{perk.category}</p>
                  </div>
                </div>
                {/* <button className="btn-primary text-sm">
                  Get Credential
                </button> */}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-dark-700 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-dark-600 border border-dark-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </>
  );
}