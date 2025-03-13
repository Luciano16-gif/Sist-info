import React, { useEffect } from 'react'; // Add useEffect
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";

const AdminMensajes = () => {

  const Mensajes = 38;
  const MensajesNContestado = 5;

  return (
    <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Mensajes
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Aquí puedes consultar y responder los mensajes y comentarios enviados por 
        nuestros guías.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {Mensajes} description ="Mensajes sin leer" />
        <RelevantInfoS number = {MensajesNContestado} description ="Mensajes sin contestar" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default AdminMensajes;