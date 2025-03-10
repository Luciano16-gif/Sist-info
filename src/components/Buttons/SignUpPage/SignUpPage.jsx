import { useState } from 'react';
import { auth, db } from '../../../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

function OldSignUpPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const googleProvider = new GoogleAuthProvider();
  const usersCollection = collection(db, 'Lista de Usuarios');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const domain = 'correo.unimet.edu.ve';
    return email.endsWith(`@${domain}`);
  };

  const handleExecute = async () => {
    if (!validateEmail(email)) {
      alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
      return;
    }

    if (phoneNumber && (!/^\d{11}$/.test(phoneNumber))) {
      alert('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await signInWithEmailAndPassword(auth, email, password);  //Sign in after creating
      const docRef = doc(usersCollection, `${newItemName} ${newItemLastName}`);
      await setDoc(docRef, {
        email: email,
        name: newItemName,
        lastName: newItemLastName,
        password: password,
        phone: phoneNumber,
        'Registro/Inicio de Sesión': 'Correo-Contraseña',
        userType: "usuario", // Add userType here
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: [] // Added activitiesCreated
      });
      navigate('/landing-page-user');
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
        await signOut(auth);
        return;
      }

      const q = query(usersCollection, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('Ya ha registrado un usuario con ese correo.');
        await signOut(auth);
        return;
      }

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

      const userPhone = '';

      const docRef = doc(usersCollection, `${name} ${lastName}`);
      await setDoc(docRef, {
        email: userEmail,
        name: name,
        lastName: lastName,
        password: '',  //Password is empty when using google auth
        phone: userPhone,
        'Registro/Inicio de Sesión': 'Google Authentication',
        userType: "usuario", // Add userType here
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: [] // Added activitiesCreated

      });

      setUser(result.user);
      navigate('/');
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
            type="text-signup"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Ingresa tu nombre"
            style={{ marginRight: '600px' }}
          />
          <input
            type="text-signup"
            value={newItemLastName}
            onChange={(e) => setNewItemLastName(e.target.value)}
            placeholder="Ingresa tu apellido"
          />
        </div>
      </div>
      <div className="input-container-signup" style={{ display: 'flex', gap: '600px' }}>
        <div>
          <input
            type="tel-signup"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ingresa tu nro telefónico"
            style={{ fontFamily: "'Ysabeau SC', sans-serif", transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease' }}
          />
          <input type="email-signup" placeholder="Email" onChange={(e) => setEmail(e.target.value)} 
          style={{ marginLeft: '600px' }}/>
        </div>
      </div>
      <div className="input-container-signup" style={{ display: 'flex', gap: '600px' }}>
        <div>
          <input type="password-signup" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
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

export default OldSignUpPage;