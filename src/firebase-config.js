import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager 
} from "firebase/firestore";
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

// Initialize the Firebase app
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized");
} catch (error) {
  console.error("Error initializing Firebase app:", error);
  firebaseError = error;
}

// Use emulators if the environment variable is set to true
if (import.meta.env.VITE_USE_EMULATORS === "true") {
  try {
    db = getFirestore(app);
    console.log("Firestore initialized");
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    console.error("Error initializing Firestore with emulator:", error);
    firestoreError = error;
  }
  
  try {
    functions = getFunctions(app);
    console.log("Functions initialized");
    connectFunctionsEmulator(functions, "localhost", 5001);
  } catch (error) {
    console.error("Error initializing Functions with emulator:", error);
    functionsError = error;
  }
  
  try {
    auth = getAuth(app);
    console.log("Auth initialized");
    connectAuthEmulator(auth, "http://localhost:9099");
  } catch (error) {
    console.error("Error initializing Auth with emulator:", error);
    authError = error;
  }
  
  console.log("Using Firebase Emulators");
} else {
  // Initialize services for production
  try {
    analytics = getAnalytics(app);
    console.log("Analytics initialized");
  } catch (error) {
    console.warn("Error initializing Analytics - this is common in dev environments:", error);
    analyticsError = error;
  }

  // Initialize Firestore with better persistence settings
  try {
    // Use the new method that supports multi-tab usage
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      })
    });
    console.log("Firestore initialized with robust persistence settings");
  } catch (initError) {
    console.error("Error initializing Firestore with modern settings:", initError);
    
    // Fallback to traditional method if newer approach fails
    try {
      db = getFirestore(app);
      console.log("Firestore initialized with legacy method");
      
      // Only try to enable persistence if not already enabled
      if (typeof window !== 'undefined' && window.navigator.onLine) {
        (async () => {
          try {
            await enableIndexedDbPersistence(db);
            console.log("Firestore persistence has been enabled");
          } catch (err) {
            if (err.code === 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled in one tab at a time
              console.warn("Persistence not enabled: Multiple tabs open");
            } else if (err.code === 'unimplemented') {
              // Browser doesn't support persistence
              console.warn("Persistence not supported by this browser");
            } else {
              console.error("Unexpected error when enabling persistence:", err);
            }
            // Continue without persistence - app will still work
          }
        })();
      } else {
        console.log("Skipping persistence - offline or not in browser environment");
      }
    } catch (fallbackError) {
      console.error("Error initializing Firestore with fallback method:", fallbackError);
      firestoreError = fallbackError;
    }
  }
  
  try {
    auth = getAuth(app);
    console.log("Auth initialized");
  } catch (error) {
    console.error("Error initializing Auth:", error);
    authError = error;
  }
  
  try {
    functions = getFunctions(app);
    console.log("Functions initialized");
  } catch (error) {
    console.error("Error initializing Functions:", error);
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