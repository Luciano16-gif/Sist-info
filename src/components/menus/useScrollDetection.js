import { useState, useEffect } from "react";

/**
 * Custom hook to detect when page is scrolled beyond a threshold
 * @param {number} threshold - Scroll position in pixels to trigger the scrolled state
 * @returns {boolean} - Whether the page has scrolled beyond the threshold
 */
const useScrollDetection = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, threshold]);

  return scrolled;
};

export default useScrollDetection;