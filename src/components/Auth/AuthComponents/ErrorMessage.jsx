export const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`auth-error ${className}`} style={{ 
      color: '#ff3333', 
      backgroundColor: 'rgba(255, 0, 0, 0.15)',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '20px',
      marginTop: '10px',
      textAlign: 'center',
      fontWeight: 'bold',
      maxWidth: '720px',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 0 5px rgba(255, 0, 0, 0.2)',
      fontFamily: 'Ysabeau SC, sans-serif',
      fontSize: '1rem',
      border: '1px solid rgba(255, 0, 0, 0.3)',
      textShadow: '0 0 1px #000'
    }}>
      {message}
    </div>
  );
};