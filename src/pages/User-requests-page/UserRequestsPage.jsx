import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserRequestsPage.css';
import LoadingState from '../../components/common/LoadingState/LoadingState';

// Firestore imports
import { db } from '../../firebase-config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// Auth context
import { useAuth } from '../../components/contexts/AuthContext';

// LazyImage component for profile pictures
import LazyImage from '../../components/common/LazyImage/LazyImage';

// Error boundary
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';

/**
 * UserRequestsPage Component - Shows all user requests (guide applications and experience requests)
 * Accessible to all users but displays different content based on user role
 */
const UserRequestsPage = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [guideApplication, setGuideApplication] = useState(null);
  const [experienceRequests, setExperienceRequests] = useState([]);
  const [loadingGuideApp, setLoadingGuideApp] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's guide application if they are logged in
  useEffect(() => {
    const fetchGuideApplication = async () => {
      if (!currentUser) {
        setLoadingGuideApp(false);
        return;
      }

      try {
        setLoadingGuideApp(true);
        
        // Check if user has a guide application
        const applicationRef = doc(db, "solicitudes-guias", currentUser.email);
        const applicationDoc = await getDoc(applicationRef);
        
        if (applicationDoc.exists()) {
          setGuideApplication({
            id: applicationDoc.id,
            ...applicationDoc.data(),
            status: 'pending' // Default status for applications in this collection
          });
        } else {
          setGuideApplication(null);
        }
      } catch (error) {
        console.error("Error fetching guide application:", error);
        setError("Error al cargar la solicitud de guía. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoadingGuideApp(false);
        
        // If user is a guide, fetch their experience requests
        if (userRole === 'guia' || userRole === 'admin') {
          fetchExperienceRequests();
        }
      }
    };

    fetchGuideApplication();
  }, [currentUser, userRole]);

  // Fetch user's experience requests if they are a guide
  const fetchExperienceRequests = async () => {
    if (!currentUser) return;
    
    try {
      setLoadingExperiences(true);
      
      // Query experiences created by this user
      const experiencesQuery = query(
        collection(db, "Experiencias"), 
        where("createdBy", "==", currentUser.email)
      );
      
      const querySnapshot = await getDocs(experiencesQuery);
      const experiences = [];
      
      querySnapshot.forEach((doc) => {
        experiences.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setExperienceRequests(experiences);
    } catch (error) {
      console.error("Error fetching experience requests:", error);
      setError("Error al cargar las solicitudes de experiencias. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoadingExperiences(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return the original string if it can't be parsed
    }
  };

  // Determine badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge-pending';
      case 'accepted':
        return 'status-badge-accepted';
      case 'rejected':
        return 'status-badge-rejected';
      default:
        return 'status-badge-pending';
    }
  };

  // If user is not logged in, prompt them to log in
  if (!currentUser) {
    return (
      <div className="user-requests-container">
        <div className="requests-login-prompt">
          <h1>Mis Solicitudes</h1>
          <p>Inicia sesión para ver tus solicitudes</p>
          <div className="login-buttons">
            <button 
              className="login-button" 
              onClick={() => navigate('/login-page')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="signup-button" 
              onClick={() => navigate('/signUpPage')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="user-requests-container">
        <h1 className="user-requests-title">Mis Solicitudes</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* Guide Application Section */}
        <section className="requests-section">
          <h2 className="section-title">Solicitud para ser Guía</h2>
          
          {loadingGuideApp ? (
            <LoadingState text='Cargando datos...'/>
          ) : (
            <>
              {guideApplication ? (
                <div className="guide-application-card">
                  <div className="guide-application-header">
                    <div className="guide-info">
                      {guideApplication.image && (
                        <div className="guide-image-container">
                          <LazyImage
                            src={guideApplication.image}
                            alt={guideApplication.fullName}
                            className="guide-image"
                          />
                        </div>
                      )}
                      <div>
                        <h3>{guideApplication.fullName}</h3>
                        <p className="guide-email">{guideApplication.email}</p>
                      </div>
                    </div>
                    <div className={`status-badge ${getStatusBadgeClass(guideApplication.status)}`}>
                      {guideApplication.status === 'pending' && 'Pendiente'}
                      {guideApplication.status === 'accepted' && 'Aprobado'}
                      {guideApplication.status === 'rejected' && 'Rechazado'}
                    </div>
                  </div>
                  
                  <div className="guide-application-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Cédula:</span>
                        <span className="detail-value">{guideApplication.cedula}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{guideApplication.phone}</span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Fecha de Nacimiento:</span>
                        <span className="detail-value">{guideApplication.birthDate}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Idiomas:</span>
                        <span className="detail-value">{guideApplication.languages}</span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-label">Disponibilidad:</span>
                        <span className="detail-value">{guideApplication.weeklyHours} horas, {guideApplication.weeklyDays} días por semana</span>
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Dirección</h4>
                      <p>{guideApplication.address}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Experiencia</h4>
                      <p>{guideApplication.experience}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Cualificaciones</h4>
                      <p>{guideApplication.qualifications}</p>
                    </div>
                  </div>
                  
                  <div className="application-status-info">
                    <p>
                      {guideApplication.status === 'pending' && 
                        'Tu solicitud está siendo revisada por los administradores. Te notificaremos cuando haya una actualización.'}
                      {guideApplication.status === 'accepted' && 
                        '¡Felicidades! Tu solicitud ha sido aceptada. Ya puedes comenzar a crear experiencias.'}
                      {guideApplication.status === 'rejected' && guideApplication.feedback && 
                        <>Lamentablemente, tu solicitud fue rechazada. Motivo: {guideApplication.feedback}</>}
                      {guideApplication.status === 'rejected' && !guideApplication.feedback && 
                        'Lamentablemente, tu solicitud fue rechazada. Puedes intentarlo de nuevo más adelante.'}
                    </p>
                  </div>
                </div>
              ) : (
                userRole === 'guia' ? (
                  <div className="already-guide-message">
                    <p>¡Ya eres guía! Puedes comenzar a crear experiencias.</p>
                  </div>
                ) : (
                  <div className="no-application-message">
                    <p>No has enviado una solicitud para ser guía todavía.</p>
                    <p>¿Te gustaría compartir tus conocimientos y guiar a otros aventureros?</p>
                    <Link to="/guide-request" className="apply-guide-button">
                      Solicitar ser Guía
                    </Link>
                  </div>
                )
              )}
            </>
          )}
        </section>
        
        {/* Experience Requests Section */}
        <section className="requests-section">
          <h2 className="section-title">Solicitudes de Experiencias</h2>
          
          {userRole === 'guia' || userRole === 'admin' ? (
            <>
              {loadingExperiences ? (
                <LoadingState text='Cargando datos...'/>
              ) : (
                <>
                  {experienceRequests.length > 0 ? (
                    <div className="experience-requests-list">
                      {experienceRequests.map((experience) => (
                        <div key={experience.id} className="experience-request-card">
                          <div className="experience-header">
                            <div className="experience-info">
                              {experience.imageUrl && (
                                <div className="experience-image-container">
                                  <LazyImage
                                    src={experience.imageUrl}
                                    alt={experience.nombre}
                                    className="experience-image"
                                  />
                                </div>
                              )}
                              <div>
                                <h3>{experience.nombre}</h3>
                                <p className="experience-date">
                                  Creada: {formatDate(experience.fechaCreacion)}
                                </p>
                              </div>
                            </div>
                            <div className={`status-badge ${getStatusBadgeClass(experience.status)}`}>
                              {experience.status === 'pending' && 'Pendiente'}
                              {experience.status === 'accepted' && 'Aprobada'}
                              {experience.status === 'rejected' && 'Rechazada'}
                            </div>
                          </div>
                          
                          <div className="experience-details">
                            <div className="detail-row">
                              <div className="detail-item">
                                <span className="detail-label">Precio:</span>
                                <span className="detail-value">${experience.precio}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Tipo:</span>
                                <span className="detail-value">{experience.tipoActividad}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Dificultad:</span>
                                <span className="detail-value">{experience.dificultad} / 5</span>
                              </div>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Descripción</h4>
                              <p>{experience.descripcion}</p>
                            </div>
                            
                            {experience.status === 'rejected' && experience.feedback && (
                              <div className="feedback-section">
                                <h4>Feedback del Administrador</h4>
                                <p>{experience.feedback}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="experience-actions">
                            <Link 
                              to="/crear-experiencia" 
                              className="action-button"
                            >
                              Crear Nueva Experiencia
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-experiences-message">
                      <p>Aún no has creado ninguna solicitud de experiencia.</p>
                      <Link to="/crear-experiencia" className="create-experience-button">
                        Crear Experiencia
                      </Link>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="not-guide-message">
              <p>
                Solo los guías pueden solicitar la creación de experiencias. 
                ¡Conviértete en uno para comenzar a crear!
              </p>
              <Link to="/guide-request" className="apply-guide-button">
                Solicitar ser Guía
              </Link>
            </div>
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default UserRequestsPage;