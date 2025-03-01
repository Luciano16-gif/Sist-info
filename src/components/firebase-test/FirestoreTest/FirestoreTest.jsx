// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { collection, addDoc } from 'firebase/firestore';
import './FirestoreTest.css'; // Importa los estilos específicos del componente

function FirestoreTest() {
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
  const itemsCollection = collection(db, 'testItems');

  const addItem = async () => {
    if (newItemName.trim() !== '' && newItemLastName.trim() !== '') {
      await addDoc(itemsCollection, { name: newItemName, lastName: newItemLastName });
      setNewItemName(''); // Vacía el campo de entrada después de añadir
      setNewItemLastName(''); // Vacía el campo de entrada después de añadir
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="input-container">
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
      <div className="button-container" style={{ marginTop: '3px' }}>
        <button className="addbutton" onClick={addItem}>Añadir</button>
      </div>
    </div>
  );
}

export default FirestoreTest;