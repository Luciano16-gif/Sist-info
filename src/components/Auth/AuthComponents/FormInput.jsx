export const FormInput = ({ 
  type = 'text', 
  value, 
  onChange, 
  onBlur,
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
      onBlur={onBlur}
      placeholder={placeholder}
      className={inputClassName}
      style={style}
    />
  );
};