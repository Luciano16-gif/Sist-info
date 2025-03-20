import { Outlet } from 'react-router-dom';
import Sidebar from "../menus/Sidebar";
import AdminProfileB from "../menus/AdminProfileB";
import { useState, useEffect } from 'react';

const LayoutAdmin = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isExactly1024, setIsExactly1024] = useState(false);
  const [showHamburgerButton, setShowHamburgerButton] = useState(true);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Set tablet state (between 768px and 1024px inclusive)
      setIsTablet(width >= 768 && width <= 1024);
      
      // Track exactly 1024px width I hate the Ipad-pro so mcuh :)
      setIsExactly1024(width === 1024);
      
      // Determine hamburger button visibility - show on all widths below 1025px
      setShowHamburgerButton(width <= 1024);
      
      // Close sidebar on larger screens
      if (width >= 1025) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* Add AdminProfileB component */}
      <AdminProfileB />
      
      {/* Mobile/Tablet sidebar toggle */}
      {showHamburgerButton && (
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className={`
            fixed top-4 z-50 text-white p-2 rounded-lg bg-[#3A4C2E] shadow-lg
            ${isMobileSidebarOpen ? 'left-[calc(16rem-3rem)]' : 'left-4'}
            transition-all duration-500 ease-in-out
          `}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          aria-label={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            <span 
              className={`absolute h-1 bg-white rounded-full transition-all duration-500 ease-in-out
                ${isMobileSidebarOpen ? "w-6 rotate-45" : "w-6 -translate-y-1.5"}`}
            />
            <span 
              className={`h-1 bg-white rounded-full transition-all duration-500 ease-in-out
                ${isMobileSidebarOpen ? "w-0 opacity-0" : "w-6"}`}
            />
            <span 
              className={`absolute h-1 bg-white rounded-full transition-all duration-500 ease-in-out
                ${isMobileSidebarOpen ? "w-6 -rotate-45" : "w-6 translate-y-1.5"}`}
            />
          </div>
        </button>
      )}
      
      {/* Admin navigation sidebar */}
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isTablet={isTablet}
        isExactly1024={isExactly1024}
      />
      
      {/* Main content area with appropriate padding for all device sizes */}
      <div className={`
        pt-16 transition-all duration-500 ease-in-out min-h-screen
        ${isTablet ? 'pl-0' : 'md:pl-16 lg:pl-20'}
        bg-[#172a1a] // or any color you prefer
      `}>
        <div className="p-4 md:p-6 lg:p-8 mt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;