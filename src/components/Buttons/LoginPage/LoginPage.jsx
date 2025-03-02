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
      <h2 className="login-title">Login Page</h2>
      <div className="input-container">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="addbutton" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;