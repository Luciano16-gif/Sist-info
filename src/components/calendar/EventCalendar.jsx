import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiences } from '../hooks/experiences-hooks/useExperiences';
import { experiencesToCalendarEvents, getEventsForDay, formatDateString } from '../utils/calendarUtils';
import LoadingOverlay from '../common/LoadingOverlay';
import BookingService from '../../components/services/BookingService';

const EventCalendar = ({ onDateSelect, showSelectButton, validDates = [], isAdmin = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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

  // Check if a date is within the booking window (today to 1 month from now)
  const isWithinBookingWindow = (day) => {
    if (!day) return false;
    
    // Admin bypass - admins can select any date
    if (isAdmin) return true;
    
    const date = new Date(currentYear, currentMonth, day);
    return BookingService.isWithinBookingWindow(date);
  };

  // Check if a date is a valid day based on validDates prop and booking window
  const isValidDay = (day) => {
    // First check if the date is in the past
    if (isPastDate(day) && !isAdmin) return false;
    
    // If no validDates specified, any future or today date is valid for display
    if (!day || validDates.length === 0) return true;
    
    // For the new system, validDates contains specific dates in ISO string format
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const dateString = formatDateString(dateToCheck);
    
    // Check if this specific date is in the validDates array
    return validDates.some(validDate => {
      // Convert to date objects for proper comparison
      const validDateObj = new Date(validDate);
      return (
        validDateObj.getFullYear() === dateToCheck.getFullYear() &&
        validDateObj.getMonth() === dateToCheck.getMonth() &&
        validDateObj.getDate() === dateToCheck.getDate()
      );
    });
  };

  // Check if date is bookable (valid + within window)
  const isDateBookable = (day) => {
    // Admin can book any valid date
    if (isAdmin) return isValidDay(day);
    
    // For regular users, date must be valid and within booking window
    return isValidDay(day) && isWithinBookingWindow(day);
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
    // Admins can navigate to any month, users can't go to past months
    if (!isAdmin) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      // Check if the target month is in the past
      if (prevYear < today.year || (prevYear === today.year && prevMonth < today.month)) {
        return; // Don't navigate to past months for regular users
      }
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
    // Admins can go to any month
    if (isAdmin) return true;
    
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Prevent going to past months for regular users
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
    // Don't allow selection of past dates (unless admin)
    if (!isAdmin && isPastDate(day)) return;
    
    // Allow selection of all valid dates for viewing (even outside booking window)
    if (isValidDay(day) || isAdmin) {
      setSelectedDate(day);
    }
  };

  const handleConfirmDate = () => {
    if (selectedDate) {
      const fullDate = new Date(currentYear, currentMonth, selectedDate);
      
      // For non-admins, confirm the date is within booking window before passing it up
      if (!isAdmin && !BookingService.isWithinBookingWindow(fullDate)) {
        alert(`Esta fecha está fuera del período de reserva permitido (${isAdmin ? 'sin restricción' : '1 mes'}).`);
        return;
      }
      
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

  // Get the date 1 month from today for display
  const oneMonthFromNow = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }, []);

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Build message for valid dates display
  const getValidDatesMessage = () => {
    if (!validDates || validDates.length === 0) return '';
    
    // Get only dates within the next month for display
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    const upcomingDates = validDates
      .map(d => new Date(d))
      .filter(d => d >= today)
      .sort((a, b) => a - b)
      .slice(0, 5); // Show at most 5 dates to keep it readable
    
    if (upcomingDates.length === 0) {
      return 'Esta experiencia solo está disponible en fechas específicas.';
    }
    
    const formattedDates = upcomingDates.map(d => 
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    ).join(', ');
    
    return `Esta experiencia está disponible en las siguientes fechas: ${formattedDates}${upcomingDates.length < validDates.length ? ", entre otras." : "."}`;
  };

  return (
    <div className="max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
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
      
      {/* Booking Window Notice - Only show for regular users */}
      {!isAdmin && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 mb-4 rounded" role="alert">
          <p className="font-medium">Información de reservas</p>
          <p className="text-sm">Solo se permiten reservas hasta 1 mes en el futuro (hasta el {formatDateForDisplay(oneMonthFromNow)}).</p>
        </div>
      )}
      
      {/* Valid Dates Instructions - shown when validDates is provided */}
      {validDates && validDates.length > 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4 rounded" role="alert">
          <p className="font-medium">{getValidDatesMessage()}</p>
          <p className="text-sm">Solo puedes seleccionar esas fechas en el calendario.</p>
        </div>
      )}
      
      {/* Layout: stacked on mobile, side-by-side on larger screens */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        {/* Calendar Container */}
        <div className="w-full xl:w-7/12 bg-[rgba(25,39,15,0.8)] rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6">
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
                  const withinWindow = day && isWithinBookingWindow(day);
                  const canBook = day && isDateBookable(day);

                  // Calculate different styles based on conditions
                  const getDateClassName = () => {
                    if (isSelected) return 'bg-blue-500';
                    if (isToday) return 'bg-green-500';
                    if (pastDay && !isAdmin) return 'bg-gray-400 opacity-40';
                    
                    // Has events but outside booking window
                    if (dayEvents.length > 0 && !withinWindow && validDay) 
                      return 'bg-gray-700 opacity-80';
                      
                    // Valid day within booking window
                    if (validDay && withinWindow) 
                      return 'hover:bg-gray-700';
                      
                    return '';
                  };

                  return (
                    <div
                      key={cellId}
                      ref={el => day && (dayRefs.current[cellId] = el)}
                      role={day ? "gridcell" : "presentation"}
                      tabIndex={day && validDay ? 0 : -1}
                      aria-selected={isSelected}
                      aria-label={day ? `${day} de ${months[currentMonth]} de ${currentYear}${dayEvents.length > 0 ? `, ${dayEvents.length} experiencias` : ''}` : undefined}
                      title={
                        !day ? "" : 
                        pastDay && !isAdmin ? "No se pueden seleccionar fechas pasadas" :
                        !withinWindow && !isAdmin ? `Se puede ver pero no reservar (fuera del período de ${isAdmin ? 'sin restricción' : '1 mes'})` :
                        validDates.length > 0 && !validDay ? `Esta experiencia no está disponible en esta fecha.` :
                        ""
                      }
                      className={`relative rounded-md sm:rounded-lg min-h-[38px] sm:min-h-[50px] p-1 sm:p-2 transition-colors ${getDateClassName()} ${
                        day ? 
                          pastDay && !isAdmin ? 'cursor-not-allowed opacity-40' :
                          validDay && !withinWindow && !isAdmin ? 'cursor-pointer' :
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
                          {/* Show event indicators for all valid dates, even those outside booking window */}
                          {validDay && (
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-[1px] pb-[2px] sm:pb-1">
                              {/* Show 4 dots on mobile, 5 on tablet/desktop */}
                              {dayEvents.slice(0, window.innerWidth < 640 ? 4 : 5).map((event, index) => (
                                <div
                                  key={index}
                                  className={`w-[5px] h-[5px] sm:w-2 sm:h-2 rounded-full ${event.color}`}
                                  aria-hidden="true"
                                />
                              ))}
                              {dayEvents.length > (window.innerWidth < 640 ? 4 : 5) && (
                                <div className="w-[5px] h-[5px] sm:w-2 sm:h-2 rounded-full bg-white" aria-hidden="true" />
                              )}
                            </div>
                          )}
                          {/* Show icon for dates outside booking window */}
                          {validDay && !withinWindow && !pastDay && !isAdmin && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-yellow-500 border-solid rounded-bl-lg" title="Fuera del período de reserva" />
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
        <div className="w-full xl:w-5/12 flex flex-col">
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4">
            Calendario de actividades
          </h2>

          {selectedDate ? (
            <>
              <h3 className="text-lg sm:text-xl text-white font-semibold mb-2">
                Experiencias para el {selectedDate}/{currentMonth + 1}/{currentYear}
              </h3>
              
              {/* Outside booking window message - only for regular users */}
              {selectedDate && !isWithinBookingWindow(selectedDate) && !isAdmin && (
                <div className="bg-yellow-100 border-left-4 border-yellow-500 text-yellow-800 p-3 mb-3 rounded">
                  <p className="font-medium">Esta fecha está fuera del período de reserva de 1 mes.</p>
                  <p className="text-sm">Puedes ver los detalles pero no podrás hacer una reserva.</p>
                </div>
              )}
              
              {/* Scrollable container for events */}
              <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px] md:max-h-[350px] pr-2 space-y-3">
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
                        {isAdmin || isWithinBookingWindow(selectedDate) ? 'Ver más' : 'Ver detalles'}
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
            <div className="h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
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
                disabled={
                  !selectedDate || 
                  (!isAdmin && !isDateBookable(selectedDate))
                }
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