import { createContext, useContext, useState, useEffect } from 'react';

// Define available roles
export const ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  NURSE: 'nurse',
  STAFF: 'staff'
};

// Create context
const AuthContext = createContext();

// Storage key for localStorage
const AUTH_STORAGE_KEY = 'ojala_admin_auth';

// Default user (for demo purposes)
const DEFAULT_USER = {
  id: 'U001',
  name: 'Admin User',
  email: 'admin@example.com',
  role: ROLES.ADMIN
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Set default user if none exists
        setUser(DEFAULT_USER);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      setUser(DEFAULT_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user and localStorage
  const updateUser = (newUser) => {
    try {
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Check if user has required role
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  };

  // Logout function (for future use)
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, updateUser, hasRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
