//AdminActividades.jsx
import React from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import ActivitiesList from '../../../components/Admin-components/admin-activities/ActivitiesSection';
import ActivityRequests from  "../../../components/Admin-components/admin-activities/ApplicationSection";
import AddActivityForm from "../../../components/Admin-components/admin-activities/FormActivities";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';

const AdminActividades = () => {

  //Variables de información relevante:
  const Actividades = 21;
  const Solicitudes = 4;
  const ActividadesSExperiencia = 3;
  const ActividadMasRealizada = "Caminata y Senderismo";
  const ActividadesRealizadas = 217;

  return (
    <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}> 
      <h1 className="text-white text-4xl md:text-5xl font-bold">
        Actividades
      </h1>
      <h1 className="text-white text-lg md:text-lg">
        En nuestro sistema de experiencias existen diversos tipos de actividades que nuestros
        guías hacen realidad a nuestros usuarios.
      </h1>
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <h1 className="text-white text-xl md:text-3xl font-bold">
        Información relevante
      </h1>
      <div className="flex justify-start space-x-10">
        <RelevantInfoS number={Actividades} description="Actividades Disponibles" />
        <RelevantInfoS number={Solicitudes} description="Solicitudes de nuevas Actividades" />
        <RelevantInfoS number={ActividadesSExperiencia} description="Actividades sin experiencia asignada" />
        <RelevantInfoS
          number={ActividadMasRealizada}
          description="Actividad más realizada"
          descriptionFontSize="text-sm"
          numberFontSize="text-lg md:text-3xl"
        />
        <RelevantInfoS number={ActividadesRealizadas} description="Actividades Realizadas" />
      </div>
      {/*Section List Activities*/}
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <ActivitiesList />
      
      {/*Section Request Activities*/}
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <ActivityRequests />
      
      {/*Section Add Activity Form*/}
      <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
      <AddActivityForm />
    </div>
  );
};

export default AdminActividades;