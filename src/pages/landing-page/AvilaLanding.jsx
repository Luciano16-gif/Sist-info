import React, { useEffect } from 'react';
import HeroSection from '../../components/landing-page/HeroSection';
import Divider from '../../components/landing-page/Divider';
import FeatureSection from '../../components/landing-page/FeatureSection';
import ExploreSection from '../../components/landing-page/ExploreSection';
import TestimonySection from '../../components/landing-page/Testimonials';
import RoutesSection from '../../components/landing-page/RoutesSection/index'; 
import FunFactSection from '../../components/landing-page/FunFactSection';
import ForumSection from '../../components/landing-page/forum_section';
import EventCalendar from '../../components/calendar/EventCalendar';

import { useAuth } from '../../components/contexts/AuthContext';

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

  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[rgba(13,24,6,0.95)] z-50">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-opacity-20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#AAACA8] rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-xl font-ysabeau">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-w-screen w-full bg-[rgba(13,24,6,1)] text-white relative scroll-smooth overflow-hidden">
      { currentUser ? (
        <>
          {/* Hero Section */}
          <div>
            <HeroSection />
          </div>

          {/* Divider */}
          <Divider />

          {/* Routes Section */}
          <div>
            <RoutesSection />
          </div>
            
          {/* Divider */}
          <Divider />

          {/* Calendar Section */}
          <div>
            <EventCalendar />
          </div>
          
          {/* Divider */}
          <Divider />

          {/* Tips Section */}
          <div>
            <ExploreSection />
          </div>

          {/* fun fact Section*/}
          <div>
            <FunFactSection />
          </div>

          {/* forum Section*/}
          <div>
            <ForumSection />
          </div>
        </>
      ) : (
        <>
          {/* Hero Section */}
          <div>
            <HeroSection />
          </div>

          {/* Divider */}
          <Divider />

          {/* Feature Section */}
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

          {/* Comments and Posts Section */}
          <div>
            <TestimonySection/>
          </div>

          {/* Divider */}
          <Divider />
          
          {/* Routes Section*/}
          <div>
            <RoutesSection/>
          </div>
        </>
      )}
    </div>
  );
};

export default AvilaLanding;