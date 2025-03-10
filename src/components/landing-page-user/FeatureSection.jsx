//import { BackgroundCircles } from './BackgroundElements';
import FeatureCard from './FeatureCard';
import { FEATURES } from '../../constants/LandingUserData';

const FeatureSection = () => (
  // Added w-full to ensure full width
  <div className="relative w-full md:px-16 bg-[rgba(13,24,6,1)]">    
    <div className="max-w-screen-2xl mx-auto relative z-10">
      <div className="text-center md:text-right md:mr-20">
        <h2 className="text-left text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6">Rutas ideales para ti!</h2>
        <p className="text-left max-w-full md:max-w-4xl text-base md:text-lg leading-relaxed">
          Echa un vistazo y escoge tu próxima aventura...
        </p>
      </div>
    </div>
  </div>
);

export default FeatureSection;