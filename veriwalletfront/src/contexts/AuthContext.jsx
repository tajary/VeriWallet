import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check login status from localStorage on page load
    useEffect(() => {

        //if (window.service) {
            const savedUser = localStorage.getItem('veriwallet_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            
       // }
        setLoading(false);

    }, []);

    const login = (walletAddress) => {
        const userData = {
            walletAddress
        };

        setUser(userData);
        localStorage.setItem('veriwallet_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('veriwallet_user');
        window.service = null
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};