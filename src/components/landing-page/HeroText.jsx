import { useAuth } from "../contexts/AuthContext";

const HeroText = () => {
  const { currentUser } = useAuth();
    return (
        <div className="min-h-screen text-white relative">
            { currentUser ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 px-4 sm:px-6 md:px-8 lg:px-16 z-10 text-center">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide">
                        The call of the
                    </h1>
                    <h1 className="xltext-5xl sm:text-6 md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none">
                        MOUNTAINS
                    </h1>
                    <div className="mt-2 sm:mt-4 md:mt-6">
                        <button className="text-white text-sm sm:text-base font-normal underline hover:font-bold hover:scale-105 transition-all transform duration-300 px-2 py-1">
                            Ver más imágenes...
                        </button>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    )
}

export default HeroText;