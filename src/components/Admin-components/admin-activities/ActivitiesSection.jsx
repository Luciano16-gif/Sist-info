// ActivitiesList.jsx
import React from 'react';

function ActivitiesList() {
  const activities = [
    { id: 1, title: 'Caminata y Senderismo' },
    { id: 2, title: 'Observación de Flora y Fauna' },
    { id: 3, title: 'Yoga y Meditación al Aire Libre' },
    { id: 4, title: 'Excursiones en Bicicleta' },
    { id: 5, title: 'Escalada y Rappel' },
    { id: 6, title: 'Camping y Aventuras Nocturnas' },
    { id: 7, title: 'Tours Gastronómicos' },
    { id: 8, title: 'Tours Históricos y Culturales' },
    { id: 9, title: 'Fotografía de Paisajes y Natu..' },
    { id: 10, title: 'Actividades para Familias' },
  ];

  return (
    <>
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white mr-4">ACTIVIDADES DISPONIBLES ACTUALMENTE</h2>
        <div className="flex relative">
          <input
            type="text"
            placeholder="Buscar actividad..."
            className="pl-10 pr-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            style={{
              borderRadius: '30px',
              border: '5px solid rgba(255, 255, 255, 0.50)',
              background: 'rgba(255, 255, 255, 0.40)',
              width: '300px'
            }}
          />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-gray-400"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
            </div>

        </div>
      </div>
      <p className="text-sm mb-6 text-white">REPRESENTAN LO ÚNICO Y ESPECIAL DE CADA UNA DE NUESTRAS EXPERIENCIAS</p>

      <section className="bg-[#121F0A] text-gray-300 p-6 rounded-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              <button
                className="w-full p-3 text-gray-300 rounded-lg text-left hover:bg-gray-600 transition-colors"
                style={{
                  borderRadius: '20px',
                  border: '6px solid #FFF',
                  background: 'rgba(217, 217, 217, 0.60)',
                }}
              >
                {activity.title}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default ActivitiesList;