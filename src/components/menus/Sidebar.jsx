import React, { useState, useEffect } from 'react'; // Correct import
import { Link } from 'react-router-dom';

import homeIcon from "../../assets/images/landing-page-admin/home.webp";
import groupIcon from "../../assets/images/landing-page-admin/group.webp";
import applicationIcon from "../../assets/images/landing-page-admin/application.webp";
import wayIcon from "../../assets/images/landing-page-admin/way.webp";
import calendarIcon from "../../assets/images/landing-page-admin/calendar.webp";
import puzzleIcon from "../../assets/images/landing-page-admin/puzzle.webp";
import messagesIcon from "../../assets/images/landing-page-admin/message.webp";
import diagramIcon from "../../assets/images/landing-page-admin/diagram.webp";
import ideaIcon from "../../assets/images/landing-page-admin/idea.webp";
import discussionIcon from "../../assets/images/landing-page-admin/discussion.webp";
import locationIcon from "../../assets/images/landing-page-admin/location.webp";
import reviewIcon from "../../assets/images/landing-page-admin/review.webp";
import logoImage from '../../assets/images/Logo_Avilaventuras.webp';

// Separator Component (Best practice: put this in a separate file, e.g., Separator.js)
const Separator = () => (
    <hr className="border-t border-gray-600 mx-4" />
);

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // For responsive behavior

    const SidebarItems = [
        { href: "/homeAdmin", label: "Inicio", icon: homeIcon },
        { href: "/adminGuias", label: "Gestion Guias", icon: groupIcon },
        { href: "/admin-galeria", label: "Galería", icon: applicationIcon },
        { href: "/admin-rutas", label: "Rutas", icon: wayIcon },
        { href: "/admin-calendario", label: "Calendario", icon: calendarIcon },
        { href: "/admin-actividades", label: "Actividades", icon: puzzleIcon },
        { href: "/admin-mensajes", label: "Mensajes", icon: messagesIcon },
        { href: "/admin-estadisticas", label: "Estadísticas", icon: diagramIcon },
        { href: "/admin-tips", label: "Tips", icon: ideaIcon },
        { href: "/admin-foro", label: "Foro", icon: discussionIcon },
        { href: "/admin-mapa", label: "Mapa", icon: locationIcon },
        { href: "/admin-reseña", label: "Reseña", icon: reviewIcon },
    ];

    // --- RESPONSIVE BEHAVIOR (Mobile Toggle) ---
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
            setIsExpanded(false); // Prevent expansion bug on resize
        }
    };

    useEffect(() => {
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsExpanded(false);
        }
    };

    return (
        <nav
            className={`
                z-50
                flex
                flex-col
                h-screen
                ${isExpanded ? 'w-64' : (isMobile ? 'w-0' : 'w-16')}
                bg-[#3A4C2E] 
                text-white
                py-4
                transition-all
                duration-500
                ease-in-out
                overflow-hidden
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Mobile Toggle Button */}
            {isMobile && (
                <button
                    onClick={toggleMobileSidebar}
                    className="absolute top-4 right-4 text-white text-2xl z-50"
                >
                    ☰ {/* Hamburger icon */}
                </button>
            )}

            {/* Logo (Centered) */}
            <div className="mb-8 flex flex-wrap items-center justify-center m-1">
                <img src={logoImage} alt="Logo" className="w-full h-full max-w-48 mr-2" />
                {/* Show text on expand{isExpanded && <span className="text-2xl font-bold">Admin Panel</span>} */}
            </div>

            {/* Separator */}
            <Separator />

            {/* Menu Items */}
            <ul className={`flex flex-col gap-2 ${isMobile && !isExpanded ? 'hidden' : ''}`}>
                {SidebarItems.map((item, index) => (
                    <li key={index} className="hover:bg-gray-700 rounded transition duration-200 w-full">
                        <Link
                            to={item.href}
                            className="flex items-center py-2 px-4 w-full"
                            onClick={isMobile ? toggleMobileSidebar : undefined} // Toggle on mobile click
                        >
                            <img src={item.icon} alt={item.label} className="h-6 w-6" />
                            {isExpanded && <span className="ml-3">{item.label}</span>} {/* Show text on expand */}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;