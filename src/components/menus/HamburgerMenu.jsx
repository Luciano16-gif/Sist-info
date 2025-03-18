import { Link } from "react-router-dom";
import { useState } from "react";
import useScrollDetection from "./useScrollDetection"; 
import { useAuth } from "../contexts/AuthContext";
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollDetection();
  const { currentUser, logout, userRole } = useAuth();

  // Define base menu items
  const baseMenuItems = [
    { href: "/experiencias", label: "Experiencias" }, 
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/reviews", label: "Reseñas" },
    { href: "/foro", label: "Foro" },
  ];
  // Create final menu items array with conditional item for admin/guide
  const menuItems = [...baseMenuItems];

  if (currentUser) {
    menuItems.push({ href: "/user-requests", label: "Mis Solicitudes" });
  }
  
  // Add "Crear Experiencia" for admin and guide users after "Experiencias"
  if (currentUser && (userRole === 'admin' || userRole === 'guia')) {
    menuItems.splice(1, 0, { href: "/crear-experiencia", label: "Crear Experiencia" });
  }

  // Add "Panel Admin" for admin users only
  if (currentUser && userRole === 'admin') {
    menuItems.splice(2, 0, { href: "/homeAdmin", label: "Panel Admin" });
  }

  const sesionItems = [
    { href: "/signUpPage", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ];

  const userMenuItems = [
    { href: "/profile-management-page", label: "Mi Perfil" },
    { href: "/", label: "Cerrar Sesión", onClick: handleLogout },
  ];

  async function handleLogout() {
    try {
      await logout();
      setIsOpen(false);
      // No need to navigate - the AuthContext will handle the redirect
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleLinkClick() {
    setIsOpen(false);
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "V";
    
    // Try to get name from currentUser
    const displayName = currentUser.displayName || "";
    if (displayName) {
      return displayName
        .split(" ")
        .map(name => name.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fallback to email
    return currentUser.email.charAt(0).toUpperCase();
  };

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
          ${scrolled ? 'bg-opacity-95' : 'bg-opacity-95'}
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

        {/* Logo and User Info */}
        <div className="flex items-center">
          <Link to={"/"}>
            <img 
              className="max-h-10 min-w-16 min-h-6"
              src={logoImage}
              alt="Avilaventuras"
            />
          </Link>
          {currentUser ? (
            <div className="flex items-center ml-4">
              {/* User Avatar - use currentUser.photoURL */}
              <div className="flex items-center">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="User Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="uppercase font-ysabeau text-gray-400 text-xs ml-4">Visitante</p>
          )}
        </div>
      </div>
      
      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 transition-all duration-300 ease-in-out z-40 ${
          isOpen 
            ? "opacity-100 scale-100 overflow-y-auto" 
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        onClick={handleLinkClick}
      >
        {/* Changed to flex-start instead of center to ensure visibility of all items */}
        <div className="flex flex-col items-center pt-20 pb-10 px-6 min-h-screen">
          {/* Main menu items */}
          <ul className="flex flex-col items-center justify-center w-full">
            {menuItems.map((item, index) => (
              <li key={item.href} className="w-full text-center hover:scale-110 transform transition-all duration-300 my-1">
                <Link
                  className="text-white font-ysabeau uppercase underline text-lg tracking-wider py-3 px-4 w-full inline-block"
                  to={item.href}
                >
                  {item.label}
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="w-24 h-px bg-white/30 mx-auto mt-1" />
                )}
              </li>
            ))}
          </ul>
          
          {/* Separator */}
          <div className="w-32 h-px bg-white/50 my-3" />
          
          {/* Session items or User menu */}
          <ul className="flex flex-col uppercase font-ysabeau text-sm gap-3 items-center">
            {currentUser ? (
              // User is logged in - show user menu
              userMenuItems.map((item) => (
                <li key={item.href} className="bg-gray-800 box-border px-6 py-2.5 border-gray-200 border rounded-full hover:scale-110 transform transition-all duration-300">
                  {item.onClick ? (
                    <button 
                      onClick={item.onClick}
                      className="text-white text-center whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.href} className="text-white text-center whitespace-nowrap">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))
            ) : (
              // User is not logged in - show login/signup
              sesionItems.map((item) => (
                <li key={item.href} className="bg-gray-800 box-border px-6 py-2.5 border-gray-200 border rounded-full hover:scale-110 transform transition-all duration-300">
                  <Link to={item.href} className="text-white text-center whitespace-nowrap">
                    {item.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HamburgerMenu;