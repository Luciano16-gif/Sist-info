import { Outlet } from 'react-router-dom';
import HamburgerMenu from "../menus/HamburgerMenu";
import TopMenu from "../menus/TopMenu";

const Layout = () => {
  return (
    <div className="pt-16">
      <TopMenu />
      <HamburgerMenu />
      <Outlet />
    </div>
  );
};

export default Layout;