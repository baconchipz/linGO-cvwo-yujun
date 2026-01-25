import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const UserContext = createContext(undefined);
export const UserProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    useEffect(() => {
        const stored = localStorage.getItem('modgo_user');
        if (stored) {
            try {
                setUserState(JSON.parse(stored));
            }
            catch (e) {
                console.error(e);
            }
        }
    }, []);
    useEffect(() => {
        if (user) {
            localStorage.setItem('modgo_user', JSON.stringify(user));
        }
        else {
            localStorage.removeItem('modgo_user');
        }
    }, [user]);
    const setUser = (u) => {
        setUserState(u);
    };
    const logout = () => {
        setUserState(null);
    };
    return (_jsx(UserContext.Provider, { value: { user, setUser, logout }, children: children }));
};
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used inside UserProvider');
    }
    return ctx;
};
