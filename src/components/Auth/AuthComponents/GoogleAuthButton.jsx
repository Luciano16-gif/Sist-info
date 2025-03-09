export const GoogleAuthButton = ({ 
    onClick, 
    text = "Iniciar Sesión con Google",
    className 
  }) => {
    return (
      <button className={className} onClick={onClick}>
        <img src="/google-logo.png" alt="Google Logo" style={{ width: '24px', marginRight: '8px' }} />
        {text}
      </button>
    );
  };