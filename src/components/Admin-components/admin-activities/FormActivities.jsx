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
              className="shadow appearance-none  rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black"
              style={{
                borderRadius: '10px',
                border: '3px solid #FFF',
                background: 'rgba(255, 255, 255, 0.20)',
              }}
              placeholder=""
            />
            {/* Button placed directly below the input field */}
            <button
              className=" hover:bg-gray-100  font-bold py-2 px-4  inline-flex items-center mt-2 text-white"
              style={{
                borderRadius: '30px',
                border: '4px solid #FFF',
                background: 'rgba(217, 217, 217, 0.50)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2 fill-white"> {/*Added fill-white */}
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
              </svg>
              <span>AGREGAR ACTIVIDAD</span>
            </button>
          </div>
          <div className="md:row-span-2">
            <label htmlFor="activityDescription" className="block text-white text-sm font-bold mb-2">DESCRIPCIÓN DE LA ACTIVIDAD</label>
            <textarea
              id="activityDescription"
              className="shadow appearance-none  rounded w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline  text-black h-32 md:h-full"
              style={{
                borderRadius: '10px',
                border: '3px solid #FFF',
                background: 'rgba(255, 255, 255, 0.20)',
              }}
              placeholder=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddActivityForm;