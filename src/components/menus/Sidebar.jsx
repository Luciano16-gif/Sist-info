import React, { useState, useEffect } from 'react';
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

const Separator = () => (
    <hr className="border-t border-white-600 mx-4" />
);

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [menuHeight, setMenuHeight] = useState('auto');

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

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
            setIsExpanded(false);
        }
         calculateMenuHeight();
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
         calculateMenuHeight();
        return () => window.removeEventListener('resize', handleResize);

    }, []);

     useEffect(() => {
        calculateMenuHeight();
    }, [isExpanded]);

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

    const calculateMenuHeight = () => {
        const items = document.querySelectorAll('.sidebar-item');
        let totalHeight = 0;

        items.forEach(item => {
            totalHeight += item.offsetHeight;
        });

        const logoContainer = document.querySelector('.logo-container');
        const separator = document.querySelector('.separator-container');

         if (logoContainer) {
            totalHeight += logoContainer.offsetHeight;
        }
        if (separator) {
            totalHeight += separator.offsetHeight;
        }
        totalHeight += 32;

        setMenuHeight(`${totalHeight}px`);
    };

    const expandedWidth = isExpanded ? '160px' : '70px';
    const logoWidth = isExpanded ? '60px' : '55px';

    return (
        <div style={{ position: 'relative', width: 'fit-content' }}>
            <nav
                style={{
                    width: expandedWidth,
                    height: menuHeight,
                    flexShrink: '0',
                    borderRadius: '20px',
                    boxShadow: '2px 2px 10px 0px rgba(0, 0, 0, 0.25)',
                    position: 'absolute', 
                    top: '20px',        
                    left: '20px',      
                }}
                className={`
                    z-50
                    flex
                    flex-col
                    bg-[#3A4C2E]
                    text-white
                    transition-all
                    duration-300  
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
                        ☰
                    </button>
                )}

                {/* Logo (Centered) */}
                <div className="py-4 flex items-center justify-center logo-container">
                    <img src={logoImage} alt="Logo" style={{ width: logoWidth, height: 'auto' }} />
                </div>

                <div className='separator-container'>
                    <Separator />
                </div>

                {/* Menu Items */}
                <ul className={`flex flex-col  ${isMobile && !isExpanded ? 'hidden' : ''} w-full`}>
                    {SidebarItems.map((item, index) => (
                        <li key={index} className="hover:bg-gray-700 rounded transition duration-200 w-full sidebar-item">
                            <Link
                                to={item.href}
                                className={`flex items-center py-3 pl-4  w-full `}
                                onClick={isMobile ? toggleMobileSidebar : undefined}
                            >
                                <img src={item.icon} alt={item.label} className="h-6 w-6" />
                                {isExpanded && <span className="ml-3">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;