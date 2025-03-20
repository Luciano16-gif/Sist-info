import * as actions from './actions';
import experienceFormService from '../../../services/experienceFormService';
import { validateExperienceForm } from '../../../utils/ExperienceValidation';

/**
 * Create form field handlers with a dispatch function
 * @param {Function} dispatch - Reducer dispatch function
 * @returns {Object} Form field handlers
 */
export const createFieldHandlers = (dispatch) => {
  // Text field change handler
  const handleNombreChange = (e) => {
    dispatch(actions.updateField('nombre', e.target.value));
  };
  
  // Price change handler with validation
  const handlePrecioChange = (e) => {
    const value = e.target.value;
    if (/^(\d+)?\.?\d*$/.test(value)) {
      dispatch(actions.updateField('precio', value));
    }
  };
  
  // Description field change handler
  const handleDescripcionChange = (e) => {
    dispatch(actions.updateField('descripcion', e.target.value));
  };
  
  const handleTimeChange = (fieldName) => (e) => {
    let value = e.target.value;
    
    // Remove any non-digit and non-colon characters
    value = value.replace(/[^0-9:]/g, '');
    
    // Track if user is typing forward (not backspacing)
    // We check the inputType property from the native event
    // This is because when adding the ':' if we dont do this the user cant backspace
    const isTypingForward = e.nativeEvent.inputType !== 'deleteContentBackward';
    
    // Only add colon when typing forward AND exactly at 2 digits without a colon
    if (isTypingForward && value.length === 2 && !value.includes(':')) {
      value = value + ':';
    }
    
    // Limit to 5 characters (HH:MM format)
    value = value.slice(0, 5);
    
    dispatch(actions.updateField(fieldName, value));
  };

  // Location field change handler
  const handlePuntoSalidaChange = (e) => {
    dispatch(actions.updateField('puntoSalida', e.target.value));
  };
  
  // Distance field change handler with validation
  const handleLongitudChange = (e) => {
    const value = e.target.value;
    if (/^(\d+)?\.?\d*$/.test(value)) {
      dispatch(actions.updateField('longitudRecorrido', value));
    }
  };
  
  // Duration field change handler with validation
  const handleDuracionChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      dispatch(actions.updateField('duracionRecorrido', value));
    }
  };
  
  // Integer field change handler with validation
  const handleIntegerInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Determine which field to update based on the setter function
      let field;
      if (setter === setGuiasRequeridos) field = 'guiasRequeridos';
      else if (setter === setMinimoUsuarios) field = 'minimoUsuarios';
      else if (setter === setMaximoUsuarios) field = 'maximoUsuarios';
      
      dispatch(actions.updateField(field, value));
    }
  };
  
  // Activity type field change handler
  const handleTipoActividadChange = (e) => {
    dispatch(actions.updateField('tipoActividad', e.target.value));
  };
  
  // Included items toggle handler
  const handleIncluidosChange = (option) => {
    dispatch(actions.toggleArrayItem('incluidosExperiencia', option));
  };
  
  // date handlers (new)
  const handleDateChange = (dateValue) => {
    if (Array.isArray(dateValue)) {
      // If it's an array of dates, update the entire fechas array
      dispatch(actions.updateArrayField('fechas', dateValue));
    } else {
      // If it's a single date string, add it to the array if not already there
      const currentDates = formState.fechas || [];
      
      // Prevent duplicates
      if (!currentDates.includes(dateValue)) {
        dispatch(actions.updateArrayField('fechas', [...currentDates, dateValue]));
      }
    }
  };
  
  // Handle repetition weeks change
  const handleRepetitionChange = (weeks) => {
    dispatch(actions.setRepetitionWeeks(weeks));
    
    // Get the initial date from the form state
    const getState = () => {
      // This is a placeholder - you'll need to provide access to the current state
      // Perhaps through a custom hook or context
      return store.getState();
    };
    
    const initialDate = getState().formFields.fechaInicial;
    
    // Generate recurring dates if we have an initial date
    if (initialDate) {
      dispatch(actions.generateRecurringDates(initialDate, weeks));
    }
  };
  
  // Handle adding a custom date
  const handleAddCustomDate = (date) => {
    dispatch(actions.addDate(date, 'custom'));
  };
  
  // Handle removing a date
  const handleRemoveDate = (date) => {
    dispatch(actions.removeDate(date));
  };
  
  // Difficulty level handler
  const handleDificultadClick = (level) => {
    dispatch(actions.updateField('dificultad', level));
  };
  
  // Image upload handler
  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(actions.uploadImage(file, e.target.result));
      };
      reader.readAsDataURL(file);
    } else {
      dispatch(actions.uploadImage(null, '../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png'));
    }
  };
  
  // Guide selection toggle handler
  const handleSeleccionarGuia = (guia) => {
    dispatch(actions.toggleObjectItem('guiasSeleccionados', guia));
  };
  
  // Setter functions for compatibility with original API
  const setHorarioInicio = (value) => {
    dispatch(actions.updateField('horarioInicio', value));
  };
  
  const setHorarioFin = (value) => {
    dispatch(actions.updateField('horarioFin', value));
  };
  
  const setGuiasRequeridos = (value) => {
    dispatch(actions.updateField('guiasRequeridos', value));
  };
  
  const setMinimoUsuarios = (value) => {
    dispatch(actions.updateField('minimoUsuarios', value));
  };
  
  const setMaximoUsuarios = (value) => {
    dispatch(actions.updateField('maximoUsuarios', value));
  };
  
  return {
    handleNombreChange,
    handlePrecioChange,
    handleDescripcionChange,
    handleTimeChange,
    handlePuntoSalidaChange,
    handleLongitudChange,
    handleDuracionChange,
    handleIntegerInputChange,
    handleTipoActividadChange,
    handleIncluidosChange,
    handleDateChange,
    handleRepetitionChange,
    handleAddCustomDate,
    handleRemoveDate,
    handleDificultadClick,
    handleImageChange,
    handleSeleccionarGuia,
    // Setter functions for compatibility
    setHorarioInicio,
    setHorarioFin,
    setGuiasRequeridos,
    setMinimoUsuarios,
    setMaximoUsuarios,
  };
};

/**
 * Create configuration handlers with a dispatch function
 * @param {Function} dispatch - Reducer dispatch function
 * @param {Object} configData - Current configuration data
 * @returns {Object} Configuration handlers
 */
export const createConfigHandlers = (dispatch, configData) => {
  // (Rest of the original code remains unchanged)
  
  // Add new activity type handler
  const handleAgregarNuevoTipo = async (nuevoTipo) => {
    try {
      if (!nuevoTipo.trim()) {
        dispatch(actions.setErrors({ 
          ...configData.errors, 
          nuevoTipo: "Por favor, ingrese un tipo de actividad." 
        }));
        return false;
      }
      
      const updatedTipos = await experienceFormService.addActivityType(
        nuevoTipo, 
        configData.tiposActividad
      );
      
      dispatch(actions.setConfig('tiposActividad', updatedTipos));
      dispatch(actions.clearError('nuevoTipo'));
      
      return true;
    } catch (error) {
      dispatch(actions.setErrors({ 
        ...configData.errors,
        nuevoTipo: error.message
      }));
      return false;
    }
  };
  
  // Add new included item handler
  const handleAgregarNuevoIncluido = async (nuevoIncluido) => {
    try {
      if (!nuevoIncluido.trim()) {
        dispatch(actions.setErrors({ 
          ...configData.errors, 
          nuevoIncluido: "Por favor, ingrese un elemento a incluir." 
        }));
        return false;
      }
      
      const updatedIncluidos = await experienceFormService.addIncludedItem(
        nuevoIncluido, 
        configData.opcionesIncluidos
      );
      
      dispatch(actions.setConfig('opcionesIncluidos', updatedIncluidos));
      dispatch(actions.clearError('nuevoIncluido'));
      
      return true;
    } catch (error) {
      dispatch(actions.setErrors({
        ...configData.errors,
        nuevoIncluido: error.message
      }));
      return false;
    }
  };
  
  // Add new departure point handler
  const handleAgregarNuevoPuntoSalida = async (nuevoPunto) => {
    try {
      if (!nuevoPunto.trim()) {
        dispatch(actions.setErrors({ 
          ...configData.errors, 
          nuevoPunto: "Por favor, ingrese un punto de salida." 
        }));
        return false;
      }
      
      const updatedPuntos = await experienceFormService.addDeparturePoint(
        nuevoPunto, 
        configData.puntosSalida
      );
      
      dispatch(actions.setConfig('puntosSalida', updatedPuntos));
      dispatch(actions.clearError('nuevoPunto'));
      
      return true;
    } catch (error) {
      dispatch(actions.setErrors({
        ...configData.errors,
        nuevoPunto: error.message
      }));
      return false;
    }
  };
  
  return {
    handleAgregarNuevoTipo,
    handleAgregarNuevoIncluido,
    handleAgregarNuevoPuntoSalida
  };
};

