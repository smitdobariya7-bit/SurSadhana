import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const LOCAL_PREFIX = 'local:';
  const getLocalUsers = () => {
    try { return JSON.parse(localStorage.getItem('sursadhana_users') || '{}'); } catch { return {}; }
  };
  const saveLocalUsers = (u) => localStorage.setItem('sursadhana_users', JSON.stringify(u));

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem('sursadhana_token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      if (token.startsWith(LOCAL_PREFIX)) {
        const email = token.slice(LOCAL_PREFIX.length);
        const users = getLocalUsers();
        const u = users[email];
        if (u) {
          setUser({ email, name: u.name, level: u.level || 'beginner' });
          localStorage.setItem('sursadhana_token', token);
        } else {
          localStorage.removeItem('sursadhana_token');
        }
        setLoading(false);
        return;
      }
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data; // /auth/me returns user directly, while /login returns { user, token }
        setUser(userData);
        localStorage.setItem('sursadhana_token', token);
      } else {
        localStorage.removeItem('sursadhana_token');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('sursadhana_token');
    }
    setLoading(false);
  };

  const signup = async (email, password, name) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        const users = getLocalUsers();
        if (users[email]) throw new Error(data.error || 'Registration failed');
        users[email] = { name, pass: password, level: 'beginner' };
        saveLocalUsers(users);
        const token = `${LOCAL_PREFIX}${email}`;
        setUser({ email, name, level: 'beginner' });
        localStorage.setItem('sursadhana_token', token);
        return { email, name };
      }

      setUser(data.user);
      localStorage.setItem('sursadhana_token', data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        const users = getLocalUsers();
        const u = users[email];
        if (!u || u.pass !== password) throw new Error(data.error || 'Login failed');
        const token = `${LOCAL_PREFIX}${email}`;
        setUser({ email, name: u.name, level: u.level || 'beginner' });
        localStorage.setItem('sursadhana_token', token);
        return { email, name: u.name };
      }

      setUser(data.user);
      localStorage.setItem('sursadhana_token', data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sursadhana_token');
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
