/**
 * Shows different colors based on availability:
 * - Green: Less than 50% full (more than half spots available)
 * - Orange: Between 50% and 80% full
 * - Red: More than 80% full (critical availability)
 * 
 * @param {number} available - Number of available spots
 * @param {number} total - Total number of spots
 * @returns {JSX.Element} - Colored indicator with count
 */
export const AvailabilityIndicator = ({ available, total }) => {
    // Calculate the percentage filled (occupied spots)
    const percentFilled = Math.floor(((total - available) / total) * 100);
    
    // Determine the color based on the percentage filled
    let bgColorClass = "bg-green-500"; // Green for < 50% full
    
    if (percentFilled >= 80) {
      bgColorClass = "bg-red-500"; // Red for >= 80% full
    } else if (percentFilled >= 50) {
      bgColorClass = "bg-yellow-500"; // Orange for >= 50% full
    }
    
    return (
      <div className="flex items-center">
        <span 
          className={`${bgColorClass} rounded-full w-2.5 h-2.5 mr-1`} 
          aria-label={`${percentFilled}% full`}
        ></span>
        <span>{available}/{total}</span>
      </div>
    );
  };