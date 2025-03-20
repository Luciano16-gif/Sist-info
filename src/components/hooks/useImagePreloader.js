import { useState, useEffect } from 'react';

/**
 * A hook that preloads images and returns a boolean indicating if loading is complete
 * 
 * @param {string|string[]} imageSources - Single image source or array of image sources to preload
 * @param {number} timeout - Maximum time to wait for image loading in milliseconds
 * @returns {boolean} isLoaded - Whether all images have loaded
 */
const useImagePreloader = (imageSources, timeout = 3000) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const sources = Array.isArray(imageSources) ? imageSources : [imageSources];
    
    if (sources.length === 0 || sources.every(src => !src)) {
      setIsLoaded(true);
      return;
    }
    
    // Create an array to track loaded status for each image
    const imageStatuses = sources.map(() => false);
    
    // Function to check if all images are loaded
    const checkAllLoaded = () => {
      if (imageStatuses.every(status => status)) {
        if (isMounted) setIsLoaded(true);
      }
    };
    
    // Load each image
    sources.forEach((src, index) => {
      if (!src) {
        imageStatuses[index] = true;
        checkAllLoaded();
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        imageStatuses[index] = true;
        checkAllLoaded();
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        imageStatuses[index] = true; // Mark as loaded even if it fails
        checkAllLoaded();
      };
      
      img.src = src;
    });
    
    // Set a timeout to prevent waiting indefinitely
    const timeoutId = setTimeout(() => {
      if (isMounted && !isLoaded) {
        console.warn('Image preloading timed out after ' + timeout + 'ms');
        setIsLoaded(true);
      }
    }, timeout);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [imageSources, timeout]);
  
  return isLoaded;
};

export default useImagePreloader;