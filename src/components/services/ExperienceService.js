import { db } from '../../firebase-config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc 
} from 'firebase/firestore';
import storageService from '../../cloudinary-services/storage-service';

class ExperienceService {
  /**
   * Fetch all experiences with optional filtering
   * @param {Object} options - Filtering options
   * @returns {Promise<Array>} - Array of experiences
   */
  async getExperiences(options = {}) {
    try {
      const { status, limit, sortBy, sortDirection } = options;
      
      let experiencesRef = collection(db, "Experiencias");
      let q = experiencesRef;
      
      // Apply filters if provided
      if (status) {
        q = query(experiencesRef, where("status", "==", status));
      }
      
      const experiencesSnapshot = await getDocs(q);
      const experiencesList = [];

      for (const docSnapshot of experiencesSnapshot.docs) {
        const data = docSnapshot.data();
        
        // Get image URL
        let imageUrl = '';
        try {
          if (data.imageUrl) {
            imageUrl = await storageService.getDownloadURL(data.imageUrl);
          } else {
            imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
          }
        } catch (imageError) {
          console.error("Error getting image URL:", imageError);
          imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
        }

        // Fetch reviews
        let reviews = [];
        try {
          const reviewsRef = collection(db, "Experiencias", docSnapshot.id, "reviews");
          const reviewsSnapshot = await getDocs(reviewsRef);
          reviewsSnapshot.forEach((reviewDoc) => {
            reviews.push({ id: reviewDoc.id, ...reviewDoc.data() });
          });
        } catch (subcollectionError) {
          // Fallback to reviews array field
          if (Array.isArray(data.reviews)) {
            reviews = data.reviews.map((review, index) => ({
              id: `review-${index}`,
              ...review,
            }));
          }
        }

        // Process dates - either specific dates or days of week
        let days = '';
        if (data.fechas) {
          if (Array.isArray(data.fechas)) {
            if (data.fechas.length > 0 && typeof data.fechas[0] === 'string' && data.fechas[0].includes('-')) {
              // These are specific dates in ISO format - convert to day names for display
              // But keep the actual dates for validation
              const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
              
              // Get unique day names represented in the dates
              const daysSet = new Set();
              data.fechas.forEach(dateStr => {
                const date = new Date(dateStr);
                daysSet.add(dayNames[date.getDay()]);
              });
              
              days = Array.from(daysSet).join(', ');
            } else {
              // Legacy: These are day names
              days = data.fechas.join(', ');
            }
          }
        }

        // Format the experience data
        const experience = {
          id: docSnapshot.id,
          name: data.nombre || 'Sin nombre',
          description: data.descripcion || 'Sin descripción',
          difficulty: data.dificultad || 0,
          price: data.precio || 0,
          distance: `${data.longitudRecorrido || 0} km`,
          duracion: data.duracionRecorrido || 0,
          time: `${data.horarioInicio || '--:--'} - ${data.horarioFin || '--:--'}`,
          days: days,
          maxPeople: data.maximoUsuarios || 0,
          minPeople: data.minimoUsuarios || 0,
          availableSlots: data.cuposDisponibles || 0,
          imageUrl: imageUrl,
          rating: data.puntuacion || 0,
          registeredUsers: data.usuariosInscritos || 0,
          incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
          puntoDeSalida: data.puntoSalida || '',
          reviews: reviews,
          rawData: data
        };

        experiencesList.push(experience);
      }

      return experiencesList;
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw new Error("No se pudieron cargar las experiencias");
    }
  }

