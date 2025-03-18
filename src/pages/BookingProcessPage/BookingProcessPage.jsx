// BookingProcessPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BookingProcessPage.css';
// Additional CSS styles for disabled buttons are added to BookingProcessPage.css
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase-config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import storage from '../../cloudinary-services/storage-service';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import backgroundImage from '../../assets/images/ExperiencesPage/paisajeReserva.png';
import ExperienceBookingService from '../../components/services/ExperienceBookingService';

function BookingProcessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const guideContainerRef = useRef(null);
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [experienceGuides, setExperienceGuides] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [availableSlots, setAvailableSlots] = useState(0);
    const [reservationsForTime, setReservationsForTime] = useState(0);


    const savePaymentDetails = async (details) => {
        try {
            const userEmail = auth.currentUser.email;
            if (!userEmail) {
                throw new Error("User email not found. User might not be logged in.");
            }
    
            // Prepare guide information to store in payment data
            const guidesData = experienceGuides.map(guide => ({
                id: guide.id,
                name: guide.name,
                lastName: guide.lastName,
                email: guide.email
            }));
    
            const paymentData = {
                transactionId: details.id,
                payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                payerEmail: details.payer.email_address,
                amount: details.purchase_units[0].amount.value,
                currency: details.purchase_units[0].amount.currency_code,
                status: details.status,
                timestamp: new Date(),
                experienceId: experience?.id,
                userId: currentUser?.id,
                selectedTime,
                selectedPeople,
                guides: guidesData, 
                selectedDate: selectedDate?.toISOString(),
                selectedDay,
            };
    
            // Save payment details to Firestore
            const userDocRef = doc(db, "payments", userEmail);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, {
                    bookings: arrayUnion(paymentData)
                });
            } else {
                await setDoc(userDocRef, {
                    bookings: [paymentData]
                });
            }
    
            console.log("Payment details saved to Firestore with email as ID");
    
            // Update experience bookings 
            await updateExperienceBookings({
                ...paymentData,
                guides: guidesData // Ensure guides are passed to updateExperienceBookings, doing this to avoid errors, since this is being added just now
            });
    
            // Update available slots in the experience
            const slotsUpdated = await ExperienceBookingService.updateAvailableSlots(
                experience.id,
                selectedPeople
            );
    
            if (!slotsUpdated) {
                console.warn("Failed to update available slots. The payment was processed successfully, but spot count may be inaccurate.");
            }
    
            setIsPaymentSuccessful(true);
        } catch (error) {
            console.error("Error saving payment details to Firestore:", error);
            alert("Hubo un error al guardar los detalles del pago.");
        }
    };

    const updateExperienceBookings = async (paymentData) => {
        if (!experience || !experience.id) {
            console.error("Experience ID is missing. Cannot update bookings.");
            return;
        }
    
        const experienceRef = doc(db, "Experiencias", experience.id);
        const formattedDate = selectedDay; // Use the already formatted date.
        const timeSlot = selectedTime;
    
        try {
            // Include guide information in the booking data
            const bookingData = {
                people: parseInt(selectedPeople, 10), // Ensure this is a number
                user: {
                    id: currentUser.id,
                    name: currentUser.name,
                    lastName: currentUser.lastName,
                    email: auth.currentUser.email // Store user email
                },
                guides: paymentData.guides || [], // Store all guides information
                timestamp: new Date(),  // Capture current timestamp
                transactionId: paymentData.transactionId, // Referencing the payment
            };
    
            // Get the current experience data.
            const expDocSnap = await getDoc(experienceRef);
    
            if (!expDocSnap.exists()) {
                console.log("No such document!");
                return;
            }
    
            const expData = expDocSnap.data();
            // Initialize 'reservas' if it doesn't exist.
            const reservas = expData.reservas || {};
    
            // Initialize the date's array if it doesn't exist
            if (!reservas[formattedDate]) {
                reservas[formattedDate] = {};
            }
    
            // Initialize time slot if doesn't exist
            if(!reservas[formattedDate][timeSlot]){
                reservas[formattedDate][timeSlot] = [];
            }
    
            reservas[formattedDate][timeSlot].push(bookingData);
            // Update experience data in Firestore
            await updateDoc(experienceRef, {reservas});
            console.log("Experience bookings updated successfully with guide information.");
    
        } catch (error) {
            console.error("Error updating experience bookings:", error);
        }
    };

    const handlePaymentSuccess = (details) => {
        console.log("Pago completado:", details);
        alert(`¡Pago exitoso! Gracias, ${details.payer.name.given_name}.`);
        savePaymentDetails(details);
    };

    const handlePaymentError = (error) => {
        console.error("Error en el pago:", error);
        alert("El pago falló. Por favor, inténtalo de nuevo.");
        setIsPaymentSuccessful(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const usersRef = collection(db, "lista-de-usuarios");
                        const q = query(usersRef, where("email", "==", user.email));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0];
                            setCurrentUser({
                                id: userDoc.id,
                                name: userDoc.data().name,
                                lastName: userDoc.data().lastName,
                            });
                        } else {
                            setCurrentUser(null);
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        setCurrentUser(null);
                    }
                } else {
                    setCurrentUser(null);
                }

                const experienceId = location.state?.experience?.id;
                if (!experienceId) {
                    setError("No se proporcionó un ID de experiencia.");
                    setLoading(false);
                    return;
                }

                try {
                    const experienceRef = doc(db, "Experiencias", experienceId);
                    const experienceSnap = await getDoc(experienceRef);
                    if (experienceSnap.exists()) {
                        const data = experienceSnap.data();
                        let imageUrl = '';
                        if (data.imageUrl) {
                            try {
                                imageUrl = await storage.getDownloadURL(data.imageUrl);
                            } catch (imageError) {
                                console.error("Error fetching experience image URL:", imageError);
                                imageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                            }
                        } else {
                            imageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                        }

                        const experienceData = {
                            id: experienceSnap.id,
                            name: data.nombre,
                            description: data.descripcion,
                            difficulty: data.dificultad,
                            price: data.precio,
                            distance: data.longitudRecorrido + " km",
                            duracion: data.duracionRecorrido,
                            time: data.horarioInicio + " - " + data.horarioFin,
                            days: data.fechas.join(', '),
                            maxPeople: data.maximoUsuarios,
                            minPeople: data.minimoUsuarios,
                            availableSlots: data.cuposDisponibles,
                            imageUrl,
                            registeredUsers: data.usuariosInscritos,
                            incluidos: data.incluidosExperiencia,
                            puntoDeSalida: data.puntoSalida,
                        };
                        setExperience(experienceData);

                        // Pre-fill selectedDate, selectedTime, and selectedDay from location.state
                        if (location.state?.selectedDate) {
                            const date = new Date(location.state.selectedDate);
                            setSelectedDate(date);
                            setSelectedDay(`${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`);
                        }
                        if (location.state?.selectedTime) {
                            setSelectedTime(location.state.selectedTime);
                        }

                        // Fetch guides from the experience
                        if (data.guias && Array.isArray(data.guias)) {
                            const fetchedGuides = [];
                            for (const guideRef of data.guias) {
                                if (guideRef && guideRef.email) {
                                    const usersRef = collection(db, "lista-de-usuarios");
                                    const q = query(usersRef, where("email", "==", guideRef.email));
                                    const querySnapshot = await getDocs(q);
                                    if (!querySnapshot.empty) {
                                        const guideDoc = querySnapshot.docs[0];
                                        const guideData = guideDoc.data();
                                        let guideImageUrl = '';
                                        if (guideData["Foto de Perfil"]) {
                                            try {
                                                guideImageUrl = await storage.getDownloadURL(guideData["Foto de Perfil"]);
                                            } catch (guideImageError) {
                                                console.error("Error fetching guide image URL:", guideImageError);
                                                guideImageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                                            }
                                        } else {
                                            guideImageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                                        }
                                        fetchedGuides.push({
                                            id: guideDoc.id,
                                            name: guideData.name,
                                            lastName: guideData.lastName,
                                            image: guideImageUrl,
                                            email: guideRef.email,
                                        });
                                    }
                                }
                            }
                            setExperienceGuides(fetchedGuides);
                        }
                    } else {
                        setError("Experiencia no encontrada.");
                    }
                } catch (fetchError) {
                    console.error("Error fetching experience details:", fetchError);
                    setError("No se pudieron cargar los detalles de la experiencia.");
                } finally {
                    setLoading(false);
                }
            });
            return () => unsubscribe && unsubscribe();
        };
        fetchData();
    }, [location.state, navigate]);

    useEffect(() => {
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
    }, [experience]);

    useEffect(() => {
        if (experience && selectedPeople) {
            setTotalPrice(experience.price * parseInt(selectedPeople));
        } else {
            setTotalPrice(0);
        }
    }, [experience, selectedPeople]);

    // Fetch reservations and calculate available slots
    useEffect(() => {
        const fetchReservations = async () => {
            if (!experience || !selectedTime || !selectedDay) {
                return;
            }
            
            try {
                // Get the experience document to check current available slots
                const experienceRef = doc(db, "Experiencias", experience.id);
                const expSnapshot = await getDoc(experienceRef);
                
                if (!expSnapshot.exists()) {
                    console.error("Experience not found");
                    return;
                }
                
                const expData = expSnapshot.data();
                const maxCapacity = expData.maximoUsuarios || experience.maxPeople || 0;
                const currentAvailableSlots = expData.cuposDisponibles || 0;
                
                // Check reservations for this specific date and time
                const paymentsRef = collection(db, "payments");
                const q = query(
                    paymentsRef,
                    where("experienceId", "==", experience.id),
                    where("selectedDay", "==", selectedDay),
                    where("selectedTime", "==", selectedTime),
                    where("status", "==", "COMPLETED")
                );
                
                const querySnapshot = await getDocs(q);
                
                let reservedSlots = 0;
                querySnapshot.forEach((doc) => {
                    // Sum up all selected people for this time slot
                    const bookings = doc.data().bookings || [];
                    bookings.forEach(booking => {
                        if (booking.selectedTime === selectedTime && 
                            booking.selectedDay === selectedDay &&
                            booking.experienceId === experience.id) {
                            reservedSlots += parseInt(booking.selectedPeople, 10) || 0;
                        }
                    });
                });
                
                setReservationsForTime(reservedSlots);
                
                // Calculate actual available slots based on reservations
                const actualAvailableSlots = Math.max(0, currentAvailableSlots - reservedSlots);
                setAvailableSlots(actualAvailableSlots);
                
                // Reset selected people if exceeds available slots
                if (parseInt(selectedPeople, 10) > actualAvailableSlots) {
                    setSelectedPeople('');
                }
                
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        fetchReservations();
        
        console.log("selectedTime:", selectedTime);
        console.log("selectedPeople:", selectedPeople);
        console.log("selectedDate:", selectedDate);
        console.log("selectedDay", selectedDay);
        console.log("totalPrice", totalPrice);
        console.log("experienceGuides:", experienceGuides);
        console.log("availableSlots:", availableSlots);
    }, [selectedTime, selectedPeople, selectedDate, selectedDay, totalPrice, experienceGuides, experience]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleScroll = (direction) => {
        const container = guideContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        // Reset selected people when changing time
        setSelectedPeople('');
    };

    const handlePeopleSelection = (people) => {
        const peopleCount = parseInt(people, 10);
        
        // Ensure the selected number doesn't exceed available slots
        if (peopleCount <= availableSlots) {
            setSelectedPeople(people);
        } else {
            // Optional: Show an alert or message
            alert(`Solo hay ${availableSlots} cupos disponibles para este horario.`);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!experience) {
        return <div>No se encontraron datos de la experiencia.</div>;
    }
    const formattedDate = selectedDay || "XX / XX / XXXX";

    return (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
            {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
                <div>Error: No se ha configurado el Client ID de PayPal.</div>
            )}
            <div className="container-booking-process">
                <button className="back-button-booking-process" onClick={handleGoBack}> VOLVER AL MENÚ DE RUTAS </button>
                <img src={backgroundImage} alt="Background" className="background-image-booking-process" />
                <div className="content-booking-process">
                    <div className="left-side-booking-process">
                        <div className='pasarela-de-pago-title-container-booking-process'>
                            <h1 className="title-booking-process">PASARELA DE PAGO</h1>
                        </div>
                        {/* Time Selection */}
                        <div className="selection-box-booking-process">
                            <label>SELECCIONA UN HORARIO</label>
                            <div className="time-buttons-booking-process">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelection(time)}
                                        className={selectedTime === time ? 'selected' : ''}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/*  End Time Selection */}
                        <div className="selection-box-booking-process">
                            <label>CANTIDAD DE PERSONAS</label>
                            <div className="quantity-buttons-booking-process">
                                <button 
                                    onClick={() => handlePeopleSelection('1')} 
                                    className={selectedPeople === '1' ? 'selected' : ''}
                                    disabled={availableSlots < 1}
                                    title={availableSlots < 1 ? 'No hay cupos disponibles' : ''}
                                >1 PERSONA</button>
                                <button 
                                    onClick={() => handlePeopleSelection('2')} 
                                    className={selectedPeople === '2' ? 'selected' : ''}
                                    disabled={availableSlots < 2}
                                    title={availableSlots < 2 ? 'No hay suficientes cupos disponibles' : ''}
                                >2 PERSONAS</button>
                                <button 
                                    onClick={() => handlePeopleSelection('3')} 
                                    className={selectedPeople === '3' ? 'selected' : ''}
                                    disabled={availableSlots < 3}
                                    title={availableSlots < 3 ? 'No hay suficientes cupos disponibles' : ''}
                                >3 PERSONAS</button>
                                <button 
                                    onClick={() => handlePeopleSelection('4')} 
                                    className={selectedPeople === '4' ? 'selected' : ''}
                                    disabled={availableSlots < 4}
                                    title={availableSlots < 4 ? 'No hay suficientes cupos disponibles' : ''}
                                >4 PERSONAS</button>
                            </div>
                            {availableSlots === 0 && (
                                <p className="no-slots-message">
                                    No hay cupos disponibles para este horario.
                                </p>
                            )}
                            {availableSlots > 0 && (
                                <p className="available-slots-message">
                                    Cupos disponibles: {availableSlots}
                                </p>
                            )}
                        </div>
                        {/* Guide Display Section (replaces Guide Selection) */}
                        <div className="selection-box-booking-process">
                            <label>GUÍAS ASIGNADOS</label>
                            <div className="guide-selection-wrapper-booking-process">
                                {experienceGuides.length > 3 && (
                                    <button className="scroll-button-booking-process left-scroll-booking-process" onClick={() => handleScroll('left')}></button>
                                )}
                                <div className="guide-selection-booking-process" ref={guideContainerRef}>
                                    {experienceGuides.map(guide => (
                                        <div key={guide.id} className="guide-card-booking-process">
                                            <img src={guide.image} alt={guide.name} />
                                            <div className="guide-info-booking-process">
                                                <p>{guide.name}</p>
                                                <p>{guide.lastName}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {experienceGuides.length === 0 && (
                                        <div className="no-guides-message" style={{ color: 'white', textAlign: 'center', width: '100%' }}>
                                            No hay guías asignados para esta experiencia.
                                        </div>
                                    )}
                                </div>
                                {experienceGuides.length > 3 && (
                                    <button className="scroll-button-booking-process right-scroll-booking-process" onClick={() => handleScroll('right')}></button>
                                )}
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
                            <p className='details-booking-process-p'>USUARIO: {currentUser?.name} {currentUser?.lastName}</p>
                            <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : {selectedPeople}</p>
                            <p className='details-booking-process-p'>RUTA: {experience.name}</p>
                            <p className='details-booking-process-p date-container-booking-process'>FECHA: {formattedDate}</p>
                            <p className='details-booking-process-p'>HORARIO: {selectedTime}</p>
                            <p className='details-booking-process-p'>
                                GUÍAS: {experienceGuides.length > 0 
                                    ? experienceGuides.map(g => `${g.name} ${g.lastName}`).join(', ') 
                                    : 'No asignados'}
                            </p>
                            <p className='details-booking-process-p'>PRECIO TOTAL: ${totalPrice}.00</p>
                        </div>
                        <div className='realizar-pago-button-container-booking-process'>
                            {isPaymentSuccessful ? (
                                <p>Pago exitoso!</p>
                            ) : (
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    disabled={!selectedTime || !selectedPeople || !selectedDate || experienceGuides.length === 0}
                                    createOrder={(data, actions) => {
                                         if (!totalPrice || totalPrice <= 0) {
                                            alert("El precio total debe ser mayor a 0.");
                                            return;
                                        }
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: totalPrice.toFixed(2),
                                                    },
                                                 description: `Reserva para ${experience.name} el ${formattedDate} a las ${selectedTime}`,
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            handlePaymentSuccess(details);
                                        });
                                    }}
                                    onError={(error) => {
                                        handlePaymentError(error);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}

export default BookingProcessPage;