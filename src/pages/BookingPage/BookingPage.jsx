// BookingPage.jsx
import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCalendar from '../../components/landing-page/EventCalendar';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Corrected imports

function BookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const experience = location.state?.experience;
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [totalPaidUsers, setTotalPaidUsers] = useState(0); // Now correctly used
    const [reservationsForSelectedTime, setReservationsForSelectedTime] = useState(0);
    const [reservationsForSelectedDate, setReservationsForSelectedDate] = useState(0);

    useEffect(() => {
        if (!experience) {
            navigate('/');
            return;
        }

        // Generate time slots (no changes, but included for completeness)
        if (experience) {
            const generateTimeSlots = (startTime, endTime, durationMinutes) => {
                const slots = [];
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
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
            };
            const [startTime, endTime] = experience.time.split(' - ');
            const timeSlots = generateTimeSlots(startTime, endTime, parseInt(experience.duracion));
            setAvailableTimes(timeSlots);
        }

        // Fetch Total Paid Users (now correctly placed and used)
         const fetchTotalPaidUsers = async () => {
          try {
              const paymentsCollection = collection(db, "payments");
              const q = query(paymentsCollection, where("experienceId", "==", experience.id), where("status", "==", "COMPLETED"));
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
        if(experience.id){
            fetchTotalPaidUsers();
        }


    }, [experience, navigate]);


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
        navigate('/booking-process', { state: { experience, selectedDate, selectedTime } });
    };

    const handleShowCalendar = () => {
        setShowCalendar(true);
    }
    const handleCloseCalendar = () => {
        setShowCalendar(false);
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        handleCloseCalendar();
        setSelectedTime(''); // Clear time on date change
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
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
                            <BookingDetail title="Precio P/P" value={experience.price + "$"} />
                            {renderIncluidos()}
                            <BookingDetail title="Distancia a Recorrer" value={experience.distance} />
                        </div>
                    </div>

                    {/* Time Selection UI */}
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
                    {/* End Time Selection UI */}

                    <button className="reserve-button-booking" onClick={handleBookingClick}>Reserva tu Cupo</button>
                </div>
            </div>
            {showCalendar && (
                <div className="calendar-overlay" onClick={handleCloseCalendar}>
                    <div className="calendar-container" onClick={(e) => e.stopPropagation()}>
                        <EventCalendar onDateSelect={handleDateSelect} showSelectButton={true} />
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