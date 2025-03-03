import { Link } from "react-router-dom";

const TopMenu = () => {

  const menuItems= [
    { href: "/experiencias", label: "Experiencias" },
    { href: "/equipo", label: "Nuestro Equipo" },
    { href: "/galeria", label: "Galería" },
    { href: "/resenas", label: "Reseñas" },
  ];

  const sesionItems= [
    { href: "/sign-up-page", label: "Registrarse"},
    { href: "/login-page", label: "Iniciar Sesión"},
  ]

  return (
    <nav 
      className="
        hidden
        bg-black
        text-white 
        p-2
        md:flex 
        justify-evenly
        items-center
        shadow-lg
        fixed
        top-0
        left-0
        right-0
        bg-opacity-85
        space-x-12
        min-h-16
      "
      style={{zIndex: 9999}}
    >
      <div className="flex items-center justify-center">
        <img className="max-h-12 min-w-20 min-h-7 px-2"
        src="/src/assets/images/Logo_Avilaventuras.webp"
        alt="Avilaventuras"
        />
      </div>
      <p className="uppercase font-ysabeau text-gray-400 flex items-center justify-center">Visitante</p>
      <ul className="flex flex-row uppercase font-ysabeau underline sm:text-sm sm:space-x-12 justify-center">
            {menuItems.map((item) => (
            <li key={item.href} className="hover:scale-110 transform transition-all duration-300 flex items-center">
                <Link to={item.href} className="text-center">{item.label}</Link>
            </li>
            ))}
      </ul>
      <div className="flex justify-center">
        <ul className="flex flex-row uppercase font-ysabeau sm:text-sm sm:space-x-2">
          {sesionItems.map((item) => (
              <li key={item.href} className="bg-gray-800 box-border px-4 py-2 border-gray-200 border rounded-full
              hover:scale-110 transform transition-all duration-300 flex items-center justify-center">
                  <Link to={item.href} className="text-center whitespace-nowrap">{item.label}</Link>
              </li>))}
        </ul>
      </div>

      <div className="bg-black h-16 md:hidden lg:hidden" />
    </nav>
  );
};

export default TopMenu;