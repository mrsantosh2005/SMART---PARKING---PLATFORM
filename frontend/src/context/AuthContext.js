import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Token expired or invalid');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      if (userData.role !== 'owner') {
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        toast.success(res.data.message || 'Registration successful!');
      } else {
        toast.success(res.data.message || 'Owner registered! Wait for admin approval.');
      }
      
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
      return { success: false };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};