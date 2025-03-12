import React, { useEffect } from 'react'; // Add useEffect

const AdminLanding = () => {
  return (
    <div className="absolute inset-0 mx-32 my-16 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Bienvenido Administrador
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-lg md:text-lg">
        Como administrador de la página de excursiones al Ávila,
        tus responsabilidades incluyen supervisar y moderar el foro, asegurando que las interacciones
        entre los usuarios sean constructivas y respetuosas. Además, deberás responder a las consultas
        y comentarios de los usuarios, facilitando información relevante y actualizada sobre las excursiones.
        Es fundamental que monitorees la calidad del contenido compartido y gestiones las reseñas, interactuando
        con los usuarios para fomentar la participación y la comunidad. También serás responsable de recopilar y
        analizar feedback para realizar mejoras en las rutas y servicios ofrecidos, garantizando una experiencia
        excepcional para todos los visitantes.
      </h1>
    </div>
  );
};

export default AdminLanding;