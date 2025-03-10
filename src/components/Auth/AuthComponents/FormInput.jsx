export const FormInput = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className,
  style = {}
}) => {
  // custom classNames
  const inputClassName = `auth-input ${type}-input ${className || ''}`;
  
  return (
    <input
      type={type} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputClassName}
      style={style}
    />
  );
};