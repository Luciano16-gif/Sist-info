import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection"

const GestionGuias = () => {

  //Variables de información relevante:
  let GuiasRegistrados = 67;
  let Solicitudes = 164;
  let Sugerencias = 70;
  let GuiasNAsignados = 30;

  return (
    <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Gestión de Guías
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Administra a los guías actuales responsables de nuestras experiencias
        y revisa sus solicitudes.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-xl md:text-3xl font-bold">
        Información relevante
      </h1>
      <div className="flex justify-start space-x-10 overflow-x-auto">
        <RelevantInfoS number = {GuiasRegistrados} description ="Guías Registrados" />
        <RelevantInfoS number = {Solicitudes} description ="Solicitudes de Edición" />
        <RelevantInfoS number = {Sugerencias} description ="Sugerencias de Adición" />
        <RelevantInfoS number = {GuiasNAsignados} description ="Guías sin Asignaciones" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default GestionGuias;