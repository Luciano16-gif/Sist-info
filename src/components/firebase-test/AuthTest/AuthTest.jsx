import React, { useState } from 'react';
import { auth } from '../../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Importa la función signOut
import './AuthTest.css'; // Importa los estilos específicos del componente

function AuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Usuario registrado!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Usuario logeado!');
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
      alert('Usuario logeado con Google!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Elimina esta línea */}
      {/* <h2>Prueba de Auth</h2> */}
      <div className="input-container">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={handleLogin}>Login</button>
      <button className="google-button" onClick={handleGoogleSignIn}>
        <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
        Login con Google
      </button>
      {user && <p>Usuario logeado: {user.email}</p>}
    </div>
  );
}

export default AuthTest;