import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * LazyImage component that loads images only when they are in or near the viewport
 * Also handles image loading errors with a fallback (cuz why not you know?)
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

  // Handle successful image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image loading error
  const handleError = () => {
    setIsError(true);
    setImageSrc(fallbackSrc);
  };

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          // Stop observing once the image is in view
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, threshold]);

  // Create combined style with placeholder background
  const combinedStyle = {
    ...style,
    backgroundColor: !isLoaded ? placeholderColor : undefined,
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc || fallbackSrc}
      alt={alt}
      className={`lazy-image ${className} ${isError ? 'image-error' : ''}`}
      style={combinedStyle}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
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
};

export default LazyImage;