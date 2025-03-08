import { Link } from "react-router-dom";

const TopMenuUsers = () => {

  const menuItems= [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/resenas", label: "Reseñas" },
  ];

  const sesionItems= [
    { href: "/profile-management-page", label: "Ver Perfil"},
  ]

  return (
    <nav 
      className="
        hidden
        bg-black
        text-white 
        p-2
        md:flex 
        justify-between
        items-center
        shadow-lg
        fixed
        top-0
        left-0
        right-0
        bg-opacity-85
        space-x-12
      "
      style={{zIndex: 9999}}
    >
      {/* Logo */}
      <div>
        <img className="max-h-12 min-h-5 px-2"
          src="/src/assets/images/Logo_Avilaventuras.webp"
          alt="Avilaventuras"
        />
      </div>

      {/* Menu Items */}
      <ul className="flex flex-row uppercase font-ysabeau underline sm:text-sm sm:space-x-20 grow">
        {menuItems.map((item) => (
          <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
            <Link to={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Ver Perfil y Icono de Usuario */}
      <div className="flex items-center space-x-4">
        <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <ul className="flex flex-row uppercase font-ysabeau sm:text-sm">
          {sesionItems.map((item) => (
            <li key={item.href} className="hover:underline">
              <Link to={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopMenuUsers;