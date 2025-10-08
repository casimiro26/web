import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Sun, Moon, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { categories } from '../data/products';

interface HeaderProps {
  onAuthClick: () => void;
  onCartClick: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAuthClick, 
  onCartClick, 
  currentPage, 
  onPageChange 
}) => {
  const { state: cartState } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onPageChange('home')}
          >
            <div className="relative">
              <img 
                src="/s-r.png" 
                alt="Sr. Robot Logo" 
                className={`w-8 h-8 group-hover:scale-110 transition-transform duration-300 ease-in-out ${theme === 'light' ? 'drop-shadow-[0_4px_3px_rgba(0,0,0,0.25)]' : 'drop-shadow-[0_4px_3px_rgba(255,255,255,0.25)]'}`} 
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
              Sr. Robot
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar accesorios tecnológicos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Favorites */}
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200 relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartState.itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            <button
              onClick={onAuthClick}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span>{isAuthenticated ? `Hola ${user?.name?.split(' ')[0]}` : 'Iniciar Sesión'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar - Desktop */}
        <div className="hidden md:flex items-center justify-center space-x-6 py-2 border-t border-gray-200 dark:border-gray-700">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onPageChange('catalog')}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Mobile Categories */}
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onPageChange('catalog');
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-1 p-3 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs text-center">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors relative">
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    onCartClick();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartState.itemCount}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{isAuthenticated ? 'Mi Cuenta' : 'Ingresar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};