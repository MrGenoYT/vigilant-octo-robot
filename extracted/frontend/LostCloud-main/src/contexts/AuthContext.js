
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/current-user', {
          withCredentials: true
        });
        
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Not setting error here as this is just a check
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', userData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (tokenId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/google', { tokenId }, {
        withCredentials: true
      });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update user information
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
