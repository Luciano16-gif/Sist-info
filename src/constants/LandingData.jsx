// ========== HERO SECTION ==========

export { default as HERO_IMAGE_NO_SESSION } from "../assets/images/landing-page/HERO/avila.webp";
export { default as HERO_IMAGE_SESSION } from "../assets/images/landing-page-user-photos/top-part/background-landing-user.jpg";

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

// ========== Explore section ==========

export { default as explore_image } from "../assets/images/landing-page/explore/explore.webp";

import gallery_1 from "../assets/images/landing-page/explore/gallery/gallery_1.webp";
import gallery_2 from "../assets/images/landing-page/explore/gallery/gallery_2.webp";
import gallery_3 from "../assets/images/landing-page/explore/gallery/gallery_3.webp";
import gallery_4 from "../assets/images/landing-page/explore/gallery/gallery_4.webp";
import gallery_5 from "../assets/images/landing-page/explore/gallery/gallery_5.webp";
import gallery_6 from "../assets/images/landing-page/explore/gallery/gallery_6.webp";

export const gallery_no_session = [gallery_1, gallery_2, gallery_3, gallery_4, gallery_5, gallery_6];

export const EXPLORE_TEXTS = [
  {
    title: "EXPLORA E",
    subtitle: "INSPIRA TU VIDA",
    description: "La belleza del Ávila en cada foto..."
  },
  {
    title: "DESCUBRE",
    subtitle: "NUEVAS RUTAS",
    description: "Senderos de ensueño que te llevan a paisajes increíbles."
  },
  {
    title: "CONECTA CON",
    subtitle: "LA NATURALEZA",
    description: "Flora y fauna única en un entorno natural impresionante."
  },
  {
    title: "SUPERA TUS",
    subtitle: "LÍMITES",
    description: "Desafíos que transforman y elevan tu espíritu aventurero."
  },
  {
    title: "MEMORIAS",
    subtitle: "INOLVIDABLES",
    description: "Momentos para recordar en este maravilloso parque natural."
  },
  {
    title: "AVENTURAS",
    subtitle: "EN GRUPO",
    description: "Comparte la experiencia con amigos y familiares."
  }
];

import TipCard1 from "../assets/images/landing-page-user-photos/tip-cards/TipCard1.png";
import TipCard2 from "../assets/images/landing-page-user-photos/tip-cards/TipCard2.png";
import TipCard3 from "../assets/images/landing-page-user-photos/tip-cards/TipCard3.png";
import TipCard4 from "../assets/images/landing-page-user-photos/tip-cards/TipCard4.png";
import TipCard5 from "../assets/images/landing-page-user-photos/tip-cards/TipCard5.png";
import TipCard6 from "../assets/images/landing-page-user-photos/tip-cards/TipCard6.png";

export const gallery_with_session = [TipCard1, TipCard2, TipCard3, TipCard4, TipCard5, TipCard6];

export const HIKING_TIPS_TEXTS = [
  {
    title: "TIP #1",
    subtitle: "CON EQUIPO ADECUADO",
    description: "Viste capas de ropa ajustables y lleva una mochila con agua, comida y botiquín."
  },
  {
    title: "TIP #2",
    subtitle: "BIEN HIDRATADO",
    description: "Bebe agua regularmente, la altitud y el esfuerzo pueden deshidratarte rápidamente."
  },
  {
    title: "TIP #3",
    subtitle: "LA NATURALEZA",
    description: "Permanece en los senderos marcados y lleva tu basura de vuelta al terminar."
  },
  {
    title: "TIP #4",
    subtitle: "TECNOLÓGICA",
    description: "Un teléfono o GPS puede salvarte en emergencias, lleva batería extra."
  },
  {
    title: "TIP #5",
    subtitle: "TUS LÍMITES",
    description: "Escucha las señales de tu cuerpo y descansa cuando sea necesario."
  },
  {
    title: "TIP #6",
    subtitle: "TU PIEL",
    description: "Aplica protector solar de amplio espectro, incluso en días nublados."
  }
];

