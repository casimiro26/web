import React from 'react';
import { Phone, Mail, MapPin, Shield, Truck, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
              src="sr. r.png" 
              alt="Sr. Robot logo featuring stylized robot face with the text Sr. Robot, conveying a friendly and modern technology store atmosphere" 
              className="w-10 h-10" 
              />
              <h3 className="text-xl font-bold animate-pulse text-red-500">Sr. Robot</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Tu tienda de confianza para accesorios tecnológicos de última generación. 
              Calidad garantizada y precios competitivos.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://w.app/wdebhf" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://web.facebook.com/p/Se%C3%B1or-Robot-100063654114002/?_rdc=1&_rdr#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://instagram.com/srrobot" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-8 h-8 hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-500">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-red-500" />
                <span>+51 975 167 294</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-red-500" />
                <span>SRROBOT@GMAIL.COM</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Huánuco, Perú</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-500">Enlaces</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Política de Devoluciones
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Zona Outlet
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Blog Tecnológico
              </a>
            </div>
          </div>

          {/* Garantías y Certificaciones */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-500">Garantías</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">Compra Segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Envío Gratis +S/99</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Pago Seguro</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                Certificado SSL • Pagos encriptados • Garantía de satisfacción
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Sr. Robot. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Symbol.png" alt="Visa" className="h-8" />
              <img src="https://www.interbank.pe/sites/default/files/logo-interbank.png" alt="Interbank" className="h-8" />
              <img src="https://www.viabcp.com/etc.clientlibs/viabcp/clientlibs/clientlib-site/resources/images/logo-bcp.svg" alt="BCP" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};