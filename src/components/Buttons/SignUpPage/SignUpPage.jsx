import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './SignUpPage.css'; // Importa los estilos específicos del componente

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Nuevo estado para el número telefónico
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();
  const usersCollection = collection(db, 'Lista de Usuarios');
  const navigate = useNavigate(); // Utiliza el hook useNavigate

  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  const handleExecute = async () => {
    if (!validateEmail(email)) {
      alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }
    try {
      // Registrar usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // Iniciar sesión con el usuario recién creado
      await signInWithEmailAndPassword(auth, email, password);
      // Crear el documento en Firestore con el nombre y apellido del usuario
      const docRef = doc(usersCollection, `${newItemName} ${newItemLastName}`);
      await setDoc(docRef, {
        email: email,
        name: newItemName,
        lastName: newItemLastName,
        password: password,
        phone: phoneNumber
      });
      navigate('/home'); // Redirige al usuario a la página Home después de un registro exitoso
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

      // Obtener la información del usuario desde el resultado de la autenticación con Google
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

      const userPhone = ''; // Puedes obtener el número de teléfono del usuario de alguna otra manera si es necesario

      // Crear el documento en Firestore con la información del usuario
      const docRef = doc(usersCollection, `${name} ${lastName}`);
      await setDoc(docRef, {
        email: userEmail,
        name: name,
        lastName: lastName,
        password: '', // No se guarda la contraseña del usuario registrado con Google
        phone: userPhone
      });

      setUser(result.user);
      navigate('/home'); // Redirige al usuario a la página Home después de un registro con Google exitoso
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="signup-title"> Registrarse</h2>
      <div className="input-container-signup">
        <div>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Ingresa tu nombre"
            style={{ marginRight: '600px' }}
          />
          <input
            type="text"
            value={newItemLastName}
            onChange={(e) => setNewItemLastName(e.target.value)}
            placeholder="Ingresa tu apellido"
          />
        </div>
      </div>
      <div className="input-container-signup" style={{ display: 'flex', gap: '600px' }}>
        <div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ingresa tu nro telefónico"
            style={{ fontFamily: "'Ysabeau SC', sans-serif", transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease', color: '#333' }}
          />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} 
          style={{ marginLeft: '600px' }}/>
        </div>
      </div>
      <div className="input-container-signup" style={{ display: 'flex', gap: '600px' }}>
        <div>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <button className="addbutton-signup" onClick={handleExecute}>Registrarse</button>
      <button className="google-button-signup" onClick={handleGoogleSignIn}>
        <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
        Registrarse con Google
      </button>
      <p className="login-link-signup" style={{ marginTop: '20px' }}>¿Tienes cuenta? <a href="/login-page">Iniciar Sesión</a></p>
    </div>
  );
}

export default SignUpPage;