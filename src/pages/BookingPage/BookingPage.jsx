// BookingPage.jsx
import React, { useState } from 'react';
import './BookingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCalendar from '../../components/landing-page/EventCalendar';

function BookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const experience = location.state?.experience;
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // Store the selected date

    React.useEffect(() => {
        if (!experience) {
            console.log("Experience is null or undefined. Navigating to /.");
            navigate('/');
        } else {
            console.log("Experience received in BookingPage:", experience);
            console.log("puntoDeSalida:", experience.puntoDeSalida);
        }
    }, [experience, navigate]);

    if (!experience) {
        return null;
    }

    const renderIncluidos = () => {
        if (!experience.incluidos || experience.incluidos.length === 0) {
            return <BookingDetail value="No hay elementos incluidos" />;
        }
        const includedString = experience.incluidos.join(', ');
        return (
            <div className="detail-booking">
                <h3 className='detail-title-booking'>Precio Incluye</h3>
                <p className='detail-value-booking'>{includedString}</p>
            </div>
        );
    };

    const handleBookingClick = () => {
        // Pass selectedDate in the navigation state
        navigate('/booking-process', { state: { experience, selectedDate } });
    };

    const handleShowCalendar = () => {
        setShowCalendar(true);
    }
    const handleCloseCalendar = () => {
        setShowCalendar(false);
    }

    // Function to handle date selection from the calendar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        handleCloseCalendar(); // Close calendar after selection
    };


    return (
        <div className="container-booking">
            <img src="../../src/assets/images/ExperiencesPage/paisajeReserva.png" alt="Background" className="background-image-booking" />
            <div className="content-booking">
                <div className='left-side-booking'>
                    <div className="title-description-box">
                        <h1 className="title-booking">{experience.id}</h1>
                        <p className="description-booking">
                            {experience.description}
                        </p>
                        <div className='buttons-div-booking'>
                            <button className="button-booking" onClick={handleShowCalendar}>Ver Calendario</button>
                        </div>
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

                    <button className="reserve-button-booking" onClick={handleBookingClick}>Reserva tu Cupo</button>
                </div>
            </div>
            {showCalendar && (
                <div className="calendar-overlay" onClick={handleCloseCalendar}>
                    <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
                        {/* Pass onDateSelect and showSelectButton to EventCalendar */}
                        <EventCalendar onDateSelect={handleDateSelect} showSelectButton={true} />
                        <button className="close-button-calendar" onClick={handleCloseCalendar}>
                            Cerrar Calendario
                        </button>
                         {/* REMOVE the select date button from here */}
                    </div>
                </div>
            )}
        </div>
    );
}

function BookingDetail({ title, value }) {
    return (
        <div className="detail-booking">
            {title && <h3 className='detail-title-booking'>{title}</h3>}
            <p className='detail-value-booking'>{value}</p>
        </div>
    );
}

export default BookingPage;