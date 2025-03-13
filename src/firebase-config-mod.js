// firebase-config.js
/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// Eliminamos la importación de Storage
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR3iwS7zRmxQgqxGIVG_Bv3NjaRNWB-Cw",
  authDomain: "js-react-firebase.firebaseapp.com",
  projectId: "js-react-firebase",
  storageBucket: "js-react-firebase.firebasestorage.app",
  messagingSenderId: "596096125768",
  appId: "1:596096125768:web:5fdce7ea1e5e813c83817d",
  measurementId: "G-XT535VGT68",
};

// Initialize Firebase
let app;
let firebaseError = null;
let analytics;
let analyticsError = null;
let db;
let firestoreError = null;
// Eliminamos las variables relacionadas con Storage
let auth;
let authError = null;
let functions;
let functionsError = null;

// Usar emuladores si la variable de entorno está establecida en true
if (import.meta.env.VITE_USE_EMULATORS === "true") {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized");
  try {
    db = getFirestore(app);
    console.log("Firestore initialized");
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    console.log("Error initializing Firestore", error);
    firestoreError = error;
  }
  try {
    functions = getFunctions(app);
    console.log("Functions initialized");
    connectFunctionsEmulator(functions, "localhost", 5001); // Conecta el emulador de functions
  } catch (error) {
    console.log("Error initializing Functions", error);
    functionsError = error;
  }
  // Eliminamos la inicialización de Storage
  try {
    auth = getAuth(app);
    console.log("Auth initialized");
    // @ts-ignore
    connectAuthEmulator(auth, "http://localhost:9099");
  } catch (error) {
    console.log("Error initializing Auth", error);
    authError = error;
  }
  console.log("Using Firebase Emulators");
} else {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized");
  try {
    analytics = getAnalytics(app);
    console.log("Analytics initialized");
  } catch (error) {
    console.log("Error initializing Analytics", error);
    analyticsError = error;
  }
  try {
    db = getFirestore(app);
    console.log("Firestore initialized");
  } catch (error) {
    console.log("Error initializing Firestore", error);
    firestoreError = error;
  }
  // Eliminamos la inicialización de Storage
  try {
    auth = getAuth(app);
    console.log("Auth initialized");
  } catch (error) {
    console.log("Error initializing Auth", error);
    authError = error;
  }
  try {
    functions = getFunctions(app);
    console.log("Functions initialized");
  } catch (error) {
    console.log("Error initializing Functions", error);
    functionsError = error;
  }
  console.log("Using Firebase Real Services");
}

try {
  analytics = getAnalytics(app);
  console.log("Analytics initialized");
} catch (error) {
  console.log("Error initializing Analytics", error);
  analyticsError = error;
}

export {
  app,
  db,
  // Eliminamos storage de las exportaciones
  auth,
  analytics,
  functions,
  firebaseError,
  firestoreError,
  // Eliminamos storageError de las exportaciones
  authError,
  analyticsError,
  functionsError,
}; // Exporta functions
*/