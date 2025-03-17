import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDropdownMenu = ({ 
  currentUser, 
  userRole, 
  onLogout, 
  showDropdown,
  setShowDropdown,
  dropdownAlign = 'right', // 'right' or 'left'
  bgColor = 'bg-gray-800',
  buttonContent,
  customDropdownStyles = {}
}) => {
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
  }, [setShowDropdown]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Define menu items by role
  const getMenuItems = () => {
    // Common menu items for all logged-in users
    const commonItems = [
      { to: "/profile-management-page", label: "Mi Perfil" },
      { to: "/user-requests", label: "Mis Solicitudes" }
    ];
    
    // Role-specific menu items
    const roleSpecificItems = {
      usuario: [
          // Im leaving this empty for now
      ],
      guia: [
        { to: "/crear-experiencia", label: "Crear Experiencia" }
      ],
      admin: [
        { to: "/crear-experiencia", label: "Crear Experiencia" },
        { to: "/homeAdmin", label: "Panel Admin" },
        { to: "/admin-experiencias-pendientes", label: "Experiencias Pendientes" },
        { to: "/admin-guias-pendientes", label: "Guías Pendientes" },
        { to: "/", label: "Ver Sitio Web" }
      ]
    };
    
    // Combine common items with role-specific items
    const items = [...commonItems];
    
    if (userRole && roleSpecificItems[userRole]) {
      items.push(...roleSpecificItems[userRole]);
    }
    
    return items;
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

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      if (onLogout) await onLogout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Get menu items based on user role
  const menuItems = getMenuItems();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle dropdown - either use custom content or default avatar */}
      {buttonContent ? (
        <button 
          onClick={toggleDropdown}
          className="focus:outline-none"
          aria-expanded={showDropdown}
          aria-label="User menu"
        >
          {buttonContent}
        </button>
      ) : (
        <button 
          onClick={toggleDropdown}
          className="focus:outline-none"
          aria-expanded={showDropdown}
          aria-label="User menu"
        >
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="User Profile" 
              className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer hover:border-gray-300 transition-colors"
            />
          ) : (
            <div className="
              w-8 h-8 
              rounded-full 
              bg-green-600
              flex justify-center items-center
              text-white font-medium
              border-2 border-white
              cursor-pointer
              hover:border-gray-300
              transition-colors
            ">
              {getUserInitials()}
            </div>
          )}
        </button>
      )}
      
      {/* Dropdown menu */}
      {showDropdown && (
        <div 
          className={`absolute ${dropdownAlign === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 ${bgColor} shadow-lg py-1 z-50 border border-gray-700 rounded-lg`}
          style={customDropdownStyles}
        >
          {/* Render menu items dynamically */}
          {menuItems.map((item, index) => (
            <Link 
              key={`${item.to}-${index}`}
              to={item.to} 
              className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Logout button is always at the bottom */}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 border-t border-gray-700"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;