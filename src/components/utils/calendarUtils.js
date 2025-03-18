/**
 * Utility functions to help display experiences in the calendar
 */

/**
 * Map day names to their numerical representation (0-6)
 */
export const dayNameToIndex = {
    "Lunes": 1,
    "Martes": 2, 
    "Miércoles": 3,
    "Jueves": 4,
    "Viernes": 5,
    "Sábado": 6,
    "Domingo": 0
  };
  
  /**
   * Map short day names to their numerical representation (0-6)
   */
  export const shortDayNameToIndex = {
    "Lun": 1,
    "Mar": 2,
    "Mié": 3,
    "Jue": 4,
    "Vie": 5,
    "Sáb": 6,
    "Dom": 0
  };
  
  /**
   * Map numerical day index to full day name in Spanish
   */
  export const indexToDayName = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado"
  };
  
  /**
   * Get all dates in a month that match specific days of the week
   * @param {number} year - The year
   * @param {number} month - The month (0-11)
   * @param {Array} daysOfWeek - Array of days of week (can be names or numbers 0-6)
   * @returns {Array} - Array of dates in YYYY-MM-DD format
   */
  export const getDatesForDaysOfWeek = (year, month, daysOfWeek) => {
    // Convert day names to numerical indices if needed
    const dayIndices = daysOfWeek.map(day => {
      if (typeof day === 'number') return day;
      return dayNameToIndex[day] !== undefined 
        ? dayNameToIndex[day] 
        : shortDayNameToIndex[day] !== undefined
          ? shortDayNameToIndex[day]
          : -1; // Invalid day name
    }).filter(index => index !== -1);
    
    const dates = [];
    // Create a date for the first day of the month
    const firstDay = new Date(year, month, 1);
    
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Loop through all days in the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
      
      // If this day of the week is in our list of days
      if (dayIndices.includes(dayOfWeek)) {
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dates.push(formattedDate);
      }
    }
    
    return dates;
  };
  
  /**
   * Convert experiences data to calendar event format
   * @param {Array} experiences - Array of experiences
   * @param {number} year - The year
   * @param {number} month - The month (0-11)
   * @returns {Object} - Object with dates as keys and arrays of events as values
   */
  export const experiencesToCalendarEvents = (experiences, year, month) => {
    const events = {};
    
    // Define a set of colors to cycle through for different experiences
    const colors = [
      'bg-green-400', 
      'bg-blue-400', 
      'bg-red-400', 
      'bg-yellow-400', 
      'bg-purple-400', 
      'bg-pink-400',
      'bg-teal-400',
      'bg-orange-400',
      'bg-indigo-400'
    ];
    
    // Process each experience
    experiences.forEach((experience, index) => {
      // Skip if no days field or it's empty
      if (!experience.days || experience.days.length === 0) return;
      
      // Parse the days of the week
      const daysOfWeek = Array.isArray(experience.days) 
        ? experience.days 
        : experience.days.split(', ');
      
      // Get all dates in this month for these days of the week
      const dates = getDatesForDaysOfWeek(year, month, daysOfWeek);
      
      // Assign a color for this experience (cycle through colors)
      const color = colors[index % colors.length];
      
      // Create an event for each date
      dates.forEach(date => {
        if (!events[date]) {
          events[date] = [];
        }
        
        events[date].push({
          id: experience.id,
          title: experience.name,
          description: experience.description,
          color: color,
          time: experience.time,
          price: experience.price,
          experienceData: experience // Store the full experience data for reference
        });
      });
    });
    
    return events;
  };
  
  /**
   * Get all events for a specific date
   * @param {Object} events - Events object from experiencesToCalendarEvents
   * @param {number} day - Day of the month
   * @param {number} month - Month (0-11)
   * @param {number} year - Year
   * @returns {Array} - Array of events for this date
   */
  export const getEventsForDay = (events, day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events[dateStr] || [];
  };