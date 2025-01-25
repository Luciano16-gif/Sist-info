import { Link } from "react-router-dom";
import { useState } from "react";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/people", label: "People" },
    { href: "/planets", label: "Planets" },
    { href: "/films", label: "Films" },
    { href: "/starships", label: "Starships" },
    { href: "/vehicles", label: "Vehicles" },
    { href: "/species", label: "Species" },
  ];

  return (
    <nav className="relative md:hidden lg:hidden">
      <div className="absolute top-0 left-0 right-0 border-b-2 border-yellow-500 h-16 flex items-center px-4 z-50">
        <button 
          className="relative h-10 w-10 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {/* Hamburger icon bars */}
          <span className={`
            absolute block w-10 h-[6.5px] bg-current rounded-full
            transition-all duration-300
            ${isOpen ? 
              "rotate-45 origin-top-left w-12 left-1 top-0" : 
              "top-0 left-0"
            }
          `} />
          <span className={`
            absolute block w-10 h-[6.5px] bg-current rounded-full
            transition-all duration-300 top-[15px] left-0
            ${isOpen ? "opacity-0 -translate-x-5" : ""}
          `} />
          <span className={`
            absolute block w-10 h-[6.5px] bg-current rounded-full
            transition-all duration-300
            ${isOpen ? 
              "-rotate-45 origin-top-left w-12 left-0 bottom-[-1px]" : 
              "bottom-1 left-0"
            }
          `} />
        </button>
      </div>
      
      {/* Overlay menu */}
      <div
        className={`fixed inset-0 bg-black/95 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <ul className="flex flex-col items-center justify-center h-screen pt-16">
          {menuItems.map((item, index) => (
            <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
              <Link 
                className="text-yellow-400 hover:text-yellow-300 text-xl uppercase tracking-wider font-semibold py-4 px-4 w-full inline-block
                          transform transition-all duration-300 hover:scale-110
                        hover:bg-yellow-500/10"
                to={item.href}
              >
                {item.label}
              </Link>
              {index < menuItems.length - 1 && (
                <div className="w-24 h-px bg-yellow-500/30 mx-auto" />
              )}
            </li>  
          ))}
        </ul> 
      </div>       
      <div className="bg-black h-16 md:hidden lg:hidden" />
    </nav>   
  );
};

export default HamburgerMenu;