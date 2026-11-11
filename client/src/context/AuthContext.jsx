import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codeanova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('codeanova_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify stored token on initial app load
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('codeanova_token');
      if (storedToken) {
        try {
          const res = await api.get('/user/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('codeanova_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid token');
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('codeanova_token', res.data.token);
      localStorage.setItem('codeanova_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const signup = async (formData) => {
    const res = await api.post('/auth/signup', formData);
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codeanova_token');
    localStorage.removeItem('codeanova_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/user/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('codeanova_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('[AuthContext] Could not refresh user profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
