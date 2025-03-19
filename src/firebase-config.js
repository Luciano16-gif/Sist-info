// firebase-config.js - Unified configuration manager
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Define configurations for different profiles using environment variables
const firebaseConfigs = {
  // Santi's configuration
  santi: {
    apiKey: import.meta.env.VITE_FIREBASE_SANTI_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_SANTI_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_SANTI_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_SANTI_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SANTI_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_SANTI_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_SANTI_MEASUREMENT_ID,
  },
  // Chano's configuration
  chano: {
    apiKey: import.meta.env.VITE_FIREBASE_CHANO_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_CHANO_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_CHANO_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_CHANO_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CHANO_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_CHANO_APP_ID,
  }
};

// Select which configuration to use based on environment variable
const configProfile = import.meta.env.VITE_FIREBASE_PROFILE || "santi";
console.log(`Using Firebase configuration profile: ${configProfile}`);

// Get the active configuration
const firebaseConfig = firebaseConfigs[configProfile] || firebaseConfigs.santi;

// Initialize Firebase
let app;
let firebaseError = null;
let analytics;
let analyticsError = null;
let db;
let firestoreError = null;
let auth;
let authError = null;
let functions;
let functionsError = null;

// Use emulators if the environment variable is set to true
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
    connectFunctionsEmulator(functions, "localhost", 5001);
  } catch (error) {
    console.log("Error initializing Functions", error);
    functionsError = error;
  }
  try {
    auth = getAuth(app);
    console.log("Auth initialized");
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
    
    // Enable offline persistence for Firestore
    if (db) {
      (async () => {
        try {
          await enableIndexedDbPersistence(db);
          console.log("Firestore persistence has been enabled.");
        } catch (err) {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.log("Persistence failed: Multiple tabs open");
          } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the features required for persistence
            console.log("Persistence not supported by this browser");
          } else {
            console.error("Unexpected error when enabling persistence:", err);
          }
        }
      })();
    }
  } catch (error) {
    console.log("Error initializing Firestore", error);
    firestoreError = error;
  }
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

export {
  app,
  db,
  auth,
  analytics,
  functions,
  firebaseError,
  firestoreError,
  authError,
  analyticsError,
  functionsError,
};