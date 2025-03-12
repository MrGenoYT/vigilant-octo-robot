
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, { withCredentials: true });
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(null); // Don't show error on initial load
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, recaptchaToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password, recaptchaToken },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, recaptchaToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { username, email, password, recaptchaToken },
        { withCredentials: true }
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed');
      return { success: false, error: err.response?.data?.error || 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset request failed');
      return { success: false, error: err.response?.data?.error || 'Password reset request failed' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
      return { success: false, error: err.response?.data?.error || 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`,
        { withCredentials: true }
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Email verification failed');
      return { success: false, error: err.response?.data?.error || 'Email verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        userData,
        { withCredentials: true }
      );
      setUser(prev => ({ ...prev, ...res.data.user }));
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Profile update failed');
      return { success: false, error: err.response?.data?.error || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Password change failed');
      return { success: false, error: err.response?.data?.error || 'Password change failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePicture = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/profile/picture`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setUser(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Profile picture update failed');
      return { success: false, error: err.response?.data?.error || 'Profile picture update failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    checkAuth,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    changePassword,
    updateProfilePicture
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
