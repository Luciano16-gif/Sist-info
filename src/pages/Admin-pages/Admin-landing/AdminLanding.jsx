import { adminBaseStyles } from "../../../components/Admin-components/adminBaseStyles";

const AdminLanding = () => {
  return (
    <div className={`inset-0 mx-4 md:mx-8 lg:mx-32 my-4 md:my-8 flex flex-col justify-start items-start px-4 md:px-8 lg:px-16 ${adminBaseStyles}`}> 
      <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
        Bienvenido Administrador
      </h1>
      <hr className="border-1 border-white-600 w-full md:w-96 my-2 md:my-4" />
      <h1 className="text-white text-base md:text-lg text-justify">
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