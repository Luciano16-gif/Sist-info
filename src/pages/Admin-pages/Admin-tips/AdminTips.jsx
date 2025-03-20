import React, { useState } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import TipCard from "../../../components/Admin-components/admin-buttons/TipCard";
import backpack from "../../../assets/images/landing-page-admin/backpack.webp";
import hiker from "../../../assets/images/landing-page-admin/hiker.webp";
import sunscreen from "../../../assets/images/landing-page-admin/skincare.webp";
import smartphone from "../../../assets/images/landing-page-admin/smartphone.webp";
import tree from "../../../assets/images/landing-page-admin/tree.webp";
import water from "../../../assets/images/landing-page-admin/water.webp";
import camara from "../../../assets/images/landing-page-admin/camara.webp";
import libro from "../../../assets/images/landing-page-admin/libro.webp";
import botiquin from "../../../assets/images/landing-page-admin/botiquin.webp";
import nublado from "../../../assets/images/landing-page-admin/nublado.webp";
import oreja from "../../../assets/images/landing-page-admin/oreja.webp";

const AdminTips = () => {
    // Variables de información relevante
    const TipsPublicos = 6;
    const TipsEliminados = 4;
    const TipsEditados = 21;
    const SolicitudesTips = 14;
    const TipsCreados = 3;
    const [newTipImage, setNewTipImage] = useState(null);
    const [newTipTitle, setNewTipTitle] = useState('');
    const [newTipDescription, setNewTipDescription] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

    // Datos de las cartas de solicitudes de tips
    const solicitudCards = [
        {
            imageSrc: nublado,
            title: "Conoce condiciones meteorológicas",
            description: "Antes de salir, revisa el pronóstico del tiempo. Las condiciones pueden cambiar rápidamente en la montaña, así que prepárate para escenarios inesperados."
        },
        {
            imageSrc: botiquin,
            title: "Aprende primeros auxilios básicos",
            description: "Tener nociones de primeros auxilios puede marcar la diferencia en caso de accidente. Considera llevar un botiquín y saber cómo usarlo."
        },
        {
            imageSrc: camara,
            title: "Experimenta con la fotografía",
            description: "Captura la belleza de la naturaleza. Practica la fotografía de paisajes, animales o las pequeñas cosas que a menudo se pasan por alto."
        },
        {
            imageSrc: libro,
            title: "Lleva un diario de excursión",
            description: "Anota tus observaciones, pensamientos o cualquier cosa que te llame la atención durante la caminata. Esto puede ser una bonita forma de recordar tu experiencia."
        },
        {
            imageSrc: oreja,
            title: "Escucha la naturaleza",
            description: "Disfruta del silencio y los sonidos del entorno. Deja a un lado la música o el ruido de los dispositivos electrónicos para conectarte mejor con el ambiente."
        },
    ];

    // Función para manejar la selección de una imagen en un nuevo tip
    const handleNewTipImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewTipImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTipClick = () => {
        console.log('Nuevo tip agregado:', newTipTitle, newTipDescription, newTipImage);
        setShowSuccessPopup(true); // Mostrar el pop-up de éxito
        // Aquí hay que agregar cómo almacenaremos el nuevo tip
    };
    
    // Función para cerrar el pop-up de éxito
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false); // Cerrar el pop-up 
    };

    return (
        <div className="absolute inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 space-y-4 z-10">
            <h1 className="text-white text-4xl md:text-5xl font-bold">Tips</h1>
            <h1 className="text-white text-lg md:text-lg">
                Consejos y recomendaciones ofrecidas a nuestros usuarios para mejorar y perfeccionar
                su experiencia junto a nosotros.
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <h1 className="text-white text-3xl md:text-3xl font-bold">Información Relevante</h1>
            <div className="flex justify-start space-x-10">
                <RelevantInfoS number={TipsPublicos} description="Tips publicados actualmente" />
                <RelevantInfoS number={TipsEliminados} description="Tips Eliminados" />
                <RelevantInfoS number={TipsEditados} description="Tips Editados" />
                <RelevantInfoS number={SolicitudesTips} description="Solicitudes nuevas de tips" />
                <RelevantInfoS number={TipsCreados} description="Tips creados este mes" />
            </div>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96 py-4" />

            {/* Sección de Baraja de Tips Actual */}
            <div className="flex flex-row gap-8 w-full">
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
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-8 flex-nowrap" style={{ minWidth: `${tipsCards.length * 320}px` }}>
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

            <hr className="border-1 border-white-600 sm:w-10 md:w-96 py-4" />

            {/* Sección de Solicitudes de Tips */}
            <h1 className="text-white text-3xl md:text-3xl font-bold">Solicitudes de tips</h1>
            <h1 className="text-white text-lg md:text-lg">
                Nuestros guías tienen contacto directo con nuestros usuarios y saben qué consejo les puede estar faltando para
                mejorar su experiencia con nosotros. Revisa las solicitudes de nuevos tips que han enviado.
            </h1>

            {/* Cartas de Solicitudes */}
            <div className="flex flex-row gap-8 w-full">
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-8 flex-nowrap" style={{ minWidth: `${solicitudCards.length * 320}px` }}>
                        {solicitudCards.map((solicitud, index) => (
                            <div key={index}>
                                <TipCard
                                    type="solicitud"
                                    imageSrc={solicitud.imageSrc}
                                    title={solicitud.title}
                                    description={solicitud.description}
                                />
                                <p className="text-white text-center mt-2">Enviado por: Juan Mendoza</p> {/* Usuario que envió la solicitud */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-1 border-white-600 sm:w-10 md:w-96 py-4" />

            {/* Sección de creación de tip */}
            <div className="flex flex-row gap-8 w-full">
                {/* Parte izquierda: texto */}
                <div className="flex flex-col justify-center items-start w-64">
                    <h1 className="text-white text-[43px] font-bold pt-6 pb-6">Crear nuevo tip</h1>
                    <div className="flex items-center">
                        <hr className="border-t border-white w-[138.293px] mx-8 p-4" />
                    </div>
                    <p className="text-white text-[16px]">
                        Expande nuestra lista de información útil y de calidad para mejorar la experiencia de nuestros usuarios
                    </p>
                </div>

                {/* Divisor vertical */}
                <div className="flex items-center">
                    <hr className="border-l border-white h-[361.341px] mx-8" />
                </div>

                {/* Parte derecha: Formulario para crear nuevo tip */}
                <div className="flex flex-col items-center justify-center w-[441px] h-[681px] bg-[#556052] rounded-xl p-8">
                  <div className="bg-[#556052] w-[360px] h-[610px] mx-auto rounded-xl border-2 border-white flex flex-col items-center justify-center space-y-6 p-6 overflow-y-auto">
                      {/* Input para la imagen */}
                      <label className="w-[200px] h-[200px] bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer mb-4">
                          <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleNewTipImageChange} 
                          />
                          {newTipImage ? (
                              <img src={newTipImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                              <span className="text-white">Seleccionar imagen</span>
                          )}
                      </label>
                      <hr className="border-t border-white-600 w-[300px]" />
                      {/* Input para el título */}
                      <input 
                          type="text" 
                          value={newTipTitle} 
                          onChange={(e) => setNewTipTitle(e.target.value)} 
                          className="w-full p-2 text-white bg-gray-700 rounded-md mb-4"
                          placeholder="Título"
                      />
                      {/* Input para la descripción */}
                      <textarea 
                          value={newTipDescription} 
                          onChange={(e) => setNewTipDescription(e.target.value)} 
                          className="w-full p-2 text-white bg-gray-700 rounded-md resize-none mb-4"
                          placeholder="Descripción"
                          rows="7"
                      />
                      {/* Botón de Agregar Tip */}
                      <button 
                          className="bg-gray-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
                          onClick={handleAddTipClick}
                      >
                          + Agregar Tip
                      </button>
                  </div>
                </div>
            </div>

            {/* Pop-up de tip creado */}
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#556052] w-[400px] h-[200px] rounded-xl p-8 relative">
                        <button 
                            className="absolute top-4 right-4 text-white text-2xl font-bold"
                            onClick={handleCloseSuccessPopup}
                        >
                            &times;
                        </button>
                        {/* Pop-up de guardado con éxito */}
                        <div className="flex flex-col items-center justify-center space-y-6 h-full">
                            <p className="text-white text-[25px] font-bold">¡Tip creado agregado a nuestra lista pública de tips!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTips;