import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@health.com',
    password: 'admin123',
    name: 'Dr. Admin',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@health.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'analyst@health.com',
    password: 'analyst123',
    name: 'Jane Analyst',
    role: 'analyst',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const token = `token_${foundUser.id}_${Date.now()}`;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: string = 'user'): Promise<boolean> => {
    if (mockUsers.find(u => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      name,
      role: role as 'admin' | 'user' | 'analyst',
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    const token = `token_${newUser.id}_${Date.now()}`;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}