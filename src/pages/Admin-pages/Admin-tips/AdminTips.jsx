import React from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import TipCard from "../../../components/Admin-components/admin-buttons/TipCard";
import backpack from "../../../assets/images/landing-page-admin/backpack.webp";
import hiker from "../../../assets/images/landing-page-admin/hiker.webp";
import sunscreen from "../../../assets/images/landing-page-admin/skincare.webp";
import smartphone from "../../../assets/images/landing-page-admin/smartphone.webp";
import tree from "../../../assets/images/landing-page-admin/tree.webp";
import water from "../../../assets/images/landing-page-admin/water.webp";

const AdminTips = () => {
    // Variables de información relevante
    const TipsPublicos = 6;
    const TipsEliminados = 4;
    const TipsEditados = 21;
    const SolicitudesTips = 14;
    const TipsCreados = 3;

    // Datos de las cartas de tips actuales
    const tipsCards = [
        {
            imageSrc: backpack,
            title: "Lleva el equipo adecuado",
            description: "Viste capas de ropa que puedas ajustar según el clima y lleva calzado adecuado. No olvides una mochila con elementos esenciales como agua, comida y un botiquín."
        },
        {
          imageSrc: water,
          title: "Hidrátate",
          description: "Bebe agua regularmente, incluso si no tienes sed. La altitud y el esfuerzo físico pueden deshidratarte más rápido de lo esperado."
        },
        {
          imageSrc: tree,
          title: "Respeta la naturaleza",
          description: "Permanece en los senderos marcados, no disturbes la fauna y lleva tu basura de vuelta. Mantener el entorno limpio es fundamental."
        },
        {
          imageSrc: hiker,
          title: "Escucha a tu cuerpo",
          description: "Presta atención a cómo te sientes y no dudes en detenerte si te sientes fatigado o si las condiciones climáticas empeoran."
        },
        {
          imageSrc: smartphone,
          title: "Lleva un teléfono o dispositivo GPS",
          description: "Aunque no siempre haya recepción, un dispositivo GPS puede ser útil en caso de emergencia. Asegúrate de llevar una batería de repuesto."
        },
        {
          imageSrc: sunscreen,
          title: "Usa protector solar",
          description: "Incluso en días nublados, los rayos UV pueden afectar tu piel. Usa un protector solar de amplio espectro y reaplícalo cada par de horas."
        },
    ];

    return (
        <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
            <h1 className="text-white text-4xl md:text-5xl font-bold">
                Tips
            </h1>
            <h1 className="text-white text-lg md:text-lg">
                Consejos y recomendaciones ofrecidas a nuestros usuarios para mejorar y perfeccionar
                su experiencia junto a nosotros.
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <h1 className="text-white text-3xl md:text-3xl font-bold">
                Información Relevante
            </h1>
            <div className="flex justify-start space-x-10">
                <RelevantInfoS number={TipsPublicos} description="Tips publicados actualmente" />
                <RelevantInfoS number={TipsEliminados} description="Tips Eliminados" />
                <RelevantInfoS number={TipsEditados} description="Tips Editados" />
                <RelevantInfoS number={SolicitudesTips} description="Solicitudes nuevas de tips" />
                <RelevantInfoS number={TipsCreados} description="Tips creados este mes" />
            </div>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />

            {/* Sección para la baraja de tips actual */}
            <div className="flex flex-row gap-8">
                {/* Parte izquierda: texto */}
                <div className="flex flex-col justify-center items-start w-64">
                    <h1 className="text-white text-[43px] font-bold pt-6 pb-6">Baraja de Tips Actual</h1>
                    <div className="flex items-center">
                      <hr className="border-t border-white w-[138.293px] mx-8 p-4" />
                    </div>
                    <p className="text-white text-[16px]">
                        Estos son los tips viajeros que actualmente se muestran en la pantalla de nuestros usuarios para su lectura.
                    </p>
                </div>

                {/* Divisor vertical */}
                <div className="flex items-center">
                    <hr className="border-l border-white h-[361.341px] mx-8" />
                </div>

                {/* Parte derecha: Cartas de tips */}
                <div className="flex flex-wrap justify-center gap-8">
                    {tipsCards.map((tip, index) => (
                        <TipCard
                            key={index}
                            imageSrc={tip.imageSrc}
                            title={tip.title}
                            description={tip.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTips;