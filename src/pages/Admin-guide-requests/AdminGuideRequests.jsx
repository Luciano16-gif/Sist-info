import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGuideRequests.css';

// Auth Context
import { useAuth } from '../../components/contexts/AuthContext';

// Firestore imports
import { db } from '../../firebase-config';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

import LoadingState from '../../components/common/LoadingState/LoadingState';

/**
 * AdminGuideRequests component - Allows admins to review, approve, or reject
 * guide applications submitted by users
 */
const AdminGuideRequests = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Check if user is admin and fetch requests
  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }
        
        // Check role directly from context
        if (userRole === 'admin') {
          fetchPendingRequests();
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
  
  // Fetch pending guide requests
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      
      const requestsCollection = collection(db, "solicitudes-guias");
      const requestsSnapshot = await getDocs(requestsCollection);
      
      const requestsList = [];
      requestsSnapshot.forEach((doc) => {
        requestsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setPendingRequests(requestsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching guide requests:", error);
      setError("Error al obtener solicitudes de guía pendientes.");
      setLoading(false);
    }
  };
  
  // Handle approve guide request
  const handleApprove = async (requestId, requestData) => {
    try {
      // Update user role in Firestore
      const userDocRef = doc(db, "lista-de-usuarios", requestId);
      
      // Get current user data
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("No se encontró el usuario correspondiente.");
      }
      
      // Update user type to 'guia'
      await updateDoc(userDocRef, {
        userType: 'guia'
      });
      
      // Optionally: Move the request to a different collection or add an 'approved' field
      // For now, we'll just delete the request
      const requestDocRef = doc(db, "solicitudes-guias", requestId);
      await deleteDoc(requestDocRef);
      
      // Update UI
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      
      // Show notification
      setNotification({
        show: true,
        message: 'Solicitud aprobada exitosamente',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error("Error approving guide request:", error);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Error al aprobar la solicitud: ' + error.message,
        type: 'error'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };
  
  // Open reject modal
  const openRejectModal = (request) => {
    setCurrentRequest(request);
    setRejectFeedback('');
    setShowRejectModal(true);
  };
  
  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setCurrentRequest(null);
    setRejectFeedback('');
  };
  
  // Handle reject guide request
  const handleReject = async () => {
    if (!currentRequest) return;
    
    try {
      // Optionally: Move to a 'rejected-requests' collection with feedback
      // For now, just delete the request
      const requestDocRef = doc(db, "solicitudes-guias", currentRequest.id);
      await deleteDoc(requestDocRef);
      
      // Update UI
      setPendingRequests(pendingRequests.filter(req => req.id !== currentRequest.id));
      
      // Close modal
      closeRejectModal();
      
      // Show notification
      setNotification({
        show: true,
        message: 'Solicitud rechazada exitosamente',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error("Error rejecting guide request:", error);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Error al rechazar la solicitud: ' + error.message,
        type: 'error'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };
  
  // If not admin, show unauthorized message
  if (!loading && userRole !== 'admin') {
    return (
      <div className="admin-guide-requests-container">
        <div className="unauthorized-message">
          <h1 className="admin-guide-requests-title">Acceso No Autorizado</h1>
          <p>Solo los administradores pueden acceder a esta página.</p>
          <button className="back-button" onClick={() => navigate('/')}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-guide-requests-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <h1 className="admin-guide-requests-title">Solicitudes de Guías</h1>
      <p className="admin-guide-requests-subtitle">
        Revisa y aprueba las solicitudes de usuarios para convertirse en guías
      </p>
      
      {/* Loading state */}
      {loading && (
        <LoadingState text="Cargando solicitudes..." className="min-h-screen" />
      )}
      
      {/* Error state */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && pendingRequests.length === 0 && (
        <div className="no-requests">
          <p>No hay solicitudes pendientes en este momento.</p>
        </div>
      )}
      
      {/* Requests list */}
      {!loading && !error && pendingRequests.length > 0 && (
        <div className="requests-list">
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h2 className="request-title">{request.fullName}</h2>
                <span className="request-email">{request.email}</span>
              </div>
              
              {request.image && (
                <img 
                  src={request.image} 
                  alt={request.fullName} 
                  className="request-image" 
                />
              )}
              
              <div className="request-details">
                <div className="detail-item">
                  <span className="detail-label">Cédula:</span>
                  <span className="detail-value">{request.cedula}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{request.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de Nacimiento:</span>
                  <span className="detail-value">{request.birthDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Idiomas:</span>
                  <span className="detail-value">{request.languages}</span>
                </div>
              </div>
              
              <div className="request-section">
                <h3>Disponibilidad</h3>
                <div className="availability-details">
                  <div className="detail-item">
                    <span className="detail-label">Horas Semanales:</span>
                    <span className="detail-value">{request.weeklyHours}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Días Semanales:</span>
                    <span className="detail-value">{request.weeklyDays}</span>
                  </div>
                </div>
              </div>
              
              <div className="request-section">
                <h3>Experiencia</h3>
                <div className="request-description">
                  {request.experience}
                </div>
              </div>
              
              <div className="request-section">
                <h3>Cualificaciones</h3>
                <div className="request-description">
                  {request.qualifications}
                </div>
              </div>
              
              <div className="request-section">
                <h3>Dirección</h3>
                <div className="request-description">
                  {request.address}
                </div>
              </div>
              
              <div className="request-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleApprove(request.id, request)}
                >
                  Aprobar
                </button>
                <button 
                  className="reject-button"
                  onClick={() => openRejectModal(request)}
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
              <h2 className="modal-title">Rechazar Solicitud</h2>
              <button className="close-button" onClick={closeRejectModal}>×</button>
            </div>
            <p>Por favor, proporcione retroalimentación para el solicitante:</p>
            <textarea
              className="feedback-textarea"
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              placeholder="Explique por qué esta solicitud está siendo rechazada..."
            />
            <button 
              className="feedback-submit"
              onClick={handleReject}
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGuideRequests;