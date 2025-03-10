import { Link } from "react-router-dom";
import { useState } from "react";
import useScrollDetection from "./useScrollDetection"; 

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <nav 
      className="fixed z-50 top-0 left-0 right-0 md:hidden lg:hidden"
      style={{ zIndex: 9999 }}
    >
      <div 
        className={`
          absolute top-0 left-0 right-0 
          h-16 flex items-center justify-between px-4 z-50 
          bg-black
          ${scrolled ? 'bg-opacity-95' : 'bg-opacity-85'}
          transition-all duration-300
        `}
      >
        {/* Burger Menu Button */}
        <div className="w-10 h-10">
          <label className="w-10 h-10 cursor-pointer flex items-center justify-center">
            <input 
              type="checkbox" 
              className="hidden"
              checked={isOpen}
              onChange={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            />
            {/* Center point for transformation */}
            <div className="w-10 h-10 relative flex items-center justify-center">
              {/* Top bar */}
              <span 
                className={`absolute h-1.5 bg-white rounded-full transition-all duration-300
                  ${isOpen 
                    ? "w-10 rotate-45" 
                    : "w-10 -translate-y-3"
                  }`}
              />
              {/* Middle bar */}
              <span 
                className={`block h-1.5 bg-white rounded-full transition-all duration-300
                  ${isOpen 
                    ? "w-10 opacity-0 -translate-x-5" 
                    : "w-10 opacity-100"
                  }`}
              />
              {/* Bottom bar */}
              <span 
                className={`absolute h-1.5 bg-white rounded-full transition-all duration-300
                  ${isOpen 
                    ? "w-10 -rotate-45" 
                    : "w-10 translate-y-3"
                  }`}
              />
            </div>
          </label>
        </div>

        {/* Logo and Visitor text */}
        <div className="flex items-center">
          <img 
            className="max-h-10 min-w-16 min-h-6"
            src="/src/assets/images/Logo_Avilaventuras.webp"
            alt="Avilaventuras"
          />
          <p className="uppercase font-ysabeau text-gray-400 text-xs ml-4">Visitante</p>
        </div>
      </div>
      
      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 transition-all duration-300 ease-in-out z-40 ${
          isOpen 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        onClick={handleLinkClick}
      >
        <div className="flex flex-col items-center justify-center h-screen pt-16 px-6">
          {/* Main menu items */}
          <ul className="flex flex-col items-center justify-center w-full">
            {menuItems.map((item, index) => (
              <li key={item.href} className="w-full text-center hover:scale-110 transform transition-all duration-300 my-2">
                <Link
                  className="text-white font-ysabeau uppercase underline text-lg tracking-wider py-4 px-4 w-full inline-block"
                  to={item.href}
                >
                  {item.label}
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="w-24 h-px bg-white/30 mx-auto mt-2" />
                )}
              </li>
            ))}
          </ul>
          
          {/* Separator */}
          <div className="w-32 h-px bg-white/50 my-6" />
          
          {/* Session items */}
          <ul className="flex flex-col uppercase font-ysabeau text-sm space-y-4 items-center">
            {sesionItems.map((item) => (
              <li key={item.href} className="bg-gray-800 box-border px-6 py-2.5 border-gray-200 border rounded-full hover:scale-110 transform transition-all duration-300">
                <Link to={item.href} className="text-white text-center whitespace-nowrap">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HamburgerMenu;