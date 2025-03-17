import React, { useEffect } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection"

const AdminRutas = () => {

  //Variables de información relevante:
  const ExcursionesDisponibles = 84;
  const ExcursionesNInscritas = 5;
  const ExcursionesNGuias = 14;
  const ExcursionesRealizadas = 284;
  const PromedioPart = 250;
  const RutasAnadidas = 15;
  const HorasExcursiones = "+3000";
  const ExcursionesEliminadas = 20;

  return (
    <div className="absolute inset-0 mx-8 md:mx-32 my-8 flex flex-col justify-start items-start px-4 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Rutas y Excursiones
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Ofrecemos diversos servicios para todo tipo de personas y niveles de exigencia
        con calidad y amor por nuestro parque nacional.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-xl md:text-3xl font-bold">
        Información relevante
      </h1>
      <div className="flex flex-nowrap overflow-x-auto space-x-4"> 
        <RelevantInfoS number={ExcursionesDisponibles} description="Excursiones Disponibles"  />
        <RelevantInfoS number={ExcursionesNInscritas} description="Excursiones sin Inscripciones"  />
        <RelevantInfoS number={ExcursionesNGuias} description="Excursiones sin Guías Inscritos"  />
        <RelevantInfoS number={ExcursionesRealizadas} description="Excursiones realizadas en total"  />
        <RelevantInfoS number={PromedioPart} description="Promedio de participantes por mes"  />
        <RelevantInfoS number={RutasAnadidas} description="Rutas añadidas en el último mes"  />
        <RelevantInfoS number={HorasExcursiones} description="Horas en Excursiones"  />
        <RelevantInfoS number={ExcursionesEliminadas} description="Excursiones Eliminadas"  />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};

export default AdminRutas;