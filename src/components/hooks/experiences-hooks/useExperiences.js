import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import storageService from '../../../cloudinary-services/storage-service';

/**
 * Custom hook for fetching and managing experiences data
 * @returns {Object} Experiences data and state
 */
export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const experiencesCollection = collection(db, "Experiencias");
        const experiencesSnapshot = await getDocs(experiencesCollection);
        const experiencesList = [];
        
        for (const doc of experiencesSnapshot.docs) {
          try {
            const data = doc.data();
            
            // Get image URL safely
            let imageUrl = '';
            try {
              if (data.imageUrl) {
                // Use storageService to get URL
                imageUrl = storageService.getDownloadURL(data.imageUrl);
              } else {
                // Default image if none specified
                imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
              }
            } catch (imageError) {
              console.error("Error getting image URL:", imageError);
              imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
            }
            
            // Format the experience data
            const experience = {
              id: doc.id,
              name: data.nombre || 'Sin nombre',
              description: data.descripcion || 'Sin descripción',
              difficulty: data.dificultad || 0,
              price: data.precio || 0,
              distance: (data.longitudRecorrido || 0) + " km",
              duracion: data.duracionRecorrido || 0,
              time: (data.horarioInicio || '--:--') + " - " + (data.horarioFin || '--:--'),
              days: Array.isArray(data.fechas) ? data.fechas.join(', ') : '',
              maxPeople: data.maximoUsuarios || 0,
              minPeople: data.minimoUsuarios || 0,
              availableSlots: data.cuposDisponibles || 0,
              imageUrl: imageUrl,
              rating: data.puntuacion || 0,
              registeredUsers: data.usuariosInscritos || 0,
              incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
              puntoDeSalida: data.puntoSalida || '',
              // Include all original data for detailed views
              rawData: data
            };
            
            experiencesList.push(experience);
          } catch (docError) {
            console.error("Error processing experience document:", docError, doc.id);
            // Continue with next document instead of failing completely
          }
        }
        
        setExperiences(experiencesList);
      } catch (fetchError) {
        console.error("Error fetching experiences:", fetchError);
        setError("No se pudieron cargar las experiencias. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);
  
  /**
   * Get a single experience by ID
   * @param {string} id - Experience ID to find
   * @returns {Object|null} - Found experience or null
   */
  const getExperienceById = (id) => {
    return experiences.find(exp => exp.id === id) || null;
  };
  
  /**
   * Filter experiences by criteria
   * @param {Function} filterFn - Filter function that takes an experience and returns boolean
   * @returns {Array} - Filtered experiences
   */
  const filterExperiences = (filterFn) => {
    return experiences.filter(filterFn);
  };
  
  return {
    experiences,
    loading,
    error,
    getExperienceById,
    filterExperiences
  };
};