import { Outlet } from 'react-router-dom';
import HamburgerMenu from "../menus/HamburgerMenu";
import TopMenu from "../menus/TopMenu";

const Layout = () => {
  return (
    <div className="min-h-screen">
      <TopMenu />
      <HamburgerMenu />
      <div className="pt-16 md:pt-16 lg:pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;