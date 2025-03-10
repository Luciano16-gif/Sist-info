import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthRedirect } from '../contexts/AuthContext';
import { 
  FormInput, 
  AuthButton, 
  GoogleAuthButton, 
  ErrorMessage, 
  AuthLink 
} from './AuthComponents/index'; 
import './Auth.css';

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { signup, loginWithGoogle, error: contextError } = useAuth();
  
  // Redirect if already logged in
  useAuthRedirect('/');
  
  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.lastName || !formData.email || !formData.password) {
      setLocalError('Por favor completa los campos obligatorios.');
      return false;
    }
    
    // Email validation handled by the service
    
    // Phone validation
    if (formData.phone && (!/^\d{11}$/.test(formData.phone))) {
      setLocalError('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async () => {
    setLocalError('');
    
    if (!validateForm()) return;
    
    try {
      const user = await signup(formData);
      
      if (user) {
        // Clear form on success
        setFormData({
          name: '',
          lastName: '',
          phone: '',
          email: '',
          password: ''
        });
        
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Sign up error:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    setLocalError('');
    
    try {
      const user = await loginWithGoogle(true); // true = signing up
      
      if (user) {
        // Navigate to home
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Google sign-up error:", error);
    }
  };

  // Display error from context or local error
  const errorMessage = contextError || localError;

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <h2 className="auth-title signup-title">Registrarse</h2>
        
        {errorMessage && <ErrorMessage message={errorMessage} />}
        
        <div className="input-container">
          <div className="signup-input-row">
            <FormInput 
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Ingresa tu nombre"
            />
            <FormInput 
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              placeholder="Ingresa tu apellido"
            />
          </div>
          
          <div className="signup-input-row">
            <FormInput 
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              placeholder="Ingresa tu nro telefónico"
            />
            <FormInput 
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Email"
            />
          </div>
          <div className="flex justify-center">
            <FormInput 
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Password"
            />
          </div>
        </div>
        
        <AuthButton 
          className="auth-button"
          onClick={handleSignUp}
        >
          Registrarse
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={handleGoogleSignUp}
          text="Registrarse con Google"
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