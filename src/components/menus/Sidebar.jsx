import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import homeIcon from "../../assets/images/landing-page-admin/home.webp";
import groupIcon from "../../assets/images/landing-page-admin/group.webp";
import applicationIcon from "../../assets/images/landing-page-admin/application.webp";
import wayIcon from "../../assets/images/landing-page-admin/way.webp";
import calendarIcon from "../../assets/images/landing-page-admin/calendar.webp";
import puzzleIcon from "../../assets/images/landing-page-admin/puzzle.webp";
import messagesIcon from "../../assets/images/landing-page-admin/message.webp";
import diagramIcon from "../../assets/images/landing-page-admin/diagram.webp";
import ideaIcon from "../../assets/images/landing-page-admin/idea.webp";
import discussionIcon from "../../assets/images/landing-page-admin/discussion.webp";
import reviewIcon from "../../assets/images/landing-page-admin/review.webp";
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';

// Sidebar menu items configuration
const SIDEBAR_ITEMS = [
  { href: "/homeAdmin", label: "Inicio", icon: homeIcon },
  { href: "/admin-guias-pendientes", label: "Gestion Guias", icon: groupIcon },
  { href: "/admin-galeria", label: "Galería", icon: applicationIcon },
  { href: "/admin-rutas", label: "Rutas", icon: wayIcon },
  { href: "/admin-calendario", label: "Calendario", icon: calendarIcon },
  { href: "/admin-actividades", label: "Actividades", icon: puzzleIcon },
  { href: "/admin-mensajes", label: "Mensajes", icon: messagesIcon },
  { href: "/admin-estadisticas", label: "Estadísticas", icon: diagramIcon },
  { href: "/admin-tips", label: "Tips", icon: ideaIcon },
  { href: "/admin-foro", label: "Foro", icon: discussionIcon },
  { href: "/admin-resena", label: "Reseña", icon: reviewIcon },
];

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen, isTablet, isExactly1024 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Check for device sizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle sidebar expansion on desktop
  const handleMouseEnter = () => {
    if (!isMobile && !isTablet) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isTablet) {
      setIsExpanded(false);
    }
  };

  // Handle mobile/tablet menu item click to close sidebar on navigation
  const handleMobileItemClick = () => {
    if (isMobile || isTablet) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Determine sidebar width based on device and state
  const getSidebarWidth = () => {
    if (isMobile) {
      return 'w-64'; // Full width on mobile
    } else if (isTablet) {
      return isMobileSidebarOpen ? 'w-64' : 'w-16'; // Expanded or collapsed on tablet based on toggle
    } else {
      return isExpanded ? 'w-48' : 'w-16'; // Desktop hover behavior
    }
  };

  // Determine if text should be visible
  const isTextVisible = () => {
    if (isMobile) return true;
    if (isTablet) return isMobileSidebarOpen;
    return isExpanded;
  };

  return (
    <>
      {/* Mobile/Tablet overlay - only shown when sidebar is open */}
      {isMobileSidebarOpen && (isMobile || (isTablet && !isExactly1024)) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <nav
        className={`
          fixed left-0 top-0 h-screen z-40
          bg-[#3A4C2E] text-white 
          transition-all duration-500 ease-in-out
          shadow-xl
          ${getSidebarWidth()}
          ${(isMobile || isTablet) && !isMobileSidebarOpen
            ? '-translate-x-full'
            : 'translate-x-0'
          }
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        {/* Logo section */}
        <div className="pt-4 pb-3 flex justify-center items-center border-b border-white/20">
          <Link to="/" onClick={handleMobileItemClick}>
            <img 
              src={logoImage} 
              alt="Avilaventuras"
              className="transition-all duration-500 ease-in-out"
              style={{ 
                width: isTextVisible() ? '3.5rem' : '2.5rem',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
              }}
            />
          </Link>
        </div>

        {/* Menu items */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <ul className="px-2 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleMobileItemClick}
                    className={`
                      flex items-center px-2 py-2 rounded-lg
                      transition-all duration-300 
                      ${isActive 
                        ? 'bg-[#243420] text-[#A2E890] font-medium shadow-inner' 
                        : 'hover:bg-[#2D3F25] hover:shadow'}
                    `}
                  >
                    <div className={`
                      min-w-6 w-6 h-6 flex items-center justify-center
                      transition-all duration-300
                      ${isActive ? 'opacity-100' : 'opacity-75'}
                    `}>
                      <img 
                        src={item.icon} 
                        alt=""
                        className={`
                          max-w-full max-h-full
                          transition-transform duration-300
                          ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}
                          filter brightness-[1.2]
                        `}
                      />
                    </div>
                    <span 
                      className={`
                        ml-3 whitespace-nowrap
                        transition-all duration-500 ease-in-out
                        ${isTextVisible()
                          ? 'opacity-100 translate-x-0 block' 
                          : 'opacity-0 -translate-x-4 md:absolute'}
                      `}
                      style={{ 
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;