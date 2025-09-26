import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers';
import './App.css'
import './CriteriaTable.css';

import { AirService, BUILD_ENV } from "@mocanetwork/airkit";


function App1() {
    const [account, setAccount] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isAirConnected, setIsAirConnected] = useState(false);
    const [verifyingCriteria, setVerifyingCriteria] = useState([]);

    const serviceRef = useRef(null);


    const serverBasePath = "http://127.0.0.1:8484";// "http://veriwallet";


    useEffect(() => {
        const verifyingCriteriaFromLocalStorageStr = localStorage.getItem("verifyingCriteria");
        if (verifyingCriteriaFromLocalStorageStr !== null) {
            const verifyingCriteriaFromLocalStorage = JSON.parse(verifyingCriteriaFromLocalStorageStr);
            setVerifyingCriteria(verifyingCriteriaFromLocalStorage);
        }
    });





    const connectWallet = async () => {
        try {
            setIsConnecting(true);

            if (!window.ethereum) {
                throw new Error('MetaMask not installed');
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();

            setAccount(accounts[0]);

            // Get nonce from backend
            const nonceResponse = await fetch(serverBasePath + '/api/auth/nonce/' + accounts[0], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: accounts[0] })
            });

            const { nonce } = await nonceResponse.json();

            console.log(nonce);

            // Sign the nonce
            const signature = await signer.signMessage(nonce);

            // Verify signature with backend
            const authResponse = await fetch(serverBasePath + '/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: accounts[0], signature, nonce })
            });

            setIsWalletConnected(true);

            const verificationResponse = await authResponse.json();
            //{ token, hasCredential, verifyingCriteria1, userVerifications1 }

            let i

            const userVerifications = {};
            for (i = 0; i < verificationResponse.userVerifications.length; i++) {
                const uv = verificationResponse.userVerifications[i];
                userVerifications[uv.id] = uv;
            }

            console.log(userVerifications);

            const verifyingCriteria2 = [];
            for (i = 0; i < verificationResponse.verifyingCriteria.length; i++) {
                const vc = verificationResponse.verifyingCriteria[i];
                vc['userVerification'] = {
                    done: false
                }
                if (vc.id in userVerifications) {
                    vc['userVerification'] = {
                        done: true,
                        data: userVerifications[vc.id]
                    }

                }
                verifyingCriteria2[i] = vc;
            }

            console.log(verifyingCriteria2);

            setVerifyingCriteria(verifyingCriteria2)

            // Store token and redirect
            localStorage.setItem('authToken', verificationResponse.token);
            //localStorage.setItem('verifyingCriteria', JSON.stringify(verifyingCriteria2));

            if (verificationResponse.hasCredential) {
                // Redirect to verification
                //window.location.href = '/verification';
                //setVerificationCriteria()
            }

        } catch (error) {
            console.error('Wallet connection failed:', error);
        } finally {
            setIsConnecting(false);
        }
    };


    async function disconnectWallet() {
        try {
            if (window.ethereum && window.ethereum.disconnect) {
                try {
                    await window.ethereum.disconnect();
                } catch (error) {
                    console.log('MetaMask disconnect not supported');
                }
            }

            if (window.ethereum && window.ethereum.removeAllListeners) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }

            localStorage.removeItem('authToken');

            setAccount('');
            setIsConnecting(false);
            setIsWalletConnected(false);
            setVerifyingCriteria([]);


            console.log('Wallet disconnected successfully');

        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        }
    }

    function viewVerification(criteria, index) {
        console.log(criteria)
        alert(criteria.userVerification.data.credential)
    }
    function editVerification(criteria, index) {

    }
    function deleteVerification(criteria, index) {

    }

    const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15LWtleS0xIn0.eyJwYXJ0bmVySWQiOiIyYjViNGIyNC0wZjJmLTRkMWItYTdiMi0zOWRiMjUwNDU4OWYiLCJzY29wZSI6Imlzc3VlIHZlcmlmeSIsImV4cCI6MTc2MTgzMjcyMSwiaWF0IjoxNzU4ODMyNzIxfQ.E8OCoVLxbsFlLULxjK8Lj9sCftbrJFlGNHjwdojXqMTMzI3CyJlTcKQ9EnsW6tw6ud50esXj1cfQBSS4rBHxdsjJtM0Bptg9WDLYY2-Txnu96v_EoOpNvCL2q9gNGy5XDmjPmnA5EZH0PR1QZQkrADPq91X61Wql3tJAL_pV4K0IdHcrWOiCOY-BcVo8gIyGk8PMsR9RYJdNWfrQSX94fSOSXDHFwST0uJv1F0_kxOtPE7iwGjg_6mTSfygfZwtutL362eLbDVDHlG8VHpCzN0e4K7vfyZqQxUHKZGpRl7EP1twZx08mpF1FQibZn-lKlZeciNuhmcHTVm44UEcb1Q";
    //var service = null;
    let userId = ""

    async function connectToAir() {
        try {
            serviceRef.current = new AirService({
                partnerId: "2b5b4b24-0f2f-4d1b-a7b2-39db2504589f",
            });

            // Trigger the login flow
            await serviceRef.current.init({
                buildEnv: BUILD_ENV.SANDBOX,
                enableLogging: true,
                skipRehydration: true
            });

            const loggedInResult = await serviceRef.current.login();
            
            if (loggedInResult.isLoggedIn) {
                setIsAirConnected(true);
            }


            //TODO extract userId from the token / we should validate token on backend and then extract the "sub"
            userId = loggedInResult.id

            console.log("loggedInResult", loggedInResult)

        } catch (err) {
            console.log(err instanceof Error ? err.message : "An error occurred");

        }
    }

    async function issueIt(criteria, index) {
        try {
            if (!isAirConnected) {
                await connectToAir()
            }

            const vv = await serviceRef.current.issueCredential({
                authToken: jwt,
                credentialId: "c21pn0g100rre0059314VC",
                credentialSubject: {
                    age: 40
                },
                issuerDid: "did:air:id:test:4NzGK6JSxZGe77DrQGYSghkpAYRoTFqJhimH4Xgeqc",
            });

            console.log("vv", vv)


        } catch (err) {
            console.log(err instanceof Error ? err.message : "An error occurred");

        }
    }

    async function verifyIt(criteria, index) {
        try {
            if (!isAirConnected) {
                await connectToAir()
            }

            var vv = await serviceRef.current.verifyCredential({
                authToken: jwt,
                //verifierDid: "",
                programId: "c21pn03102nn90043308aS",
                redirectUrl: "http://127.0.0.1:5719",
            });

            console.log(vv)

        } catch (err) {
            console.log(err instanceof Error ? err.message : "An error occurred");

        }
    }

    return (
        <>
            {!isWalletConnected &&
                <>
                    <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="wallet-connect-btn"
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                    {account && <p>Connected: {account}</p>}
                </>
            }
            <div>
                {isWalletConnected && !isAirConnected &&
                    <>
                        <button onClick={() => connectToAir()}>Connect To Air</button>
                    </>
                }



                {isWalletConnected &&

                    <div className="criteria-table">
                        <h2>Credentials</h2>
                        <table className="criteria-table__table">
                            <thead>
                                <tr className="criteria-table__header-row">
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Issuer URL</th>
                                    <th>Issuer Title</th>
                                    <th>Issuer Description</th>
                                    <th>Verified</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verifyingCriteria.map((criteria, index) => (
                                    <tr key={criteria.id} className={`criteria-table__row ${index % 2 === 0 ? 'criteria-table__row--even' : 'criteria-table__row--odd'}`}>
                                        <td>{criteria.id}</td>
                                        <td>{criteria.title}</td>
                                        <td>{criteria.description}</td>
                                        <td>
                                            <a href={criteria.issuer_url} target="_blank" rel="noopener noreferrer">
                                                {criteria.issuer_url}
                                            </a>
                                        </td>
                                        <td>{criteria.issuer_title}</td>
                                        <td>{criteria.issuer_description}</td>
                                        <td >{criteria.userVerification.done ? "Yes" : "No"}</td>

                                        <td >{criteria.userVerification.done ?
                                            <>
                                                <button onClick={() => viewVerification(criteria, index)}>view</button>
                                                <button onClick={() => editVerification(criteria, index)}>edit</button>
                                                <button onClick={() => deleteVerification(criteria, index)}>delete</button>
                                                <a href={`/api/wallet/${criteria.id}/${account}`} target="_blank">open</a>
                                            </>
                                            :
                                            <>
                                                <button onClick={() => issueIt(criteria, index)}>(Temporary) issue</button>
                                                <button onClick={() => verifyIt(criteria, index)}>verify</button>
                                            </>
                                        }</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <button onClick={() => disconnectWallet()}>disconnect</button>

                    </div>

                }
            </div>

























        </>
    )
}

export default App
