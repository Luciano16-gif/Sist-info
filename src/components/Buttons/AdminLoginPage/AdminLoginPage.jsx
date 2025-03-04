import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { getDoc, doc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './AdminLoginPage.css'; // Importa los estilos específicos del componente

function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Utiliza el hook useNavigate

  const handleLogin = async () => {
    try {
      // Verifica si el código está en Firebase (por ejemplo, en una colección específica)
      const adminsDocRef = doc(db, 'Códigos Admin-Guías', 'Admins');
      const guiasDocRef = doc(db, 'Códigos Admin-Guías', 'Guías');

      const adminsDocSnapshot = await getDoc(adminsDocRef);
      const guiasDocSnapshot = await getDoc(guiasDocRef);

      let validCode = false;
      let userType = null;

      if (adminsDocSnapshot.exists()) {
        const adminsData = adminsDocSnapshot.data();
        if (adminsData.codigo === code) {
          validCode = true;
          userType = 'admin';
        }
      }

      if (guiasDocSnapshot.exists()) {
        const guiasData = guiasDocSnapshot.data();
        if (guiasData.codigo === code) {
          validCode = true;
          userType = 'guia';
        }
      }

      if (!validCode) {
        alert('Código no válido.');
        return;
      }

      // Aquí puedes agregar la lógica para iniciar sesión como administrador o guía
      // Por ejemplo, podrías utilizar una función personalizada para autenticar al usuario
      // o simplemente establecer el estado `user` para indicar que el usuario ha iniciado sesión.
      setUser({ email: 'admin@example.com' }); // Ejemplo de cómo establecer el usuario

      // Redirige al usuario a la ruta correspondiente
      if (userType === 'admin') {
        navigate('/admin'); // Redirige al usuario a la página de administrador después de un inicio de sesión exitoso
      } else if (userType === 'guia') {
        navigate('/guia'); // Redirige al usuario a la página de guía después de un inicio de sesión exitoso
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="admin-login-title">Iniciar Sesión como Guía</h2>
      <div className="input-container-login">
        <input type="text-admin" placeholder="Ingresa tu código" onChange={(e) => setCode(e.target.value)} />
      </div>
      <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
      <p className="login-link-adminlogin" style={{ marginTop: '20px' }}>¿No eres Guía? <a href="/login-page">Iniciar Sesión</a></p>
    </div>
  );
}

export default AdminLoginPage;