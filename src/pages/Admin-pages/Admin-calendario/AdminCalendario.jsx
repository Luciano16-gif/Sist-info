import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCalendar from '../../../components/calendar/EventCalendar';
import experienceFormService from '../../../components/services/experienceFormService';
import { useExperiences } from '../../../components/hooks/experiences-hooks/useExperiences';
import { experiencesToCalendarEvents, getEventsForDay } from '../../../components/utils/calendarUtils';
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import LoadingState from '../../../components/common/LoadingState/LoadingState';

const AdminCalendario = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rejectFeedback, setRejectFeedback] = useState('');
  
  // Use the experiences hook to get all experiences - this is the same data source used by EventCalendar
  const { experiences, loading, error } = useExperiences();
  
  // Function to handle date selection from the calendar
  const handleDateSelect = (date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
  };
  
  // When selectedDate or experiences change, update events for the selected date
  useEffect(() => {
    if (!selectedDate || !experiences || experiences.length === 0) {
      setEventsForSelectedDate([]);
      return;
    }
    
    // Get year, month and day from the selected date
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    
    console.log(`Finding events for: ${year}-${month+1}-${day}`);
    
    // Filter out rejected experiences first
    const acceptedExperiences = experiences.filter(exp => 
      !exp.rawData || exp.rawData.status === 'accepted'
    );
    
    console.log(`Filtered from ${experiences.length} to ${acceptedExperiences.length} experiences after removing rejected ones`);
    
    // Convert experiences to calendar events format (same as EventCalendar)
    const calendarEvents = experiencesToCalendarEvents(acceptedExperiences, year, month);
    
    // Get events for the selected day (same as EventCalendar)
    const events = getEventsForDay(calendarEvents, day, month, year);
    
    console.log(`Found ${events.length} events for selected date`, events);
    setEventsForSelectedDate(events);
  }, [selectedDate, experiences, refreshTrigger]);
  
  // Function to handle editing an experience
  const handleEditClick = (event) => {
    // Navigate to edit page with the experience ID
    navigate(`/admin-edit-experience/${event.experienceData.id}`);
  };
  
  // Function to handle experience deletion confirmation
  const handleDeleteClick = (event) => {
    // Get the full experience data from the event
    const experience = event.experienceData;
    console.log("Experience to delete:", experience);
    setExperienceToDelete(experience);
    setShowDeleteModal(true);
  };
  
  // Function to close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setExperienceToDelete(null);
    setRejectFeedback('');
  };
  
  // Function to delete an experience
  const handleConfirmDelete = async () => {
    if (!experienceToDelete) return;
    
    if (!rejectFeedback.trim()) {
      alert('Por favor proporcione retroalimentación para el guía antes de eliminar la experiencia.');
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Update experience status to "rejected" with feedback
      await experienceFormService.updateExperienceStatus(
        experienceToDelete.id,
        'rejected',
        rejectFeedback
      );
      
      console.log(`Experience ${experienceToDelete.name} deleted successfully`);
      
      // Close the modal
      handleCloseDeleteModal();
      
      // Refresh the page to ensure all data is updated
      window.location.reload();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert(`Error al eliminar la experiencia: ${error.message}`);
      setIsDeleting(false);
    }
  };
  
  // Add a useEffect to properly update the events for selected date when refreshTrigger changes
  useEffect(() => {
    if (selectedDate) {
      // Force re-fetch of events for the currently selected date
      // by temporarily clearing and then re-setting the selectedDate
      const currentDate = new Date(selectedDate);
      setSelectedDate(null);
      
      // Small delay to ensure state update completes
      setTimeout(() => {
        setSelectedDate(currentDate);
      }, 50);
    }
  }, [refreshTrigger]);
  
  return (
    <div className={`inset-0 mx-2 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-6 flex flex-col justify-start items-start px-4 md:px-8 ${adminBaseStyles}`}>
      {/* Header content */}
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Calendario</h1>
      <h1 className="text-white text-base sm:text-lg md:text-lg">
        Este calendario le enseña a nuestros usuarios y guías las diversas actividades y experiencias que ofrecemos cada mes de una forma compacta y organizada.
      </h1>
      <hr className="border-1 border-white-600 w-full sm:w-1/2 md:w-96" />
      
      {/* Calendar container with admin panel */}
      <div className="w-full mt-6 flex flex-col xl:flex-row gap-6">
        {/* EventCalendar component - full width on small/medium screens, 7/12 on xl screens */}
        <div className="w-full xl:w-9/12">
          <EventCalendar 
            onDateSelect={handleDateSelect} 
            showSelectButton={true} 
            key={`calendar-${refreshTrigger}`}
            isAdmin={true} // Pass isAdmin flag to remove restrictions
          />
        </div>
        
        {/* Admin Panel - full width on small/medium screens, 5/12 on xl screens */}
        <div className="w-full xl:w-3/12 bg-[rgba(25,39,15,0.8)] rounded-xl p-3 sm:p-4 mt-4 xl:mt-0">
          <h2 className="text-xl font-bold text-white mb-3">Panel de Administración</h2>
          
          {selectedDate ? (
            <>
              <h3 className="text-lg sm:text-xl text-white mb-2">
                Experiencias para el {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
              </h3>
              
              {loading ? (
                <LoadingState text="Cargando experiencia..." />
              ) : error ? (
                <p className="text-red-300">Error: {error}</p>
              ) : eventsForSelectedDate.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                  {eventsForSelectedDate.map((event, index) => (
                    <div key={`${event.id}-${index}`} className="bg-[rgba(59,82,40,0.8)] p-3 rounded-lg">
                      <h4 className="text-white font-semibold">{event.title}</h4>
                      <div className="flex justify-between text-gray-300 text-xs mt-1">
                        <span>Horario: {event.time}</span>
                        <span>Precio: ${event.experienceData.price}</span>
                      </div>
                      <p className="text-gray-300 text-sm my-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => handleEditClick(event)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => handleDeleteClick(event)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No hay experiencias para esta fecha.</p>
              )}
            </>
          ) : (
            <p className="text-gray-300">Selecciona una fecha para ver y administrar las experiencias.</p>
          )}
          
          {/* No button here - it will be shown in the EventCalendar component */}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && experienceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3A4C2E] text-white rounded-lg p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Confirmar Eliminación</h2>
              <button
                onClick={handleCloseDeleteModal}
                className="text-white text-2xl hover:text-red-500"
              >
                ×
              </button>
            </div>
            
            <p className="mb-4">
              ¿Estás seguro que deseas eliminar la experiencia "{experienceToDelete.name}"?
            </p>
            <p className="text-red-300 mb-4 text-sm">
              Esta acción cambiará el estado de la experiencia a "rechazada" y no será visible para los usuarios.
            </p>
            
            <div className="mb-4">
              <label className="block text-white mb-2">
                Por favor, proporcione retroalimentación para el guía:
              </label>
              <textarea
                className="w-full bg-[#4A5D3E] text-white rounded-lg p-3 min-h-[100px]"
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Explique por qué esta experiencia está siendo eliminada..."
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDeleteModal}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                disabled={isDeleting || !rejectFeedback.trim()}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendario;