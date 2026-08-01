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
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (isAuthPage) {
        setIsInitializing(false);
        return;
      }
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
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
      if (response.user) {
        setUser(response.user);
      }
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
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