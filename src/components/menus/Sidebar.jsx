import { Link } from "react-router-dom";
import useScrollDetection from "./useScrollDetection";

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
            z-50
            flex
            gap-3
            p-3
            justify-around
            bg-green-500
        `}>
        </nav>
    );
};

export default Sidebar;