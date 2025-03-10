// BookingPage.jsx
import React from 'react';
import './BookingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

function BookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const experience = location.state?.experience;

    React.useEffect(() => {
        if (!experience) {
            console.log("Experience is null or undefined. Navigating to /.");
            navigate('/');
        } else {
            console.log("Experience received in BookingPage:", experience);
            console.log("puntoDeSalida:", experience.puntoDeSalida); // More specific check
        }
    }, [experience, navigate]);

    if (!experience) {
        return null; // Or a loading indicator, etc.
    }

    // Function to safely handle displaying the included items, now with comma separation
    const renderIncluidos = () => {
        if (!experience.incluidos || experience.incluidos.length === 0) {
            return <BookingDetail value="No hay elementos incluidos" />;
        }

        // Join the array elements with ", "
        const includedString = experience.incluidos.join(', ');

        return (
            <div className="detail-booking">
                <h3 className='detail-title-booking'>Precio Incluye</h3>
                <p className='detail-value-booking'>{includedString}</p>
            </div>
        );
    };

    return (
        <div className="container-booking">
            {/* ... rest of your BookingPage content ... */}
             <img src="../../src/assets/images/ExperiencesPage/paisajeReserva.png" alt="Background" className="background-image-booking" />
            <div className="content-booking">
                <div className='left-side-booking'>
                    <h1 className="title-booking">{experience.id}</h1>
                    <p className="description-booking">
                        {experience.description}
                    </p>
                    <div className='buttons-div-booking'>
                        <button className="button-booking">Ver Calendario</button>
                        <button className="button-booking">Ver Mapa</button>
                    </div>
                </div>

                <div className="details-box-booking">
                    <h2 className='details-title-booking'>DETALLES</h2>
                    <div className='details-grid-booking'>
                        <div className='details-column-booking'>
                            <BookingDetail title="Punto de Salida" value={experience.puntoDeSalida} />
                            <BookingDetail title="Fecha y Hora" value={experience.time + ", " + experience.days} />
                            <BookingDetail title="Duración Aprox." value={experience.duracion + " minutos"} />
                            <BookingDetail title="Personas Inscritas" value={experience.registeredUsers + "/" + experience.maxPeople} />
                        </div>
                        <div className='details-column-booking'>
                            <BookingDetail title="Precio P/P" value={experience.price + "$"} />
                            {renderIncluidos()}
                            <BookingDetail title="Distancia a Recorrer" value={experience.distance} />
                        </div>
                    </div>

                    <button className="reserve-button-booking">Reserva tu Cupo</button>
                </div>
            </div>
        </div>
    );
}

function BookingDetail({ title, value }) {
    console.log(`Rendering BookingDetail: title=${title}, value=${value}`); // Add this
    return (
        <div className="detail-booking">
            {title && <h3 className='detail-title-booking'>{title}</h3>}
            <p className='detail-value-booking'>{value}</p>
        </div>
    );
}

export default BookingPage;