import React, { useState } from 'react';
import Header from './components/Header';
import DestinationSection from './components/DestinationSection';
import Contact from './components/Contact';
import { initialDestinations, newDestinationTemplate } from './data/destinations';

const App = () => {
  const [destinations, setDestinations] = useState(initialDestinations);

  const addNewDestination = () => {
    setDestinations({
      ...destinations,
      culturalAdventures: [...destinations.culturalAdventures, newDestinationTemplate],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
   
      <Header />
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">¡Bienvenidos a Turismo Huarowilca!</h1>
        </div>
      </section>
      <DestinationSection title="Aventuras Culturales" destinations={destinations.culturalAdventures} />
      <DestinationSection title="Escapadas Naturales" destinations={destinations.natureEscapes} />
      <Contact />
    </div>
  );
};

export default App;