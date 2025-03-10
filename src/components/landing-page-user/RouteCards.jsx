import React from 'react';
//import { BackgroundCircles } from './BackgroundElements';
import RouteCard from './RouteCard';
import { routesData } from '../../constants/LandingUserData';

const RouteCards = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef(null);

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; // Ajusta este valor según sea necesario
    }
  };

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300; // Ajusta este valor según sea necesario
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white"
      style={{
        backgroundImage: `url('https://via.placeholder.com/1920x1080')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(13,24,6,0.3)',
        zIndex: 1
      }}
    >
      {/* Top gradient overlay for fade effect */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-t from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>

      <div className="container mx-auto relative z-20 px-4 sm:px-8 py-10 md:py-10 flex items-center">
        {/* Gallery carousel with horizontal scroll */}
        <div className="w-full relative">
          {/* Scrollable container */}
          <div className="overflow-x-auto whitespace-nowrap" ref={containerRef}>
            <div className="flex space-x-4">
              {routesData.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <div
            role="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-colors duration-150"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', cursor: 'pointer' }}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </div>
          <div
            role="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-colors duration-150"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', cursor: 'pointer' }}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay for fade effect */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>
    </div>
  );
};

export default RouteCards;