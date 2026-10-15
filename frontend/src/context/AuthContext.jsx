import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memeriksa token & data user di localStorage
  const checkAuth = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Gagal membaca session auth:", error);
        logout();
      }
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. Cek status saat pertama kali aplikasi di-load / tab baru dibuka
    checkAuth();

    // 2. Sinkronisasi status autentikasi antar-tab secara real-time
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fungsi Login
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
