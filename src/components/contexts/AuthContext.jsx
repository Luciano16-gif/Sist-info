import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authService from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import LoadingScreen from '../loading/LoadingScreen';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [firestoreUserData, setFirestoreUserData] = useState(null);
  
  // Function to fetch user data from Firestore
  const fetchUserData = async (user) => {
    if (!user) return null;
    
    try {
      const userDocRef = doc(db, "lista-de-usuarios", user.email);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.userType || 'usuario');
        setFirestoreUserData(userData);
        
        // Create an enhanced user object that merges Firebase Auth user with Firestore data
        const enhancedUser = {
          ...user,
          // Override displayName with the name from Firestore if available
          displayName: userData.name && userData.lastName 
            ? `${userData.name} ${userData.lastName}`.trim()
            : user.displayName,
          // Override photoURL with the one from Firestore if available
          photoURL: userData['Foto de Perfil'] || user.photoURL || '',
          // Add additional Firestore fields
          firestoreData: userData
        };
        
        setCurrentUser(enhancedUser);
        return userData;
      } else {
        setUserRole('usuario');
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserRole('usuario');
      return null;
    }
  };
  
  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setFirestoreUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Function to update the user profile data
  const updateUserProfile = async (updatedData = {}) => {
    if (!currentUser) return;
    
    try {
      // Merge the new data with existing Firestore data
      const updatedFirestoreData = {
        ...firestoreUserData,
        ...updatedData
      };
      
      // Update the Firestore user data state
      setFirestoreUserData(updatedFirestoreData);
      
      // Create an enhanced user object with the updated data
      const enhancedUser = {
        ...currentUser,
        // Update displayName if name or lastName changed
        displayName: updatedData.name || updatedData.lastName
          ? `${updatedData.name || firestoreUserData.name || ''} ${updatedData.lastName || firestoreUserData.lastName || ''}`.trim()
          : currentUser.displayName,
        // Update photoURL if it changed
        photoURL: updatedData['Foto de Perfil'] || currentUser.photoURL || '',
        // Update the Firestore data
        firestoreData: updatedFirestoreData
      };
      
      // Update the current user
      setCurrentUser(enhancedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Error updating user profile. Please try again.");
    }
  };

  // Define authentication methods using authService
  const login = async (email, password, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.emailSignIn(email, password);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signup = async (userData, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.emailSignUp(userData);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginWithGoogle = async (isSignUp = false, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.googleAuth(isSignUp);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (onError) => {
    try {
      setError(null);
      const result = await authService.logOut();
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return false;
      }
      
      return true;
    } catch (error) {
      // This should rarely happen now, but you know the deal
      setError(error.message || 'Ocurrió un error al cerrar sesión.');
      if (onError) onError(error);
      return false;
    }
  };

  // Context value object
  const value = {
    currentUser,
    userRole,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticating,
    setError,
    updateUserProfile,
    firestoreUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <LoadingScreen appName="ÁvilaVenturas" />}
    </AuthContext.Provider>
  );
};

// Custom redirect hook with improved logic to prevent unwanted redirects
export const useAuthRedirect = (redirectPath = '/') => {
  const { currentUser, isAuthenticating, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if:
    // 1. We have a current user
    // 2. We're not in the middle of an authentication process
    // 3. There are no authentication errors
    // 4. We're not already on the redirectPath
    if (currentUser && 
        !isAuthenticating && 
        !error && 
        location.pathname !== redirectPath) {
      navigate(redirectPath);
    }
  }, [currentUser, navigate, redirectPath, isAuthenticating, error, location]);

  return currentUser;
};