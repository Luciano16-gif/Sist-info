// AddActivityForm.jsx
import React from 'react';

const AddActivityForm = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-2">AGREGAR NUEVA ACTIVIDAD</h2>
      <p className="text-sm text-white mb-4">EXPANDE NUESTRA LISTA DE SERVICIOS Y EXPERIENCIAS CON IDEAS FRESCAS Y CREATIVAS...</p>

      <div className="bg-[#16260C] p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="activityName" className="block text-white text-sm font-bold mb-2">NOMBRE DE LA ACTIVIDAD</label>
            <input
              type="text"
              id="activityName"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-[#D9D9D9] text-black"
              placeholder=""
            />
            {/* Button placed directly below the input field */}
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
              </svg>
              <span>AGREGAR ACTIVIDAD</span>
            </button>
          </div>
          <div className="md:row-span-2"> {/* Added md:row-span-2 back */}
            <label htmlFor="activityDescription" className="block text-white text-sm font-bold mb-2">DESCRIPCIÓN DE LA ACTIVIDAD</label>
            <textarea
              id="activityDescription"
              className="shadow appearance-none border rounded w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline bg-[#D9D9D9] text-black h-32 md:h-full" // Added md:h-full back
              placeholder=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddActivityForm;