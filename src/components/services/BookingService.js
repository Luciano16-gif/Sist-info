import { db } from '../../firebase-config';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  updateDoc, 
  arrayUnion, 
  setDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';

class BookingService {
    /**
     * Check if a date is within the allowed booking window (1 month)
     * @param {Date} date - The date to check
     * @returns {boolean} - Whether the date is within the allowed window
     */
    isWithinBookingWindow(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const oneMonthLater = new Date(today);
        oneMonthLater.setMonth(today.getMonth() + 1); // One month from today
        oneMonthLater.setHours(23, 59, 59, 999); 
        
        return date >= today && date <= oneMonthLater;
    }

    /**
     * Format a date object to DD/MM/YYYY string
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Check if a date is available for an experience
     * @param {string} experienceId - The experience ID
     * @param {Date} date - Date to check
     * @returns {Promise<boolean>} - Whether the date is available
     */
    async isDateAvailable(experienceId, date) {
        try {
            const experienceRef = doc(db, "Experiencias", experienceId);
            const expSnapshot = await getDoc(experienceRef);
            
            if (!expSnapshot.exists()) {
                return false;
            }
            
            const expData = expSnapshot.data();
            
            // Check if dates are stored as specific dates (new format)
            if (expData.fechas && Array.isArray(expData.fechas)) {
                // Convert to date objects for comparison
                const datesToCheck = expData.fechas.map(dateStr => new Date(dateStr));
                
                // Check if any date matches the provided date (ignoring time)
                return datesToCheck.some(expDate => 
                    expDate.getFullYear() === date.getFullYear() &&
                    expDate.getMonth() === date.getMonth() &&
                    expDate.getDate() === date.getDate()
                );
            }
            
            // Legacy support - check by day of week
            if (expData.fechas && Array.isArray(expData.fechas)) {
                const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                const dayName = dayNames[date.getDay()];
                
                // Check if this day is in the available days
                return expData.fechas.some(day => 
                    day.toLowerCase() === dayName.toLowerCase() || 
                    day.toLowerCase().startsWith(dayName.toLowerCase().substring(0, 3))
                );
            }
            
            return false;
        } catch (error) {
            console.error("Error checking date availability:", error);
            return false;
        }
    }

    /**
     * Get available slots for a specific experience, date and time
     * @param {string} experienceId - The experience ID
     * @param {Date} date - The selected date
     * @param {string} time - The selected time slot (optional)
     * @returns {Promise<Object>} - Available slots and reservations info
     */
    async getAvailableSlots(experienceId, date, time = null) {
        try {
            // Validate the date is within booking window
            if (!this.isWithinBookingWindow(date)) {
                return {
                    availableSlots: 0,
                    error: "Las reservas solo están disponibles hasta 1 mes en el futuro"
                };
            }
            
            // Check if the date is available for this experience
            const isAvailable = await this.isDateAvailable(experienceId, date);
            if (!isAvailable) {
                return {
                    availableSlots: 0,
                    error: "Esta fecha no está disponible para esta experiencia"
                };
            }

            // Get the experience document
            const experienceRef = doc(db, "Experiencias", experienceId);
            const expSnapshot = await getDoc(experienceRef);
            
            if (!expSnapshot.exists()) {
                return { 
                    availableSlots: 0, 
                    error: "Experiencia no encontrada" 
                };
            }
            
            const expData = expSnapshot.data();
            const maxCapacity = expData.maximoUsuarios || 0;
            const formattedDate = this.formatDate(date);
            
            // Check for existing reservations for this date
            const existingReservations = expData.reservas || {};
            const dateReservations = existingReservations[formattedDate] || {};
            
            // If a specific time slot is requested
            if (time) {
                const timeSlotBookings = dateReservations[time] || [];
                const peopleBooked = timeSlotBookings.reduce((total, booking) => 
                    total + booking.people, 0);
                
                return {
                    availableSlots: Math.max(0, maxCapacity - peopleBooked),
                    reservationsForTime: peopleBooked,
                    reservationsForDate: Object.values(dateReservations)
                        .flat()
                        .reduce((total, booking) => total + booking.people, 0),
                    maxCapacity
                };
            }
            
            // Return info for all time slots on this date
            const totalPeopleForDate = Object.values(dateReservations)
                .flat()
                .reduce((total, booking) => total + booking.people, 0);
                
            return {
                availableSlots: Math.max(0, maxCapacity - totalPeopleForDate),
                reservationsForDate: totalPeopleForDate,
                timeSlots: dateReservations,
                maxCapacity
            };
        } catch (error) {
            console.error("Error getting available slots:", error);
            return { 
                availableSlots: 0, 
                error: "Error al verificar disponibilidad" 
            };
        }
    }

