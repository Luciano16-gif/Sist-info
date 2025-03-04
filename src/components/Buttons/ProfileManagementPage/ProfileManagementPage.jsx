import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../firebase-config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './ProfileManagementPage.css';
import { signOut } from 'firebase/auth';

function ProfileManagementPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [numeroTelefonico, setNumeroTelefonico] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [file, setFile] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const usersCollection = collection(db, 'Lista de Usuarios');
          const q = query(usersCollection, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.error('Usuario no encontrado.');
            setLoading(false);
            return;
          }

          const userData = querySnapshot.docs[0].data();

          setNombreCompleto(`${userData.name} ${userData.lastName}`);
          setCorreoElectronico(userData.email);
          setNumeroTelefonico(userData.phone);

          // Format the creation time.
          const creationTime = new Date(user.metadata.creationTime);
          const formattedDate = `${creationTime.getDate()} DE ${creationTime.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} DE ${creationTime.getFullYear()}`;
          setFechaRegistro(formattedDate);

          setContraseña(userData.password);
          setFotoPerfilUrl(userData['Foto de Perfil']);

        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login-page');
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (!auth.currentUser) {
          console.error("No user logged in.");
          return;
      }

      const usersCollection = collection(db, 'Lista de Usuarios');
      const q = query(usersCollection, where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Usuario no encontrado.');
        return;
      }

      const userRef = querySnapshot.docs[0].ref;

      if (numeroTelefonico && (!/^\d{11}$/.test(numeroTelefonico))) {
        alert('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
        return;
      }
      if (contraseña.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      let fotoPerfilUrl = '';
      if (file) {
        const storageRef = ref(storage, `profile-pictures/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progress: ' + progress + '%');
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            fotoPerfilUrl = downloadURL;
            console.log('File available at', downloadURL);

            await updateDoc(userRef, {
              'Foto de Perfil': downloadURL,
              'Nombre de Archivo': file.name,
              name: nombreCompleto.split(' ')[0],
              lastName: nombreCompleto.split(' ').slice(1).join(' '),
              phone: numeroTelefonico,
              password: contraseña
            });
            window.location.reload();
          }
        );
      } else {
        await updateDoc(userRef, {
          name: nombreCompleto.split(' ')[0],
          lastName: nombreCompleto.split(' ').slice(1).join(' '),
          phone: numeroTelefonico,
          password: contraseña
        });
        window.location.reload();
      }

      setIsEditing(false);

    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login-page');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Inside ProfileManagementPage.jsx
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="profile-management-page">
      <h1 className="title">GESTIONAR PERFIL</h1>
      <div className="content-container">
        <img src={fotoPerfilUrl || "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png"} alt="Perfil" className={`profile-image ${isEditing ? 'editable' : ''}`} onClick={() => isEditing && document.getElementById('file-input').click()} />
        {isEditing && (
          <input id="file-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        )}
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
            <p className="subtext">{correoElectronico}</p>
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
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
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