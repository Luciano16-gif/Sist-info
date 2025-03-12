// ProfileManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../firebase-config';
import { collection, query, where, getDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Correct Imports
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
    const [file, setFile] = useState(null); // Stores the selected file
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState(''); // Stores the URL of the profile picture
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [activities, setActivities] = useState([]);
    const [activitiesPerformed, setActivitiesPerformed] = useState([]);
    const [mostPerformedActivity, setMostPerformedActivity] = useState({ Actividad: '', timesPerformed: 0 });
    const [activitiesCreatedCount, setActivitiesCreatedCount] = useState(0); // New state

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in. Proceed to fetch data.
                try {
                    // Use direct document access with email as document ID
                    const userDocRef = doc(db, 'lista-de-usuarios', user.email);
                    const userDoc = await getDoc(userDocRef);
    
                    if (!userDoc.exists()) {
                        console.error('El documento del usuario no existe en Firestore.');
                        setLoading(false);
                        await signOut(auth); // Sign out
                        navigate('/login-page');
                        return;
                    }
    
                    const userData = userDoc.data();
    
                    setNombreCompleto(`${userData.name} ${userData.lastName}`);
                    setCorreoElectronico(userData.email);
                    setNumeroTelefonico(userData.phone);
                    setTipoUsuario(userData.userType);
    
                    // Format creationTime to "day of month of year"
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
    
                    setContraseña(userData.password || '');
                    setFotoPerfilUrl(userData['Foto de Perfil'] || '');
    
                    // Activities Performed
                    if (Array.isArray(userData.activitiesPerformed)) {
                        setActivitiesPerformed(userData.activitiesPerformed);
                    } else if (userData.activitiesPerformed) {
                        setActivitiesPerformed([userData.activitiesPerformed]);
                    } else {
                        setActivitiesPerformed([]);
                    }
    
                    // Most Performed Activity
                    if (userData.mostPerformedActivity && typeof userData.mostPerformedActivity === 'object'
                        && userData.mostPerformedActivity.Actividad !== undefined && userData.mostPerformedActivity.timesPerformed !== undefined) {
                        setMostPerformedActivity(userData.mostPerformedActivity);
                    } else {
                        setMostPerformedActivity({ Actividad: '', timesPerformed: 0 });
                    }
    
                    // Guide-specific activities. Extract, but DON'T set state yet.
                    let fetchedActivities = []; // Initialize here
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
                    // Set activities state *after* the conditional logic.
                    setActivities(fetchedActivities);
    
                    // Activities created Count
                    if (userData.activitiesCreated && Array.isArray(userData.activitiesCreated)) {
                        setActivitiesCreatedCount(userData.activitiesCreated.length);
                    } else {
                        setActivitiesCreatedCount(0); // Default to 0 if not found or not an array
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
                // No user is signed in.
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

            const usersCollection = collection(db, 'lista-de-usuarios');
            const q = query(usersCollection, where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDoc(q);

            if (querySnapshot.empty) {
                console.error('Usuario no encontrado para actualizar.');
                return;
            }

            const userRef = querySnapshot.docs[0].ref;

             if (numeroTelefonico && !/^\d{11}$/.test(numeroTelefonico)) {
                alert('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
                return;
            }
            if (contraseña && contraseña.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
             }

            // --- File Upload Logic ---
            let fotoPerfilUrl = ''; // Variable to store the download URL
            if (file) {
                // --- FILE TYPE CHECK ---
                const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                   alert('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
                   return; // Stop the upload
                }

                const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${file.name}`); // Unique path
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Progress
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Progress: ' + progress + '%');
                    },
                    (error) => {
                        // Handle error
                        console.error('Error al subir la imagen:', error);
                    },
                    async () => {
                        // Completion - Get URL and update Firestore
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        fotoPerfilUrl = downloadURL; // Store the URL
                        console.log('File available at', downloadURL);

                        // Update user data in Firestore *after* successful upload
                        const updateData = {
                            ['Foto de Perfil']: downloadURL, // Store URL
                            'Nombre de Archivo': file.name, // Store filename (optional)
                            name: nombreCompleto.split(' ')[0],
                            lastName: nombreCompleto.split(' ').slice(1).join(' '),
                            phone: numeroTelefonico,
                        };

                        // Conditionally update password
                        if (contraseña) {
                            updateData.password = contraseña;
                        }
                        await updateDoc(userRef, updateData);
                         window.location.reload();
                    }
                );
            } else {
                // If no new file is selected, update other fields but keep the existing profile picture
                const updateData = {
                    name: nombreCompleto.split(' ')[0],
                    lastName: nombreCompleto.split(' ').slice(1).join(' '),
                    phone: numeroTelefonico,
                    // Don't include 'Foto de Perfil' here
                };
                 // Conditionally update password
                if (contraseña) {
                  updateData.password = contraseña;
                }
                await updateDoc(userRef, updateData);
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
                    <input id="file-input" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
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

                {/* Stats and Conditional Rendering */}
                <div className="stats-container">
                    {/* Conditional Rendering based on userType */}
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


                    {/* Conditional Rendering for Guides - Keep this as is */}
                    {tipoUsuario === 'Guia' && (
                        <div className="stat-item">
                            <p className="subtitle">EXPERIENCIAS ACTUALES</p>
                            {activities.map((activity, index) => (
                                <div  key={index}>
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