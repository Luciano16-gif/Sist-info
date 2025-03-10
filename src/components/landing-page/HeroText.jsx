const test = true;

const HeroText = () => {
    return (
        <div className="min-h-screen text-white relative">
            { !test ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 space-y-4 z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-bold">
                  Descubre la<br />
                  majestuosidad del<br />
                  Ávila
                </h1>
                <p className="text-sm md:text-base max-w-2xl">
                  Tu aventura comienza aquí. Reserva tu excursión hoy mismo y vive una experiencia inolvidable en Caracas.
                </p>
                <button className="bg-[#AAACA8] text-white px-6 py-3 rounded-full mt-4 hover:bg-opacity-90 transition-all">
                  Únete a la aventura
                </button>
              </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-8 md:px-16 z-10 text-center">
                    <h1 className="text-1xl md:text-2xl font-bold">
                    The call of the<br />
                    </h1>
                    <h1 className="text-8xl md:text-10xl font-bold">
                    MOUNTAINS<br />
                    </h1>
                    <button className="text-white font-normal underline hover:font-bold hover:bg-opacity-90 hover:scale-105 transition-all transform">
                    Ver más imágenes...
                    </button>
            </div>
            )}
        </div>
    )
}

export default HeroText;