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
import './Auth.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { login, error: contextError } = useAuth();
  
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
  };

  const handleBlur = (field) => () => {
    // Validate field on blur if needed
  };

  // Email/password login
  const handleLogin = async () => {
    setLocalError('');
    setIsSubmitting(true);
    
    // Basic validation
    const errors = {};
    let isValid = true;
    
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
      isValid = false;
    }
    
    if (!isValid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        // Successful login
        setFormData({
          email: '',
          password: ''
        });
        navigate('/');
      }
    } catch (error) {
      // Error is already handled in context
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google sign-in with improved error handling
  const handleGoogleSignIn = async () => {
    setLocalError('');
    setIsSubmitting(true);
    
    try {
      const user = await loginWithGoogle(false); // false = not signing up
      
      // Only navigate if we have a valid user
      if (user) {
        navigate('/');
      }
      // If no user is returned, there was an error that's already in context
      
    } catch (error) {
      // This shouldn't execute because errors are handled in context
      // But just in case, set a local error
      setLocalError(error.message || 'Error al iniciar sesión con Google');
      console.error("Google sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display error from context or local error
  const errorMessage = contextError || localError;

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <h2 className="auth-title login-title">Iniciar Sesión</h2>
        
        {/* Error container that flexibly handles the error message */}
        <div className="error-container">
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
        
        <div className="input-container w-full max-w-sm mx-auto">
          <FormField
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Email"
            error={formErrors.email}
            className="w-full max-w-sm mx-auto"
          />
          
          <FormField
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleBlur('password')}
            placeholder="Password"
            error={formErrors.password}
            className="w-full max-w-sm mx-auto"
          />
        </div>
        
        <AuthButton 
          className="auth-button lg:w-1/3"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        />
        
        <AuthLink 
          className="auth-link"
          to="/SignUpPage"
          text="¿No tienes cuenta?"
          linkText="Registrarse"
        />
      </div>
    </div>
  );
}

export default LoginPage;