import React, { useState } from 'react';
import Header from './components/Header';
import Subscribe from './components/Subscribe';
import DestinationSection from './components/DestinationSection';
import Contact from './components/Contact';

const App = () => {
  const [destinations, setDestinations] = useState({
    culturalAdventures: [
      {
        name: 'Corana de la Inca (Ayapiteg)',
        image: 'https://via.placeholder.com/300x200?text=Corana+de+la+Inca',
        history: 'Ruinas antiguas con un legado cultural incaico, perfectas para los amantes de la historia.',
        food: 'Pachamanca, humitas.',
        hotels: 'Hotel Ayapiteg, Posada del Inca.',
        cost: 'S/150 por día',
        location: 'Ayapiteg, a 30 km de Huánuco',
        additionalImages: [
          { url: 'https://via.placeholder.com/300x200?text=Ayapiteg+1', caption: 'Vista aérea de las ruinas.' },
          { url: 'https://via.placeholder.com/300x200?text=Ayapiteg+2', caption: 'Ceremonia incaica reconstruida.' },
        ],
        directions: 'Toma la carretera Panamericana Norte desde Huánuco hacia el este por 30 km hasta llegar a Ayapiteg.',
        googleMapsLink: 'https://maps.google.com/?q=Ayapiteg,Huanuco,Peru',
        foodDetails: 'La pachamanca es un plato tradicional cocinado bajo tierra con piedras calientes, incluye carnes, papas y hierbas. Las humitas son tamales dulces hechos de maíz fresco.',
        dances: 'Danza de los Incas, que representa las ceremonias religiosas de la época incaica.',
        culturalHistory: 'Ayapiteg fue un asentamiento inca importante, conocido por sus terrazas agrícolas y templos dedicados al sol. La cultura inca aquí se destacó por su avanzada ingeniería y su conexión espiritual con la naturaleza.',
      },
      {
        name: 'Aparicio Pomares Chupan',
        image: 'https://via.placeholder.com/300x200?text=Aparicio+Pomares+Chupan',
        history: 'Sitio histórico con tradiciones locales que datan de siglos atrás.',
        food: 'Ají de gallina, anticuchos.',
        hotels: 'Chupan Hotel, Posada del Sol.',
        cost: 'S/180 por día',
        location: 'Aparicio Pomares Chupan, a 50 km de Huánuco',
        additionalImages: [
          { url: 'https://via.placeholder.com/300x200?text=Chupan+1', caption: 'Plaza principal de Chupan.' },
          { url: 'https://via.placeholder.com/300x200?text=Chupan+2', caption: 'Festival local en Chupan.' },
        ],
        directions: 'Desde Huánuco, toma la ruta hacia el sur por 50 km hasta llegar a Aparicio Pomares Chupan.',
        googleMapsLink: 'https://maps.google.com/?q=Aparicio+Pomares+Chupan,Huanuco,Peru',
        foodDetails: 'El ají de gallina es un guiso cremoso de pollo con ají amarillo. Los anticuchos son brochetas de corazón de res marinadas y asadas.',
        dances: 'Huaylarsh, una danza agrícola que celebra la cosecha.',
        culturalHistory: 'Chupan tiene raíces en las tradiciones agrícolas precolombinas. Su cultura se formó alrededor de la agricultura y festividades que honran la fertilidad de la tierra.',
      },
    ],
    natureEscapes: [
      {
        name: 'Chavinillo/Mazur',
        image: 'https://via.placeholder.com/300x200?text=Chavinillo+Mazur',
        history: 'Zona conocida por su belleza natural y rutas de senderismo.',
        food: 'Trucha frita, sopa de quinoa.',
        hotels: 'Hostal Chavin, Eco Lodge.',
        cost: 'S/120 por día',
        location: 'Chavinillo, a 40 km de Huánuco',
        additionalImages: [
          { url: 'https://via.placeholder.com/300x200?text=Chavinillo+1', caption: 'Senderos de Mazur.' },
          { url: 'https://via.placeholder.com/300x200?text=Chavinillo+2', caption: 'Río cristalino en Chavinillo.' },
        ],
        directions: 'Conduce 40 km al norte de Huánuco por la carretera hacia Chavinillo.',
        googleMapsLink: 'https://maps.google.com/?q=Chavinillo,Huanuco,Peru',
        foodDetails: 'La trucha frita se prepara con pescado fresco de los ríos locales, acompañada de papas. La sopa de quinoa es un plato nutritivo con verduras y hierbas.',
        dances: 'Danza de los Negritos, una danza folclórica que celebra la naturaleza.',
        culturalHistory: 'Chavinillo ha sido un refugio natural desde tiempos ancestrales, habitado por comunidades que veneraban los ríos y montañas como deidades.',
      },
      {
        name: 'Chorras Garu',
        image: 'https://via.placeholder.com/300x200?text=Chorras+Garu',
        history: 'Área famosa por sus paisajes montañosos y ríos cristalinos.',
        food: 'Ceviche de trucha, choclo con queso.',
        hotels: 'Garu Inn, Mountain Lodge.',
        cost: 'S/130 por día',
        location: 'Chorras Garu, a 45 km de Huánuco',
        additionalImages: [
          { url: 'https://via.placeholder.com/300x200?text=Chorras+1', caption: 'Montañas de Chorras Garu.' },
          { url: 'https://via.placeholder.com/300x200?text=Chorras+2', caption: 'Cascada en Chorras Garu.' },
        ],
        directions: 'Toma la ruta hacia el oeste desde Huánuco por 45 km hasta Chorras Garu.',
        googleMapsLink: 'https://maps.google.com/?q=Chorras+Garu,Huanuco,Peru',
        foodDetails: 'El ceviche de trucha se hace con pescado fresco, limón y ají. El choclo con queso es un aperitivo simple pero delicioso.',
        dances: 'Marinera norteña, una danza elegante que refleja la alegría de la región.',
        culturalHistory: 'Chorras Garu ha sido un lugar de retiro espiritual para las comunidades locales, quienes desarrollaron una cultura profundamente conectada con los ciclos de la naturaleza.',
      },
    ],
  });

  const addNewDestination = () => {
    const newDest = {
      name: 'New Destination',
      image: 'https://via.placeholder.com/300x200?text=New+Dest',
      history: 'A newly added historical site.',
      food: 'Local delicacy.',
      hotels: 'New Hotel.',
      cost: 'S/100 por día',
      location: 'New Location',
      additionalImages: [
        { url: 'https://via.placeholder.com/300x200?text=New+Dest+1', caption: 'Vista general.' },
        { url: 'https://via.placeholder.com/300x200?text=New+Dest+2', caption: 'Cultura local.' },
      ],
      directions: 'Toma la ruta principal desde Huánuco.',
      googleMapsLink: 'https://maps.google.com/?q=Huanuco,Peru',
      foodDetails: 'Platos tradicionales de la región.',
      dances: 'Danzas típicas de la zona.',
      culturalHistory: 'Historia cultural de la nueva destinación.',
    };
    setDestinations({
      ...destinations,
      culturalAdventures: [...destinations.culturalAdventures, newDest],
    });
  };

  return (
    <div>
      <Header />
      <Subscribe />
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="title is-1">¡Bienvenidos a Turismo Huarowilca!</h1>
          <button onClick={addNewDestination} className="pulse-button">
            Añadir Nuevo Destino
          </button>
        </div>
      </section>
      <DestinationSection title="Aventuras Culturales" destinations={destinations.culturalAdventures} />
      <DestinationSection title="Escapadas Naturales" destinations={destinations.natureEscapes} />
      <Contact />
    </div>
  );
};

export default App;