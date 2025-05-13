import React, { useRef, useEffect } from 'react';
import DestinationCard from './DestinationCard';

const DestinationSection = ({ title, destinations }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let animationFrameId = null;

    const handleMouseMove = (e) => {
      if (!carousel) return;

      const rect = carousel.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const threshold = 50; // Umbral cerca de los bordes (en píxeles)
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const speed = 5; // Aumentamos la velocidad a 5 para mover más rápido

      // Si el mouse está cerca del inicio (izquierda)
      if (mouseX < threshold) {
        const scrollAmount = speed;
        const newScrollLeft = carousel.scrollLeft - scrollAmount;
        if (newScrollLeft >= 0) {
          carousel.scrollLeft = newScrollLeft;
        } else {
          carousel.scrollLeft = 0;
        }
      }
      // Si el mouse está cerca del final (derecha)
      else if (mouseX > rect.width - threshold) {
        const scrollAmount = speed;
        const newScrollLeft = carousel.scrollLeft + scrollAmount;
        if (newScrollLeft <= maxScroll) {
          carousel.scrollLeft = newScrollLeft;
        } else {
          carousel.scrollLeft = maxScroll;
        }
      }

      // Cancela el frame anterior y solicita uno nuevo
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => handleMouseMove(e));
    };

    carousel.addEventListener('mousemove', handleMouseMove);

    // Limpieza al desmontar el componente
    return () => {
      carousel.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{title}</h2>
        <div
          ref={carouselRef}
          className="flex overflow-hidden space-x-6 p-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {destinations.map((dest, index) => (
            <div key={index} className="flex-shrink-0 w-1/3">
              <DestinationCard destination={dest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;