import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Importa las funciones necesarias de Firebase Authentication
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './LoginPage.css'; // Importa los estilos específicos del componente

function LoginPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Buscar al usuario en la colección Lista de Usuarios mediante su correo electrónico
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Usuario no encontrado.');
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
        alert('Ya utilizaste otro método de Registro/Inicio de Sesión');
        return;
      }

      if (userData['Registro/Inicio de Sesión'] === 'Correo-Contraseña') {
        if(userData.password === password) {
          setEmail('');
          setPassword('');
          navigate('/'); // Redirige al usuario a la página Home después de un inicio de sesión exitoso
          return;
        }
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Vacía los campos de entrada después de iniciar sesión
      setEmail('');
      setPassword('');
      navigate('/'); // Redirige al usuario a la página Home después de un inicio de sesión exitoso
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        alert('Contraseña incorrecta.');
        return;
      }
      if (error.code === 'auth/user-not-found') {
        alert('Usuario no encontrado.');
        return;
      }
      if (error.code === 'auth/invalid-email') {
        alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
        return;
      }
      if (error.code === 'auth/invalid-credential') {
        alert('Ya utilizaste otro método de Registro/Inicio de Sesión');
        return;
      }
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

      // Verificar si el correo existe en Firestore
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('No puedes iniciar sesión con un correo que no se encuentra registrado.');
        await signOut(auth); // Desloguear al usuario si el correo no se encuentra en Firestore
        return;
      }

      setUser(result.user);
      navigate('/'); // Redirige al usuario a la página Home después de un inicio de sesión con Google exitoso
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="login-title">Iniciar Sesión</h2>
      <div className="input-container-login">
        <input type="email-login" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password-login" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
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