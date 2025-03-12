// ProfileManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase-config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ProfileManagementPage.css';
import { signOut } from 'firebase/auth';
import storageService from '../../../../src/services/storage-service'; // Importa el nuevo servicio


function ProfileManagementPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [numeroTelefonico, setNumeroTelefonico] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [file, setFile] = useState(null);
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [activities, setActivities] = useState([]);
    const [activitiesPerformed, setActivitiesPerformed] = useState([]);
    const [mostPerformedActivity, setMostPerformedActivity] = useState({ Actividad: '', timesPerformed: 0 });
    const [activitiesCreatedCount, setActivitiesCreatedCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0); // Progress bar state
    const [isUploading, setIsUploading] = useState(false); // Control upload state


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const usersCollection = collection(db, 'Lista de Usuarios');
                    const q = query(usersCollection, where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        console.error('Usuario no encontrado en Firestore.');
                        setLoading(false);
                        await signOut(auth);
                        navigate('/login-page');
                        return;
                    }

                    const userDoc = querySnapshot.docs[0];
                    if (!userDoc.exists()) {
                        console.error('El documento del usuario no existe en Firestore.');
                        setLoading(false);
                        await signOut(auth);
                        navigate('/login-page');
                        return;
                    }

                    const userData = userDoc.data();

                    setNombreCompleto(`${userData.name} ${userData.lastName}`);
                    setCorreoElectronico(userData.email);
                    setNumeroTelefonico(userData.phone);
                    setTipoUsuario(userData.userType);

                    if (user.metadata.creationTime) {
                        const date = new Date(user.metadata.creationTime);
                        const day = date.getDate();
                        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                        ];
                        const month = monthNames[date.getMonth()];
                        const year = date.getFullYear();
                        setFechaRegistro(`${day} de ${month} del ${year}`);
                    } else {
                        setFechaRegistro('');
                    }

                    setFotoPerfilUrl(userData['Foto de Perfil'] || '');

                    if (Array.isArray(userData.activitiesPerformed)) {
                        setActivitiesPerformed(userData.activitiesPerformed);
                    } else if (userData.activitiesPerformed) {
                        setActivitiesPerformed([userData.activitiesPerformed]);
                    } else {
                        setActivitiesPerformed([]);
                    }

                    if (userData.mostPerformedActivity && typeof userData.mostPerformedActivity === 'object'
                        && userData.mostPerformedActivity.Actividad !== undefined && userData.mostPerformedActivity.timesPerformed !== undefined) {
                        setMostPerformedActivity(userData.mostPerformedActivity);
                    } else {
                        setMostPerformedActivity({ Actividad: '', timesPerformed: 0 });
                    }

                    let fetchedActivities = [];
                    if (userData.userType === 'Guia') {
                        if (userData.actualRoute && userData.days && userData.schedule) {
                            if (Array.isArray(userData.actualRoute) && Array.isArray(userData.days) && Array.isArray(userData.schedule)
                                && userData.actualRoute.length === userData.days.length && userData.days.length === userData.schedule.length) {
                                for (let i = 0; i < userData.actualRoute.length; i++) {
                                    fetchedActivities.push({
                                        route: userData.actualRoute[i],
                                        days: userData.days[i],
                                        schedule: userData.schedule[i],
                                    });
                                }
                            } else {
                                console.error("actualRoute, days and schedule are not arrays of the same length or are not arrays");
                            }
                        }
                    }
                    setActivities(fetchedActivities);

                    if (userData.activitiesCreated && Array.isArray(userData.activitiesCreated)) {
                        setActivitiesCreatedCount(userData.activitiesCreated.length);
                    } else {
                        setActivitiesCreatedCount(0);
                    }

                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                    setLoading(false);
                    await signOut(auth);
                    navigate('/login-page');
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
                console.error('Usuario no encontrado para actualizar.');
                return;
            }

            const userRef = querySnapshot.docs[0].ref;

            if (numeroTelefonico && !/^\d{11}$/.test(numeroTelefonico)) {
                alert('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
                return;
            }

            // --- File Upload Logic with Cloudinary ---
            let updateData = {
                name: nombreCompleto.split(' ')[0],
                lastName: nombreCompleto.split(' ').slice(1).join(' '),
                phone: numeroTelefonico,
            };

            if (file) {
                setIsUploading(true); // Start uploading
                const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
                    setIsUploading(false);
                    return;
                }

                const path = `profile-pictures/${auth.currentUser.uid}`; // Use user ID for folder

              try {
                const uploadedFileData = await storageService.uploadFile(path, file);

                // Add Cloudinary URL and filename to updateData
                updateData['Foto de Perfil'] = uploadedFileData.downloadURL;
                updateData['Nombre de Archivo'] = file.name; // Or use a generated name if preferred

                // Update Firestore document
                await updateDoc(userRef, updateData);
                setFotoPerfilUrl(uploadedFileData.downloadURL); // Update displayed image
                alert('Perfil actualizado correctamente!'); //Success
                setIsEditing(false);
                window.location.reload();


                } catch (uploadError) {
                    console.error("Error uploading to Cloudinary:", uploadError);
                    alert('Hubo un error al subir la imagen.  Por favor, inténtalo de nuevo.'); // User-friendly error

                } finally {
                   setIsUploading(false);
                }

            } else {
                // No new file, just update other fields
                await updateDoc(userRef, updateData);
                alert('Perfil actualizado correctamente!');
                setIsEditing(false);
                window.location.reload(); // Or just update the local state

            }



        } catch (error) {
            console.error('Error al guardar los cambios:', error);
             alert('Hubo un error al guardar los cambios.  Por favor, inténtalo de nuevo.'); // User friendly feedback.
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
         // Reset progress when a new file is selected
        setUploadProgress(0);
    };

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
                    <>
                    <input id="file-input" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                   {isUploading && (
                       <div className="progress-bar-container">
                       <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                   )}
                   </>
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
                </div>

                <div className="stats-container">
                    {tipoUsuario === 'admin' ? (
                        <>
                            <div className="stat-item">
                                <p className="subtitle">EXPERIENCIAS CREADAS</p>
                                <p className="subtext">{activitiesCreatedCount} experiencias creadas</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat-item">
                                <p className="subtitle">EXPERIENCIAS COMPLETADAS</p>
                                <p className="subtext">{activitiesPerformed.join(', ')}</p>
                            </div>
                            <div className="stat-item">
                                <p className="subtitle">EXPERIENCIA MÁS REALIZADA</p>
                                <p className="subtext">{mostPerformedActivity.Actividad} = {mostPerformedActivity.timesPerformed} veces completada</p>
                            </div>
                        </>
                    )}

                    {tipoUsuario === 'Guia' && (
                        <div className="stat-item">
                            <p className="subtitle">EXPERIENCIAS ACTUALES</p>
                            {activities.map((activity, index) => (
                                <div key={index}>
                                    <p className="subtext">{activity.route} - {activity.days} [{activity.schedule}]</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="button-container-profile">
                {!isEditing ? (
                    <>
                        <button className="edit-profile-button" onClick={handleEditProfile}>Editar Perfil</button>
                        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <button className="save-changes-button" onClick={handleSaveChanges}>Guardar Cambios</button>
                )}
            </div>
        </div>
    );
}

export default ProfileManagementPage;