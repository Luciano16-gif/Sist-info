// src/components/routes/AuthRedirectMessage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AuthRedirectMessage.css';

/**
 * Component to display a message explaining why the user was redirected to the signup page
 * Positioned absolutely and includes a dismiss button
 * 
 * @returns {React.ReactNode} A message component or null
 */
const AuthRedirectMessage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we have state indicating we were redirected from a protected route
    if (location.state && location.state.from && location.state.from.pathname) {
      setShowMessage(true);
      
      // Hide the message after 8 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Function to dismiss the message
  const handleDismiss = () => {
    setShowMessage(false);
  };

  // Don't render anything if there's no message to show
  if (!showMessage) return null;
  
  return (
    <div className="auth-redirect-message">
      <button 
        className="dismiss-button" 
        onClick={handleDismiss}
        aria-label="Cerrar mensaje"
      >
        ×
      </button>
      <h3>¡Bienvenido a ÁvilaVenturas!</h3>
      <p>
        Para acceder a las funciones, necesitas crear una cuenta o iniciar sesión.
      </p>
      <p>
        Únete a nuestra comunidad para descubrir todas las aventuras disponibles.
      </p>
    </div>
  );
};

export default AuthRedirectMessage;