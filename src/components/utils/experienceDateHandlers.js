/**
 * Date handling utilities for experience forms
 */

/**
 * Enhanced date change handler that ensures at least one date is always selected
 * @param {Function} originalHandler - Original date change handler from the form
 * @param {Function} dispatch - Dispatch function for updating errors
 * @param {Object} errors - Current form errors
 * @returns {Function} Enhanced handler that prevents removing all dates
 */
export const createSafeDateChangeHandler = (originalHandler, dispatch, errors) => {
    return (dates) => {
      // Prevent removing all dates - at least one date is required
      if (dates && dates.length > 0) {
        originalHandler(dates);
        
        // Clear any existing error
        if (errors.fechas) {
          const updatedErrors = { ...errors };
          delete updatedErrors.fechas;
          dispatch({
            type: 'SET_ERRORS',
            errors: updatedErrors
          });
        }
      } else {
        // If attempting to remove all dates, show an error
        dispatch({
          type: 'SET_ERRORS',
          errors: {
            ...errors,
            fechas: 'Se requiere al menos una fecha para la experiencia.'
          }
        });
      }
    };
  };
  
  /**
   * Process date formats from experience object 
   * @param {Object} experience - Experience data object
   * @returns {Array} Formatted dates array
   */
  export const extractDatesFromExperience = (experience) => {
    if (!experience) return [];
    
    // Handle direct fechas array
    if (experience.rawData?.fechas && Array.isArray(experience.rawData.fechas)) {
      return experience.rawData.fechas;
    }
    
    // Legacy support for day-based experiences (convert to specific dates)
    if (experience.days) {
      const days = Array.isArray(experience.days) 
        ? experience.days 
        : experience.days.split(', ');
        
      // Convert day names to dates (generate next 4 occurrences)
      // This is simplified - in a real implementation you'd want more sophisticated logic
      const today = new Date();
      const dates = [];
      
      // Map of day names to day indices (0 = Sunday, 1 = Monday, etc.)
      const dayMap = {
        'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 
        'Jueves': 4, 'Viernes': 5, 'Sábado': 6,
        'Dom': 0, 'Lun': 1, 'Mar': 2, 'Mié': 3, 'Jue': 4, 'Vie': 5, 'Sáb': 6
      };
      
      // Generate next 4 occurrences for each day
      days.forEach(day => {
        const dayIndex = dayMap[day.trim()];
        if (dayIndex !== undefined) {
          // Find next occurrence of this day
          const date = new Date(today);
          const currentDay = date.getDay();
          
          // Days until next occurrence
          let daysToAdd = (dayIndex - currentDay + 7) % 7;
          if (daysToAdd === 0) daysToAdd = 7; // If today, go to next week
          
          // Add next 4 occurrences
          for (let i = 0; i < 4; i++) {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + daysToAdd + (i * 7));
            dates.push(nextDate.toISOString());
          }
        }
      });
      
      return dates;
    }
    
    return [];
  };