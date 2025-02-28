import React, { useState } from 'react';
import { auth } from '../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function AuthTest() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            alert('Usuario registrado!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleLogin = async () => {
      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          setUser(userCredential.user);
          alert('Usuario logeado!');
      } catch (error) {
          alert(`Error: ${error.message}`);
      }
    }

    return (
        <div>
            <h2>Prueba de Auth</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Registrar</button>
            <button onClick={handleLogin}>Login</button>
            {user && <p>Usuario logeado: {user.email}</p>}
        </div>
    );
}

export default AuthTest;
