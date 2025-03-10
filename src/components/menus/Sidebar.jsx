import { Link } from "react-router-dom";

const Sidebar = () => {

    const SidebarItems = [
        { href: "/gestion-guias", label: "a" },
        { href: "/admin-galeria", label: "b" },
        { href: "/admin-rutas", label: "c" },
        { href: "/admin-calendario", label: "d" },
        { href: "/admin-actividades", label: "e" },
        { href: "/admin-mensajes", label: "f" },
        { href: "/admin-estadisticas", label: "g" },
        { href: "/admin-tips", label: "h" },
        { href: "/admin-foro", label: "i" },
        { href: "/admin-mapa", label: "j" },
      ];

    return (
        <nav className={`
            hidden
            bg-green-500
            text-white
            p-1
            justify-start
            shadow-lg
            fixed
            top-0
            left-3
            min-w-9

        `}
        style={{ zIndex: 9999 }}>
            <div className="w-full flex flex-wrap items-center justify-between px-4">
            </div>
        </nav>
    );
};

export default Sidebar;