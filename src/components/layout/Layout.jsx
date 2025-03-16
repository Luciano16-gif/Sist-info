import { Outlet } from 'react-router-dom';
import HamburgerMenu from "../menus/HamburgerMenu";
import TopMenu from "../menus/TopMenu";
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

const Layout = () => {
  const { currentUser, userRole } = useAuth();
  const [isIpadPro, setIsIpadPro] = useState(false);
  
  // Check if the device has an IPad Pro screen
  // You are probably wondering "what the hell is this are you retarded?" am I right? well the top bar looks good on everything but a tablet with a screen 
  // size between 1024px and 1030px
  // This is a workaround to make the top bar look good on that scenerario, this is not the best way to do it, but it works if you think you found a better way 
  // please let me know
  useEffect(() => {
    const checkIpadPro = () => {
      // iPad Pro typically has 1024px width and a specific aspect ratio
      // This combination of width range and window.matchMedia gives us better detection
      const isIpadProSize = window.innerWidth >= 1020 && window.innerWidth <= 1030;
      setIsIpadPro(isIpadProSize);
    };
    
    checkIpadPro();
    window.addEventListener('resize', checkIpadPro);
    
    return () => window.removeEventListener('resize', checkIpadPro);
  }, []);

  // Determine height and padding based on role and device
  const getHeightClass = () => {
    // Special case for iPad Pro
    if (isIpadPro && (userRole === 'admin' || userRole === 'guia')) {
      return 'h-32'; // Additional height for iPad Pro's screen likes 3 rows
    }
    
    // For admin/guide/non-logged users on medium+ screens
    if (userRole === 'admin' || userRole === 'guia' || !currentUser) {
      return 'md:h-19 lg:h-19';
    }
    
    // Default for regular logged-in users
    return 'md:h-16 lg:h-16';
  };
  
  const getPaddingClass = () => {
    // Special case for iPad Pro
    if (isIpadPro && (userRole === 'admin' || userRole === 'guia')) {
      return 'pt-32'; // Additional height for iPad Pro's screen likes 3 rows
    }
    
    // For admin/guide/non-logged users on medium+ screens
    if (userRole === 'admin' || userRole === 'guia' || !currentUser) {
      return 'md:pt-19 lg:pt-19';
    }
    
    // Default for regular logged-in users
    return 'md:pt-16 lg:pt-16';
  };

  return (
    <div className="min-h-screen">
      {/* Header background div with dynamic height */}
      <div className={`absolute top-0 left-0 right-0 bg-black h-16 ${getHeightClass()}`}></div>
      
      {/* Menus */}
      <TopMenu />
      <HamburgerMenu />
      
      {/* Content with dynamic padding */}
      <div className={`pt-16 ${getPaddingClass()}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;