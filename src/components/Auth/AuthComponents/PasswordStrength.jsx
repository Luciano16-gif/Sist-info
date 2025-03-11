import React from 'react';

/**
 * Password strength indicator component
 * @param {string} password - The password to evaluate
 * @returns {JSX.Element} - Password strength indicator
 */
const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = React.useState(0);
  
  React.useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    
    let calculatedStrength = 0;
    
    // Length contribution (up to 30 points)
    calculatedStrength += Math.min(30, password.length * 3);
    
    // Character variety (up to 70 points)
    if (/[a-z]/.test(password)) calculatedStrength += 15; // lowercase
    if (/[A-Z]/.test(password)) calculatedStrength += 15; // uppercase
    if (/[0-9]/.test(password)) calculatedStrength += 15; // numbers
    if (/[^A-Za-z0-9]/.test(password)) calculatedStrength += 25; // special chars
    
    setStrength(Math.min(100, calculatedStrength));
  }, [password]);
  
  // Don't render anything if no password
  if (!password) return null;
  
  // Get strength color
  const getStrengthColor = () => {
    if (strength < 30) return '#FF4136'; // Bright red
    if (strength < 60) return '#FF851B'; // Bright orange
    if (strength < 80) return '#FFDC00'; // Bright yellow
    return '#2ECC40'; // Bright green
  };
  
  // Get strength label
  const getStrengthLabel = () => {
    if (strength < 30) return 'Débil';
    if (strength < 60) return 'Regular';
    if (strength < 80) return 'Buena';
    return 'Fuerte';
  };
  
  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <div style={{ 
        height: '6px', 
        width: '100%', 
        backgroundColor: '#e0e0e0',
        borderRadius: '3px',
        overflow: 'hidden' 
      }}>
        <div style={{ 
          height: '100%', 
          width: `${strength}%`, 
          backgroundColor: getStrengthColor(),
          borderRadius: '3px',
          transition: 'width 0.3s ease, background-color 0.3s ease' 
        }} />
      </div>
      <div style={{ 
        fontSize: '0.875rem', 
        marginTop: '4px',
        fontFamily: 'Ysabeau SC, sans-serif',
        color: getStrengthColor(),
        fontWeight: 'bold'
      }}>
        {getStrengthLabel()}
        {strength < 30 && ' - La contraseña debe tener al menos 6 caracteres.'}
      </div>
    </div>
  );
};

export default PasswordStrength;