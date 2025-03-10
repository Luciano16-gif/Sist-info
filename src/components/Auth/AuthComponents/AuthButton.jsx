export const AuthButton = ({ 
    onClick, 
    children, 
    className,
    style = {}
  }) => {
    return (
      <button
        className={className}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  };