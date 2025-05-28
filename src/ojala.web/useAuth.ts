import React, { createContext, useContext, useState, ReactNode } from \'react\';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  // Add other auth-related state or functions if needed (e.g., user info, login/logout)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // For MVP, use localStorage or simple state. Replace with proper auth flow later.
  const [token, setTokenState] = useState<string | null>(localStorage.getItem(\'authToken\'));

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem(\'authToken\', newToken);
    } else {
      localStorage.removeItem(\'authToken\');
    }
  };

  // Example: Add a dummy token for testing if none exists
  // React.useEffect(() => {
  //   if (!token) {
  //     console.warn(\'No auth token found, using dummy token for MVP testing.\');
  //     setToken(\'dummy-auth-token-for-md-dashboard\');
  //   }
  // }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(\'useAuth must be used within an AuthProvider\');
  }
  return context;
};

