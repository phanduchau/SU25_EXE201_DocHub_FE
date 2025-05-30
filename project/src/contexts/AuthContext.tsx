import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface RawJwtPayload {
  [key: string]: any;
  sub: string;
  exp: number;
}

interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapClaimsToUser(payload: RawJwtPayload): JwtPayload {
  return {
    sub: payload.sub,
    name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<JwtPayload | null>(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const raw = jwtDecode<RawJwtPayload>(storedToken);
        return mapClaimsToUser(raw);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const raw = jwtDecode<RawJwtPayload>(newToken);
    setUser(mapClaimsToUser(raw));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const raw = jwtDecode<RawJwtPayload>(storedToken);
        setUser(mapClaimsToUser(raw));
        setToken(storedToken);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
