import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Custom hook to fetch experience metrics for admin dashboard
 * @returns {Object} Experience metrics
 */
export const useExperienceMetrics = () => {
  const [metrics, setMetrics] = useState({
    excursionesDisponibles: 0,
    excursionesSinInscripciones: 0,
    promedioParticipantes: 0,
    rutasAnadidasUltimoMes: 0,
    excursionesRechazadas: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get all experiences
        const experiencesCollection = collection(db, "Experiencias");
        const experiencesSnapshot = await getDocs(experiencesCollection);
        
        // Current date for calculating "last month"
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        
        // Initialize counters
        let disponibles = 0;
        let sinInscripciones = 0;
        let totalParticipantes = 0;
        let totalExcursiones = 0;
        let anadidosUltimoMes = 0;
        let rechazadas = 0;
        
        // Process each experience
        experiencesSnapshot.forEach((doc) => {
          const experience = { id: doc.id, ...doc.data() };
          
          // Count by status
          if (experience.status === 'accepted') {
            disponibles++;
            totalExcursiones++;
            
            // Count experiences with no registrations
            if (!experience.usuariosInscritos || experience.usuariosInscritos === 0) {
              sinInscripciones++;
            }
            
            // Add to total participants
            totalParticipantes += experience.usuariosInscritos || 0;
            
            // Check if added in the last month
            if (experience.fechaCreacion) {
              const createDate = new Date(experience.fechaCreacion);
              if (createDate >= oneMonthAgo) {
                anadidosUltimoMes++;
              }
            }
          } else if (experience.status === 'rejected') {
            rechazadas++;
          }
        });
        
        // Calculate average participants per month
        const avgParticipantes = totalExcursiones > 0 
          ? Math.round(totalParticipantes / totalExcursiones) 
          : 0;
        
        // Update state with calculated metrics
        setMetrics({
          excursionesDisponibles: disponibles,
          excursionesSinInscripciones: sinInscripciones,
          promedioParticipantes: avgParticipantes,
          rutasAnadidasUltimoMes: anadidosUltimoMes,
          excursionesRechazadas: rechazadas,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching experience metrics:", error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: "Error al cargar métricas de experiencias"
        }));
      }
    };

    fetchMetrics();
  }, []);

  return metrics;
};

export default useExperienceMetrics;