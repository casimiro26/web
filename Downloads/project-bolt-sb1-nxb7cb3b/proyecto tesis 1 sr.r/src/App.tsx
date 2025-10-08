import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ChatBot } from './components/ChatBot';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Product } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onAuthClick={() => setIsAuthOpen(true)}
            onProductView={handleProductView}
          />
        );
      case 'catalog':
        return <CatalogPage onProductView={handleProductView} />;
      default:
        return (
          <HomePage
            onAuthClick={() => setIsAuthOpen(true)}
            onProductView={handleProductView}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <Loader isLoading={isLoading} />
            
            {!isLoading && (
              <>
                <Header
                  onAuthClick={() => setIsAuthOpen(true)}
                  onCartClick={() => setIsCartOpen(true)}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />

                <main className="flex-1">
                  {renderCurrentPage()}
                </main>

                <Footer />

                {/* Modals */}
                <CartModal
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  onCheckout={handleCheckout}
                />

                <AuthModal
                  isOpen={isAuthOpen}
                  onClose={() => setIsAuthOpen(false)}
                />

                <ProductModal
                  product={selectedProduct}
                  isOpen={isProductModalOpen}
                  onClose={() => {
                    setIsProductModalOpen(false);
                    setSelectedProduct(null);
                  }}
                />

                <CheckoutModal
                  isOpen={isCheckoutOpen}
                  onClose={() => setIsCheckoutOpen(false)}
                />

                {/* Chat Bot */}
                <ChatBot />
              </>
            )}
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;