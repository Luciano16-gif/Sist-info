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
  setDoc 
} from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
const UNIMET_DOMAIN = 'correo.unimet.edu.ve';

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
    'auth/popup-closed-by-user': null, // No message needed
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
    const usersCollection = collection(db, 'Lista de Usuarios');
    const q = query(usersCollection, where("email", "==", trimmedEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Usuario no encontrado.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    return userCredential.user;
  } catch (error) {
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
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    
    // Create user document
    const usersCollection = collection(db, 'Lista de Usuarios');
    const docRef = doc(usersCollection, trimmedEmail);
    
    await setDoc(docRef, {
      email: trimmedEmail,
      name,
      lastName,
      password, // 
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
    
    return userCredential.user;
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error.code) || error.message;
    throw new Error(errorMessage);
  }
};

export const googleAuth = async (isSignUp = false) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const trimmedEmail = user.email.trim();

    if (!validateEmail(trimmedEmail)) {
      await signOut(auth);
      throw new Error('Por favor, utiliza un correo electrónico de la Universidad Metropolitana.');
    }

    const usersCollection = collection(db, 'Lista de Usuarios');
    const q = query(usersCollection, where("email", "==", trimmedEmail));
    const querySnapshot = await getDocs(q);

    // For sign up, check if user already exists
    if (isSignUp && !querySnapshot.empty) {
      await signOut(auth);
      throw new Error('Ya ha registrado un usuario con ese correo.');
    }

    // If user doesn't exist in Firestore, create them
    if (querySnapshot.empty) {
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      
      const userData = {
        email: trimmedEmail,
        name: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        'Foto de Perfil': user.photoURL || "url_por_defecto.jpg",
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

      await setDoc(doc(usersCollection, trimmedEmail), userData);
    }

    return user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return null; // User closed the popup, no need for error
    }
    
    const errorMessage = getAuthErrorMessage(error.code) || error.message;
    throw new Error(errorMessage);
  }
};

export const logOut = () => {
  return signOut(auth);
};