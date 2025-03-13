export const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`auth-error ${className}`}>
      {message}
    </div>
  );
};