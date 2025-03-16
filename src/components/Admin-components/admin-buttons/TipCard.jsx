// TipCard.jsx
import React, { useState } from 'react';

const TipCard = ({ imageSrc, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Estado para mostrar el pop-up
    const [editedTitle, setEditedTitle] = useState(title); // Estado para el título editado
    const [editedDescription, setEditedDescription] = useState(description); // Estado para la descripción editada
    const [editedImage, setEditedImage] = useState(imageSrc); // Estado para la imagen editada

    // Función para abrir el pop-up
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Función para cerrar el pop-up
    const handleClosePopup = () => {
        setIsEditing(false);
    };

    // Función para manejar la selección de una nueva imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedImage(reader.result); // Actualizar la imagen con la nueva seleccionada
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {/* Carta principal */}
            <div 
                className={`bg-[#556052] w-[311px] h-[480px] text-white p-6 rounded-xl flex items-center justify-center relative overflow-hidden ${isHovered ? 'bg-black bg-opacity-70' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
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
                            className="bg-gray-500 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-4"
                            onClick={handleEditClick}
                        >
                            Editar
                        </button>
                        <button 
                            className="bg-gray-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => console.log('Delete')}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {/* Pop-up para editar carta */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#556052] w-[441px] h-[681px] rounded-xl p-8 relative overflow-y-auto">
                        {/* Botón de cerrar */}
                        <button 
                            className="absolute top-4 right-4 text-white text-2xl font-bold"
                            onClick={handleClosePopup}
                        >
                            &times;
                        </button>

                        <div className="bg-[#556052] w-[360px] h-[610px] mx-auto rounded-xl border-2 border-white flex flex-col items-center justify-center space-y-6 p-6 overflow-y-auto">
                            {/* Input para la imagen */}
                            <label className="w-[200px] h-[200px] bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange} 
                                />
                                {editedImage ? (
                                    <img src={editedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <span className="text-white">Seleccionar imagen</span>
                                )}
                            </label>

                            <hr className="border-t border-white-600 w-[300px]" />

                            {/* Input para título */}
                            <input 
                                type="text" 
                                value={editedTitle} 
                                onChange={(e) => setEditedTitle(e.target.value)} 
                                className="w-full p-2 text-white bg-gray-700 rounded-md"
                                placeholder="Título"
                            />

                            {/* Input para descripción */}
                            <textarea 
                                value={editedDescription} 
                                onChange={(e) => setEditedDescription(e.target.value)} 
                                className="w-full p-2 text-white bg-gray-700 rounded-md resize-none"
                                placeholder="Descripción"
                                rows="7"
                            />

                            {/* Botón Aceptar */}
                            <button 
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-full self-end"
                                onClick={() => {
                                    console.log('Cambios guardados:', editedTitle, editedDescription, editedImage);
                                    handleClosePopup();
                                }}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TipCard;