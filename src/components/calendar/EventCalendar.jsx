import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiences } from '../hooks/experiences-hooks/useExperiences';
import { experiencesToCalendarEvents, getEventsForDay } from '../utils/calendarUtils';
import LoadingOverlay from '../common/LoadingOverlay';

const EventCalendar = ({ onDateSelect, showSelectButton, validDays = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Use current year
  const [selectedDate, setSelectedDate] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [isChangingMonth, setIsChangingMonth] = useState(false);
  const [acceptedExperiences, setAcceptedExperiences] = useState([]);
  
  const navigate = useNavigate();
  const dayRefs = useRef([]);
  
  // Fetch experiences using the existing hook
  const { experiences, loading, error } = useExperiences();

  // Get current date for comparison
  const today = useMemo(() => {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
  }, []);

  // Filter for only accepted experiences
  useEffect(() => {
    if (!loading && !error && experiences.length > 0) {
      const filtered = experiences.filter(exp => {
        // Check if rawData exists and has status
        if (exp.rawData) {
          // Include experiences with 'accepted' status or no status (for backward compatibility)
          return exp.rawData.status === 'accepted' || exp.rawData.status === undefined;
        }
        return true; // Include experiences without rawData (shouldn't happen, but just in case)
      });
      setAcceptedExperiences(filtered);
    }
  }, [experiences, loading, error]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calculate days in the current month
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push('');
        } else if (day > daysInMonth) {
          week.push('');
        } else {
          week.push(day++);
        }
      }
      days.push(week);
    }
    return days;
  }, [currentMonth, currentYear]);

  // Convert experiences to calendar events format
  const calendarEvents = useMemo(() => {
    if (!acceptedExperiences || acceptedExperiences.length === 0) return {};
    return experiencesToCalendarEvents(acceptedExperiences, currentYear, currentMonth);
  }, [acceptedExperiences, currentYear, currentMonth]);

  // Get events for a specific day
  const getEventsForSpecificDay = (day) => {
    if (!day) return [];
    return getEventsForDay(calendarEvents, day, currentMonth, currentYear);
  };

  // Check if a date is in the past
  const isPastDate = (day) => {
    // Future years/months are always valid
    if (currentYear > today.year) return false;
    if (currentYear === today.year && currentMonth > today.month) return false;
    
    // For current month, check day
    if (currentYear === today.year && currentMonth === today.month) {
      return day < today.day;
    }
    
    // Past years/months
    return currentYear < today.year || (currentYear === today.year && currentMonth < today.month);
  };

  // Check if a date is a valid day based on validDays prop
  const isValidDay = (day) => {
    // First check if the date is in the past
    if (isPastDate(day)) return false;
    
    // If no validDays specified, any future or today date is valid
    if (!day || validDays.length === 0) return true; 
    
    const date = new Date(currentYear, currentMonth, day);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const shortDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayName = dayNames[date.getDay()];
    const shortDayName = shortDayNames[date.getDay()];
    
    // Check if this day is in valid days (accounting for different formats)
    return validDays.some(validDay => {
      const dayStr = validDay.trim();
      return dayStr.toLowerCase() === dayName.toLowerCase() || 
             dayStr.toLowerCase() === shortDayName.toLowerCase() ||
             dayName.toLowerCase().startsWith(dayStr.toLowerCase()) ||
             shortDayName.toLowerCase().startsWith(dayStr.toLowerCase());
    });
  };

  const adjustSelectedDate = (newMonth, newYear) => {
    if (selectedDate) {
      const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
      if (selectedDate > daysInNewMonth) {
        setSelectedDate(daysInNewMonth);
      }
    }
  };

  const handlePrevMonth = () => {
    // Don't allow navigating to past months
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Check if the target month is in the past
    if (prevYear < today.year || (prevYear === today.year && prevMonth < today.month)) {
      return; // Don't navigate to past months
    }
    
    setIsChangingMonth(true);
    
    let newMonth, newYear;
    if (currentMonth === 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else {
      newMonth = currentMonth - 1;
      newYear = currentYear;
    }

    adjustSelectedDate(newMonth, newYear);
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Remove loading overlay after a short delay to allow rendering
    setTimeout(() => {
      setIsChangingMonth(false);
    }, 300);
  };

  const handleNextMonth = () => {
    setIsChangingMonth(true);
    
    let newMonth, newYear;
    if (currentMonth === 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    } else {
      newMonth = currentMonth + 1;
      newYear = currentYear;
    }

    adjustSelectedDate(newMonth, newYear);
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Remove loading overlay after a short delay to allow rendering
    setTimeout(() => {
      setIsChangingMonth(false);
    }, 300);
  };

  // Check if we can navigate to the previous month
  const canGoToPrevMonth = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Prevent going to past months
    return !(prevYear < today.year || (prevYear === today.year && prevMonth < today.month));
  };

  const handleKeyDown = (e, weekIndex, dayIndex, day) => {
    if (!day) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (dayIndex < 6) {
          const nextDay = daysInMonth[weekIndex][dayIndex + 1];
          if (nextDay) {
            setFocusedCell({ weekIndex, dayIndex: dayIndex + 1 });
            dayRefs.current[`${weekIndex}-${dayIndex + 1}`]?.focus();
          }
        } else if (weekIndex < daysInMonth.length - 1) {
          const nextDay = daysInMonth[weekIndex + 1][0];
          if (nextDay) {
            setFocusedCell({ weekIndex: weekIndex + 1, dayIndex: 0 });
            dayRefs.current[`${weekIndex + 1}-0`]?.focus();
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (dayIndex > 0) {
          const prevDay = daysInMonth[weekIndex][dayIndex - 1];
          if (prevDay) {
            setFocusedCell({ weekIndex, dayIndex: dayIndex - 1 });
            dayRefs.current[`${weekIndex}-${dayIndex - 1}`]?.focus();
          }
        } else if (weekIndex > 0) {
          const prevDay = daysInMonth[weekIndex - 1][6];
          if (prevDay) {
            setFocusedCell({ weekIndex: weekIndex - 1, dayIndex: 6 });
            dayRefs.current[`${weekIndex - 1}-6`]?.focus();
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (weekIndex < daysInMonth.length - 1) {
          const downDay = daysInMonth[weekIndex + 1][dayIndex];
          if (downDay) {
            setFocusedCell({ weekIndex: weekIndex + 1, dayIndex });
            dayRefs.current[`${weekIndex + 1}-${dayIndex}`]?.focus();
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (weekIndex > 0) {
          const upDay = daysInMonth[weekIndex - 1][dayIndex];
          if (upDay) {
            setFocusedCell({ weekIndex: weekIndex - 1, dayIndex });
            dayRefs.current[`${weekIndex - 1}-${dayIndex}`]?.focus();
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (day) {
          handleDayClick(day);
        }
        break;
      default:
        break;
    }
  };

  const handleDayClick = (day) => {
    // Don't allow selection of past dates
    if (isPastDate(day)) return;
    
    // Only allow selection if day is valid (when validDays is provided)
    if (validDays.length > 0 && !isValidDay(day)) {
      return; // Don't select invalid days
    }
    
    setSelectedDate(day);
  };

  const handleConfirmDate = () => {
    if (selectedDate) {
      const fullDate = new Date(currentYear, currentMonth, selectedDate);
      onDateSelect(fullDate);
    }
  };

  // Handle booking navigation
  const handleViewBooking = (experience) => {
    if (experience && experience.experienceData) {
      navigate('/booking', { state: { experience: experience.experienceData } });
    }
  };

  useEffect(() => {
    dayRefs.current = {};
  }, [daysInMonth]);

  return (
    <div className="max-w-screen-xl mx-auto px-2 sm:px-6 py-6 sm:py-12">
      {/* Loading Overlay for initial loading and month changes */}
      <LoadingOverlay 
        isLoading={loading || isChangingMonth} 
        message={loading ? "Cargando experiencias..." : "Cambiando mes..."}
        opacity={70}
      />
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Valid Days Instructions - shown when validDays is provided */}
      {validDays && validDays.length > 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4 rounded" role="alert">
          <p className="font-medium">Esta experiencia solo ocurre los días: {validDays.join(', ')}</p>
          <p className="text-sm">Solo puedes seleccionar esos días en el calendario.</p>
        </div>
      )}
      
      {/* Layout: stacked on mobile, side-by-side on larger screens */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Container */}
        <div className="w-full lg:w-7/12 bg-[rgba(25,39,15,0.8)] rounded-xl sm:rounded-2xl p-3 sm:p-6">
          {/* Month navigation header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className={`text-white text-xl sm:text-2xl focus:outline-none p-1 sm:p-2 ${!canGoToPrevMonth() ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={`Ir al mes anterior: ${months[currentMonth === 0 ? 11 : currentMonth - 1]}`}
              disabled={loading || isChangingMonth || !canGoToPrevMonth()}
            >
              ←
            </button>
            <h2 className="text-white text-xl sm:text-3xl font-bold" id="current-month">
              {months[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="text-white text-xl sm:text-2xl focus:outline-none p-1 sm:p-2"
              aria-label={`Ir al mes siguiente: ${months[currentMonth === 11 ? 0 : currentMonth + 1]}`}
              disabled={loading || isChangingMonth}
            >
              →
            </button>
          </div>

          {/* Days of week header - Simplified on mobile */}
          <div className="grid grid-cols-7 gap-1 mb-1 sm:gap-2 sm:mb-3 text-center" role="row">
            {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, idx) => (
              <div key={idx} className="text-white text-xs sm:text-sm font-medium" role="columnheader">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid - Optimized for mobile with valid day highlight */}
          <div className="grid grid-cols-7 gap-[2px] sm:gap-2 sm:h-[380px]" role="grid" aria-labelledby="current-month">
            {daysInMonth.map((week, weekIndex) => (
              <React.Fragment key={`week-${weekIndex}`}>
                {week.map((day, dayIndex) => {
                  const isToday =
                    currentYear === today.year &&
                    currentMonth === today.month &&
                    day === today.day;

                  const dayEvents = day ? getEventsForSpecificDay(day) : [];
                  const isSelected = day && day === selectedDate;
                  const cellId = `${weekIndex}-${dayIndex}`;
                  const validDay = day && isValidDay(day);
                  const pastDay = day && isPastDate(day);

                  return (
                    <div
                      key={cellId}
                      ref={el => day && (dayRefs.current[cellId] = el)}
                      role={day ? "gridcell" : "presentation"}
                      tabIndex={day && validDay ? 0 : -1}
                      aria-selected={isSelected}
                      aria-label={day ? `${day} de ${months[currentMonth]} de ${currentYear}${dayEvents.length > 0 ? `, ${dayEvents.length} experiencias` : ''}` : undefined}
                      className={`relative rounded-md sm:rounded-lg min-h-[38px] sm:min-h-[50px] p-1 sm:p-2 transition-colors ${
                        isToday ? 'bg-green-500' :
                        isSelected ? 'bg-blue-500' :
                        pastDay ? 'bg-gray-400 opacity-40' :
                        day && validDay ? 'hover:bg-gray-700' : 
                        ''
                      } ${
                        day ? 
                          pastDay ? 'cursor-not-allowed opacity-40' :
                          validDay ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        : ''
                      }`}
                      onClick={() => handleDayClick(day)}
                      onKeyDown={(e) => handleKeyDown(e, weekIndex, dayIndex, day)}
                    >
                      {day && (
                        <>
                          <div className="text-white text-center text-xs sm:text-base font-medium">
                            {day}
                          </div>
                          {validDay && !pastDay && (
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-[1px] sm:space-x-1 pb-[2px] sm:pb-1">
                              {/* Show fewer dots on mobile */}
                              {dayEvents.slice(0, window.innerWidth < 640 ? 3 : 4).map((event, index) => (
                                <div
                                  key={index}
                                  className={`w-[5px] h-[5px] sm:w-2 sm:h-2 rounded-full ${event.color}`}
                                  aria-hidden="true"
                                />
                              ))}
                              {dayEvents.length > (window.innerWidth < 640 ? 3 : 4) && (
                                <div className="w-[5px] h-[5px] sm:w-2 sm:h-2 rounded-full bg-white" aria-hidden="true" />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Event Details and Button Container */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Calendario de actividades
          </h2>

          {selectedDate ? (
            <>
              <h3 className="text-lg sm:text-xl text-white font-semibold mb-2">
                Experiencias para el {selectedDate}/{currentMonth + 1}/{currentYear}
              </h3>
              
              {/* Scrollable container for events */}
              <div className="overflow-y-auto max-h-[300px] sm:max-h-[380px] pr-2 space-y-3">
                {getEventsForSpecificDay(selectedDate).map((event, index) => (
                  <div
                    key={`${event.id}-${index}`}
                    className="bg-[rgba(25,39,15,0.8)] p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-[rgba(35,59,25,0.8)] transition-colors"
                    onClick={() => handleViewBooking(event)}
                  >
                    <h4 className="text-base sm:text-lg text-white font-semibold mb-1 sm:mb-2">
                      {event.title}
                    </h4>
                    <p className="text-gray-300 mb-2 text-xs sm:text-sm line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex justify-between text-gray-300 text-xs">
                      <span>Horario: {event.time}</span>
                      <span>Precio: ${event.price}</span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 sm:px-3 rounded text-xs sm:text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBooking(event);
                        }}
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                ))}
                {getEventsForSpecificDay(selectedDate).length === 0 && (
                  <p className="text-gray-300 text-center py-4">No hay experiencias para esta fecha</p>
                )}
              </div>
            </>
          ) : (
            <div className="h-[200px] sm:h-[300px] flex items-center justify-center">
              <p className="text-gray-300 text-center px-4">
                Selecciona una fecha para ver las experiencias disponibles
              </p>
            </div>
          )}

          {/* Selection button */}
          {showSelectButton && (
            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmDate}
                disabled={!selectedDate || (validDays.length > 0 && !isValidDay(selectedDate))}
              >
                Seleccionar Fecha
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;