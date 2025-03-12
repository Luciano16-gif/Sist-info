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
import { useFormValidation } from './hooks/useFormValidation';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import './Auth.css';

function SignUpPage() {
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { signup, error: contextError } = useAuth();

  // Google sign-in handler
  const handleGoogleAuth = useGoogleAuth();
  
  // Redirect if already logged in
  useAuthRedirect('/');
  
  // Use the form validation hook
  const { 
    formData, 
    formErrors, 
    isSubmitting, 
    handleInputChange, 
    handleBlur, 
    handleSubmit,
    setFormData
  } = useFormValidation(
    {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    }, 
    async (data) => {
      try {
        // Remove confirmPassword before sending to the service
        const { confirmPassword, ...userData } = data;
        
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
      }
    }
  );

  // Display error from context
  const errorMessage = contextError;

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <h2 className="auth-title signup-title">Registrarse</h2>
        
        {/* Error message - prominently displayed */}
        {errorMessage && (
          <ErrorMessage 
            message={errorMessage} 
            className="auth-error-prominent" 
          />
        )}
        
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
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Registrarse'}
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={() => handleGoogleAuth(true)}
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