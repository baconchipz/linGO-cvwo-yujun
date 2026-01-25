import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/api';

type UserCtx = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserCtx | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('modgo_user');
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('modgo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('modgo_user');
    }
  }, [user]);

  const setUser = (u: User | null) => {
    setUserState(u);
  };

  const logout = () => {
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return ctx;
};