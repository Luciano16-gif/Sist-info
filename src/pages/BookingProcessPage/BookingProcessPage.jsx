import React, { useState, useEffect, useRef } from 'react';
import './BookingProcessPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import backgroundImage from '../../assets/images/ExperiencesPage/paisajeReserva.png';
import BookingService from '../../components/services/BookingService';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import LazyImage from '../../components/common/LazyImage/LazyImage';
import LoadingState from '../../components/common/LoadingState/LoadingState';

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
    const [currentUser, setCurrentUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [experienceCode, setExperienceCode] = useState('');
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [availableSlots, setAvailableSlots] = useState(0);
    const [bookingWindowMessage, setBookingWindowMessage] = useState('');

    // Generate a unique booking code on component mount
    useEffect(() => {
        setExperienceCode(BookingService.generateExperienceCode());
    }, []);

    // Handle successful payment
    const savePaymentDetails = async (details) => {
        try {
            if (!auth.currentUser) {
                throw new Error("Usuario no autenticado");
            }
    
            const bookingData = {
                experienceId: experience.id,
                userId: currentUser.id,
                userEmail: auth.currentUser.email,
                userName: currentUser.name,
                userLastName: currentUser.lastName,
                selectedDate,
                selectedTime,
                selectedPeople,
                guides: experienceGuides.map(guide => ({
                    id: guide.id,
                    name: guide.name,
                    lastName: guide.lastName,
                    email: guide.email
                })),
                paymentDetails: {
                    id: details.id,
                    status: details.status,
                    amount: details.purchase_units[0].amount.value,
                    currency: details.purchase_units[0].amount.currency_code,
                    payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                    payerEmail: details.payer.email_address,
                }
            };
    
            // Create the booking using the service
            const result = await BookingService.createBooking(bookingData);
    
            if (!result.success) {
                throw new Error(result.error || "Error al crear la reserva");
            }
    
            // Store payment details for receipt
            setPaymentDetails({
                transactionId: details.id,
                payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                payerEmail: details.payer.email_address,
                amount: details.purchase_units[0].amount.value,
                currency: details.purchase_units[0].amount.currency_code,
                status: details.status,
                timestamp: new Date().toISOString(), // Use ISO string instead of a Date object
                experienceId: experience.id,
                userId: currentUser.id,
                selectedTime,
                selectedPeople,
                guides: experienceGuides.map(g => ({
                    id: g.id,
                    name: g.name,
                    lastName: g.lastName,
                    email: g.email
                })),
                selectedDate: selectedDate.toISOString(),
                selectedDay,
                experienceCode: result.experienceCode || experienceCode,
            });
    
            setIsPaymentSuccessful(true);
        } catch (error) {
            console.error("Error saving payment details:", error);
            alert("Hubo un error al guardar los detalles del pago: " + (error.message || "Error desconocido"));
        }
    };

    // Handle payment success from PayPal
    const handlePaymentSuccess = (details) => {
        console.log("Pago completado:", details);
        alert(`¡Pago exitoso! Gracias, ${details.payer.name.given_name}.`);
        savePaymentDetails(details);
    };

    // Handle payment error from PayPal
    const handlePaymentError = (error) => {
        console.error("Error en el pago:", error);
        alert("El pago falló. Por favor, inténtalo de nuevo.");
        setIsPaymentSuccessful(false);
    };

    // Component to render receipt
    function Factura({ paymentDetails, currentUser, experience }) {
        if (!paymentDetails || !currentUser || !experience) {
            return <div>No hay datos para la factura.</div>;
        }

        return (
            <div id="factura" style={{ fontFamily: 'Arial', fontSize: '14px', padding: '20px', backgroundColor: 'white' }}>
                <h1 style={{ color: 'blue', textAlign: 'center' }}>Detalles de la Reserva</h1>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Código:</strong> {paymentDetails.experienceCode}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Usuario:</strong> {currentUser.name} {currentUser.lastName}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Email:</strong> {currentUser.id}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Fecha:</strong> {paymentDetails.selectedDay}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Hora:</strong> {paymentDetails.selectedTime}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Cantidad de Personas:</strong> {paymentDetails.selectedPeople}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#eee' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Campo</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Ruta</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{experience.name}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Guías</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{paymentDetails.guides.map(g => `${g.name} ${g.lastName}`).join(', ')}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Precio Total</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${paymentDetails.amount} {paymentDetails.currency}</td>
                        </tr>
                        <tr>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>ID de Transacción</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{paymentDetails.transactionId}</td>
                        </tr>
                        <tr>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>Estado del Pago</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{paymentDetails.status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    // Download booking details as image
    const downloadBookingDetails = async () => {
        if (!paymentDetails || !currentUser || !experience) {
            console.error("Faltan datos para generar la imagen.");
            return;
        }

        const facturaContainer = document.createElement('div');
        facturaContainer.style.position = 'absolute';
        facturaContainer.style.left = '-9999px';
        document.body.appendChild(facturaContainer);

        const facturaElement = (
            <Factura
                paymentDetails={paymentDetails}
                currentUser={currentUser}
                experience={experience}
            />
        );

        const facturaHTML = ReactDOMServer.renderToString(facturaElement);
        facturaContainer.innerHTML = facturaHTML;

        const canvas = await html2canvas(facturaContainer);
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `reserva_${paymentDetails.experienceCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(facturaContainer);
    };

    // Load experience and user data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // Check URL state for experience data
            const experienceData = location.state?.experience;
            const locationSelectedDate = location.state?.selectedDate;
            const locationSelectedTime = location.state?.selectedTime;
            const locationSelectedDay = location.state?.selectedDay;
            const locationAvailableSlots = location.state?.availableSlots;

            // Redirect if no experience data or time selection
            if (!experienceData || !locationSelectedTime) {
                navigate('/');
                return;
            }

            try {
                // Get current user data
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
                                setError("No se encontró la información del usuario");
                            }
                        } catch (error) {
                            console.error("Error fetching user data:", error);
                            setCurrentUser(null);
                            setError("Error al cargar información del usuario");
                        }
                    } else {
                        setCurrentUser(null);
                        setError("Usuario no autenticado");
                        navigate('/login-page');
                    }
                });

                // Set experience data
                setExperience(experienceData);

                // Set selected date/time from URL state (these must be present - no fallback)
                if (locationSelectedDate) {
                    const date = new Date(locationSelectedDate);
                    setSelectedDate(date);
                    
                    // Check if date is within booking window
                    if (!BookingService.isWithinBookingWindow(date)) {
                        setError("Solo se permiten reservas hasta 2 semanas en el futuro.");
                        setBookingWindowMessage("Solo se permiten reservas hasta 2 semanas en el futuro.");
                    }
                } else {
                    // If date is missing, redirect to experiences
                    navigate('/experiencias');
                    return;
                }
                
                // Time must be provided from previous page
                if (locationSelectedTime) {
                    setSelectedTime(locationSelectedTime);
                } else {
                    // If time is missing, redirect to experiences
                    navigate('/experiencias');
                    return;
                }
                
                if (locationSelectedDay) {
                    setSelectedDay(locationSelectedDay);
                } else {
                    // Format the date ourselves if needed
                    const date = new Date(locationSelectedDate);
                    setSelectedDay(BookingService.formatDate(date));
                }
                
                if (locationAvailableSlots !== undefined) {
                    setAvailableSlots(locationAvailableSlots);
                } else {
                    // If slots info is missing, default to a safe value
                    setAvailableSlots(0);
                }

                // Get guides for this experience
                if (experienceData.guides && Array.isArray(experienceData.guides)) {
                    setExperienceGuides(experienceData.guides);
                }

                setLoading(false);
                
                // Cleanup
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar los datos. Por favor, intente de nuevo.");
                setLoading(false);
            }
        };

        fetchData();
    }, [location.state, navigate]);

    // Update total price when selected people changes
    useEffect(() => {
        if (experience && selectedPeople) {
            setTotalPrice(experience.price * parseInt(selectedPeople, 10));
        } else {
            setTotalPrice(0);
        }
    }, [experience, selectedPeople]);

    // Check availability when component mounts
    useEffect(() => {
        const checkAvailability = async () => {
            if (!experience || !selectedTime || !selectedDate) {
                return;
            }
            
            try {
                // Check if date is within booking window
                const isWithinWindow = BookingService.isWithinBookingWindow(selectedDate);
                if (!isWithinWindow) {
                    setError("Solo se permiten reservas hasta 2 semanas en el futuro.");
                    setBookingWindowMessage("Solo se permiten reservas hasta 2 semanas en el futuro.");
                    setAvailableSlots(0);
                    return;
                }
            } catch (error) {
                console.error("Error checking availability:", error);
                setError("Error al verificar disponibilidad");
                setAvailableSlots(0);
            }
        };

        checkAvailability();
    }, [experience, selectedDate, selectedTime]);

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

    const handlePeopleSelection = (people) => {
        const peopleCount = parseInt(people, 10);
        
        // Ensure the selected number doesn't exceed available slots
        if (peopleCount <= availableSlots) {
            setSelectedPeople(people);
        } else {
            alert(`Solo hay ${availableSlots} cupos disponibles para este horario.`);
        }
    };

    if (loading) {
        return <LoadingState text="Cargando datos de la reserva..." />;
    }
    
    if (error) {
        return (
            <div className="container-booking-process">
                <button className="back-button-booking-process" onClick={handleGoBack}>
                    VOLVER
                </button>
                <div className="error-message-container" style={{
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    padding: '20px',
                    borderRadius: '10px',
                    margin: '20px auto',
                    maxWidth: '600px',
                    textAlign: 'center'
                }}>
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    if (!experience) {
        return <LoadingState text="No se encontraron datos de la experiencia." />;
    }

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
                            
                            {/* Booking Window Message */}
                            {bookingWindowMessage && (
                                <div className="booking-window-message">
                                    <p>{bookingWindowMessage}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Selected Time Display (read-only) */}
                        <div className="selection-box-booking-process">
                            <label>HORARIO SELECCIONADO</label>
                            <div className="selected-time-display">
                                {selectedTime}
                            </div>
                        </div>
                        
                        {/* People Selection */}
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
                        
                        {/* Guide Display Section */}
                        <div className="selection-box-booking-process">
                            <label>GUÍAS ASIGNADOS</label>
                            <div className="guide-selection-wrapper-booking-process">
                                {experienceGuides.length > 3 && (
                                    <button className="scroll-button-booking-process left-scroll-booking-process" onClick={() => handleScroll('left')}></button>
                                )}
                                <div className="guide-selection-booking-process" ref={guideContainerRef}>
                                    {experienceGuides.map(guide => (
                                        <div key={guide.id} className="guide-card-booking-process">
                                            <LazyImage 
                                                src={guide.image} 
                                                alt={guide.name}
                                                style={{ width: '70px', height: '70px', borderRadius: '50%', marginBottom: '8px' }}
                                                fallbackSrc="../../src/assets/images/AdminLandingPage/profile_blank.webp"
                                            />
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
                        <h2 className='codigo-participacion-booking-process'>{experienceCode}</h2>
                        <div className='user-details-container-booking-process'>
                            <p className='details-booking-process-p'>USUARIO: {currentUser?.name} {currentUser?.lastName}</p>
                            <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : {selectedPeople}</p>
                            <p className='details-booking-process-p'>RUTA: {experience.name}</p>
                            <p className='details-booking-process-p date-container-booking-process'>FECHA: {selectedDay}</p>
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
                                <>
                                    <p>Pago exitoso!</p>
                                    <button onClick={downloadBookingDetails} className="payment-button-booking-process">
                                        Descargar Detalles de la Reserva
                                    </button>
                                </>
                            ) : (
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    disabled={!selectedPeople || experienceGuides.length === 0 || availableSlots <= 0}
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
                                                    description: `Reserva para ${experience.name} el ${selectedDay} a las ${selectedTime}`,
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