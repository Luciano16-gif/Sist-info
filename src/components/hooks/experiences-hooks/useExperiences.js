import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import storageService from '../../../cloudinary-services/storage-service';

/**
 * Custom hook for fetching and managing experiences data with real-time updates
 * @returns {Object} Experiences data and state
 */
export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Create a query for the experiences collection
      const experiencesCollection = collection(db, "Experiencias");
      
      // Set up a real-time listener for experiences
      const unsubscribe = onSnapshot(experiencesCollection, async (snapshot) => {
        try {
          const experiencesList = [];
          
          // Process each experience document
          for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            
            // Get image URL safely
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
            
            // Format the experience data
            const experience = {
              id: docSnapshot.id,
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
              rating: data.puntuacion || 0, // Direct from Firestore, always updated
              totalReviews: data.totalReviews || 0,
              registeredUsers: data.usuariosInscritos || 0,
              incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
              puntoDeSalida: data.puntoSalida || '',
              rawData: data
            };
            
            experiencesList.push(experience);
          }
          
          setExperiences(experiencesList);
          setLoading(false);
        } catch (processingError) {
          console.error("Error processing experiences:", processingError);
          setError("Error al procesar los datos de experiencias.");
          setLoading(false);
        }
      }, (snapshotError) => {
        console.error("Error in snapshot listener:", snapshotError);
        setError("Error al obtener actualizaciones en tiempo real.");
        setLoading(false);
      });
      
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (setupError) {
      console.error("Error setting up experiences listener:", setupError);
      setError("No se pudo configurar el listener para experiencias.");
      setLoading(false);
    }
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