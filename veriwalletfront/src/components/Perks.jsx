import { useState } from 'react';
import { Store, Shield, ClipboardEdit } from 'lucide-react';
import { getLucideIcon } from './icons';

export default function Perks({ onUpdate }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'jobs', name: 'Jobs' },
        { id: 'loans', name: 'Loans' },
    ];

    const credentials = [
        {
            id: 1,
            name: "Senior Solidity Developer",
            description: "Join the leading DeFi protocol and build the future of decentralized finance. (Requires 5 years of Solidity development)",
            category: "jobs",
            icon: 'UserCheck',
            url: "/partners/jobhub.html",
            keyId: 'resume',
            verifierProgramId: 'c21ps0318b4ok00d3308r3',
            color: "from-blue-500 to-cyan-500",
        },
        {
            id: 11,
            name: "Web Developer",
            description: "Join the leading DeFi protocol and build the future of decentralized finance. (Requires 5 years of Solidity development)",
            category: "jobs",
            icon: 'UserCheck',
            keyId: 'resume',
            url: "/partners/jobhub.html",
            issuerProgramId: 'c21pn0g100rre0059314VC',
            verifierProgramId: 'c21ps0318b4ok00d3308r3',
            color: "from-blue-500 to-cyan-500",
            credentialSubject: {
                age: 40
            }
        },
        {
            id: 12,
            name: "Platform Engineer",
            description: "Join the leading DeFi protocol and build the future of decentralized finance. (Requires 5 years of Solidity development)",
            category: "jobs",
            icon: 'UserCheck',
            keyId: 'resume',
            url: "/partners/jobhub.html",
            issuerProgramId: 'c21pn0g100rre0059314VC',
            verifierProgramId: 'c21pp0302fulu0023308U9',
            color: "from-blue-500 to-cyan-500",
            credentialSubject: {
                age: 40
            }
        },
        {
            id: 2,
            name: "Instant Crypto Loans",
            description: "Get Instant Crypto Loans with Competitive Rates. (Requires credit > 80)",
            category: "loans",
            icon: 'GlobeIcon',
            url: "/partners/get-loan.html",
            keyId: 'credichain',
            issuerProgramId: 'c21pq0g0zfdti0069516bI',
            verifierProgramId: 'c21ps0318bryl00e3308ZW',
            color: "from-violet-500 to-fuchsia-500",
            credentialSubject: {
                country: "Germany"
            }
        },
    ];

    const filteredCredentials = activeCategory === 'all'
        ? credentials
        : credentials.filter(cred => cred.category === activeCategory);


    let jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15LWtleS0xIn0.eyJwYXJ0bmVySWQiOiIyYjViNGIyNC0wZjJmLTRkMWItYTdiMi0zOWRiMjUwNDU4OWYiLCJzY29wZSI6Imlzc3VlIHZlcmlmeSIsImV4cCI6MTc2MTgzMjcyMSwiaWF0IjoxNzU4ODMyNzIxfQ.E8OCoVLxbsFlLULxjK8Lj9sCftbrJFlGNHjwdojXqMTMzI3CyJlTcKQ9EnsW6tw6ud50esXj1cfQBSS4rBHxdsjJtM0Bptg9WDLYY2-Txnu96v_EoOpNvCL2q9gNGy5XDmjPmnA5EZH0PR1QZQkrADPq91X61Wql3tJAL_pV4K0IdHcrWOiCOY-BcVo8gIyGk8PMsR9RYJdNWfrQSX94fSOSXDHFwST0uJv1F0_kxOtPE7iwGjg_6mTSfygfZwtutL362eLbDVDHlG8VHpCzN0e4K7vfyZqQxUHKZGpRl7EP1twZx08mpF1FQibZn-lKlZeciNuhmcHTVm44UEcb1Q";
    async function issueCredential(credential) {
        const vv = await window.service.issueCredential({
            authToken: jwt,
            credentialId: credential.issuerProgramId,
            credentialSubject: credential.credentialSubject,
            issuerDid: "did:air:id:test:4NzGK6JSxZGe77DrQGYSghkpAYRoTFqJhimH4Xgeqc",
        });
    }

    async function verifyCredential(credential) {
        var vv = await window.service.verifyCredential({
            authToken: jwt,
            programId: credential.verifierProgramId,
            redirectUrl: "http://127.0.0.1:5719",
        });
        //console.log(vv);
        if (vv.status == "Compliant") {
            //let wallet = JSON.parse(localStorage.getItem('veriwallet_user')).walletAddress
            let airId = localStorage.getItem('airId');
            insertWalletData(airId, credential.keyId);
        }
    }


    async function insertWalletData(airId, keyId) {
        try {
            await fetch('https://buildlabz.xyz/api/verify/' + airId + "/" + keyId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: ""
            });

            const result = await response.json();
            //return result;
        } catch (error) {
            console.error('Error:', error);
            //return { success: false };
        }
    }

    return (
        <>
            <a name="perks" />
            <div className='pt-1'></div>
            <section className='mt-20 mb-80'>
                <div className="flex items-center gap-3 mb-6">
                    <Store className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-3xl font-bold">Perks & Opportunities</h2>
                </div>

                <p className="text-slate-400 mb-8 max-w-2xl">

                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium  ${activeCategory === category.id
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-n-42">
                    {filteredCredentials.map((credential) => (
                        <AvailableCredentialCard key={credential.id} credential={credential} issueCredential={issueCredential} verifyCredential={verifyCredential} />
                    ))}
                </div>
            </section>

        </>
    );
}

function AvailableCredentialCard({ credential, issueCredential, verifyCredential }) {
    const Icon = getLucideIcon(credential.icon);

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/90 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <div className='flex  justify-between items-center'>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${credential.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>

                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold inline mb-3 capitalize">
                    {credential.category}
                </span>
            </div>

            <h3 className="text-xl font-semibold mb-3">{credential.name}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                {credential.description}
            </p>

            <div className='flex  justify-between items-center mb-4'>
                <button onClick={() => verifyCredential(credential)}
                    className="flex text-white px-2 py-2 rounded-lg bg-blue-900 font-semibold items-center justify-center gap-2 group"
                >Verify</button>
            </div>

            <div className='flex  justify-between items-center'>
                {/* <button onClick={() => issueCredential(credential)} className="flex bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300  items-center justify-center gap-2 group">
                    <ClipboardEdit className="w-4 h-4" />
                    Issue Now
                    <span className="group-hover:translate-x-1 transition-transform"></span>
                </button> 
                <button onClick={() => verifyCredential(credential)} className="flex bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300  items-center justify-center gap-2 group">
                    <Shield className="w-4 h-4" />
                    Verify Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button> */}
                <a href={credential.url} target="_blank"
                    className="flex bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg w-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300  items-center justify-center gap-2 group"
                >Visit Partner</a>

            </div>
        </div>
    );
}
