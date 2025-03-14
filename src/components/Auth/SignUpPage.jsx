import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthRedirect } from '../contexts/AuthContext';
import { 
  AuthButton, 
  GoogleAuthButton, 
  ErrorMessage, 
  AuthLink 
} from './AuthComponents/index';
import FormField from './AuthComponents/FormField';
import PasswordStrength from './AuthComponents/PasswordStrength';
import { 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateName 
} from '../utils/validationUtils';
import './Auth.css';

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { signup, loginWithGoogle, error: contextError } = useAuth();
  
  // Redirect if already logged in
  useAuthRedirect('/');
  
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
  
  const validateSignUpForm = () => {
    const errors = {};
    let formIsValid = true;
    
    // Validate name
    const nameResult = validateName(formData.name);
    if (!nameResult.isValid) {
      errors.name = nameResult.message;
      formIsValid = false;
    }
    
    // Validate lastName
    const lastNameResult = validateName(formData.lastName);
    if (!lastNameResult.isValid) {
      errors.lastName = lastNameResult.message;
      formIsValid = false;
    }
    
    // Validate phone (optional)
    const phoneResult = validatePhone(formData.phone, false);
    if (!phoneResult.isValid) {
      errors.phone = phoneResult.message;
      formIsValid = false;
    }
    
    // Validate email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.message;
      formIsValid = false;
    }
    
    // Validate password
    const passwordResult = validatePassword(formData.password, true);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.message;
      formIsValid = false;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
      formIsValid = false;
    }
    
    setFormErrors(errors);
    return formIsValid;
  };

  const handleSignUp = async () => {
    setLocalError('');
    setIsSubmitting(true);
    
    if (!validateSignUpForm()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Remove confirmPassword before sending to the service
      const { confirmPassword, ...userData } = formData;
      
      const user = await signup(userData);
      
      // Only navigate if we have a valid user
      if (user) {
        // Clear form on success
        setFormData({
          name: '',
          lastName: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLocalError('');
    setIsSubmitting(true);
    
    try {
      const user = await loginWithGoogle(true); // true = signing up
      
      // Only navigate if we have a valid user
      if (user) {
        // Navigate to home
        navigate('/');
      }
      // If no user is returned but no exception was thrown,
      // an error message should already be in the context
      
    } catch (error) {
      // This block might not execute since errors are handled in the context
      // But just in case, set a local error
      setLocalError(error.message || 'Error al registrarse con Google');
      console.error("Google sign-up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display error from context or local error
  const errorMessage = contextError || localError;

  return (
    <div className="auth-page signup-page overflow-hidden">
      <div className="auth-container">
        <h2 className="auth-title signup-title">Registrarse</h2>
        
        {/* Error container with a signup-specific class */}
        <div className="error-container signup-error-container">
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
        
        <div className="input-container">
          <div className="signup-input-row">
            <FormField
              type="text"

              value={formData.name}
              onChange={handleInputChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Ingresa tu nombre"
              error={formErrors.name}
            />
            
            <FormField
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              onBlur={handleBlur('lastName')}
              placeholder="Ingresa tu apellido"
              error={formErrors.lastName}
            />
          </div>
          
          <div className="signup-input-row">
            <FormField
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              onBlur={handleBlur('phone')}
              placeholder="Ingresa tu nro telefónico"
              error={formErrors.phone}
            />
            
            <FormField
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Email"
              error={formErrors.email}
            />
          </div>
          
          <div className="signup-input-row">
            <FormField
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Password"
              error={formErrors.password}
            >
              {formData.password && <PasswordStrength password={formData.password} />}
            </FormField>
            
            <FormField
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Confirmar Password"
              error={formErrors.confirmPassword}
            />
          </div>
        </div>
        
        <AuthButton 
          className="auth-button lg:w-1/3"
          onClick={handleSignUp}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Registrarse'}
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={handleGoogleSignUp}
          text="Registrarse con Google"
          disabled={isSubmitting}
        />
        
        <AuthLink 
          className="auth-link"
          to="/login-page"
          text="¿Tienes cuenta?"
          linkText="Iniciar Sesión"
        />
      </div>
    </div>
  );
}

export default SignUpPage;