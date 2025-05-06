import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationSection = ({ title, destinations }) => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-2 has-text-centered">{title}</h2>
        <div className="columns is-multiline">
          {destinations.map((dest, index) => (
            <div key={index} className="column is-one-third">
              <DestinationCard destination={dest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;