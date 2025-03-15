import React from 'react';

const NewForo = () => {
  const [text, setText] = React.useState('');

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">Iniciar Nuevo Foro</h1>
      <p className="text-sm text-white mb-4 tracking-widest">
        Escribe un nuevo tema e inicia un hilo para que nuestros usuarios y guías puedan unirse a la conversación
      </p>
      <form className="flex items-start gap-4 mt-5"> {/* Added mt-5 */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder=""
          className="w-[657px] h-[201px] bg-[#636e5a] border-none rounded p-2.5 text-white text-base resize-none focus:outline-none flex justify-center items-center"
        />
        <button
          type="button"
          className="bg-[#636e5a] text-white py-2.5 px-5 rounded-full border border-white flex items-center gap-2 cursor-pointer text-base h-fit"
        >
          Agregar <span className="text-xl">+</span>
        </button>
      </form>
    </>
  );
};

export default NewForo;