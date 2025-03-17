import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ProfileManagementPage.css';
import { AuthButton, ErrorMessage } from '../Auth/AuthComponents';
import { useAuth } from '../contexts/AuthContext';
import { validatePhone } from '../utils/validationUtils';
import { useFormValidation } from '../hooks/auth-hooks/useFormValidation';
import storageService from '../../cloudinary-services/storage-service';

// Import sub-components
import ProfileImageSection from './ProfileImageSection';
import PersonalInfoSection from './PersonalInfoSection';
import StatsSection from './StatsSection';
import SuccessMessage from './SuccessMessage';

/**
 * Profile Management Page Component
 * Allows users to view and edit their profile information
 */
function ProfileManagementPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [file, setFile] = useState(null);
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [activities, setActivities] = useState([]);
    const [activitiesPerformed, setActivitiesPerformed] = useState([]);
    const [mostPerformedActivity, setMostPerformedActivity] = useState({ Actividad: '', timesPerformed: 0 });
    const [activitiesCreatedCount, setActivitiesCreatedCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Use the auth context - get updateProfilePhoto function to update photo URL in context
    const { currentUser, logout, error, setError, updateProfilePhoto, profilePhotoUrl } = useAuth();

    // Form validation hook
    const { 
      formData, 
      formErrors, 
      handleInputChange, 
      handleBlur, 
      setFormData,
      setFormErrors
    } = useFormValidation(
      {
        nombreCompleto: '',
        correoElectronico: '',
        numeroTelefonico: ''
      },
      handleSaveChanges
    );

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) {
                setLoading(false);
                navigate('/login-page');
                return;
            }

            try {
                const usersCollection = collection(db, 'lista-de-usuarios');
                const q = query(usersCollection, where("email", "==", currentUser.email));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.error('Usuario no encontrado en Firestore.');
                    setLoading(false);
                    await logout();
                    navigate('/login-page');
                    return;
                }

                const userDoc = querySnapshot.docs[0];
                if (!userDoc.exists()) {
                    console.error('El documento del usuario no existe en Firestore.');
                    setLoading(false);
                    await logout();
                    navigate('/login-page');
                    return;
                }

                const userData = userDoc.data();

                // Update form data
                setFormData({
                    nombreCompleto: `${userData.name || ''} ${userData.lastName || ''}`,
                    correoElectronico: userData.email || '',
                    numeroTelefonico: userData.phone || ''
                });

                setTipoUsuario(userData.userType || '');

                if (currentUser.metadata.creationTime) {
                    const date = new Date(currentUser.metadata.creationTime);
                    const day = date.getDate();
                    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ];
                    const month = monthNames[date.getMonth()];
                    const year = date.getFullYear();
                    setFechaRegistro(`${day} de ${month} del ${year}`);
                } else {
                    setFechaRegistro('No disponible');
                }

                // Set photo URL from Firestore
                const photoUrl = userData['Foto de Perfil'] || '';
                setFotoPerfilUrl(photoUrl);

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
                setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser, navigate, logout, setError, setFormData]);

    // Use profilePhotoUrl from context when available
    useEffect(() => {
        if (profilePhotoUrl && !fotoPerfilUrl) {
            setFotoPerfilUrl(profilePhotoUrl);
        }
    }, [profilePhotoUrl]);

    // Handle success message dismissal
    const handleDismissSuccess = () => {
        setSuccessMessage('');
    };

    // Enable editing mode
    const handleEditProfile = () => {
        setIsEditing(true);
        setError('');
        setSuccessMessage('');
    };

    // Save profile changes
    async function handleSaveChanges() {
        try {
            if (!currentUser) {
                setError('No hay sesión de usuario activa. Por favor, inicia sesión de nuevo.');
                return;
            }

            // Validate phone number using our utility function
            const phoneValidation = validatePhone(formData.numeroTelefonico, false);
            if (!phoneValidation.isValid) {
                setFormErrors({
                    ...formErrors,
                    numeroTelefonico: phoneValidation.message
                });
                return;
            }

            const usersCollection = collection(db, 'lista-de-usuarios');
            const q = query(usersCollection, where("email", "==", currentUser.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Usuario no encontrado para actualizar.');
                return;
            }

            const userRef = querySnapshot.docs[0].ref;

            // Prepare update data
            let updateData = {
                name: formData.nombreCompleto.split(' ')[0],
                lastName: formData.nombreCompleto.split(' ').slice(1).join(' '),
                phone: formData.numeroTelefonico,
            };

            if (file) {
                setIsUploading(true);
                setUploadProgress(10);
                
                const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    setError('Tipo de archivo no válido. Solo se permiten imágenes PNG, JPEG y WebP.');
                    setIsUploading(false);
                    return;
                }

                try {
                    const path = `profile-pictures/${currentUser.uid}`;
                    
                    // Simulate progress (actual progress events aren't available in the current implementation)
                    const progressInterval = setInterval(() => {
                        setUploadProgress(prev => {
                            if (prev >= 90) {
                                clearInterval(progressInterval);
                                return 90;
                            }
                            return prev + 10;
                        });
                    }, 300);
                    
                    const uploadedFileData = await storageService.uploadFile(path, file);
                    clearInterval(progressInterval);
                    setUploadProgress(100);
                    
                    // Add Cloudinary URL and filename to updateData
                    updateData['Foto de Perfil'] = uploadedFileData.downloadURL;
                    updateData['Nombre de Archivo'] = file.name;

                    // Update Firestore document
                    await updateDoc(userRef, updateData);
                    
                    // Set local state with new image URL
                    setFotoPerfilUrl(uploadedFileData.downloadURL);
                    
                    // Update photo URL in AuthContext to reflect changes immediately in menus
                    updateProfilePhoto(uploadedFileData.downloadURL);
                    
                    setError('');
                    setSuccessMessage('¡Perfil actualizado correctamente!');
                    setIsEditing(false);
                    setFile(null);
                    setUploadProgress(0);
                    
                    // Clean up the preview URL after saving
                    if (previewImageUrl) {
                        URL.revokeObjectURL(previewImageUrl);
                        setPreviewImageUrl(null);
                    }
                } catch (uploadError) {
                    console.error("Error uploading to Cloudinary:", uploadError);
                    setError('Error al subir la imagen. Por favor, inténtalo de nuevo.');
                } finally {
                    setIsUploading(false);
                }
            } else {
                // No new file, just update other fields
                await updateDoc(userRef, updateData);
                setSuccessMessage('¡Perfil actualizado correctamente!');
                setIsEditing(false);
                setError('');
            }
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            setError('Error al guardar los cambios. Por favor, inténtalo de nuevo.');
        }
    }

    // Handle user logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login-page');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
        }
    };

    // Handle file selection for profile image
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Revoke previous preview URL to prevent memory leaks
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
            
            // Create a preview URL for the selected file
            const preview = URL.createObjectURL(selectedFile);
            setPreviewImageUrl(preview);
            setFile(selectedFile);
            setUploadProgress(0);
            setError('');
            setSuccessMessage('');
        }
    };

    // Cancel editing mode
    const handleCancelEdit = () => {
        setIsEditing(false);
        setFile(null);
        setUploadProgress(0);
        setError('');
        setSuccessMessage('');
        
        // Clean up the preview URL when canceling edit
        if (previewImageUrl) {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImageUrl(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading-container min-h-screen">
                <div className="spinner"></div>
                <p>Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="profile-management-page">
            <h1 className="profile-title">GESTIONAR PERFIL</h1>

            <div className="message-container">
                {error && <ErrorMessage message={error} />}
                {successMessage && (
                    <SuccessMessage 
                        message={successMessage} 
                        duration={5000}
                        onDismiss={handleDismissSuccess}
                    />
                )}
            </div>

            <div className="profile-content">
                <ProfileImageSection 
                    fotoPerfilUrl={fotoPerfilUrl}
                    isEditing={isEditing}
                    handleFileChange={handleFileChange}
                    file={file}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                    previewImageUrl={previewImageUrl}
                />

                <div className="profile-details">
                    <PersonalInfoSection 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleBlur={handleBlur}
                        formErrors={formErrors}
                        isEditing={isEditing}
                        fechaRegistro={fechaRegistro}
                    />

                    <StatsSection 
                        tipoUsuario={tipoUsuario}
                        activitiesCreatedCount={activitiesCreatedCount}
                        activitiesPerformed={activitiesPerformed}
                        mostPerformedActivity={mostPerformedActivity}
                        activities={activities}
                    />
                </div>
            </div>

            <div className="profile-actions">
                {!isEditing ? (
                    <>
                        <AuthButton 
                            className="action-button edit-button" 
                            onClick={handleEditProfile}
                        >
                            Editar Perfil
                        </AuthButton>
                        <AuthButton 
                            className="action-button logout-button" 
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </AuthButton>
                    </>
                ) : (
                    <>
                        <AuthButton 
                            className="action-button save-button" 
                            onClick={handleSaveChanges} 
                            disabled={isUploading}
                        >
                            {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                        </AuthButton>
                        <AuthButton 
                            className="action-button cancel-button" 
                            onClick={handleCancelEdit} 
                            disabled={isUploading}
                        >
                            Cancelar
                        </AuthButton>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileManagementPage;