import React, { useState, useEffect } from 'react';
import './GuideRequest.css';
import { db } from './../../firebase-config'; // Import db
import { doc, getDoc, setDoc } from "firebase/firestore";
import storageService from '../../cloudinary-services/storage-service'; // Import Cloudinary service
import { useAuth } from '../../components/contexts/AuthContext'; // Import useAuth hook

/**
 * GuideRequest component -  A form for potential guides to apply.
 */
function GuideRequest() {
    const { currentUser, userRole } = useAuth(); // Use the AuthContext

    const [formData, setFormData] = useState({
        fullName: '',
        cedula: '',
        address: '',
        email: '',
        phone: '',
        birthDate: '', // Keep this as a string
        weeklyHours: '',
        weeklyDays: '',
        languages: '',
        experience: '',
        qualifications: '',
        image: null,
        imagePreview: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Fetch additional user data not provided by AuthContext if needed
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) {
                setIsLoadingUser(false);
                return;
            }

            try {
                const userDocRef = doc(db, "lista-de-usuarios", currentUser.email);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    const name = `${data.name || ''} ${data.lastName || ''}`;
                    const completeUserData = {
                        email: data.email || currentUser.email,
                        name: name.trim(),
                        cedula: data.cedula || '',
                        address: data.address || '',
                    };
                    
                    setUserData(completeUserData);
                    
                    // Pre-fill form with user data
                    setFormData(prev => ({
                        ...prev,
                        fullName: completeUserData.name || '',
                        email: completeUserData.email || '',
                        cedula: completeUserData.cedula || '',
                        address: completeUserData.address || '',
                    }));
                    
                    // Check if user is already a guide
                    if (userRole === 'guia') {
                        setIsFormDisabled(true);
                        setSubmitError("Ya eres un guía. No puedes enviar otra solicitud.");
                    }
                } else {
                    console.warn("Usuario no encontrado en Firestore:", currentUser.email);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setSubmitError("Failed to load user information. Please refresh.");
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, [currentUser, userRole]);

    // The rest of the component remains mostly the same...
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "birthDate") {
            formattedValue = value.replace(/[^0-9/]/g, '');
            if (formattedValue.length > 2 && formattedValue[2] !== '/') {
              formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
            }
            if (formattedValue.length > 5 && formattedValue[5] !== '/') {
              formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5);
            }
            formattedValue = formattedValue.slice(0, 10);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
        }
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };
    
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            tempErrors.fullName = "Nombre completo es requerido.";
            isValid = false;
        }
        if (!formData.cedula.trim()) {
            tempErrors.cedula = "Número de cédula es requerido.";
            isValid = false;
        }
        if (!formData.address.trim()) {
            tempErrors.address = "Dirección es requerida.";
            isValid = false;
        }
        if (!formData.email.trim()) {
            tempErrors.email = "Correo electrónico es requerido.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Correo electrónico no es válido.";
            isValid = false;
        }
        if (!formData.phone.trim()) {
            tempErrors.phone = "Número de teléfono es requerido.";
            isValid = false;
        }
         if (!formData.birthDate) {
            tempErrors.birthDate = "Fecha de nacimiento es requerida.";
            isValid = false;
        } else {
            const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            if (!dateRegex.test(formData.birthDate)) {
                 tempErrors.birthDate = "Formato de fecha inválido. Use DD/MM/AAAA.";
                 isValid = false;
            }
        }
        if (!formData.weeklyHours) {
            tempErrors.weeklyHours = "Horas semanales son requeridas.";
            isValid = false;
        } else if (isNaN(parseInt(formData.weeklyHours)) || parseInt(formData.weeklyHours) <= 0 ) {
            tempErrors.weeklyHours = "Ingrese un número de horas válido (mayor que cero).";
            isValid = false;

        }
        if (!formData.weeklyDays) {
            tempErrors.weeklyDays = "Días semanales son requeridos.";
            isValid = false;
        }else if (isNaN(parseInt(formData.weeklyDays)) || parseInt(formData.weeklyDays) <= 0 || parseInt(formData.weeklyDays) > 7) {
            tempErrors.weeklyDays = "Ingrese un número de días válido (entre 1 y 7).";
            isValid = false;
        }
        if (!formData.languages.trim()) {
            tempErrors.languages = "Debe indicar al menos un idioma.";
            isValid = false;
        }
        if (!formData.experience.trim()) {
            tempErrors.experience = "Experiencia previa es requerida.";
            isValid = false;
        }
        if (!formData.qualifications.trim()) {
            tempErrors.qualifications = "Por favor, describa qué puede ofrecer al equipo.";
            isValid = false;
        }

        if (!formData.image) {
            tempErrors.image = "Debe subir una foto.";
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

   const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        if (!currentUser) {
            setSubmitError("Debes iniciar sesión para enviar una solicitud.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Use Cloudinary for image upload
            let imageUrl = '';
            if (formData.image) {
                const uploadResult = await storageService.uploadFile('guide_profiles', formData.image); // Use 'guide_profiles' folder
                imageUrl = uploadResult.downloadURL;
            }

            const docRef = doc(db, "solicitudes-guias", currentUser.email);
            const dataToStore = {
                fullName: formData.fullName,
                cedula: formData.cedula,
                address: formData.address,
                email: formData.email,
                phone: formData.phone,
                birthDate: formData.birthDate,
                weeklyHours: formData.weeklyHours,
                weeklyDays: formData.weeklyDays,
                languages: formData.languages,
                experience: formData.experience,
                qualifications: formData.qualifications,
                image: imageUrl, // Store the Cloudinary URL
            };

            await setDoc(docRef, dataToStore);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            setFormData({ // Clear form
                fullName: '',
                cedula: '',
                address: '',
                email: '',
                phone: '',
                birthDate: '',
                weeklyHours: '',
                weeklyDays: '',
                languages: '',
                experience: '',
                qualifications: '',
                image: null,
                imagePreview: null,
            });

        } catch (error) {
            console.error("Error adding document: ", error);
            setSubmitError("Error al guardar la solicitud: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="guide-request-container-guide-request">
            <h1 className="guide-request-title-guide-request">Solicitud para Guía</h1>
            <p className="guide-request-subtitle-guide-request">
                Completa el siguiente formulario para aplicar como guía en nuestro equipo.
            </p>

             {isLoadingUser && <div className="loading-message-guide-request">Loading user data...</div>}

            {showSuccess && (
                <div className="success-message-guide-request">
                ¡Solicitud enviada exitosamente!
                </div>
            )}

            {submitError && <div className="error-message-guide-request">{submitError}</div>}


            <form className="guide-request-form-guide-request" onSubmit={handleSubmit}>
                <div className="form-section-guide-request">
                    <h2 className="form-section-title-guide-request">Información Personal</h2>
                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="fullName">Nombre Completo:</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                            {errors.fullName && <div className="form-error-guide-request">{errors.fullName}</div>}
                        </div>

                        <div className="form-field-guide-request">
                            <label htmlFor="cedula">Número de Cédula:</label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                 disabled={isFormDisabled}
                            />
                            {errors.cedula && <div className="form-error-guide-request">{errors.cedula}</div>}
                        </div>
                    </div>

                    <div className="form-row-guide-request">
                        <div className="form-field-address-guide-request">
                            <label htmlFor="address">Dirección:</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                             {errors.address && <div className="form-error-guide-request">{errors.address}</div>}
                        </div>
                    </div>

                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                disabled
                            />
                            {errors.email && <div className="form-error-guide-request">{errors.email}</div>}
                        </div>

                        <div className="form-field-guide-request">
                            <label htmlFor="phone">Teléfono:</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                            {errors.phone && <div className="form-error-guide-request">{errors.phone}</div>}
                        </div>
                    </div>
                    <div className="form-row-guide-request">
                    <div className="form-field-guide-request">
                            <label htmlFor="birthDate">Fecha de Nacimiento:</label>
                            <input
                                type="text"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                                placeholder="DD/MM/AAAA"
                                className="date-input-guide-request"
                            />
                            {errors.birthDate && <div className="form-error-guide-request">{errors.birthDate}</div>}
                        </div>
                    </div>
                    <div className="form-row-guide-request">
                        <div className="image-upload-container-guide-request">
                            <label>Foto:</label>
                            {formData.imagePreview && (
                                <img src={formData.imagePreview} alt="Preview" className="image-preview-guide-request" />
                            )}
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                disabled={isFormDisabled}
                            />
                            <label htmlFor="image" className="image-upload-button-guide-request">
                                Subir Foto
                            </label>
                            {errors.image && <div className="form-error-guide-request">{errors.image}</div>}
                        </div>
                    </div>
                </div>

                <div className="form-section-guide-request">
                    <h2 className="form-section-title-guide-request">Disponibilidad y Experiencia</h2>
                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="weeklyHours">Horas Semanales Disponibles:</label>
                            <input
                                type="number"
                                id="weeklyHours"
                                name="weeklyHours"
                                value={formData.weeklyHours}
                                onChange={handleChange}
                                placeholder='0'
                                disabled={isFormDisabled}
                            />
                             {errors.weeklyHours && <div className="form-error-guide-request">{errors.weeklyHours}</div>}
                        </div>

                        <div className="form-field-guide-request">
                            <label htmlFor="weeklyDays">Días Semanales Disponibles:</label>
                            <input
                                type="number"
                                id="weeklyDays"
                                name="weeklyDays"
                                value={formData.weeklyDays}
                                onChange={handleChange}
                                placeholder='0'
                                disabled={isFormDisabled}
                            />
                             {errors.weeklyDays && <div className="form-error-guide-request">{errors.weeklyDays}</div>}
                        </div>
                    </div>
                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="languages">Idiomas (separados por comas):</label>
                            <input
                                type="text"
                                id="languages"
                                name="languages"
                                value={formData.languages}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                            {errors.languages && <div className="form-error-guide-request">{errors.languages}</div>}
                        </div>
                    </div>
                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="experience">Experiencia Previa:</label>
                            <textarea
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                            {errors.experience && <div className="form-error-guide-request">{errors.experience}</div>}
                        </div>
                    </div>
                </div>

                <div className="form-section-guide-request">
                    <h2 className="form-section-title-guide-request">Aptitudes y Contribuciones</h2>
                    <div className="form-row-guide-request">
                        <div className="form-field-guide-request">
                            <label htmlFor="qualifications">¿Qué puedes ofrecer al equipo?:</label>
                            <textarea
                                 id="qualifications"
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                disabled={isFormDisabled}
                            />
                              {errors.qualifications && <div className="form-error-guide-request">{errors.qualifications}</div>}
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-button-guide-request" disabled={isSubmitting || isFormDisabled || isLoadingUser}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
            </form>
        </div>
    );
}

export default GuideRequest;