import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Custom hook to fetch and manage user profile data
 * @returns {Object} User profile data and state
 */
export const useFetchUserData = () => {
  // State management
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    numeroTelefonico: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [activities, setActivities] = useState([]);
  const [activitiesPerformed, setActivitiesPerformed] = useState([]);
  const [mostPerformedActivity, setMostPerformedActivity] = useState({ Actividad: '', timesPerformed: 0 });
  const [activitiesCreatedCount, setActivitiesCreatedCount] = useState(0);

  // Hooks
  const { currentUser, logout, firestoreUserData } = useAuth();
  const navigate = useNavigate();

  // Effect to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        navigate('/login-page');
        return;
      }

      try {
        // If we already have Firestore data in the context, use it
        if (firestoreUserData) {
          // Set form data from Firestore user data
          setFormData({
            nombreCompleto: `${firestoreUserData.name || ''} ${firestoreUserData.lastName || ''}`.trim(),
            correoElectronico: firestoreUserData.email || '',
            numeroTelefonico: firestoreUserData.phone || ''
          });

          setTipoUsuario(firestoreUserData.userType || '');
          setFotoPerfilUrl(firestoreUserData['Foto de Perfil'] || currentUser.photoURL || '');

          // Properly handle activitiesPerformed
          if (Array.isArray(firestoreUserData.activitiesPerformed)) {
            setActivitiesPerformed(firestoreUserData.activitiesPerformed);
          } else if (firestoreUserData.activitiesPerformed) {
            setActivitiesPerformed([firestoreUserData.activitiesPerformed]);
          } else {
            setActivitiesPerformed([]);
          }

          // Properly handle mostPerformedActivity
          if (firestoreUserData.mostPerformedActivity && 
              typeof firestoreUserData.mostPerformedActivity === 'object') {
            // Ensure the object has the expected properties
            const activity = {
              Actividad: firestoreUserData.mostPerformedActivity.Actividad || '',
              timesPerformed: firestoreUserData.mostPerformedActivity.timesPerformed || 0
            };
            setMostPerformedActivity(activity);
          } else {
            setMostPerformedActivity({ Actividad: '', timesPerformed: 0 });
          }

          // Process activities for guides
          let fetchedActivities = [];
          if (firestoreUserData.userType === 'Guia') {
            if (firestoreUserData.actualRoute && firestoreUserData.days && firestoreUserData.schedule) {
              if (Array.isArray(firestoreUserData.actualRoute) && 
                  Array.isArray(firestoreUserData.days) && 
                  Array.isArray(firestoreUserData.schedule) &&
                  firestoreUserData.actualRoute.length === firestoreUserData.days.length && 
                  firestoreUserData.days.length === firestoreUserData.schedule.length) {
                for (let i = 0; i < firestoreUserData.actualRoute.length; i++) {
                  fetchedActivities.push({
                    route: firestoreUserData.actualRoute[i],
                    days: firestoreUserData.days[i],
                    schedule: firestoreUserData.schedule[i],
                  });
                }
              }
            }
          }
          setActivities(fetchedActivities);

          // Set activities created count
          if (firestoreUserData.activitiesCreated && Array.isArray(firestoreUserData.activitiesCreated)) {
            setActivitiesCreatedCount(firestoreUserData.activitiesCreated.length);
          } else {
            setActivitiesCreatedCount(0);
          }

          // Get registration date from metadata
          if (currentUser.metadata && currentUser.metadata.creationTime) {
            setFechaRegistro(formatDate(currentUser.metadata.creationTime));
          } else {
            setFechaRegistro('No disponible');
          }
        } else {
          // Otherwise, query Firestore directly
          const usersCollection = collection(db, 'lista-de-usuarios');
          const q = query(usersCollection, where("email", "==", currentUser.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.error('Usuario no encontrado en Firestore.');
            setLoading(false);
            await logout();
            navigate('/login-page');
            return;
          }

          const userDoc = querySnapshot.docs[0];
          if (!userDoc.exists()) {
            console.error('El documento del usuario no existe en Firestore.');
            setLoading(false);
            await logout();
            navigate('/login-page');
            return;
          }

          const userData = userDoc.data();

          // Update form data
          setFormData({
            nombreCompleto: `${userData.name || ''} ${userData.lastName || ''}`.trim(),
            correoElectronico: userData.email || '',
            numeroTelefonico: userData.phone || ''
          });

          setTipoUsuario(userData.userType || '');

          if (currentUser.metadata && currentUser.metadata.creationTime) {
            setFechaRegistro(formatDate(currentUser.metadata.creationTime));
          } else {
            setFechaRegistro('No disponible');
          }

          // Set photo URL from Firestore
          setFotoPerfilUrl(userData['Foto de Perfil'] || currentUser.photoURL || '');

          // Properly handle activitiesPerformed
          if (Array.isArray(userData.activitiesPerformed)) {
            setActivitiesPerformed(userData.activitiesPerformed);
          } else if (userData.activitiesPerformed) {
            setActivitiesPerformed([userData.activitiesPerformed]);
          } else {
            setActivitiesPerformed([]);
          }

          // Properly handle mostPerformedActivity
          if (userData.mostPerformedActivity && 
              typeof userData.mostPerformedActivity === 'object') {
            // Ensure the object has the expected properties
            const activity = {
              Actividad: userData.mostPerformedActivity.Actividad || '',
              timesPerformed: userData.mostPerformedActivity.timesPerformed || 0
            };
            setMostPerformedActivity(activity);
          } else {
            setMostPerformedActivity({ Actividad: '', timesPerformed: 0 });
          }

          // Process activities for guides
          let fetchedActivities = [];
          if (userData.userType === 'Guia') {
            if (userData.actualRoute && userData.days && userData.schedule) {
              if (Array.isArray(userData.actualRoute) && Array.isArray(userData.days) && Array.isArray(userData.schedule)
                && userData.actualRoute.length === userData.days.length && userData.days.length === userData.schedule.length) {
                for (let i = 0; i < userData.actualRoute.length; i++) {
                  fetchedActivities.push({
                    route: userData.actualRoute[i],
                    days: userData.days[i],
                    schedule: userData.schedule[i],
                  });
                }
              } else {
                console.error("actualRoute, days and schedule are not arrays of the same length or are not arrays");
              }
            }
          }
          setActivities(fetchedActivities);

          // Set activities created count
          if (userData.activitiesCreated && Array.isArray(userData.activitiesCreated)) {
            setActivitiesCreatedCount(userData.activitiesCreated.length);
          } else {
            setActivitiesCreatedCount(0);
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate, logout, firestoreUserData]);

  /**
   * Format a date string to Spanish locale format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} de ${month} del ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'No disponible';
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    setError,
    tipoUsuario,
    fechaRegistro,
    fotoPerfilUrl,
    setFotoPerfilUrl,
    activities,
    activitiesPerformed,
    mostPerformedActivity,
    activitiesCreatedCount
  };
};

export default useFetchUserData;