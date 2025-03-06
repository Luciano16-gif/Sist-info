import { Outlet } from 'react-router-dom';
import TopMenuUsers from "../menus/TopMenuUsers";
import HamburgerMenuUsers from '../menus/HamburgerMenuUsers';

const LayoutUser = () => {
  return (
    <div className="pt-16">
      <TopMenuUsers />
      <HamburgerMenuUsers />
      <Outlet />
    </div>
  );
};

export default LayoutUser;