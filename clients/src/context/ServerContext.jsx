// IMPORT HOOKS
import { createContext, useState } from 'react';

export const ServerContext = createContext()

const ServerContextProvider = (props) => {
    // BASE API URL
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    // BASE API TOKEN
    const [token, setToken] = useState('');
    // BASE CONTEXT VALUE
    const contextValue = {
        url,
        token,
        setToken
    };
    // RETURN PROPS AND PROPS.CHILDREN
    return (
        <ServerContext.Provider value={contextValue}>
            {props.children}
        </ServerContext.Provider>
    )
}

export default ServerContextProvider