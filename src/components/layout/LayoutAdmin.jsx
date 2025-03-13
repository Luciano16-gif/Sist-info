import { Outlet } from 'react-router-dom';
import Sidebar from "../menus/Sidebar";

const LayoutAdmin = () => {
    return (
      <div>
        <Sidebar />
        <Outlet />
      </div>
    );
  };

export default LayoutAdmin;