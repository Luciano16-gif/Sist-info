// BookingProcessPage.jsx
import React, { useRef } from 'react'; // Import useRef
import './BookingProcessPage.css';
import { useLocation, useNavigate } from 'react-router-dom';


function BookingProcessPage() {
    const location = useLocation();
    const experience = location.state?.experience;
    const navigate = useNavigate();
    const guideContainerRef = useRef(null); // Ref for the guide container

    // Dummy guide data (replace with actual guide data from API or context)
    const guides = [
        { id: 1, name: 'Jorge Pérez', rating: 4, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' }, // Replace placeholders
        { id: 2, name: 'Clara Carrasquel', rating: 5, image: '/../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 3, name: 'Guía 3', rating: 3, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 4, name: 'Guía 4', rating: 2, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 5, name: 'Guía 5', rating: 5, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 6, name: 'Guía 6', rating: 4, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 7, name: 'Guía 7', rating: 3, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
        { id: 8, name: 'Guía 8', rating: 5, image: '../../src/assets/images/ExperiencesPage/paisajeReserva.png' },
    ];

     // --- NAVIGATION HANDLER ---
    const handleGoBack = () => {
         navigate(-1);
    }

    // Function to render rating dots
    const renderRatingDots = (rating) => {
        const dots = [];
        for (let i = 0; i < 5; i++) {
            dots.push(
                <span key={i} className={`dot-booking-process ${i < rating ? 'yellow-dot-booking-process' : 'white-dot-booking-process'}`}></span>
            );
        }
        return dots;
    };


    const handleScroll = (direction) => {
        const container = guideContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -200 : 200; // Adjust scroll amount as needed
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    if (!experience) {
        return <div>No experience data found.</div>; // Or redirect, show error, etc.
    }

    return (
        <div className="container-booking-process">
             <button className="back-button-booking-process" onClick={handleGoBack}> VOLVER AL MENÚ DE RUTAS </button>
            <img src="../../src/assets/images/ExperiencesPage/paisajeReserva.png" alt="Background" className="background-image-booking-process" />
            <div className="content-booking-process">
                <div className="left-side-booking-process">
                    <div className='pasarela-de-pago-title-container-booking-process'>
                        <h1 className="title-booking-process">PASARELA DE PAGO</h1>
                    </div>
                    <div className="selection-box-booking-process">
                        <label>SELECCIONA UN HORARIO</label>
                        <div className="time-buttons-booking-process">
                            <button>7:00AM</button>
                            <button>10:00AM</button>
                            <button>1:00PM</button>
                        </div>
                    </div>
                    <div className="selection-box-booking-process">
                        <label>CANTIDAD DE PERSONAS</label>
                        <div className="quantity-buttons-booking-process">
                            <button>1 PERSONA</button>
                            <button>2 PERSONAS</button>
                            <button>3 PERSONAS</button>
                            <button>4 PERSONAS</button>
                        </div>
                    </div>

                    <div className="selection-box-booking-process">
                        <label>SELECCIONA UN GUÍA</label>
                        <div className="guide-selection-wrapper-booking-process">
                            <button className="scroll-button-booking-process left-scroll-booking-process" onClick={() => handleScroll('left')}></button>
                            <div className="guide-selection-booking-process" ref={guideContainerRef}>
                                {guides.map(guide => (
                                    <div key={guide.id} className="guide-card-booking-process">
                                        <img src={guide.image} alt={guide.name} />
                                        <div className="guide-info-booking-process">
                                            <p>{guide.name}</p>
                                            <div className="rating-dots-booking-process">
                                                {renderRatingDots(guide.rating)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="scroll-button-booking-process right-scroll-booking-process" onClick={() => handleScroll('right')}></button>
                        </div>
                    </div>
                </div>

                <div className="details-box-booking-process">
                     <div className='detalles-title-container-booking-process'>
                        <h2 className="details-title-booking-process">DETALLES</h2>
                     </div>
                    <p className='details-booking-process-p'>CÓDIGO DE PARTICIPACIÓN</p>
                    <h2 className='codigo-participacion-booking-process'>S912AP</h2>
                    <div className='user-details-container-booking-process'>
                        <p className='details-booking-process-p'>USUARIO:  XXXXXXX XXXXX</p>
                        <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : XX</p>
                        <p className='details-booking-process-p'>RUTA X</p>
                        <p className='details-booking-process-p'>FECHA: XX / XX / XXXX</p>
                        <p className='details-booking-process-p'>HORARIO: XX : XX</p>
                        <p className='details-booking-process-p'>GUÍA: XXXXXXXX XXXXXXX</p>
                    </div>
                   <div className='realizar-pago-button-container-booking-process'>
                     <button className="payment-button-booking-process">REALIZAR PAGO</button>
                   </div>
                </div>
            </div>
        </div>
    );
}

export default BookingProcessPage;