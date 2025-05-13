import React from 'react';

const DestinationCard = ({ destination }) => {
  const handleDiscoverMore = () => {
    alert(`More details about ${destination.name}:\nHistory: ${destination.history}\nFood: ${destination.food}\nHotels: ${destination.hotels}\nCost: ${destination.cost}\nLocation: ${destination.location}`);
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-4">
      <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-pink-600">{destination.name}</h3>
        <p className="text-gray-600 mb-2"><strong>Historia:</strong> {destination.history}</p>
        <p className="text-gray-600 mb-2"><strong>Comida Típica:</strong> {destination.food}</p>
        <p className="text-gray-600 mb-2"><strong>Hoteles:</strong> {destination.hotels}</p>
        <p className="text-gray-600 mb-2"><strong>Costo:</strong> {destination.cost}</p>
        <p className="text-gray-600 mb-2"><strong>Ubicación:</strong> {destination.location}</p>
        <button
          onClick={handleDiscoverMore}
          className="mt-2 bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        >
          Descubre más
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;