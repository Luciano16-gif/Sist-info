import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import ForumSection from '../../../components/Admin-components/admin-foro/Forum';
import NewForo from "../../../components/Admin-components/admin-foro/StartNewForum";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';

const AdminForo = () => {

  //Variables de información relevante:
  const ForosDisponibles = 43;
  const ForosCreados = 182;
  const ForosEliminados = 139;
  const Usuarios = 158;

  return (
    <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}> 
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Foro
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Espacio dinámico y compartido que permite a nuestros usuarios compartir experiencias, consejos y sugerencias
        relacionadas con las rutas y experiencias en el parque.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-3xl md:text-3xl font-bold">
        Informacion Relevante
      </h1>
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {ForosDisponibles} description ="Foros Disponibles Actualmente" />
        <RelevantInfoS number = {ForosCreados} description ="Foros creados en total" />
        <RelevantInfoS number = {ForosEliminados} description ="Foros eliminados" />
        <RelevantInfoS number = {Usuarios} description ="Usuarios participantes" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <ForumSection />
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <NewForo/>
    </div>
  );
};
  
  export default AdminForo;