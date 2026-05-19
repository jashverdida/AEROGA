import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('aeroga_token');
    if (storedToken) {
      const decoded = decodeJwt(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        const storedUser = localStorage.getItem('aeroga_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        localStorage.removeItem('aeroga_token');
        localStorage.removeItem('aeroga_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    const { token: newToken, ...userData } = response.data.data;
    localStorage.setItem('aeroga_token', newToken);
    localStorage.setItem('aeroga_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (username, email, password, role) => {
    const response = await API.post('/api/auth/register', { username, email, password, role });
    const { token: newToken, ...userData } = response.data.data;
    localStorage.setItem('aeroga_token', newToken);
    localStorage.setItem('aeroga_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aeroga_token');
    localStorage.removeItem('aeroga_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
