import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase Authentication
import { collection, doc, getDoc, query, where } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './AuthTest.css'; // Importa los estilos específicos del componente

function AuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate(); // Utiliza el hook useNavigate

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
      // Verificar si el correo ya está registrado en Firestore
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDoc(q);

      if (querySnapshot.empty) {
        // Registrar usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        alert('Usuario registrado!');
        navigate('/home'); // Redirige al usuario a la página Home después de un registro exitoso
      } else {
        alert('Este correo ya está registrado.');
        return;
      }
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
      // Buscar al usuario en la colección Lista de Usuarios mediante su correo electrónico
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDoc(q);

      if (querySnapshot.empty) {
        alert('Usuario no encontrado.');
        return;
      }

      const userDocRef = doc(usersCollection, `${email}`);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        if (!userData.password) {
          alert('Este correo está registrado pero no tiene una contraseña asociada. Inicia sesión con Google.');
          return;
        }

        // Iniciar sesión con el usuario recién creado
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        alert('Usuario logeado!');
        navigate('/home'); // Redirige al usuario a la página Home después de un inicio de sesión exitoso
      } else {
        alert('Usuario no encontrado.');
        return;
      }
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

      // Buscar al usuario en la colección Lista de Usuarios mediante su correo electrónico
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", userEmail));
      const querySnapshot = await getDoc(q);

      if (querySnapshot.empty) {
        alert('Usuario no encontrado.');
        await signOut(auth); // Desloguear al usuario si el correo no se encuentra en Firestore
        return;
      }

      setUser(result.user);
      alert('Usuario logeado con Google!');
      navigate('/home'); // Redirige al usuario a la página Home después de un inicio de sesión con Google exitoso
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