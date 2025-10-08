import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { products } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!isOpen || !product) return null;

  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    addToCart(product);
  };

  const images = product.images || [product.image];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detalles del Producto
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.reviews} reseñas)
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {product.brand} • {product.model}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-red-500">
                  S/ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    S/ {product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <p className={`text-lg ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                {product.inStock ? 'En stock • Envío inmediato' : 'Producto agotado'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.inStock ? 'Agregar al Carrito' : 'No Disponible'}</span>
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Truck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Envío gratis +S/99</p>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Garantía oficial</p>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <RotateCcw className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">30 días devolución</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              {['description', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'description' && 'Descripción'}
                  {tab === 'features' && 'Características'}
                  {tab === 'reviews' && 'Reseñas'}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {product.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Producto original con garantía oficial del fabricante. Incluye todos los accesorios necesarios para su uso.
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {product.rating}
                    </span>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Basado en {product.reviews} reseñas
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Las reseñas estarán disponibles próximamente. ¡Sé el primero en dejar tu opinión!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Productos Relacionados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {relatedProduct.name}
                  </h4>
                  <p className="text-lg font-bold text-red-500">
                    S/ {relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};