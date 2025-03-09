import { useState } from 'react';
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
  
  const { signup, loginWithGoogle, error: authError } = useAuth();
  
  // Redirect if already logged in
  useAuthRedirect();
  
  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastName || !formData.email || !formData.password) {
      setLocalError('Por favor completa los campos obligatorios.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLocalError('');
    if (!validateForm()) return;
    
    await signup(formData, (error) => {
      setLocalError(error.message);
    });
    
    // Clear form on success (no error)
    if (!authError && !localError) {
      setFormData({
        name: '',
        lastName: '',
        phone: '',
        email: '',
        password: ''
      });
    }
  };

  const handleGoogleSignUp = async () => {
    await loginWithGoogle(true, (error) => {
      setLocalError(error.message);
    });
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <h2 className="auth-title signup-title">Registrarse</h2>
        
        <ErrorMessage message={localError || authError} />
        
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
          
          <FormInput 
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="Password"
          />
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