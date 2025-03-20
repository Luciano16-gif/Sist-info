import './CharacterCounter.css';

/**
 * Reusable character counter component
 * @param {Object} props Component props
 * @param {string} props.currentLength Current text length
 * @param {number} props.maxLength Maximum allowed length
 * @param {string} [props.className] Additional CSS classes
 * @returns {JSX.Element} Character counter component
 */
const CharacterCounter = ({ currentLength, maxLength, className = '' }) => {
  // Calculate percentage of used characters
  const percentage = (currentLength / maxLength) * 100;
  
  // Determine color based on character usage
  let textColor = '#5a8146'; // Default green
  
  if (percentage > 85) {
    textColor = '#c04141'; // Red when approaching limit
  } else if (percentage > 70) {
    textColor = '#f0ad4e'; // Orange/yellow when getting close
  }
  
  return (
    <div className={`character-counter ${className}`} style={{ color: textColor }}>
      {currentLength}/{maxLength}
    </div>
  );
};

export default CharacterCounter;