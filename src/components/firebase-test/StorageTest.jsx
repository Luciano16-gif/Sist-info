// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { storage } from '../../firebase-config'; // Ajusta la ruta
import { ref, uploadBytes } from 'firebase/storage';

function StorageTest() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const fileRef = ref(storage, `uploads/${file.name}`); // Define la ruta en storage
      await uploadBytes(fileRef, file);
      alert('Archivo subido!');
      setFile(null)
    }
  };

  return (
    <div>
      <h2>Prueba de Storage</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
    </div>
  );
}

export default StorageTest;
