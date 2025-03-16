import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { db } from './../../firebase-config';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import './SupportPage.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function SupportPage() {
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const [guides, setGuides] = useState([]);  // All fetched guides
    const [displayedUsers, setDisplayedUsers] = useState([]); // Filtered users based on userType
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [debugName, setDebugName] = useState("Loading..."); // Debug state
    const [debugEmail, setDebugEmail] = useState("Loading..."); // Debug state
    const [debugUserType, setDebugUserType] = useState("Loading..."); // Debug state

    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in.
                    try {
                        const userDocRef = doc(db, "lista-de-usuarios", user.email);
                        const userDocSnap = await getDoc(userDocRef);

                        if (!userDocSnap.exists()) {
                            console.warn("Usuario no encontrado en Firestore:", user.email);
                            const userData = {
                                email: 'default@example.com',
                                name: 'Unknown User',
                                userType: 'Unknown'
                            };
                            setCurrentUserData(userData);
                            resolve(userData);
                            unsubscribe();
                            return;
                        }

                        const userData = userDocSnap.data();
                        const email = userData.email || 'default@example.com';
                        const name = `${userData.name || ''} ${userData.lastName || ''}`;
                        const userType = userData.userType || 'Unknown';
                        const completeUserData = {
                            email: email,
                            name: name,
                            userType: userType
                        };

                        // *** DEBUGGING: Update debug state *before* setting currentUserData ***
                        setDebugName(name);
                        setDebugEmail(email);
                        setDebugUserType(userType);

                        setCurrentUserData(completeUserData);
                        resolve(completeUserData);
                        unsubscribe();
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        // Reject and unsubscribe on error
                        reject(error);
                        unsubscribe();
                    }
                } else {
                    // No user.
                    setCurrentUserData(null);
                    resolve(null);
                    unsubscribe();
                }
            });
        });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollectionRef = collection(db, "lista-de-usuarios");
                const querySnapshot = await getDocs(usersCollectionRef);  // Fetch ALL users

                const fetchedUsers = [];
                for (const userDoc of querySnapshot.docs) {
                    const data = userDoc.data();
                    const email = data.email || 'unknown@example.com';
                    const lastName = data.lastName || '';
                    const userType = data.userType || 'Unknown';

                    fetchedUsers.push({
                        id: userDoc.id,  // Use email as ID for consistency
                        name: `${data.name || ''} ${lastName}`,
                        email: email,
                        userType: userType,
                    });
                }

                setGuides(fetchedUsers);  // Store ALL users here
            } catch (error) {
                console.error("Error fetching users:", error);
                setSubmitError('Failed to load users. Please refresh the page.');
            }
        };

        fetchUsers();

        const fetchCurrentUser = async () => {
            try {
                await getCurrentUser();
            } catch (error) {
                console.error("Error fetching current user:", error);
                setSubmitError("Failed to load user information. Please refresh.");
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (guides.length > 0 && currentUserData) {
            let filteredUsers = [];
            const adminOption = { id: 'admin', name: 'Administrador', email: 'avila.venturas.grupo.5@gmail.com', userType: 'admin' };

            if (currentUserData.userType === 'admin') {
                filteredUsers = [...guides, adminOption];  // Admins see all
            } else if (currentUserData.userType === 'guia' || currentUserData.userType === 'usuario') {
                // Filter for guides and the admin
                filteredUsers = guides.filter(user => user.userType === 'guia').concat(adminOption);
            } else {
                // Handle unknown user types (optional)
                filteredUsers = [adminOption];
            }
            setDisplayedUsers(filteredUsers);

            // Set default selection
            if (!selectedUser && filteredUsers.length > 0) {
                 //Prioritize selecting admin, if available
                const adminUser = filteredUsers.find(user => user.id === 'admin');
                setSelectedUser(adminUser ? adminUser.id : filteredUsers[0].id);

            }

        }
    }, [guides, currentUserData, selectedUser]); // Include selectedUser for correct default selection

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);
        setIsSubmitting(true);

        if (isLoadingUser) {
            setSubmitError('Please wait while user data is loading.');
            setIsSubmitting(false);
            return;
        }

        if (!currentUserData) {
            setSubmitError('You must be logged in to send a message.');
            setIsSubmitting(false);
            return;
        }

        if (!selectedUser) {
            setSubmitError('Please select a recipient.');
            setIsSubmitting(false);
            return;
        }
        if (!message.trim()) {
            setSubmitError('Please enter a message.');
            setIsSubmitting(false);
            return;
        }

        const selectedRecipient = displayedUsers.find(user => user.id === selectedUser); // Use displayedUsers
        if (!selectedRecipient) {
            setSubmitError('Selected recipient not found.');
            setIsSubmitting(false);
            return;
        }
        const selectedUserName = selectedRecipient.name;
        const selectedUserEmail = selectedRecipient.email;
        const currentTime = new Date().toLocaleTimeString();

        try {
            const templateParams = {
                to_email: selectedUserEmail,
                name: selectedUserName,
                time: currentTime,
                message: message,
                from_email: currentUserData.email,
                from_name: currentUserData.name,
                from_userType: currentUserData.userType
            };

            await emailjs.send(
                "service_w7ihhsb",
                "mensaje-a-soporte",
                templateParams,
                "6gCcBaUJlyaB3IT8J"
            );

            setSubmitSuccess(true);
            setMessage('');
            setTimeout(() => setSubmitSuccess(false), 5000);

        } catch (error) {
            console.error("Error sending email:", error);
            setSubmitError('Message could not be sent. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="soporte-container-support">
            <h1 className="soporte-titulo-support">Soporte Técnico</h1>
            <p className="soporte-subtitulo-support">Contacta con guías o administradores para resolver problemas o recibir feedback.</p>

            {isLoadingUser && <div className="loading-message-support">Loading user data...</div>}

            {submitError && <div className="error-message-support">{submitError}</div>}
            {submitSuccess && <div className="success-message-support">Message sent successfully!</div>}

            <form className="soporte-form-support" onSubmit={handleSubmit}>
                <div className="soporte-campo-support">
                    <label htmlFor="user-select">Seleccionar Usuario:</label>
                    <select
                        id="user-select"
                        value={selectedUser}
                        onChange={handleUserChange}
                        className={`soporte-select-support ${submitError && !selectedUser ? "input-error-support" : ""}`}
                    >
                        {displayedUsers.length > 0 &&
                            displayedUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {currentUserData && currentUserData.userType === 'admin'
                                        ? `${user.name} - ${user.userType}`
                                        : user.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="soporte-campo-support">
                    <label htmlFor="message-input">Mensaje:</label>
                    <textarea
                        id="message-input"
                        value={message}
                        onChange={handleMessageChange}
                        className={`soporte-textarea-support ${submitError && !message.trim() ? "input-error-support" : ""}`}
                        placeholder="Escribe tu mensaje aquí..."
                    />
                </div>
                <button type="submit" className="soporte-boton-support" disabled={isSubmitting || isLoadingUser}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
            </form>
        </div>
    );
}

export default SupportPage;