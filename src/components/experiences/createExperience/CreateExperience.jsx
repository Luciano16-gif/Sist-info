import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateExperience.css';

// Auth context - for currentUser and userRole information
import { useAuth } from '../../contexts/AuthContext';

// Custom hooks
import { useExperienceForm } from '../../hooks/experiences-hooks/useExperienceForm';

// Import actions directly 
import { updateField } from '../../hooks/experiences-hooks/experienceForm/actions';

// Import ExperienceService
import ExperienceService from '../../services/ExperienceService';

// Import LoadingState component
import LoadingState from '../../../components/common/LoadingState/LoadingState';

// Import validation and utility modules
import { 
  validateExperienceEditForm,
  prepareExperienceUpdateData
} from '../../utils/ExperienceEditValidation';

import {
  createSafeDateChangeHandler
} from '../../utils/experienceDateHandlers';

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
import { set } from 'date-fns';

/**
 * CreateExperience component - Allows creating or editing experiences
 * Only accessible to guides and admins
 */
function CreateExperience({ isEditMode = false }) {
  // Get the experience ID from URL when in edit mode
  const { id } = useParams();
  
  // Get current user info, role, navigate function, and addCreatedExperience
  const { currentUser, userRole, getLastValidUser, addCreatedExperience } = useAuth();
  const navigate = useNavigate();

  // Loading state while checking permissions
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [experienceLoaded, setExperienceLoaded] = useState(false); // Track if experience was loaded
  
  // Setup for new item inputs
  const [nuevoTipoActividad, setNuevoTipoActividad] = useState("");
  const [nuevoIncluido, setNuevoIncluido] = useState("");
  const [nuevoPuntoSalida, setNuevoPuntoSalida] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  
  // Use the custom form hook
  const {
    formState,
    configState,
    formHandling,
    handlers,
    configHandlers,
    formOperations
  } = useExperienceForm();
  
  // Add these for edit mode
  const [originalExperience, setOriginalExperience] = useState(null);
  
  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add these new variables for auth persistence
  const [persistentUserData, setPersistentUserData] = useState(null);
  const userDataRef = useRef(null);

  // This effect runs to load the experience data when in edit mode
  useEffect(() => {
    // Only run this effect once when we're in edit mode and have an ID
    // and haven't already loaded the experience
    if (isEditMode && id && !experienceLoaded) {
      const loadExperienceData = async () => {
        try {
          setLoadingExperience(true);
          setLoadError(null);
          
          console.log("Loading experience with ID:", id);
          const experience = await ExperienceService.getExperienceById(id);
          setOriginalExperience(experience);
          
          // Pre-fill form with experience data
          if (experience) {
            console.log("Loaded experience data:", experience);
            
            // Update form fields with existing data
            formOperations.dispatch(updateField('nombre', experience.name || ''));
            formOperations.dispatch(updateField('precio', experience.price?.toString() || ''));
            formOperations.dispatch(updateField('descripcion', experience.description || ''));
            
            // Parse time format (e.g., "10:00 - 14:00" -> "10:00" and "14:00")
            if (experience.time) {
              const timeParts = experience.time.split('-').map(t => t.trim());
              if (timeParts.length === 2) {
                formOperations.dispatch(updateField('horarioInicio', timeParts[0]));
                formOperations.dispatch(updateField('horarioFin', timeParts[1]));
              }
            }
            
            // Handle the distance (e.g. "5 km" -> "5")
            if (experience.distance) {
              const distanceValue = experience.distance.replace(/[^\d.]/g, '');
              formOperations.dispatch(updateField('longitudRecorrido', distanceValue));
            }
            
            // Handle duration
            formOperations.dispatch(updateField('duracionRecorrido', experience.duracion?.toString() || ''));
            
            // Parse min/max people
            formOperations.dispatch(updateField('minimoUsuarios', experience.minPeople?.toString() || ''));
            formOperations.dispatch(updateField('maximoUsuarios', experience.maxPeople?.toString() || ''));
            
            // Handle guides
            if (experience.rawData?.guiasRequeridos) {
              formOperations.dispatch(updateField('guiasRequeridos', experience.rawData.guiasRequeridos.toString()));
            }
            
            if (experience.rawData?.guias) {
              formOperations.dispatch(updateField('guiasSeleccionados', experience.rawData.guias || []));
            }
            
            // Handle included items
            if (experience.incluidos) {
              formOperations.dispatch(updateField('incluidosExperiencia', experience.incluidos));
            }
            
            // Handle departure point
            if (experience.puntoDeSalida) {
              formOperations.dispatch(updateField('puntoSalida', experience.puntoDeSalida));
            }
            
            // Handle activity type
            if (experience.rawData?.tipoActividad) {
              formOperations.dispatch(updateField('tipoActividad', experience.rawData.tipoActividad));
            }
            
            // Handle difficulty
            if (experience.difficulty) {
              formOperations.dispatch(updateField('dificultad', experience.difficulty));
            }
            
            // Handle dates
            if (experience.rawData?.fechas) {
              formOperations.dispatch(updateField('fechas', experience.rawData.fechas));
            }
            
            // Handle image
            if (experience.imageUrl) {
              // Just set the preview URL, the original file we can't retrieve
              formOperations.dispatch(updateField('imagePreview', experience.imageUrl));
            }
            
            // Set createdBy from the original experience
            if (experience.rawData?.createdBy) {
              formOperations.dispatch(updateField('createdBy', experience.rawData.createdBy));
            }

            // Mark experience as loaded to prevent further loading attempts
            setExperienceLoaded(true);
          }
          
          setLoadingExperience(false);
        } catch (error) {
          console.error("Error loading experience:", error);
          setLoadError(error.message || "Error al cargar la experiencia");
          setLoadingExperience(false);
        }
      };
      
      loadExperienceData();
    }
  }, [isEditMode, id, formOperations, experienceLoaded]); // Added experienceLoaded to dependencies
  
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
  
  // Improved setter for createdBy field with verification
  handlers.setCreatedBy = (email) => {
    const dispatch = formOperations.dispatch;
    if (dispatch) {
      dispatch(updateField('createdBy', email));
      
      // Verify the field was actually updated
      setTimeout(() => {
        if (formOperations.getState) {
          const currentState = formOperations.getState();
          console.log("createdBy after update:", currentState.formFields.createdBy);
          if (currentState.formFields.createdBy !== email) {
            console.warn("createdBy field wasn't updated correctly, forcing it");
            dispatch(updateField('createdBy', email));
          }
        }
      }, 10);
    } else {
      console.error("Dispatch function not available");
    }
  };
  
  // Function to update the original handleSubmit in useExperienceForm
  const originalHandleSubmit = formOperations.handleSubmit;
  
  // Store the original handleSubmit function if it exists
  useEffect(() => {
    if (formOperations.handleSubmit && !formOperations._originalHandleSubmit) {
      formOperations._originalHandleSubmit = formOperations.handleSubmit;
      
      // Override handleSubmit to add our experience update
      formOperations.handleSubmit = async () => {
        try {
          // Call the original submit function and get the result (this should be the created experience)
          const result = await formOperations._originalHandleSubmit();
          
          // If successful and we have the experience ID, update the user's profile
          if (result && result.id && addCreatedExperience) {
            console.log("Experience created successfully, updating user profile with ID:", result.id);
            await addCreatedExperience(result.id);
          }
          
          return result;
        } catch (error) {
          console.error("Error during experience creation:", error);
          throw error; // Re-throw to let the original error handling deal with it
        }
      };
    }
  }, [formOperations, addCreatedExperience]);
  

  const handleSubmit = async () => {
    console.log("handleSubmit called - starting execution");

    formHandling.isSubmitting = true;
    
    // Get the current form state
    let currentFormState = formOperations.getState ? formOperations.getState().formFields : formState;
    
    // Get the user's email from multiple sources
    let userEmail = null;
    
    // Try to get email from current user
    if (currentUser && currentUser.email) {
      userEmail = currentUser.email;
    } else if (userDataRef.current && userDataRef.current.email) {
      userEmail = userDataRef.current.email;
    } else if (persistentUserData && persistentUserData.email) {
      userEmail = persistentUserData.email;
    } else {
      // Try localStorage
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
      formOperations.dispatch(updateField('errors', { 
        ...formHandling.errors, 
        submit: errorMsg 
      }));
      return;
    }
    
    // Set createdBy field with the obtained email
    handlers.setCreatedBy(userEmail);
    
    // Force update form state directly for extra safety
    formOperations.dispatch(updateField('createdBy', userEmail));
    
    // Small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Update the current form state to get the latest values after updates
    currentFormState = formOperations.getState ? formOperations.getState().formFields : {};
    
    // Log the current form state for debugging
    console.log("Form state before submission:", currentFormState);
    
    // Double-check the createdBy field
    if (!currentFormState.createdBy) {
      console.warn("createdBy still missing before submission, forcing it once more");
      formOperations.dispatch(updateField('createdBy', userEmail));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Check dates and show error but continue with submission
    if (!currentFormState.fechas || currentFormState.fechas.length === 0) {
      formOperations.dispatch(updateField('errors', { 
        ...formHandling.errors, 
        fechas: 'Se requiere al menos una fecha para la experiencia.' 
      }));
    }
    
    // Determine effective role for messaging
    const effectiveRole = userRole || (userDataRef.current && userDataRef.current.role) || localStorage.getItem('tempUserRole') || 'guia';
    
    // EDIT MODE: Update instead of create
    if (isEditMode) {
      setIsUpdating(true);

      try {        
        // Update the form state again to get the latest values
        currentFormState = formOperations.getState ? formOperations.getState().formFields : {};
        
        // Ensure createdBy is set 
        if (!currentFormState.createdBy) {
          formOperations.dispatch(updateField('createdBy', userEmail));
        }
        
        // Perform validation with special rules for edit mode
        const { isValid, errors } = validateExperienceEditForm(
          currentFormState, 
          originalExperience,
          formOperations.validateForm().errors
        );
        
        if (!isValid) {
          // Update the form with validation errors
          formOperations.dispatch(updateField('errors', errors));
          console.log("Form validation failed:", errors);
          formOperations.dispatch(updateField('setSubmitting', false));
          setIsUpdating(false);
          return false;
        }
        
        // Ensure preserving the original experience ID
        if (id && originalExperience) {
          // Prepare the data for update using our utility function
          const updateData = prepareExperienceUpdateData(currentFormState, originalExperience);
          
          console.log("Updating experience with data:", updateData);
          
          // Use ExperienceService to update
          const result = await ExperienceService.updateExperience(id, updateData);
          
          if (result) {
            setSuccessMessage('¡Experiencia actualizada exitosamente!');
            setShowSuccess(true);
            
            // Redirect after a delay
            setTimeout(() => {
              navigate('/admin-calendario');
            }, 2000);
            
            return true;
          }
        } else {
          formOperations.dispatch(updateField('errors', {
            ...formHandling.errors,
            submit: "Error: No se pudo determinar el ID de la experiencia a actualizar."
          }));
          return false;
        }
      } catch (error) {
        console.error("Error updating experience:", error);
        formOperations.dispatch(updateField('errors', {
          ...formHandling.errors,
          submit: error.message || "Error al actualizar la experiencia."
        }));
        return false;
      } finally {
        formOperations.dispatch(updateField('setSubmitting', true));
        isEditMode = true;
      }
    } else {

      
      try {
        // Check if validateForm exists
        if (typeof formOperations.validateForm !== 'function') {
          console.error("formOperations.validateForm is not a function:", formOperations);
          formOperations.dispatch(updateField('errors', {
            ...formHandling.errors,
            submit: "Error interno: validateForm no está disponible."
          }));
          return false;
        }
        
        const { isValid, errors } = formOperations.validateForm();
        
        // Filter out the date error so it doesn't block submission
        const filteredErrors = { ...errors };
        delete filteredErrors.fechas;
        
        if (Object.keys(filteredErrors).length > 0) {
          // If validation fails on other fields, show errors and return
          console.log("Form validation failed:", filteredErrors);
          formOperations.dispatch(updateField('errors', filteredErrors));
          return false;
        }
        
        // Check if handleSubmit exists before calling it
        if (typeof formOperations.handleSubmit !== 'function') {
          console.error("formOperations.handleSubmit is not a function:", formOperations);
          
          // Try a direct submission instead
          console.log("Attempting direct experience creation");
          
          try {
            // Create the experience data object
            const createData = {
              name: currentFormState.nombre,
              price: parseFloat(currentFormState.precio),
              description: currentFormState.descripcion,
              time: `${currentFormState.horarioInicio} - ${currentFormState.horarioFin}`,
              distance: `${currentFormState.longitudRecorrido} km`,
              duracion: parseInt(currentFormState.duracionRecorrido, 10),
              minPeople: parseInt(currentFormState.minimoUsuarios, 10),
              maxPeople: parseInt(currentFormState.maximoUsuarios, 10),
              difficulty: currentFormState.dificultad,
              puntoDeSalida: currentFormState.puntoSalida,
              incluidos: currentFormState.incluidosExperiencia,
              status: currentFormState.status || 'pending',
              imageFile: currentFormState.imagen,
              rawData: {
                createdBy: userEmail,
                fechas: currentFormState.fechas,
                tipoActividad: currentFormState.tipoActividad,
                guiasRequeridos: parseInt(currentFormState.guiasRequeridos, 10),
                guias: currentFormState.guiasSeleccionados
              }
            };
            
            // Call the service directly
            const result = await ExperienceService.createExperience(createData);
            
            if (result && result.id && typeof addCreatedExperience === 'function') {
              await addCreatedExperience(result.id);
            }
            
            setSuccessMessage(effectiveRole === 'admin' 
              ? '¡Experiencia creada exitosamente!' 
              : '¡Solicitud de experiencia enviada! Un administrador la revisará pronto.');
            
            setShowSuccess(true);
            if (userRole === 'admin') {
              setTimeout(() => {
              navigate('/admin-calendario');
            }, 2000);
            }
            
            
            return true;
          } catch (directError) {
            console.error("Direct experience creation failed:", directError);
            formOperations.dispatch(updateField('errors', {
              ...formHandling.errors,
              submit: directError.message || "Error al crear la experiencia directamente."
            }));
            return false;
          } finally {
            formOperations.dispatch(updateField('setSubmitting', false));
          }
        }
        
        console.log("Calling formOperations.handleSubmit");
        // Use existing code for creation
        const success = await formOperations.handleSubmit();
      
        if (success) {
          console.log("Experience creation successful:", success);
          // Different success messages based on role
          if (effectiveRole === 'admin') {
            setSuccessMessage('¡Experiencia creada exitosamente!');
          } else {
            setSuccessMessage('¡Solicitud de experiencia enviada! Un administrador la revisará pronto.');
          }
          
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/admin-calendario');
          }, 2000);
        } else {
          console.warn("Experience creation returned falsy value:", success);
        }
        
        return success;
      } catch (error) {
        console.error("Error in CREATE mode:", error);
        formOperations.dispatch(updateField('errors', {
          ...formHandling.errors,
          submit: error.message || "Error al crear la experiencia."
        }));
        return false;
      }
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
  if (loading || loadingExperience) {
    return (
      <div className="crear-experiencia-container-crear-experiencia">
        <LoadingState 
          text={isEditMode ? "Cargando datos de la experiencia..." : "Cargando..."} 
          className="min-h-[300px]"
        />
      </div>
    );
  }

  // Show error state if there's a load error
  if (loadError) {
    return (
      <div className="crear-experiencia-container-crear-experiencia">
        <h1 className="titulo-crear-experiencia">Error</h1>
        <p className="error-message">
          {loadError}
        </p>
        <button 
          className="boton-agregar-crear-experiencia self-center" 
          onClick={() => navigate('/admin-calendario')}
          style={{ marginTop: '20px' }}
        >
          Volver al Calendario
        </button>
      </div>
    );
  }

  // Determine effective role for UI rendering
  const effectiveRole = userRole || 
                       (userDataRef.current && userDataRef.current.role) || 
                       localStorage.getItem('tempUserRole') || 
                       'guia';

  // Set page title and button text based on mode
  const pageTitle = isEditMode 
    ? 'Editar Experiencia' 
    : effectiveRole === 'admin' 
      ? 'Agregar una nueva Experiencia' 
      : 'Solicitar una nueva Experiencia';

  const buttonText = isEditMode 
    ? 'Actualizar' 
    : effectiveRole === 'admin' 
      ? 'Agregar' 
      : 'Enviar Solicitud';

  return (
    <div className="crear-experiencia-container-crear-experiencia">
      <h1 className="titulo-crear-experiencia">
        {pageTitle}
      </h1>
      <p className="subtitulo-crear-experiencia">
        {isEditMode
          ? 'Actualiza la información de esta experiencia...'
          : effectiveRole === 'admin'
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
            placeholder={originalExperience?.name || ""}
          />

          <div className="campo-row-crear-experiencia">
            <div className="campo-crear-experiencia campo-crear-experiencia-precio">
              <TextInput
                id="precio"
                label="Precio"
                value={formState.precio}
                onChange={handlers.handlePrecioChange}
                error={formHandling.errors.precio}
                placeholder={originalExperience?.price?.toString() || ""}
              />
            </div>
            
            <DifficultySelector
              difficulty={formState.dificultad}
              onDifficultyChange={handlers.handleDificultadClick}
              error={formHandling.errors.dificultad}
            />
          </div>

          {/* Date Selection - using original handler with no validation */}
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
            placeholder={originalExperience?.description || ""}
          />

          {/* Time Range */}
          <div className='campo-row-crear-experiencia'>
            <TimeInput
              id="horarioInicio"
              label="Horario Inicio"
              value={formState.horarioInicio}
              onChange={handlers.handleTimeChange('horarioInicio')}
              error={formHandling.errors.horarioInicio}
              placeholder={originalExperience?.time?.split('-')[0]?.trim() || ""}
            />

            <TimeInput
              id="horarioFin"
              label="Horario Fin"
              value={formState.horarioFin}
              onChange={handlers.handleTimeChange('horarioFin')}
              error={formHandling.errors.horarioFin}
              placeholder={originalExperience?.time?.split('-')[1]?.trim() || ""}
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
              placeholder={originalExperience?.puntoDeSalida || ""}
            />
            
            <TextInput
              id="guiasRequeridos"
              label="Guías Requeridos"
              value={formState.guiasRequeridos}
              onChange={handlers.handleIntegerInputChange(handlers.setGuiasRequeridos)}
              error={formHandling.errors.guiasRequeridos}
              placeholder={originalExperience?.rawData?.guiasRequeridos?.toString() || ""}
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
              placeholder={originalExperience?.minPeople?.toString() || ""}
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
              placeholder={originalExperience?.maxPeople?.toString() || ""}
            />
            
            <TextInput
              id="longitudRecorrido"
              label="Longitud de Recorrido (km)"
              value={formState.longitudRecorrido}
              onChange={handlers.handleLongitudChange}
              error={formHandling.errors.longitudRecorrido}
              placeholder={originalExperience?.distance?.replace(/[^\d.]/g, '') || ""}
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
              placeholder={originalExperience?.duracion?.toString() || ""}
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
              placeholder={originalExperience?.rawData?.tipoActividad || ""}
            />
          </div>
        </div>
      </div>
      {/* Submit Button with different text based on mode */}
      <SubmitButton 
        onClick={handleSubmit}
        isSubmitting={formHandling.isSubmitting || isUpdating}
        text={buttonText}
      />
    </div>
  );
}

export default CreateExperience;