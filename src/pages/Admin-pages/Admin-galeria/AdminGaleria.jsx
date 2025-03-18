import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection"
import GaleriaGrid from "../../../components/Admin-components/admin-galeria/GaleriaGrid";
// import GridTest from "../../../components/Admin-components/admin-galeria/GridTest";
import PhotoRequests from '../../../components/Admin-components/admin-galeria/PhotoRequets';
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';

const AdminGaleria = () => {
  const FotosActuales = 284;
  const Solicitudes = 87;

  return (
      <div className={`overflow-x-scroll my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
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
        <div className="flex justify-start space-x-10">
          <RelevantInfoS number = {FotosActuales} description ="Fotos en la galería actual" />
          <RelevantInfoS number = {Solicitudes} description ="Solicitudes de nuevas fotos" />
        </div>
        <div className="flex flex-col">
            <h2 className="text-4xl font-bold text-white mr-4">Nuestra Galería</h2>
            <h2 className="text-sm text-white mr-4">Selecciona una imagen para obtener
              los detalles de la misma o eliminarla de nuestra galería
            </h2>
        </div>
        <GaleriaGrid />
        <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
        <PhotoRequests />
        </div>
  );
};
  
  export default AdminGaleria;