import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  theme?: string;
}

interface AuthContextType {
  user: { id: string; nombreUsuario: string } | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error: any }>;
  signIn: (userOrEmail: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; nombreUsuario: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          await loadProfile(parsedUser.id);
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        await AsyncStorage.multiRemove(['token', 'user']);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setProfile(null);
        return;
      }

      const response = await fetch('https://api-app-android-studio-tesis.onrender.com/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Detectar token inválido o expirado
        if (
          response.status === 401 ||
          data.mensaje?.toLowerCase().includes('token') ||
          data.mensaje?.toLowerCase().includes('inválido') ||
          data.mensaje?.toLowerCase().includes('expirado')
        ) {
          await AsyncStorage.multiRemove(['token', 'user']);
          setUser(null);
          setProfile(null);
        }
        throw new Error(data.mensaje || 'Error al cargar el perfil');
      }

      setProfile({
        id: userId,
        email: data.correo || '',
        full_name: data.nombreCompleto || '',
        username: data.nombreUsuario || '',
        theme: data.theme || 'light',
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);

      // Si hay cualquier error relacionado con autenticación, limpiar
      if (
        error.message?.toLowerCase().includes('token') ||
        error.message?.toLowerCase().includes('unauthorized') ||
        error.message?.toLowerCase().includes('401')
      ) {
        await AsyncStorage.multiRemove(['token', 'user']);
        setUser(null);
      }
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    try {
      const response = await fetch('https://api-app-android-studio-tesis.onrender.com/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: fullName,
          correo: email,
          nombreUsuario: username,
          contrasena: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar usuario');
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (userOrEmail: string, token: string) => {
    try {
      // Decodificación segura del JWT
      let userId = '';
      try {
        const payload = token.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          userId = decoded.id || decoded.sub || decoded.userId || '';
        }
      } catch (decodeError) {
        console.warn('No se pudo decodificar el token JWT');
      }

      if (!userId) {
        throw new Error('Token inválido: no contiene ID de usuario');
      }

      const userData = { id: userId, nombreUsuario: userOrEmail };

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      await loadProfile(userData.id);

      return { error: null };
    } catch (error: any) {
      console.error('Error en signIn:', error);
      await AsyncStorage.multiRemove(['token', 'user']);
      setUser(null);
      setProfile(null);
      return { error: error.message || error };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}