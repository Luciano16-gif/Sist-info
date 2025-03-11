import { routes_background, routesData } from '../../../constants/LandingData';
import { RouteCard } from './RouteCard';
import { useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RoutesSection = () => {
  const { currentUser } = useAuth();
  const scrollContainerRef = useRef(null);

  // Limit routes to maximum of 8
  const displayedRoutes = useMemo(() => {
    return routesData.slice(0, 8);
  }, [routesData]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Update to correct Tailwind width: w-72 is 288px, not 272px
      const cardWidth = window.innerWidth < 640 ? 288 : 320; // Match card width (w-72 or w-80)
      const gapWidth = 24; // 6 in Tailwind equals 24px (gap-6)
      const itemWidth = cardWidth + gapWidth; // Full item width (card + gap)
      
      // Calculate current scroll position
      const scrollPosition = current.scrollLeft;
      
      // This ensures we always snap to the start of a card by using floor
      const currentCardIndex = Math.floor(scrollPosition / itemWidth);
      
      // Calculate the target card index based on direction
      const targetCardIndex = direction === 'left' 
        ? Math.max(currentCardIndex - 1, 0) 
        : currentCardIndex + 1;
      
      // Get total number of cards
      const totalCards = displayedRoutes.length;
      
      // Ensure we don't scroll past the last card
      const boundedTargetIndex = Math.min(targetCardIndex, totalCards - 1);
      
      // Scroll to that exact card position
      const targetScrollPosition = boundedTargetIndex * itemWidth;
      
      current.scrollTo({ 
        left: targetScrollPosition, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Layer - Lower z-index */}
      <div 
        className="absolute inset-0" 
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
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-t from-transparent to-[rgba(13,24,6,1)] pointer-events-none"></div>
        
        {/* Bottom gradient overlay for fade effect */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none"></div>
      </div>
      
      {/* Content Layer - Higher z-index */}
      <div className="relative text-white z-40 h-full">
        <div className="container mx-auto h-full px-4 sm:px-8 py-24 md:py-32">
          {/* Section header */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Rutas ideales para ti!</h2>
            <p className="text-lg">Echa un vistazo y escoge tu próxima aventura...</p>
          </div>

          {/* Scroll controls */}
          <div className="flex justify-end mb-4 gap-2 max-w-full mx-auto px-4">
            <button 
              onClick={() => handleScroll('left')} 
              className="bg-[rgba(45,55,41,0.7)] p-2 rounded-full hover:bg-[rgba(45,55,41,1)] transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => handleScroll('right')} 
              className="bg-[rgba(45,55,41,0.7)] p-2 rounded-full hover:bg-[rgba(45,55,41,1)] transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Horizontal scrollable container */}
          <div className="relative max-w-full mx-auto overflow-hidden">
            {/* Gradient indicators for scroll - matched to card height */}
            <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[rgba(13,24,6,0.8)] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[rgba(13,24,6,0.8)] to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable routes container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-6 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6 px-6">
                {displayedRoutes.map((route) => (
                  <div key={route.id} className="flex-shrink-0 w-72 sm:w-80">
                    <RouteCard
                      image={route.image}
                      index={route.id}
                      difficulty={route.difficulty}
                      length={route.length}
                      rating={route.rating}
                      time={route.time}
                      spots={route.availableSlots}
                      maxSpots={route.totalSlots}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View all routes button */}
          <div className="text-center mt-12">
            <button className="py-2 px-4 text-white hover:underline transition-all font-medium">
              VER TODAS LAS RUTAS 
            </button>
          </div>
        </div>
        { !currentUser ? (
          <div className="text-center pb-6 pt-12">
            <div className="text-sm">
              ©2025 | ÁvilaVenturas all right reserved
            </div>
          </div>
        ) : null }
          
      </div>
    </div>
  );
};

export default RoutesSection;