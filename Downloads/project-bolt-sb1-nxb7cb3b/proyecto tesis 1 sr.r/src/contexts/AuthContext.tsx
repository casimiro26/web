import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('sr-robot-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al parsear datos de usuario desde localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validación simulada para el inicio de sesión
    if (email.includes('@gmail.com') && password.length >= 6) {
      const userData: User = {
        id: '1',
        firstName: 'Usuario',
        lastName: 'Sr. Robot',
        email,
      };
      setUser(userData);
      localStorage.setItem('sr-robot-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    // Validación simulada para el registro
    if (
      userData.email.includes('@gmail.com') &&
      userData.firstName.trim() &&
      userData.lastName.trim()
    ) {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };
      setUser(newUser);
      localStorage.setItem('sr-robot-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    // Cerrar sesión y limpiar datos del usuario
    setUser(null);
    localStorage.removeItem('sr-robot-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};