  /**
   * Get a single experience by ID
   * @param {string} id - Experience ID
   * @returns {Promise<Object>} - Experience data
   */
  async getExperienceById(id) {
    try {
      const experienceRef = doc(db, "Experiencias", id);
      const experienceSnap = await getDoc(experienceRef);
      
      if (!experienceSnap.exists()) {
        throw new Error("Experiencia no encontrada");
      }
      
      const data = experienceSnap.data();
      
      // Get image URL
      let imageUrl = '';
      try {
        if (data.imageUrl) {
          imageUrl = await storageService.getDownloadURL(data.imageUrl);
        } else {
          imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
        }
      } catch (imageError) {
        console.error("Error getting image URL:", imageError);
        imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
      }
      
      // Fetch reviews
      let reviews = [];
      try {
        const reviewsRef = collection(db, "Experiencias", id, "reviews");
        const reviewsSnapshot = await getDocs(reviewsRef);
        reviewsSnapshot.forEach((reviewDoc) => {
          reviews.push({ id: reviewDoc.id, ...reviewDoc.data() });
        });
      } catch (subcollectionError) {
        // Fallback to reviews array field
        if (Array.isArray(data.reviews)) {
          reviews = data.reviews.map((review, index) => ({
            id: `review-${index}`,
            ...review,
          }));
        }
      }
      
      // Process dates - either specific dates or days of week
      let days = '';
      if (data.fechas) {
        if (Array.isArray(data.fechas)) {
          if (data.fechas.length > 0 && typeof data.fechas[0] === 'string' && data.fechas[0].includes('-')) {
            // These are specific dates in ISO format - convert to day names for display
            // But keep the actual dates for validation
            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            
            // Get unique day names represented in the dates
            const daysSet = new Set();
            data.fechas.forEach(dateStr => {
              const date = new Date(dateStr);
              daysSet.add(dayNames[date.getDay()]);
            });
            
            days = Array.from(daysSet).join(', ');
          } else {
            // Legacy: These are day names
            days = data.fechas.join(', ');
          }
        }
      }
      
      // Get guides data
      const guides = [];
      if (data.guias && Array.isArray(data.guias)) {
        for (const guideRef of data.guias) {
          if (guideRef && guideRef.email) {
            try {
              const usersRef = collection(db, "lista-de-usuarios");
              const q = query(usersRef, where("email", "==", guideRef.email));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                const guideDoc = querySnapshot.docs[0];
                const guideData = guideDoc.data();
                
                // Get guide image
                let guideImageUrl = '';
                if (guideData["Foto de Perfil"]) {
                  try {
                    guideImageUrl = await storageService.getDownloadURL(guideData["Foto de Perfil"]);
                  } catch (error) {
                    guideImageUrl = '../../src/assets/images/AdminLandingPage/profile_blank.webp';
                  }
                } else {
                  guideImageUrl = '../../src/assets/images/AdminLandingPage/profile_blank.webp';
                }
                
                guides.push({
                  id: guideDoc.id,
                  name: guideData.name || 'Sin nombre',
                  lastName: guideData.lastName || '',
                  image: guideImageUrl,
                  email: guideRef.email,
                });
              }
            } catch (error) {
              console.error("Error fetching guide data:", error);
            }
          }
        }
      }

      // Format the experience data
      return {
        id: experienceSnap.id,
        name: data.nombre || 'Sin nombre',
        description: data.descripcion || 'Sin descripción',
        difficulty: data.dificultad || 0,
        price: data.precio || 0,
        distance: `${data.longitudRecorrido || 0} km`,
        duracion: data.duracionRecorrido || 0,
        time: `${data.horarioInicio || '--:--'} - ${data.horarioFin || '--:--'}`,
        days: days,
        maxPeople: data.maximoUsuarios || 0,
        minPeople: data.minimoUsuarios || 0,
        availableSlots: data.cuposDisponibles || 0,
        imageUrl: imageUrl,
        rating: data.puntuacion || 0,
        registeredUsers: data.usuariosInscritos || 0,
        incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
        puntoDeSalida: data.puntoSalida || '',
        guides: guides,
        reviews: reviews,
        rawData: data
      };
    } catch (error) {
      console.error("Error fetching experience:", error);
      throw new Error(error.message || "Error al obtener la experiencia");
    }
  }

  /**
   * Calculate available time slots for an experience
   * @param {Object} experience - Experience data
   * @returns {Array} - Array of available time slots
   */
  calculateTimeSlots(experience) {
    if (!experience) return [];
    
    const generateTimeSlots = (startTime, endTime, durationMinutes) => {
      if (!startTime || !endTime || !durationMinutes) {
        console.warn("Missing time data:", { startTime, endTime, durationMinutes });
        return [];
      }

      try {
        const slots = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
          console.warn("Invalid time format:", { startTime, endTime });
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
      
    return generateTimeSlots(startTime, endTime, duration);
  }

  /**
   * Check if a specific date is available for an experience
   * @param {Object} experience - Experience data
   * @param {Date} date - Date to check
   * @returns {boolean} - Whether the date is available
   */
  isDateAvailable(experience, date) {
    if (!experience || !date) return false;
    
    // Check if experience has specific dates in the new format
    if (experience.rawData && experience.rawData.fechas && 
        Array.isArray(experience.rawData.fechas) &&
        experience.rawData.fechas.length > 0 && 
        typeof experience.rawData.fechas[0] === 'string' && 
        experience.rawData.fechas[0].includes('-')) {
        
      // Convert to date objects for proper comparison
      return experience.rawData.fechas.some(dateStr => {
        const expDate = new Date(dateStr);
        return (
          expDate.getFullYear() === date.getFullYear() &&
          expDate.getMonth() === date.getMonth() &&
          expDate.getDate() === date.getDate()
        );
      });
    }
    
    // Legacy support: Check if the day of week is available
    if (experience.days) {
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = dayNames[date.getDay()];
      
      const days = Array.isArray(experience.days) 
        ? experience.days 
        : experience.days.split(', ');
      
      const lowercaseDayName = dayName.toLowerCase();
      
      return days.some(day => 
        day.toLowerCase() === lowercaseDayName || 
        day.toLowerCase().startsWith(lowercaseDayName.substring(0, 3))
      );
    }
    
    return false;
  }
  
  /**
   * Update an experience's reviews
   * @param {string} experienceId - Experience ID
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} - Updated review data
   */
  async addReview(experienceId, reviewData) {
    try {
      // Add review to subcollection
      const reviewsRef = collection(db, "Experiencias", experienceId, "reviews");
      
      // First, update the average rating for the experience
      const experienceRef = doc(db, "Experiencias", experienceId);
      const experienceSnap = await getDoc(experienceRef);
      
      if (experienceSnap.exists()) {
        const expData = experienceSnap.data();
        const currentRating = expData.puntuacion || 0;
        const totalReviews = expData.totalReviews || 0;
        
        // Calculate new average rating
        const newTotalReviews = totalReviews + 1;
        const newRating = (currentRating * totalReviews + reviewData.rating) / newTotalReviews;
        
        // Update experience with new rating and review count
        await updateDoc(experienceRef, {
          puntuacion: newRating,
          totalReviews: newTotalReviews
        });
      }
      
      return reviewData;
    } catch (error) {
      console.error("Error adding review:", error);
      throw new Error("Error al agregar la reseña");
    }
  }
}

// Export a singleton instance
export default new ExperienceService();