// TipCard.jsx
import React, { useState } from 'react';

const TipCard = ({ imageSrc, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`bg-[#556052] w-[311px] h-[480px] text-white p-6 rounded-xl flex items-center justify-center relative overflow-hidden ${isHovered ? 'bg-black bg-opacity-70' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Contenido de la carta */}
            <div className="bg-[#556052] w-[271.261px] h-[444.167px] text-white rounded-xl flex flex-col items-center border-2 border-solid">
                {/* Parte superior de la carta */}
                <div className="flex flex-col p-12 items-center justify-center">
                    <img src={imageSrc} className="w-[133.432px] h-auto" />
                </div>

                {/* Divisor */}
                <hr className="border-t border-white-600 w-full" />

                {/* Parte inferior de la carta */}
                <h2 className="text-[26px] font-bold text-center mt-2 leading-7">{title}</h2>
                <p className="text-center text-[15px] p-4 leading-5">{description}</p>
            </div>

            {/* Botones de Editar y Eliminar */}
            {isHovered && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
                    <button 
                        className="bg-gray-400 hover:bg-[#EFDE5F] text-white font-bold py-2 px-4 rounded-full mb-4"
                        onClick={() => console.log('Edit')}
                    >
                        Editar
                    </button>
                    <button 
                        className="bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => console.log('Delete')}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TipCard;