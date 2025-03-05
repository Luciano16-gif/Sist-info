// import React, { useState } from 'react';
// import { auth, db } from '../../../firebase-config';
// import { getDoc, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import './AdminLoginPage.css';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";


// function AdminLoginPage() {
//     const [code, setCode] = useState('');
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     const handleLogin = async () => {
//         try {
//             const adminsDocRef = doc(db, 'Códigos Admin-Guías', 'Admins');
//             const guiasDocRef = doc(db, 'Códigos Admin-Guías', 'Guías');

//             const adminsDocSnapshot = await getDoc(adminsDocRef);
//             const guiasDocSnapshot = await getDoc(guiasDocRef);

//             let validCode = false;
//             let userType = null;

//             // Check admin and guide codes
//             if (adminsDocSnapshot.exists()) {
//                 const adminsData = adminsDocSnapshot.data();
//                 for (const field in adminsData) {
//                     if (adminsData.hasOwnProperty(field) && adminsData[field] === code) {
//                         validCode = true;
//                         userType = 'admin';
//                         break;
//                     }
//                 }
//             }

//             if (!validCode && guiasDocSnapshot.exists()) {
//                 const guiasData = guiasDocSnapshot.data();
//                 for (const field in guiasData) {
//                     if (guiasData.hasOwnProperty(field) && guiasData[field] === code) {
//                         validCode = true;
//                         userType = 'guia';
//                         break;
//                     }
//                 }
//             }

//             if (!validCode) {
//                 alert('Código no válido.');
//                 return;
//             }

//             const usersCollection = collection(db, 'Lista de Usuarios');
//             const q = query(usersCollection, where("code", "==", code));
//             const querySnapshot = await getDocs(q);

//             if (querySnapshot.empty) {
//                 alert('El código ingresado no está asociado a ningún usuario. Por favor, contacta a soporte técnico.');
//                 return;
//             }

//             const userDoc = querySnapshot.docs[0];
//             const userData = userDoc.data();
//             const userDocRef = userDoc.ref;

//             // --- Firebase Authentication Logic ---
//             try {
//                 const signInMethods = await fetchSignInMethodsForEmail(auth, userData.email);

//                 if (signInMethods.length === 0) {
//                     // 1. Email DOES NOT exist in Auth ->  Retrieve password from Firestore and create user
//                     console.log("Email DOES NOT exist in Auth. Retrieving password from Firestore and creating user...");

//                     // Get stored password from Firestore
//                     const userDocSnapshot = await getDoc(userDocRef);
//                     if (!userDocSnapshot.exists()) {
//                         alert("User document not found. Please contact support.");
//                         return;
//                     }
//                     const storedPassword = userDocSnapshot.data().password;

//                     if (!storedPassword) {
//                         alert("Password not found in Firestore. Please contact support.");
//                         return;
//                     }

//                     try {
//                         // Create user with the STORED password
//                         const userCredential = await createUserWithEmailAndPassword(auth, userData.email, storedPassword);
//                         setUser(userCredential.user);

//                         // Update Firestore document (no need to update password, it's already there)
//                         await setDoc(userDocRef, {
//                             name: userData.name,
//                             lastName: userData.lastName,
//                             userType: userType,
//                             code: code,
//                             email: userData.email,
//                         }, { merge: true });
//                         console.log("User created with stored password, document updated.");

//                     } catch (createUserError) {
//                         console.error("Error creating user:", createUserError);
//                         alert(`Error creating user: ${createUserError.message}`);
//                         return;
//                     }

//                 } else {
//                     // 2. Email DOES exist in Auth -> Sign In
//                     console.log("Email DOES exist. Attempting sign-in...");

//                     // Get stored password (same as before)
//                     const userDocSnapshot = await getDoc(userDocRef);
//                     if (!userDocSnapshot.exists()) {
//                         alert("User document not found. Please contact support.");
//                         return;
//                     }
//                     const storedPassword = userDocSnapshot.data().password;

//                     if (!storedPassword) {
//                         alert("Password not found in Firestore.  Please contact support.");
//                         return;
//                     }


//                     try {
//                         // Sign in with the STORED password
//                         const userCredential = await signInWithEmailAndPassword(auth, userData.email, storedPassword);
//                         setUser(userCredential.user);

//                         // Update Firestore Document (no need to update password)
//                         await setDoc(userDocRef, {
//                             name: userData.name,
//                             lastName: userData.lastName,
//                             userType: userType,
//                             code: code,
//                             email: userData.email,
//                         }, { merge: true });
//                         console.log("Sign-in with stored password successful and document updated.");

//                     } catch (signInError) {
//                         if (signInError.code === "auth/wrong-password") {
//                             alert("Incorrect code or password. Try again or contact support.")
//                             return;
//                         } else {
//                             alert(`Error signing in: ${signInError.message}`);
//                             return
//                         }
//                     }
//                 }
//             } catch (authError) {
//                 console.error("Authentication error (fetchSignInMethods):", authError);
//                 alert(`Authentication error: ${authError.message}`);
//                 return;
//             }

//             // --- Navigation ---
//             navigate('/'); // Navigate after successful login/creation

//         } catch (error) {
//             console.error("General error:", error);
//             alert(`Error: ${error.message}`);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <h2 className="admin-login-title">Iniciar Sesión como Guía</h2>
//             <div className="input-container-login">
//                 <input type="text-admin" placeholder="Ingresa tu código" onChange={(e) => setCode(e.target.value)} />
//             </div>
//             <button className="addbutton-login" onClick={handleLogin}>Iniciar Sesión</button>
//             <p className="login-link-adminlogin" style={{ marginTop: '20px' }}>¿No eres Guía? <a href="/login-page">Iniciar Sesión</a></p>
//         </div>
//     );
// }

// export default AdminLoginPage;