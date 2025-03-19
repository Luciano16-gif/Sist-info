import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCalendar from '../../components/calendar/EventCalendar';
import backgroundImage from '../../assets/images/ExperiencesPage/paisajeReserva.webp';
import BookingService from '../../components/services/BookingService';
import ExperienceService from '../../components/services/ExperienceService';
import useImagePreloader from '../../components/hooks/useImagePreloader';
import LoadingState from '../../components/common/LoadingState/LoadingState';

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
    const [reservationsForSelectedTime, setReservationsForSelectedTime] = useState(0);
    const [reservationsForSelectedDate, setReservationsForSelectedDate] = useState(0);
    const [availableDates, setAvailableDates] = useState([]);
    const [dateError, setDateError] = useState("");
    const [guides, setGuides] = useState([]);
    const [availableSlots, setAvailableSlots] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookingWindowMessage, setBookingWindowMessage] = useState("");
    const [availabilityLoading, setAvailabilityLoading] = useState(false);


    const imagesToPreload = [backgroundImage];
    if (experience?.imageUrl) {
        imagesToPreload.push(experience.imageUrl);
    }
    const imagesLoaded = useImagePreloader(imagesToPreload);

    // Load experience data on mount
    useEffect(() => {
        const fetchExperienceData = async () => {
            setLoading(true);
            
            if (!experienceData) {
                navigate('/');
                return;
            }

            try {
                // If we have full experienceData object, use it directly
                if (experienceData.id) {
                    const experienceDetails = await ExperienceService.getExperienceById(experienceData.id);
                    setExperience(experienceDetails);
                    setGuides(experienceDetails.guides || []);
                    
                    // Get available dates (either from specific dates or legacy day-of-week)
                    let availableDates = [];
                    
                    // Check if we have specific dates in the new format
                    if (experienceDetails.rawData && experienceDetails.rawData.fechas && 
                        Array.isArray(experienceDetails.rawData.fechas)) {
                        // Use specific dates from the experience
                        availableDates = experienceDetails.rawData.fechas.map(dateStr => dateStr);
                    } 
                    // Legacy support for day-of-week format
                    else if (experienceDetails.days) {
                        const dayNames = experienceDetails.days.split(', ');
                        // We'll just record these as day names to be displayed in the UI
                        setAvailableDates(dayNames);
                    }
                    
                    // Set available dates for the calendar
                    if (availableDates.length > 0) {
                        setAvailableDates(availableDates);
                    }
                    
                    // Calculate available time slots
                    const timeSlots = ExperienceService.calculateTimeSlots(experienceDetails);
                    setAvailableTimes(timeSlots);
                } 
                // If we just have an ID, fetch the experience
                else if (experienceData.nombre) {
                    const experienceDetails = await ExperienceService.getExperienceById(experienceData.nombre);
                    setExperience(experienceDetails);
                    setGuides(experienceDetails.guides || []);
                    
                    // Get available dates (either from specific dates or legacy day-of-week)
                    let availableDates = [];
                    
                    // Check if we have specific dates in the new format
                    if (experienceDetails.rawData && experienceDetails.rawData.fechas && 
                        Array.isArray(experienceDetails.rawData.fechas)) {
                        // Use specific dates from the experience
                        availableDates = experienceDetails.rawData.fechas.map(dateStr => dateStr);
                    } 
                    // Legacy support for day-of-week format
                    else if (experienceDetails.days) {
                        const dayNames = experienceDetails.days.split(', ');
                        // We'll just record these as day names to be displayed in the UI
                        setAvailableDates(dayNames);
                    }
                    
                    // Set available dates for the calendar
                    if (availableDates.length > 0) {
                        setAvailableDates(availableDates);
                    }
                    
                    // Calculate available time slots
                    const timeSlots = ExperienceService.calculateTimeSlots(experienceDetails);
                    setAvailableTimes(timeSlots);
                }
                
                // Set booking window message
                setBookingWindowMessage("Solo se permiten reservas hasta 1 mes en el futuro.");
            } catch (error) {
                console.error("Error fetching experience:", error);
                setDateError("Error al cargar la experiencia. Por favor intente de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchExperienceData();
    }, [experienceData, navigate]);

    // When date or time selection changes, check availability
    useEffect(() => {
        const checkAvailability = async () => {
          // Only proceed if a date and time are selected
          if (!experience || !selectedDate || !selectedTime) {
            setReservationsForSelectedTime(0);
            setReservationsForSelectedDate(0);
            setAvailableSlots(null); // Use null to indicate no check yet
            return;
          }
          
          setAvailabilityLoading(true);
          try {
            // (Optional) Check booking window and date availability here...
            const availability = await BookingService.getAvailableSlots(
              experience.id,
              selectedDate,
              selectedTime
            );
            
            if (availability.error) {
              setDateError(availability.error);
              setAvailableSlots(0);
            } else {
              setReservationsForSelectedTime(availability.reservationsForTime || 0);
              setReservationsForSelectedDate(availability.reservationsForDate || 0);
              setAvailableSlots(availability.availableSlots);
              setDateError("");
            }
          } catch (error) {
            console.error("Error checking availability:", error);
            setDateError("Error al verificar disponibilidad. Por favor, intente de nuevo.");
            setAvailableSlots(0);
          } finally {
            setAvailabilityLoading(false);
          }
        };
      
        checkAvailability();
      }, [selectedDate, selectedTime, experience]);

    if (loading || !imagesLoaded) {
        return <LoadingState text='Cargando experiencia...'/>;
    }

    if (!experience) {
        return <div className="loading-container">No se encontró la experiencia.</div>;
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
    
    const renderGuides = () => {
        if (!guides || guides.length === 0) {
            return <BookingDetail title="Guías" value="No hay guías asignados" />;
        }
        
        const guidesString = guides.map(guide => 
            `${guide.name} ${guide.lastName}`
        ).join(', ');
        
        return (
            <div className="detail-booking">
                <h3 className='detail-title-booking'>Guías</h3>
                <p className='detail-value-booking'>{guidesString}</p>
            </div>
        );
    };

    const handleBookingClick = () => {
        // For admin users, just go back to the admin page without date/time validation
        if (isAdmin) {
            navigate('/admin-experiencias-pendientes');
            return;
        }
        
        // Only check date and time for regular users making a reservation
        if (!selectedDate) {
            setDateError("Por favor, selecciona una fecha antes de reservar.");
            return;
        }
        
        if (!selectedTime) {
            setDateError("Por favor, selecciona un horario antes de reservar.");
            return;
        }
        
        if (availableSlots <= 0) {
            setDateError("No hay cupos disponibles para este horario.");
            return;
        }

        // Check if date is within booking window
        if (!BookingService.isWithinBookingWindow(selectedDate)) {
            setDateError("Solo se permiten reservas hasta 1 mes en el futuro.");
            return;
        }
        
        // Check if the date is available for this experience
        BookingService.isDateAvailable(experience.id, selectedDate)
            .then(isAvailable => {
                if (!isAvailable) {
                    setDateError("Esta fecha no está disponible para esta experiencia.");
                    return;
                }
                
                // Format date for passing to next page
                const formattedDate = BookingService.formatDate(selectedDate);

                navigate('/booking-process', { 
                    state: { 
                        experience, 
                        selectedDate, 
                        selectedTime,
                        selectedDay: formattedDate,
                        availableSlots
                    } 
                });
            })
            .catch(error => {
                console.error("Error checking date availability:", error);
                setDateError("Error al verificar disponibilidad. Por favor, intente de nuevo.");
            });
    };

    const handleShowCalendar = () => {
        setShowCalendar(true);
    }
    
    const handleCloseCalendar = () => {
        setShowCalendar(false);
    }

    const handleDateSelect = (date) => {
        // Check if date is within booking window
        if (!BookingService.isWithinBookingWindow(date)) {
            setDateError("Solo se permiten reservas hasta 1 mes en el futuro.");
            setSelectedDate(null);
            handleCloseCalendar();
            return;
        }
        
        // Check if the date is available for this experience
        BookingService.isDateAvailable(experience.id, date)
            .then(isAvailable => {
                if (!isAvailable) {
                    setDateError("Esta fecha no está disponible para esta experiencia.");
                    setSelectedDate(null);
                    handleCloseCalendar();
                    return;
                }
                
                setSelectedDate(date);
                setDateError(""); // Clear any existing error
                handleCloseCalendar();
                setSelectedTime(''); // Clear time on date change
            })
            .catch(error => {
                console.error("Error checking date availability:", error);
                setDateError("Error al verificar disponibilidad. Por favor, intente de nuevo.");
                setSelectedDate(null);
                handleCloseCalendar();
            });
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

    // Display string for available dates
    const getAvailableDatesText = () => {
        // If we have ISO date strings, format them for display
        if (availableDates.length > 0 && typeof availableDates[0] === 'string' && availableDates[0].includes('-')) {
            const now = new Date();
            const twoWeeksLater = new Date(now);
            twoWeeksLater.setDate(now.getDate() + 14);
            
            // Filter and sort upcoming dates within booking window
            const upcomingDates = availableDates
                .map(dateStr => new Date(dateStr))
                .filter(date => date >= now && date <= twoWeeksLater)
                .sort((a, b) => a - b)
                .slice(0, 5); // Show just the next 5 dates
                
            if (upcomingDates.length === 0) {
                return "Fechas específicas disponibles";
            }
            
            const formattedDates = upcomingDates.map(date => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                return `${day}/${month}`;
            }).join(', ');
            
            return `Próximas fechas: ${formattedDates}${upcomingDates.length < availableDates.length ? '...' : ''}`;
        }
        
        // Legacy support for day names
        return Array.isArray(availableDates) ? availableDates.join(', ') : '';
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
                        
                        {/* Booking Window Message */}
                        {bookingWindowMessage && (
                            <div className="booking-window-message">
                                <p>{bookingWindowMessage}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="details-box-booking">
                    <h2 className='details-title-booking'>DETALLES</h2>
                    <div className='details-grid-booking'>
                        <div className='details-column-booking'>
                            <BookingDetail title="Punto de Salida" value={experience.puntoDeSalida} />
                            <BookingDetail title="Fechas Disponibles" value={getAvailableDatesText()} />
                            <BookingDetail title="Horario" value={experience.time} />
                            <BookingDetail title="Duración Aprox." value={`${experience.duracion} minutos`} />
                            <BookingDetail
                                title="Cupos Disponibles"
                                value={
                                    selectedTime
                                        ? `${availableSlots} / ${experience.maxPeople}`
                                        : `? / ${experience.maxPeople}`
                                }
                            />
                        </div>
                        <div className='details-column-booking'>
                            <BookingDetail title="Precio P/P" value={`${experience.price}$`} />
                            {renderIncluidos()}
                            <BookingDetail title="Distancia a Recorrer" value={experience.distance} />
                            {renderGuides()}
                        </div>
                    </div>

                    {/* Selected Date Display */}
                    {selectedDate && (
                        <div className="selection-box-booking">
                            <label>FECHA SELECCIONADA</label>
                            <div className="selected-date valid-date">
                                {formatDate(selectedDate)}
                            </div>
                        </div>
                    )}

                    {/* Time Selection UI - Only show if valid date selected */}
                    {selectedDate && (
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

                    {/* Show available slots message */}
                    {selectedTime && !availabilityLoading && availableSlots === 0 && (
                        <div className="no-slots-message" style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
                            No hay cupos disponibles para este horario.
                        </div>
                    )}

                    <button 
                        className={`reserve-button-booking ${(selectedTime && availableSlots <= 0) ? 'disabled' : ''}`} 
                        onClick={handleBookingClick}
                        disabled={!isAdmin && selectedTime && availableSlots <= 0}
                    >
                        {isAdmin ? "Volver" : "Reserva tu Cupo"}
                    </button>
                </div>
            </div>
            {showCalendar && (
                <div className="calendar-overlay" onClick={handleCloseCalendar}>
                    <div className="calendar-container sm:mt-[6rem] sm:pb-[3rem] md:mt-18 lg:mt-20 xl:mt-20" onClick={(e) => e.stopPropagation()}>
                        <EventCalendar 
                            onDateSelect={handleDateSelect} 
                            showSelectButton={true} 
                            validDates={availableDates}
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