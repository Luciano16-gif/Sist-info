import React, { useState, useEffect, useRef } from 'react';
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
  const { currentUser, userRole, getLastValidUser } = useAuth();
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
  
  // Add these new variables for auth persistence
  const [persistentUserData, setPersistentUserData] = useState(null);
  const userDataRef = useRef(null);
  
  // This effect runs once on component mount and captures user data
  useEffect(() => {
    if (currentUser && currentUser.email) {
      
      // Store user data in state
      setPersistentUserData({
        email: currentUser.email,
        role: userRole
      });
      
      // Store in ref for immediate access without re-renders
      userDataRef.current = {
        email: currentUser.email,
        role: userRole
      };
      
      // Store in localStorage as backup
      try {
        localStorage.setItem('tempUserEmail', currentUser.email);
        localStorage.setItem('tempUserRole', userRole || 'pending');
      } catch (e) {
        console.error("Failed to store user data in localStorage:", e);
      }
    }
  }, [currentUser, userRole]);
  
  // Check user role and set status accordingly
  useEffect(() => {
    const checkAccess = async () => {
      try {
        
        // First try with current user
        if (currentUser && currentUser.email) {
          if (userRole === 'admin' || userRole === 'guia') {       
            // Set status based on role - accepted for admin, pending for guide
            if (userRole === 'admin') {
              handlers.setStatus('accepted');
            } else {
              handlers.setStatus('pending');
            }
            
            // Pre-set the createdBy field as soon as we know the user is valid
            handlers.setCreatedBy(currentUser.email);
            setLoading(false);
            return;
          }
        }
        
        // If no current user, try to recover from persistent data
        let recoveredUser = null;
        
        // Try from ref first
        if (userDataRef.current && userDataRef.current.email) {
          recoveredUser = userDataRef.current;
        } 
        // Then try from state
        else if (persistentUserData && persistentUserData.email) {
          recoveredUser = persistentUserData;
        } 
        // Then try from localStorage
        else {
          try {
            const email = localStorage.getItem('tempUserEmail');
            const role = localStorage.getItem('tempUserRole');
            if (email) {
              recoveredUser = { email, role };
            }
          } catch (e) {
            console.error("Failed to get user from localStorage:", e);
          }
        }
        
        // Try lastValidUser from auth context if available
        if (!recoveredUser && typeof getLastValidUser === 'function') {
          recoveredUser = getLastValidUser();
        }
        
        if (recoveredUser) {
          
          if (recoveredUser.role === 'admin' || recoveredUser.role === 'guia') {
            // Set status based on recovered role
            if (recoveredUser.role === 'admin') {
              handlers.setStatus('accepted');
            } else {
              handlers.setStatus('pending');
            }
            
            // Set createdBy using recovered email
            handlers.setCreatedBy(recoveredUser.email);
            setLoading(false);
            return;
          }
        }

        // If we get here, user is unauthorized

        setUnauthorized(true);
        setLoading(false);
      } catch (error) {
        console.error("Error checking access:", error);
        setUnauthorized(true);
        setLoading(false);
      }
    };
    
    checkAccess();
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

  // Add setter for createdBy field with logging
  handlers.setCreatedBy = (email) => {
    const dispatch = formOperations.dispatch;
    if (dispatch) {
      dispatch(updateField('createdBy', email));
      
      // Verify the field was actually updated
      setTimeout(() => {
      }, 0);
    } else {
      console.error("Dispatch function not available");
    }
  };
  
  // Enhanced handleSubmit function
  const handleSubmit = async () => {
    
    // Source of truth for user email, checking multiple places
    let userEmail = null;
    
    // Try to get email from multiple sources in order of preference
    if (currentUser && currentUser.email) {
      userEmail = currentUser.email;
    } else if (userDataRef.current && userDataRef.current.email) {
      userEmail = userDataRef.current.email;
    } else if (persistentUserData && persistentUserData.email) {
      userEmail = persistentUserData.email;
    } else {
      try {
        const storedEmail = localStorage.getItem('tempUserEmail');
        if (storedEmail) {
          userEmail = storedEmail;
        }
      } catch (e) {
        console.error("Failed to get email from localStorage:", e);
      }
    }
    
    // Try lastValidUser from auth context if available
    if (!userEmail && typeof getLastValidUser === 'function') {
      const lastValid = getLastValidUser();
      if (lastValid && lastValid.email) {
        userEmail = lastValid.email;
      }
    }
    
    // Final check before submission
    if (!userEmail) {
      const errorMsg = "No se pudo determinar el usuario. Por favor, intente cerrar sesión y volver a iniciar sesión.";
      console.error(errorMsg);
      formOperations.dispatch(updateField('submit', errorMsg));
      return;
    }
    
    // Set createdBy field with the obtained email
    handlers.setCreatedBy(userEmail);
    
    // Force update form state directly for extra safety
    formOperations.dispatch(updateField('createdBy', userEmail));
    
    // Small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Check the form state before submitting
    const formCopy = { ...formState };
    
    if (!formCopy.createdBy) {
      console.warn("createdBy still missing after setting, forcing it again");
      formCopy.createdBy = userEmail;
      // Force direct update to form state
      formOperations.dispatch(updateField('createdBy', userEmail));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Determine effective role for messaging
    const effectiveRole = userRole || 
                         (userDataRef.current && userDataRef.current.role) || 
                         localStorage.getItem('tempUserRole') || 
                         'guia';
    
    // Execute form submission
    const success = await formOperations.handleSubmit();
    if (success) {
      // Different success messages based on role
      if (effectiveRole === 'admin') {
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

  // Determine effective role for UI rendering
  const effectiveRole = userRole || 
                       (userDataRef.current && userDataRef.current.role) || 
                       localStorage.getItem('tempUserRole') || 
                       'guia';

  return (
    <div className="crear-experiencia-container-crear-experiencia">
      <h1 className="titulo-crear-experiencia">
        {effectiveRole === 'admin' 
          ? 'Agregar una nueva Experiencia' 
          : 'Solicitar una nueva Experiencia'}
      </h1>
      <p className="subtitulo-crear-experiencia">
        {effectiveRole === 'admin'
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
        text={effectiveRole === 'admin' ? "Agregar" : "Enviar Solicitud"}
      />
    </div>
  );
}

export default CreateExperience;