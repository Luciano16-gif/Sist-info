import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";

const AdminEstadisticas = () => {

  //Variables de información relevante:
  const ExcursionesOfrecidas = 284;
  const Participacion = "+1500";
  const Duracion = "6H";
  const Promedio = 24;
  const Comentarios = 4731;

  return (
    <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Estadísticas
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Control de todas las estadísticas generadas.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-3xl md:text-3xl font-bold">
        Informacion Relevante
      </h1>
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {ExcursionesOfrecidas} description ="Excursiones Ofrecidas" />
        <RelevantInfoS number = {Participacion} description ="Participacion de los usuarios" />
        <RelevantInfoS number = {Duracion} description ="Duracion promedio de excursiones" />
        <RelevantInfoS number = {Promedio} description ="Promedio de participantes por excursion" />
        <RelevantInfoS number = {Comentarios} description ="Comentarios y resenas recopiladas" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
    
  );
};
  
  export default AdminEstadisticas;