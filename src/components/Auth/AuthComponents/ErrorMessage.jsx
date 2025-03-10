export const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`auth-error ${className}`} style={{ 
      color: '#ff3333', 
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '15px',
      textAlign: 'center'
    }}>
      {message}
    </div>
  );
};