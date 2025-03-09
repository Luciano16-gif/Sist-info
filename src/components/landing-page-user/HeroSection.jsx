import { HERO_IMAGE } from '../../constants/LandingUserData'; 
const HeroSection = () => {
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
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-8 md:px-16 z-10 text-center">
            <h1 className="text-1xl md:text-2xl font-bold">
              The call of the<br />
            </h1>
            <h1 className="text-8xl md:text-10xl font-bold">
              MOUNTAINS<br />
            </h1>
            <button className="text-white font-normal underline hover:font-bold hover:bg-opacity-90 hover:scale-105 transition-all transform">
              Ver más imágenes...
            </button>
          </div>
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