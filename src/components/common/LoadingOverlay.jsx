import React from 'react';

/**
 * A reusable loading overlay component with a semi-transparent background and spinner
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the overlay should be shown
 * @param {string} props.message - Optional message to display
 * @param {number} props.opacity - Background opacity (0-100)
 * @returns {JSX.Element|null} - The loading overlay or null if not loading
 */
const LoadingOverlay = ({ 
  isLoading, 
  message = 'Cargando...', 
  opacity = 70 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" aria-live="polite" role="status">
      {/* Semi-transparent background */}
      <div 
        className={`absolute inset-0 bg-black`} 
        style={{ opacity: opacity / 100 }}
      ></div>
      
      {/* Loading spinner and message */}
      <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="spinner mb-3">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Message */}
        <p className="text-gray-800 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;