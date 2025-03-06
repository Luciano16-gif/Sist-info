import { Link } from "react-router-dom";
import useScrollDetection from "./useScrollDetection";

const TopMenu = () => {
  const scrolled = useScrollDetection();

  const menuItems = [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/resenas", label: "Reseñas" },
  ];

  const sesionItems = [
    { href: "/sign-up-page", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ];

  return (
    <nav 
      className={`
        hidden
        bg-black
        text-white 
        p-1
        md:flex 
        items-center
        shadow-lg
        fixed
        top-0
        left-0
        right-0
        ${scrolled ? 'bg-opacity-95' : 'bg-opacity-85'}
        transition-all
        duration-300
        min-h-16
        z-50
      `}
      style={{ zIndex: 9999 }}
    >
      <div className="w-full flex flex-wrap items-center justify-between px-4">
        <div className="flex items-center">
          <img 
            className="max-h-10 min-w-16 min-h-6"
            src="/src/assets/images/Logo_Avilaventuras.webp"
            alt="Avilaventuras"
          />
          <p className="uppercase font-ysabeau text-gray-400 text-xs ml-4 md:text-xs lg:text-sm">Visitante</p>
        </div>
        
        <ul className="flex flex-row uppercase font-ysabeau underline text-xs lg:text-sm space-x-3 md:space-x-4 lg:space-x-8">
          {menuItems.map((item) => (
            <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
              <Link to={item.href} className="text-center whitespace-nowrap">{item.label}</Link>
            </li>
          ))}
        </ul>
        
        <div className="flex">
          <ul className="flex flex-row uppercase font-ysabeau text-xs lg:text-sm space-x-1 md:space-x-2">
            {sesionItems.map((item) => (
              <li key={item.href} className="bg-gray-800 box-border px-2 md:px-3 lg:px-4 py-1 md:py-1.5 border-gray-200 border rounded-full hover:scale-110 transform transition-all duration-300">
                <Link to={item.href} className="text-center whitespace-nowrap">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;