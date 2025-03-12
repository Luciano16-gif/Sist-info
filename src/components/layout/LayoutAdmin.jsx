import { Outlet } from 'react-router-dom';
import Sidebar from "../menus/Sidebar";
import AdminProfileB from "../Admin-components/AdminProfileB"

const LayoutAdmin = () => {
    return (
      <div className="h-screen bg-[#0F180B] bg-scroll">
        <AdminProfileB />
        <Sidebar />
        <Outlet />
      </div>
    );
  };

export default LayoutAdmin;