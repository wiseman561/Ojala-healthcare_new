import { useState, useEffect } from 'react';
import { User } from '../types';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // TODO: Validate token with backend
        setIsAuthenticated(true);
        setUser({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'employer'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication error');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implement actual login
      const token = 'mock.token';
      localStorage.setItem('token', token);
      
      setIsAuthenticated(true);
      setUser({
        id: '1',
        name: 'Test User',
        email,
        role: 'employer'
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error
  };
};

export default useAuth; 