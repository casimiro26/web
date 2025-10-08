import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, logout, isAuthenticated, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Cleanup form data when modal closes
    return () => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.includes('@gmail.com')) {
      newErrors.email = 'Debe ser un email de Gmail (@gmail.com)';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'El nombre es requerido';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'El apellido es requerido';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        if (success) {
          setIsLogin(true);
        }
      }

      if (success) {
        onClose();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setErrors({ general: 'Error en la autenticación. Verifica tus datos.' });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Inténtalo de nuevo.' });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/shorts/TIh5BJ_e1K0"
          title="Store Background Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex">
          {/* Left Side - Form */}
          <div className="flex-1 p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isAuthenticated ? 'Mi Cuenta' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuthenticated ? (
              /* User Profile */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {user?.firstName}</p>
                      <p><span className="font-medium">Apellido:</span> {user?.lastName}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Mis Pedidos
                    </button>
                    <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Mis Favoritos
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Auth Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.general}
                  </div>
                )}

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
                          placeholder="Ingresa tu nombre"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Apellido *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
                          placeholder="Ingresa tu apellido"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email (Gmail) *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
                      placeholder="usuario@gmail.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-red-500 hover:text-red-600 text-sm transition-colors"
                  >
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Side - Store Image */}
          <div className="hidden md:block w-1/2">
            <div className="h-full bg-gradient-to-br from-red-500 to-red-700 p-8 flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Bienvenido a Sr. Robot</h3>
                <p className="text-lg mb-6">Tu tienda de confianza para accesorios tecnológicos</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <p className="text-sm">Auriculares Gaming</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <p className="text-sm">Fundas Premium</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="text-sm">Monitores 4K</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <p className="text-sm">Teclados RGB</p>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  ✓ Productos originales garantizados<br/>
                  ✓ Envío gratis desde S/ 99<br/>
                  ✓ Soporte técnico especializado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};