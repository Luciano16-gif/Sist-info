import React from 'react';
import PhotoCard from './PhotoCard';

const PhotoRequests = () => {
  const photoData = [
    {
      imageUrl: 'https://via.placeholder.com/300x200',
      name: 'Gabriela Colmenares',
      type: 'Usuario',
      date: '05-12-2024',
      time: '17:48',
    },
    {
      imageUrl: 'https://via.placeholder.com/300x200',
      name: 'Ricardo Pérez',
      type: 'Guía',
      date: '28-12-2024',
      time: '19:48',
    },
    {
        imageUrl: 'https://via.placeholder.com/300x200',
        name: 'Santiago Hurtado',
        type: 'Guía',
        date: '02-01-2025',
        time: '12:06',
    },
    {
        imageUrl: 'https://via.placeholder.com/300x200',
        name: 'Gabriel Angarita',
        type: 'Usuario',
        date: '08-11-2024',
        time: '11:53',
      },
  ];

  return (
    <div className="container mx-left px-4">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">Solicitudes de Fotos</h1>
      <p className="text-sm text-white mb-4 tracking-widest">
      Aqui apareceran las fotos que envien nuestros usuarios o nuestros guias que hayan tomado durante nuestro servicio para  agregarlo a nuestra galeria de fotos y que todos puedan ver lo que vivido con nosotros!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {photoData.map((data, index) => (
          <PhotoCard key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

export default PhotoRequests;