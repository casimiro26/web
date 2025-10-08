import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    addToCart(product);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{product.discount}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({product.reviews})</span>
        </div>

        {/* Product Info */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-12">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.brand} • {product.model}
        </p>

        {/* Price Row - Always Aligned */}
        <div className="flex items-center justify-between mb-4 h-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-red-500">
              S/ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                S/ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className={`text-sm ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
            {product.inStock ? 'En stock' : 'Agotado'}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.inStock ? 'Agregar al Carrito' : 'No Disponible'}</span>
        </button>
      </div>
    </div>
  );
};