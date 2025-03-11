import { useEffect } from 'react';

/**
 * ScrollFix component - Forces document and body to be scrollable
 * No visible UI, just applies scrolling fixes when mounted
 */
const ScrollFix = () => {
  useEffect(() => {
    // Force document and body to be scrollable
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Cleanup when component unmounts
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // Component doesn't render anything visible
  return null;
};

export default ScrollFix;