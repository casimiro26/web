import React, { useState } from 'react';
import Header from './components/Header';
import DestinationSection from './components/DestinationSection';
import Contact from './components/Contact';

const App = () => {
  const [destinations, setDestinations] = useState({
    culturalAdventures: [
      {
        name: 'Corana de la Inca (Ayapiteg)',
        image: 'https://th.bing.com/th/id/R.bc3adcb8079f186345aa577303a91a07?rik=X9lZg9xfXrwKzw&riu=http%3a%2f%2fexpresointernacional.com%2fsites%2fdefault%2ffiles%2fstyles%2fdestinos_page_colorbox%2fpublic%2fhuanuco2.jpg%3fitok%3dhxUlO7Pd&ehk=Qtt1J6qcIq4GGr6K3wzmsDOqIJZA6bxIDRu0c4Zc1RY%3d&risl=&pid=ImgRaw&r=0',
        history: 'Ruinas antiguas con un legado cultural incaico, perfectas para los amantes de la historia.',
        food: 'Pachamanca, humitas.',
        hotels: 'Hotel Ayapiteg, Posada del Inca.',
        cost: 'S/150 por día',
        location: 'Ayapiteg, a 30 km de Huánuco'
      },
      {
        name: 'Aparicio Pomares Chupan (castillo de chupan)',
        image: 'https://pbs.twimg.com/media/FY2OGetXkAMNqxd.jpg',
        history: 'Sitio histórico con tradiciones locales que datan de siglos atrás.',
        food: 'Ají de gallina, anticuchos.',
        hotels: 'Chupan Hotel, Posada del Sol.',
        cost: 'S/180 por día',
        location: 'Aparicio Pomares Chupan, a 50 km de Huánuco'
      }
    ],
    natureEscapes: [
      {
        name: 'Chavinillo/Mazur',
        image: 'https://th.bing.com/th/id/R.d6ccb6b3ae6ee5af0abc1e60e74187d9?rik=wEFGHXlK%2fmNm5Q&riu=http%3a%2f%2f1.bp.blogspot.com%2f-2wfj2hAesNA%2fVAOAQO-DGCI%2fAAAAAAAAFZw%2fQQptGNjYlVo%2fs1600%2fmazur1.jpg&ehk=IjhqoKXaZzW%2fJRzhIqNoic%2bwS61Jq4I6p2rQPJ2SLag%3d&risl=&pid=ImgRaw&r=0',
        history: 'Zona conocida por su belleza natural y rutas de senderismo.',
        food: 'Trucha frita, sopa de quinoa.',
        hotels: 'Hostal Chavin, Eco Lodge.',
        cost: 'S/120 por día',
        location: 'Chavinillo, a 40 km de Huánuco'
      },
      {
        name: 'Chorras Garu',
        image: 'https://1.bp.blogspot.com/-prib1xxsPto/WhdpYvQOY3I/AAAAAAABDPo/6BuFYWKrRUILTMiJTBZQyTuB7cdydIN0ACLcBGAs/s1600/complejo-arqueologico-garu93.jpg',
        history: 'Área famosa por sus paisajes montañosos y ríos cristalinos.',
        food: 'Ceviche de trucha, choclo con queso.',
        hotels: 'Garu Inn, Mountain Lodge.',
        cost: 'S/130 por día',
        location: 'Chorras Garu, a 45 km de Huánuco'
      }
    ]
  });

  const addNewDestination = () => {
    const newDest = {
      name: 'New Destination',
      image: 'https://photomkt.com/wp-content/uploads/2018/10/FullFrame-Photomkt-Portafolio-Cover-Tierra-A-La-Vista1.jpg',
      history: 'A newly added historical site.',
      food: 'Local delicacy.',
      hotels: 'New Hotel.',
      cost: 'S/100 por día',
      location: 'New Location'
    };
    setDestinations({
      ...destinations,
      culturalAdventures: [...destinations.culturalAdventures, newDest]
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-4">¡Hola, Turismo Huarowilca!</h1>
      <Header />
      <button onClick={addNewDestination} className="m-4 bg-pink-500 text-white p-2 rounded hover:bg-pink-600">
        Add New Destination
      </button>
      <DestinationSection title="Aventuras Culturales" destinations={destinations.culturalAdventures} />
      <DestinationSection title="Escapadas Naturales" destinations={destinations.natureEscapes} />
      <Contact />
    </div>
  );
};

export default App;