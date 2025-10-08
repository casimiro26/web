import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Truck } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onAuthClick: () => void;
  onProductView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAuthClick, onProductView }) => {
  const { isAuthenticated, user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg',
      title: 'Auriculares Gaming Premium',
      subtitle: 'Experimenta el mejor sonido en tus partidas',
      discount: '30% OFF'
    },
    {
      url: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
      title: 'Monitores 4K Ultra HD',
      subtitle: 'Claridad excepcional para profesionales',
      discount: '25% OFF'
    },
    {
      url: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg',
      title: 'Accesorios Gaming',
      subtitle: 'Mouse y teclados mecánicos de alta precisión',
      discount: '20% OFF'
    }
  ];

  const featuredProducts = products.filter(p => p.isFeatured);
  const newProducts = products.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {isAuthenticated ? `¡Hola ${user?.name?.split(' ')[0]}!` : 'Bienvenido a Sr. Robot'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {isAuthenticated 
              ? 'Descubre los mejores accesorios tecnológicos para ti'
              : 'Inicia sesión para vivir la experiencia Sr. Robot'
            }
          </p>
          {!isAuthenticated && (
            <button
              onClick={onAuthClick}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Iniciar Sesión / Registrarse
            </button>
          )}
        </div>
      </section>

      {/* Carousel */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div>
                  <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                    {image.discount}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{image.title}</h2>
                  <p className="text-xl md:text-2xl mb-8">{image.subtitle}</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                    Ver Productos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-red-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Envío Gratis</h3>
              <p className="text-gray-600 dark:text-gray-400">En compras mayores a S/ 99 a todo el Perú</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-red-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Garantía Oficial</h3>
              <p className="text-gray-600 dark:text-gray-400">Productos originales con garantía del fabricante</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-red-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Soporte 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">Atención personalizada vía WhatsApp y chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Los accesorios más populares y mejor valorados por nuestros clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onProductView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-red-500 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Ofertas Exclusivas Todo el Mes!
          </h2>
          <p className="text-xl mb-8">
            Hasta 50% de descuento en accesorios gaming y tecnología
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Gaming</h3>
              <p className="text-lg">hasta -40%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Monitores</h3>
              <p className="text-lg">hasta -35%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Cables</h3>
              <p className="text-lg">hasta -25%</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Últimos Lanzamientos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Los productos más nuevos y innovadores del mercado tecnológico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onProductView}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¡No te pierdas nuestras ofertas!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Suscríbete a nuestro newsletter y recibe descuentos exclusivos y las últimas novedades tecnológicas
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="tu-email@gmail.com"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};