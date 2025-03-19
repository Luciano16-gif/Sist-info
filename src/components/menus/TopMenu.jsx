import { Link } from "react-router-dom";
import { useState } from "react";
import useScrollDetection from "./useScrollDetection";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdownMenu";
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';

const TopMenu = () => {
  const scrolled = useScrollDetection();
  const { currentUser, logout, userRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Define base menu items - SIMPLIFIED for top navigation
  const baseMenuItems = [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/reviews", label: "Reseñas" },
    { href: "/foro", label: "Foro" },
    { href: "/busqueda", label: "Búsqueda" },
  ];

  // Create final menu items array 
  const menuItems = [...baseMenuItems];

  const sesionItems = [
    { href: "/signUpPage", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "V";
    
    const displayName = currentUser.displayName || "";
    if (displayName) {
      return displayName
        .split(" ")
        .map(name => name.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return currentUser.email.charAt(0).toUpperCase();
  };

  // Prepare custom button content for TopMenu
  const topMenuButtonContent = (
    currentUser?.photoURL ? (
      <img 
        src={currentUser.photoURL} 
        alt="User Profile" 
        className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium border-2 border-white cursor-pointer">
        {getUserInitials()}
      </div>
    )
  );

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
        ${scrolled ? 'bg-opacity-95' : 'bg-opacity-95'}
        transition-all
        duration-300
        min-h-16 lg:min-h-20 xl:min-h-20
        z-50
      `}
      style={{ zIndex: 9999 }}
    >
      {/* Use a 3-column grid layout for better centering */}
      <div className="w-full grid grid-cols-[1fr_3fr_1fr] items-center px-4">
        {/* Left section - Logo and user info */}
        <div className="flex items-center">
          <Link to={"/"}>
            <img 
              className="max-h-10 min-w-16 min-h-6"
              src={logoImage}
              alt="Avilaventuras"
            />
          </Link>
          {currentUser ? (
            <div className="ml-4 flex items-center">
              <span className="uppercase font-ysabeau text-white text-xs md:text-xs lg:text-sm xl:text-base">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
            </div>
          ) : (
            <p className="uppercase font-ysabeau text-gray-400 text-xs ml-4 md:text-xs lg:text-sm xl:text-base">Visitante</p>
          )}
        </div>
        
        {/* Center section - Main navigation */}
        <div className="flex justify-center">
          <ul className="flex justify-center uppercase font-ysabeau underline text-xs lg:text-sm xl:text-base gap-1 md:gap-2 lg:gap-3">
            {menuItems.map((item) => (
              <li key={item.href} className="hover:scale-110 transform transition-all duration-300 whitespace-nowrap px-1">
                <Link to={item.href} className="text-center">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right section - User profile/login */}
        <div className="flex justify-end">
          {currentUser ? (
            // User is logged in - show profile dropdown
            <UserDropdown 
              currentUser={currentUser}
              userRole={userRole}
              onLogout={logout}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              dropdownAlign="right"
              bgColor="bg-gray-800"
              buttonContent={topMenuButtonContent}
            />
          ) : (
            // User is not logged in - show login/signup buttons
            <ul className="flex flex-row uppercase font-ysabeau text-xs lg:text-sm xl:text-base space-x-1 md:space-x-2">
              {sesionItems.map((item) => (
                <li key={item.href} className="bg-gray-800 box-border px-2 md:px-3 lg:px-4 py-1 md:py-1.5 border-gray-200 border rounded-full hover:scale-110 transform transition-all duration-300">
                  <Link to={item.href} className="text-center whitespace-nowrap">{item.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;