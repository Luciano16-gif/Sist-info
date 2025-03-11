// ========== HERO SECTION ==========

export { default as HERO_IMAGE } from "../assets/images/landing-page-user-photos/top-part/background-landing-user.jpg";

export { default as TIP_IMAGE } from "../assets/images/landing-page-user-photos/top-part/background-landing-user.jpg";

// ========== Features section ==========

export const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: ["Diferentes", "Destinos"],
    description: "Explora una amplia gama de destinos, adaptados a tu nivel de experiencia y preferencias."
  },
  {
    icon: (
      <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: ["Sistema de", "Reservas"],
    description: "Reserva tu aventura de forma fácil, rápida y segura. Revisa el calendario de actividades para reservarla."
  },
  {
    icon: (
      <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: ["Comunicación"],
    description: "Estamos aquí para ayudarte en todo momento. Contáctanos para cualquier consulta o duda."
  },
  {
    icon: (
      <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: ["Foros de", "Experiencia"],
    description: "Únete a nuestra comunidad de exploradores y comparte tus experiencias con los demás usuarios."
  }
];


// ========== Route Cards section ==========

 
import photo1 from "../assets/images/landing-page-user-photos/route-bubbles/photo1.webp";
import photo2 from "../assets/images/landing-page-user-photos/route-bubbles/photo2.webp";
import photo3 from "../assets/images/landing-page-user-photos/route-bubbles/photo3.webp";
import photo4 from "../assets/images/landing-page-user-photos/route-bubbles/photo4.webp";
import photo5 from "../assets/images/landing-page-user-photos/route-bubbles/photo5.webp";
import photo6 from "../assets/images/landing-page-user-photos/route-bubbles/photo6.webp";
import photo7 from "../assets/images/landing-page-user-photos/route-bubbles/photo7.webp";
import photo8 from "../assets/images/landing-page-user-photos/route-bubbles/photo8.webp";

export const routesData = [
  {
    id: 1,
    image: photo1,
    title: "Ruta 1",
    difficulty: 3,
    length: 4,
    rating: 5,
    time: "7:00AM - 3:00PM",
    availableSlots: 20,
    totalSlots: 40,
  },
  {
    id: 2,
    image: photo2,
    title: "Ruta 2",
    difficulty: 4,
    length: 5,
    rating: 4,
    time: "7:00AM - 3:00PM",
    availableSlots: 20,
    totalSlots: 40,
  },
  {
    id: 3,
    image: photo3,
    title: "Ruta 3",
    difficulty: 2,
    length: 3,
    rating: 5,
    time: "7:00AM - 3:00PM",
    availableSlots: 20,
    totalSlots: 40,
  },
  {
    id: 4,
    image: photo4,
    title: "Ruta 4",
    difficulty: 5,
    length: 6,
    rating: 4,
    time: "7:00AM - 3:00PM",
    availableSlots: 20,
    totalSlots: 40,
  },
  {
    id: 5,
    image: photo5,
    title: "Ruta 5",
    difficulty: 3,
    length: 4,
    rating: 5,
    time: "8:00AM - 4:00PM",
    availableSlots: 15,
    totalSlots: 30,
  },
  {
    id: 6,
    image: photo6,
    title: "Ruta 6",
    difficulty: 4,
    length: 5,
    rating: 4,
    time: "9:00AM - 5:00PM",
    availableSlots: 25,
    totalSlots: 40,
  },
  {
    id: 7,
    image: photo7,
    title: "Ruta 7",
    difficulty: 2,
    length: 3,
    rating: 5,
    time: "10:00AM - 6:00PM",
    availableSlots: 10,
    totalSlots: 20,
  },
  {
    id: 8,
    image: photo8,
    title: "Ruta 8",
    difficulty: 5,
    length: 6,
    rating: 4,
    time: "11:00AM - 7:00PM",
    availableSlots: 30,
    totalSlots: 50,
  }
];


// ========== Tip section ==========

export { default as explore_image } from "../assets/images/landing-page/explore/explore.webp";


import TipCard1 from "../assets/images/landing-page-user-photos/tip-cards/TipCard1.webp";
 
import TipCard2 from "../assets/images/landing-page-user-photos/tip-cards/TipCard2.webp";
 
import TipCard3 from "../assets/images/landing-page-user-photos/tip-cards/TipCard3.webp";
 
import TipCard4 from "../assets/images/landing-page-user-photos/tip-cards/TipCard4.webp";
 
import TipCard5 from "../assets/images/landing-page-user-photos/tip-cards/TipCard5.webp";
 
import TipCard6 from "../assets/images/landing-page-user-photos/tip-cards/TipCard6.webp";

export const gallery2 = [TipCard1, TipCard2, TipCard3, TipCard4, TipCard5, TipCard6];