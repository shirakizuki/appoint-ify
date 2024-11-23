// IMPORT HOOKS
import { createContext, useState } from 'react';
import dotenv from 'dotenv';

dotenv.config();

export const ServerContext = createContext()

const ServerContextProvider = (props) => {
    // BASE API URL
    const url = process.env.REACT_APP_API_URL;
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