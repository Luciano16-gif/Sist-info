import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthRedirect } from '../contexts/AuthContext';
import { 
  AuthButton, 
  GoogleAuthButton, 
  ErrorMessage, 
  AuthLink 
} from './AuthComponents/index';
import FormField from './AuthComponents/FormField';
import { useFormValidation } from './hooks/useFormValidation';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import './Auth.css';

function LoginPage() {
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { login, loginWithGoogle, error: contextError } = useAuth();
  
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
      email: '',
      password: ''
    }, 
    async (data) => {
      try {
        const user = await login(data.email, data.password);
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
      }
    }
  );

  // Display error from context
  const errorMessage = contextError;

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <h2 className="auth-title login-title">Iniciar Sesión</h2>
        
        {/* Error message - prominently displayed */}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        
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
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={() => handleGoogleAuth(false)}
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