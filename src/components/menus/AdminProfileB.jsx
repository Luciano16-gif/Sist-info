import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserDropdown from './UserDropdownMenu';

const AdminProfileB = () => {
  const { currentUser, logout, userRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get admin name
  const adminName = currentUser?.displayName || 'Admin';

  // Prepare custom button content for AdminProfile
  const customButtonContent = (
    currentUser?.photoURL ? (
      <img 
        src={currentUser.photoURL} 
        alt="Admin Profile" 
        className="w-12 h-12 rounded-full object-cover border-2 border-white cursor-pointer hover:border-gray-300 transition-colors"
      />
    ) : (
      <div className="
        w-12 h-12 
        rounded-full 
        bg-gray-300
        flex justify-center items-center
        border-2 border-white
        cursor-pointer
        hover:border-gray-300
        transition-colors
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.327 14 4 15.344 4 18V20H20V18C20 15.344 14.673 14 12 14Z" fill="#000000" />
        </svg>
      </div>
    )
  );

  return (
    <div className="relative w-full h-auto">
      <div className="
        absolute top-4 right-4 
        w-[17.3rem] h-[4.5rem] 
        flex-shrink-0 
        rounded-[1.2rem] 
        bg-[#3A4C2E] 
        p-4 
        flex items-center justify-between 
        z-40
        shadow-md
        transition-all duration-300 hover:shadow-lg
      ">
        <div className="text-white">
          <div className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">{adminName}</div>
          <Link 
            to="/profile-management-page" 
            className="text-xs underline text-white hover:text-gray-200 transition-colors"
          >
            VER PERFIL COMPLETO
          </Link>
        </div>
        
        <UserDropdown 
          currentUser={currentUser}
          userRole={userRole}
          onLogout={logout}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          dropdownAlign="right"
          bgColor="bg-gray-800"
          buttonContent={customButtonContent}
        />
      </div>
    </div>
  );
};

export default AdminProfileB;