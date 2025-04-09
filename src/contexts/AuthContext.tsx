
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  // Check local storage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('gameUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This is a mock implementation - in a real app, call an API
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        username: email.split('@')[0],
        email
      };

      // Mock validation
      if (password.length < 6) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('gameUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      // This is a mock implementation - in a real app, call an API
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        username,
        email
      };

      // Mock validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      localStorage.setItem('gameUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('gameUser');
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
