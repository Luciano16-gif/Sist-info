import { HERO_IMAGE_NO_SESSION, HERO_IMAGE_SESSION } from '../../constants/LandingData'; 
import HeroText from './HeroText';
import { useAuth } from "../contexts/AuthContext";
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';

const HeroSection = () => {
    const { currentUser } = useAuth();
    const HERO_IMAGE = currentUser ? HERO_IMAGE_SESSION : HERO_IMAGE_NO_SESSION;
    
    // Create tiny placeholder/thumbnail versions of your hero images (10-20KB)
    // These should be extremely small versions of the same image
    // const PLACEHOLDER_IMAGE = currentUser ? '/path-to-tiny-thumbnail-session.jpg' : '/path-to-tiny-thumbnail-no-session.jpg';
    
    return (
      <div className="min-h-screen bg-[rgba(13,24,6,1)] text-white relative">
        {/* Hero Section with Optimized Background */}
        <OptimizedBackgroundImage
          src={HERO_IMAGE}
          // placeholderSrc={PLACEHOLDER_IMAGE} // Uncomment when you have tiny thumbnails
          isPriority={true}  // This is a critical above-the-fold image
          className="relative h-screen bg-center"
          fallbackColor="rgba(13,24,6,0.3)"
          onLoad={() => {
            // Report to analytics or performance monitoring if needed
            if (window.performance && window.performance.mark) {
              window.performance.mark('hero-image-loaded');
            }
          }}
        >
          <HeroText />
          {/* Gradient overlay at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-0"></div>
        </OptimizedBackgroundImage>

        {/* Down arrow */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    );
  };

export default HeroSection;