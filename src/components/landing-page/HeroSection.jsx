import { HERO_IMAGE_NO_SESSION, HERO_IMAGE_SESSION } from '../../constants/LandingData'; 
import HeroText from './HeroText';
import { useAuth } from "../contexts/AuthContext";

const HeroSection = () => {
    const { currentUser } = useAuth();
    const HERO_IMAGE = currentUser ? HERO_IMAGE_SESSION : HERO_IMAGE_NO_SESSION;
    return (
      <div className="min-h-screen bg-[rgba(13,24,6,1)] text-white relative">
        {/* Hero Section */}
        <div 
          className="relative h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(13,24,6,0.3)'
          }}
        >
          <HeroText />
          {/* Gradient overlay at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[rgba(13,24,6,1)] pointer-events-none z-0"></div>
        </div>

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