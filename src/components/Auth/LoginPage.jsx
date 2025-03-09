// components/Auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  
  // Email validation function 
  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  // Authentication state listener 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, navigate to home page
        navigate('/');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);
  
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Email/password login
  const handleLogin = async () => {
    setLocalError('');
    
    if (!validateEmail(email)) {
      setLocalError('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }
    
    try {
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLocalError('Usuario no encontrado.');
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
        setLocalError('Ya utilizaste otro método de Registro/Inicio de Sesión');
        return;
      }

      // Firebase handles password validation
      await signInWithEmailAndPassword(auth, email, password);

      setEmail('');
      setPassword('');
      // Navigation handled by useEffect
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === 'auth/wrong-password') {
        setLocalError('Contraseña incorrecta.');
      } else if (error.code === 'auth/user-not-found') {
        setLocalError('Usuario no encontrado.');
      } else if (error.code === 'auth/invalid-email') {
        setLocalError('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      } else {
        setLocalError(`Error: ${error.message}`);
      }
    }
  };

  // Google sign-in - using your original implementation
  const handleGoogleSignIn = async () => {
    setLocalError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      if (!validateEmail(userEmail)) {
        setLocalError('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
        await signOut(auth);
        return;
      }

      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLocalError('No puedes iniciar sesión con un correo que no se encuentra registrado.');
        await signOut(auth);
        return;
      }

      // Navigation handled by useEffect
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // Don't show error for closed popup
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      
      setLocalError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <h2 className="auth-title login-title">Iniciar Sesión</h2>
        
        <ErrorMessage message={localError || ''} />
        
        <div className="input-container">
          <FormInput 
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <FormInput 
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </div>
        
        <AuthButton 
          className="auth-button"
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
          to="/sign-up-page"
          text="¿No tienes cuenta?"
          linkText="Registrarse"
        />
      </div>
    </div>
  );
}

export default LoginPage;