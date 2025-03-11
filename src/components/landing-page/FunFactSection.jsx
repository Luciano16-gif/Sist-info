import { fun_fact_background, fun_fact_image, fun_fact_icon } from "../../constants/LandingData";

const FunFactCard = () => {
  return (
    <div 
      className="relative w-full py-16 px-4 md:py-24 overflow-hidden"
      style={{ 
        backgroundImage: `url(${fun_fact_background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto" style={{position: 'relative', zIndex: 10}}>
        <div 
          className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg"
          style={{ backgroundColor: 'rgba(200,198,190,255)' }}
        >
          {/* Left content section */}
          <div 
            className="p-8 md:p-12 lg:p-16 md:w-3/5 flex flex-col justify-center"
            style={{ color: 'rgba(69,62,54,255)' }}
          >
            {/* Title with icon */}
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl md:text-4xl font-semibold">Dato curioso</h2>
              <img 
                src={fun_fact_icon} 
                alt="Fun fact icon" 
                className="w-10 h-10 ml-3" 
              />
            </div>
            
            {/* Separator line */}
            <div className="w-full h-px bg-gray-400 mb-6"></div>
            
            {/* Main heading */}
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              ¡Un viaje a través de ecosistemas!
            </h3>
            
            {/* Description */}
            <p className="text-base md:text-lg">
              En solo 30 minutos de caminata, puedes experimentar la transición
              de un denso bosque nublado a un ambiente árido en el Parque
              Nacional El Ávila. ¡Un ecosistema completo al alcance de tu mano!
            </p>
          </div>
          
          {/* Right image section */}
          <div className="md:w-2/5">
            <img 
              src={fun_fact_image} 
              alt="Forest ecosystem" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunFactCard;