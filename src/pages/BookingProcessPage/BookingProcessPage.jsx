// BookingProcessPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BookingProcessPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase-config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import storage from '../../services/storage-service';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function BookingProcessPage() {
    // ... (All other state variables remain the same)
    const location = useLocation();
    const navigate = useNavigate();
    const guideContainerRef = useRef(null);
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [guides, setGuides] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);


    const savePaymentDetails = async (details) => {
        // ... (Existing savePaymentDetails code remains mostly the same)
        try {
            const userEmail = auth.currentUser.email;
            if (!userEmail) {
                throw new Error("User email not found. User might not be logged in.");
            }

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
                selectedGuideId: selectedGuide?.id,
                selectedDate: selectedDate?.toISOString(),
                selectedDay,
            };

            // --- No changes needed here, we keep using the email as doc ID ---
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
            setIsPaymentSuccessful(true);

            // Update experience bookings
            await updateExperienceBookings(paymentData);

        } catch (error) {
            console.error("Error saving payment details to Firestore:", error);
            alert("Hubo un error al guardar los detalles del pago.");
        }
    };

    const updateExperienceBookings = async (paymentData) => {
        // ... (Existing updateExperienceBookings code remains the same)
        if (!experience || !experience.id) {
            console.error("Experience ID is missing. Cannot update bookings.");
            return;
        }

        const experienceRef = doc(db, "Experiencias", experience.id);
        const formattedDate = selectedDay; // Use the already formatted date.
        const timeSlot = selectedTime;

        try {

              const bookingData = {
                people: parseInt(selectedPeople, 10), // Ensure this is a number
                user: {
                    id: currentUser.id,
                    name: currentUser.name,
                    lastName: currentUser.lastName,
                    email: auth.currentUser.email // Store user email.
                },
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

            //Initialize time slot if doesn't exist
            if(!reservas[formattedDate][timeSlot]){
                reservas[formattedDate][timeSlot] = [];
            }

             reservas[formattedDate][timeSlot].push(bookingData);
             //Update experience data in firestore
             await updateDoc(experienceRef, {reservas});
             console.log("Experience bookings updated successfully.");


        } catch (error) {
            console.error("Error updating experience bookings:", error);
        }
    };

    // ... (Rest of the component code, including useEffects, handlers, and JSX)
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
                            rating: data.puntuacion,
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
                                            rating: guideData.puntuacion || 0,
                                            image: guideImageUrl,
                                        });
                                    }
                                }
                            }
                            setGuides(fetchedGuides);
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

    const handleGoBack = () => {
        navigate(-1);
    };

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
            const scrollAmount = direction === 'left' ? -200 : 200;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const handlePeopleSelection = (people) => {
        setSelectedPeople(people);
    };

    const handleGuideSelection = (guide) => {
        setSelectedGuide(guide);
    };

    useEffect(() => {
        console.log("selectedTime:", selectedTime);
        console.log("selectedPeople:", selectedPeople);
        console.log("selectedGuide:", selectedGuide);
        console.log("selectedDate:", selectedDate);
        console.log("selectedDay", selectedDay);
        console.log("totalPrice", totalPrice);
    }, [selectedTime, selectedPeople, selectedGuide, selectedDate, selectedDay, totalPrice]);

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
                <img src="../../src/assets/images/ExperiencesPage/paisajeReserva.png" alt="Background" className="background-image-booking-process" />
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
                                <button onClick={() => handlePeopleSelection('1')} className={selectedPeople === '1' ? 'selected' : ''}>1 PERSONA</button>
                                <button onClick={() => handlePeopleSelection('2')} className={selectedPeople === '2' ? 'selected' : ''}>2 PERSONAS</button>
                                <button onClick={() => handlePeopleSelection('3')} className={selectedPeople === '3' ? 'selected' : ''}>3 PERSONAS</button>
                                <button onClick={() => handlePeopleSelection('4')} className={selectedPeople === '4' ? 'selected' : ''}>4 PERSONAS</button>
                            </div>
                        </div>
                        <div className="selection-box-booking-process">
                            <label>SELECCIONA UN GUÍA</label>
                            <div className="guide-selection-wrapper-booking-process">
                                <button className="scroll-button-booking-process left-scroll-booking-process" onClick={() => handleScroll('left')}></button>
                                <div className="guide-selection-booking-process" ref={guideContainerRef}>
                                    {guides.map(guide => (
                                        <div key={guide.id} className={`guide-card-booking-process ${selectedGuide?.id === guide.id ? 'selected' : ''}`} onClick={() => handleGuideSelection(guide)}>
                                            <img src={guide.image} alt={guide.name} />
                                            <div className="guide-info-booking-process">
                                                <p>{guide.name}</p>
                                                <p>{guide.lastName}</p>
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
                            <p className='details-booking-process-p'>USUARIO: {currentUser?.name} {currentUser?.lastName}</p>
                            <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : {selectedPeople}</p>
                            <p className='details-booking-process-p'>RUTA: {experience.name}</p>
                            <p className='details-booking-process-p date-container-booking-process'>FECHA: {formattedDate}</p>
                            <p className='details-booking-process-p'>HORARIO: {selectedTime}</p>
                            <p className='details-booking-process-p'>GUÍA: {selectedGuide?.name} {selectedGuide?.lastName}</p>
                            <p className='details-booking-process-p'>PRECIO TOTAL: ${totalPrice}.00</p>
                        </div>
                        <div className='realizar-pago-button-container-booking-process'>
                            {isPaymentSuccessful ? (
                                <p>Pago exitoso!</p>
                            ) : (
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    disabled={!selectedTime || !selectedPeople || !selectedGuide || !selectedDate}
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
                                                 description: `Reserva para ${experience.name} el ${formattedDate} a las ${selectedTime} con ${selectedGuide?.name}`,
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