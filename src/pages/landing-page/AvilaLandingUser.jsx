import React, { useEffect } from 'react';
import HeroSection from '../../components/landing-page/HeroSection';
import Divider from '../../components/landing-page-user/Divider';
import FeatureSection from '../../components/landing-page-user/FeatureSection';
import RouteCards from '../../components/landing-page-user/RouteCards';
import StackedCards from '../../components/landing-page-user/StackedCards'; // Nuevo import
import { gallery2 } from '../../constants/LandingUserData'; // Importamos las imágenes

const AvilaLandingUser = () => {
    useEffect(() => {
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.height = 'auto';
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        return () => {
            document.documentElement.style.overflow = '';
            document.documentElement.style.height = '';
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, []);

  return (
    // Use auto height and make sure overflow works
    <div className="w-full bg-[rgba(13,24,6,1)] text-white relative scroll-smooth overflow-hidden">
      {/* Feature Section - add explicit height */}
      <div>
        <HeroSection />
      </div>

      {/* Divider */}
      <Divider />

      <div>
        <FeatureSection />
      </div>

      <div className="py-0">
        <RouteCards />
      </div>

      {/* Divider */}
      <Divider />

      <StackedCards images={gallery2} />

    </div>
  );
};

export default AvilaLandingUser;