import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProfileB = () => {
  const { currentUser, logout, userRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get admin name
  const adminName = currentUser?.displayName || 'Admin';

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="relative w-full h-auto">
      <div className="
        absolute top-4 right-4 
        w-[17.3rem] h-[4.5rem] 
        flex-shrink-0 
        rounded-[1.2rem] 
        bg-[#3A4C2E] 
        p-4 
        flex items-center justify-between 
        z-40
        shadow-md
        transition-all duration-300 hover:shadow-lg
      ">
        <div className="text-white">
          <div className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">{adminName}</div>
          <Link 
            to="/profile-management-page" 
            className="text-xs underline text-white hover:text-gray-200 transition-colors"
          >
            VER PERFIL COMPLETO
          </Link>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="focus:outline-none"
            aria-expanded={showDropdown}
            aria-label="Admin menu"
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Admin Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white cursor-pointer hover:border-gray-300 transition-colors"
              />
            ) : (
              <div className="
                w-12 h-12 
                rounded-full 
                bg-gray-300
                flex justify-center items-center
                border-2 border-white
                cursor-pointer
                hover:border-gray-300
                transition-colors
              ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.327 14 4 15.344 4 18V20H20V18C20 15.344 14.673 14 12 14Z" fill="#000000" />
                </svg>
              </div>
            )}
          </button>
          
          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg py-1 z-50 border border-gray-700 rounded-lg">
              <Link 
                to="/profile-management-page" 
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Mi Perfil
              </Link>
              
              <Link 
                to="/homeAdmin" 
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Dashboard
              </Link>
              
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
              
              <Link 
                to="/" 
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Ver Sitio Web
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 border-t border-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileB;