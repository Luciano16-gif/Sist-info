import React, { useState } from 'react';
import { auth, db } from '../../../../firebase/firebase-config'; // Ajusta la ruta si es necesario
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import './SignUpPage.css'; // Importa los estilos específicos del componente

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
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
      if (newItemName.trim() !== '' && newItemLastName.trim() !== '') {
        await addDoc(itemsCollection, { name: newItemName, lastName: newItemLastName });
        setNewItemName(''); // Vacía el campo de entrada después de añadir
        setNewItemLastName(''); // Vacía el campo de entrada después de añadir
        alert('Item añadido!');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Registro y Prueba de Firestore</h2>
      <div className="input-container" style={{ display: 'flex', gap: '300px' }}>
        <div>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
          <input
            type="text"
            value={newItemLastName}
            onChange={(e) => setNewItemLastName(e.target.value)}
            placeholder="Ingresa tu apellido"
          />
        </div>
      </div>
      <button className="addbutton" onClick={handleExecute}>Ejecutar</button>
      {user && <p>Usuario logeado: {user.email}</p>}
    </div>
  );
}

export default SignUpPage;