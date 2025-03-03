import React from 'react';
import { routes_background, cards } from '../../constants/LandingData';

// RatingIndicator component for showing dots
const RatingIndicator = ({ value, max = 5 }) => {
  return (
    <div className="flex">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full mx-0.5 ${i < value ? 'bg-white' : 'bg-white bg-opacity-30'}`}
        />
      ))}
    </div>
  );
};

// RouteCard component
const RouteCard = ({ image, index, difficulty, length, rating, spots, maxSpots }) => {
  return (
    <div className="flex flex-col">
      {/* Card image */}
      <img src={image} alt={`Ruta ${index}`} className="w-full h-40 object-cover rounded-t-lg" />

      {/* Card content with white transparent background and more rounded bottom */}
      <div className="bg-white bg-opacity-10 p-4 rounded-b-2xl"> 
        <h3 className="text-2xl font-bold text-center mb-4">Ruta {index}</h3>

        {/* Route details */}
        <div className="space-y-3">
          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Dificultad</span>
            </div>
            <RatingIndicator value={difficulty} />
          </div>

          {/* Length */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <span>Longitud</span>
            </div>
            <RatingIndicator value={length} />
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Puntuación</span>
            </div>
            <RatingIndicator value={rating} />
          </div>

          {/* Schedule */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              <span>Horario</span>
            </div>
            <span>7:00AM - 3:00PM</span>
          </div>
        </div>

        {/* Available spots */}
        <div className="flex items-center justify-center mt-4 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4M12 16h.01" />
          </svg>
          <span>Cupos disponibles</span>
          <div className="ml-2 flex items-center">
            <span className="bg-yellow-500 rounded-full w-2.5 h-2.5 mr-1"></span>
            <span>{spots}/{maxSpots}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoutesSection = () => {
  // Sample data for routes
  const routesData = [
    { difficulty: 3, length: 3, rating: 5, spots: 20, maxSpots: 40 },
    { difficulty: 4, length: 4, rating: 5, spots: 20, maxSpots: 40 },
    { difficulty: 3, length: 3, rating: 5, spots: 20, maxSpots: 40 }
  ];

  return (
    <div
      className="relative w-full min-h-screen text-white"
      style={{
        backgroundImage: `url(${routes_background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(13,24,6,0.3)',
        zIndex: 1
      }}
    >
      {/* Top gradient overlay for fade effect */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-t from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>

      <div className="container mx-auto relative z-20 h-full px-4 sm:px-8 py-24 md:py-32">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Rutas ideales para ti!</h2>
          <p className="text-lg">Echa un vistazo y escoge tu próxima aventura...</p>
        </div>

        {/* Routes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <RouteCard
              key={index}
              image={card}
              index={index + 1}
              difficulty={routesData[index].difficulty}
              length={routesData[index].length}
              rating={routesData[index].rating}
              spots={routesData[index].spots}
              maxSpots={routesData[index].maxSpots}
            />
          ))}
        </div>

        {/* View all routes button */}
        <div className="text-center mt-12">
          <button className="py-2 px-4 text-white hover:underline transition-all font-medium">
            VER TODAS LAS RUTAS 
          </button>
        </div>
      </div>

      {/* Bottom gradient overlay for fade effect - show on all pages except the last */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>

      {/* Bottom gradient overlay for fade effect */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>
    </div>
  );
};

export default RoutesSection;