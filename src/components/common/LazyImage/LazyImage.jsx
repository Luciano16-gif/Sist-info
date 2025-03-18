import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * LazyImage component that loads images only when they are in or near the viewport
 * Enhanced to prevent fallback image from affecting layout
 */
const LazyImage = ({
  src,
  alt,
  className,
  style,
  fallbackSrc = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png',
  threshold = 0.1,
  placeholderColor = '#3a4a3a',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // Handle successful image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (props.onLoad) props.onLoad();
  };

  // Handle image loading error
  const handleError = () => {
    setIsError(true);
    setImageSrc(fallbackSrc);
    if (props.onError) props.onError();
  };

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          // Stop observing once the image is in view
          if (observerRef.current && containerRef.current) {
            observerRef.current.unobserve(containerRef.current);
          }
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, threshold]);

  // Maintain the placeholder color until the actual image is loaded
  const containerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: placeholderColor,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'inherit',
  };
  
  // Enhanced style for better image display 
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    ...style, // Allow style prop to override defaults
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className || ''}>
      {(imageSrc || isError) && (
        <img
          ref={imgRef}
          src={imageSrc || fallbackSrc}
          alt={alt}
          className={isError ? 'image-error' : ''}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  fallbackSrc: PropTypes.string,
  threshold: PropTypes.number,
  placeholderColor: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default LazyImage;