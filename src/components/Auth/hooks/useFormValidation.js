import { useState } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateName,
  validateForm
} from '../../utils/validationUtils';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
export const useFormValidation = (initialValues, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handle input change
   * @param {string} field - Field name
   * @returns {Function} Event handler
   */
  const handleInputChange = (field) => (e) => {
    // Clear errors when user types
    setFormErrors({
      ...formErrors,
      [field]: ''
    });
    
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    
    // Special handling for password confirmation
    if (field === 'confirmPassword' || (field === 'password' && formData.confirmPassword)) {
      const passwordsMatch = field === 'password' 
        ? e.target.value === formData.confirmPassword
        : formData.password === e.target.value;
      
      if (!passwordsMatch) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: 'Las contraseñas no coinciden.'
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };
  
  /**
   * Field blur handler for validation
   * @param {string} field - Field name 
   * @returns {Function} Blur handler
   */
  const handleBlur = (field) => () => {
    let result;
    
    switch (field) {
      case 'name':
        result = validateName(formData.name);
        break;
      case 'lastName':
        result = validateName(formData.lastName);
        break;
      case 'phone':
        result = validatePhone(formData.phone, false);
        break;
      case 'email':
        result = validateEmail(formData.email);
        break;
      case 'password':
        result = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        result = { 
          isValid: formData.password === formData.confirmPassword,
          message: 'Las contraseñas no coinciden.'
        };
        break;
      default:
        return;
    }
    
    if (!result.isValid) {
      setFormErrors({
        ...formErrors,
        [field]: result.message
      });
    }
  };
  
  /**
   * Validate the entire form
   * @param {boolean} isSignup - Whether this is the signup form
   * @returns {boolean} Whether form is valid
   */
  const validateFormData = (isSignup = true) => {
    // Validation rules for sign up
    const validationRules = {
      name: { validator: validateName },
      lastName: { validator: validateName },
      phone: { validator: validatePhone, params: [false] }, // Not required
      email: { validator: validateEmail },
      password: { validator: validatePassword, params: [isSignup] } // Strict for signup
    };
    
    // Validate form
    const { isValid, errors } = validateForm(formData, validationRules);
    
    // Additional validation for password confirmation
    let updatedErrors = { ...errors };
    let formIsValid = isValid;
    
    // Only check password confirmation for signup
    if (isSignup && formData.password !== formData.confirmPassword) {
      updatedErrors.confirmPassword = 'Las contraseñas no coinciden.';
      formIsValid = false;
    }
    
    setFormErrors(updatedErrors);
    return formIsValid;
  };
  
  /**
   * Form submission handler
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (!validateFormData()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    handleBlur,
    handleSubmit,
    setFormData,
    setFormErrors
  };
};

export default useFormValidation;