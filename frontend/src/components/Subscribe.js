import React, { useState } from 'react';

const Header = () => {
  const [activeLink, setActiveLink] = useState('Hogar');

  const handleNavClick = (link) => {
    setActiveLink(link);
    alert(`Navigating to ${link}`);
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-orange-400 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="https://via.placeholder.com/50?text=Logo" alt="Agency Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-white">Turismo Huarowilca</h1>
        </div>
        <nav className="flex space-x-4">
          {['Hogar', 'Proyectos Sostenibles', 'Pase de Parque Tassie', 'Espíritu de Tasmania', 'Más', 'Buscar...', 'Carrito (0)'].map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`text-white hover:underline ${activeLink === link ? 'font-bold' : ''}`}
            >
              {link}
            </button>
          ))}
        </nav>
        <div className="flex space-x-4">
          <button onClick={() => alert('Subscription form opened!')} className="pulse-button">
            Suscríbete
          </button>
          <a href="mailto:info@turismohuarowilca.com" className="pulse-button">
            info@turismohuarowilca.com
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;