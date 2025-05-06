import React from 'react';

const Contact = () => {
  return (
    <footer className="bg-pink-100 p-4 flex justify-between items-center">
      <div>
        <p className="text-gray-600">Turismo Yarowilca</p>
        <p className="text-gray-600">Huánuco, Perú</p>
        <p className="text-gray-600">Tel: (01) 6237</p>
        <p className="text-gray-600">
          Email: <a href="mailto:info@turismoYarowilca.com" className="text-pink-600 hover:underline">info@turismoYarowilca.com</a>
        </p>
      </div>
      <div className="flex space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">YouTube</a>
      </div>
    </footer>
  );
};

export default Contact;