import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthRedirect } from '../contexts/AuthContext';
import { 
  AuthButton, 
  GoogleAuthButton, 
  ErrorMessage, 
  AuthLink 
} from './AuthComponents/index';
import FormField from './AuthComponents/FormField';
import { useFormValidation } from '../hooks/auth-hooks/useFormValidation';
import { useGoogleAuth } from '../hooks/auth-hooks/useGoogleAuth';
import './Auth.css';

function LoginPage() {
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { login, error: contextError } = useAuth();
  
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
        <h2 className="auth-title login-title" style={{ marginBottom: '1rem' }}>Iniciar Sesión</h2>
        
        {/* Error container that flexibly handles the error message */}
        <div className="auth-error-container" style={{ marginBottom: '0.75rem' }}>
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
        
        <div className="input-container w-full max-w-sm mx-auto" style={{ marginTop: '0.5rem' }}>
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