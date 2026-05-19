import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

// Build a fake but structurally valid JWT-like token so existing code won't break
function buildMockToken(payload) {
  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const header = encode({ alg: 'MOCK', typ: 'JWT' });
  const body = encode({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 });
  return `${header}.${body}.mock_signature`;
}

function roleFromEmail(email) {
  const e = email.toLowerCase();
  if (e.includes('admin')) return 'ADMIN';
  return 'CLIENT';
}

function buildUser(email) {
  const role = roleFromEmail(email);
  const name = role === 'ADMIN' ? 'Admin User' : 'Client User';
  return { email, role, username: name, id: 'mock_user' };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('aeroga_token');
    const storedUser = localStorage.getItem('aeroga_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email) => {
    const userData = buildUser(email);
    const mockToken = buildMockToken({ sub: email, role: userData.role });
    localStorage.setItem('aeroga_token', mockToken);
    localStorage.setItem('aeroga_user', JSON.stringify(userData));
    setToken(mockToken);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (_username, email, _password, role) => {
    const userData = { ...buildUser(email), role: role || roleFromEmail(email) };
    const mockToken = buildMockToken({ sub: email, role: userData.role });
    localStorage.setItem('aeroga_token', mockToken);
    localStorage.setItem('aeroga_user', JSON.stringify(userData));
    setToken(mockToken);
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
