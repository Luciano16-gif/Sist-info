// Validation utilities for authentication forms

/**
 * Email validation for UNIMET email domain
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateEmail = (email) => {
  const UNIMET_DOMAIN = 'correo.unimet.edu.ve';
  
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'El correo electrónico es obligatorio.' };
  }
  
  const trimmedEmail = email.trim();
  
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Formato de correo electrónico inválido.' };
  }
  
  // Check for UNIMET domain - this is always required
  if (!trimmedEmail.endsWith(`@${UNIMET_DOMAIN}`)) {
    return { 
      isValid: false, 
      message: `Por favor, utiliza un correo electrónico de la Universidad Metropolitana (@${UNIMET_DOMAIN}).` 
    };
  }
  
  return { isValid: true, message: '' };
};


  
  /**
   * Password strength validation
   * @param {string} password - Password to validate
   * @param {boolean} strict - Whether to enforce all rules (default: true)
   * @returns {Object} - Validation result with isValid and message
   */
  export const validatePassword = (password, strict = true) => {
    if (!password) {
      return { isValid: false, message: 'La contraseña es obligatoria.' };
    }
    
    // Check length
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    
    if (strict) {
      // Check for at least one number
      if (!/\d/.test(password)) {
        return { isValid: false, message: 'La contraseña debe contener al menos un número.' };
      }
      
      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula.' };
      }
      
      // Check for at least one special character
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { 
          isValid: false, 
          message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>).' 
        };
      }
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Phone number validation
   * @param {string} phone - Phone number to validate
   * @param {boolean} required - Whether the field is required
   * @returns {Object} - Validation result with isValid and message
   */
  export const validatePhone = (phone, required = false) => {
    // If not required and empty, it's valid
    if (!required && (!phone || phone.trim() === '')) {
      return { isValid: true, message: '' };
    }
    
    // If required and empty
    if (required && (!phone || phone.trim() === '')) {
      return { isValid: false, message: 'El número telefónico es obligatorio.' };
    }
    
    // Must be exactly 11 digits
    if (!/^\d{11}$/.test(phone)) {
      return { 
        isValid: false, 
        message: 'El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.' 
      };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Name validation
   * @param {string} name - Name to validate
   * @returns {Object} - Validation result with isValid and message
   */
  export const validateName = (name) => {
    if (!name || name.trim() === '') {
      return { isValid: false, message: 'Este campo es obligatorio.' };
    }
    
    // Check for minimum length
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Debe tener al menos 2 caracteres.' };
    }
    
    // Check that it contains only letters and spaces
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
      return { isValid: false, message: 'Solo puede contener letras y espacios.' };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates a complete form with multiple fields
   * @param {Object} formData - Form data object
   * @param {Object} validationRules - Rules for each field
   * @returns {Object} - Object with isValid and errors for each field
   */
  export const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;
    
    // Validate each field according to its rules
    Object.keys(validationRules).forEach(field => {
      const value = formData[field];
      const { validator, params = [] } = validationRules[field];
      
      const result = validator(value, ...params);
      
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    });
    
    return { isValid, errors };
  };