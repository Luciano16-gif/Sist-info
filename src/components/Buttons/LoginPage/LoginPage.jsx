import React, { useState, useEffect } from 'react'; // Import useEffect
import { auth, db } from '../../../firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const googleProvider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const domain = 'correo.unimet.edu.ve';
        return email.endsWith(`@${domain}`);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in, navigate to home page
                navigate('/');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);


    const handleLogin = async () => {
        if (!validateEmail(email)) {
            alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
            return;
        }
        try {
            const usersCollection = collection(db, 'Lista de Usuarios');
            const q = query(usersCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Usuario no encontrado.');
                return;
            }

            const userData = querySnapshot.docs[0].data();
            const userRef = querySnapshot.docs[0].ref; // Get document reference


            if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
                alert('Ya utilizaste otro método de Registro/Inicio de Sesión');
                return;
            }

            // No need to check password here. signInWithEmailAndPassword does it
            const userCredential = await signInWithEmailAndPassword(auth, email, password); // Use it here

            // Update user type to "usuario" AFTER successful login
            await updateDoc(userRef, { userType: "usuario" });

            setEmail('');
            setPassword('');
            // No navigate('/') here, onAuthStateChanged handles it
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('Contraseña incorrecta.');
                return;
            }
            if (error.code === 'auth/user-not-found') {
                alert('Usuario no encontrado.');
                return;
            }
            if (error.code === 'auth/invalid-email') {
                alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
                return;
            }
            alert(`Error: ${error.message}`);
        }
    };


    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userEmail = result.user.email;

            if (!validateEmail(userEmail)) {
                alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
                await signOut(auth);
                return;
            }

            const usersCollection = collection(db, 'Lista de Usuarios');
            const q = query(usersCollection, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('No puedes iniciar sesión con un correo que no se encuentra registrado.');
                await signOut(auth);
                return;
            }

            const userRef = querySnapshot.docs[0].ref; // Get document reference
            // Update user type to "usuario" AFTER successful login
            await updateDoc(userRef, { userType: "usuario" });

            // No setUser or navigate here - onAuthStateChanged handles it
            // No navigate here
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="login-title">Iniciar Sesión</h2>
            <div className="input-container-login">
                <input type="email-login" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password-login" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
            <button className="google-button-login" onClick={handleGoogleSignIn}>
                <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
                Iniciar Sesión con Google
            </button>
            <p className="signup-link-login" style={{ marginTop: '20px' }}>¿No tienes cuenta? <a href="/sign-up-page">Registrarse</a></p>
        </div>
    );
}

export default LoginPage;