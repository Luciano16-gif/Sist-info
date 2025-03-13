// BookingProcessPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BookingProcessPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config'; // Import Firebase
import { doc, getDoc } from 'firebase/firestore'; // Import specific Firestore functions
// import { getDownloadURL, ref } from 'firebase/storage'; // REMOVE: No longer needed
import storageService from '../../services/storage-service'; // Import the new storage service


function BookingProcessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const guideContainerRef = useRef(null);
    const [experience, setExperience] = useState(null); // Store the fetched experience data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedPeople, setSelectedPeople] = useState('');
    const [selectedGuide, setSelectedGuide] = useState(null);  // Store the selected guide

    // Dummy guide data (replace with actual guide data from an API or, ideally, Firestore)
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

    useEffect(() => {
        const fetchExperienceDetails = async () => {
            setLoading(true);
            setError(null);

            const experienceId = location.state?.experience?.id;  // Get ID from navigation state

            if (!experienceId) {
                setError("No experience ID provided.");
                setLoading(false);
                return;
            }

            try {
                const experienceRef = doc(db, "Experiencias", experienceId);
                const experienceSnap = await getDoc(experienceRef);

                if (experienceSnap.exists()) {
                    const data = experienceSnap.data();

                    // Get image URL (using Cloudinary now)
                    let imageUrl = '';
                    try {
                        // Assuming data.imageUrl contains the *path* or *publicId*
                        imageUrl = storageService.getDownloadURL(data.imageUrl); //  Use the new service
                    } catch (imageError) {
                        console.error("Error fetching image URL:", imageError);
                         // Fallback is still important!  Provide a path, not a full URL here
                        imageUrl = 'src/assets/images/landing-page/profile_managemente/profile_picture_1.png'; //Relative path.
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
                      imageUrl: imageUrl, // Use the fetched URL
                      rating: data.puntuacion,
                      registeredUsers: data.usuariosInscritos,
                      incluidos: data.incluidosExperiencia,
                      puntoDeSalida: data.puntoSalida,
                      // Add other fields as needed
                  };
                    setExperience(experienceData);
                } else {
                    setError("Experience not found.");
                }
            } catch (fetchError) {
                console.error("Error fetching experience details:", fetchError);
                setError("Failed to load experience details.");
            } finally {
                setLoading(false);
            }
        };

        fetchExperienceDetails();
    }, [location.state]); // Depend on location.state to re-fetch if needed

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

    const handlePayment = () => {
        // Implement your payment logic here.  This is a placeholder.
        // You'll likely interact with a payment gateway (Stripe, PayPal, etc.)
        // and update the Firestore database to reflect the booking.

        if (!selectedTime) {
          alert("Please select a time.");
          return;
        }
        if (!selectedPeople) {
          alert("Please select the number of people.");
          return;
        }
        if (!selectedGuide) {
          alert("Please select a guide.");
          return;
        }

        console.log("Payment initiated with:", {
          experienceId: experience?.id,
          selectedTime,
          selectedPeople,
          selectedGuideId: selectedGuide.id,
        });

        // Example: Update Firestore to mark the experience as booked (VERY simplified)
        // In a real application, you would need to handle:
        // - Transaction management (to ensure atomicity)
        // - User authentication
        // - Inventory management (reducing available slots)
        // - Error handling (what if the payment fails?)

        /*  //This is just a placeholder, transaction is important
        const experienceRef = doc(db, "Experiencias", experience.id);
        updateDoc(experienceRef, {
            cuposDisponibles: experience.availableSlots - parseInt(selectedPeople), // VERY simplified
            // Add other fields to update (e.g., user bookings)
        })
        .then(() => {
            alert("Booking successful!");
            // Navigate to a confirmation page or back to the experiences list
        })
        .catch((error) => {
            console.error("Error updating booking:", error);
            alert("Booking failed. Please try again.");
        });
        */

       alert("Payment functionality not implemented yet.");

    };


    if (loading) {
        return <div>Loading experience details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!experience) {
        return <div>No experience data found.</div>; // This should rarely happen now
    }

    return (
        <div className="container-booking-process">
            <button className="back-button-booking-process" onClick={handleGoBack}> VOLVER AL MENÚ DE RUTAS </button>
            <img src={experience.imageUrl} alt="Background" className="background-image-booking-process" /> {/* Dynamic background */}
            <div className="content-booking-process">
                <div className="left-side-booking-process">
                    <div className='pasarela-de-pago-title-container-booking-process'>
                        <h1 className="title-booking-process">PASARELA DE PAGO</h1>
                    </div>
                    <div className="selection-box-booking-process">
                        <label>SELECCIONA UN HORARIO</label>
                        <div className="time-buttons-booking-process">
                            <button onClick={() => handleTimeSelection('7:00AM')} className={selectedTime === '7:00AM' ? 'selected' : ''}>7:00AM</button>
                            <button onClick={() => handleTimeSelection('10:00AM')} className={selectedTime === '10:00AM' ? 'selected' : ''}>10:00AM</button>
                            <button onClick={() => handleTimeSelection('1:00PM')} className={selectedTime === '1:00PM' ? 'selected' : ''}>1:00PM</button>
                        </div>
                    </div>
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
                    <h2 className='codigo-participacion-booking-process'>S912AP</h2>  {/*  Consider making this dynamic */}
                    <div className='user-details-container-booking-process'>
                        <p className='details-booking-process-p'>USUARIO:  XXXXXXX XXXXX</p> {/* Replace with actual user data */}
                        <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : {selectedPeople}</p>
                        <p className='details-booking-process-p'>RUTA: {experience.name}</p>
                        <p className='details-booking-process-p'>FECHA: XX / XX / XXXX</p>  {/*  TODO:  Integrate a date picker */}
                        <p className='details-booking-process-p'>HORARIO: {selectedTime}</p>
                        <p className='details-booking-process-p'>GUÍA: {selectedGuide?.name}</p>
                    </div>
                    <div className='realizar-pago-button-container-booking-process'>
                        <button className="payment-button-booking-process" onClick={handlePayment}>REALIZAR PAGO</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingProcessPage;