// components/Auth/SignUpPage.jsx
import { useState } from 'react';
// Add direct Firebase imports
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Keep the component imports
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
  
  // Add the Google provider directly
  const googleProvider = new GoogleAuthProvider();
  const usersCollection = collection(db, 'Lista de Usuarios');
  
  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  // Email validation from original code
  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.lastName || !formData.email || !formData.password) {
      setLocalError('Por favor completa los campos obligatorios.');
      return false;
    }
    
    // Email validation
    if (!validateEmail(formData.email)) {
      setLocalError('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return false;
    }
    
    // Phone validation if provided
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
      console.log("Creating user with email/password");
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      console.log("User created, signing in");
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user document
      console.log("Creating user document in Firestore");
      const docRef = doc(usersCollection, formData.email); // Using email as document ID
      await setDoc(docRef, {
        email: formData.email,
        name: formData.name,
        lastName: formData.lastName,
        password: formData.password, // Consider if you want to store this
        phone: formData.phone,
        'Registro/Inicio de Sesión': 'Correo-Contraseña',
        userType: "usuario",
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: []
      });
      
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
      
    } catch (error) {
      console.error("Sign up error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        setLocalError('Este correo ya está registrado.');
      } else {
        setLocalError(`Error: ${error.message}`);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setLocalError('');
    
    try {
      console.log("Starting Google sign-up");
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      
      console.log("Google auth successful, validating email");
      
      // Validate email domain
      if (!validateEmail(userEmail)) {
        setLocalError('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
        await signOut(auth);
        return;
      }
      
      console.log("Email valid, checking if user exists");
      
      // Check if user already exists
      const q = query(usersCollection, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLocalError('Ya ha registrado un usuario con ese correo.');
        await signOut(auth);
        return;
      }
      
      console.log("User doesn't exist, creating new account");
      
      // Get name and lastName from Google account
      const userName = result.user.displayName || '';
      let name = '';
      let lastName = '';

      if (userName) {
        const nameParts = userName.split(' ');
        if (nameParts.length >= 2) {
          name = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        } else {
          name = userName;
        }
      }
      
      console.log("Creating user document in Firestore");
      
      // Create user document in Firestore
      const docRef = doc(usersCollection, userEmail); // Using email as document ID
      await setDoc(docRef, {
        email: userEmail,
        name: name,
        lastName: lastName,
        password: '',  // Password is empty when using Google auth
        phone: '',
        'Registro/Inicio de Sesión': 'Google Authentication',
        userType: "usuario",
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: []
      });
      
      console.log("User document created, navigating to home");
      
      // Navigate to home
      navigate('/');
      
    } catch (error) {
      console.error("Google sign-up error:", error);
      
      // Don't show error if user just closed the popup
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("User closed the popup");
        return;
      }
      
      setLocalError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <h2 className="auth-title signup-title">Registrarse</h2>
        
        <ErrorMessage message={localError} />
        
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
          <div className='flex justify-center'>
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