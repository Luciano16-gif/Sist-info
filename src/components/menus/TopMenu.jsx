import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useScrollDetection from "./useScrollDetection";
import { useAuth } from "../contexts/AuthContext";
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';

const TopMenu = () => {
  const scrolled = useScrollDetection();
  // Get profilePhotoUrl from AuthContext
  const { currentUser, logout, userRole, profilePhotoUrl } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isIpadPro, setIsIpadPro] = useState(false);
  
  // Check if the device is iPad Pro based on screen width
  useEffect(() => {
    const checkIpadPro = () => {
      if (userRole === 'usuario') return;
      // iPad Pro typically has 1024px width
      const isIpadProSize = window.innerWidth >= 1020 && window.innerWidth <= 1030;
      setIsIpadPro(isIpadProSize);
    };
    
    checkIpadPro();
    window.addEventListener('resize', checkIpadPro);
    
    return () => window.removeEventListener('resize', checkIpadPro);
  }, []);

  // Define base menu items - SIMPLIFIED for top navigation
  const baseMenuItems = [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/reviews", label: "Reseñas" },
    { href: "/foro", label: "Foro" },
  ];

  // Create final menu items array 
  const menuItems = [...baseMenuItems];

  const sesionItems = [
    { href: "/signUpPage", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

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
        ${isIpadPro ? 'min-h-32' : 'min-h-16'}
        z-50
      `}
      style={{ zIndex: 9999 }}
    >
      {/* Use a 3-column grid layout for better centering */}
      <div className="w-full grid grid-cols-3 items-center px-4">
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
              <span className="uppercase font-ysabeau text-white text-xs md:text-xs lg:text-sm">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
            </div>
          ) : (
            <p className="uppercase font-ysabeau text-gray-400 text-xs ml-4 md:text-xs lg:text-sm">Visitante</p>
          )}
        </div>
        
        {/* Center section - Main navigation */}
        <div className="flex justify-center">
          <ul className="flex flex-wrap justify-center uppercase font-ysabeau underline text-xs lg:text-sm gap-3 md:gap-4 lg:gap-6">
            {menuItems.map((item) => (
              <li key={item.href} className="hover:scale-110 transform transition-all duration-300 whitespace-nowrap">
                <Link to={item.href} className="text-center">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right section - User profile/login */}
        <div className="flex justify-end">
          {currentUser ? (
            // User is logged in - show profile dropdown
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-expanded={showDropdown}
                aria-label="User menu"
              >
                {/* Use profilePhotoUrl from context instead of Firebase Auth */}
                {profilePhotoUrl ? (
                  <img 
                    src={profilePhotoUrl} 
                    alt="User Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium border-2 border-white cursor-pointer">
                    {getUserInitials()}
                  </div>
                )}
              </button>
              
              {/* Complete dropdown menu with ALL navigation options */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg py-1 z-50 border border-gray-700">
                  <Link 
                    to="/profile-management-page" 
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Mi Perfil
                  </Link>
                  
                  {/* All navigation items moved to dropdown */}
                  <Link 
                    to="/user-requests" 
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Mis Solicitudes
                  </Link>
                  
                  {/* Conditionally add Crear Experiencia to dropdown */}
                  {(userRole === 'admin' || userRole === 'guia') && (
                    <Link 
                      to="/crear-experiencia" 
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      Crear Experiencia
                    </Link>
                  )}
                  
                  {/* Admin-specific dropdown items */}
                  {userRole === 'admin' && (
                    <>
                      <Link 
                        to="/admin-experiencias-pendientes" 
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        Experiencias Pendientes
                      </Link>
                      <Link 
                        to="/admin-guias-pendientes" 
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        Guías Pendientes
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - show login/signup buttons
            <ul className="flex flex-row uppercase font-ysabeau text-xs lg:text-sm space-x-1 md:space-x-2">
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