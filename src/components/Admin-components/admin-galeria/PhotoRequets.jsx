import React from 'react';
import PhotoCard from './PhotoCard';

const PhotoRequests = () => {
  const photoData = [
    {
      imageUrl: 'https://via.placeholder.com/300x200', // Reemplaza con URLs reales
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
      <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">SOLICITUDES DE FOTOS</h1>
      <p className="text-sm text-white mb-4 tracking-widest">
        AQUÍ APARECERÁN LAS FOTOS QUE ENVÍEN NUESTROS USUARIOS O NUESTROS GUÍAS QUE HAYAN TOMADO DURANTE NUESTRO SERVICIO PARA
        AGREGARLA A NUESTRA GALERÍA DE FOTOS Y QUE TODOS PUEDAN VER LO QUE VIVIDO CON NOSOTROS!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {photoData.map((data, index) => (
          <PhotoCard key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

export default PhotoRequests;