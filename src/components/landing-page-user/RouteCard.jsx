import React from 'react';

const RouteCard = ({ route }) => (
  <div className="bg-[#182411] rounded-2xl m-4 w-64 text-white relative">
    {/* Image with full coverage */}
    <img src={route.image} alt={`Ruta ${route.id}`} className="w-full h-40 object-cover rounded-t-2xl absolute left-0" />
    
    {/* Content container */}
    <div className="relative pt-44 pb-4 px-4">
      <h2 className="text-center text-2xl font-bold mt-2">{route.title}</h2>
      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <span>Dificultad</span>
          <div className="ml-4 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full mx-1 bg-white ${i < route.difficulty ? '' : 'opacity-30'}`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span>Longitud</span>
          <div className="ml-4 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full mx-1 bg-white ${i < route.length ? '' : 'opacity-30'}`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span>Puntuación</span>
          <div className="ml-4 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full mx-1 bg-white ${i < route.rating ? '' : 'opacity-30'}`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Horario</span>
          <p className="ml-4">{route.time}</p>
        </div>
        <div className="flex items-center">
          <span>Cupos disponibles</span>
          <div className="ml-4 flex items-center">
            <span>{route.availableSlots} / {route.totalSlots}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RouteCard;