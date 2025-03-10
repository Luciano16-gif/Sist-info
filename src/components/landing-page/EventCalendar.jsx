import React, { useState } from 'react';

const EventCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  //Ejemplos de eventos para la visualización del calendario
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

  const getDaysInMonth = () => {
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
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendario */}
        <div className="w-full md:w-7/12 bg-[rgba(25,39,15,0.8)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePrevMonth}
              className="text-white text-2xl focus:outline-none"
            >
              ←
            </button>
            <h2 className="text-white text-3xl font-bold">
              {months[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="text-white text-2xl focus:outline-none"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-white font-semibold">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((week, weekIndex) => (
              week.map((day, dayIndex) => {
                const currentDate = new Date();
                const isToday = 
                  currentYear === currentDate.getFullYear() &&
                  currentMonth === currentDate.getMonth() &&
                  day === currentDate.getDate();
                  
                const dayEvents = getEventsForDay(day);
                
                return (
                  <div 
                    key={`${weekIndex}-${dayIndex}`}
                    className={`relative rounded-lg p-2 cursor-pointer transition-colors ${
                      isToday ? 'bg-green-500' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className="text-white text-center">
                          {day}
                        </div>
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {dayEvents.map((event, index) => (
                              <div 
                                key={index}
                                className={`w-2 h-2 rounded-full ${event.color}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>

        {/* Sección de eventos */}
        <div className="w-full md:w-5/12 space-y-4">
          <h2 className="text-5xl font-bold text-white mb-4">
            Calendario de actividades
          </h2>
          
          {selectedDate && (
            <>
              <h3 className="text-xl text-white font-semibold mb-2">
                Eventos para el {selectedDate}/{currentMonth + 1}/{currentYear}
              </h3>
              <div className="space-y-4">
              {getEventsForDay(selectedDate).map((event, index) => (
                <div 
                  key={`${event.date}-${index}`}
                  className="bg-[rgba(25,39,15,0.8)] p-4 rounded-lg"
                >
                  <h4 className="text-xl text-white font-semibold mb-2">
                    {event.title}
                  </h4>
                  <p className="text-gray-300">
                    {event.description}
                  </p>
                </div>
              ))}
              </div>
            </>
          )}

          {!selectedDate && (
            <p className="text-gray-300">
              Selecciona una fecha para ver los eventos
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;