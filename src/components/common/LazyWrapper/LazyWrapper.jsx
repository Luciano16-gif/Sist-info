// src/components/common/LazyWrapper/LazyWrapper.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

/**
 * LazyWrapper component to handle React.lazy loading states
 * Works with the AuthContext loading state to provide a smooth loading experience
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The lazy-loaded component to wrap
 * @param {Function} props.onError - Optional callback for error handling
 * @returns {JSX.Element} - The wrapped component
 */
const LazyWrapper = ({ children, onError }) => {
  const { setComponentLoading } = useAuth();
  
  // When the component mounts, mark loading as complete
  useEffect(() => {
    // Component is now loaded
    setComponentLoading(false);
    
    // If component unmounts during loading, ensure loading state is reset
    return () => {
      setComponentLoading(false);
    };
  }, [setComponentLoading]);

  // Error fallback UI
  const customFallback = ({ error, reset }) => (
    <div className="error-boundary-container">
      <h2>Error al cargar el componente</h2>
      <p>Ha ocurrido un error al cargar esta sección de la aplicación.</p>
      <button 
        onClick={() => {
          setComponentLoading(false);
          reset();
          window.location.reload();
        }}
        className="error-boundary-button"
      >
        Reintentar
      </button>
    </div>
  );

  // Error handler
  const handleError = (error) => {
    console.error("LazyWrapper caught error:", error);
    setComponentLoading(false);
    if (onError) onError(error);
  };

  return (
    <ErrorBoundary 
      fallback={customFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default LazyWrapper;