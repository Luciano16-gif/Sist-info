import { Link } from "react-router-dom";
import { useState } from "react";

const HamburgerMenu= () => {

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

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <nav 
      className="
        relative 
        md:hidden 
        lg:hidden
      "
    >
      <div className="absolute top-0 left-0 right-0 border-b-2 border-yellow-500 h-16 flex items-center px-4 z-50">
        <button 
          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 text-3xl" 
          onClick={() => toggleMenu()}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`
              absolute
              top-3
              transform transition-all duration-300
              ${isOpen ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}
            `}
          >
            ☰
          </span>

          <span
            className={`
              absolute
              top-3
              transform transition-all duration-300
              ${!isOpen ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}
            `}
          >
            X
          </span>
              
        </button>
      </div>
      
      
      <div
        className={`fixed inset-0 bg-black/95 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleLinkClick}
      >
        <ul className="flex flex-col items-center justify-center h-screen pt-16">
            {menuItems.map((item, index) => (
              <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
                <Link 
                  className="text-yellow-400 hover:text-yellow-300 text-xl uppercase tracking-wider font-semibold py-4 px-4 w-full inline-block
                            transform transition-all duration-300 hover:scale-110
                          hover:bg-yellow-500/10"
                  to={item.href}>
                    {item.label}
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="w-24 h-px bg-yellow-500/30 mx-auto" />
                )}
              </li>  
            ))}
        </ul> 
      </div>       
      <div className="bg-black h-16 md:hidden lg:hidden" /> {/* Add a div to push the content below the navigation, 
                                                                otherwise it will be on top of the content */}
    </nav>   
  );
};

export default HamburgerMenu;
