// BookingProcessPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BookingProcessPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import storage from '../../services/storage-service';

function BookingProcessPage() {
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
    const [guides, setGuides] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]); // Nuevo estado para los turnos


    useEffect(() => {
        const fetchExperienceDetails = async () => {
            // ... (código existente para obtener los detalles de la experiencia) ...
            setLoading(true);
            setError(null);

            const experienceId = location.state?.experience?.id;

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
                    let imageUrl = '';
                    if (data.imageUrl) {
                        try {
                            imageUrl = await storage.getDownloadURL(data.imageUrl);
                        } catch (imageError) {
                            console.error("Error fetching experience image URL:", imageError);
                            imageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                        }
                    } else {
                        console.warn("Experience does not have an imageUrl field.");
                        imageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                    }


                    const experienceData = {
                        id: experienceSnap.id,
                        name: data.name,
                        description: data.descripcion,
                        difficulty: data.dificultad,
                        price: data.precio,
                        distance: data.longitudRecorrido + " km",
                        duracion: data.duracionRecorrido,
                        time: data.horarioInicio + " - " + data.horarioFin,  //Lo usaremos para los turnos
                        days: data.fechas.join(', '),
                        maxPeople: data.maximoUsuarios,
                        minPeople: data.minimoUsuarios,
                        availableSlots: data.cuposDisponibles,
                        imageUrl: imageUrl,
                        rating: data.puntuacion,
                        registeredUsers: data.usuariosInscritos,
                        incluidos: data.incluidosExperiencia,
                        puntoDeSalida: data.puntoSalida,
                    };
                    setExperience(experienceData);

                    if (location.state?.selectedDate) {
                        setSelectedDate(new Date(location.state.selectedDate));
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
                                        console.warn(`Guide ${guideData.name} does not have a fotoPerfil field.`);
                                        guideImageUrl = '/src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                                    }

                                    fetchedGuides.push({
                                        id: guideDoc.id,
                                        name: guideData.name,
                                        lastName: guideData.lastName,
                                        rating: guideData.puntuacion || 0,
                                        image: guideImageUrl,
                                    });
                                } else {
                                    console.warn("Guide not found for email:", guideRef.email);
                                }
                            } else {
                                console.warn("Invalid guide reference:", guideRef);
                            }
                        }
                        setGuides(fetchedGuides);
                    }


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
    }, [location.state]);

    // Nueva función para generar los turnos
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
                //Elimina el último turno si es identico a la hora de finalización, para que no se duplique.
                if(slots.length > 0){
                    const lastSlot = slots[slots.length -1];
                    if(lastSlot === endTime){
                        slots.pop();
                    }
                }

                return slots;
            };


            const [startTime, endTime] = experience.time.split(' - ');
             //duracion es en minutos.
            const timeSlots = generateTimeSlots(startTime, endTime, parseInt(experience.duracion));
            setAvailableTimes(timeSlots);
        }
    }, [experience]);


    const handleGoBack = () => {
        navigate(-1);
    };

    const renderRatingDots = (rating) => {
         // ... (código existente) ...
        const dots = [];
        for (let i = 0; i < 5; i++) {
            dots.push(
                <span key={i} className={`dot-booking-process ${i < rating ? 'yellow-dot-booking-process' : 'white-dot-booking-process'}`}></span>
            );
        }
        return dots;
    };

    const handleScroll = (direction) => {
        // ... (código existente) ...
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
        // ... (código existente) ...
        setSelectedPeople(people);
    };

    const handleGuideSelection = (guide) => {
        // ... (código existente) ...
        setSelectedGuide(guide);
    };

    const handlePayment = () => {
        // ... (código existente, validaciones, etc.) ...
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
        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        console.log("Payment initiated with:", {
            experienceId: experience?.id,
            selectedTime,
            selectedPeople,
            selectedGuideId: selectedGuide.id,
            selectedDate,
        });
        alert("Payment functionality not implemented yet.");

    };

    if (loading) {
        return <div>Loading experience details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!experience) {
        return <div>No experience data found.</div>;
    }

    const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : "XX / XX / XXXX";

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
                            {/* Genera los botones dinámicamente */}
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
                                            <p>{guide.lastName}</p> {/* Display lastName */}
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
                        <p className='details-booking-process-p'>CANTIDAD DE PERSONAS : {selectedPeople}</p>
                        <p className='details-booking-process-p'>RUTA: {experience.name}</p>
                        <p className='details-booking-process-p date-container-booking-process'>FECHA: {formattedDate}</p>
                        <p className='details-booking-process-p'>HORARIO: {selectedTime}</p>
                        <p className='details-booking-process-p'>GUÍA: {selectedGuide?.name} {selectedGuide?.lastName}</p> {/* Display full name */}
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