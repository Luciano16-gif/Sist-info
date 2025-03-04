import React, { useState, useEffect } from 'react';
import { gallery, EXPLORE_TEXTS, explore_image } from '../../constants/LandingData';

const ExploreSection = () => {
  // Enhanced animation states for smoother transitions
  const [imageOrder, setImageOrder] = useState([...Array(gallery.length).keys()]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textFade, setTextFade] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(null); // 'next' or 'prev'
  const [exitingImageIndex, setExitingImageIndex] = useState(null);
  
  // Current front image index
  const currentFrontIndex = imageOrder[0];

  // Emergency reset for animation state
  useEffect(() => {
    let safetyTimer;
    if (isAnimating) {
      safetyTimer = setTimeout(() => {
        setIsAnimating(false);
        setTransitionDirection(null);
        setExitingImageIndex(null);
      }, 1200); // Reset animation state after 1.2s in case of issues
    }
    return () => clearTimeout(safetyTimer);
  }, [isAnimating]);
  
  // Update text with animation when front image changes
  useEffect(() => {
    // Fade out text
    setTextFade(true);
    
    // After fade out, update text and fade back in
    const timeout = setTimeout(() => {
      setCurrentTextIndex(currentFrontIndex);
      setTextFade(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [currentFrontIndex]);

  // More reliable event handlers with smoother animations
  const handlePrev = () => {
    if (isAnimating) return;
    
    // Set animation states
    setIsAnimating(true);
    setTransitionDirection('prev');
    
    // Store both current last image and current front image for animation
    const lastIndex = imageOrder[imageOrder.length - 1];
    const frontIndex = imageOrder[0]; // Also store front index for proper animation
    
    // Set both indexes for proper animation
    setExitingImageIndex({ 
      back: lastIndex,  // The back image moving to front
      front: frontIndex // The front image that needs to move back
    });
    
    // Keep the front image fully visible during the start of the animation
    // Delay the reordering operation to control the timing
    const reorderDelay = 400; // Increased delay for slower animation
    
    setTimeout(() => {
      // Move the last image (furthest back) to the front
      setImageOrder(prevOrder => {
        const newOrder = [...prevOrder];
        const lastItem = newOrder.pop(); // Remove the last item
        return [lastItem, ...newOrder]; // Add it to the front
      });
    }, reorderDelay);
    
    // Release animation lock and clear states after animation completes
    // Using a single longer timeout to prevent hiccups at the end
    setTimeout(() => {
      setExitingImageIndex(null);
      setIsAnimating(false);
      setTransitionDirection(null);
    }, 850); // Increased duration
  };

      const handleNext = () => {
    if (isAnimating) return;
    
    // Set animation states
    setIsAnimating(true);
    setTransitionDirection('next');
    
    // Store current front image for animation
    const frontIndex = imageOrder[0];
    setExitingImageIndex({ front: frontIndex });
    
    // Keep the exiting state for a while to let the animation play
    setTimeout(() => {
      // Move the first image (front) to the back
      setImageOrder(prevOrder => {
        const newOrder = [...prevOrder];
        const firstItem = newOrder.shift(); // Remove the first item
        return [...newOrder, firstItem]; // Add it to the back
      });
    }, 450); // Slightly slower
    
    // Finally clear all animation states with a single timeout
    setTimeout(() => {
      setExitingImageIndex(null);
      setIsAnimating(false);
      setTransitionDirection(null);
    }, 850); // Match the prev animation duration
  };

  return (
    <div 
      className="relative w-full min-h-screen text-white"
      style={{
        backgroundImage: `url(${explore_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(13,24,6,0.3)',
        zIndex: 1
      }}
    >
      {/* CSS animations for the carousel transitions */}
      <style jsx>{`
        /* Improved keyframes for delayed opacity change on prev transition */
        @keyframes prevFadeOutDelay {
          0%, 65% { opacity: 1; } /* Keep full opacity for 65% of the animation */
          100% { opacity: 0.3; }  /* Then fade to background level */
        }
        
        /* Animation for the incoming image from the back */
        @keyframes prevFadeInDelay {
          0% { opacity: 0.3; transform: translateX(${gallery.length * 30}px) translateY(${gallery.length * 12}px) scale(${Math.max(0.75, 1 - gallery.length * 0.07)}) rotate(${gallery.length * -1}deg); }
          30% { opacity: 0.7; }
          80% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotate(0); } /* Position reached earlier */
          100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotate(0); } /* Hold final position */
        }
      `}</style>
      
      {/* Top gradient overlay for fade effect */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-t from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>
      
      <div className="container mx-auto relative z-20 h-full px-4 sm:px-8 py-24 md:py-32 flex items-center">
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between h-full w-full">
          {/* Text content */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 flex flex-col justify-center">
            <div className={`transition-opacity duration-300 ease-in-out ${textFade ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                {EXPLORE_TEXTS[currentTextIndex].title}
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mt-2">
                {EXPLORE_TEXTS[currentTextIndex].subtitle}
              </h3>
              <p className="text-base md:text-lg mt-6 text-gray-300">
                {EXPLORE_TEXTS[currentTextIndex].description}
              </p>
              <div className="pt-8">
                <a href="#gallery" className="text-sm md:text-base hover:underline">
                  Ver galería de fotos &gt;
                </a>
              </div>
            </div>
          </div>
          
          {/* Gallery carousel - improved spacing */}
          <div className="w-full md:w-1/2 h-[350px] md:h-[400px] relative">
            {/* Images with better depth effect and smooth animation */}
            <div className="relative w-full h-full perspective-1000">
              {imageOrder.map((imgIndex, orderIndex) => {
                // Enhanced visual properties for better depth effect
                const zIndex = gallery.length - orderIndex;
                const opacity = Math.max(0.3, 1 - orderIndex * 0.18); // Steeper opacity falloff
                const scale = Math.max(0.75, 1 - orderIndex * 0.07); // More pronounced scaling
                const translateX = orderIndex * 30; // Increased horizontal offset
                const translateY = orderIndex * 12; // Increased vertical offset
                const rotate = orderIndex * -1; // Slight rotation for depth
                
                // Special animation for the transitioning image
                let animationStyles = {};
                
                // Front image moving to back (next button)
                if (transitionDirection === 'next' && exitingImageIndex?.front === imgIndex) {
                  animationStyles = {
                    transform: `translateX(${gallery.length * 35}px) translateY(${gallery.length * 15}px) scale(0.7) rotate(${-gallery.length * 1.5}deg)`,
                    opacity: 0.6, // Keep more visible during transition
                    zIndex: 0, // Set to back immediately
                    transition: 'transform 650ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 400ms ease-out', // Slower, smoother transition
                    willChange: 'transform, opacity' // Performance optimization
                  };
                } 
                // Back image moving to front (prev button)
                else if (transitionDirection === 'prev' && exitingImageIndex?.back === imgIndex) {
                  animationStyles = {
                    zIndex: gallery.length + 1,
                    animation: 'prevFadeInDelay 750ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                    willChange: 'transform, opacity' // Performance optimization
                  };
                }
                // Current front image when prev button is pressed
                else if (transitionDirection === 'prev' && exitingImageIndex?.front === imgIndex) {
                  // Apply the delayed fade out animation
                  animationStyles = {
                    zIndex: gallery.length - 1, // Just below the incoming card
                    animation: 'prevFadeOutDelay 700ms ease-out forwards',
                    willChange: 'opacity', // Performance optimization
                    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                  };
                }
                
                return (
                  <div
                    key={imgIndex}
                    className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out rounded-lg shadow-2xl"
                    style={{
                      zIndex,
                      opacity,
                      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                      transformOrigin: 'center center',
                      boxShadow: orderIndex === 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                      ...animationStyles
                    }}
                  >
                    <img 
                      src={gallery[imgIndex]} 
                      alt={`Aventura en El Ávila ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Navigation arrows with better disabling during animation */}
            <div 
              role="button"
              tabIndex={isAnimating ? -1 : 0}
              onClick={isAnimating ? null : handlePrev}
              onKeyDown={(e) => e.key === 'Enter' && !isAnimating && handlePrev()}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-all duration-300 ${isAnimating ? 'opacity-40' : 'opacity-100 hover:bg-white hover:bg-opacity-30'}`}
              aria-label="Previous image"
              aria-disabled={isAnimating}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                pointerEvents: isAnimating ? 'none' : 'auto',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
              }}
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </div>
            <div 
              role="button"
              tabIndex={isAnimating ? -1 : 0}
              onClick={isAnimating ? null : handleNext}
              onKeyDown={(e) => e.key === 'Enter' && !isAnimating && handleNext()}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-all duration-300 ${isAnimating ? 'opacity-40' : 'opacity-100 hover:bg-white hover:bg-opacity-30'}`}
              aria-label="Next image"
              aria-disabled={isAnimating}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                pointerEvents: isAnimating ? 'none' : 'auto',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
              }}
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient overlay for fade effect */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-10"></div>
    </div>
  );
};

export default ExploreSection;