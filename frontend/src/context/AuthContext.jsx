import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

/**
 * AuthProvider manages authentication state across the app.
 * On mount, it checks for an existing session via GET /profile.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { data } = await client.get('/profile');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signup(email, password) {
    setError(null);
    try {
      const { data } = await client.post('/signup', { email, password });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
      throw new Error(message);
    }
  }

  async function login(email, password) {
    setError(null);
    try {
      const { data } = await client.post('/login', { email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }

  const logout = useCallback(async () => {
    try {
      await client.post('/logout');
    } finally {
      setUser(null);
    }
  }, []);

  async function loginWithGoogle(token) {
    setError(null);
    try {
      const { data } = await client.post('/google', { token });
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Google login failed';
      setError(message);
      throw new Error(message);
    }
  }

  async function requestPasswordReset(email) {
    setError(null);
    try {
      const { data } = await client.post('/forgot-password', { email });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Password reset request failed';
      setError(message);
      throw new Error(message);
    }
  }

  async function resetPassword(token, newPassword) {
    setError(null);
    try {
      const { data } = await client.post('/reset-password', { token, newPassword });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Password reset failed';
      setError(message);
      throw new Error(message);
    }
  }

  function clearError() {
    setError(null);
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    loginWithGoogle,
    requestPasswordReset,
    resetPassword,
    clearError,
    refreshUser: checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
