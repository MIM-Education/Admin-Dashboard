// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // e.g., 'admin', 'sales'
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Check localStorage for token/user info on initial load
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { isAuthenticated: storedIsAuth, userRole: storedRole, userName: storedName } = JSON.parse(storedAuth);
      setIsAuthenticated(storedIsAuth);
      setUserRole(storedRole);
      setUserName(storedName);
    }
  }, []);

  const login = (role, name) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, userRole: role, userName: name }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
