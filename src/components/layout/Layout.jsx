import { Outlet } from 'react-router-dom';
import HamburgerMenu from "../menus/HamburgerMenu";
import TopMenu from "../menus/TopMenu";

const Layout = () => {
  return (
    <div className="min-h-screen">
      {/* Header background div with consistent responsive height */}
      <div className="absolute top-0 left-0 right-0 bg-black h-16 md:h-16 lg:h-20 xl:h-18"></div>
      
      {/* Menus */}
      <TopMenu />
      <HamburgerMenu />
      
      {/* Content with consistent responsive padding */}
      <div className="pt-16 md:pt-16 lg:pt-20 xl:pt-18">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;