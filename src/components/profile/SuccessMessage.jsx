import React, { useEffect, useState } from 'react';

/**
 * Success message component with auto-dismiss
 * @param {Object} props Component props
 * @param {string} props.message Message to display
 * @param {number} props.duration Duration in ms before auto-dismiss (default: 3000)
 * @param {function} props.onDismiss Callback when message is dismissed
 */
const SuccessMessage = ({ message, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (!message) return;
    
    setIsVisible(true);
    
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) {
        setTimeout(onDismiss, 300); // Call onDismiss after fade-out animation
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);
  
  if (!message || !isVisible) return null;
  
  return (
    <div className="success-message">
      {message}
    </div>
  );
};

export default SuccessMessage;