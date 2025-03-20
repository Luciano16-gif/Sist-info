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
 * Check if a date string is in the given month/year
 * @param {string} dateStr - ISO date string
 * @param {number} year - The year to check
 * @param {number} month - The month (0-11) to check
 * @returns {boolean} - Whether the date is in the specified month
 */
export const isDateInMonth = (dateStr, year, month) => {
  const date = new Date(dateStr);
  return date.getFullYear() === year && date.getMonth() === month;
};

/**
 * Format a date string to YYYY-MM-DD format
 * @param {string|Date} date - Date object or ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDateString = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Compare two dates for equality (ignoring time)
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} - Whether the dates are the same
 */
export const areDatesEqual = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
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
    // Assign a color for this experience (cycle through colors)
    const color = colors[index % colors.length];
    
    // Get dates for this experience
    const experienceDates = getExperienceDates(experience, year, month);
    
    // Create an event for each date
    experienceDates.forEach(date => {
      const formattedDate = formatDateString(date);
      
      if (!events[formattedDate]) {
        events[formattedDate] = [];
      }
      
      events[formattedDate].push({
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
 * Get all dates for an experience in a specific month/year
 * @param {Object} experience - Experience data object
 * @param {number} year - Year to filter by
 * @param {number} month - Month to filter by (0-11)
 * @returns {Array} - Array of Date objects
 */
export const getExperienceDates = (experience, year, month) => {
  // If experience has raw data with specific dates
  if (experience.rawData && Array.isArray(experience.rawData.fechas)) {
    return experience.rawData.fechas
      .map(dateStr => new Date(dateStr))
      .filter(date => date.getFullYear() === year && date.getMonth() === month);
  }
  
  // Legacy support: If using the old day-of-week format
  if (experience.days) {
    const daysOfWeek = Array.isArray(experience.days) 
      ? experience.days 
      : experience.days.split(', ');
    
    // Convert day names to day indices (0-6)
    const dayIndices = daysOfWeek.map(day => {
      if (typeof day === 'number') return day;
      return dayNameToIndex[day] !== undefined 
        ? dayNameToIndex[day] 
        : shortDayNameToIndex[day] !== undefined
          ? shortDayNameToIndex[day]
          : -1; // Invalid day name
    }).filter(index => index !== -1);
    
    // Get all dates in this month that match the specified days of the week
    return getDatesForDaysOfWeek(year, month, dayIndices)
      .map(dateStr => new Date(dateStr));
  }
  
  return [];
};

/**
 * Get all dates in a month that match specific days of the week
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {Array} daysOfWeek - Array of day indices (0-6)
 * @returns {Array} - Array of dates in YYYY-MM-DD format
 */
export const getDatesForDaysOfWeek = (year, month, daysOfWeek) => {  
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
    if (daysOfWeek.includes(dayOfWeek)) {
      const formattedDate = formatDateString(date);
      dates.push(formattedDate);
    }
  }
  
  return dates;
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
  const dateStr = formatDateString(new Date(year, month, day));
  return events[dateStr] || [];
};