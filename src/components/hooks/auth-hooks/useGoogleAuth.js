import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const useGoogleAuth = () => {
  const { loginWithGoogle, setError } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuth = async (isSignUp = false) => {
    try {
      // Call the Google auth method from context
      const user = await loginWithGoogle(isSignUp);
      
      if (user) {
        // Wait a moment for Firebase to fully process the authentication
        // This helps ensure Firestore data is fetched before redirecting
        setTimeout(() => {
          navigate('/');
        }, 1000);
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error("Google auth error:", error);
      setError(error.message || "Error al autenticar con Google");
      return null;
    }
  };

  return handleGoogleAuth;
};
  