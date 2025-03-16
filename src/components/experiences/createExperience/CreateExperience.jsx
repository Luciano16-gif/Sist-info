import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateExperience.css';

// Auth context - for currentUser and userRole information
import { useAuth } from '../../contexts/AuthContext';

// Custom hooks
import { useExperienceForm } from '../../hooks/experiences-hooks/useExperienceForm';

// Import actions directly 
import { updateField } from '../../hooks/experiences-hooks/experienceForm/actions';

// UI Components
import {
  ImageUploader,
  TextInput,
  TextArea,
  TimeInput,
  DateSelector,
  DifficultySelector,
  OptionSelector,
  CheckboxGroup,
  GuideSelector,
  SubmitButton
} from '../ExperienceFormComponent';

/**
 * CreateExperience component - Allows creating new experiences
 * Only accessible to guides and admins
 */
function CreateExperience() {
  // Get current user info, role, and navigate function
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Loading state while checking permissions
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  
  // Setup for new item inputs
  const [nuevoTipoActividad, setNuevoTipoActividad] = useState("");
  const [nuevoIncluido, setNuevoIncluido] = useState("");
  const [nuevoPuntoSalida, setNuevoPuntoSalida] = useState("");
  
  // Use the custom form hook
  const {
    formState,
    configState,
    formHandling,
    handlers,
    configHandlers,
    formOperations
  } = useExperienceForm();
  
  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Check user role and set status accordingly
  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!currentUser) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        // Check role directly from context (no need to fetch from Firestore again)
        if (userRole === 'admin' || userRole === 'guia') {
          // Set status based on role - accepted for admin, pending for guide
          if (userRole === 'admin') {
            // Use the enhanced setStatus method (defined below)
            handlers.setStatus('accepted');
          } else {
            handlers.setStatus('pending');
          }
        } else {
          // Not authorized
          setUnauthorized(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking access:", error);
        setUnauthorized(true);
        setLoading(false);
      }
    };
    
    if (userRole !== null) {
      checkAccess();
    }
  }, [currentUser, userRole]);

  // Enhanced handlers that don't use require()
  // We use the updateField action that we imported at the top of the file
  handlers.setStatus = (status) => {
    // Access dispatch from the useExperienceForm hook
    const dispatch = formOperations.dispatch;
    if (dispatch) {
      dispatch(updateField('status', status));
    } else {
      console.error("Dispatch function not available");
    }
  };

  // Add setter for createdBy field
  handlers.setCreatedBy = (email) => {
    const dispatch = formOperations.dispatch;
    if (dispatch) {
      dispatch(updateField('createdBy', email));
    } else {
      console.error("Dispatch function not available");
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Set who created this experience
    if (currentUser && currentUser.email) {
      handlers.setCreatedBy(currentUser.email);
    }
    
    const success = await formOperations.handleSubmit();
    if (success) {
      // Different success messages based on role
      if (userRole === 'admin') {
        setSuccessMessage('¡Experiencia creada exitosamente!');
      } else {
        setSuccessMessage('¡Solicitud de experiencia enviada! Un administrador la revisará pronto.');
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
    }
  };

  // Redirect unauthorized users
  if (unauthorized) {
    return (
      <div className="crear-experiencia-container-crear-experiencia">
        <h1 className="titulo-crear-experiencia">Acceso No Autorizado</h1>
        <p className="subtitulo-crear-experiencia">
          Solo los guías y administradores pueden acceder a esta página.
        </p>
        <button 
          className={`boton-agregar-crear-experiencia ${unauthorized && 'self-center'}`} 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px' }}
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="crear-experiencia-container-crear-experiencia">
        <h1 className="titulo-crear-experiencia">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="crear-experiencia-container-crear-experiencia">
      <h1 className="titulo-crear-experiencia">
        {userRole === 'admin' 
          ? 'Agregar una nueva Experiencia' 
          : 'Solicitar una nueva Experiencia'}
      </h1>
      <p className="subtitulo-crear-experiencia">
        {userRole === 'admin'
          ? 'Expande nuestra lista de servicios y experiencias únicas...'
          : 'Propón una nueva experiencia para que los administradores la aprueben...'}
      </p>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {/* General Form Error */}
      {formHandling.errors.submit && (
        <div className="error-message">
          {formHandling.errors.submit}
        </div>
      )}

      <div className="form-container-crear-experiencia">
        {/* Image Upload Section */}
        <ImageUploader
          imagePreview={formState.imagePreview}
          onImageChange={handlers.handleImageChange}
          error={formHandling.errors.imagen}
        />

        {/* Form Fields Section */}
        <div className="campos-container-crear-experiencia">
          {/* Basic Information */}
          <TextInput
            id="nombre"
            label="Nombre de la Experiencia"
            value={formState.nombre}
            onChange={handlers.handleNombreChange}
            error={formHandling.errors.nombre}
          />

          <div className="campo-row-crear-experiencia">
            <div className="campo-crear-experiencia campo-crear-experiencia-precio">
              <TextInput
                id="precio"
                label="Precio"
                value={formState.precio}
                onChange={handlers.handlePrecioChange}
                error={formHandling.errors.precio}
              />
            </div>
            
            <DifficultySelector
              difficulty={formState.dificultad}
              onDifficultyChange={handlers.handleDificultadClick}
              error={formHandling.errors.dificultad}
            />
          </div>

          {/* Date Selection */}
          <DateSelector
            selectedDates={formState.fechas}
            onDateChange={handlers.handleDateChange}
            error={formHandling.errors.fechas}
          />

          {/* Description */}
          <TextArea
            id="descripcion"
            label="Descripción"
            value={formState.descripcion}
            onChange={handlers.handleDescripcionChange}
            error={formHandling.errors.descripcion}
          />

          {/* Time Range */}
          <div className='campo-row-crear-experiencia'>
            <TimeInput
              id="horarioInicio"
              label="Horario Inicio"
              value={formState.horarioInicio}
              onChange={handlers.handleTimeChange('horarioInicio')}
              error={formHandling.errors.horarioInicio}
            />

            <TimeInput
              id="horarioFin"
              label="Horario Fin"
              value={formState.horarioFin}
              onChange={handlers.handleTimeChange('horarioFin')}
              error={formHandling.errors.horarioFin}
            />
          </div>

          {/* Display shared time range error if any */}
          {formHandling.errors.horario && (
            <div className="form-error">{formHandling.errors.horario}</div>
          )}

          {/* Location and Guides */}
          <div className="campo-row-crear-experiencia">
            <OptionSelector
              id="puntoSalida"
              label="Punto de Salida"
              value={formState.puntoSalida}
              onChange={handlers.handlePuntoSalidaChange}
              options={configState.puntosSalida}
              onAddNew={(nuevoPunto) => configHandlers.handleAgregarNuevoPuntoSalida(nuevoPunto)}
              error={formHandling.errors.puntoSalida}
              newValueState={[nuevoPuntoSalida, setNuevoPuntoSalida]}
              onNewValueChange={(e) => setNuevoPuntoSalida(e.target.value)}
              newValueError={formHandling.errors.nuevoPunto}
            />
            
            <TextInput
              id="guiasRequeridos"
              label="Guías Requeridos"
              value={formState.guiasRequeridos}
              onChange={handlers.handleIntegerInputChange(handlers.setGuiasRequeridos)}
              error={formHandling.errors.guiasRequeridos}
            />
          </div>

          {/* Guide Selection */}
          <GuideSelector
            guiasDisponibles={configState.guiasDisponibles}
            guiasSeleccionados={formState.guiasSeleccionados}
            onChange={handlers.handleSeleccionarGuia}
            error={formHandling.errors.guias}
          />

          {/* User Capacity and Incluidos */}
          <div className='campo-row-crear-experiencia'>
            <TextInput
              id="minimoUsuarios"
              label="Mínimo de Usuarios"
              value={formState.minimoUsuarios}
              onChange={handlers.handleIntegerInputChange(handlers.setMinimoUsuarios)}
              error={formHandling.errors.minimoUsuarios}
            />

            <CheckboxGroup
              label="Incluidos en la Experiencia"
              options={configState.opcionesIncluidos}
              selectedValues={formState.incluidosExperiencia}
              onChange={handlers.handleIncluidosChange}
              onAddNew={(nuevoIncluido) => configHandlers.handleAgregarNuevoIncluido(nuevoIncluido)}
              error={formHandling.errors.incluidosExperiencia}
              newValueState={[nuevoIncluido, setNuevoIncluido]}
              onNewValueChange={(e) => setNuevoIncluido(e.target.value)}
              newValueError={formHandling.errors.nuevoIncluido}
              containerClassName="campo-incluidos-experiencia"
              itemClassName="incluido-option"
              idPrefix="incluido"
            />
          </div>

          {/* Display shared user limits error if any */}
          {formHandling.errors.usuarios && (
            <div className="form-error">{formHandling.errors.usuarios}</div>
          )}

          {/* Maximum Users and Route Length */}
          <div className="campo-row-crear-experiencia">
            <TextInput
              id="maximoUsuarios"
              label="Máximo de Usuarios"
              value={formState.maximoUsuarios}
              onChange={handlers.handleIntegerInputChange(handlers.setMaximoUsuarios)}
              error={formHandling.errors.maximoUsuarios}
            />
            
            <TextInput
              id="longitudRecorrido"
              label="Longitud de Recorrido (km)"
              value={formState.longitudRecorrido}
              onChange={handlers.handleLongitudChange}
              error={formHandling.errors.longitudRecorrido}
            />
          </div>

          {/* Duration and Activity Type */}
          <div className="campo-row-crear-experiencia">
            <TextInput
              id="duracionRecorrido"
              label="Duración de Recorrido (minutos)"
              value={formState.duracionRecorrido}
              onChange={handlers.handleDuracionChange}
              error={formHandling.errors.duracionRecorrido}
            />
            
            <OptionSelector
              id="tipoActividad"
              label="Tipo de Actividad"
              value={formState.tipoActividad}
              onChange={handlers.handleTipoActividadChange}
              options={configState.tiposActividad}
              onAddNew={(nuevoTipo) => configHandlers.handleAgregarNuevoTipo(nuevoTipo)}
              error={formHandling.errors.tipoActividad}
              newValueState={[nuevoTipoActividad, setNuevoTipoActividad]}
              onNewValueChange={(e) => setNuevoTipoActividad(e.target.value)}
              newValueError={formHandling.errors.nuevoTipo}
              containerClassName="campo-tipo-actividad"
            />
          </div>
        </div>
      </div>

      {/* Submit Button with different text based on role */}
      <SubmitButton 
        onClick={handleSubmit}
        isSubmitting={formHandling.isSubmitting}
        text={userRole === 'admin' ? "Agregar" : "Enviar Solicitud"}
      />
    </div>
  );
}

export default CreateExperience;