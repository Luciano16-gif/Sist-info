import React from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import AdminExperienceRequests from "../../Admin-experience-requests/AdminExperienceRequests";
import useExperienceMetrics from "../../../components/hooks/experiences-hooks/useExperienceMetrics";
import LoadingState from "../../../components/common/LoadingState/LoadingState";

const AdminRutas = () => {
  // Use the hook to get dynamic metrics
  const { 
    excursionesDisponibles,
    excursionesSinInscripciones,
    promedioParticipantes,
    rutasAnadidasUltimoMes,
    excursionesRechazadas,
    loading,
    error
  } = useExperienceMetrics();

  // Show loading state while fetching metrics
  if (loading) {
    return <LoadingState text="Cargando métricas de experiencias..." />;
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className={`inset-0 mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start px-4 sm:px-8 md:px-16 ${adminBaseStyles}`}>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
          Gestión Rutas y Excursiones
        </h1>
        <p className="text-red-500 mt-4">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`inset-0 mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start px-4 sm:px-8 md:px-16 ${adminBaseStyles}`}> 
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
        Gestión Rutas y Excursiones
      </h1>
      <h1 className="text-white text-base sm:text-lg mt-2">
        Ofrecemos diversos servicios para todo tipo de personas y niveles de exigencia
        con calidad y amor por nuestro parque nacional.
      </h1>
      <hr className="border-1 border-white-600 w-full sm:w-64 md:w-96 my-4" />
      <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-2 mb-4">
        Información relevante
      </h1>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"> 
          <RelevantInfoS number={excursionesDisponibles} description="Excursiones Disponibles" />
          <RelevantInfoS number={excursionesSinInscripciones} description="Excursiones sin Inscripciones" />
          <RelevantInfoS number={promedioParticipantes} description="Promedio de participantes por mes" />
          <RelevantInfoS number={rutasAnadidasUltimoMes} description="Rutas añadidas en el último mes" />
          <RelevantInfoS number={excursionesRechazadas} description="Excursiones Rechazadas" />
        </div>
      </div>
      <hr className="border-1 border-white-600 w-full sm:w-64 md:w-96 my-4" />
      <div className="w-full flex justify-center">
        <AdminExperienceRequests />
      </div>
    </div>
  );
};

export default AdminRutas;