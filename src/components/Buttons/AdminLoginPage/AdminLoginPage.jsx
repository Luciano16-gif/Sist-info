import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { getDocs, collection } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './AdminLoginPage.css'; // Importa los estilos específicos del componente

function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Utiliza el hook useNavigate

  const handleLogin = async () => {
    try {
      // Verifica si el código está en Firebase (por ejemplo, en una colección específica)
      const codeCollection = collection(db, 'Códigos Admin-Guías');
      const querySnapshot = await getDocs(codeCollection);
      let validCode = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.Admin1 === code || data.Guía1 === code) {
          validCode = true;
        }
      });

      if (!validCode) {
        alert('Código no válido.');
        return;
      }

      // Aquí puedes agregar la lógica para iniciar sesión como administrador o guía
      // Por ejemplo, podrías utilizar una función personalizada para autenticar al usuario
      // o simplemente establecer el estado `user` para indicar que el usuario ha iniciado sesión.
      setUser({ email: 'admin@example.com' }); // Ejemplo de cómo establecer el usuario
      navigate('/home'); // Redirige al usuario a la página Home después de un inicio de sesión exitoso
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="login-title">Iniciar Sesión como Administrador/Guía</h2>
      <div className="input-container-login">
        <input type="text" placeholder="Ingresa tu código" onChange={(e) => setCode(e.target.value)} />
      </div>
      <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
      <p className="login-link-adminlogin" style={{ marginTop: '20px' }}>¿No eres administrador/guía? <a href="/login-page">Iniciar Sesión</a></p>
    </div>
  );
}

export default AdminLoginPage;