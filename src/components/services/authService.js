import { auth, db } from '../../firebase-config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc,
  getDoc // Add this import
} from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
const UNIMET_DOMAIN = 'correo.unimet.edu.ve';
const USERS_COLLECTION = 'lista-de-usuarios';

// Validation utilities
export const validateEmail = (email) => {
  const trimmedEmail = email.trim();
  return trimmedEmail.endsWith(`@${UNIMET_DOMAIN}`);
};

export const validatePhone = (phone) => {
  return phone ? /^\d{11}$/.test(phone) : true;
};

// Error message handling
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/invalid-email': 'Por favor, utiliza un correo electrónico válido.',
    'auth/email-already-in-use': 'Este correo electrónico ya está en uso.',
    'auth/popup-closed-by-user': 'Se cerró la ventana de autenticación de Google.',
    'auth/cancelled-popup-request': 'Operación cancelada. Por favor, inténtalo de nuevo.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
    'default': 'Ocurrió un error durante la autenticación.'
  };
  
  return errorMessages[errorCode] || errorMessages.default;
};

// Authentication functions
export const emailSignIn = async (email, password) => {
  const trimmedEmail = email.trim();
  
  // Validate email
  if (!validateEmail(trimmedEmail)) {
    throw new Error('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
  }

  try {
    // Check if user exists by directly accessing the document
    const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado.');
    }

    const userData = userDoc.data();
    if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
      throw new Error('Este correo está registrado con Google Authentication. Por favor, use la opción de Google para iniciar sesión.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = getAuthErrorMessage(error.code) || error.message;
    throw new Error(errorMessage);
  }
};

export const emailSignUp = async (userData) => {
  const { email, password, name, lastName, phone } = userData;
  const trimmedEmail = email.trim();
  
  // Validate email and phone
  if (!validateEmail(trimmedEmail)) {
    throw new Error('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
  }
  
  if (!validatePhone(phone)) {
    throw new Error('El número telefónico debe tener exactamente 11 dígitos y no puede contener letras.');
  }

  try {
    // Check if user already exists by direct document access
    const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      throw new Error('Este correo ya está registrado.');
    }

    // Create the Firebase auth user first
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    const user = userCredential.user;
    
    try {
      // Create user document with the document ID as the email
      await setDoc(userDocRef, {
        email: trimmedEmail,
        name,
        lastName,
        phone,
        'Registro/Inicio de Sesión': 'Correo-Contraseña',
        userType: "usuario",
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: []
      });
      
      return user;
    } catch (firestoreError) {
      // If Firestore write fails, delete the auth user to avoid orphaned accounts
      console.error("Error writing to Firestore: ", firestoreError);
      
      try {
        await user.delete();
      } catch (deleteError) {
        console.error("Failed to delete auth user after Firestore error: ", deleteError);
      }
      
      // Rethrow the original error with more specific information
      throw new Error(`Error al guardar datos de usuario: ${firestoreError.message || firestoreError.code || 'Revise los permisos de Firestore'}`);
    }
  } catch (error) {
    console.error("Sign up error:", error);
    const errorMessage = getAuthErrorMessage(error.code) || error.message;
    throw new Error(errorMessage);
  }
};

export const googleAuth = async (isSignUp = false) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const trimmedEmail = user.email.trim();

    // Validate email - important check!
    if (!validateEmail(trimmedEmail)) {
      // Sign out immediately to prevent any auth state changes
      await signOut(auth);
      // Wait a moment for the signOut to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      // Throw an error with clear messaging
      throw new Error('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
    }

    // Use direct document access instead of queries
    const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
    const userDoc = await getDoc(userDocRef);

    // For sign up, check if user already exists
    if (isSignUp && userDoc.exists()) {
      await signOut(auth);
      throw new Error('Ya ha registrado un usuario con ese correo.');
    }

    // For login, check if user doesn't exist
    if (!isSignUp && !userDoc.exists()) {
      await signOut(auth);
      throw new Error('No existe una cuenta con este correo. Por favor, regístrese primero.');
    }

    // If user doesn't exist in Firestore and this is signup, create them
    if (!userDoc.exists() && isSignUp) {
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      
      const userData = {
        email: trimmedEmail,
        name: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        'Foto de Perfil': user.photoURL || "",
        phone: "",
        userType: "usuario",
        'Registro/Inicio de Sesión': 'Google Authentication',
        days: [],
        actualRoute: [],
        activitiesPerformed: [],
        mostPerformedActivity: {Actividad:"", timesPerformed: 0},
        schedule: [],
        activitiesCreated: []
      };

      await setDoc(userDocRef, userData);
    }

    return user;
  } catch (error) {
    console.error("Google auth error:", error);
    
    // This is important - if we receive any error, ensure we're signed out
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await signOut(auth);
      }
    } catch (signOutError) {
      console.error("Error signing out after auth error:", signOutError);
    }
    
    // Special handling for user closing the popup - no need for error
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Se cerró la ventana de autenticación.');
    }
    
    const errorMessage = getAuthErrorMessage(error.code) || error.message;
    throw new Error(errorMessage);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error('Error al cerrar sesión.');
  }
};