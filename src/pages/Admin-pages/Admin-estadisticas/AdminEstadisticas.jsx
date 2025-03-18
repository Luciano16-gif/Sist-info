import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';

const AdminEstadisticas = () => {

  //Variables de información relevante:
  const ExcursionesOfrecidas = 284;
  const Participacion = "+1500";
  const Duracion = "6H";
  const Promedio = 24;
  const Comentarios = 4731;

  return (
    <div className={`inset-0 mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-6 flex flex-col justify-start items-start px-4 md:px-8 ${adminBaseStyles}`}>
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Estadísticas
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Control de todas las estadísticas generadas.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-3xl md:text-3xl font-bold">
        Informacion Relevante
      </h1>
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {ExcursionesOfrecidas} description ="Excursiones Ofrecidas" />
        <RelevantInfoS number = {Participacion} description ="Participacion de los usuarios" />
        <RelevantInfoS number = {Duracion} description ="Duracion promedio de excursiones" />
        <RelevantInfoS number = {Promedio} description ="Promedio de participantes por excursion" />
        <RelevantInfoS number = {Comentarios} description ="Comentarios y reseñas recopiladas" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      
    </div>
    
  );
};
  
  export default AdminEstadisticas;