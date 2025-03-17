// ActivityRequests.jsx
import React from 'react';

const ActivityRequests = () => {
  const requests = [
    {
      id: 1,
      sender: 'Miguel Contreras',
      title: 'Rutas Ecológicas y de Conservación',
      description:
        'Participa en actividades que promueven el ecoturismo y la conservación del medio ambiente. Estas rutas incluyen actividades de reforestación, limpieza de senderos y talleres educativos sobre la importancia de la conservación. Contribuye activamente a la protección del ecosistema mientras disfrutas de la belleza natural.',
    },
    {
      id: 2,
      sender: 'Sofía Ferrero',
      title: 'Trekking Temático',
      description:
        'Nuestras rutas de trekking temático brindan la oportunidad de explorar aspectos específicos de Ávila, como su geología, historia o leyendas locales. Guías expertos compartirán sus conocimientos en cada parada, ofreciendo una experiencia educativa y divertida.',
    },
    {
      id: 3,
      sender: 'Andrea Reyes',
      title: 'Actividades de Aventura Complementarias',
      description:
        'Si buscas un poco más de adrenalina, considera nuestras actividades de aventura como tirolesa, tubing o kayak, en áreas cercanas que lo permitan. Estos paquetes ofrecen una mezcla de aventura y exploración de la naturaleza, ideales para quienes buscan emociones fuertes.',
    },
    {
      id: 4,
      sender: 'Eduardo Quintero',
      title: 'Clases de Supervivencia en la Naturaleza',
      description:
        'Aprende técnicas esenciales de supervivencia en la naturaleza con nuestros talleres especializados.  Un instructor experto te enseñará desde cómo encender un fuego hasta cómo encontrar agua potable. Ofrecen habilidades prácticas que podrían ser útiles en una aventura al aire libre.',
    },
    {
      id: 5,
      sender: 'Alejandro Roa',
      title: 'Tours de Observacion de Aves',
      description:
        'Para los entusiastas de las aves, ofrecemos rutas especializadas en el avistamiento de aves. Con guias ornitonlogos, podrias explorar diversos ambientes y captar la belleza de las aves que habitan en el Avila. Estos tours son una entidad unica para aprender sobre la avifauna local',
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-2">SOLICITUDES PARA NUEVAS ACTIVIDADES</h2>
      <p className="text-sm text-white mb-4">APRUEBA O RECHAZA LAS SUGERENCIAS DE NUESTROS GUÍAS PARA EXPANDIR NUESTRA DIVERSIDAD EN ACTIVIDADES</p>

      <div
        className="w-full  h-auto md:h-[434px] rounded-[20px] bg-[#16260C] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.40)] p-6 mb-8"
      >
        <div className="overflow-x-auto h-full">
          <div className="flex space-x-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-[#1a2a1a] text-gray-300 p-4 rounded-lg w-80 flex-shrink-0 flex flex-col">
                <p className="text-sm mb-2">Enviado por: {request.sender}</p>
                <h3 className="text-lg font-bold mb-2 text-center">{request.title}</h3> {/* Centered title */}
                <p className="text-sm mb-4 text-justify">{request.description}</p>  {/* Justified description */}
                <div className="flex justify-around mt-auto">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Aceptar
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Rechazar
                  </button> 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityRequests;