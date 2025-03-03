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
      "
      style={{zIndex: 9999}}
    >
      <div>
        <img class="max-h-12 min-h-5 space-x-5 px-2"
        src="/src/assets/images/Logo_Avilaventuras.webp"
        alt="Avilaventuras"
        />
      </div>
      <p class="uppercase font-ysabeau text-gray-400">Visitante</p>
      <ul className="flex flex-row uppercase font-ysabeau underline sm:text-sm sm:space-x-12">
            {menuItems.map((item) => (
            <li key={item.href} className="hover:scale-110 transform transition-all duration-300">
                <Link to={item.href}>{item.label}</Link>
            </li>
            ))}
      </ul>
      <div className="">
        <ul className="flex flex-row uppercase font-ysabeau sm:text-sm sm:space-x-12">
          {sesionItems.map((item) => (
              <li key={item.href} className="bg-gray-700 box-border border-gray-200 border
              hover:scale-110 transform transition-all duration-300">
                  <Link to={item.href}>{item.label}</Link>
              </li>))}
        </ul>
      </div>

      <div className="bg-black h-16 md:hidden lg:hidden" />
    </nav>
  );
};

export default TopMenu;