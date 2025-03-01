import React, { useState } from 'react';
import { db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { collection, addDoc } from 'firebase/firestore';
import './FirestoreTest.css'; // Importa los estilos específicos del componente

function FirestoreTest() {
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastName, setNewItemLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Nuevo estado para el número telefónico
  const itemsCollection = collection(db, 'testItems');

  const addItem = async () => {
    if (newItemName.trim() !== '' && newItemLastName.trim() !== '' && phoneNumber.trim() !== '') {
      await addDoc(itemsCollection, { name: newItemName, lastName: newItemLastName, phone: phoneNumber });
      setNewItemName(''); // Vacía el campo de entrada después de añadir
      setNewItemLastName(''); // Vacía el campo de entrada después de añadir
      setPhoneNumber(''); // Vacía el campo de entrada después de añadir
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
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Ingresa tu nro telefónico"
          style={{ width: '300px', padding: '10px', border: '5px solid #ffffff', borderRadius: '4px', fontSize: '16px', fontFamily: "'Ysabeau SC', sans-serif", transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease', color: '#333' }}
        />
      </div>
      <div className="button-container" style={{ marginTop: '3px' }}>
        <button className="addbutton" onClick={addItem}>Añadir</button>
      </div>
    </div>
  );
}

export default FirestoreTest;