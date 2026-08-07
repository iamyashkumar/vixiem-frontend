import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/auth';

import { Loader2 } from 'lucide-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('vixiem_access_token') || localStorage.getItem('accessToken');
      const cachedUserStr = localStorage.getItem('vixiem_user');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsInitializing(false);
        return;
      }

      // Token exists -> user is authenticated on frontend
      setIsAuthenticated(true);
      if (cachedUserStr) {
        try {
          setUser(JSON.parse(cachedUserStr));
        } catch (e) {
          // ignore json parse error
        }
      }

      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem('vixiem_user', JSON.stringify(userData));
        }
      } catch (err) {
        console.warn("Background user hydration warning:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    hydrate();

    const handleGlobalLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      // Save exact user object returned from backend (containing unique username)
      setUser(response.user || { email });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogle(credential);
      setIsAuthenticated(true);
      setUser(response.user || { email: 'google-user' });
      return true;
    } catch (error) {
      console.error('Google Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, username) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, username);
      if (response.accessToken && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    loginWithGoogle,
    register,
    logout
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;