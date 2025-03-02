import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import './SignUpPage.css'; // Importa los estilos específicos del componente

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Nuevo estado para el número telefónico
  const [user, setUser] = useState(null);
  const itemsCollection = collection(db, 'testItems');

  const handleExecute = async () => {
    try {
      // Registrar usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Usuario registrado!');
      // Iniciar sesión con el usuario recién creado
      await signInWithEmailAndPassword(auth, email, password);
      // Añadir item a Firestore
      if (newItemName.trim() !== '' && newItemLastName.trim() !== '' && phoneNumber.trim() !== '') {
        await addDoc(itemsCollection, { name: newItemName, lastName: newItemLastName, phone: phoneNumber });
        setNewItemName(''); // Vacía el campo de entrada después de añadir
        setNewItemLastName(''); // Vacía el campo de entrada después de añadir
        setPhoneNumber(''); // Vacía el campo de entrada después de añadir
        alert('Item añadido!');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="signup-title"> Registrarse</h2>
      <div className="input-container-signup" >
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
            style={{fontFamily: "'Ysabeau SC', sans-serif", transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease', color: '#333' }}
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
      <button className="addbutton-signup" onClick={handleExecute} >Registrarse</button>
      {user && <p>Usuario logeado: {user.email}</p>}
      <p className="login-link-signup" style={{  }}>¿Tienes cuenta? <a href="/login-page">Iniciar Sesión</a></p>
    </div>
  );
}

export default SignUpPage;