// ========== Testimonials section ==========

 
import user471 from "../assets/images/landing-page/publications/user471.webp";
import user1982 from "../assets/images/landing-page/publications/user1982.webp";
import user2567 from "../assets/images/landing-page/publications/user2567.webp";

 
import andrea from "../assets/images/landing-page/publications/andrea.webp";
import carlos from "../assets/images/landing-page/publications/carlos.webp";
import victoria from "../assets/images/landing-page/publications/victoria.webp";

export const testimonios = [
  {
    id: 1,
    usuario: 'Usuario #1982:',
    comentario: '¡Una experiencia increíble! Las rutas son impresionantes y los guías son muy profesionales. Sin duda, volveré a esta área más del Ávila con ustedes.',
    avatar: user1982,
    estrellas: 5
  },
  {
    id: 2,
    usuario: 'Usuario #471:',
    comentario: 'Me encantó cada minuto de la excursión. La belleza del parque es incomparable y los senderos que todo turista ama nos esperaba. ¡Totalmente recomendado!',
    avatar: user471,
    estrellas: 5
  },
  {
    id: 3,
    usuario: 'Usuario #2567:',
    comentario: 'Perfecto para desconectar. Las rutas son bien señalizadas y el servicio fue excepcional. Gracias por una aventura inolvidable en el Ávila.',
    avatar: user2567,
    estrellas: 5
  }
];

export const publicaciones = [
  {
    id: 1,
    usuario: 'Victoria G.',
    fechaPublicacion: '08/12/2024',
    imagen: victoria,
    hashtags: '#Ávila #Venezuela #Montaña #Ejercicio #ÁvilaAventuras #Motivacion'
  },
  {
    id: 2,
    usuario: 'Carlos T.',
    fechaPublicacion: '12/01/2025',
    imagen: carlos,
    hashtags: '#Diversion #Naturaleza #Ávila #ParqueElÁvila #Excursion #ÁvilaAventuras'
  },
  {
    id: 3,
    usuario: 'Andrea P.',
    fechaPublicacion: '25/11/2024',
    imagen: andrea,
    hashtags: '#Aventura #Ávila #Excursion #Ruta #ÁvilaAventuras #AmoVenezuela'
  }
];

// ========== Routes section ==========

export { default as routes_background } from "../assets/images/landing-page/ideal-routes/routes-background.webp";
/*
import card_1 from "../assets/images/landing-page/ideal-routes/cards/card_1.webp";
import card_2 from "../assets/images/landing-page/ideal-routes/cards/card_2.webp";
import card_3 from "../assets/images/landing-page/ideal-routes/cards/card_3.webp";

export const cards = [card_1, card_2, card_3];


export const routesData = [
  { difficulty: 3, length: 3, rating: 5, spots: 20, maxSpots: 40 },
  { difficulty: 4, length: 4, rating: 5, spots: 20, maxSpots: 40 },
  { difficulty: 3, length: 3, rating: 5, spots: 20, maxSpots: 40 }
];
*/
import photo1 from "../assets/images/landing-page-user-photos/route-bubbles/photo1.jpg";
import photo2 from "../assets/images/landing-page-user-photos/route-bubbles/photo2.jpg";
import photo3 from "../assets/images/landing-page-user-photos/route-bubbles/photo3.jpg";
import photo4 from "../assets/images/landing-page-user-photos/route-bubbles/photo4.webp";
import photo5 from "../assets/images/landing-page-user-photos/route-bubbles/photo5.jpg";
import photo6 from "../assets/images/landing-page-user-photos/route-bubbles/photo6.jpg";
import photo7 from "../assets/images/landing-page-user-photos/route-bubbles/photo7.jpg";
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
    availableSlots: 30,
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
    availableSlots: 8,
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
  },
  {
    id: 9,
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

// ========== Fun fact section ==========

export { default as fun_fact_background } from "../assets/images/landing-page/fun_fact/fun_fact_background.webp";
export { default as fun_fact_image } from "../assets/images/landing-page/fun_fact/fun_fact_image.webp";
export { default as fun_fact_icon } from "../assets/images/landing-page/fun_fact/fun_fact_icon.svg";

export { default as forum_background } from "../assets/images/landing-page/explore/gallery/gallery_3.webp"