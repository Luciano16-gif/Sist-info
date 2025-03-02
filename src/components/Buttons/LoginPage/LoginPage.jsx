import React, { useState } from 'react';
import { auth } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Importa la función signOut
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './LoginPage.css'; // Importa los estilos específicos del componente

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate(); // Utiliza el hook useNavigate

  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // Vacía los campos de entrada después de iniciar sesión
      setEmail('');
      setPassword('');
      navigate('/home'); // Redirige al usuario a la página Home después de un inicio de sesión exitoso
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      if (!validateEmail(userEmail)) {
        alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
        // Desloguear al usuario si el correo no cumple con la regla
        await signOut(auth); // Utiliza la función signOut correctamente
        return;
      }

      setUser(result.user);
      navigate('/home'); // Redirige al usuario a la página Home después de un inicio de sesión con Google exitoso
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="login-title">Iniciar Sesión</h2>
      <div className="input-container-login">
        <input type="email-login" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
      <button className="google-button-login" onClick={handleGoogleSignIn}>
        <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
        Iniciar Sesión con Google
      </button>
      <p className="signup-link-login" style={{ marginTop: '20px' }}>¿No tienes cuenta? <a href="/sign-up-page">Registrarse</a></p>
      <p className="adminlogin-link-login" style={{ marginTop: '20px' }}>¿Eres Guía? <a href="/guia-login-page">Ingresar código</a></p>
    </div>
  );
}

export default LoginPage;