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
        console.error('Token invalid');
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
        toast.success('Registration successful!');
      } else {
        toast.success('Owner registered! Wait for admin approval.');
      }
      
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
      return { success: false };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt:', { email });
      
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(res.data.error || 'Login failed');
        return { success: false };
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server');
      } else {
        toast.error(err.response?.data?.error || 'Login failed');
      }
      
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