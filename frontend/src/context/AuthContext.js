import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Load user error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      if (userData.role !== 'owner') {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(res.data.message || 'Registration successful!');
      } else {
        toast.success(res.data.message || 'Owner registered successfully! Please wait for admin approval.');
      }
      
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Registration failed';
      if (err.response) {
        errorMessage = err.response.data?.error || 'Registration failed';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if backend is running on port 5001';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed';
      if (err.response) {
        errorMessage = err.response.data?.error || 'Login failed';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};