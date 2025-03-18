import React from 'react';
import './LoadingState.css';

/**
 * LoadingState component - A reusable loading indicator with customizable text
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display while loading (e.g., "Cargando experiencias...")
 * @param {string} props.className - Additional class names to apply to the container
 * @returns {JSX.Element} Loading indicator with spinner and text
 */
const LoadingState = ({ text = "Cargando...", className = "" }) => (
  <div className={`loading-container ${className} min-h-screen`}>
    <p>{text}</p>
    <div className="loading-spinner"></div>
  </div>
);

export default LoadingState;