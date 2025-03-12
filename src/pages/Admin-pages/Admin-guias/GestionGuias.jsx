import React, { useEffect } from 'react'; // Add useEffect

const GestionGuias = () => {
  return (
    <div className="absolute inset-0 mx-32 my-16 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Gestión de Guías
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Administra a los guías actuales responsables de nuestras experiencias
        y revisa sus solicitudes.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default GestionGuias;