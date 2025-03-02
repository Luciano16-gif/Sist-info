import React, { useState } from 'react';
import { auth } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { signInWithEmailAndPassword } from 'firebase/auth';
import './LoginPage.css'; // Importa los estilos específicos del componente

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

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
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="login-title">Iniciar Sesión</h2>
      <div className="input-container-login">
        <input type="email-login" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password-login" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="addbutton-login" onClick={handleLogin}>Login</button>
      <p className="signup-link-login" style={{  }}>¿No tienes cuenta? <a href="/sign-up-page">Registrarse</a></p>
    </div>
  );
}

export default LoginPage;