import React from 'react';

const PhotoCard = ({ imageUrl, name, type, date, time }) => {
  return (
    <div className="bg-green-800 rounded-lg shadow-lg p-4">
      <div className="relative rounded-t-lg overflow-hidden"> {/* Eliminado flex justify-center */}
        <img
          src={imageUrl}
          className="w-[339px] h-[254px] object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          {/* Icono de check (opcional) */}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-300 text-sm mb-2">
          {type} - {date} - {time}
        </p>
        <div className="flex justify-between mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Aceptar
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;