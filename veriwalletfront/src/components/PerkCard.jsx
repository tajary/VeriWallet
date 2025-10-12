import { useEffect, useState } from 'react';
import CategoryBadge from './CategoryBadge';
import Modal from './Modal';
import { useStorage } from '../contexts/StorageContext';

export default function PerkCard({ perk, credentials }) {

  const { userCredentials, userVerifiedCredentials, addUserVerifiedCredential } = useStorage();
  const [showModal, setShowModal] = useState(false);

  const hasAllCredentials = perk.required.every(req => userCredentials.includes(req));
  const missingCredentials = perk.required.filter(req => !userCredentials.includes(req));
  const missingCredentialDetails = missingCredentials.map(id =>
    credentials.find(cred => cred.id === id)
  );

  const isVeifiedAllCredentials = perk.required.every(req => userVerifiedCredentials.includes(req));
  const missingVerifiedCredentials = perk.required.filter(req => userCredentials.includes(req) && !userVerifiedCredentials.includes(req));
  const missingVerifiedCredentialDetails = missingVerifiedCredentials.map(id =>
    credentials.find(cred => cred.id === id)
  );


  useEffect(() => {
  }, []);

  const handleClaim = () => {
    if (hasAllCredentials && isVeifiedAllCredentials) {
      window.open(perk.url)
    } else {
      setShowModal(true);
    }
  };

  let jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15LWtleS0xIn0.eyJwYXJ0bmVySWQiOiIyYjViNGIyNC0wZjJmLTRkMWItYTdiMi0zOWRiMjUwNDU4OWYiLCJzY29wZSI6Imlzc3VlIHZlcmlmeSIsImV4cCI6MTc5MDI5OTQ5NSwiaWF0IjoxNzYwMjk5NDk1fQ.hCYWkaMaoa__PrQtfMDdDCdSbXVIZAw8qBdvHFGDvFTHZRSa7yrCHwkFVwgxY2_aTbFHYCeMgWRUE01GOJRaamq2e0ISOtNmsyGij4gklFiJh4_WJ-AMH9KwA7n11PnE7lgyRC2cyJlwMptSoL2qAEx4KGM2jA22jSGw3WUfA8aI0f7jeoydef6StsxLB7QaGd_uBHQTKIBQcTpH9Uw4yY3C5NzWJSCakMCfVyPy06BO_28qS7C4pIPKi1f3lxXtQARN_WHbD0tpXYLejcs4N_-WyuexetCaRtKGPgE9G8xpcAVTIXxaNuQNu3XHQy3ypzo4b44QU_UtjUHV9j2ZDQ";

  async function verifyFlow(cred) {
    await verifyCredential(cred);
  }

  async function verifyCredential(credential) {
    var vv = await window.service.verifyCredential({
      authToken: jwt,
      programId: credential.verifierProgramId,
      redirectUrl: location.protocol + "//" + location.host + credential.url,
    });
    //console.log(vv);
    if (vv.status == "Compliant") {
      let myc = [...userVerifiedCredentials, credential.id];
      addUserVerifiedCredential(credential.id);
      const myIsVeifiedAllCredentials = perk.required.every(req => myc.includes(req))

      if (hasAllCredentials && myIsVeifiedAllCredentials) {
        setShowModal(false);
      }
    }
  }

  return (
    <>
      <div className="card group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl transform group-hover:scale-110 transition-transform">
              {perk.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white">{perk.name}</h3>
              <div className="mt-1">
                <CategoryBadge category={perk.category} type="perk" />
              </div>
            </div>
          </div>
          {hasAllCredentials && isVeifiedAllCredentials && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center glow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {hasAllCredentials && !isVeifiedAllCredentials && (
            <div className="w-6 h-6 bg-yellow-900 rounded-full flex items-center justify-center glow">
              ?
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-3">{perk.description}</p>

        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-sm font-medium text-gray-300">Required Credentials:</span>
            <span className="text-sm text-gray-500">({perk.required.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {perk.required.map(credId => {
              const cred = credentials.find(c => c.id === credId);
              const hasCred = userCredentials.includes(credId);
              const isVerifiedCred = userVerifiedCredentials.includes(credId);
              return (
                <span
                  key={credId}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border 
                    ${hasCred && isVerifiedCred
                      ? 'bg-green-900 text-green-300 border-green-700'
                      : (
                        hasCred && !isVerifiedCred
                          ? 'bg-yellow-900 text-yellow-300 border-yellow-700'
                          : 'bg-red-900 text-red-300 border-red-700'
                      )
                    }`}
                >
                  {hasCred && isVerifiedCred ? '✓ ' : (hasCred && !isVerifiedCred ? '? ' : '✗ ')}
                  {cred?.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* {perk.reward && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-yellow-300">🎉 Reward: {perk.reward}</p>
          </div>
        )} */}

        <button
          onClick={() => handleClaim(perk)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${isVeifiedAllCredentials
            ? 'btn-primary glow'
            : 'bg-dark-700 text-gray-500 cursor-not-allowed border border-dark-600'
            }`}
        >
          {isVeifiedAllCredentials ? 'Claim / Apply' : 'Requirements Not Met'}
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Missing Credentials"
      >
        <div className="space-y-4">
          {missingCredentialDetails.length > 0 ?
            <>
              <p className="text-gray-400">
                You need to get the following credentials to access this perk:
              </p>
              <div className="space-y-2">
                {missingCredentialDetails.map(cred => (
                  <div key={cred.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-dark-600">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {cred.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{cred.name}</p>
                        <p className="text-sm text-gray-400">{cred.category}</p>
                      </div>
                    </div>
                    <a href={cred.url} target='_blank' className="btn-primary text-sm">
                      Get Credential
                    </a>
                  </div>
                ))}
              </div>
            </>
            : <></>}
          {missingVerifiedCredentialDetails.length > 0 ?
            <>
              <p className="text-gray-400 pt-8">
                You need to verify the following credentials to access this perk:
              </p>
              <div className="space-y-2">
                {missingVerifiedCredentialDetails.map(cred => (
                  <div key={cred.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-dark-600">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {cred.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{cred.name}</p>
                        <p className="text-sm text-gray-400">{cred.category}</p>
                      </div>
                    </div>
                    <button className="btn-primary text-sm" onClick={() => verifyFlow(cred)}>
                      Verify Credential
                    </button>
                  </div>
                ))}
              </div>
            </>
            : <></>}

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