/**
 * Create form operation handlers with a dispatch function
 * @param {Function} dispatch - Reducer dispatch function
 * @param {Object} formFields - Current form field values
 * @param {Function} getState - Function to get current state
 * @returns {Object} Form operation handlers
 */
export const createFormOperations = (dispatch, formFields, getState) => {
  // Form validation function
  const validateForm = () => {
    // Use getState to ensure we have the latest state
    const currentFormFields = getState ? getState().formFields : formFields;
    const validationResult = validateExperienceForm(currentFormFields);
    dispatch(actions.setErrors(validationResult.errors));
    return validationResult;
  };
  
  // Form submission handler
  const handleSubmit = async () => {
    dispatch(actions.setSubmitSuccess(false));
    dispatch(actions.setSubmitting(true));
    
    try {
      // Validate form
      const { isValid, errors } = validateForm();
      if (!isValid) {
        dispatch(actions.setSubmitting(false));
        return false;
      }
      
      // Get the latest form state
      const currentFormFields = getState ? getState().formFields : formFields;
      
      // Log the fields being submitted for debugging
      console.log("Submitting form with fields:", currentFormFields);
      
      // Ensure createdBy is set
      if (!currentFormFields.createdBy) {
        dispatch(actions.setErrors({ 
          submit: "Error: Missing creator information. Please try logging out and back in."
        }));
        dispatch(actions.setSubmitting(false));
        return false;
      }
      
      // Submit experience with the latest state
      await experienceFormService.submitExperience(currentFormFields);
      
      // Reset form
      dispatch(actions.resetForm());
      dispatch(actions.setSubmitSuccess(true));
      return true;
    } catch (error) {
      console.error("Error creating experience:", error);
      
      if (error.message && error.message.includes("nombre de la experiencia ya existe")) {
        dispatch(actions.setErrors({ nombre: error.message }));
      } else {
        dispatch(actions.setErrors({ 
          submit: error.message || "Error al crear la experiencia. Por favor, inténtelo de nuevo." 
        }));
      }
      
      return false;
    } finally {
      dispatch(actions.setSubmitting(false));
    }
  };
  
  // Form reset handler
  const resetForm = () => {
    dispatch(actions.resetForm());
  };

  // We also need to handle repetition change with access to current form state
  const handleRepetitionChange = (weeks) => {
    dispatch(actions.setRepetitionWeeks(weeks));
    
    // Get the current state to access the initial date
    if (getState) {
      const state = getState();
      const initialDate = state.formFields.fechaInicial;
      
      // Generate recurring dates if we have an initial date
      if (initialDate) {
        dispatch(actions.generateRecurringDates(initialDate, weeks));
      }
    }
  };
  
  return {
    validateForm,
    handleSubmit,
    resetForm,
    handleRepetitionChange,
    // These are included for API compatibility
    setHorarioInicio: (value) => dispatch(actions.updateField('horarioInicio', value)),
    setHorarioFin: (value) => dispatch(actions.updateField('horarioFin', value)),
  };
};