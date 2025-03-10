import { BackgroundCircles } from './BackgroundElements';
import FeatureCard from './FeatureCard';
import { FEATURES } from '../../constants/LandingData';

const FeatureSection = () => (
  <div className="relative w-full px-4 sm:px-8 md:px-16 py-12 md:py-24 bg-[rgba(13,24,6,1)]">
    {/* Background wrapper that extends beyond the content */}
    <div className="absolute inset-0 w-full h-full left-0 top-0">
      <BackgroundCircles />
    </div>
    
    <div className="max-w-screen-2xl mx-auto relative z-10">
      <div className="text-center md:text-right mb-10 md:mb-20 md:mr-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-6">Sobre ÁvilaVenturas...</h2>
        <p className="max-w-full md:max-w-4xl mb-3 md:mb-6 text-base md:text-lg leading-relaxed md:ml-auto">
          Ofrecemos un servicio de calidad con guías expertos para que disfrutes de la belleza natural del
          Parque Nacional El Ávila, garantizando seguridad y comodidad.
        </p>
      </div>
      
      {/* Details container with stronger shadow */}
      <div className="bg-[#182411] p-4 sm:p-10 md:p-20 shadow-2xl shadow-black mb-12 md:mb-24 relative w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-20">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FeatureSection;