import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    const userObj = {
      id: 101,
      name: userData.name || 'Alex Rivers',
      email: userData.email || 'alex.rivers@salesforce.ai',
      role: userData.role || 'Senior Sales Executive',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      loggedInAt: new Date().toISOString()
    };
    setUser(userObj);
    localStorage.setItem('crm_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
