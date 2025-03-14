import React, { useState, useMemo, useRef, useEffect } from 'react';

const AdminCalendario = () => {
  // Función para manejar la selección de fecha desde el calendario
  const handleDateSelect = (selectedDate) => {
    console.log("Fecha seleccionada:", selectedDate);
    // Lógica para manejar la fecha seleccionada
  };

  return (
    <div className="absolute inset-0 mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-8 flex flex-col justify-start items-start px-4 sm:px-8 md:px-16 space-y-4 z-10">
      {/* Encabezado del AdminCalendario */}
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Calendario</h1>
      <h1 className="text-white text-base sm:text-lg md:text-lg">
        Este calendario le enseña a nuestros usuarios y guías las diversas actividades y experiencias que ofrecemos cada mes de una forma compacta y organizada.
      </h1>
      <hr className="border-1 border-white-600 w-full sm:w-1/2 md:w-96" />
      {/* Integración del EventCalendar */}
      <div className="w-full mt-8">
        <EventCalendar onDateSelect={handleDateSelect} showSelectButton={true} />
      </div>
    </div>
  );
};

const EventCalendar = ({ onDateSelect, showSelectButton }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [focusedCell, setFocusedCell] = useState(null);
  
  const dayRefs = useRef([]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const events = [
    // Enero
    { date: '2025-01-15', title: 'Ruta nocturna al Ávila', description: 'Excursión guiada nocturna con observación de estrellas', color: 'bg-green-400' },
    { date: '2025-01-15', title: 'Taller de fotografía', description: 'Aprende a capturar paisajes nocturnos', color: 'bg-blue-400' },
    { date: '2025-01-20', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },
    
    // Febrero
    { date: '2025-02-14', title: 'Senderismo romántico', description: 'Ruta especial para parejas con picnic', color: 'bg-red-400' },
    { date: '2025-02-14', title: 'Cena bajo las estrellas', description: 'Experiencia culinaria en la montaña', color: 'bg-purple-400' },
    { date: '2025-02-27', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },
    
    // Marzo
    { date: '2025-03-21', title: 'Aventura de primavera', description: 'Exploración de rutas con flora en floración', color: 'bg-yellow-400' },
    { date: '2025-03-21', title: 'Taller de botánica', description: 'Identificación de especies nativas', color: 'bg-teal-400' },
    { date: '2025-03-02', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Abril
    { date: '2025-04-05', title: 'Trekking avanzado', description: 'Ruta de dificultad alta para expertos', color: 'bg-orange-400' },
    { date: '2025-04-05', title: 'Carrera de montaña', description: 'Competencia amistosa entre participantes', color: 'bg-indigo-400' },
    { date: '2025-04-24', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Mayo
    { date: '2025-05-10', title: 'Fotografía en la montaña', description: 'Taller práctico con paisajes del Ávila', color: 'bg-cyan-400' },
    { date: '2025-05-10', title: 'Avistamiento de aves', description: 'Guía especializado en aves migratorias', color: 'bg-amber-400' },
    { date: '2025-05-29', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Junio
    { date: '2025-06-19', title: 'Caminata familiar', description: 'Ruta apta para toda la familia', color: 'bg-lime-400' },
    { date: '2025-06-19', title: 'Picnic comunitario', description: 'Encuentro con otros excursionistas', color: 'bg-violet-400' },
    { date: '2025-01-03', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },
    { date: '2025-01-24', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Julio
    { date: '2025-07-04', title: 'Festival de senderismo', description: 'Evento anual con múltiples actividades', color: 'bg-fuchsia-400' },
    { date: '2025-07-04', title: 'Concierto acústico', description: 'Música en vivo al atardecer', color: 'bg-rose-400' },
    { date: '2025-07-20', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Agosto
    { date: '2025-08-15', title: 'Ruta histórica', description: 'Recorrido por sitios históricos', color: 'bg-emerald-400' },
    { date: '2025-08-15', title: 'Noche de fogata', description: 'Cuentacuentos y malvaviscos', color: 'bg-sky-400' },
    { date: '2025-08-01', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Septiembre
    { date: '2025-09-22', title: 'Aventura otoñal', description: 'Exploración de cambios de estación', color: 'bg-amber-400' },
    { date: '2025-09-22', title: 'Taller de mapas', description: 'Orientación con mapas topográficos', color: 'bg-stone-400' },
    { date: '2025-09-09', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Octubre
    { date: '2025-10-31', title: 'Halloween en la montaña', description: 'Ruta temática con historias locales', color: 'bg-orange-500' },
    { date: '2025-10-31', title: 'Fiesta de disfraces', description: 'Concurso de disfraces al aire libre', color: 'bg-purple-500' },
    { date: '2025-10-19', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Noviembre
    { date: '2025-11-11', title: 'Ruta de observación', description: 'Avistamiento de aves migratorias', color: 'bg-teal-500' },
    { date: '2025-11-11', title: 'Taller de astronomía', description: 'Observación de constelaciones', color: 'bg-blue-500' },
    { date: '2025-11-20', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' },

    // Diciembre
    { date: '2025-12-24', title: 'Nochebuena en el Ávila', description: 'Celebración con vistas panorámicas', color: 'bg-red-500' },
    { date: '2025-12-24', title: 'Fuegos artificiales', description: 'Espectáculo pirotécnico especial', color: 'bg-pink-500' },
    { date: '2025-12-10', title: 'Yoga matutino', description: 'Sesión de yoga al amanecer en el mirador', color: 'bg-pink-400' }
  ];

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

  const currentMonthEvents = useMemo(() => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const yearStr = String(currentYear);
    return events.filter(event =>
      event.date.startsWith(`${yearStr}-${monthStr}`)
    );
  }, [currentMonth, currentYear, events]);


  const getEventsForDay = useMemo(() => {
    return (day) => {
      if (!day) return [];
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return currentMonthEvents.filter(event => event.date === dateStr);
    };
  }, [currentMonthEvents, currentMonth, currentYear]);


  const adjustSelectedDate = (newMonth, newYear) => {
    if (selectedDate) {
      const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
      if (selectedDate > daysInNewMonth) {
        setSelectedDate(daysInNewMonth);
      }
    }
  };

  const handlePrevMonth = () => {
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
  };

  const handleNextMonth = () => {
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
          setSelectedDate(day);
        }
        break;
      default:
        break;
    }
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const handleConfirmDate = () => {
    if (selectedDate) {
      // Construct the full date string in "YYYY-MM-DD" format
      const fullDate = new Date(currentYear, currentMonth, selectedDate);
      onDateSelect(fullDate);
    }
  };

  useEffect(() => {
    dayRefs.current = {};
  }, [daysInMonth]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Container */}
        <div className="w-full md:w-7/12 bg-[rgba(25,39,15,0.8)] rounded-2xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={handlePrevMonth}
              className="text-white text-lg sm:text-2xl focus:outline-none"
              aria-label={`Ir al mes anterior: ${months[currentMonth === 0 ? 11 : currentMonth - 1]}`}
            >
              ←
            </button>
            <h2 className="text-white text-2xl sm:text-3xl font-bold" id="current-month">
              {months[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="text-white text-lg sm:text-2xl focus:outline-none"
              aria-label={`Ir al mes siguiente: ${months[currentMonth === 11 ? 0 : currentMonth + 1]}`}
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6 text-center" role="row">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-white font-semibold text-xs sm:text-sm" role="columnheader">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2" role="grid" aria-labelledby="current-month">
            {daysInMonth.map((week, weekIndex) => (
              <React.Fragment key={`week-${weekIndex}`}>
                {week.map((day, dayIndex) => {
                  const currentDate = new Date();
                  const isToday =
                    currentYear === currentDate.getFullYear() &&
                    currentMonth === currentDate.getMonth() &&
                    day === currentDate.getDate();
                    
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isSelected = day && day === selectedDate; // Check against local state
                  const cellId = `${weekIndex}-${dayIndex}`;

                  return (
                    <div
                      key={cellId}
                      ref={el => day && (dayRefs.current[cellId] = el)}
                      role={day ? "gridcell" : "presentation"}
                      tabIndex={day ? 0 : -1}
                      aria-selected={isSelected}
                      aria-label={day ? `${day} de ${months[currentMonth]} de ${currentYear}${dayEvents.length > 0 ? `, ${dayEvents.length} eventos` : ''}` : undefined}
                      className={`relative rounded-lg p-1 sm:p-2 transition-colors ${
                        isToday ? 'bg-green-500' :
                        isSelected ? 'bg-blue-500' :
                        day ? 'hover:bg-gray-700' : ''
                      } ${day ? 'cursor-pointer' : ''}`}
                      onClick={() => handleDayClick(day)}
                      onKeyDown={(e) => handleKeyDown(e, weekIndex, dayIndex, day)}
                    >
                      {day && (
                        <>
                          <div className="text-white text-xs sm:text-base text-center">
                            {day}
                          </div>
                          {dayEvents.length > 0 && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {dayEvents.map((event, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${event.color}`}
                                  aria-hidden="true"
                                />
                              ))}
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
        <div className="w-full md:w-5/12 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Calendario de actividades
          </h2>

          {selectedDate && (
            <>
              <h3 className="text-base sm:text-xl text-white font-semibold mb-2">
                Eventos para el {selectedDate}/{currentMonth + 1}/{currentYear}
              </h3>
              {/* Botones para agregar o remover una actividad/ruta */}
              <div className="flex space-x-2 mb-4">
                <button
                  className="bg-gray-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar +
                </button>
                <button
                  className="bg-gray-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remover -
                </button>
              </div>
              <div className="space-y-4">
                {getEventsForDay(selectedDate).map((event, index) => (
                  <div
                    key={`${event.date}-${index}`}
                    className="bg-[rgba(25,39,15,0.8)] p-2 sm:p-4 rounded-lg"
                  >
                    <h4 className="text-base sm:text-xl text-white font-semibold mb-2">
                      {event.title}
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-base">
                      {event.description}
                    </p>
                  </div>
                ))}
                {getEventsForDay(selectedDate).length === 0 && (
                  <p className="text-gray-300 text-xs sm:text-base">No hay eventos para esta fecha</p>
                )}
              </div>
            </>
          )}
          
          {!selectedDate && (
            <p className="text-gray-300 text-xs sm:text-base">
              Selecciona una fecha para ver los eventos
            </p>
          )}

          {/* Conditionally render the button with increased margin-top */}
          {showSelectButton && (
            <div className="flex justify-end mt-8 sm:mt-20">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmDate}
                disabled={!selectedDate}
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

export default AdminCalendario;