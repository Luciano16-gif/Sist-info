import { routes_background, cards, routesData } from '../../../constants/LandingData';
import { RouteCard } from './RouteCard';

const RoutesSection = () => {

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 max-w-6xl mx-auto">
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
      
      {/* Footer */}
      <div className="relative z-20 text-center pb-6 pt-12">
        {/* Copyright Text */}
        <div className="text-sm">
          ©2025 | ÁvilaVenturas all right reserved
        </div>
      </div>
    </div>
  );
};

export default RoutesSection;