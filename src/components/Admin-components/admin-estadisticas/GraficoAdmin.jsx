import React from 'react';

const Graficas = () => {
  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-bold">GRÁFICAS</h1>
          <p className="text-gray-400">Representación gráfica de los números generados...</p>
        </div>

        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Buscar gráfica..."
            className="w-full py-2 pl-3 pr-10 rounded-[30px] border-[5px] border-white/50 bg-white/40 text-white focus:outline-none focus:ring-2"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </div>

      <div className="bg-[#16260C] p-6 rounded-[20px] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.40)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"> 

    
          <div className="relative bg-[#F5F5F5] rounded-[30px] w-full md:w-[480px] h-[295px] shrink-0 overflow-hidden">
            <img src="https://via.placeholder.com/480x295?text=Grafica1" alt="Gráfica 1" className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-black">
              Asistencia a Excursiones
            </p>
          </div>

          <div className="relative bg-[#F5F5F5] rounded-[30px] w-full md:w-[480px] h-[295px] shrink-0 overflow-hidden">
            <img src="https://via.placeholder.com/480x295?text=Grafica2" alt="Gráfica 2" className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-black">
              Feedback de guías y clientes
            </p>
          </div>

          <div className="relative bg-[#F5F5F5] rounded-[30px] w-full md:w-[480px] h-[295px] shrink-0 overflow-hidden">
            <img src="https://via.placeholder.com/480x295?text=Grafica3" alt="Gráfica 3" className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-black">
              Satisfacción del cliente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graficas;