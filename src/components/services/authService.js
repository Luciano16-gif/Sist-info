import { auth, db } from '../../firebase-config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDoc 
} from 'firebase/firestore';

// Import the unified validation utilities
import { validateEmail as validateEmailUtil, validatePhone as validatePhoneUtil } from '../utils/validationUtils';

const googleProvider = new GoogleAuthProvider();
const USERS_COLLECTION = 'lista-de-usuarios';

// Helper functions that convert between validation formats
export const isEmailValid = (email) => {
  return validateEmailUtil(email).isValid;
};

export const isPhoneValid = (phone) => {
  return validatePhoneUtil(phone).isValid;
};

// Error message handling - unchanged
export const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/invalid-email': 'Por favor, utiliza un correo electrónico válido.',
    'auth/email-already-in-use': 'Este correo electrónico ya está en uso.',
    'auth/popup-closed-by-user': 'Se cerró la ventana de autenticación de Google.',
    'auth/cancelled-popup-request': 'Operación cancelada. Por favor, inténtalo de nuevo.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
    'auth/invalid-credential': 'Credenciales inválidas. Verifica tu correo y contraseña.',
    'default': 'Ocurrió un error durante la autenticación.'
  };
  
  return errorMessages[errorCode] || errorMessages.default;
};

/**
 * Common error handler for auth operations
 * @param {Error} error - Original error 
 * @param {string} defaultMessage - Fallback message
 * @returns {Object} - Standardized error object
 */
const handleAuthError = (error, defaultMessage = 'Ocurrió un error durante la autenticación.') => {
  console.error("Auth error:", error);
  return { 
    error: true, 
    message: error.code ? getAuthErrorMessage(error.code) : (error.message || defaultMessage)
  };
};

/**
 * Clean up user after failed auth 
 * @param {Object} user - Firebase user object to clean up
 * @returns {Promise<void>}
 */
const cleanupAuthUser = async (user) => {
  try {
    // Delete the user if provided
    if (user) {
      await user.delete();
    }
    
    // Always try to sign out
    const currentUser = auth.currentUser;
    if (currentUser) {
      await signOut(auth);
    }
  } catch (cleanupError) {
    console.error("Error during auth cleanup:", cleanupError);
    // Still try to sign out if delete fails
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Failed to sign out during cleanup:", e);
    }
  }
};

/**
 * Pre-validates user data before auth operations
 * @param {string} email - User email
 * @param {Object} options - Additional validation options
 * @returns {Object|null} - Error object or null if valid
 */
const preValidateAuth = (email, options = {}) => {
  const { checkPhone = false, phone = null } = options;
  
  // Validate email
  const trimmedEmail = email?.trim();
  const emailValidation = validateEmailUtil(trimmedEmail);
  if (!emailValidation.isValid) {
    return {
      error: true,
      message: emailValidation.message
    };
  }
  
  // Validate phone if required
  if (checkPhone && phone) {
    const phoneValidation = validatePhoneUtil(phone);
    if (!phoneValidation.isValid) {
      return {
        error: true,
        message: phoneValidation.message
      };
    }
  }
  
  return null; // No validation errors
};

// Authentication functions - refactored
export const emailSignIn = async (email, password) => {
  const trimmedEmail = email?.trim();
  
  // Pre-validate
  const validationError = preValidateAuth(trimmedEmail);
  if (validationError) return validationError;

  try {
    // Check if user exists
    const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return {
        error: true,
        message: 'Usuario no encontrado.'
      };
    }

    const userData = userDoc.data();
    if (userData['Registro/Inicio de Sesión'] === 'Google Authentication') {
      return {
        error: true,
        message: 'Este correo está registrado con Google Authentication. Por favor, use la opción de Google para iniciar sesión.'
      };
    }

    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    return userCredential.user;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const emailSignUp = async (userData) => {
  const { email, password, name, lastName, phone } = userData;
  const trimmedEmail = email?.trim();
  
  // Pre-validate
  const validationError = preValidateAuth(trimmedEmail, { checkPhone: true, phone });
  if (validationError) return validationError;

  try {
    // Check if user already exists
    const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {
        error: true,
        message: 'Este correo ya está registrado.'
      };
    }

    // Create the Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    const user = userCredential.user;
    
    try {
      // Create user document
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
      // If Firestore write fails, clean up the auth user
      await cleanupAuthUser(user);
      
      return {
        error: true,
        message: `Error al guardar datos de usuario: ${firestoreError.message || firestoreError.code || 'Revise los permisos de Firestore'}`
      };
    }
  } catch (error) {
    return handleAuthError(error, 'Error al crear la cuenta.');
  }
};

export const googleAuth = async (isSignUp = false) => {
  let user = null;
  
  try {
    // Start the popup flow
    const result = await signInWithPopup(auth, googleProvider);
    user = result.user;
    const trimmedEmail = user.email?.trim();

    // Validate email domain after getting it from the popup
    const emailValidation = validateEmailUtil(trimmedEmail);
    if (!emailValidation.isValid) {
      await cleanupAuthUser(user);
      return {
        error: true,
        message: 'Por favor, utiliza un correo electrónico de la Universidad Metropolitana.'
      };
    }

    // Email is valid, now check Firestore
    try {
      const userDocRef = doc(db, USERS_COLLECTION, trimmedEmail);
      const userDoc = await getDoc(userDocRef);

      // For sign up, check if user already exists
      if (isSignUp && userDoc.exists()) {
        await cleanupAuthUser(user);
        return {
          error: true,
          message: 'Ya ha registrado un usuario con ese correo.'
        };
      }

      // For login, check if user doesn't exist in Firestore
      if (!isSignUp && !userDoc.exists()) {
        await cleanupAuthUser(user);
        return {
          error: true,
          message: 'No existe una cuenta con este correo. Por favor, regístrese primero.'
        };
      }

      // All validation passed, now create the document if needed for signup
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

        // Create the Firestore document
        await setDoc(userDocRef, userData);
      }

      return user;
    } catch (firestoreError) {
      console.error("Firestore operation failed:", firestoreError);
      await cleanupAuthUser(user);
      return {
        error: true,
        message: 'Error al procesar tu cuenta. Por favor, intenta de nuevo.'
      };
    }
  } catch (error) {
    // For any initial auth error, clean up if needed
    if (user) {
      await cleanupAuthUser(user);
    } else {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await cleanupAuthUser(currentUser);
      }
    }
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      return {
        error: true,
        message: 'Se cerró la ventana de autenticación.'
      };
    }
    
    return handleAuthError(error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return handleAuthError(error, 'Error al cerrar sesión.');
  }
};