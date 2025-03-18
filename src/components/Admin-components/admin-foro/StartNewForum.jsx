import { useState } from "react";

const NewForo = () => {
  const [text, setText] = useState('');

  return (
    <div className="w-full mt-4 sm:mt-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-widest">Iniciar Nuevo Foro</h1>
      <p className="text-xs sm:text-sm text-white mb-4 tracking-widest">
        Escribe un nuevo tema e inicia un hilo para que nuestros usuarios y guías puedan unirse a la conversación
      </p>
      <form className="flex flex-col sm:flex-row items-start gap-4 mt-3 sm:mt-5 w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder=""
          className="w-full sm:w-[400px] md:w-[500px] lg:w-[600px] h-[150px] sm:h-[201px] bg-[#636e5a] border-none rounded p-2.5 text-white text-base resize-none focus:outline-none"
        />
        <button
          type="button"
          className="bg-[#636e5a] text-white py-2 px-4 sm:py-2.5 sm:px-5 rounded-full border border-white flex items-center gap-2 cursor-pointer text-sm sm:text-base h-fit mt-2 sm:mt-0"
        >
          Agregar <span className="text-xl">+</span>
        </button>
      </form>
    </div>
  );
};

export default NewForo;