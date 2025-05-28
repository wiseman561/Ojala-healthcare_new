import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
}

interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? 'https://localhost:5001',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<TokenPair | null>(() => {
    const raw = localStorage.getItem('tokens');
    return raw ? JSON.parse(raw) as TokenPair : null;
  });

  const isAuthenticated = !!tokens?.accessToken;

  function setAuthTokens(pair: TokenPair) {
    setTokens(pair);
    localStorage.setItem('tokens', JSON.stringify(pair));
    api.defaults.headers.common.Authorization = `Bearer ${pair.accessToken}`;
    scheduleRefresh(pair);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post<TokenPair>('/api/auth/login', { email, password });
    setAuthTokens(data);
  }

  async function register(data: RegisterDto) {
    const res = await api.post<TokenPair>('/api/auth/register', data);
    setAuthTokens(res.data);
  }

  async function refreshToken() {
    if (!tokens) return;
    const { data } = await api.post<TokenPair>('/api/auth/refresh', {
      refreshToken: tokens.refreshToken,
    });
    setAuthTokens(data);
  }

  function logout() {
    if (tokens) {
      api.post('/api/auth/logout', { refreshToken: tokens.refreshToken }).catch(() => {});
    }
    localStorage.removeItem('tokens');
    setTokens(null);
    delete api.defaults.headers.common.Authorization;
  }

  function scheduleRefresh(pair: TokenPair) {
    const exp = new Date(pair.expiresAt).getTime();
    const delay = exp - Date.now() - 60_000; // refresh 1 min early
    window.setTimeout(refreshToken, Math.max(delay, 0));
  }

  // init on mount
  useEffect(() => {
    if (tokens) {
      api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
      scheduleRefresh(tokens);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 