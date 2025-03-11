// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from 'firebase/auth'; // Import updateProfile
import { collection, getDocs, query, where, updateDoc, doc, setDoc } from 'firebase/firestore'; //Import setDoc
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
                navigate('/'); // Or wherever your main content is
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);


    const handleLogin = async () => {
        const trimmedEmail = email.trim(); // TRIM EMAIL

        if (!validateEmail(trimmedEmail)) { // Use trimmedEmail for validation
            alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
            return;
        }
        try {

            const usersCollection = collection(db, 'Lista de Usuarios');
            const q = query(usersCollection, where("email", "==", trimmedEmail)); // Use trimmedEmail
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Usuario no encontrado.');
                return;
            }
            //No es necesario hacer esto, porque el registro ya se encarga de agregar el usuario a la base de datos
            /*
            const userData = querySnapshot.docs[0].data();
            const userRef = querySnapshot.docs[0].ref; // Get document reference


            if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
                alert('Ya utilizaste otro método de Registro/Inicio de Sesión');
                return;
            }
            */

            const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password); // Use trimmedEmail

            setEmail('');
            setPassword('');

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
        const user = result.user;
        const userEmail = user.email;
        const trimmedUserEmail = userEmail.trim(); // TRIM EMAIL

        if (!validateEmail(trimmedUserEmail)) { // Use trimmed email
            alert('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
            await signOut(auth); //Sign out if invalid email
            return;
        }

        const usersCollection = collection(db, 'Lista de Usuarios');
        const q = query(usersCollection, where("email", "==", trimmedUserEmail)); // Use trimmed email
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
                // User does NOT exist in Firestore, create them!
              await setDoc(doc(db, "Lista de Usuarios", user.email.trim()), { //TRIM
                email: user.email.trim(), //TRIM
                name: user.displayName.split(" ")[0] || "", // Use displayName from Google
                lastName: user.displayName.split(" ")[1] || "", //Use displayName
                ['Foto de Perfil']: user.photoURL || "url_por_defecto.jpg", // Use photoURL from Google
                phone: "",
                userType: "usuario",
                'Registro/Inicio de Sesión': 'Google Authentication',
            });
            console.log("Usuario registrado con Google y documento creado:", user.email)
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="login-title">Iniciar Sesión</h2>
            <div className="input-container-login">
                <input type="email-login" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                <input type="password-login" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
            <button className="google-button-login" onClick={handleGoogleSignIn}>
                <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
                Iniciar Sesión con Google
            </button>
            <p className="signup-link-login" style={{ marginTop: '20px' }}>¿No tienes cuenta? <a href="/signUpPage">Registrarse</a></p>
        </div>
    );
}

export default LoginPage;