import React, { useState } from 'react';
import { auth, db } from '../../../firebase-config';
import { getDoc, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Import query, where, getDocs
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null); // Consider removing if not used
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const adminsDocRef = doc(db, 'Códigos Admin-Guías', 'Admins');
      const guiasDocRef = doc(db, 'Códigos Admin-Guías', 'Guías');

      const adminsDocSnapshot = await getDoc(adminsDocRef);
      const guiasDocSnapshot = await getDoc(guiasDocRef);

      let validCode = false;
      let userType = null;
      let userName = null;
    //  let userEmailFromCode = null; // No longer needed

      // Check admin codes
      if (adminsDocSnapshot.exists()) {
        const adminsData = adminsDocSnapshot.data();
        for (const field in adminsData) {
          if (adminsData.hasOwnProperty(field) && adminsData[field] === code) {
            validCode = true;
            userType = 'admin';
            userName = field;
            // userEmailFromCode = `${userName.toLowerCase().replace(/\s+/g, '')}@example.com`; // No longer needed
            break;
          }
        }
      }

      // Check guide codes
      if (!validCode && guiasDocSnapshot.exists()) {
        const guiasData = guiasDocSnapshot.data();
        for (const field in guiasData) {
          if (guiasData.hasOwnProperty(field) && guiasData[field] === code) {
            validCode = true;
            userType = 'guia';
             userName = field;
            // userEmailFromCode = `${userName.toLowerCase().replace(/\s+/g, '')}@example.com`; // No longer needed
            break;
          }
        }
      }

      if (!validCode) {
        alert('Código no válido.');
        return;
      }

      // --- Query the "Lista de Usuarios" collection for the code ---
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("code", "==", code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('El código ingresado no está asociado a ningún usuario. Por favor, contacta a soporte técnico.');
        return;
      }

        // Get the first user document. There should only be one.
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        userName = `${userData.name} ${userData.lastName}` //Now, it will use the correct names

        // Update user document (if needed)
        // Use the document ID from the query
          await setDoc(doc(usersCollection, userDoc.id), {
            name: userData.name, //keep original values
            lastName: userData.lastName, //keep original values
            userType: userType, //Keep original values
            code: code,          //keep original values
            email: userData.email //keep original values
            }, { merge: true });

          setUser({ email: userData.email});


      if (userType === 'admin') {
        navigate('/');
      } else if (userType === 'guia') {
        navigate('/');
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