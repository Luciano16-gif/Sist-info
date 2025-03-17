import { routes_background } from '../../../constants/LandingData';
import { RouteCard } from './RouteCard';
import { useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useExperiences } from '../../hooks/experiences-hooks/useExperiences';
import LoadingOverlay from '../../common/LoadingOverlay';

const RoutesSection = () => {
  const { currentUser } = useAuth();
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch experiences data from API
  const { experiences, loading, error } = useExperiences();

  // Filter for only accepted experiences
  const acceptedExperiences = useMemo(() => {
    if (!experiences || experiences.length === 0) return [];
    
    return experiences.filter(exp => {
      // Check if rawData exists and has status
      if (exp.rawData) {
        // Include experiences with 'accepted' status or no status (for backward compatibility)
        return exp.rawData.status === 'accepted' || exp.rawData.status === undefined;
      }
      return true; // Include experiences without rawData (shouldn't happen, but just in case)
    });
  }, [experiences]);

  // Limit routes to maximum of 8
  const displayedRoutes = useMemo(() => {
    return acceptedExperiences.slice(0, 8);
  }, [acceptedExperiences]);

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

  // Navigate to experiences page
  const handleViewAllRoutes = () => {
    navigate('/experiencias');
  };
  
  // Navigate to booking page for specific experience
  const handleViewExperience = (experience) => {
    navigate('/booking', { state: { experience } });
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Loading Overlay for initial loading only */}
      <LoadingOverlay 
        isLoading={loading} 
        message="Cargando experiencias..."
        opacity={70}
      />
      
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-800 bg-opacity-70 text-white p-4 mb-6 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Scroll controls - Only show when we have routes */}
          {displayedRoutes.length > 0 && (
            <div className="flex justify-end mb-4 gap-2 max-w-full mx-auto px-4">
              <button 
                onClick={() => handleScroll('left')} 
                className="bg-[rgba(45,55,41,0.7)] p-2 rounded-full hover:bg-[rgba(45,55,41,1)] transition-all"
                aria-label="Scroll left"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => handleScroll('right')} 
                className="bg-[rgba(45,55,41,0.7)] p-2 rounded-full hover:bg-[rgba(45,55,41,1)] transition-all"
                aria-label="Scroll right"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Render content based on state */}
          {displayedRoutes.length > 0 ? (
            /* Horizontal scrollable container with fixed height */
            <div className="relative max-w-full mx-auto overflow-hidden">
              {/* Gradient indicators for scroll - matched to card height */}
              <div className="absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-[rgba(13,24,6,0.8)] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-[rgba(13,24,6,0.8)] to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrollable routes container - Fixed height with consistent card heights */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-6 scrollbar-hide h-[450px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 px-6">
                  {displayedRoutes.map((experience) => (
                    <div key={experience.id} className="flex-shrink-0 w-72 sm:w-80 h-[430px]">
                      <div 
                        className="h-full cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-200"
                        onClick={() => handleViewExperience(experience)}
                      >
                        <RouteCard
                          image={experience.imageUrl}
                          index={experience.name}
                          difficulty={experience.difficulty || 0}
                          length={experience.distance ? parseInt(experience.distance) : 0}
                          rating={experience.rating || 0}
                          time={experience.time || ''}
                          spots={experience.availableSlots || 0}
                          maxSpots={experience.maxPeople || 10}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !loading && (
            /* Empty state */
            <div className="bg-[rgba(25,39,15,0.8)] rounded-2xl p-6 text-center">
              <p className="text-xl">No hay experiencias disponibles en este momento.</p>
              <p className="mt-2">¡Vuelve pronto para descubrir nuevas aventuras!</p>
            </div>
          )}

          {/* View all routes button - Now linked to experiences page */}
          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllRoutes}
              className="py-2 px-6 bg-[rgba(45,55,41,0.7)] hover:bg-[rgba(45,55,41,1)] rounded-lg text-white transition-all font-medium"
            >
              VER TODAS LAS EXPERIENCIAS
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