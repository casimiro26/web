import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationSection = ({ title, destinations }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest, index) => (
          <DestinationCard key={index} destination={dest} />
        ))}
      </div>
    </div>
  );
};

export default DestinationSection;