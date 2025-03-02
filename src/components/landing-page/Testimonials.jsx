import React from 'react';

import user471 from "../../assets/images/landing-page/publications/user471.webp";
import user1982 from "../../assets/images/landing-page/publications/user1982.webp";
import user2567 from "../../assets/images/landing-page/publications/user2567.webp";

import andrea from "../../assets/images/landing-page/publications/andrea.webp";
import carlos from "../../assets/images/landing-page/publications/carlos.webp";
import victoria from "../../assets/images/landing-page/publications/victoria.webp";

const Testimonios = () => {
  const testimonios = [
    {
      id: 1,
      usuario: 'Usuario #1982:',
      comentario: '¡Una experiencia increíble! Las rutas son impresionantes y los guías son muy profesionales. Sin duda, volveré a esta área más del Ávila con ustedes.',
      avatar: user1982,
      estrellas: 5
    },
    {
      id: 2,
      usuario: 'Usuario #471:',
      comentario: 'Me encantó cada minuto de la excursión. La belleza del parque es incomparable y los senderos que todo turista ama nos esperaba. ¡Totalmente recomendado!',
      avatar: user471,
      estrellas: 5
    },
    {
      id: 3,
      usuario: 'Usuario #2567:',
      comentario: 'Perfecto para desconectar. Las rutas son bien señalizadas y el servicio fue excepcional. Gracias por una aventura inolvidable en el Ávila.',
      avatar: user2567,
      estrellas: 5
    }
  ];

  const publicaciones = [
    {
      id: 1,
      usuario: 'Victoria G.',
      fechaPublicacion: '08/12/2024',
      imagen: victoria,
      hashtags: '#Ávila #Venezuela #Montaña #Ejercicio #ÁvilaAventuras #Motivacion'
    },
    {
      id: 2,
      usuario: 'Carlos T.',
      fechaPublicacion: '12/01/2025',
      imagen: carlos,
      hashtags: '#Diversion #Naturaleza #Ávila #ParqueElÁvila #Excursion #ÁvilaAventuras'
    },
    {
      id: 3,
      usuario: 'Andrea P.',
      fechaPublicacion: '25/11/2024',
      imagen: andrea,
      hashtags: '#Aventura #Ávila #Excursion #Ruta #ÁvilaAventuras #AmoVenezuela'
    }
  ];

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

  return (
    <div className="#2c3b23 text-white py-10 px-6"> {/* <-- Cambiado a py-10 px-6 */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h2 className="text-4xl font-bold mb-1">Algunos comentarios y</h2>
          <h2 className="text-3xl font-bold mb-6">publicaciones de nuestros usuarios...</h2>
          <div className="w-72 h-0.5 bg-white mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Testimonios */}
          <div className="col-span-2 space-y-4">
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className="bg-white rounded-full p-4 flex items-center border-2 border-white-300 shadow-lg">
                <div className="mr-4">
                  <img
                    src={testimonio.avatar}
                    alt="Avatar de usuario"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-black">{testimonio.usuario}</p>
                    {renderEstrellas(testimonio.estrellas)}
                  </div>
                  <p className="text-sm text-black">{testimonio.comentario}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Columna derecha - Publicaciones */}
          <div className="col-span-1 grid grid-cols-2 gap-4 justify-center">
            {/* Publicación de Victoria */}
            <div className="flex justify-center row-start-1 col-start-2">
              <div className="relative"> {/* Contenedor relative para la imagen y el texto */}
                <img
                  src={publicaciones[0].imagen}
                  alt="Publicación de usuario Victoria"
                  className="w-[313px] h-[430px] object-cover rounded-lg flex-shrink-0"
                />
                <div className="absolute bottom-0 left-0 p-4 text-white bg-black bg-opacity-50"> {/* Texto superpuesto con fondo */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{publicaciones[0].usuario}</p>
                    <p className="text-xs opacity-75">{publicaciones[0].fechaPublicacion}</p>
                  </div>
                  <p className="text-xs mt-1 text-justify">{publicaciones[0].hashtags}</p>
                </div>
              </div>
            </div>
            {/* Publicación de Carlos */}
            <div>
              <div className="relative"> {/* Contenedor relative para la imagen y el texto */}
                <img
                  src={publicaciones[1].imagen}
                  alt="Publicación de usuario Carlos"
                  className="w-[313px] h-[430px] object-cover rounded-lg flex-shrink-0"
                />
                <div className="absolute bottom-0 left-0 p-4 text-white bg-black bg-opacity-50"> {/* Texto superpuesto con fondo */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{publicaciones[1].usuario}</p>
                    <p className="text-xs opacity-75">{publicaciones[1].fechaPublicacion}</p>
                  </div>
                  <p className="text-xs mt-1 text-justify">{publicaciones[1].hashtags}</p>
                </div>
              </div>
            </div>
            {/* Publicación de Andrea */}
            <div className="row-start-2 col-start-2">
              <div className="relative"> {/* Contenedor relative para la imagen y el texto */}
                <img
                  src={publicaciones[2].imagen}
                  alt="Publicación de usuario Andrea"
                  className="w-[313px] h-[430px] object-cover rounded-lg flex-shrink-0"
                />
                <div className="absolute bottom-0 left-0 p-4 text-white bg-black bg-opacity-50"> {/* Texto superpuesto con fondo */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{publicaciones[2].usuario}</p>
                    <p className="text-xs opacity-75">{publicaciones[2].fechaPublicacion}</p>
                  </div>
                  <p className="text-xs mt-1 text-justify">{publicaciones[2].hashtags}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonios;