import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const StorageContext = createContext();

export function StorageProvider({ children }) {

    const [userCredentials, setUserCredentials] = useState([]);
    const [userVerifiedCredentials, setUserVerifiedCredentials] = useState([]);

    const fetchUserCredentials = async () => {
        try {
            const response = await fetch(`https://buildlabz.xyz/api/issues/${airId}`);
            const data = await response.json();
            setUserCredentials([...new Set(data.map(k=> k.key_id))]);
        } catch (error) {
            console.error('Failed to fetch credentials:', error);
        }
        
    }


    const fetchUserVerifiedCredentials = async () => {
        try {
            const response = await fetch(`https://buildlabz.xyz/api/verifies/${airId}`);
            const data = await response.json();
            setUserVerifiedCredentials([...new Set(data.map(k=> k.key_id))]);
        } catch (error) {
            console.error('Failed to fetch user verified credentials:', error);
        }
    }

    function periodicallyFetchCredentials() {
        setTimeout(async () => {
            await fetchUserCredentials();
            periodicallyFetchCredentials();
        }, 5000); // every 5 seconds

    }
    let airId;
    useEffect(() => {
        airId = localStorage.getItem('airId');
        const fetchData = async () => {
            await fetchUserCredentials();
            await fetchUserVerifiedCredentials();
            periodicallyFetchCredentials();
        };
        fetchData();
    }, []);


    async function addUserVerifiedCredential(credential) {
        if (userVerifiedCredentials.includes(credential)) return;
        setUserVerifiedCredentials([...userVerifiedCredentials, credential]);
        airId = localStorage.getItem('airId');
        try {
            await fetch('https://buildlabz.xyz/api/verify/' + airId + "/" + credential, {
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
        <StorageContext.Provider value={{ userCredentials, userVerifiedCredentials, addUserVerifiedCredential }}>
            {children}
        </StorageContext.Provider>
    );
}

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within an StorageProvider');
    }
    return context;
};