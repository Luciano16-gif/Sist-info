// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'; // Ajusta la ruta si es necesario
import { collection, addDoc, getDocs } from 'firebase/firestore';

function FirestoreTest() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');

  const itemsCollection = collection(db, 'testItems');

  const addItem = async () => {
    if (newItem.trim() !== '') {
      await addDoc(itemsCollection, { name: newItem });
      setNewItem('');
      fetchData(); // Actualiza la lista después de añadir
    }
  };

  const fetchData = async () => {
    const dataSnapshot = await getDocs(itemsCollection);
    const items = dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setData(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Prueba de Firestore</h2>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Nuevo item"
      />
      <button onClick={addItem}>Añadir</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FirestoreTest;
