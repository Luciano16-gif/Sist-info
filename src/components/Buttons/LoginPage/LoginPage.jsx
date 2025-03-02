import React, { useState } from 'react';
import { auth } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './LoginPage.css'; // Importa los estilos específicos del componente

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Usuario logeado!');
      // Vacía los campos de entrada después de iniciar sesión
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      alert('Usuario logeado con Google!');
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
    </div>
  );
}

export default LoginPage;