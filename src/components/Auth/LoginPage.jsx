import React, { useState } from 'react';
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

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  
  // Use our auth hooks
  const { login, loginWithGoogle, error: contextError } = useAuth();
  
  // Redirect if already logged in
  useAuthRedirect('/');
  
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Email/password login using our context
  const handleLogin = async () => {
    setLocalError('');
    
    // Basic validation
    if (!email || !password) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }
    
    try {
      const user = await login(email, password);
      if (user) {
        setEmail('');
        setPassword('');
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Login error:", error);
    }
  };

  // Google sign-in using our context
  const handleGoogleSignIn = async () => {
    setLocalError('');
    
    try {
      const user = await loginWithGoogle(false); // false = not signing up
      if (user) {
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Google sign-in error:", error);
    }
  };

  // Display error from context or local error
  const errorMessage = contextError || localError;

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <h2 className="auth-title login-title">Iniciar Sesión</h2>
        
        {errorMessage && <ErrorMessage message={errorMessage} />}
        
        <div className="input-container w-full max-w-sm mx-auto">
          <FormInput 
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            className="w-full max-w-sm mx-auto"
          />
          <FormInput 
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full max-w-sm mx-auto"
          />
        </div>
        
        <AuthButton 
          className="auth-button lg:w-1/3"
          onClick={handleLogin}
        >
          Iniciar Sesión
        </AuthButton>
        
        <GoogleAuthButton 
          className="google-auth-button"
          onClick={handleGoogleSignIn}
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