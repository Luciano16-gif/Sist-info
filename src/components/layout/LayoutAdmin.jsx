import { Outlet } from 'react-router-dom';
import Sidebar from "../menus/Sidebar";

const LayoutAdmin = () => {
    return (
      <div className="h-screen bg-[#0F180B] bg-scroll">
        <Sidebar />
        <Outlet />
      </div>
    );
  };

export default LayoutAdmin;