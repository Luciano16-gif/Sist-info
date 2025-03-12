import React, { useEffect } from 'react'; // Add useEffect

const AdminForo = () => {
  return (
    <div className="absolute inset-0 mx-32 my-16 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Foro
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Espacio dinámico y compartido que permite a nuestros usuarios compartir experiencias, consejos y sugerencias
        relacionadas con las rutas y experiencias en el parque.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
    </div>
  );
};
  
  export default AdminForo;