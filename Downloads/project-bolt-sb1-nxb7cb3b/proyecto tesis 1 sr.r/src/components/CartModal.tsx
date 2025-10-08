import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para realizar la compra');
      return;
    }
    if (state.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    onCheckout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Mi Carrito ({state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96 p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.product.brand} • {item.product.model}
                    </p>
                    <p className="font-bold text-red-500">
                      S/ {item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-red-500">
                S/ {state.total.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Proceder al Pago
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Envío gratis en compras mayores a S/ 99.00
            </p>
          </div>
        )}
      </div>
    </div>
  );
};