
const BusquedaMensajes = () => {
    return (
        <div className="flex items-center mb-4 space-x-5">
            <div className="flex flex-col">
                <h2 className="text-4xl font-bold text-white mr-4">Mensajes Pendientes</h2>
                <h2 className="text-sm text-white mr-4">Se muestran los
                    mensajes no leidos y los no respondidos
                </h2>
            </div>
        
        <div className="flex relative">
          <input
            type="text"
            placeholder="Buscar chat..."
            className="pl-10 pr-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            style={{
              borderRadius: '',
              border: '0.2rem solid rgba(255, 255, 255, 0.50)',
              background: 'rgba(255, 255, 255, 0.40)',
              width: '20rem'
            }}
          />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-gray-400"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
            </div>
        </div>
      </div>
    );
}

export default BusquedaMensajes;