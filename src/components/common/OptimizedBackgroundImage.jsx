import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook for optimizing background image loading to improve LCP performance
 * Handles progressive loading, placeholders, and preloading
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.imageSrc - Full resolution image source URL
 * @param {string} options.placeholderSrc - Optional tiny placeholder image (should be <10KB)
 * @param {string} options.fallbackColor - Background color to show before images load
 * @param {boolean} options.isPriority - Whether this is a critical image that needs priority loading
 * @param {function} options.onLoad - Optional callback for when image loads
 * @param {function} options.onError - Optional callback for loading errors
 * @returns {Object} Background states and styles
 */
export const useBackgroundImage = ({
  imageSrc,
  placeholderSrc = '',
  fallbackColor = 'rgba(13,24,6,1)',
  isPriority = false,
  onLoad = () => {},
  onError = () => {},
}) => {
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Handle preload for critical hero images
  useEffect(() => {
    if (isPriority && imageSrc) {
      // Create preload <link> element for browser prioritization
      const linkEl = document.createElement('link');
      linkEl.rel = 'preload';
      linkEl.href = imageSrc;
      linkEl.as = 'image';
      document.head.appendChild(linkEl);
      
      return () => {
        document.head.removeChild(linkEl);
      };
    }
  }, [imageSrc, isPriority]);

  // Load the main image
  useEffect(() => {
    if (!imageSrc) {
      setError('No image source provided');
      onError('No image source provided');
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      setMainImageLoaded(true);
      onLoad();
    };
    
    img.onerror = (e) => {
      const errorMsg = `Failed to load image: ${e.message || 'Unknown error'}`;
      setError(errorMsg);
      onError(errorMsg);
    };
    
    // Use fetchPriority if available (modern browsers)
    if (isPriority && 'fetchPriority' in HTMLImageElement.prototype) {
      img.fetchPriority = 'high';
    }
    
    img.src = imageSrc;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, isPriority, onLoad, onError]);

  // Load the placeholder image if provided
  useEffect(() => {
    if (!placeholderSrc) {
      return;
    }

    const placeholderImg = new Image();
    
    placeholderImg.onload = () => {
      setPlaceholderLoaded(true);
    };
    
    placeholderImg.src = placeholderSrc;
    
    return () => {
      placeholderImg.onload = null;
    };
  }, [placeholderSrc]);

  // Compute background styles based on loading state
  const getBackgroundStyles = () => {
    // Main image loaded - show it
    if (mainImageLoaded) {
      return {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.5s ease',
        backgroundColor: fallbackColor,
        backgroundBlendMode: 'overlay',
        opacity: 1
      };
    }
    
    // Only placeholder loaded - show it while main image loads
    if (placeholderLoaded && placeholderSrc) {
      return {
        backgroundImage: `url(${placeholderSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.5s ease',
        backgroundColor: fallbackColor, 
        backgroundBlendMode: 'overlay',
        opacity: 0.8
      };
    }
    
    // Nothing loaded - show fallback color
    return {
      backgroundColor: fallbackColor,
      transition: 'opacity 0.5s ease',
      opacity: 0.8
    };
  };

  return {
    mainImageLoaded,
    placeholderLoaded,
    error,
    backgroundStyle: getBackgroundStyles()
  };
};

/**
 * OptimizedBackgroundImage component
 * Provides optimized background image loading for hero sections and large backgrounds
 * Addresses LCP (Largest Contentful Paint) issues
 */
const OptimizedBackgroundImage = ({
  src,
  placeholderSrc = '',
  fallbackColor = 'rgba(13,24,6,1)',
  className = '',
  style = {},
  children,
  isPriority = false,
  onLoad = () => {},
  onError = () => {}
}) => {
  const {
    mainImageLoaded,
    backgroundStyle,
    error
  } = useBackgroundImage({
    imageSrc: src,
    placeholderSrc,
    fallbackColor,
    isPriority,
    onLoad,
    onError
  });

  return (
    <div
      className={className}
      style={{
        ...backgroundStyle,
        ...style
      }}
      aria-busy={!mainImageLoaded}
      role="img"
      aria-label={error ? 'Failed to load background image' : 'Background image'}
    >
      {children}
    </div>
  );
};

OptimizedBackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string,
  fallbackColor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  isPriority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default OptimizedBackgroundImage;