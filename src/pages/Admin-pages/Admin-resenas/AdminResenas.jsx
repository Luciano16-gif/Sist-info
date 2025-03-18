import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import Reviews from '../../../components/Admin-components/admin-resenas/ReviewAdmin';
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
adminBaseStyles

const AdminResenas = () => {

  //Variables de información relevante:
  const ResenasRecibidas = 389;
  const Resenas5e = 201;
  const Resenas4e = 95;
  const Resenas3e = 75;
  const Resenas2e = 14;
  const Resenas1e = 4;

  return (
    <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}> 
      <h1 className=" text-white text-4xl md:text-5xl font-bold">
        Reseñas
      </h1>
      <h1 className=" text-white text-lg md:text-lg">
        Nuestros usuarios nos dejan su puntuación y su opinión con respecto a su experiencia
        junto a nosotros.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className=" text-white text-3xl md:text-3xl font-bold">
        Informacion Relevante
      </h1>
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number = {ResenasRecibidas} description ="Resenas Recibidas" />
        <RelevantInfoS number = {Resenas5e} description ="Resenas con 5 estrellas" />
        <RelevantInfoS number = {Resenas4e} description ="Resenas con 4 estrellas" />
        <RelevantInfoS number = {Resenas3e} description ="Resenas con 3 estrellas" />
        <RelevantInfoS number = {Resenas2e} description ="Resenas con 2 estrellas" />
        <RelevantInfoS number = {Resenas1e} description ="Resenas con 1 estrella" />
      </div>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <Reviews/>
    </div>
  );
};
  
  export default AdminResenas;