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
    
    // Store current last image for animation
    const lastIndex = imageOrder[imageOrder.length - 1];
    setExitingImageIndex(lastIndex);
    
    // After a short delay to allow exit animation to start
    setTimeout(() => {
      // Move the last image (furthest back) to the front
      setImageOrder(prevOrder => {
        const newOrder = [...prevOrder];
        const lastItem = newOrder.pop(); // Remove the last item
        return [lastItem, ...newOrder]; // Add it to the front
      });
      
      // Clear exiting image marker
      setExitingImageIndex(null);
    }, 50);
    
    // Release animation lock after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTransitionDirection(null);
    }, 700);
    
    // Safety timeout in case the animation gets stuck
    const safetyTimer = setTimeout(() => {
      clearTimeout(timer);
      setIsAnimating(false);
      setTransitionDirection(null);
      setExitingImageIndex(null);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    // Set animation states
    setIsAnimating(true);
    setTransitionDirection('next');
    
    // Store current front image for animation
    const frontIndex = imageOrder[0];
    setExitingImageIndex(frontIndex);
    
    // After a short delay to allow exit animation to start
    setTimeout(() => {
      // Move the first image (front) to the back
      setImageOrder(prevOrder => {
        const newOrder = [...prevOrder];
        const firstItem = newOrder.shift(); // Remove the first item
        return [...newOrder, firstItem]; // Add it to the back
      });
      
      // Clear exiting image marker
      setExitingImageIndex(null);
    }, 50);
    
    // Release animation lock after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTransitionDirection(null);
    }, 700);
    
    // Safety timeout in case the animation gets stuck
    const safetyTimer = setTimeout(() => {
      clearTimeout(timer);
      setIsAnimating(false);
      setTransitionDirection(null);
      setExitingImageIndex(null);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
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
                if (transitionDirection === 'next' && exitingImageIndex === imgIndex) {
                  animationStyles = {
                    transform: `translateX(${gallery.length * 30}px) translateY(${gallery.length * 12}px) scale(0.6) rotate(${-gallery.length}deg)`,
                    opacity: 0.2,
                    zIndex: 0,
                    transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)'
                  };
                } 
                // Back image moving to front (prev button)
                else if (transitionDirection === 'prev' && exitingImageIndex === imgIndex) {
                  animationStyles = {
                    transform: `translateX(-30px) translateY(-12px) scale(1.05) rotate(1deg)`,
                    opacity: 0.2,
                    zIndex: gallery.length + 1,
                    transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)'
                  };
                }
                
                return (
                  <div
                    key={imgIndex}
                    className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out rounded-lg shadow-2xl"
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
            
            {/* Navigation arrows with visual feedback but no movement */}
            <div 
              role="button"
              tabIndex="0"
              onClick={!isAnimating ? handlePrev : undefined}
              onKeyDown={(e) => e.key === 'Enter' && !isAnimating && handlePrev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-colors duration-150"
              aria-label="Previous image"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                pointerEvents: isAnimating ? 'none' : 'auto',
                cursor: isAnimating ? 'default' : 'pointer',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </div>
            <div 
              role="button"
              tabIndex="0"
              onClick={!isAnimating ? handleNext : undefined}
              onKeyDown={(e) => e.key === 'Enter' && !isAnimating && handleNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-3 focus:outline-none select-none transition-colors duration-150"
              aria-label="Next image"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                pointerEvents: isAnimating ? 'none' : 'auto',
                cursor: isAnimating ? 'default' : 'pointer',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
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