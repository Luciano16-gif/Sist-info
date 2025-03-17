// BookingPage.jsx
import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCalendar from '../../components/calendar/EventCalendar';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import backgroundImage from '../../assets/images/ExperiencesPage/paisajeReserva.png';

function BookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const experienceData = location.state?.experience;
    const isAdmin = location.state?.isAdmin;
    const [experience, setExperience] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [totalPaidUsers, setTotalPaidUsers] = useState(0);
    const [reservationsForSelectedTime, setReservationsForSelectedTime] = useState(0);
    const [reservationsForSelectedDate, setReservationsForSelectedDate] = useState(0);
    const [availableDays, setAvailableDays] = useState([]);
    const [dateError, setDateError] = useState("");

    // Normalize experience data based on the source (admin view vs regular view)
    useEffect(() => {
        if (!experienceData) {
            navigate('/');
            return;
        }

        // Normalize the experience data structure
        const normalizedExperience = isAdmin ? {
            id: experienceData.id || experienceData.nombre,
            name: experienceData.nombre,
            description: experienceData.descripcion,
            // Handle time field format - convert Firestore format to the expected format
            time: experienceData.horarioInicio && experienceData.horarioFin 
                ? `${experienceData.horarioInicio} - ${experienceData.horarioFin}`
                : "No disponible",
            days: Array.isArray(experienceData.fechas) ? experienceData.fechas.join(', ') : "",
            puntoDeSalida: experienceData.puntoSalida,
            price: experienceData.precio,
            duracion: experienceData.duracionRecorrido,
            maxPeople: experienceData.maximoUsuarios,
            distance: `${experienceData.longitudRecorrido} km`,
            incluidos: experienceData.incluidosExperiencia,
            imageUrl: experienceData.imageUrl,
            // Include all raw data for reference
            rawData: experienceData
        } : experienceData;

        setExperience(normalizedExperience);

        // Parse available days of the week
        const parseDays = (daysString) => {
            if (!daysString) return [];
            
            // Handle comma-separated days
            return daysString.split(',').map(day => day.trim());
        };

        const days = Array.isArray(experienceData.days) 
            ? experienceData.days 
            : (experienceData.days || experienceData.fechas);
            
        const parsedDays = Array.isArray(days) ? days : parseDays(days);
        setAvailableDays(parsedDays);
        
    }, [experienceData, navigate, isAdmin]);

    useEffect(() => {
        if (!experience) return;

        // Generate time slots based on the experience time range
        const generateTimeSlots = (startTime, endTime, durationMinutes) => {
            if (!startTime || !endTime || !durationMinutes) {
                console.log("Missing time data:", { startTime, endTime, durationMinutes });
                return [];
            }

            try {
                const slots = [];
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
                
                if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
                    console.log("Invalid time format:", { startTime, endTime });
                    return [];
                }
                
                let currentHour = startHour;
                let currentMinute = startMinute;

                while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
                    const formattedHour = String(currentHour).padStart(2, '0');
                    const formattedMinute = String(currentMinute).padStart(2, '0');
                    slots.push(`${formattedHour}:${formattedMinute}`);
                    currentMinute += durationMinutes;
                    currentHour += Math.floor(currentMinute / 60);
                    currentMinute %= 60;
                }
                
                if (slots.length > 0) {
                    const lastSlot = slots[slots.length - 1];
                    if (lastSlot === endTime) {
                        slots.pop();
                    }
                }
                
                return slots;
            } catch (error) {
                console.error("Error generating time slots:", error);
                return [];
            }
        };

        // Parse time from the experience data
        let startTime = "";
        let endTime = "";
        
        if (experience.time && experience.time.includes('-')) {
            [startTime, endTime] = experience.time.split('-').map(t => t.trim());
        } else if (experience.rawData && experience.rawData.horarioInicio && experience.rawData.horarioFin) {
            startTime = experience.rawData.horarioInicio;
            endTime = experience.rawData.horarioFin;
        }
        
        // Get the duration - handle possible number or string
        const duration = typeof experience.duracion === 'number' 
            ? experience.duracion 
            : parseInt(experience.duracion || "60");
        
        const timeSlots = generateTimeSlots(startTime, endTime, duration);
        setAvailableTimes(timeSlots);

        // Fetch Total Paid Users
        const fetchTotalPaidUsers = async () => {
            try {
                const paymentsCollection = collection(db, "payments");
                const q = query(
                    paymentsCollection, 
                    where("experienceId", "==", experience.id), 
                    where("status", "==", "COMPLETED")
                );
                const paymentsSnapshot = await getDocs(q);
                let totalPeople = 0;
                paymentsSnapshot.forEach((doc) => {
                    totalPeople += Number(doc.data().selectedPeople) || 0;
                });
                setTotalPaidUsers(totalPeople);
            } catch (error) {
                console.error("Error fetching total payment data:", error);
            }
        };
        
        if (experience.id) {
            fetchTotalPaidUsers();
        }
    }, [experience]);

    useEffect(() => {
        const fetchReservations = async () => {
            if (!experience || !selectedDate || !selectedTime) {
                setReservationsForSelectedTime(0);
                setReservationsForSelectedDate(0);
                return; // Early return if missing data
            }

            // Format date for query: "DD/MM/YYYY"
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            try {
                // Query the 'payments' collection
                const paymentsRef = collection(db, "payments");
                const q = query(
                    paymentsRef,
                    where("experienceId", "==", experience.id),
                    where("selectedDate", "==", formattedDate),
                    where("selectedTime", "==", selectedTime),
                    where("status", "==", "COMPLETED") // Important: Only completed payments
                );

                const querySnapshot = await getDocs(q);

                let peopleInSlot = 0;
                querySnapshot.forEach((doc) => {
                    // Add up the 'selectedPeople' from each matching document
                    peopleInSlot += Number(doc.data().selectedPeople) || 0; // Handle potential undefined/NaN
                });
                setReservationsForSelectedTime(peopleInSlot);

                const q2 = query(
                    paymentsRef,
                    where("experienceId", "==", experience.id),
                    where("selectedDate", "==", formattedDate),
                    where("status", "==", "COMPLETED") // Important: Only completed payments
                );

                const querySnapshot2 = await getDocs(q2);

                let peopleInDate = 0;
                querySnapshot2.forEach((doc) => {
                    // Add up the 'selectedPeople' from each matching document
                    peopleInDate += Number(doc.data().selectedPeople) || 0; // Handle potential undefined/NaN
                });

                setReservationsForSelectedDate(peopleInDate);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                setReservationsForSelectedTime(0);
                setReservationsForSelectedDate(0);
            }
        };

        fetchReservations();
    }, [selectedDate, selectedTime, experience]); // Depend on selectedDate, selectedTime, and experience

    if (!experience) {
        return <div className="loading-container">Cargando...</div>;
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
        // Check if date and time are selected
        if (!selectedDate) {
            setDateError("Por favor, selecciona una fecha antes de reservar.");
            return;
        }
        
        if (!selectedTime) {
            setDateError("Por favor, selecciona un horario antes de reservar.");
            return;
        }

        if (isAdmin) {
            // For admin users, just go back to the admin page
            navigate('/admin-experiencias-pendientes');
        } else {
            navigate('/booking-process', { state: { experience, selectedDate, selectedTime } });
        }
    };

    const handleShowCalendar = () => {
        setShowCalendar(true);
    }
    
    const handleCloseCalendar = () => {
        setShowCalendar(false);
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setDateError(""); // Clear any existing error
        handleCloseCalendar();
        setSelectedTime(''); // Clear time on date change
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        setDateError(""); // Clear any existing error
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return "";
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        // Get day name in Spanish
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayName = dayNames[date.getDay()];
        
        return `${dayName}, ${day}/${month}/${year}`;
    };

    // Check if a date is valid based on available days
    const isValidDate = (date) => {
        if (!date || !availableDays || availableDays.length === 0) return false;
        
        // Get the day name for the selected date
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayName = dayNames[date.getDay()];
        
        // Check if this day is in the available days
        return availableDays.some(day => 
            day.toLowerCase() === dayName.toLowerCase() || 
            day.toLowerCase().startsWith(dayName.toLowerCase().substring(0, 3))
        );
    };

    return (
        <div className="container-booking">
            <img src={backgroundImage} alt="Background" className="background-image-booking" />
            <div className="content-booking">
                <div className='left-side-booking'>
                    <div className="title-description-box">
                        <h1 className="title-booking">{experience.name || experience.id}</h1>
                        <p className="description-booking">
                            {experience.description}
                        </p>
                        <div className='buttons-div-booking'>
                            <button className="button-booking" onClick={handleShowCalendar}>
                                {selectedDate ? "Cambiar Fecha" : "Ver Calendario"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="details-box-booking">
                    <h2 className='details-title-booking'>DETALLES</h2>
                    <div className='details-grid-booking'>
                        <div className='details-column-booking'>
                            <BookingDetail title="Punto de Salida" value={experience.puntoDeSalida} />
                            <BookingDetail title="Días Disponibles" value={experience.days} />
                            <BookingDetail title="Horario" value={experience.time} />
                            <BookingDetail title="Duración Aprox." value={`${experience.duracion} minutos`} />
                            <BookingDetail
                                title="Personas Inscritas"
                                value={
                                  selectedTime
                                    ? `${reservationsForSelectedTime} / ${experience.maxPeople} (Total para ${selectedTime}: ${reservationsForSelectedTime})`
                                    : `${reservationsForSelectedDate} / ${experience.maxPeople} (Total para la fecha: ${reservationsForSelectedDate})`
                                }
                            />
                        </div>
                        <div className='details-column-booking'>
                            <BookingDetail title="Precio P/P" value={`${experience.price}$`} />
                            {renderIncluidos()}
                            <BookingDetail title="Distancia a Recorrer" value={experience.distance} />
                        </div>
                    </div>

                    {/* Selected Date Display */}
                    {selectedDate && (
                        <div className="selection-box-booking">
                            <label>FECHA SELECCIONADA</label>
                            <div className={`selected-date ${isValidDate(selectedDate) ? 'valid-date' : 'invalid-date'}`}>
                                {formatDate(selectedDate)}
                                {!isValidDate(selectedDate) && (
                                    <div className="date-warning">
                                        ⚠️ Esta experiencia no ocurre este día. Por favor, selecciona un {experience.days}.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Time Selection UI - Only show if valid date selected */}
                    {selectedDate && isValidDate(selectedDate) && (
                        <div className="selection-box-booking">
                            <label>SELECCIONA UN HORARIO</label>
                            <div className="time-buttons-booking">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelection(time)}
                                        className={`time-button-booking ${selectedTime === time ? 'selected' : ''}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {dateError && (
                        <div className="date-error">
                            {dateError}
                        </div>
                    )}

                    <button className="reserve-button-booking" onClick={handleBookingClick}>
                        {isAdmin ? "Volver" : "Reserva tu Cupo"}
                    </button>
                </div>
            </div>
            {showCalendar && (
                <div className="calendar-overlay" onClick={handleCloseCalendar}>
                    <div className="calendar-container mt-16 md:mt-10 lg:mt-10" onClick={(e) => e.stopPropagation()}>
                        <EventCalendar 
                            onDateSelect={handleDateSelect} 
                            showSelectButton={true} 
                            validDays={availableDays} // Pass available days to the calendar
                        />
                        <button className="close-button-calendar" onClick={handleCloseCalendar}>
                            Cerrar Calendario
                        </button>
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