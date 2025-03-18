import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useGoogleAuth() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    
    // Google authentication handler
    const handleGoogleAuth = async (isSignUp = false) => {
        try {
        const user = await loginWithGoogle(isSignUp); // false = not signing up, true = signing up
        
        // Only navigate if we have a valid user
        if (user) {
            navigate('/');
        }
        // If no user is returned, there was an error that's already in context
        
        } catch (error) {
        // This shouldn't execute because errors are handled in context but it never hurts to have more error handling (until it does)
        console.error(`Google ${isSignUp ? 'sign-up' : 'sign-in'} error:`, error);
        }
    };
    
    return handleGoogleAuth;
}

export default useGoogleAuth;
  