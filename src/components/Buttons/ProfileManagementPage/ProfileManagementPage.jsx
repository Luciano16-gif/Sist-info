import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase-config'; // Ajusta la ruta si es necesario
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import './ProfileManagementPage.css'; // Importa los estilos específicos del componente

function ProfileManagementPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [numeroTelefonico, setNumeroTelefonico] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [contraseña, setContraseña] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const usersCollection = collection(db, 'Lista de Usuarios');
        const q = query(usersCollection, where("email", "==", "szabala@correo.unimet.edu.ve"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error('Usuario no encontrado.');
          return;
        }

        const userData = querySnapshot.docs[0].data();
        const userRef = querySnapshot.docs[0].ref;

        setNombreCompleto(`${userData.name} ${userData.lastName}`);
        setCorreoElectronico(userData.email);
        setNumeroTelefonico(userData.phone);
        setFechaRegistro(new Date(auth.currentUser.metadata.creationTime).toLocaleDateString()); // Obtener la fecha de registro del usuario desde el Authentication de Firebase
        setContraseña(userData.password); // Obtener la contraseña del usuario desde Firestore
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    getUserData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", "szabala@correo.unimet.edu.ve"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Usuario no encontrado.');
        return;
      }

      const userRef = querySnapshot.docs[0].ref;

      // Verificar la longitud de la nueva contraseña
      if (contraseña.length < 6) {
        alert('La contraseña es muy corta. Debe tener al menos 6 caracteres.');
        return;
      }

      // Verificar las restricciones del número telefónico
      if (numeroTelefonico && (!/^\d{11}$/.test(numeroTelefonico))) {
        alert('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
        return;
      }

      await updateDoc(userRef, {
        name: nombreCompleto.split(' ')[0],
        lastName: nombreCompleto.split(' ').slice(1).join(' '),
        email: correoElectronico,
        phone: numeroTelefonico,
        password: contraseña,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <div className="profile-management-page">
      <h1 className="title">GESTIONAR PERFIL</h1>
      <div className="content-container">
        <img src="..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png" alt="Perfil" className={`profile-image ${isEditing ? 'editable' : ''}`} />
        <div className="info-container">
          <div className="info-item">
            <p className="subtitle">NOMBRE COMPLETO</p>
            {isEditing ? (
              <input
                type="text-profile"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="subtext-input"
              />
            ) : (
              <p className="subtext">{nombreCompleto}</p>
            )}
          </div>
          <div className="info-item">
            <p className="subtitle">CORREO ELECTRÓNICO</p>
            <p className="subtext">{correoElectronico}</p> {/* Mostrar el correo electrónico como un párrafo */}
          </div>
          <div className="info-item">
            <p className="subtitle">NÚMERO TELEFÓNICO</p>
            {isEditing ? (
              <input
                type="tel-profile"
                value={numeroTelefonico}
                onChange={(e) => setNumeroTelefonico(e.target.value)}
                className="subtext-input"
              />
            ) : (
              <p className="subtext">{numeroTelefonico}</p>
            )}
          </div>
          <div className="info-item">
            <p className="subtitle">FECHA DE REGISTRO</p>
            <p className="subtext">{fechaRegistro}</p>
          </div>
          {isEditing && (
            <div className="info-item">
              <p className="subtitle">CONTRASEÑA</p>
              <input
                type="password-profile"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="subtext-input"
              />
            </div>
          )}
        </div>
        <div className="stats-container">
          <div className="stat-item">
            <p className="subtitle">EXPERIENCIAS COMPLETADAS</p>
            <p className="subtext">12 EXPERIENCIAS REALIZADAS</p>
          </div>
          <div className="stat-item">
            <p className="subtitle">EXPERIENCIA MÁS REALIZADA</p>
            <p className="subtext">Ruta 2 (10 VECES COMPLETADA)</p>
          </div>
        </div>
      </div>
      <div className="button-container-profile">
        {!isEditing ? (
          <>
            <button className="edit-profile-button" onClick={handleEditProfile}>
              Editar Perfil
            </button>
            <button className="logout-button">Cerrar Sesión</button>
          </>
        ) : (
          <button className="save-changes-button" onClick={handleSaveChanges}>
            Guardar Cambios
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileManagementPage;