import { Link } from 'react-router-dom';

export const AuthLink = ({ 
  to, 
  text, 
  linkText,
  className
}) => {
  return (
    <p className={className}>
      {text} <Link to={to}>{linkText}</Link>
    </p>
  );
};