import React from 'react';
import { FormInput } from './FormInput';

/**
 * A form field component that wraps an input with error handling
 */
const FormField = ({ 
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  className = '',
  children
}) => {
  return (
    <div style={{ width: '100%' }}>
      <FormInput
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${className} ${error ? 'invalid' : ''}`}
      />
      
      {/* Render children (e.g., password strength indicator) */}
      {children}
      
      {/* Error message */}
      {error && (
        <div style={{ 
          color: '#ff3333', 
          fontSize: '0.875rem',
          fontWeight: 'bold',
          marginTop: '4px', 
          marginBottom: '4px',
          textAlign: 'left',
          fontFamily: 'Ysabeau SC, sans-serif',
          textShadow: '0 0 1px #000',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;