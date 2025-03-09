export const FormInput = ({ 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    className,
    style = {}
  }) => {
    // Map component types to CSS input types
    const inputTypeMap = {
      'email': 'email-login',
      'password': 'password-login',
      'text': 'text-signup',
      'tel': 'tel-signup'
    };
  
    const inputType = inputTypeMap[type] || 'text-signup';
  
    return (
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={style}
      />
    );
  };