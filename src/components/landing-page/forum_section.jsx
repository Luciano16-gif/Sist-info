import { forum_background } from "../../constants/LandingData";
import { useNavigate } from "react-router-dom";

const ForumSection = () => {
  const navigate = useNavigate();

  const handleSeeForums = () => {
    navigate('/foro'); // Navigate to the foros
  };

  return (
    <div className="relative w-full min-h-[500px]">
      {/* Background Layer - Lower z-index */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `url(${forum_background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(32,52,8,0.9)', 
          zIndex: 1
        }}
      >
        {/* Top gradient overlay for fade effect */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-t from-transparent to-[rgba(13,24,6,1)] pointer-events-none"></div>
      </div>
      
      {/* Content Layer - Higher z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] py-16 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              ¡Únete a nuestra comunidad en el foro!
            </h2>
            
            {/* Description paragraph */}
            <p className="text-sm md:text-base lg:text-lg text-white mb-8 leading-relaxed">
              ¿Te apasiona explorar el Ávila? Nuestro foro es el lugar perfecto para compartir tus 
              experiencias, hacer preguntas y conectarte con otros amantes de la naturaleza. 
              Comparte tus fotos, busca consejos sobre rutas y discute sobre las mejores aventuras 
              en nuestro maravilloso parque. ¡Tu voz es importante para nosotros!
            </p>
            
            {/* Call to action */}
            <p className="text-xl md:text-2xl font-semibold text-white mb-8">
              ¡Participa hoy y sé parte de la conversación!
            </p>
            
            {/* Button */}
            <a  onClick={handleSeeForums}
              href="#" 
              className="inline-block px-8 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-bold rounded-full border-2 border-white border-opacity-50 transition-all duration-300 text-xl"
            >
              Ver foro
            </a>
          </div>
          
          {/* Footer copyright */}
          <div className="mt-16 text-white text-sm md:text-base opacity-90">
            ©2025 | ÁvilaVenturas all right reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumSection;