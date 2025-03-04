import { HERO_IMAGE } from '../../constants/LandingData'; 
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
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 space-y-4 z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold">
              Descubre la<br />
              majestuosidad del<br />
              Ávila
            </h1>
            <p className="text-sm md:text-base max-w-2xl">
              Tu aventura comienza aquí. Reserva tu excursión hoy mismo y vive una experiencia inolvidable en Caracas.
            </p>
            <button className="bg-[#AAACA8] text-white px-6 py-3 rounded-full mt-4 hover:bg-opacity-90 transition-all">
              Únete a la aventura
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