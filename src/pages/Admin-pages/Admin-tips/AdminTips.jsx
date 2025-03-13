import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";

const AdminTips = () => {

  //Variables de información relevante:
  const TipsPublicos = 6;
  const TipsEliminados = 4;
  const TipsEditados = 21;
  const SolicitudesTips = 14;
  const TipsCreados = 3;

  return (
    <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Tips
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Consejos y recomendaciones ofrecidas a nuestros usuarios para mejorar y perfeccionar
        su experiencia junto a nosotros.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {TipsPublicos} description ="Tips publicados actualmente" />
        <RelevantInfoS number = {TipsEliminados} description ="Tips Eliminados" />
        <RelevantInfoS number = {TipsEditados} description ="Tips Editados" />
        <RelevantInfoS number = {SolicitudesTips} description ="Solicitudes nuevas de tips" />
        <RelevantInfoS number = {TipsCreados} description ="Tips creados este mes" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default AdminTips;