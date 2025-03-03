import { Link } from "react-router-dom";
import { useState } from "react";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/resenas", label: "Reseñas" },
  ];

  const sesionItems= [
    { href: "/sign-up-page", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ]

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
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-4 z-50 bg-black bg-opacity-90">
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

        <a className="items-center">
          <img src="src/assets/images/Logo_Avilaventuras.webp"
          />
        </a>
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
        <ul className="flex flex-col items-center justify-center h-screen pt-16">
          {menuItems.map((item, index) => (
            <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
              <Link
                className="text-white hover:text-gray-100100 text-xl uppercase tracking-wider font-semibold py-4 px-4 w-full inline-block
                          transform transition-all duration-300 hover:scale-110
                          hover:bg-yellow-500/10"
                to={item.href}
              >
                {item.label}
              </Link>
              {index < menuItems.length - 1 && (
                <div className="w-24 h-px bg-white/30 mx-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default HamburgerMenu;