import React from 'react';

const Contact = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-orange-400 py-8">
      <div className="container mx-auto text-center text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-bold">Turismo Yarowilca</p>
            <p>Huánuco, Perú</p>
            <p>Tel: (01) 6237</p>
            <p>
              Email: <a href="mailto:info@turismoYarowilca.com" className="hover:underline">info@turismoYarowilca.com</a>
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;