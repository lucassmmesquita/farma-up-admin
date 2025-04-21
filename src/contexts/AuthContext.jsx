// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStoredData = () => {
      const storedUser = localStorage.getItem('@FarmaUP:user');
      const storedToken = localStorage.getItem('@FarmaUP:token');
      
      if (storedUser && storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    };
    
    loadStoredData();
  }, []);
  
  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      const { token, user } = response.data;
      
      localStorage.setItem('@FarmaUP:user', JSON.stringify(user));
      localStorage.setItem('@FarmaUP:token', token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('@FarmaUP:user');
    localStorage.removeItem('@FarmaUP:token');
    
    api.defaults.headers.common['Authorization'] = '';
    
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signed: !!user,
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