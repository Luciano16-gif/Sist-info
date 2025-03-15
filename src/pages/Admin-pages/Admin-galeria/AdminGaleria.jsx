import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection"
import GaleriaGrid from "../../../components/Admin-components/admin-galeria/GaleriaGrid";
import GaleriaSolicitudes from "../../../components/Admin-components/admin-galeria/SolicitudesGaleria";


const AdminGaleria = () => {
  const FotosActuales = 284;
  const Solicitudes = 87;

  return (
    <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Galería
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Representa el espacio donde nuestros usuarios y guías podrán echar un vistazo
        de cómo son las actividades que ofrecemos.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-xl md:text-3xl font-bold">
        Información relevante
      </h1>
      <div className="flex justify-start space-x-10 overflow-x-auto">
        <RelevantInfoS number = {FotosActuales} description ="Fotos en la galería actual" />
        <RelevantInfoS number = {Solicitudes} description ="Solicitudes de nuevas fotos" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default AdminGaleria;