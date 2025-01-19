export default function LandingPage() {
    return (
        //Estos estilos los puse temporalmente para probar si tailwind funcionaba
        <div className="relative">
            <h1 className="text-xl sm:text-4xl text-yellow-400 font-bold flex items-center justify-center bg-[#181818] min-h-screen gap-5">
                <span className="hover:scale-110 transform transition-all duration-300">Landing</span>  
                <span className="hover:scale-110 transform transition-all duration-300">Page</span> 
                <span className="hover:scale-110 transform transition-all duration-300">placeholder</span>
            </h1>
        </div>
    );
}