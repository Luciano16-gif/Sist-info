import React, { useEffect } from 'react'; // Add useEffect
import HeroSection from '../../components/landing-page/HeroSection';
import Divider from '../../components/landing-page/Divider';
import FeatureSection from '../../components/landing-page/FeatureSection';
import ExploreSection from '../../components/landing-page/ExploreSection';

const AvilaLanding = () => {
  useEffect(() => {
    // Idk what the ***** is happening but we need to force document and body to be scrollable
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
      
      {/* Hero Section - add explicit height */}
      
      <div>
        <FeatureSection />
      </div>

      {/* Divider */}
      <Divider />

       {/* Explore Section */}
       <div>
        <ExploreSection />
      </div>
      
      {/* Divider */}
      <Divider />
    </div>
  );
};

export default AvilaLanding;