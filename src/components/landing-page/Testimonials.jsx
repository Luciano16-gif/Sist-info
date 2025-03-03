import { testimonios, publicaciones } from "../../constants/LandingData";

const Testimonios = () => {
  const renderEstrellas = (cantidad) => {
    if (cantidad === 0) return null;
    const estrellas = [];
    for (let i = 0; i < cantidad; i++) {
      estrellas.push(
        <span key={i} className="text-yellow-400 text-lg">★</span>
      );
    }
    return <div className="flex">{estrellas}</div>;
  };

  // Custom styles for different publication positions
  const publicationStyles = [
    { // Victoria (top right)
      className: "col-start-2 row-start-1 flex justify-center",
      imgHeight: "h-[210px]"
    },
    { // Carlos (left column)
      className: "col-start-1 row-span-2 flex justify-center items-center",
      imgHeight: "h-[430px]"
    },
    { // Andrea (bottom right)
      className: "col-start-2 row-start-2 flex justify-center",
      imgHeight: "h-[210px]"
    }
  ];

  return (
    <div className="text-white py-10 px-6"> 
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h2 className="text-4xl font-bold mb-1">Algunos comentarios y</h2>
          <h2 className="text-3xl font-bold mb-6">publicaciones de nuestros usuarios...</h2>
          <div className="w-72 h-0.5 bg-white mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Testimonios */}
          <div className="col-span-2" style={{
            zIndex: 20
          }}>
            {testimonios.map((testimonio, index) => (
              <div 
                key={testimonio.id} 
                className="bg-gray-200 rounded-3xl p-5 flex items-center max-w-xl mb-0" 
                style={{
                  marginLeft: index === 1 ? '60px' : '0',
                  marginTop: index > 0 ? '-10px' : '0',
                  boxShadow: '0 4px 12px rgba(58,66,53,1)'
                }}
              >
                <div className="mr-5">
                  <img
                    src={testimonio.avatar}
                    alt="Avatar de usuario"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-black text-lg">Usuario #{testimonio.id}</p>
                    {renderEstrellas(testimonio.estrellas)}
                  </div>
                  <p className="text-sm text-black">{testimonio.comentario}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Columna derecha - Publicaciones con layout específico */}
          <div className="col-span-1 grid grid-cols-2 gap-4 relative p-4" style={{ 
            position: 'relative',
            zIndex: 10
          }}>
            {/* Green glow effect - positioned absolutely */}
            <div className="absolute inset-0 rounded-3xl" style={{
              boxShadow: '0 0 300px 300px rgba(31,43,22,0.9)',
              pointerEvents: 'none'
            }}></div>
            
            {/* Loop through the first 3 publications */}
            {publicaciones.slice(0, 3).map((publicacion, index) => (
              <div key={index} className={publicationStyles[index].className}>
                <div className="relative">
                  <img
                    src={publicacion.imagen}
                    alt={`Publicación de usuario ${publicacion.usuario}`}
                    className={`w-full ${publicationStyles[index].imgHeight} object-cover rounded-lg`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{publicacion.usuario}</p>
                      <p className="text-xs opacity-75">{publicacion.fechaPublicacion}</p>
                    </div>
                    <div className="flex flex-wrap mt-1">
                      {publicacion.hashtags.split(' ').map((tag, i) => (
                        <span key={i} className="text-xs mr-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonios;