import React, { useState } from 'react';
import ForumCard from './ForumCard';

const ForumSection = () => {
  const initialForumData = [
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "001", postDate: "Hace 1 semana", title: "Mejores Rutas para Principiantes", content: "Ésta es una excelente oportunidad..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "095", postDate: "Hace 1 mes", title: "Medidas de Seguridad en Excursiones", content: "Quería iniciar este hilo..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "081", postDate: "Hace 2 Semanas", title: "Qué Llevar en tu Mochila", content: "Hola a todos, estoy organizando..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "053", postDate: "Hace 5 días", content: "¡Hola! Recomiendo la Ruta de la Finca..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "189", postDate: "Hace 2 Semanas", content: "Es fundamental siempre caminar con un grupo..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "163", postDate: "Hace 8 Días", content: "¡Hola! No olvides llevar suficiente agua..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "134", postDate: "Hace 3 Días", content: "Yo también coincido, la Ruta de la Finca..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "011", postDate: "Hace 1 Semana", content: "Sugiero que todos lleven un botiquín básico..." },
    { userImage: "https://via.placeholder.com/40", userName: "Usuario", userNumber: "022", postDate: "Hace 2 Días", content: "Además de lo mencionado, yo añadiría..." },
  ];

  const [forumData, setForumData] = useState(initialForumData); 

  return (
    <>
      <h2 className="text-4xl font-bold text-white mb-2 tracking-widest">Foros disponibles actualmente</h2>
      <p className="text-sm text-white mb-4 tracking-widest">Estos son los foros que han sido creados por nuestros usuarios, guías y administradores, creando un espacio de ayuda y expresión para todos.</p>
      <div className="bg-[#121F0A] text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forumData.map((forum, index) => (
            <div key={index} className="relative">
              {index < 3 && (
                <button
                  className="absolute -top-4 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs z-10"
                  onClick={() => {}}
                >
                  Eliminar
                </button>
              )}
              <ForumCard {...forum} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ForumSection;