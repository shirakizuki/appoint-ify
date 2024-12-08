import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(
        JSON.stringify(value)
    )};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const useSignIn = () => {
    const { signIn } = useContext(AuthContext);
    return signIn;
};

export const useSignOut = () => {
    const { signOut } = useContext(AuthContext);
    return signOut;
};

export const useAuth = () => {
    const { user, auth } = useContext(AuthContext);
    return { user, auth };
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = getCookie('_auth');
        const storedUserState = getCookie('_auth_state');
        const storedAuthType = getCookie('_auth_type');

        console.log('Stored Auth:', storedAuth);
        console.log('Stored User State:', storedUserState);
        console.log('Stored Auth Type:', storedAuthType);

        if (storedAuth && storedUserState && storedAuthType) {
            setAuth(storedAuth);
            setUser(storedUserState);
        }
        setLoading(false);
    }, []);

    // Sign-in function
    const signIn = ({ auth, userState }) => {
        console.log('Signing in with auth:', auth);
        setAuth(auth);
        setUser(userState);

        // Set cookies for persistent storage
        setCookie('_auth', auth, 7); // Valid for 7 days
        setCookie('_auth_state', userState, 7);
        setCookie('_auth_type', auth.type, 7);
    };

    // Sign-out function
    const signOut = () => {
        setAuth(null);
        setUser(null);

        // Clear cookies
        deleteCookie('_auth');
        deleteCookie('_auth_state');
        deleteCookie('_auth_type');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ auth, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
