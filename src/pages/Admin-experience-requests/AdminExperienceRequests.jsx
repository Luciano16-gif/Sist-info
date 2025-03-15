// src/pages/Admin-experience-requests/AdminExperienceRequests.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminExperienceRequests.css';

// Auth Context
import { useAuth } from '../../components/contexts/AuthContext';

// Experience Form Service
import experienceFormService from '../../components/services/experienceFormService';

/**
 * AdminExperienceRequests component - Allows admins to review, approve, or reject
 * experience requests created by guides
 */
const AdminExperienceRequests = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [currentExperience, setCurrentExperience] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Check if user is admin and fetch experiences
  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }
        
        // Check role directly from context
        if (userRole === 'admin') {
          fetchPendingExperiences();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setError("Error al verificar permisos de administrador.");
        setLoading(false);
      }
    };
    
    if (userRole !== null) {
      checkAccessAndFetchData();
    }
  }, [currentUser, userRole]);
  
  // Fetch pending experiences
  const fetchPendingExperiences = async () => {
    try {
      setLoading(true);
      const pendingExperiences = await experienceFormService.fetchPendingExperiences();
      setPendingExperiences(pendingExperiences);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending experiences:", error);
      setError("Error al obtener solicitudes pendientes.");
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle approve experience
  const handleApprove = async (experienceId) => {
    try {
      await experienceFormService.updateExperienceStatus(experienceId, 'accepted');
      
      // Update UI
      setPendingExperiences(pendingExperiences.filter(exp => exp.id !== experienceId));
      
      // Show notification
      setNotification({
        show: true,
        message: 'Experiencia aprobada exitosamente',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error("Error approving experience:", error);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Error al aprobar la experiencia',
        type: 'error'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };
  
  // Open reject modal
  const openRejectModal = (experience) => {
    setCurrentExperience(experience);
    setRejectFeedback('');
    setShowRejectModal(true);
  };
  
  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setCurrentExperience(null);
    setRejectFeedback('');
  };
  
  // Handle reject experience
  const handleReject = async () => {
    if (!currentExperience) return;
    
    try {
      await experienceFormService.updateExperienceStatus(
        currentExperience.id, 
        'rejected', 
        rejectFeedback
      );
      
      // Update UI
      setPendingExperiences(pendingExperiences.filter(exp => exp.id !== currentExperience.id));
      
      // Close modal
      closeRejectModal();
      
      // Show notification
      setNotification({
        show: true,
        message: 'Experiencia rechazada exitosamente',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error("Error rejecting experience:", error);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Error al rechazar la experiencia',
        type: 'error'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };
  
  // Handle view details
  const handleViewDetails = (experience) => {
    navigate('/booking', { state: { experience, isAdmin: true } });
  };
  
  // If not admin, show unauthorized message
  if (!loading && userRole !== 'admin') {
    return (
      <div className="admin-experience-requests-container">
        <div className="unauthorized-message">
          <h1 className="admin-experience-requests-title">Acceso No Autorizado</h1>
          <p>Solo los administradores pueden acceder a esta página.</p>
          <button className="back-button" onClick={() => navigate('/')}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-experience-requests-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <h1 className="admin-experience-requests-title">Solicitudes de Experiencias</h1>
      <p className="admin-experience-requests-subtitle">
        Revisa y aprueba las solicitudes de experiencias creadas por los guías
      </p>
      
      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <p>Cargando solicitudes...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && pendingExperiences.length === 0 && (
        <div className="no-requests">
          <p>No hay solicitudes pendientes en este momento.</p>
        </div>
      )}
      
      {/* Requests list */}
      {!loading && !error && pendingExperiences.length > 0 && (
        <div className="requests-list">
          {pendingExperiences.map((experience) => (
            <div key={experience.id} className="request-card">
              <div className="request-header">
                <h2 className="request-title">{experience.nombre}</h2>
                <span className="request-date">
                  {experience.fechaCreacion && formatDate(experience.fechaCreacion)}
                </span>
              </div>
              
              {experience.imageUrl && (
                <img 
                  src={experience.imageUrl} 
                  alt={experience.nombre} 
                  className="request-image" 
                />
              )}
              
              <div className="request-details">
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
                <div className="detail-item">
                  <span className="detail-label">Creado por:</span>
                  <span className="detail-value">{experience.createdBy || 'Desconocido'}</span>
                </div>
              </div>
              
              <div className="request-description">
                {experience.descripcion}
              </div>
              
              <div className="request-actions">
                <button 
                  className="view-details-button"
                  onClick={() => handleViewDetails(experience)}
                >
                  Ver Detalles
                </button>
                <button 
                  className="approve-button"
                  onClick={() => handleApprove(experience.id)}
                >
                  Aprobar
                </button>
                <button 
                  className="reject-button"
                  onClick={() => openRejectModal(experience)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Rechazar Experiencia</h2>
              <button className="close-button" onClick={closeRejectModal}>×</button>
            </div>
            <p>Por favor, proporcione retroalimentación para el guía:</p>
            <textarea
              className="feedback-textarea"
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              placeholder="Explique por qué esta solicitud está siendo rechazada..."
            />
            <button 
              className="feedback-submit"
              onClick={handleReject}
              disabled={!rejectFeedback.trim()}
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperienceRequests;