import React, { useState } from 'react';

const Header = () => {
  const [activeLink, setActiveLink] = useState('Hogar');

  const handleNavClick = (link) => {
    setActiveLink(link);
    alert(`Navigating to ${link}`);
  };

  return (
    <header className="bg-pink-100 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="https://th.bing.com/th/id/OIP.SPxngas2ax8C6gpfGDcSkQHaHa?cb=iwp1&rs=1&pid=ImgDetMain" alt="Agency Logo" className="mr-2" />
        <h1 className="text-xl font-bold text-pink-600">Turismo Yarowilca</h1>
      </div>
      <nav className="space-x-4">
        {['Inicio', 'Destinos', 'Fiestas', 'Comida', 'Cultura', 'Más', 'Buscar', 'Ruta (0)'].map((link) => (
          <button
            key={link}
            onClick={() => handleNavClick(link)}
            className={`text-pink-600 hover:underline ${activeLink === link ? 'font-bold' : ''}`}
          >
            {link}
          </button>
        ))}
      </nav>
      <div>
        <button onClick={() => alert('Subscription form opened!')} className="text-pink-600 hover:underline">
          Suscríbete
        </button>
        <span className="mx-2">|</span>
        <a href="mailto:info@turismohuarowilca.com" className="text-pink-600 hover:underline">
          info@turismoYarowilca.com
        </a>
      </div>
    </header>
  );
};

export default Header;