    /**
     * Create a new booking for an experience
     * @param {Object} bookingData - Booking details
     * @returns {Promise<Object>} - Result of the booking operation
     */
    async createBooking(bookingData) {
        try {
            const { 
                experienceId, 
                userId, 
                userEmail,
                userName,
                userLastName,
                selectedDate, 
                selectedTime, 
                selectedPeople,
                guides,
                paymentDetails
            } = bookingData;
    
            // Validate date is within booking window
            if (!this.isWithinBookingWindow(selectedDate)) {
                return {
                    success: false,
                    error: "Esta fecha está fuera del período de reserva permitido"
                };
            }
            
            // Check if the date is available for this experience
            const isAvailable = await this.isDateAvailable(experienceId, selectedDate);
            if (!isAvailable) {
                return {
                    success: false,
                    error: "Esta fecha no está disponible para esta experiencia"
                };
            }
    
            // Format date for storing in Firestore
            const formattedDate = this.formatDate(selectedDate);
            
            // Check availability
            const availability = await this.getAvailableSlots(
                experienceId, 
                selectedDate, 
                selectedTime
            );
            
            if (availability.error) {
                return { success: false, error: availability.error };
            }
            
            if (availability.availableSlots < selectedPeople) {
                return { 
                    success: false, 
                    error: `No hay suficientes cupos disponibles. Solo quedan ${availability.availableSlots} cupos.` 
                };
            }
    
            // Generate a unique code for this booking
            const experienceCode = this.generateExperienceCode();
            
            // Use a regular Date object instead of serverTimestamp() for arrays
            const currentTimestamp = new Date().toISOString();
            
            // Create the booking object
            const bookingRecord = {
                experienceId,
                selectedDay: formattedDate,
                selectedTime,
                selectedPeople,
                people: parseInt(selectedPeople, 10),
                status: "COMPLETED",
                timestamp: currentTimestamp, // Using ISO string instead of serverTimestamp
                experienceCode,
                user: {
                    id: userId,
                    email: userEmail,
                    name: userName,
                    lastName: userLastName
                },
                guides: guides || [],
                transactionId: paymentDetails?.id || null,
                paymentDetails: paymentDetails || null
            };
    
            // 1. Update the experience reservations
            const experienceRef = doc(db, "Experiencias", experienceId);
            const expSnapshot = await getDoc(experienceRef);
            
            if (expSnapshot.exists()) {
                const expData = expSnapshot.data();
                const reservas = expData.reservas || {};
                
                // Update structure with new booking
                if (!reservas[formattedDate]) {
                    reservas[formattedDate] = {};
                }
                
                if (!reservas[formattedDate][selectedTime]) {
                    reservas[formattedDate][selectedTime] = [];
                }
                
                reservas[formattedDate][selectedTime].push(bookingRecord);
                
                // Update the experience document
                await updateDoc(experienceRef, { 
                    reservas,
                    usuariosInscritos: increment(parseInt(selectedPeople, 10))
                });
            } else {
                return { success: false, error: "Experiencia no encontrada" };
            }
    
            // 2. Add to user's payment/bookings collection
            if (userEmail) {
                const userPaymentsRef = doc(db, "payments", userEmail);
                const userPaymentsSnap = await getDoc(userPaymentsRef);
                
                if (userPaymentsSnap.exists()) {
                    await updateDoc(userPaymentsRef, {
                        bookings: arrayUnion(bookingRecord)
                    });
                } else {
                    await setDoc(userPaymentsRef, {
                        bookings: [bookingRecord]
                    });
                }
            }
    
            return {
                success: true,
                bookingRecord,
                experienceCode
            };
        } catch (error) {
            console.error("Error creating booking:", error);
            return { 
                success: false, 
                error: "Error al crear la reserva. Por favor, intente de nuevo." 
            };
        }
    }

    /**
     * Generate a unique booking code
     * @returns {string} - Unique code for the booking
     */
    generateExperienceCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    /**
     * Get a user's bookings by email
     * @param {string} email - User email
     * @returns {Promise<Array>} - User's bookings
     */
    async getUserBookings(email) {
        try {
            if (!email) return [];
            
            const userBookingsRef = doc(db, "payments", email);
            const bookingsSnap = await getDoc(userBookingsRef);
            
            if (bookingsSnap.exists()) {
                const data = bookingsSnap.data();
                return data.bookings || [];
            }
            
            return [];
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            return [];
        }
    }

    /**
     * Verify a booking by code
     * @param {string} code - Booking verification code
     * @returns {Promise<Object>} - Booking details or error
     */
    async verifyBookingCode(code) {
        try {
            // Query payments collection for the booking code
            const paymentsRef = collection(db, "payments");
            const q = query(paymentsRef);
            const querySnapshot = await getDocs(q);
            
            let foundBooking = null;
            
            for (const docSnapshot of querySnapshot.docs) {
                const userData = docSnapshot.data();
                
                if (userData.bookings && Array.isArray(userData.bookings)) {
                    const booking = userData.bookings.find(b => b.experienceCode === code);
                    if (booking) {
                        foundBooking = {
                            ...booking,
                            userEmail: docSnapshot.id
                        };
                        break;
                    }
                }
            }
            
            if (foundBooking) {
                // Get experience details
                const expRef = doc(db, "Experiencias", foundBooking.experienceId);
                const expSnap = await getDoc(expRef);
                
                if (expSnap.exists()) {
                    return {
                        success: true,
                        booking: foundBooking,
                        experience: {
                            id: expSnap.id,
                            ...expSnap.data()
                        }
                    };
                } else {
                    return {
                        success: false,
                        error: "Experiencia no encontrada"
                    };
                }
            } else {
                return {
                    success: false,
                    error: "Código de reserva no válido"
                };
            }
        } catch (error) {
            console.error("Error verifying booking code:", error);
            return {
                success: false,
                error: "Error al verificar el código de reserva"
            };
        }
    }
}

// Export a singleton instance
export default new BookingService();