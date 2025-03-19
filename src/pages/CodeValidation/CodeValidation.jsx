import React, { useState, useEffect } from 'react';
import './CodeValidation.css';
import searchIcon from '../../../src/assets/images/lupa-search.png';
import { db } from './../../firebase-config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function CodeValidation() {
    const [codeInput, setCodeInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [userType, setuserType] = useState('');

    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    };

    useEffect(() => {
        const fetchuserType = async () => {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                const userEmail = currentUser.email;
                const usersRef = collection(db, "lista-de-usuarios");
                const q = query(usersRef, where("email", "==", userEmail));

                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setuserType(userData.userType);
                    } else {
                        setuserType('');
                    }
                } catch (error) {
                    console.error("Error al obtener el rol del usuario:", error);
                    setuserType('');
                }
            } else {
                setuserType('');
            }
        };

        fetchuserType();
    }, []);

    const handleCodeChange = (event) => {
        setCodeInput(event.target.value.toUpperCase());
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchError('');
        setIsSearching(true);
        setBookingDetails(null);
        performSearch(codeInput);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event);
        }
    };

    const performSearch = async (code) => {
        try {
            if (!code || code.length !== 6) {
                setSearchError("Por favor, ingresa un código válido de 6 caracteres.");
                setIsSearching(false);
                return;
            }

            if (userType !== 'guia' && userType !== 'admin') {
                setSearchError("Solo los guías y administradores pueden validar códigos.");
                setIsSearching(false);
                return;
            }

            let foundBooking = null;
            let experienceName = null; // Store experienceName separately
            let experienceId = null;

            // 1. Search in 'payments' collection (for basic info, userId, and experienceId)
            const paymentsRef = collection(db, 'payments');
            const paymentsQuerySnapshot = await getDocs(paymentsRef);

            for (const paymentDoc of paymentsQuerySnapshot.docs) {
                const paymentData = paymentDoc.data();
                if (paymentData.bookings && Array.isArray(paymentData.bookings)) {
                    for (const booking of paymentData.bookings) {
                        if (booking.experienceCode === code) {
                            // Get basic booking info. We still can't get the FULL experienceName here.
                            foundBooking = {
                                ...booking,
                                experienceId: booking.experienceId || null, // Get experienceId
                                selectedDate: booking.selectedDay || booking.selectedDate, // Verificar ambos campos
                                selectedTime: booking.selectedTime,
                                guides: booking.guides,
                                people: booking.selectedPeople,
                                transactionId: booking.transactionId
                                // DO NOT create 'user' yet, and DO NOT assume experienceName is here.
                            };
                            // Get experienceId from the booking, which IS stored in payments
                            experienceId = booking.experienceId;
                            break;
                        }
                    }
                }
                if (foundBooking) break;
            }


            // 2. Search in 'Experiencias' collection (for experienceName and basic info)
            if (!foundBooking) {
                const experienciasRef = collection(db, "Experiencias");
                const querySnapshot = await getDocs(experienciasRef);

                for (const expDoc of querySnapshot.docs) {
                    const expData = expDoc.data();
                    if (expData.reservas) {
                        for (const dateKey in expData.reservas) {
                            for (const timeKey in expData.reservas[dateKey]) {
                                const timeReservas = expData.reservas[dateKey][timeKey];
                                if (Array.isArray(timeReservas)) {
                                    for (const reserva of timeReservas) {
                                        if (reserva.experienceCode === code) {
                                            foundBooking = {
                                                ...reserva,
                                                //experienceName: expData.nombre, // Get experienceName from here
                                                experienceId: expDoc.id,  // Get experienceId
                                                selectedDate: dateKey,
                                                selectedTime: timeKey,
                                            };
                                            experienceName = expData.nombre; // Get experienceName.
                                            experienceId = expDoc.id;
                                            break;
                                        }
                                    }
                                }
                                if (foundBooking) break;
                            }
                            if (foundBooking) break;
                        }
                        if (foundBooking) break;
                    }
                }
            }

            // 3. Fetch User Details (if needed)
            if (foundBooking && !foundBooking.user) {
                if (foundBooking.userId) {
                    const userRef = doc(db, "lista-de-usuarios", foundBooking.userId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        foundBooking.user = {
                            id: userSnap.id,
                            name: userData.name,
                            lastName: userData.lastName,
                            email: userData.email,
                        };
                    } else {
                        console.error("User not found with ID:", foundBooking.userId);
                        foundBooking.user = {
                            id: null,
                            name: "Unknown",
                            lastName: "User",
                            email: "",
                        };
                    }
                } else{
                    console.error("User Id is not valid", foundBooking.userId);
                    foundBooking.user = {
                            id: null,
                            name: "Unknown",
                            lastName: "User",
                            email: "",
                        };
                }
            }

             // *** 4. Fetch Experience Name (if needed) ***
            if (foundBooking && !experienceName && experienceId) {
                // If we found a booking in 'payments' but don't have experienceName, fetch it.
                const experienceRef = doc(db, "Experiencias", experienceId);
                const experienceSnap = await getDoc(experienceRef);

                if (experienceSnap.exists()) {
                    experienceName = experienceSnap.data().nombre; // Use .nombre, as in BookingProcessPage
                } else {
                    console.error("Experience not found with ID:", experienceId);
                    experienceName = "Unknown Experience"; // Provide a default
                }
            }

            // 5. Combine all the data
            if(foundBooking){
                // Verificar si tenemos selectedDate o selectedDay (o ambos)
                const dateToShow = foundBooking.selectedDay || foundBooking.selectedDate;
                
                // Ahora combina los datos, asegurándote de usar el valor de fecha correcto
                setBookingDetails({
                    ...foundBooking, 
                    experienceName: experienceName,
                    selectedDate: dateToShow  // Asegura que selectedDate siempre tenga un valor
                });

            } else {
                setSearchError("No se encontró ninguna reserva con ese código.");
            }

        } catch (error) {
            console.error('Error al buscar en Firestore:', error);
            setSearchError('Error al buscar. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSearching(false);
        }
    };


    return (
        <div className="container-code-validation">
            <h1 className="title-code-validation">Validar Código de Reserva</h1>
            <p className="subtitle-code-validation">Ingresa el código de reserva de 6 caracteres:</p>

            <form className="form-code-validation" onSubmit={handleSearchSubmit}>
                <div className="input-container-code-validation">
                    <label htmlFor="code-input">Código:</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="code-input"
                            value={codeInput}
                            onChange={handleCodeChange}
                            onKeyDown={handleKeyDown}
                            className={`input-code-validation ${searchError ? "input-error-code-validation" : ""}`}
                            placeholder="Ingresa el código..."
                            maxLength="6"
                            disabled={isSearching}
                        />
                        <img src={searchIcon} alt="Buscar" className="search-icon-code-validation" />
                        {isSearching && <span className="searching-text-code-validation">Buscando...</span>}
                    </div>
                </div>
            </form>

            {searchError && <div className="error-message-code-validation">{searchError}</div>}

            {/* Display Booking Details */}
            {bookingDetails && (
                <div className="results-container-code-validation">
                    <h2>Detalles de la Reserva:</h2>
                    <div className="result-item-code-validation">
                        <p><strong>Experiencia:</strong> {bookingDetails.experienceName}</p>
                        <p><strong>Usuario:</strong> {bookingDetails.user?.name} {bookingDetails.user?.lastName}</p>
                        <p><strong>Correo del Usuario:</strong> {bookingDetails.user?.email}</p>
                        <p><strong>Fecha:</strong> {bookingDetails.selectedDate}</p>
                        <p><strong>Hora:</strong> {bookingDetails.selectedTime}</p>
                        <p><strong>Personas:</strong> {bookingDetails.people}</p>
                        <p><strong>Código:</strong> {bookingDetails.experienceCode}</p>
                        {bookingDetails.guides && bookingDetails.guides.length > 0 && (
                            <p>
                                <strong>Guías:</strong>
                                {bookingDetails.guides.map(guide => `${guide.name} ${guide.lastName}`).join(', ')}
                            </p>
                        )}
                        {bookingDetails.transactionId && (
                            <p><strong>ID de Transacción:</strong> {bookingDetails.transactionId}</p>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}

export default CodeValidation;