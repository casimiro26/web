import React, { useState } from 'react';
import { X, CreditCard, Truck, DollarSign, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dni: user?.dni || '',
    phone: user?.phone || '',
    address: user?.address || '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  if (!isOpen) return null;

  const shippingCost = state.total >= 99 ? 0 : 15;
  const finalTotal = state.total + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      // Process order
      setCurrentStep(4);
      setTimeout(() => {
        clearCart();
        onClose();
        setCurrentStep(1);
        alert('¡Pedido realizado con éxito! Recibirás un email de confirmación.');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Lock className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout Seguro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Información', icon: '📝' },
              { step: 2, title: 'Envío', icon: '🚚' },
              { step: 3, title: 'Pago', icon: '💳' },
              { step: 4, title: 'Confirmación', icon: '✅' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= item.step ? 'bg-red-500' : 'bg-gray-300'
                }`}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      DNI *
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={formData.dni}
                      onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dirección Completa *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Av. Principal 123, Distrito, Ciudad"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Continuar al Envío
                </button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Opciones de Envío
                </h3>
                
                <div className="space-y-3">
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-6 h-6 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Envío Estándar</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">3-5 días hábiles</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {shippingCost === 0 ? 'GRATIS' : `S/ ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Envío Express</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">1-2 días hábiles</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">S/ 25.00</span>
                    </div>
                    <p className="text-xs text-red-500 mt-2">Próximamente disponible</p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Continuar al Pago
                </button>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Método de Pago
                </h3>
                
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: CreditCard, color: 'text-blue-500' },
                    { id: 'transfer', name: 'Transferencia Bancaria', icon: DollarSign, color: 'text-green-500' },
                    { id: 'cash', name: 'Pago Contraentrega', icon: Truck, color: 'text-orange-500' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className={`w-6 h-6 ${method.color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de Tarjeta *
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre en la Tarjeta *
                        </label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="JUAN PEREZ"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            MM/AA *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="12/28"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            maxLength={3}
                            value={formData.cardCvv}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardCvv: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!paymentMethod}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  Finalizar Compra
                </button>
              </form>
            )}

            {currentStep === 4 && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ¡Procesando tu pedido!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  En unos segundos recibirás la confirmación...
                </p>
                <div className="mt-4">
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3 mb-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      S/ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">S/ {state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                  <span className="text-gray-900 dark:text-white">
                    {shippingCost === 0 ? 'GRATIS' : `S/ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-red-500">S/ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Pago 100% seguro y encriptado</span>
                </div>
                <p>Aceptamos todas las tarjetas principales y métodos de pago locales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};